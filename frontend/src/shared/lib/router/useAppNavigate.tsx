import { useCallback } from 'react'
import {
  useNavigate,
  useLocation,
  useSearchParams,
  type NavigateOptions,
} from 'react-router-dom'
import { AppRoutes, RoutePath } from '@/shared/consts/router'

export const useAppNavigate = () => {
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const [searchParams] = useSearchParams()

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
    (activeTab?: string, options?: NavigateOptions) => {
      const search = activeTab
        ? `?activeTab=${encodeURIComponent(activeTab)}`
        : ''
      navigate(RoutePath[AppRoutes.PROFILE] + search, options)
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
    search,
    searchParams,
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
