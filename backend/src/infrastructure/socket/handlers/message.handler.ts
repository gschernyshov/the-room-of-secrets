import { type Socket } from 'socket.io'
import { type SocketCallback } from '../types/socket.type..js'
import { type User } from '../../../domains/user/types/user.type.js'
import { isValidRoomId } from '../../../domains/room/validations/roomId.validation.js'
import { messageService } from '../../../domains/message/services/message.service.js'
import { isValidMessageContent } from '../../../domains/message/validations/messageContent.validation.js'
import { AppError } from '../../../shared/utils/errors.js'

export const messageHandler = (socket: Socket, userId: User['id']) => {
  socket.on(
    'send_message',
    async (
      payload: unknown,
      callback?: SocketCallback
    ): Promise<void | undefined> => {
      try {
        if (
          !payload ||
          typeof payload !== 'object' ||
          !('roomId' in payload) ||
          !('content' in payload)
        )
          throw new AppError('Невалидные данные', 400)

        const { roomId, content } = payload as {
          roomId: unknown
          content: unknown
        }
        if (!isValidRoomId(roomId) || !isValidMessageContent(content))
          throw new AppError('Невалидные данные', 400)

        if (!socket.rooms.has(roomId)) {
          throw new AppError(
            'Доступ запрещён: вы не состоите в этой комнате',
            401
          )
        }

        const message = await messageService.send(roomId, userId, content)

        socket.nsp.to(roomId).emit('new_message', message)

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
