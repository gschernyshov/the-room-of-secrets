import { type Socket } from 'socket.io'
import { type SocketCallback } from '../types/socket.type..js'
import { type User } from '../../../domains/user/types/user.type.js'
import { roomService } from '../../../domains/room/services/room.service.js'
import { isValidRoomId } from '../../../domains/room/validations/roomId.validation.js'
import { type Room } from '../../../domains/room/types/room.type.js'
import { isValidName } from '../../../domains/room/validations/name.validation.js'
import { type Message } from '../../../domains/message/types/message.type.js'
import { AppError } from '../../../shared/utils/errors.js'

export const roomHandler = (socket: Socket, userId: User['id']) => {
  socket.on(
    'create_room',
    async (
      payload: unknown,
      callback?: SocketCallback<Room>
    ): Promise<void | undefined> => {
      try {
        if (!payload || typeof payload !== 'object' || !('name' in payload))
          throw new AppError('Невалидные данные', 400)

        const { name } = payload as { name: unknown }
        if (!isValidName(name)) throw new AppError('Невалидные данные', 400)

        const room = await roomService.create(name, userId)

        return callback?.({ success: true, data: room })
      } catch (error) {
        return callback?.({ success: false, error: { message: error.message } })
      }
    }
  )

  socket.on(
    'join_room',
    async (
      payload: unknown,
      callback?: SocketCallback<{
        room: Room
        messages: Array<Message>
      }>
    ): Promise<void | undefined> => {
      try {
        if (!payload || typeof payload !== 'object' || !('roomId' in payload))
          throw new AppError('Невалидные данные', 400)

        const { roomId } = payload as { roomId: unknown }
        if (!isValidRoomId(roomId)) throw new AppError('Невалидные данные', 400)

        const { room, messages } = await roomService.join(roomId, userId)

        await socket.join(roomId)

        socket.to(roomId).emit('user_joined', {
          userId,
          timestamp: new Date().toISOString(),
        })

        return callback?.({ success: true, data: { room, messages } })
      } catch (error) {
        return callback?.({
          success: false,
          error: { message: error.message },
        })
      }
    }
  )

  socket.on(
    'leave_room',
    async (
      payload: unknown,
      callback?: SocketCallback
    ): Promise<void | undefined> => {
      try {
        if (!payload || typeof payload !== 'object' || !('roomId' in payload))
          throw new AppError('Невалидные данные', 400)

        const { roomId } = payload as { roomId: unknown }
        if (!isValidRoomId(roomId)) throw new AppError('Невалидные данные', 400)

        await socket.leave(roomId)

        socket.to(roomId).emit('user_left', {
          userId,
          timestamp: new Date().toISOString(),
        })

        return callback?.({ success: true })
      } catch (error) {
        return callback?.({
          success: false,
          error: { message: error.message },
        })
      }
    }
  )
}
