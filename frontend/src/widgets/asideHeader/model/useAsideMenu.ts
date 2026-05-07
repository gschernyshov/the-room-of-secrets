import { useMemo } from 'react'
import { buildMenu } from '../сonfig'
import { useSessionStore } from '@/entities/session/model/sessionStore'
import { useRoomListStore } from '@/entities/room/model/roomListStore'
import { type Room } from '@/entities/room/model/types'

type GuestPayload = {
  onLogin: () => void
  onRegister: () => void
}

type AuthPayload = {
  compact: boolean
  onProfile: (tab?: string) => void
  onRoom: (id: Room['id']) => void
}

type Payload = {
  guestPayload: GuestPayload
  authPayload: AuthPayload
}

export const useAsideMenu = (payload: Payload) => {
  const status = useSessionStore(state => state.status)
  const rooms = useRoomListStore(state => state.rooms)

  return useMemo(() => {
    if (status !== 'authenticated') {
      return buildMenu.guest(payload.guestPayload)
    }

    return buildMenu.auth({ ...payload.authPayload, rooms })
  }, [status, rooms, payload])
}
