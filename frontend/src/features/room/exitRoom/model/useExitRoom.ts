import { exitRoom } from './exitRoom'
import { type Room } from '@/entities/room/model/types'

export const useExitRoom = () => {
  const exit = async (id: Room['id']) => {
    try {
      await exitRoom(id)
    } catch {
      /* empty */
    }
  }

  return {
    exit,
  }
}
