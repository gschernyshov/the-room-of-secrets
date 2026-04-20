import { io, type Socket } from 'socket.io-client'
import { apiFetch } from './apiFetch'
import { tokenService } from '../auth/lib/tokenService'
import { checkIfTokenExpired } from '../utils/jwt'
import { AppError } from '../utils/errors'
import { type SocketCallback } from '../types/socket.types'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000'

type SocketWithTimer = Socket & {
  _connectTimer?: ReturnType<typeof setTimeout>
}

let socket: SocketWithTimer | null = null

export const socketService = {
  connect: (token: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Если уже подключён — сразу resolve
      if (socket?.connected) {
        resolve()
        return
      }

      // Создаём или обновляем сокет
      if (!socket) {
        socket = io(SOCKET_URL, {
          auth: { token },
          withCredentials: true,
          reconnection: true,
          reconnectionAttempts: Infinity,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
        })
      } else {
        socket.auth = { token }
        if (socket.disconnected) {
          socket.connect()
        }
      }

      const onConnect = () => {
        socket?.off('connect_error', onError)
        resolve()
      }

      const onError = (error: Error) => {
        socket?.off('connect', onConnect)
        reject(new AppError(error.message))
      }

      // Подписываемся один раз
      socket.once('connect', onConnect)
      socket.once('connect_error', onError)
    })
  },

  disconnect: (): void => {
    if (socket) {
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
      console.log('[SOCKET_SERVICE] Токен истёк, обновляем...')

      try {
        const response = await apiFetch('/user/me')
        const result = await response.json()

        if (result.success) {
          const newAccessToken = tokenService.get()

          if (!newAccessToken) {
            throw new AppError('Не удалось получить новый токен')
          }

          return socketService.connect(newAccessToken)
        } else {
          throw new AppError('Не удалось обновить токен')
        }
      } catch (error) {
        console.error('[SOCKET_SERVICE] Не удалось обновить токен')

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
