import { sessionService } from './session.service.js'
import { USER_REGISTERED, USER_LOGIN } from '../events/index.js'
import {
  type CreateSessionResult,
  type RefreshSessionResult,
} from '../types/session.type.js'
import { userRepository } from '../../user/repositories/user.repository.js'
import { type User } from '../../user/types/user.type.js'
import { passwordService } from '../../../infrastructure/authentication/services/crypto.service.js'
import { eventBus } from '../../../infrastructure/events/eventBus.js'
import { logger } from '../../../shared/utils/logger.js'
import { AppError } from '../../../shared/utils/errors.js'

export const authService = {
  register: async (
    username: User['username'],
    email: User['email'],
    password: User['password']
  ): Promise<CreateSessionResult & { user: User }> => {
    logger.info(`Регистрация пользователя (${username}, ${email})`)

    try {
      const existingUser = await userRepository.findByEmailOrUsername(
        email,
        username
      )
      if (existingUser) {
        throw new AppError(
          'Пользователь с таким username или email уже существует',
          409
        )
      }

      const hashedPassword = await passwordService.hash(password)

      const user = await userRepository.create(username, email, hashedPassword)
      if (!user) {
        throw new AppError('Не удалось создать пользователя', 500)
      }

      const tokens = await sessionService.create(user.id)

      eventBus.emit(USER_REGISTERED, user)

      return {
        ...tokens,
        user,
      }
    } catch (error) {
      logger.error(
        `При регистрации пользователя (${username}, ${email}) возникла ошибка${error instanceof Error ? `: ${error.message}` : ``}`
      )

      if (error instanceof AppError) {
        throw error
      }

      throw new AppError(
        'При регистрации пользователя возникла непредвиденная ошибка',
        500
      )
    }
  },

  login: async (
    email: User['email'],
    password: User['password']
  ): Promise<CreateSessionResult & { user: User }> => {
    logger.info(`Аутентификация пользователя с email: ${email}`)

    try {
      const user = await userRepository.findByEmail(email)
      if (!user) {
        throw new AppError('Неверный email или пароль', 401, 'AUTH_FAILED')
      }

      const isPasswordValid = await passwordService.compare(
        password,
        user.password
      )
      if (!isPasswordValid) {
        throw new AppError('Неверный email или пароль', 401, 'AUTH_FAILED')
      }

      const tokens = await sessionService.create(user.id)

      eventBus.emit(USER_LOGIN, user)

      return {
        ...tokens,
        user,
      }
    } catch (error) {
      logger.error(
        `При аутентификации пользователя с email: ${email} возникла ошибка${error instanceof Error ? `: ${error.message}` : ``}`
      )

      if (error instanceof AppError) {
        throw error
      }

      throw new AppError(
        'При аутентификации пользователя возникла непредвиденная ошибка',
        500,
        'AUTH_FAILED'
      )
    }
  },

  logout: async (userId: User['id'], refreshToken: string): Promise<void> => {
    logger.info(`Пользователь id: ${userId} выходит из системы`)

    try {
      await sessionService.invalidate(userId, refreshToken)

      logger.info(`Пользователь id: ${userId} успешно вышел`)
    } catch (error) {
      logger.error(
        `При выходе пользователя id: ${userId} возникла ошибка${error instanceof Error ? `: ${error.message}` : ``}`
      )

      if (error instanceof AppError) {
        throw error
      }

      throw new AppError(
        'При выходе из системы возникла непредвиденная ошибка',
        500
      )
    }
  },

  refresh: async (refreshToken: string): Promise<RefreshSessionResult> => {
    try {
      return await sessionService.refresh(refreshToken)
    } catch (error) {
      logger.error(
        `При выдаче access token и refresh token возникла ошибка${error instanceof Error ? `: ${error.message.toLowerCase()}` : ``}`
      )

      if (error instanceof AppError) {
        throw error
      }

      throw new AppError(
        'При выдаче access token и refresh token возникла непредвиденная ошибка',
        500
      )
    }
  },
}
