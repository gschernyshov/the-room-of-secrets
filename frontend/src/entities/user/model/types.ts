import { type Room } from '@/entities/room/types'

export type User = {
  id: number
  username: string
  email: string
  password: string
  rooms: Room['id'][]
  createdAt: Date
}
