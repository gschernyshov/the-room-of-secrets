import { useNavigate, type NavigateOptions } from 'react-router-dom'
import { AppRoutes } from '@/shared/consts/router'

export const useAppNavigate = () => {
  const navigate = useNavigate()

  const goToHome = (params?: NavigateOptions) => {
    navigate(AppRoutes.HOME, params)
  }

  const goToRegister = (params?: NavigateOptions) => {
    navigate(AppRoutes.REGISTER, params)
  }

  const goToLogin = (params?: NavigateOptions) => {
    navigate(AppRoutes.LOGIN, params)
  }

  const goToRoom = (id: string, params?: NavigateOptions) => {
    navigate(AppRoutes.ROOM.replace(':id', id), params)
  }

  const goBack = () => {
    navigate(-1)
  }

  const goForward = () => {
    navigate(1)
  }

  return {
    navigate,
    goToHome,
    goToLogin,
    goToRegister,
    goToRoom,
    goBack,
    goForward,
  }
}
