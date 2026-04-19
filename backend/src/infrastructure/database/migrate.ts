import { readdirSync, readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { db } from './client.js'
import { logger } from '../../shared/utils/logger.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const migrationsDir = join(__dirname, 'migrations')

export const runMigrations = async () => {
  logger.progress('Запуск миграций базы данных...')

  try {
    const files = readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort()

    if (files.length === 0) {
      logger.warning('Не найдено ни одной SQL-миграции')
      return
    }

    for (const file of files) {
      const filePath = join(migrationsDir, file)
      const sql = readFileSync(filePath, 'utf8')

      logger.info(`Выполняем миграцию: ${file}`)
      try {
        await db.query(sql)
        logger.success(`Миграция успешна: ${file}`)
      } catch (error) {
        logger.error(
          `Ошибка в миграции ${file}${error instanceof Error ? `: ${error.message}` : ``}`
        )
        throw error
      }
    }

    logger.success('Все миграции успешно выполнены')
  } catch (error) {
    logger.error(
      `Критическая ошибка при выполнении миграций${error instanceof Error ? `: ${error.message}` : ``}`
    )
    throw error
  }
}
