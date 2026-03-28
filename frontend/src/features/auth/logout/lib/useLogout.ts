import { useState } from 'react'
import { useSessionStore } from '@/entities/session/model/sessionStore'
import { apiFetch } from '@/shared/api/apiFetch'
import { useAppNavigate } from '@/shared/lib/router/useAppNavigate'
import { AppError } from '@/shared/utils/errors'

export const useLogout = () => {
  const { goToHome } = useAppNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      const response = await apiFetch('/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })

      const result = await response.json()

      if (result.success) {
        useSessionStore.getState().logout()

        goToHome()
      } else {
        throw new AppError(
          'При выходе из системы возникла непредвиденная ошибка',
          result.error.message
        )
      }
    } catch (error) {
      if (error instanceof AppError) throw error

      throw new AppError('При выходе из системы возникла непредвиденная ошибка')
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, handleLogout }
}
