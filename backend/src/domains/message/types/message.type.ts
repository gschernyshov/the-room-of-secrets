import { UUID } from 'crypto'
import { User } from '../../user/types/user.type.js'
import { Room } from '../../room/types/room.type.js'

export type Message = {
  id: UUID
  roomId: Room['id']
  senderId: User['id']
  content: string
  timestamp: Date
}
