import { type ChangePasswordFormData } from './changePasswordSchema'
import { apiFetch } from '@/shared/api/apiFetch'
import { ROUTES } from '@/shared/config/routes'

export const changePasswordApi = async (data: ChangePasswordFormData) => {
  const response = await apiFetch(ROUTES.user.update('password'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const result = await response.json()

  return result
}
