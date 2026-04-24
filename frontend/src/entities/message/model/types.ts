import { type User } from '@/entities/user/model/types'
import { type Room } from '@/entities/room/model/types'
import { type UUID } from '@/shared/types'

export type Message = {
  id: UUID
  roomId: Room['id']
  senderId: User['id']
  content: string
  timestamp: Date
}
