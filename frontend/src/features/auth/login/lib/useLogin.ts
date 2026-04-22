import { useLocation } from 'react-router-dom'
import { type LoginFormData } from './loginSchema'
import { useSessionStore } from '@/entities/session/model/sessionStore'
import { tokenService } from '@/shared/auth/lib/tokenService'
import { useAppNavigate } from '@/shared/lib/router/useAppNavigate'
import { apiFetch } from '@/shared/api/apiFetch'
import { AppError } from '@/shared/utils/errors'
import { AppRoutes, RoutePath } from '@/shared/consts/router'

export const useLogin = () => {
  const { navigate } = useAppNavigate()
  const location = useLocation()
  const state = location.state

  const handleLogin = async (data: LoginFormData) => {
    try {
      const response = await apiFetch('/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        const { accessToken, user } = result.data

        tokenService.cleanSet(accessToken)
        useSessionStore.getState().login(accessToken, user)

        const from = state?.from || RoutePath[AppRoutes.PROFILE]
        navigate(from, { replace: true })
      } else {
        throw new AppError(
          'При авторизации возникла непредвиденная ошибка',
          result.error.message
        )
      }
    } catch (error) {
      if (error instanceof AppError) throw error

      throw new AppError('При авторизации возникла непредвиденная ошибка')
    }
  }

  return { handleLogin }
}
