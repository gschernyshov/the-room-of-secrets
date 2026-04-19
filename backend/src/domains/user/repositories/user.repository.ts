import { type User } from '../types/user.type.js'
import { type Room } from '../../room/types/room.type.js'
import { db } from '../../../infrastructure/database/index.js'

class UserRepository {
  private static readonly userSelect = `
    id,
    username,
    email,
    password,
    role,
    status,
    rooms,
    created_at AS createdAt
  `
  async create(
    username: User['username'],
    email: User['email'],
    hashedPassword: User['password']
  ): Promise<User | null> {
    const [user] = await db.query<User>(
      `
        INSERT INTO users (username, email, password)
        VALUES ($1, $2, $3) 
        RETURNING ${UserRepository.userSelect}
      `,
      [username, email, hashedPassword]
    )

    return user ?? null
  }

  async findById(id: User['id']): Promise<User | null> {
    const [user] = await db.query<User>(
      `
        SELECT ${UserRepository.userSelect} 
        FROM users 
        WHERE id = $1
      `,
      [id]
    )

    return user ?? null
  }

  async findByEmail(email: User['email']): Promise<User | null> {
    const [user] = await db.query<User>(
      `
        SELECT ${UserRepository.userSelect} 
        FROM users 
        WHERE email = $1
      `,
      [email]
    )

    return user ?? null
  }

  async findByEmailOrUsername(
    email: User['email'],
    username: User['username']
  ): Promise<User | null> {
    const [user] = await db.query<User>(
      `
        SELECT ${UserRepository.userSelect} 
        FROM users 
        WHERE email=$1 OR username=$2
      `,
      [email, username]
    )
    return user ?? null
  }

  async updateUsername(
    id: User['id'],
    username: User['username']
  ): Promise<void> {
    await db.query(
      `
        UPDATE users 
        SET username = $1 
        WHERE id = $2
      `,
      [username, id]
    )
  }

  async updateEmail(id: User['id'], email: User['email']): Promise<void> {
    await db.query(
      `
        UPDATE users 
        SET email = $1 
        WHERE id = $2
      `,
      [email, id]
    )
  }

  async updatePassword(
    id: User['id'],
    password: User['password']
  ): Promise<void> {
    await db.query(
      `
        UPDATE users 
        SET password = $1
        WHERE id = $2
      `,
      [password, id]
    )
  }

  async addRoom(id: User['id'], roomId: Room['id']): Promise<void> {
    await db.query(
      `
        -- Обновляем массив комнат пользователя:
        -- array_append(rooms, $1) — добавляет новую комнату ($1 = roomId) к существующему массиву rooms
        -- Условие WHERE: 
        --   id = $2 — применяем только к пользователю с указанным ID ($2 = userId)
        --   AND NOT $1 = ANY(rooms) — проверяем, что комната (roomId) ещё не находится в массиве rooms,
        --   т.е. обновление произойдёт ТОЛЬКО если такой комнаты у пользователя ещё нет
        -- Это предотвращает дублирование комнат в списке
        UPDATE users 
        SET rooms = array_append(rooms, $1) 
        WHERE id = $2 
          AND NOT $1 = ANY(rooms)
      `,
      [roomId, id]
    )
  }

  async deleteRoom(id: User['id'], roomId: Room['id']): Promise<void> {
    await db.query(
      `
        -- Удаляем указанную комнату из массива rooms пользователя:
        -- array_remove(rooms, $1) — удаляет все вхождения значения $1 (roomId) из массива rooms
        -- WHERE id = $2 — применяем только к пользователю с заданным ID (userId)
        -- Если комната отсутствует в массиве — запрос ничего не изменит (без ошибок)
        UPDATE users 
        SET rooms = array_remove(rooms, $1) 
        WHERE id = $2
      `,
      [roomId, id]
    )
  }
}

export const userRepository = new UserRepository()
