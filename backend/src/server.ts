import http from 'http'
import { app } from './app.js'
import { initializeSocketServer } from './infrastructure/socket/socketServer.js'
import { db, runMigrations, redis } from './infrastructure/database/index.js'
import { setupListeners } from './infrastructure/events/listeners/setupListeners.js'
import { startMessageFlushWorker } from './infrastructure/background/messageFlushWorker.js'
import { logger } from './shared/utils/logger.js'

const server = http.createServer(app)
const PORT = process.env.PORT || 8000

const startServer = async () => {
  logger.progress('Запуск сервера...')

  try {
    initializeSocketServer(server)

    await db.connect()
    await runMigrations()
    await redis.connect()

    setupListeners()

    startMessageFlushWorker(6000)

    server.listen(PORT, () => {
      logger.success(`HTTP и Socket.IO сервер запущен на порту: ${PORT}`)
    })
  } catch (error) {
    logger.error(`Критическая ошибка при запуске сервера: ${error.message}`)
    process.exit(1)
  }
}

startServer()
