import { Server } from 'socket.io'
import { createServer } from 'http'
import { roomHandler } from './handlers/socket.handler.js'
import { tokenService } from '../authentication/services/token.service.js'
import { logger } from '../../shared/utils/logger.js'

export const initializeSocketServer = (
  server: ReturnType<typeof createServer>
) => {
  logger.progress('Инициализация Socket.IO сервера...')

  const io = new Server(server, {
    cors: {
      origin: '*', // ['http://localhost:3000'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  })

  io.on('error', error => {
    logger.error(`В Socket.IO сервере возникла ошибка : ${error}`)
  })

  io.use((socket, next) => {
    const authHeader = socket.handshake.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new Error('Требуется аутентификация'))
    }

    const token = authHeader.split(' ')[1]
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

    roomHandler(socket, userId)

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
}
