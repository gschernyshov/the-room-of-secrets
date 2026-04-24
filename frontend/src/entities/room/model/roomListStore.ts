import { create } from 'zustand'
import { type Room } from './types'
import { roomListApi } from '../api/roomList'
import { type User } from '@/entities/user/model/types'
import { getErrorMessage } from '@/shared/utils/getErrorMessage'
import { AppError } from '@/shared/utils/errors'

type RoomListState = {
  isLoading: boolean
  rooms: Room[]
  error: null | string
}

type RoomListActions = {
  addRoom: (room: Room) => void
  removeRoom: (roomId: Room['id']) => void
  loadUserRooms: (userId: User['id']) => Promise<void>
}

export const useRoomListStore = create<RoomListState & RoomListActions>(
  set => ({
    isLoading: false,
    rooms: [],
    error: null,

    addRoom: room =>
      set(state => ({
        rooms: [...state.rooms.filter(r => r.id !== room.id), room],
      })),

    removeRoom: roomId =>
      set(state => ({
        rooms: state.rooms.filter(room => room.id !== roomId),
      })),

    loadUserRooms: async () => {
      set({ isLoading: true, error: null })
      try {
        const result = await roomListApi()

        if (result.success) {
          set({ rooms: result.data })
        } else {
          throw new AppError(
            'При получении комнат возникла непредвиденная ошибка',
            result.error.message
          )
        }
      } catch (error) {
        let messageError: string

        if (error instanceof AppError) {
          messageError = getErrorMessage(error)
        } else {
          messageError = 'При получении комнат возникла непредвиденная ошибка'
        }

        set({ error: messageError })
      } finally {
        set({ isLoading: false })
      }
    },
  })
)
