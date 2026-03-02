import { type Message } from '../types/message.type.js'
import { type Room } from '../../room/types/room.type.js'
import { db, type QueryParam } from '../../../infrastructure/database/client.js'
import { redis } from '../../../infrastructure/database/redis.client.js'
import { logger } from '../../../shared/utils/logger.js'

class MessageRepository {
  private static readonly CHANNEL = 'messages:batch'
  private static readonly FLUSH_LOCK_KEY = 'lock:flushMessages'
  private static readonly FLUSH_LOCK_TIMEOUT = 30_000
  private static readonly BATCH_SIZE = 500

  async add(message: Message): Promise<void> {
    await redis
      .getClient()
      .lPush(MessageRepository.CHANNEL, JSON.stringify(message))
  }

  async get(roomId: Room['id']): Promise<Message[]> {
    const messages = await db.query<Message>(
      `
        SELECT id, room_id AS roomId, sender_id AS senderId, content, timestamp
        FROM messages
        WHERE room_id = $1
        ORDER BY timestamp ASC
        LIMIT 100
        `,
      [roomId]
    )

    return messages
  }

  async flush(): Promise<void> {
    const client = redis.getClient()

    const lockAcquired = await client.set(
      MessageRepository.FLUSH_LOCK_KEY,
      '1',
      {
        PX: MessageRepository.FLUSH_LOCK_TIMEOUT, // Если процесс упал, то блокировка самоуничтожится через n милисек.
        NX: true, // Устанавливаем ключ только если его ещё нет (NX = "Not eXists")
      }
    )

    if (!lockAcquired) {
      return
    }

    try {
      // Читаем только BATCH_SIZE * 3 сообщений за раз (защита от OOM)
      const rawMessages = await client.lRange(
        MessageRepository.CHANNEL,
        0,
        MessageRepository.BATCH_SIZE * 3 - 1
      )
      if (rawMessages.length === 0) return

      const parsedMessages: Array<Message> = []
      for (const rawMessage of rawMessages) {
        try {
          const parsedMessage = JSON.parse(rawMessage)
          parsedMessages.push(parsedMessage)
        } catch (_) {
          logger.warning(`Недопустимый JSON в очереди Redis: ${rawMessage}`)
        }
      }

      if (parsedMessages.length === 0) {
        // Если все сообщения невалидны, то удаляем их из очереди
        await client.lTrim(MessageRepository.CHANNEL, rawMessages.length, -1) // Оставляем элементы в диапазоне индексов от rawMessages.length до последнего (-1)
        return
      }

      for (
        let i = 0;
        i < parsedMessages.length;
        i += MessageRepository.BATCH_SIZE
      ) {
        const dbBatch = parsedMessages.slice(
          i,
          i + MessageRepository.BATCH_SIZE
        )
        const values: string[] = []
        const params: QueryParam[] = []

        dbBatch.forEach((msg, idx) => {
          const offset = idx * 5

          values.push(
            `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5})`
          )

          params.push(
            msg.id,
            msg.roomId,
            msg.senderId,
            msg.content,
            msg.timestamp
          )
        })

        const query = `
          INSERT INTO messages (id, room_id, sender_id, content, timestamp)
          VALUES ${values.join(', ')}
          ON CONFLICT (id) DO NOTHING
        `

        try {
          await db.query(query, params)
        } catch (error) {
          logger.error(
            `Ошибка при вставке пакета из ${dbBatch.length} сообщений: ${error.message}`
          )
          throw error // Прерываем, чтобы не удалять из очереди
        }
      }

      // Удаляем из очереди первые n элементов, где n - количество успешно распарсенных сообщений (битые сообщения оставляем в очереди)
      await client.lTrim(MessageRepository.CHANNEL, parsedMessages.length, -1)
    } catch (error) {
      throw error
    } finally {
      await client.del(MessageRepository.FLUSH_LOCK_KEY)
    }
  }
}

export const messageRepository = new MessageRepository()
