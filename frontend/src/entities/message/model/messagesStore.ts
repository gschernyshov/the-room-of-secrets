import { create } from 'zustand'
import { type Message } from '../types'

type MessagesState = {
  messages: Message[]
}

type MessagesActions = {
  setMessages: (messages: Message[]) => void
  addMessage: (message: Message) => void
  clear: () => void
}

export const useMessagesStore = create<MessagesState & MessagesActions>(
  set => ({
    messages: [],

    setMessages: messages => set({ messages }),

    addMessage: message =>
      set(state => ({ messages: [...state.messages, message] })),

    clear: () => set({ messages: [] }),
  })
)
