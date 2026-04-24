import { type Message } from '../model/types'
import { type Room } from '@/entities/room/model/types'

export type sendMessageRequest = {
  roomId: Room['id']
  content: Message['content']
}
export type sendMessageResponse = void

export type NewMessageData = Message
