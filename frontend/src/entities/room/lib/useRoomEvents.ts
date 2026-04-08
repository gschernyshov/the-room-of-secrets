import { useEffect } from 'react'
import { ROOM_EVENTS } from '../model/roomEvents'
import { type UserJoinedData, type UserLeftData } from '../types'
import { useSocketStore } from '@/shared/store/socketStore'
import { socketService } from '@/shared/api/socketService'
import { useRoomStore } from '../model/roomStore'

export const useRoomEvents = () => {
  const { addUser, removeUser } = useRoomStore()
  const isConnected = useSocketStore(state => state.isConnected)

  useEffect(() => {
    if (!isConnected) return

    socketService.on<UserJoinedData>(ROOM_EVENTS.USER_JOINED, data => {
      console.log(`Пользователь ${data.userId} присоединился к комнате`)
      addUser(data.userId)
    })

    socketService.on<UserLeftData>(ROOM_EVENTS.USER_LEFT, data => {
      console.log(`Пользователь ${data.userId} покинул комнату`)
      removeUser(data.userId)
    })

    return () => {
      socketService.off(ROOM_EVENTS.USER_JOINED)
      socketService.off(ROOM_EVENTS.USER_LEFT)
    }
  }, [isConnected])
}
