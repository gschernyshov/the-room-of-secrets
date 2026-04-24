import { type Room } from '@/entities/room/model/types'
import { apiFetch } from '@/shared/api/apiFetch'
import { ROUTES } from '@/shared/config/routes'

export const leaveRoomApi = async (data: Record<'id', Room['id']>) => {
  const response = await apiFetch(ROUTES.leaveRoom, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const result = await response.json()

  return result
}
