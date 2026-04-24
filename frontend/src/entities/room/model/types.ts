import { type User } from '@/entities/user/model/types'
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
