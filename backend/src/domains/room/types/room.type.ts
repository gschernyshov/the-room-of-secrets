import { UUID } from 'node:crypto'
import { User } from '../../user/types/user.type.js'

export type Room = {
  id: UUID
  name: string
  participants: User['id'][]
  createdAt: Date
}
