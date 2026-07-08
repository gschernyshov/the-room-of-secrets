import { type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { useSessionStore } from '@/entities/session/model/sessionStore'
import { AppNavigate } from '@/shared/lib/router/AppNavigate'

type Props = {
  children: ReactNode
  redirectTo?: string
}

export const WithAuthRequire = ({ children, redirectTo = '/login' }: Props) => {
  const status = useSessionStore(state => state.status)
  const location = useLocation()

  if (status === 'unauthenticated') {
    return (
      <AppNavigate
        to={redirectTo}
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  return children
}
