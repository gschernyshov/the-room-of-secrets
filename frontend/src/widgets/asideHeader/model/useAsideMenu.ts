import { useMemo } from 'react'
import { buildMenu } from '../сonfig'
import { useSessionStore } from '@/entities/session/model/sessionStore'

type Handlers = {
  onLogin: () => void
  onRegister: () => void
}

export const useAsideMenu = (handlers: Handlers) => {
  const status = useSessionStore(state => state.status)

  return useMemo(() => {
    if (status !== 'authenticated') {
      return buildMenu.guest(handlers)
    }

    return buildMenu.auth()
  }, [status, handlers])
}
