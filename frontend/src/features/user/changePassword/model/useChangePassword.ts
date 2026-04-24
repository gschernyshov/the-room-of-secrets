import { type ChangePassword } from './schema'
import { changePasswordApi } from '../api/changePassword'
import { AppError } from '@/shared/utils/errors'

export const useChangePassword = () => {
  const handleChangePassword = async (data: ChangePassword) => {
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
