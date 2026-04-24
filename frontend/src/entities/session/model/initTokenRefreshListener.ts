import { useSessionStore } from './sessionStore'
import { setOnTokenRefreshed } from '@/shared/auth/lib/tokenService'

export const initTokenRefreshListener = () => {
  setOnTokenRefreshed(newToken => {
    useSessionStore.getState().setToken(newToken)
  })
}
