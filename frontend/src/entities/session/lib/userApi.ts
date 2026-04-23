import { apiFetch } from '@/shared/api/apiFetch'

export const userApi = async () => {
  const response = await apiFetch('/user/me')
  const result = await response.json()

  return result
}
