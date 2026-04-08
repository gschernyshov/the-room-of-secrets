import { type User } from '@/entities/user/model/types'
import { type Message } from '@/entities/message/types'
import { type UUID } from '@/shared/types'

export type Room = {
  id: UUID
  name: string
  participants: User['id'][]
  createdAt: Date
}

export type CreateRoomRequest = {
  name: string
}
export type CreateRoomResponse = Room

export type JoinRoomRequest = {
  roomId: string
}
export type JoinRoomResponse = {
  room: Room
  messages: Message[]
}

export type LeaveRoomRequest = {
  roomId: string
}
export type LeaveRoomResponse = void

export type UserJoinedData = { userId: User['id']; timestamp: Date }
export type UserLeftData = { userId: User['id']; timestamp: Date }
