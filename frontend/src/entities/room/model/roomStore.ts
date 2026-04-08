import { create } from 'zustand'
import { type Room } from '../types'
import type { User } from '@/entities/user/model/types'

type RoomState = {
  currentRoom: Room | null
}

type RoomActions = {
  setCurrentRoom: (room: Room | null) => void
  addUser: (userId: User['id']) => void
  removeUser: (userId: User['id']) => void
}

export const useRoomStore = create<RoomState & RoomActions>(set => ({
  currentRoom: null,

  setCurrentRoom: room => set({ currentRoom: room }),

  addUser: (userId: User['id']) =>
    set(state => ({
      currentRoom: {
        ...state.currentRoom!,
        participants: [...state.currentRoom!.participants, userId],
      },
    })),

  removeUser: (userId: User['id']) =>
    set(state => ({
      currentRoom: {
        ...state.currentRoom!,
        participants: state.currentRoom!.participants.filter(
          id => id !== userId
        ),
      },
    })),
}))
