import { ROOM_JOINED } from '../events/index.js'
import { type Room } from '../types/room.type.js'
import { type User } from '../../user/types/user.type.js'
import { eventBus } from '../../../infrastructure/events/eventBus.js'
import { logger } from '../../../shared/utils/logger.js'

export const setupJoinedListener = () => {
  eventBus.on(
    ROOM_JOINED,
    (data: { roomId: Room['id']; name: Room['name']; userId: User['id'] }) => {
      const { roomId, name, userId } = data

      /* 
        EMAIL логика
      */

      logger.info(
        `Пользователь id: ${userId} успешно присоединился к команте "${name}" id: ${roomId}`
      )
    }
  )
}
