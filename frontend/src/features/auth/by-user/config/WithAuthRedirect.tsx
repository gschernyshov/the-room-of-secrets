import { type ComponentType } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { AppRoutes } from '@/shared/consts/router'

export const withAuthRedirect = (Component: ComponentType) => {
  return () => {
    const location = useLocation()
    const user = true

    if (!user) {
      return <Navigate to={AppRoutes.HOME} state={{ from: location }} replace />
    }

    return <Component />
  }
}
