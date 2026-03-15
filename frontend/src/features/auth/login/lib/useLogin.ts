import { useLocation } from 'react-router-dom'
import { type LoginFormData } from './loginSchema'
import { useSessionStore } from '@/entities/session/model/store'
import { apiFetch } from '@/shared/api/apiFetch'
import { useAppNavigate } from '@/shared/lib/router/useAppNavigate'
import { AppError } from '@/shared/utils/errors'
import { AppRoutes } from '@/shared/consts/router'

export const useLogin = () => {
  const { navigate } = useAppNavigate()
  const location = useLocation()
  const state = location.state

  const login = async (data: LoginFormData) => {
    try {
      const response = await apiFetch('/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        const { accessToken, ...user } = result.data

        useSessionStore.getState().login(accessToken, user)

        const from = state?.from?.pathname || AppRoutes.PROFILE
        navigate(from, { replace: true })
      } else {
        const errorMessage = result.error.message

        const message =
          typeof errorMessage === 'string'
            ? errorMessage
            : JSON.stringify(errorMessage)

        throw new AppError(message)
      }
    } catch (error) {
      if (error instanceof AppError) throw error

      throw new AppError('При авторизации возникла непредвиденная ошибка')
    }
  }

  return { login }
}
