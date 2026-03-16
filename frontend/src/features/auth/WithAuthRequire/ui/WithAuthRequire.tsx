import { type ReactNode } from 'react'
import { useSessionStore } from '@/entities/session/model/store'
import { AppNavigate } from '@/shared/lib/router/AppNavigate'

type Props = {
  children: ReactNode
}

export const WithAuthRequire = ({ children }: Props) => {
  const status = useSessionStore(state => state.status)

  if (status === 'unauthenticated') {
    return <AppNavigate to="/login" replace />
  }

  return children
}
