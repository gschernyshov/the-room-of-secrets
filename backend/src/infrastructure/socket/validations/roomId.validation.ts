import { type Room } from '../../../domains/room/types/room.type.js'

export const isValidRoomId = (id: unknown): id is Room['id'] =>
  typeof id === 'string' && id.trim().length > 0
