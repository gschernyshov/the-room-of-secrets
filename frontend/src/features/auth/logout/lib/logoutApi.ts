import { apiFetch } from '@/shared/api/apiFetch'
import { ROUTES } from '@/shared/config/routes'

export const logoutApi = async () => {
  const response = await apiFetch(ROUTES.logout, {
    method: 'POST',
    credentials: 'include',
  })

  const result = await response.json()

  return result
}
