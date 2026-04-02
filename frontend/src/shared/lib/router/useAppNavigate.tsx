import { useCallback } from 'react'
import {
  useNavigate,
  useLocation,
  type NavigateOptions,
} from 'react-router-dom'
import { AppRoutes } from '@/shared/consts/router'

export const useAppNavigate = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const goToHome = useCallback(
    (params?: NavigateOptions) => {
      navigate(AppRoutes.HOME, params)
    },
    [navigate]
  )

  const goToLogin = useCallback(
    (params?: NavigateOptions) => {
      navigate(AppRoutes.LOGIN, params)
    },
    [navigate]
  )

  const goToRegister = useCallback(
    (params?: NavigateOptions) => {
      navigate(AppRoutes.REGISTER, params)
    },
    [navigate]
  )

  const goToProfile = useCallback(
    (params?: NavigateOptions) => {
      navigate(AppRoutes.PROFILE, params)
    },
    [navigate]
  )

  const goToRoom = useCallback(
    (id: string, params?: NavigateOptions) => {
      navigate(AppRoutes.ROOM.replace(':id', id), params)
    },
    [navigate]
  )

  const goBack = useCallback(() => {
    navigate(-1)
  }, [navigate])

  const goForward = useCallback(() => {
    navigate(1)
  }, [navigate])

  return {
    pathname,
    navigate,
    goToHome,
    goToLogin,
    goToRegister,
    goToProfile,
    goToRoom,
    goBack,
    goForward,
  }
}
