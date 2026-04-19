import { type Room } from '../types/room.type.js'
import { type User } from '../../user/types/user.type.js'
import { db } from '../../../infrastructure/database/client.js'

class RoomRepository {
  async create(
    name: Room['name'],
    creatorId: User['id']
  ): Promise<Room | null> {
    const [room] = await db.query<Room>(
      `
        INSERT INTO rooms (name, participants)
        VALUES ($1, $2::jsonb)
        RETURNING id, name, participants, created_at AS "createdAt"
      `,
      [name, JSON.stringify([{ userId: creatorId, status: 'active' }])]
    )

    return room ?? null
  }

  async findById(roomId: Room['id']): Promise<Room | null> {
    const [room] = await db.query<Room>(
      `
        SELECT id, name, participants, created_at AS "createdAt" 
        FROM rooms
        WHERE id = $1
      `,
      [roomId]
    )

    return room ?? null
  }

  async join(roomId: Room['id'], userId: User['id']): Promise<void> {
    await db.query(
      `
        -- Добавляем участника в комнату, только если его ещё нет:
        -- Проверяем через NOT EXISTS, не существует ли уже элемент с таким userId в массиве participants
        -- Если пользователь уже есть — запрос ничего не делает (пропускаем UPDATE)
        -- Если нет — добавляем нового участника в формате JSONB с полями: userId и status
        -- Возвращаем обновлённый массив participants
        UPDATE rooms
        SET participants = participants || jsonb_build_array(
          jsonb_build_object('userId', $2::int, 'status', 'active')
        )
        WHERE id = $1
          AND NOT EXISTS (
            SELECT 1
            FROM jsonb_array_elements(participants) AS elem
            WHERE (elem->>'userId')::int = $2
          )
      `,
      [roomId, userId]
    )
  }

  async leave(
    roomId: Room['id'],
    userId: User['id']
  ): Promise<Pick<Room, 'participants'> | null> {
    const [room] = await db.query<Pick<Room, 'participants'>>(
      `
        -- Обновляем список участников комнаты:
        -- Меняем статус пользователя на "left", если он был "active"
        -- Используем подзапрос с jsonb_agg для пересборки массива participants
        
        UPDATE rooms
        SET participants = (
          -- Перебираем всех участников и обновляем статус только нужного
          SELECT COALESCE(jsonb_agg(
            CASE
              -- Если это целевой пользователь → меняем его статус на "left"
              WHEN (elem->>'userId')::int = $2 THEN
                jsonb_set(elem, '{status}', to_jsonb('left'::text))
              -- Остальных оставляем без изменений
              ELSE
                elem
            END
          ), '[]'::jsonb)  -- На случай пустого массива
          FROM jsonb_array_elements(participants) AS elem
        )
        WHERE id = $1
          AND EXISTS (
            -- Проверяем: пользователь должен быть в комнате
            -- и иметь статус "active" (чтобы не обновлять лишний раз)
            SELECT 1
            FROM jsonb_array_elements(participants) AS elem
            WHERE (elem->>'userId')::int = $2
              AND elem->>'status' = 'active'
          )
        RETURNING participants;  -- Возвращаем обновлённый список
      `,
      [roomId, userId]
    )

    return room ?? null
  }

  async delete(roomId: Room['id']): Promise<void> {
    await db.query(
      `
        DELETE 
        FROM rooms 
        WHERE id = $1
      `,
      [roomId]
    )
  }

  async getRoomsByUser(userId: User['id']): Promise<Room[] | null> {
    const rooms = await db.query<Room>(
      `
        SELECT r.* 
        FROM rooms r 
        JOIN users u 
        ON r.id = ANY(u.rooms) 
        WHERE u.id = $1
      `,
      [userId]
    )

    return rooms ?? null
  }
}

export const roomRepository = new RoomRepository()
