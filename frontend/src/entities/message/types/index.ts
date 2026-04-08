import { type User } from '@/entities/user/model/types'
import { type Room } from '@/entities/room/types'
import { type UUID } from '@/shared/types'

export type Message = {
  id: UUID
  roomId: Room['id']
  senderId: User['id']
  content: string
  timestamp: Date
}

export type sendMessageRequest = {
  roomId: Room['id']
  content: Message['content']
}
export type sendMessageResponse = void

export type NewMessageData = Message
