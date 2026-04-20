import { randomUUID } from 'crypto'
import { messageRepository } from '../repositories/message.repository.js'
import { type Message } from '../types/message.type.js'
import { type User } from '../../user/types/user.type.js'
import { type Room } from '../../room/types/room.type.js'
import { logger } from '../../../shared/utils/logger.js'
import { AppError } from '../../../shared/utils/errors.js'

export const messageService = {
  get: async (roomId: Room['id']): Promise<Message[]> => {
    logger.info(`Получение сообщений комнаты id: ${roomId}`)

    try {
      const messages = await messageRepository.get(roomId)

      return messages
    } catch (error) {
      logger.error(
        `При получении сообщений комнаты id: ${roomId} возникла ошибка${error instanceof Error ? `: ${error.message}` : ``}`
      )

      throw new AppError(
        'При получении сообщений возникла непредвиденная ошибка',
        500
      )
    }
  },

  send: async (
    roomId: Room['id'],
    senderId: User['id'],
    content: Message['content']
  ): Promise<Message> => {
    logger.info(
      `Пользователь id: ${senderId} отправляет сообщение: ${content} в комнате id: ${roomId}`
    )

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
      logger.error(
        `При отправке сообщения: ${content} пользователем id: ${senderId} в комнате id: ${roomId} возникла ошибка:${error instanceof Error ? `: ${error.message}` : ``}`
      )

      throw new AppError(
        'При отправке сообщения возникла непредвиденная ошибка',
        500
      )
    }
  },

  deleteByRoomId: async (roomId: Room['id']): Promise<void> => {
    logger.info(`Удаление сообщений комнаты id: ${roomId}`)

    try {
      await messageRepository.deleteByRoomId(roomId)
    } catch (error) {
      logger.error(
        `При удалении сообщений комнаты id: ${roomId} возникла ошибка:${error instanceof Error ? `: ${error.message}` : ``}`
      )

      throw new AppError(
        'При удалении сообщений возникла непредвиденная ошибка',
        500
      )
    }
  },
}
