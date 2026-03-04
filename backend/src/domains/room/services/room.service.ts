import { ROOM_CREATED, ROOM_JOINED } from '../events/index.js'
import { roomRepository } from '../repositories/room.repository.js'
import { type Room } from '../types/room.type.js'
import { type User } from '../../user/types/user.type.js'
import { messageRepository } from '../../message/repositories/message.repository.js'
import { type Message } from '../../message/types/message.type.js'
import { eventBus } from '../../../infrastructure/events/eventBus.js'
import { logger } from '../../../shared/utils/logger.js'
import { AppError } from '../../../shared/utils/errors.js'

export const roomService = {
  create: async (name: Room['name'], creatorId: User['id']): Promise<Room> => {
    logger.info(`Создание комнаты "${name}" пользователем id: ${creatorId}`)

    try {
      const room = await roomRepository.create(name, creatorId)
      if (!room) {
        throw new AppError('Не удалось создать команту', 500)
      }

      eventBus.emit(ROOM_CREATED, room)

      return room
    } catch (error) {
      logger.error(
        `При создании комнаты "${name}" пользователем id: ${creatorId} возникла ошибка: ${error.message.toLowerCase()}`
      )

      if (error instanceof AppError) {
        throw error
      }

      throw new AppError(
        'При создании комнаты возникла непредвиденная ошибка',
        500
      )
    }
  },

  join: async (
    roomId: Room['id'],
    userId: User['id']
  ): Promise<{ room: Room; messages: Message[] }> => {
    logger.info(
      `Пользователь id: ${userId} присоединяется к комнате id: ${roomId}`
    )

    try {
      const room = await roomRepository.findById(roomId)
      if (!room) {
        throw new AppError('Комната не найдена', 401)
      }

      if (!room.participants.includes(userId)) {
        await roomRepository.join(roomId, [...room.participants, userId])
      }

      const messages = await messageRepository.get(roomId)

      eventBus.emit(ROOM_JOINED, { roomId, name: room.name, userId })

      return { room, messages }
    } catch (error) {
      logger.error(
        `При присоединении пользователя id: ${userId} к комнате id: ${roomId} возникла ошибка: ${error.message.toLowerCase()}`
      )

      if (error instanceof AppError) {
        throw error
      }

      throw new AppError(
        'При попытке присоединения к комнате возникла непредвиденная ошибка'
      )
    }
  },
}
