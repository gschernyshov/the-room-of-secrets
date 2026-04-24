import { apiFetch } from '@/shared/api/apiFetch'
import { ROUTES } from '@/shared/config/routes'

export const roomListApi = async () => {
  const response = await apiFetch(ROUTES.room.user)
  const result = await response.json()

  return result
}
