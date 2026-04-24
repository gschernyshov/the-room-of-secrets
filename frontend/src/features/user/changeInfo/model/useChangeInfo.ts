import { type ChangeInfo, type FieldKey } from './schema'
import { changeInfoApi } from '../api/changeInfo'
import { useSessionStore } from '@/entities/session/model/sessionStore'
import { AppError } from '@/shared/utils/errors'

export const useChangeInfo = () => {
  const { user, updateUser } = useSessionStore()

  const handleChangeInfo = async (nameField: FieldKey, data: ChangeInfo) => {
    const currentValue = user?.[nameField]
    const newValue = data[nameField]

    if (currentValue === newValue) return

    updateUser({ [nameField]: newValue })

    try {
      const result = await changeInfoApi(nameField, data)

      if (result.success) {
        return
      } else {
        throw new AppError(
          `При обновлении ${nameField} возникла непредвиденная ошибка`,
          result.error.message
        )
      }
    } catch (error) {
      updateUser({ [nameField]: currentValue })

      if (error instanceof AppError) throw error

      throw new AppError(
        `При обновлении ${nameField} возникла непредвиденная ошибка`
      )
    }
  }

  return { handleChangeInfo }
}
