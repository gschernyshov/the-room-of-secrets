import { type ChangePasswordFormData } from './changePasswordSchema'
import { apiFetch } from '@/shared/api/apiFetch'
import { AppError } from '@/shared/utils/errors'

export const useChangePassword = () => {
  const handleChangePassword = async (data: ChangePasswordFormData) => {
    try {
      const response = await apiFetch(`/user/update/password`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        return
      } else {
        throw new AppError(
          'При обновлении пароля возникла непредвиденная ошибка',
          result.error.message
        )
      }
    } catch (error) {
      if (error instanceof AppError) throw error

      throw new AppError('При обновлении пароля возникла непредвиденная ошибка')
    }
  }

  return { handleChangePassword }
}
