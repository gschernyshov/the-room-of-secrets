import { useEffect, type ReactNode } from 'react'
import { useShowAlert } from '@/widgets/globalAlert'
import { useSessionStore } from '@/entities/session/model/sessionStore'
import { useRoomListStore } from '@/entities/room/model/roomListStore'
import { initTokenRefreshListener } from '@/entities/session/model/initTokenRefreshListener'
import { Loader } from '@/shared/ui/Loader/Loader'

type Props = {
  children: ReactNode
}

export const AuthProvider = ({ children }: Props) => {
  const { errorAlert } = useShowAlert()
  const { status, error: errorSessionStore, user } = useSessionStore()
  const { error: errorRoomListStore } = useRoomListStore()

  useEffect(() => {
    if (status === 'loading') {
      useSessionStore.getState().init()
    }
  }, [status])

  useEffect(() => {
    if (status === 'authenticated' && user) {
      useRoomListStore.getState().loadUserRooms(user.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, user?.id])

  useEffect(() => {
    if (errorSessionStore)
      errorAlert('Ошибка аутентификации', errorSessionStore)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorSessionStore])

  useEffect(() => {
    if (errorRoomListStore)
      errorAlert('Ошибка загрузки комнат', errorRoomListStore)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorRoomListStore])

  useEffect(() => {
    initTokenRefreshListener()
  }, [])

  if (status === 'loading') {
    return (
      <div style={{ height: '100vh', width: '100vw' }}>
        <Loader size="l" />
      </div>
    )
  }

  return <>{children}</>
}
