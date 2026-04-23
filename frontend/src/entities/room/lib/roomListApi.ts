import { apiFetch } from '@/shared/api/apiFetch'

export const roomListApi = async () => {
  const response = await apiFetch('/room/user')
  const result = await response.json()

  return result
}
