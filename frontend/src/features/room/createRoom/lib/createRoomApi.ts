import { type Room } from '@/entities/room/types'
import { apiFetch } from '@/shared/api/apiFetch'
import { ROUTES } from '@/shared/config/routes'

export const createRoomApi = async (data: Record<'name', Room['name']>) => {
  const response = await apiFetch(ROUTES.createRoom, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const result = await response.json()

  return result
}
