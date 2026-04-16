import { useSessionStore } from '@/entities/session/model/sessionStore'
import { type ChangeInfoFormData, type FieldKey } from './cnangeInfoSchema'
import { apiFetch } from '@/shared/api/apiFetch'
import { AppError } from '@/shared/utils/errors'

export const useChangeInfo = () => {
  const { user, updateUser } = useSessionStore()

  const handleChangeInfo = async (
    nameField: FieldKey,
    data: ChangeInfoFormData
  ) => {
    const currentValue = user?.[nameField]
    const newValue = data[nameField]

    if (currentValue === newValue) return

    updateUser({ [nameField]: newValue })

    try {
      const response = await apiFetch(`/user/update/${nameField}`, {
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
