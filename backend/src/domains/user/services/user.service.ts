import {
  UPDATED_USERNAME,
  UPDATED_EMAIL,
  UPDATED_PASSWORD,
} from '../events/index.js'
import { userRepository } from '../repositories/user.repository.js'
import { type User } from '../types/user.type.js'
import { passwordService } from '../../../infrastructure/authentication/services/crypto.service.js'
import { eventBus } from '../../../infrastructure/events/eventBus.js'
import { logger } from '../../../shared/utils/logger.js'
import { AppError } from '../../../shared/utils/errors.js'

export const userService = {
  me: async (userId: User['id']): Promise<User> => {
    try {
      const user = await userRepository.findById(userId)
      if (!user) {
        throw new AppError('Пользователь не найден', 404)
      }

      return user
    } catch (error) {
      throw new AppError(
        'При получении пользователя возникла непредвиденная ошибка',
        500
      )
    }
  },

  updateUsername: async (
    userId: User['id'],
    newUsername: User['username']
  ): Promise<void> => {
    try {
      logger.info(
        `Пользователь id: ${userId} обновляет username на ${newUsername}`
      )

      const user = await userRepository.findById(userId)
      if (!user) {
        throw new AppError('Пользователь не найден', 404)
      }
      if (user.username === newUsername) {
        return
      }

      await userRepository.updateUsername(userId, newUsername)

      eventBus.emit(UPDATED_USERNAME, user)
    } catch (error) {
      logger.error(
        `При обновлении username пользователя id: ${userId} возникла ошибка': ${error.message.toLowerCase()}`
      )

      if (error instanceof AppError) {
        throw error
      }

      throw new AppError(
        'При обновлении username возникла непредвиденная ошибка',
        500
      )
    }
  },

  updateEmail: async (
    userId: User['id'],
    newEmail: User['email']
  ): Promise<void> => {
    try {
      logger.info(`Пользователь id: ${userId} обновляет email на ${newEmail}`)

      const user = await userRepository.findById(userId)
      if (!user) {
        throw new AppError('Пользователь не найден', 404)
      }
      if (user.email === newEmail) {
        return
      }

      await userRepository.updateEmail(userId, newEmail)

      eventBus.emit(UPDATED_EMAIL, user)
    } catch (error) {
      logger.error(
        `При обновлении email пользователя id: ${userId} возникла непредвиденная ошибка: ${error.message.toLowerCase()}`
      )

      if (error instanceof AppError) {
        throw error
      }

      throw new AppError(
        'При обновлении email возникла непредвиденная ошибка',
        500
      )
    }
  },

  updatePassword: async (
    userId: User['id'],
    newPassword: User['password']
  ): Promise<void> => {
    try {
      logger.info(`Пользователь id: ${userId} обновляет пароль`)

      const user = await userRepository.findById(userId)
      if (!user) {
        throw new AppError('Пользователь не найден', 404)
      }

      const hashedPassword = await passwordService.hash(newPassword)

      await userRepository.updatePassword(userId, hashedPassword)

      eventBus.emit(UPDATED_PASSWORD, user)
    } catch (error) {
      logger.error(
        `При обновлении пароля пользователя id: ${userId} возникла непредвиденная ошибка: ${error.message.toLowerCase()}`
      )

      if (error instanceof AppError) {
        throw error
      }

      throw new AppError(
        'При обновлении пароля возникла непредвиденная ошибка',
        500
      )
    }
  },
}
