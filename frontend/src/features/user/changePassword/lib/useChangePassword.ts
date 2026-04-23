import { changePasswordApi } from './changePasswordApi'
import { type ChangePasswordFormData } from './changePasswordSchema'
import { AppError } from '@/shared/utils/errors'

export const useChangePassword = () => {
  const handleChangePassword = async (data: ChangePasswordFormData) => {
    try {
      const result = await changePasswordApi(data)

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
