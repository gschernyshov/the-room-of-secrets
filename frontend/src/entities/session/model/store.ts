import { create } from 'zustand'
import { type User } from '@/entities/user/model/types'
import { apiFetch } from '@/shared/api/apiFetch'
import { tokenService } from '@/shared/auth/lib/tokenService'

type SessionStatus = 'authenticated' | 'unauthenticated' | 'loading'

type SessionState = {
  status: SessionStatus
  user: User | null
}

type SessionActions = {
  login: (token: string, user: User) => void
  logout: () => void
  init: () => Promise<void>
}

export const useSessionStore = create<SessionState & SessionActions>(set => ({
  status: 'loading',
  user: null,

  login: (token, user) => {
    tokenService.set(token)
    set({ status: 'authenticated', user })
  },
  logout: () => {
    tokenService.remove()
    set({ status: 'unauthenticated', user: null })
  },

  init: async () => {
    const token = tokenService.get()
    if (!token) {
      set({ status: 'unauthenticated', user: null })
      return
    }

    try {
      const response = await apiFetch('/user/me')
      const result = await response.json()

      console.log(result)

      if (result.succces) {
        set({ status: 'authenticated', user: result.data })
      } else {
        throw new Error(
          `При аутентификации пользователя возникала ошибка: ${result.error?.message}`
        )
      }
    } catch {
      tokenService.remove()
      set({ status: 'unauthenticated', user: null })
    }
  },
}))
