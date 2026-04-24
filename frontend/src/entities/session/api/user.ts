import { apiFetch } from '@/shared/api/apiFetch'
import { ROUTES } from '@/shared/config/routes'

export const userApi = async () => {
  const response = await apiFetch(ROUTES.user.me)
  const result = await response.json()

  return result
}
