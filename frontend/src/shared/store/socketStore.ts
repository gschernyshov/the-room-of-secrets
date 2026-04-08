import { create } from 'zustand'

type SocketState = {
  isConnected: boolean
  isConnecting: boolean
}

type SockerActions = {
  setConnecting: () => void
  setConnected: () => void
  setDisconnected: (error?: string) => void
}

export const useSocketStore = create<SocketState & SockerActions>()(set => ({
  isConnected: false,
  isConnecting: false,

  setConnecting: () => set({ isConnecting: true, isConnected: false }),

  setConnected: () => set({ isConnecting: false, isConnected: true }),

  setDisconnected: () => set({ isConnected: false, isConnecting: false }),
}))
