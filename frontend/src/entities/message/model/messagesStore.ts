import { create } from 'zustand'
import { type Message } from '../types'

type MessagesState = {
  messages: Message[]
}

type MessagesActions = {
  addMessage: (message: Message) => void
  setMessages: (messages: Message[]) => void
  clear: () => void
}

export const useMessagesStore = create<MessagesState & MessagesActions>(
  set => ({
    messages: [],

    addMessage: message =>
      set(state => ({ messages: [...state.messages, message] })),

    setMessages: messages => set({ messages }),

    clear: () => set({ messages: [] }),
  })
)
