import { useState } from 'react'
import { logoutApi } from '../api/logout'
import { useSessionStore } from '@/entities/session/model/sessionStore'
import { tokenService } from '@/shared/auth/lib/tokenService'
import { AppError } from '@/shared/utils/errors'

export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      const result = await logoutApi()

      if (result.success) {
        tokenService.cleanRemove()
        useSessionStore.getState().logout()
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
