import { type ReactNode } from 'react'
import { useSessionStore } from '@/entities/session/model/sessionStore'
import { useAppNavigate } from '@/shared/lib/router/useAppNavigate'
import { AppNavigate } from '@/shared/lib/router/AppNavigate'

type Props = {
  children: ReactNode
  redirectTo?: string
}

export const WithAuthRequire = ({ children, redirectTo = '/login' }: Props) => {
  const status = useSessionStore(state => state.status)
  const { pathname } = useAppNavigate()

  if (status === 'unauthenticated') {
    return <AppNavigate to={redirectTo} replace state={{ from: pathname }} />
  }

  return children
}
