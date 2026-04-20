import { useEffect, type ReactNode } from 'react'
import { useShowAlert } from '@/widgets/globalAlert'
import { useSessionStore } from '@/entities/session/model/sessionStore'
import { useSocketStore } from '@/shared/store/socketStore'
import { socketService } from '@/shared/api/socketService'
import { getErrorMessage } from '@/shared/utils/getErrorMessage'
import { isErrorMessage } from '@/shared/utils/typeGuards'

type Props = {
  children: ReactNode
}

export const SocketProvider = ({ children }: Props) => {
  const accessToken = useSessionStore(state => state.accessToken)
  const { setConnecting, setConnected, setDisconnected } = useSocketStore()
  const { errorAlert } = useShowAlert()

  useEffect(() => {
    const handleConnect = () => {
      console.log('[SocketProvider] Подключено')
      setConnected()
    }

    const handleDisconnect = (reason: string) => {
      console.log('[SocketProvider] Отключено:', reason)
      setDisconnected()
    }

    const handleConnectError = async (error: unknown) => {
      if (
        isErrorMessage(error) &&
        error.message.includes('Требуется аутентификация')
      ) {
        setConnecting()
        try {
          await socketService.connectWithFreshToken()
        } catch (error) {
          errorAlert('Ошибка подключения к серверу: ', getErrorMessage(error))
          setDisconnected()
        }
      }
    }

    socketService.on('connect', handleConnect)
    socketService.on('connect_error', handleConnectError)
    socketService.on('disconnect', handleDisconnect)

    return () => {
      socketService.off('connect', handleConnect)
      socketService.off('connect_error', handleConnectError)
      socketService.off('disconnect', handleDisconnect)
    }
  }, [])

  useEffect(() => {
    if (!accessToken) {
      socketService.disconnect()
      setDisconnected()
      return
    }

    const connect = async () => {
      setConnecting()
      try {
        await socketService.connect(accessToken)
      } catch (error) {
        errorAlert('Ошибка подключения к серверу: ', getErrorMessage(error))
        setDisconnected()
      }
    }

    connect()
  }, [accessToken])

  return <>{children}</>
}
