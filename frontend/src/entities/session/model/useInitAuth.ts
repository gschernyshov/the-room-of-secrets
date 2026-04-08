import { useEffect } from 'react'
import { useSessionStore } from '../model/sessionStore'

export const useInitAuth = () => {
  const { status, error } = useSessionStore()

  useEffect(() => {
    if (status === 'loading') {
      useSessionStore.getState().init()
    }
  }, [status])

  return { status, error }
}
