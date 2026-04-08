import { useSessionStore } from '../model/sessionStore'
import { setOnTokenRefreshed } from '@/shared/api/apiFetch'

export const initTokenRefreshListener = () => {
  setOnTokenRefreshed(newToken => {
    useSessionStore.getState().setToken(newToken)
  })
}
