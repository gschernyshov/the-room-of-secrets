import { create } from 'zustand'
import { type Room } from '../types'
import { type User } from '@/entities/user/model/types'

type RoomState = {
  currentRoom: Room | null
}

type RoomActions = {
  setCurrentRoom: (room: Room | null) => void
  addUser: (userId: User['id']) => void
  clear: () => void
}

export const useRoomStore = create<RoomState & RoomActions>(set => ({
  currentRoom: null,

  setCurrentRoom: room => set({ currentRoom: room }),

  addUser: (userId: User['id']) =>
    set(state => {
      const currentRoom = state.currentRoom
      if (!currentRoom) return state

      const alreadyExists = currentRoom.participants.some(
        participant => participant.userId === userId
      )
      if (alreadyExists) return state

      return {
        currentRoom: {
          ...currentRoom,
          participants: [
            ...currentRoom.participants,
            { userId, status: 'active' },
          ],
        },
      }
    }),

  clear: () => set({ currentRoom: null }),
}))
