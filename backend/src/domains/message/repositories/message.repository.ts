import { type Message } from '../types/message.type.js'
import { type Room } from '../../room/types/room.type.js'
import { db, type QueryParam } from '../../../infrastructure/database/client.js'
import { redis } from '../../../infrastructure/database/redis.client.js'
import { logger } from '../../../shared/utils/logger.js'

class MessageRepository {
  private static readonly ROOM_KEY = 'messages:room:'
  private static readonly ROOM_KEY_TTL = 6
  private static readonly BATCH_KEY = 'messages:batch'
  private static readonly MAX_ROOM_MESSAGES_COUNT = 200
  private static readonly BATCH_SIZE = 500
  private static readonly FLUSH_LOCK_KEY = 'lock:flushMessages'
  private static readonly FLUSH_LOCK_TIMEOUT = 30_000

  async add(message: Message): Promise<void> {
    const client = redis.getClient()
    const roomKey = `${MessageRepository.ROOM_KEY}:${message.roomId}`

    // Пишем в общий буфер (для flush)
    await client.lPush(MessageRepository.BATCH_KEY, JSON.stringify(message))

    // Пишем в буфер по комнате (для быстрого get)
    await client.lPush(roomKey, JSON.stringify(message))

    // Устанавливаем время жизни ключа roomKey — 6 секунд
    // Это означает, что весь список будет автоматически удалён через 6 секунд после последнего добавления сообщения
    await client.expire(roomKey, MessageRepository.ROOM_KEY_TTL)

    // Ограничиваем длину буфера по комнате, чтобы не накапливать сообщения бесконечно
    // Оставляем последние MessageRepository.MAX_ROOM_MESSAGES сообщений
    await client.lTrim(
      roomKey,
      0,
      MessageRepository.MAX_ROOM_MESSAGES_COUNT - 1
    )
  }

  async get(roomId: Room['id']): Promise<Message[]> {
    // Получаем последние MessageRepository.MAX_ROOM_MESSAGES сообщений из Redis-буфера для этой комнаты
    const rawRedisMessages = await redis
      .getClient()
      .lRange(
        `${MessageRepository.ROOM_KEY}:${roomId}`,
        0,
        MessageRepository.MAX_ROOM_MESSAGES_COUNT - 1
      )

    const redisMessages: Message[] = []
    // Парсим каждое сообщение из Redis
    for (const rawRedisMessage of rawRedisMessages) {
      try {
        const parsedRedisMessage = JSON.parse(rawRedisMessage)
        // Проверяем, что сообщение валидно:
        // все обязательные поля существуют и имеют определённый тип,
        // timestamp можно преобразовать в корректную дату
        if (
          parsedRedisMessage.id &&
          typeof parsedRedisMessage.id === 'string' &&
          parsedRedisMessage.roomId &&
          typeof parsedRedisMessage.roomId === 'string' &&
          parsedRedisMessage.senderId &&
          typeof parsedRedisMessage.senderId === 'number' &&
          Number.isInteger(parsedRedisMessage.senderId) &&
          parsedRedisMessage.content &&
          typeof parsedRedisMessage.content === 'string' &&
          parsedRedisMessage.timestamp &&
          !isNaN(new Date(parsedRedisMessage.timestamp).getTime())
        ) {
          // Создаём объект Message с правильным типом timestamp (Date)
          const msg: Message = {
            id: parsedRedisMessage.id,
            roomId: parsedRedisMessage.roomId,
            senderId: parsedRedisMessage.senderId,
            content: parsedRedisMessage.content,
            timestamp: new Date(parsedRedisMessage.timestamp),
          }
          redisMessages.push(msg)
        } else {
          logger.warning(
            `Некорректная структура сообщения в очереди Redis: ${rawRedisMessage}`
          )
        }
      } catch (_) {
        logger.warning(
          `Недопустимый JSON при обработке сообщения в очереди Redis: ${rawRedisMessage}`
        )
      }
    }

    // Получаем старые сообщения из базы данных (до 1000 шт.)
    const dbMessages = await db.query<Message>(
      `
      SELECT id, room_id AS "roomId", sender_id AS "senderId", content, timestamp
      FROM messages
      WHERE room_id = $1
      ORDER BY timestamp ASC
      LIMIT 1000
    `,
      [roomId]
    )

    // Объединяем сообщения из БД и из Redis
    const roomMessages = [...dbMessages, ...redisMessages]

    // Сортируем по возрастанию времени (от старых к новым)
    roomMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

    // Убираем дубли по id (оставляем первое вхождение)
    const seen = new Set<string>()
    const uniqueMessages: Message[] = []
    for (const msg of roomMessages) {
      if (!seen.has(msg.id)) {
        seen.add(msg.id)
        uniqueMessages.push(msg)
      }
    }

    // Возвращаем итоговый список сообщений
    return uniqueMessages
  }

