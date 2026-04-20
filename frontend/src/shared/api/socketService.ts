import { io, type Socket } from 'socket.io-client'
import { AppError } from '../utils/errors'
import { type SocketCallback } from '../types/socket.types'
import { apiFetch } from './apiFetch'
import { checkIfTokenExpired } from '../utils/jwt'
import { tokenService } from '../auth/lib/tokenService'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000'

type SocketWithTimer = Socket & {
  _connectTimer?: ReturnType<typeof setTimeout>
}

let socket: SocketWithTimer | null = null

export const socketService = {
  connect: (token: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (socket?.connected) {
        resolve()
        return
      }

      if (!socket) {
        socket = io(SOCKET_URL, {
          auth: { token },
          withCredentials: true,
          reconnection: true,
          reconnectionAttempts: Infinity,
          reconnectionDelay: 1000,
        })
      } else {
        socket.auth = { token }
        if (socket.disconnected) {
          socket.connect()
        }
      }

      const onConnect = () => {
        console.log('[SOCKET] Подключено')
        if (socket?._connectTimer) {
          clearTimeout(socket._connectTimer)
          delete socket._connectTimer
        }
        resolve()
      }

      const onError = (error: Error) => {
        if (socket?._connectTimer) {
          clearTimeout(socket._connectTimer)
          delete socket._connectTimer
        }
        reject(new AppError(error.message))
      }

      socket.once('connect', onConnect)
      socket.once('connect_error', onError)

      socket._connectTimer = setTimeout(() => {
        if (socket?.connected) return
        reject(new Error('Не удалось установить соединение с сервером'))
      }, 10000)
    })
  },

  disconnect: (): void => {
    if (socket) {
      if (socket._connectTimer) {
        clearTimeout(socket._connectTimer)
        delete socket._connectTimer
      }
      socket.disconnect()
    }
  },

  on: <T>(event: string, callback: (data: T) => void): void => {
    if (socket) {
      socket.on(event, callback)
    }
  },

  off: <T>(event: string, callback?: (data: T) => void): void => {
    if (socket) {
      socket.off(event, callback)
    }
  },

  emit: <Request, Response = void>(
    event: string,
    data: Request,
    callback?: SocketCallback<Response>
  ): void => {
    if (socket) {
      socket.emit(event, data, callback)
    } else {
      console.warn('Сокет не подключён')
    }
  },

  connectWithFreshToken: async (): Promise<void> => {
    const accessToken = tokenService.get()
    if (!accessToken) {
      throw new AppError('Нет токена для подключения')
    }

    const isExpired = checkIfTokenExpired(accessToken)
    if (isExpired) {
      console.log('[SOCKET] Токен истёк, обновляем...')

      try {
        const response = await apiFetch('/user/me')
        const result = await response.json()

        if (result.success) {
          const newAccessToken = tokenService.get()

          if (!newAccessToken || newAccessToken === accessToken) {
            throw new AppError('Не удалось получить новый токен')
          }

          return socketService.connect(newAccessToken)
        } else {
          throw new AppError('Не удалось обновить токен')
        }
      } catch (error) {
        console.error('[SOCKET] Не удалось обновить токен')

        if (error instanceof AppError) throw error

        throw new AppError('Не удалось обновить токен')
      }
    } else {
      // Токен по дате валиден, но сервер отклонил
      tokenService.remove()
      throw new AppError(
        'Токен отклонён сервером (возможно, сессия разлогинена)'
      )
    }
  },
}
