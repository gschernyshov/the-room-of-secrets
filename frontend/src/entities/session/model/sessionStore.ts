import { create } from 'zustand'
import { userApi } from '../lib/userApi'
import { type User } from '@/entities/user/model/types'
import { tokenService } from '@/shared/auth/lib/tokenService'
import { getErrorMessage } from '@/shared/utils/getErrorMessage'
import { AppError } from '@/shared/utils/errors'

type SessionStatus = 'authenticated' | 'unauthenticated' | 'loading'

type SessionState = {
  status: SessionStatus
  accessToken: string | null
  user: User | null
  error: null | string
}

type SessionActions = {
  login: (token: string, user: User) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
  setToken: (token: string | null) => void
  init: () => Promise<void>
}

export const useSessionStore = create<SessionState & SessionActions>(set => ({
  status: 'loading',
  accessToken: null,
  user: null,
  error: null,

  login: (token, user) => {
    set({ status: 'authenticated', accessToken: token, user })
  },

  logout: () => {
    set({ status: 'unauthenticated', accessToken: null, user: null })
  },

  updateUser: user =>
    set(state => {
      if (!state.user) return state
      return { user: { ...state.user, ...user } }
    }),

  setToken: token =>
    set(
      token
        ? { accessToken: token }
        : { status: 'unauthenticated', accessToken: null, user: null }
    ),

  init: async () => {
    const token = tokenService.get()
    if (!token) {
      set({ status: 'unauthenticated', accessToken: null, user: null })
      return
    }

    set({ accessToken: token, error: null })
    try {
      const result = await userApi()

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

      tokenService.cleanRemove()

      set({
        status: 'unauthenticated',
        accessToken: null,
        user: null,
        error: messageError,
      })
    }
  },
}))
