import { UUID } from 'node:crypto'
import { User } from '../../user/types/user.type.js'

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
