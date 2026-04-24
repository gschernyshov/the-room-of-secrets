import { useLocation } from 'react-router-dom'
import { type LoginData } from './schema'
import { loginApi } from '../api/login'
import { useSessionStore } from '@/entities/session/model/sessionStore'
import { tokenService } from '@/shared/auth/lib/tokenService'
import { useAppNavigate } from '@/shared/lib/router/useAppNavigate'
import { AppError } from '@/shared/utils/errors'
import { AppRoutes, RoutePath } from '@/shared/consts/router'

export const useLogin = () => {
  const { navigate } = useAppNavigate()
  const location = useLocation()
  const state = location.state

  const handleLogin = async (data: LoginData) => {
    try {
      const result = await loginApi(data)

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
