import { setOnTokenRefreshed } from '@/shared/auth/lib/tokenService'
import { useSessionStore } from '../model/sessionStore'

export const initTokenRefreshListener = () => {
  setOnTokenRefreshed(newToken => {
    if (newToken === null) {
      useSessionStore.getState().logout()
    }

    useSessionStore.getState().setToken(newToken)
  })
}
