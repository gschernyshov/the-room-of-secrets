import { io, type Socket } from 'socket.io-client'
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
      if (socket?.connected) {
        resolve()
        return
      }

      if (socket) {
        if (socket._connectTimer) {
          clearTimeout(socket._connectTimer)
          delete socket._connectTimer
        }
        socket.off('connect')
        socket.off('connect_error')
        socket.disconnect()
      }

      socket = io(SOCKET_URL, {
        auth: {
          token,
        },
        withCredentials: true,
      })

      socket._connectTimer = setTimeout(() => {
        socket?.disconnect()
        reject(new Error('Не удалось установить соединение с сервером'))
      }, 10000)

      socket.on('connect', () => {
        if (socket?._connectTimer) {
          clearTimeout(socket._connectTimer)
          delete socket._connectTimer
        }
        resolve()
      })

      socket.on('connect_error', error => {
        if (socket?._connectTimer) {
          clearTimeout(socket._connectTimer)
          delete socket._connectTimer
        }
        reject(new AppError(error.message))
      })
    })
  },

  disconnect: (): void => {
    if (socket) {
      if (socket._connectTimer) {
        clearTimeout(socket._connectTimer)
        delete socket._connectTimer
      }
      socket.disconnect()
      socket = null
    }
  },

  on: <T>(event: string, callback: (data: T) => void): void => {
    if (socket) {
      socket.on(event, callback)
    }
  },

  off: (event: string, callback?: (...args: unknown[]) => void): void => {
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
}
