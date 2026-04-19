import { useEffect } from 'react'
import { useSessionStore } from '../model/sessionStore'
import { useRoomListStore } from '@/entities/room/model/roomListStore'

export const useInitAuth = () => {
  const { status, error: errorSessionStore, user } = useSessionStore()
  const { error: errorRoomListStore } = useRoomListStore()

  const error = errorSessionStore ?? errorRoomListStore

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

  return { status, error }
}
