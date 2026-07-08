import { useEffect } from 'react'
import { routeConfig } from '../routes'
import { useAppNavigate } from '@/shared/lib/router/useAppNavigate'

export const RouteTitleSetter = () => {
  const { pathname } = useAppNavigate()

  useEffect(() => {
    const currentRoute = routeConfig.find(route => route.path === pathname)

    if (currentRoute?.title) {
      const originalTitle = document.title
      document.title = currentRoute.title

      return () => {
        document.title = originalTitle
      }
    }
  }, [pathname])

  return null
}
