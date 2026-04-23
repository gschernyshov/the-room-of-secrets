import { type RegisterFormData } from './registerSchema'
import { apiFetch } from '@/shared/api/apiFetch'
import { ROUTES } from '@/shared/config/routes'

export const registerApi = async (data: RegisterFormData) => {
  const response = await apiFetch(ROUTES.register, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const result = await response.json()

  return result
}