  /**
   * Асинхронно сбрасывает сообщения из Redis-буфера в PostgreSQL
   * Выполняется пачками, с защитой от параллельного запуска и обработкой ошибок
   */
  async flush(): Promise<void> {
    const client = redis.getClient()

    // Устанавливаем распределённую блокировку (distributed lock)
    // Это предотвращает одновременный запуск flush() несколькими инстансами или таймерами
    const lockAcquired = await client.set(
      MessageRepository.FLUSH_LOCK_KEY,
      '1', // Значение не важно, ключ сам по себе — флаг блокировки
      {
        PX: MessageRepository.FLUSH_LOCK_TIMEOUT, // Если процесс упал, то блокировка самоуничтожится через MessageRepository.FLUSH_LOCK_TIMEOUT мс
        NX: true, // Устанавливаем ключ только, если его ещё нет (атомарная операция, NX = "Not eXists")
      }
    )

    // Если блокировку не удалось получить — значит, другой процесс уже работает
    if (!lockAcquired) {
      return // выходим без ошибки
    }

    try {
      // Читаем только пачку BATCH_SIZE * 3 сообщений за раз (защита от OOM)
      const rawMessages = await client.lRange(
        MessageRepository.BATCH_KEY,
        0,
        MessageRepository.BATCH_SIZE * 3 - 1
      )

      // Если очередь пуста — нечего сохранять
      if (rawMessages.length === 0) return

      const parsedMessages: Array<Message> = []

      // Парсим каждое сообщение из JSON
      for (const rawMessage of rawMessages) {
        try {
          const parsedMessage = JSON.parse(rawMessage)

          // Валидация структуры (как в get())
          if (
            parsedMessage.id &&
            typeof parsedMessage.id === 'string' &&
            parsedMessage.roomId &&
            typeof parsedMessage.roomId === 'string' &&
            parsedMessage.senderId &&
            typeof parsedMessage.senderId === 'number' &&
            Number.isInteger(parsedMessage.senderId) &&
            parsedMessage.content &&
            typeof parsedMessage.content === 'string' &&
            parsedMessage.timestamp &&
            !isNaN(new Date(parsedMessage.timestamp).getTime())
          ) {
            parsedMessages.push({
              id: parsedMessage.id,
              roomId: parsedMessage.roomId,
              senderId: parsedMessage.senderId,
              content: parsedMessage.content,
              timestamp: new Date(parsedMessage.timestamp),
            })
          } else {
            logger.warning(
              `Некорректная структура сообщения в очереди Redis: ${rawMessage}`
            )
          }
        } catch (_) {
          logger.warning(
            `Недопустимый JSON при сбросе сообщений в очереди Redis: ${rawMessage}`
          )
        }
      }

      // Если все сообщения невалидны, то удаляем их из очереди
      if (parsedMessages.length === 0) {
        await client.lTrim(MessageRepository.BATCH_KEY, rawMessages.length, -1) // Оставляем элементы в диапазоне индексов от rawMessages.length до последнего (-1)
        return
      }

      // Вставляем сообщения в БД пачками (чтобы не перегружать PostgreSQL)
      for (
        let i = 0;
        i < parsedMessages.length;
        i += MessageRepository.BATCH_SIZE
      ) {
        const dbBatch = parsedMessages.slice(
          i,
          i + MessageRepository.BATCH_SIZE
        )
        const values: string[] = [] // шаблоны параметров: ($1, $2, ...)
        const params: QueryParam[] = [] // сами значения

        // Формируем параметризованный SQL-запрос для пачки
        dbBatch.forEach((msg, idx) => {
          const offset = idx * 5 // каждый msg даёт 5 параметров

          // Добавляем шаблон значений: ($1, $2, $3, $4, $5), ($6, $7, ...)
          values.push(
            `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5})`
          )

          // Добавляем значения в правильном порядке
          params.push(
            msg.id,
            msg.roomId,
            msg.senderId,
            msg.content,
            msg.timestamp
          )
        })

        // Готовим SQL-запрос: вставка с игнорированием дублей по id
        const query = `
          INSERT INTO messages (id, room_id, sender_id, content, timestamp)
          VALUES ${values.join(', ')}
          ON CONFLICT (id) DO NOTHING
        `

        try {
          await db.query(query, params)
        } catch (error) {
          // Если ошибка при вставке — пробрасываем её
          // Это остановит выполнение и предотвратит удаление сообщений из Redis
          logger.error(
            `Ошибка при вставке пакета из ${dbBatch.length} сообщений: ${error.message}`
          )
          throw error // Прерываем, чтобы не удалять из очереди
        }
      }

      // Успешно сохранили все валидные сообщения
      // Удаляем из очереди первые n элементов, где n - количество успешно распарсенных сообщений (битые сообщения оставляем в очереди)
      await client.lTrim(MessageRepository.BATCH_KEY, parsedMessages.length, -1)
    } catch (error) {
      // Пробрасываем ошибку дальше
      throw error
    } finally {
      // В любом случае удаляем блокировку, чтобы следующий flush мог начаться
      await client.del(MessageRepository.FLUSH_LOCK_KEY)
    }
  }
}

export const messageRepository = new MessageRepository()
