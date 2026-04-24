import { useSessionStore } from '@/entities/session/model/sessionStore'
import { useSocketStore } from '@/shared/store/socketStore'

export const useFooterData = () => {
  const { status, user } = useSessionStore()
  const { isConnecting, isConnected } = useSocketStore()

  return {
    user,
    status,
    isConnecting,
    isConnected,
  }
}
