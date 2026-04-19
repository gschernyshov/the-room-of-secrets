import { type User } from '@/entities/user/model/types'
import { type Message } from '@/entities/message/types'
import { type UUID } from '@/shared/types'

export type ParticipantStatus = 'active' | 'left' | 'kicked' | 'banned'

export type RoomParticipant = {
  userId: User['id']
  status: ParticipantStatus
}

export type Room = {
  id: UUID
  name: string
  participants: RoomParticipant[]
  createdAt: Date
}

export type JoinRoomRequest = {
  roomId: string
}
export type JoinRoomResponse = {
  room: Room
  messages: Message[]
  onlineUserIds: User['id'][]
}

export type LeaveRoomRequest = {
  roomId: string
}
export type LeaveRoomResponse = void

export type UserJoinedData = { userId: User['id']; timestamp: Date }
export type UserLeftData = { userId: User['id']; timestamp: Date }
