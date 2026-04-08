import { create } from 'zustand'
import { type User } from '@/entities/user/model/types'
import { apiFetch } from '@/shared/api/apiFetch'
import { tokenService } from '@/shared/auth/lib/tokenService'
import { AppError } from '@/shared/utils/errors'
import { getErrorMessage } from '@/shared/utils/getErrorMessage'

type SessionStatus = 'authenticated' | 'unauthenticated' | 'loading'

type SessionState = {
  status: SessionStatus
  accessToken: string | null
  user: User | null
  error: null | string
}

type SessionActions = {
  login: (token: string, user: User) => void
  setToken: (token: string) => void
  logout: () => void
  init: () => Promise<void>
}

export const useSessionStore = create<SessionState & SessionActions>(set => ({
  status: 'loading',
  accessToken: null,
  user: null,
  error: null,

  setToken: token => (set({ accessToken: token }), tokenService.set(token)),

  login: (token, user) => {
    tokenService.set(token)
    set({ status: 'authenticated', accessToken: token, user })
  },

  logout: () => {
    tokenService.remove()
    set({ status: 'unauthenticated', accessToken: null, user: null })
  },

  init: async () => {
    const token = tokenService.get()
    if (!token) {
      set({ status: 'unauthenticated', accessToken: null, user: null })
      return
    }

    set({ accessToken: token })
    try {
      const response = await apiFetch('/user/me')
      const result = await response.json()

      if (result.success) {
        set({ status: 'authenticated', user: result.data })
      } else {
        throw new AppError(
          'При аутентификации пользователя возникала непредвиденная ошибка',
          result.error.message
        )
      }
    } catch (error) {
      let messageError: string
      if (error instanceof AppError) {
        messageError = getErrorMessage(error)
      } else {
        messageError =
          'При аутентификации пользователя возникала непредвиденная ошибка'
      }

      tokenService.remove()
      set({
        status: 'unauthenticated',
        accessToken: null,
        user: null,
        error: messageError,
      })
    }
  },
}))
