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
  const { successAlert, errorAlert } = useShowAlert()

  useEffect(() => {
    if (!accessToken) {
      socketService.disconnect()
      setDisconnected()
      return
    }

    setConnecting()
    socketService
      .connect(accessToken)
      .then(() => {
        // Для случая, когда меняется токен и происходит рендер
        setConnected()
      })
      .catch(() => {})
  }, [accessToken, setConnecting, setConnected, setDisconnected])

  useEffect(() => {
    const handleConnect = () => {
      setConnected()

      console.log('[SOCKET_PROVIDER] Подключено')
      successAlert('Подключение к серверу', 'Вы успешно подключились к серверу')
    }

    const handleDisconnect = (reason: string) => {
      setDisconnected()

      console.log('[SOCKET_PROVIDER] Отключено: ', reason)
      errorAlert('Подключение к серверу', 'Вы отключились от сервера')
    }

    const handleConnectError = async (error: Error) => {
      if (
        isErrorMessage(error) &&
        error.message.includes('Требуется аутентификация')
      ) {
        setConnecting()
        try {
          await socketService.connectWithFreshToken()
        } catch (error) {
          errorAlert('Ошибка подключения к серверу', getErrorMessage(error))
        }
      } else {
        errorAlert('Ошибка подключения к серверу', getErrorMessage(error))
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
  }, [
    accessToken,
    setConnecting,
    setConnected,
    setDisconnected,
    successAlert,
    errorAlert,
  ])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && accessToken) {
        setConnecting()
        socketService
          .connect(accessToken)
          .then(() => {
            // Для случая, когда подключение не было разорввано
            setConnected()
          })
          .catch(() => {})
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [accessToken, errorAlert, setConnecting, setConnected, setDisconnected])

  return <>{children}</>
}
