import { ROOM_CREATED } from '../events/index.js'
import { type Room } from '../types/room.type.js'
import { eventBus } from '../../../infrastructure/events/eventBus.js'
import { logger } from '../../../shared/utils/logger.js'

export const setupCreatedListener = () => {
  eventBus.on(ROOM_CREATED, (room: Room) => {
    const { id, name, participants, createdAt } = room

    /*
      EMAIL логика
    */

    logger.info(
      `Пользователь id: ${participants[0]} успешно создал команту "${name}" id: ${id}`
    )
  })
}
