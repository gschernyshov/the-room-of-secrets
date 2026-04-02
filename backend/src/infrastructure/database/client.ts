import { Pool, QueryResultRow, types } from 'pg'
import { logger } from '../../shared/utils/logger.js'

export type QueryParam =
  | number
  | string
  | boolean
  | null
  | Date
  | number[]
  | string[]
  | boolean[]
  | null[]
  | Date[]

types.setTypeParser(1184, stringValue => {
  return new Date(stringValue)
})

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '8001', 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})

export const db = {
  connect: async (): Promise<void> => {
    try {
      logger.progress('Подключение к БД...')
      await pool.query('SELECT NOW()')
      logger.success('Подключение к БД успешно выполнено')
    } catch (error) {
      logger.error(`Ошибка подключения к БД: ${error.message}`)
      throw error
    }
  },

  disconnect: async (): Promise<void> => {
    await pool.end()
    logger.warning('Соединение с БД закрыто')
  },

  query: async <T extends QueryResultRow>(
    text: string,
    params?: QueryParam[]
  ): Promise<T[]> => {
    if (process.env.NODE_ENV === 'development') {
      logger.info(
        `SQL: ${text} ${params ? `Params: ${JSON.stringify(params)}` : ``}`
      )
    }

    try {
      const result = await pool.query<T>(text, params)
      return result.rows
    } catch (error) {
      logger.error(`SQL Error: ${error.message}`)
      throw error
    }
  },
}
