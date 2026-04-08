import { useEffect, type ReactNode } from 'react'
import { useShowAlert } from '@/widgets/globalAlert'
import { useSessionStore } from '@/entities/session/model/sessionStore'
import { useSocketStore } from '@/shared/store/socketStore'
import { socketService } from '@/shared/api/socketService'
import { AppError } from '@/shared/utils/errors'

type Props = {
  children: ReactNode
}

export const SocketProvider = ({ children }: Props) => {
  const accessToken = useSessionStore(state => state.accessToken)
  const { errorAlert } = useShowAlert()
  const { setConnecting, setConnected, setDisconnected } = useSocketStore()

  const connect = async () => {
    if (!accessToken) return

    setConnecting()
    try {
      await socketService.connect(accessToken)
      setConnected()
    } catch (error) {
      if (error instanceof AppError)
        errorAlert('Ошибка подключения к серверу: ', error.message)

      setDisconnected()
    }
  }

  const disconnect = () => {
    socketService.disconnect()
    setDisconnected()
  }

  useEffect(() => {
    if (accessToken) {
      connect()
    } else {
      disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken])

  return <>{children}</>
}
