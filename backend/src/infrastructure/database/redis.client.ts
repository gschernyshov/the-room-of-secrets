import { createClient, type RedisClientType } from 'redis'
import { logger } from '../../shared/utils/logger.js'
import { AppError } from '../../shared/utils/errors.js'

let client: RedisClientType | null = null

export const redis = {
  connect: async (): Promise<RedisClientType> => {
    if (client && client.isReady) {
      return client
    }

    client = createClient({
      url: process.env.REDIS_URL || 'redis://redis:8002',
    })

    client.on('error', error => {
      logger.error(`Ошибка подключения к Redis: ${error.message}`)
    })

    client.on('connect', () => {
      logger.success('Подключение к Redis успешно выполнено')
    })

    client.on('reconnecting', () => {
      logger.warning('Соединение с Redis закрыто. Попытка переподключения...')
    })

    try {
      logger.progress('Подключение к Redis...')
      await client.connect()
    } catch (error) {
      client = null
      throw error
    }

    return client
  },

  disconnect: async (): Promise<void> => {
    if (client) {
      await client.quit()
      client = null
      logger.warning('Соединение с Redis закрыто')
    }
  },

  getClient: (): RedisClientType => {
    if (!client) {
      throw new AppError('Клиент Redis не подключен')
    }
    return client
  },
}
