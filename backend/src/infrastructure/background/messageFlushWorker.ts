import { messageRepository } from '../../domains/message/repositories/message.repository.js'
import { logger } from '../../shared/utils/logger.js'

export const startMessageFlushWorker = (intervalMs = 5000) => {
  setInterval(async () => {
    try {
      logger.progress('Запуск фоновой задачи по сбросу сообщений в БД...')
      await messageRepository.flush()
      logger.success('Фоновая задача по сбросу сообщений выполнена успешно')
    } catch (error) {
      logger.error(
        `Ошибка в фоновом процессе сохранения сообщений${error instanceof Error ? `: ${error.message}` : ``}`
      )
    }
  }, intervalMs)
}
