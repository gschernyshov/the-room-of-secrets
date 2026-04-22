import { useCallback } from 'react'
import {
  useNavigate,
  useLocation,
  type NavigateOptions,
} from 'react-router-dom'
import { AppRoutes, RoutePath } from '@/shared/consts/router'

export const useAppNavigate = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const goToHome = useCallback(
    (params?: NavigateOptions) => {
      navigate(RoutePath[AppRoutes.HOME], params)
    },
    [navigate]
  )

  const goToLogin = useCallback(
    (params?: NavigateOptions) => {
      navigate(RoutePath[AppRoutes.LOGIN], params)
    },
    [navigate]
  )

  const goToRegister = useCallback(
    (params?: NavigateOptions) => {
      navigate(RoutePath[AppRoutes.REGISTER], params)
    },
    [navigate]
  )

  const goToProfile = useCallback(
    (params?: NavigateOptions) => {
      navigate(RoutePath[AppRoutes.PROFILE], params)
    },
    [navigate]
  )

  const goToRoom = useCallback(
    (roomId: string, params?: NavigateOptions) => {
      navigate(`${RoutePath[AppRoutes.ROOM]}/${roomId}`, params)
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
