import { type Server, type Socket } from 'socket.io'
import { type SocketCallback } from '../types/socket.type..js'
import { userService } from '../../../domains/user/services/user.service.js'
import { type User } from '../../../domains/user/types/user.type.js'
import { roomService } from '../../../domains/room/services/room.service.js'
import { isValidRoomId } from '../../../domains/room/validations/roomId.validation.js'
import { type Room } from '../../../domains/room/types/room.type.js'
import { messageService } from '../../../domains/message/services/message.service.js'
import { type Message } from '../../../domains/message/types/message.type.js'
import { logger } from '../../../shared/utils/logger.js'
import { AppError } from '../../../shared/utils/errors.js'

const userRooms = new Map<number, Set<Room['id']>>()

export const roomHandler = (io: Server, socket: Socket, userId: User['id']) => {
  socket.on(
    'join_room',
    async (
      payload: unknown,
      callback?: SocketCallback<{
        room: Room
        messages: Array<Message>
        onlineUserIds: Array<User['id']>
      }>
    ): Promise<void> => {
      try {
        // Валидация входных данных
        if (!payload || typeof payload !== 'object' || !('roomId' in payload))
          throw new AppError('Невалидные данные', 400)

        const { roomId } = payload as { roomId: unknown }
        if (!isValidRoomId(roomId)) throw new AppError('Невалидные данные', 400)

        const room = await roomService.join(roomId, userId)
        const messages = await messageService.get(roomId)

        await userService.addRoom(userId, roomId)

        // Получаем все активные сокеты (подключения), присоединённые к комнате roomId
        const roomSockets = await io.in(roomId).fetchSockets()

        // Получаем список userId онлайн-участников комнаты
        const onlineUserIds = roomSockets
          // Преобразуем массив сокетов в массив userId участников
          .map(roomSocket => roomSocket.data.user.id)
          // Исключаем текущего пользователя
          .filter(id => id !== userId)

        // Присоединяем текущий сокет к комнате с указанным roomId
        await socket.join(roomId)

        // Инициализируем пустой набор комнат для пользователя в userRooms,
        // если такой пользователь ещё не отслеживается
        // Нужно, чтобы отслеживать, в каких комнатах находится пользователь
        if (!userRooms.has(userId)) {
          userRooms.set(userId, new Set())
        }
        // Добавляем текущую комнату roomId в список активных комнат пользователя
        // Используется при 'disconnect', потому что к тому моменту socket.rooms уже пуст, т. к.
        // Socket.IO автоматически удаляет сокет из комнат до вызова обработчика
        userRooms.get(userId)!.add(roomId)

        // Отправляем событие 'user_joined' всем в комнате, кроме владельца этого socket
        socket.to(roomId).emit('user_joined', {
          userId,
          timestamp: new Date().toISOString(),
        })

        return callback?.({
          success: true,
          data: { room, messages, onlineUserIds },
        })
      } catch (error) {
        logger.error(
          `При присоединении пользователя к комнате возникла ошибка${error instanceof Error ? `: ${error.message}` : ``}`
        )

        if (error instanceof AppError)
          return callback?.({
            success: false,
            error: { message: error.message },
          })

        return callback?.({
          success: false,
          error: {
            message:
              'При присоединении к комнате возникла непредвиденная ошибка',
          },
        })
      }
    }
  )

  socket.on(
    'exit_room',
    async (payload: unknown, callback?: SocketCallback): Promise<void> => {
      try {
        // Валидация входных данных
        if (!payload || typeof payload !== 'object' || !('roomId' in payload))
          throw new AppError('Невалидные данные', 400)

        const { roomId } = payload as { roomId: unknown }
        if (!isValidRoomId(roomId)) throw new AppError('Невалидные данные', 400)

        logger.info(
          `Пользователь id: ${userId} выходит из комнаты id: ${roomId}`
        )

        // Покидаем комнату в Socket.IO
        await socket.leave(roomId)

        // Удаляем комнату из списка активных комнат пользователя,
        // чтобы при 'disconnect' не отправить лишнее событие 'user_left'
        userRooms.get(userId)?.delete(roomId)

        // Уведомляем остальных участников комнаты о выходе пользователя
        socket.to(roomId).emit('user_left', {
          userId,
          timestamp: new Date().toISOString(),
        })

        return callback?.({ success: true })
      } catch (error) {
        logger.error(
          `При выходе пользователя из комнаты возникла ошибка${error instanceof Error ? `: ${error.message}` : ``}`
        )

        if (error instanceof AppError)
          return callback?.({
            success: false,
            error: { message: error.message },
          })

        return callback?.({
          success: false,
          error: {
            message: 'При выходе из комнаты возникла непредвиденная ошибка',
          },
        })
      }
    }
  )

  socket.on('disconnect', reason => {
    logger.info(
      `Пользователь id: ${userId} отключился. Причина: ${reason}. Cокет id: ${socket.id}`
    )

    // Получаем список комнат, в которых был пользователь
    // (хранится в памяти, потому что socket.rooms уже пуст, т. к.
    // Socket.IO автоматически удаляет сокет из всех комнат до вызова этого обработчика)
    const userRoomIds = userRooms.get(userId)

    if (userRoomIds && userRoomIds.size > 0) {
      // Уведомляем остальных участников в каждой комнате о выходе пользователя
      for (const roomId of userRoomIds) {
        socket.to(roomId).emit('user_left', {
          userId,
          timestamp: new Date().toISOString(),
        })
      }

      // Очищаем запись, так как пользователь больше не отслеживается
      userRooms.delete(userId)
    }
  })
}
