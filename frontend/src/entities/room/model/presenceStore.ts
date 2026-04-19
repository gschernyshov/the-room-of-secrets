import { create } from 'zustand'
import { type User } from '@/entities/user/model/types'

type PresenceState = {
  onlineUserIds: Set<User['id']>
}

type PresenceActions = {
  setOnline: (userIds: number[]) => void
  addUser: (userId: number) => void
  removeUser: (userId: number) => void
}

export const usePresenceStore = create<PresenceState & PresenceActions>(
  set => ({
    onlineUserIds: new Set(),

    setOnline: userIds => set({ onlineUserIds: new Set(userIds) }),

    addUser: userId =>
      set(state => {
        const newSet = new Set(state.onlineUserIds)
        newSet.add(userId)
        return { onlineUserIds: newSet }
      }),

    removeUser: userId =>
      set(state => {
        const newSet = new Set(state.onlineUserIds)
        newSet.delete(userId)
        return { onlineUserIds: newSet }
      }),
  })
)
