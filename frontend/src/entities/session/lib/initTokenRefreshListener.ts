import { setOnTokenRefreshed } from '@/shared/auth/lib/tokenService'
import { useSessionStore } from '../model/sessionStore'

export const initTokenRefreshListener = () => {
  setOnTokenRefreshed(newToken => {
    useSessionStore.getState().setToken(newToken)
  })
}
