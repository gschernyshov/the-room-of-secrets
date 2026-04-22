import { type FC, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { routeConfig } from '../routes'

export const RouteTitleSetter: FC = () => {
  const location = useLocation()

  useEffect(() => {
    const currentRoute = Object.values(routeConfig).find(
      route => route.path === location.pathname
    )

    if (currentRoute?.title) {
      const originalTitle = document.title
      document.title = currentRoute.title

      return () => {
        document.title = originalTitle
      }
    }
  }, [location.pathname])

  return null
}
