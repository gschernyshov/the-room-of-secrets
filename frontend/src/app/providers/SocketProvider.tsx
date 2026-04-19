import { useEffect, type ReactNode } from 'react'
import { useShowAlert } from '@/widgets/globalAlert'
import { useSessionStore } from '@/entities/session/model/sessionStore'
import { useSocketStore } from '@/shared/store/socketStore'
import { socketService } from '@/shared/api/socketService'
import { AppError } from '@/shared/utils/errors'
import { roomService } from '@/entities/room/lib/roomService'
import { useRoomStore } from '@/entities/room/model/roomStore'

type Props = {
  children: ReactNode
}

export const SocketProvider = ({ children }: Props) => {
  const accessToken = useSessionStore(state => state.accessToken)
  const { errorAlert } = useShowAlert()
  const { setConnecting, setConnected, setDisconnected } = useSocketStore()
  const currentRoom = useRoomStore(state => state.currentRoom)

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

  const restoreRooms = async () => {
    if (currentRoom) roomService.joinRoom(currentRoom?.id)
  }

  useEffect(() => {
    if (accessToken) {
      connect()
    } else {
      disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken])

  useEffect(() => {
    //if (!socketService.socket) return

    const onReconnect = () => {
      console.log('Сокет переподключился, восстанавливаем комнаты...')
      setConnected()
      restoreRooms()
    }

    const onDisconnect = (...args: unknown[]) => {
      const reason =
        args.length > 0 && typeof args[0] === 'string' ? args[0] : 'unknown'
      if (reason !== 'io client disconnect') {
        setDisconnected()
      }
    }

    socketService.on('reconnect', onReconnect)
    socketService.on('disconnect', onDisconnect)

    return () => {
      socketService?.off('reconnect', onReconnect)
      socketService?.off('disconnect', onDisconnect)
    }
  }, [setConnected, setDisconnected])

  return <>{children}</>
}
