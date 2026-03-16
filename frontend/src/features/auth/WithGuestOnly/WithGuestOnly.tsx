import { type ReactNode } from 'react'
import { useSessionStore } from '@/entities/session/model/store'
import { AppNavigate } from '@/shared/lib/router/AppNavigate'

type Props = {
  children: ReactNode
  redirectTo?: string
}

export const WithGuestOnly = ({ children, redirectTo = '/profile' }: Props) => {
  const status = useSessionStore(state => state.status)

  if (status === 'authenticated') {
    return <AppNavigate to={redirectTo} replace />
  }

  return children
}
