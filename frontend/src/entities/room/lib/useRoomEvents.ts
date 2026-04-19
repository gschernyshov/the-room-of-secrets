import { useEffect } from 'react'
import { useRoomStore } from '../model/roomStore'
import { usePresenceStore } from '../model/presenceStore'
import { ROOM_EVENTS } from '../model/roomEvents'
import { type UserJoinedData, type UserLeftData } from '../types'
import { useSocketStore } from '@/shared/store/socketStore'
import { socketService } from '@/shared/api/socketService'

export const useRoomEvents = () => {
  const isConnected = useSocketStore(state => state.isConnected)

  useEffect(() => {
    if (!isConnected) return

    socketService.on<UserJoinedData>(ROOM_EVENTS.USER_JOINED, data => {
      useRoomStore.getState().addUser(data.userId)
      usePresenceStore.getState().addUser(data.userId)
    })

    socketService.on<UserLeftData>(ROOM_EVENTS.USER_LEFT, data => {
      usePresenceStore.getState().removeUser(data.userId)
    })

    return () => {
      socketService.off(ROOM_EVENTS.USER_JOINED)
      socketService.off(ROOM_EVENTS.USER_LEFT)
    }
  }, [isConnected])
}
