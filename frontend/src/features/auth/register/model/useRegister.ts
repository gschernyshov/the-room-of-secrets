import { useLocation } from 'react-router-dom'
import { type RegisterData } from './schema'
import { registerApi } from '../api/register'
import { useSessionStore } from '@/entities/session/model/sessionStore'
import { tokenService } from '@/shared/auth/lib/tokenService'
import { useAppNavigate } from '@/shared/lib/router/useAppNavigate'
import { AppError } from '@/shared/utils/errors'
import { AppRoutes, RoutePath } from '@/shared/consts/router'

export const useRegister = () => {
  const { navigate } = useAppNavigate()
  const location = useLocation()
  const state = location.state

  const handleRegister = async (data: RegisterData) => {
    try {
      const result = await registerApi(data)

      if (result.success) {
        const { accessToken, user } = result.data

        tokenService.cleanSet(accessToken)
        useSessionStore.getState().login(accessToken, user)

        const from = state?.from || RoutePath[AppRoutes.PROFILE]
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
