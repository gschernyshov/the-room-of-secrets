import { ROOM_CREATED, ROOM_JOINED } from '../events/index.js'
import { roomRepository } from '../repositories/room.repository.js'
import { type Room } from '../types/room.type.js'
import { type User } from '../../user/types/user.type.js'
import { eventBus } from '../../../infrastructure/events/eventBus.js'
import { logger } from '../../../shared/utils/logger.js'
import { AppError } from '../../../shared/utils/errors.js'

export const roomService = {
  create: async (name: Room['name'], creatorId: User['id']): Promise<Room> => {
    logger.info(`Создание комнаты "${name}" пользователем id: ${creatorId}`)

    try {
      const room = await roomRepository.create(name, creatorId)
      if (!room) {
        throw new AppError('Не удалось создать комнату', 500)
      }

      eventBus.emit(ROOM_CREATED, room)

      return room
    } catch (error) {
      logger.error(
        `При создании комнаты "${name}" пользователем id: ${creatorId} возникла ошибка${error instanceof Error ? `: ${error.message}` : ``}}`
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

  join: async (roomId: Room['id'], userId: User['id']): Promise<Room> => {
    logger.info(
      `Пользователь id: ${userId} присоединяется к комнате id: ${roomId}`
    )

    try {
      const room = await roomRepository.findById(roomId)
      if (!room) {
        throw new AppError('Комната не найдена', 401)
      }

      await roomRepository.join(roomId, userId)

      eventBus.emit(ROOM_JOINED, { roomId, name: room.name, userId })

      return room
    } catch (error) {
      logger.error(
        `При присоединении пользователя id: ${userId} к комнате id: ${roomId} возникла ошибка${error instanceof Error ? `: ${error.message}` : ``}}`
      )

      if (error instanceof AppError) {
        throw error
      }

      throw new AppError(
        'При присоединении к комнате возникла непредвиденная ошибка',
        500
      )
    }
  },

  leave: async (roomId: Room['id'], userId: User['id']): Promise<void> => {
    logger.info(`Пользователь id: ${userId} выходит из комнаты id: ${roomId}`)

    try {
      const rooms = await roomRepository.leave(roomId, userId)
      if (!rooms) {
        throw new AppError('Не удалось выйти из команты', 500)
      }

      // Проверяем, ушли ли ВСЕ участники из комнаты:
      // Если у каждого участника статус 'left', значит, комната пуста и ее можно удалить
      const deleted = rooms.participants.every(
        participant => participant.status === 'left'
      )

      if (deleted) await roomRepository.delete(roomId)
    } catch (error) {
      logger.error(
        `При выходе из комнаты id: ${roomId} пользователя id: ${userId} возникла ошибка${error instanceof Error ? `: ${error.message}` : ``}}`
      )

      if (error instanceof AppError) {
        throw error
      }

      throw new AppError(
        'При выходе из комнаты возникла непредвиденная ошибка',
        500
      )
    }
  },

  getRoomsByUser: async (userId: User['id']): Promise<Room[]> => {
    logger.info(`Получение комнат пользователя id: ${userId}`)

    try {
      const rooms = await roomRepository.getRoomsByUser(userId)
      if (!rooms) {
        throw new AppError('Не удалось найти комнаты', 404)
      }

      return rooms
    } catch (error) {
      logger.error(
        `При получении комнат пользователя id: ${userId} возникла ошибка${error instanceof Error ? `: ${error.message}` : ``}}`
      )

      if (error instanceof AppError) {
        throw error
      }

      throw new AppError(
        'При получении комнат возникла непредвиденная ошибка',
        500
      )
    }
  },
}
