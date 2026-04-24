import { type Room } from '../model/types'
import { type User } from '@/entities/user/model/types'
import { type Message } from '@/entities/message/model/types'

export type JoinRoomRequest = {
  roomId: string
}
export type JoinRoomResponse = {
  room: Room
  messages: Message[]
  onlineUserIds: User['id'][]
}

export type ExitRoomRequest = {
  roomId: string
}
export type ExitRoomResponse = void

export type UserJoinedData = { userId: User['id']; timestamp: Date }
export type UserLeftData = { userId: User['id']; timestamp: Date }
