import { useEffect } from 'react'
import { useSessionStore } from '@/entities/session/model/store'

export const useInitAuth = () => {
  const status = useSessionStore(state => state.status)

  useEffect(() => {
    if (status === 'loading') {
      useSessionStore.getState().init()
    }
  }, [status])

  return status
}
