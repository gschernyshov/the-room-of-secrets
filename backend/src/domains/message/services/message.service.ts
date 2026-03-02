import { messageRepository } from '../repositories/message.repository.js'
import { Message } from '../types/message.type.js'
import { User } from '../../user/types/user.type.js'
import { Room } from '../../room/types/room.type.js'
import { AppError } from '../../../shared/utils/errors.js'
import { randomUUID } from 'crypto'

export const messageService = {
  send: async (
    roomId: Room['id'],
    senderId: User['id'],
    content: Message['content']
  ): Promise<Message> => {
    try {
      const message: Message = {
        id: randomUUID(),
        roomId,
        senderId,
        content,
        timestamp: new Date(),
      }

      await messageRepository.add(message)

      return message
    } catch (error) {
      throw new AppError(
        'При отправке сообщения возникла непредвиденная ошибка',
        500
      )
    }
  },
}
