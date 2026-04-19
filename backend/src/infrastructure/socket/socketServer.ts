import { Server } from 'socket.io'
import { createServer } from 'http'
import { roomHandler, messageHandler } from './handlers/index.js'
import { tokenService } from '../authentication/services/token.service.js'
import { logger } from '../../shared/utils/logger.js'

export const initializeSocketServer = (
  server: ReturnType<typeof createServer>
) => {
  logger.progress('Инициализация Socket.IO сервера...')

  const io = new Server(server, {
    cors: {
      origin: [process.env.CORS_ORIGINS || 'http://localhost:8003'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  })

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token
    if (!token) {
      return next(new Error('Требуется аутентификация'))
    }

    const tokenPayload = tokenService.verifyToken(token)
    if (!tokenPayload) {
      return next(new Error('Требуется аутентификация'))
    }

    socket.data.user = { id: tokenPayload.userId }

    logger.info(
      `Сокет id: ${socket.id} аутентифицирован как пользователь id: ${tokenPayload.userId}`
    )

    next()
  })

  io.on('connection', socket => {
    const userId = socket.data.user.id

    logger.info(
      `Пользователь id: ${userId} подключился к серверу через сокет id: ${socket.id}`
    )

    roomHandler(io, socket, userId)
    messageHandler(socket, userId)

    socket.on('disconnect', reason => {
      logger.info(
        `Пользователь id: ${userId} отключился. Причина: ${reason}. Cокет id: ${socket.id}`
      )
    })

    socket.on('error', error => {
      logger.error(
        `Ошибка сокета id: ${socket.id} пользователя id: ${socket.data.user.id}: ${error}`
      )
    })
  })

  io.on('error', error => {
    logger.error(`В Socket.IO сервере возникла ошибка: ${error}`)
  })
}
