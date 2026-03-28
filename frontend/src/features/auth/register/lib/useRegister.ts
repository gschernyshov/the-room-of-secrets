import { useLocation } from 'react-router-dom'
import { type RegisterFormData } from './registerSchema'
import { useSessionStore } from '@/entities/session/model/sessionStore'
import { apiFetch } from '@/shared/api/apiFetch'
import { useAppNavigate } from '@/shared/lib/router/useAppNavigate'
import { AppError } from '@/shared/utils/errors'
import { AppRoutes } from '@/shared/consts/router'

export const useRegister = () => {
  const { navigate } = useAppNavigate()
  const location = useLocation()
  const state = location.state

  const handleRegister = async (data: RegisterFormData) => {
    try {
      const response = await apiFetch('/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        const { accessToken, ...user } = result.data

        useSessionStore.getState().login(accessToken, user)

        const from = state?.from?.pathname || AppRoutes.HOME
        navigate(from, { replace: true })
      } else {
        throw new AppError(
          'При регистрации возникла непредвиденная ошибка',
          result.error.message
        )
      }
    } catch (error) {
      if (error instanceof AppError) throw error

      throw new AppError('При регистрации возникла непредвиденная ошибка')
    }
  }

  return { handleRegister }
}
