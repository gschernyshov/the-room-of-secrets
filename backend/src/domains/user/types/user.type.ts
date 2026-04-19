import { type Room } from '../../room/types/room.type.js'

export type Role = 'user' | 'admin'

export type Status = 'active' | 'blocked' | 'deleted'

export type User = {
  id: number
  username: string
  email: string
  password: string
  role: Role
  status: Status
  rooms: Room['id'][]
  createdAt: Date
}
