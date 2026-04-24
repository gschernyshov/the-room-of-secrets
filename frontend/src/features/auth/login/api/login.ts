import { type LoginData } from '../model/schema'
import { apiFetch } from '@/shared/api/apiFetch'
import { ROUTES } from '@/shared/config/routes'

export const loginApi = async (data: LoginData) => {
  const response = await apiFetch(ROUTES.login, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const result = await response.json()

  return result
}
