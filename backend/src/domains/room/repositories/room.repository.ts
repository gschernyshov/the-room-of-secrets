import { Room } from '../types/room.type.js'
import { User } from '../../user/types/user.type.js'
import { db } from '../../../infrastructure/database/client.js'

class RoomRepository {
  async create(
    name: Room['name'],
    creatorId: User['id']
  ): Promise<Room | null> {
    const [room] = await db.query<Room>(
      `
        INSERT INTO rooms (name, participants)
        VALUES ($1, $2)
        RETURNING id, name, participants, created_at AS createdAt
        `,
      [name, [creatorId]]
    )

    return room ?? null
  }

  async findById(roomId: Room['id']): Promise<Room | null> {
    const [room] = await db.query<Room>(
      'SELECT id, name, participants, created_at AS createdAt FROM rooms WHERE id = $1',
      [roomId]
    )

    return room ?? null
  }

  async join(roomId: Room['id'], participants: User['id'][]): Promise<void> {
    await db.query<Room>('UPDATE rooms SET participants = $1 WHERE id = $2', [
      participants,
      roomId,
    ])
  }
}

export const roomRepository = new RoomRepository()
