import { type Socket } from 'socket.io'
import {
  isValidMessageContent,
  isValidName,
  isValidRoomId,
} from '../validations/index.js'
import { type SocketCallback } from '../types/room.type.js'
import { type User } from '../../../domains/user/types/user.type.js'
import { roomService } from '../../../domains/room/services/room.service.js'
import { type Room } from '../../../domains/room/types/room.type.js'
import { messageService } from '../../../domains/message/services/message.service.js'
import { type Message } from '../../../domains/message/types/message.type.js'

export const roomHandler = (socket: Socket, userId: User['id']) => {
  socket.on(
    'create_room',
    async (payload: unknown, callback?: SocketCallback<Room>) => {
      try {
        if (!payload || typeof payload !== 'object' || !('name' in payload))
          throw new Error('Невалидные данные')

        const { name } = payload as { name: unknown }
        if (!isValidName(name)) throw new Error('Невалидные данные')

        const room = await roomService.create(name, userId)

        await socket.join(room.id)

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
    ) => {
      try {
        if (!payload || typeof payload !== 'object' || !('roomId' in payload))
          throw new Error('Невалидные данные')

        const { roomId } = payload as { roomId: unknown }
        if (!isValidRoomId(roomId)) throw new Error('Невалидные данные')

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
    'send_message',
    async (payload: unknown, callback?: SocketCallback) => {
      try {
        if (
          !payload ||
          typeof payload !== 'object' ||
          !('roomId' in payload) ||
          !('content' in payload)
        )
          throw new Error('Невалидные данные')

        const { roomId, content } = payload as {
          roomId: unknown
          content: unknown
        }
        if (!isValidRoomId(roomId) || !isValidMessageContent(content))
          throw new Error('Невалидные данные')

        if (!socket.rooms.has(roomId)) {
          throw new Error('Доступ запрещён: вы не состоите в этой комнате')
        }

        const message = await messageService.send(
          roomId,
          userId,
          content.trim()
        )

        socket.to(roomId).emit('new_message', message)

        return callback?.({ success: true })
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
    async (payload: unknown, callback?: SocketCallback) => {
      try {
        if (!payload || typeof payload !== 'object' || !('roomId' in payload))
          throw new Error('Невалидные данные')

        const { roomId } = payload as { roomId: unknown }
        if (!isValidRoomId(roomId)) throw new Error('Невалидные данные')

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
