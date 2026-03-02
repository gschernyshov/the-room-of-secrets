import { type Room } from '../../../domains/room/types/room.type.js'

export const isValidName = (name: unknown): name is Room['name'] =>
  typeof name === 'string' &&
  name.trim().length >= 2 &&
  name.trim().length <= 50
