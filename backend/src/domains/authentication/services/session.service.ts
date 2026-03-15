import { tokenRepository } from '../repositories/token.repository.js'
import {
  type CreateSessionResult,
  type RefreshSessionResult,
} from '../types/session.type.js'
import { type User } from '../../user/types/user.type.js'
import { tokenService } from '../../../infrastructure/authentication/services/token.service.js'
import { logger } from '../../../shared/utils/logger.js'
import { AppError } from '../../../shared/utils/errors.js'

export const sessionService = {
  create: async (userId: User['id']): Promise<CreateSessionResult> => {
    const { accessToken, refreshToken } = tokenService.generateTokens(userId)

    await tokenRepository.removeRefreshTokenByUserId(userId)
    await tokenRepository.saveRefreshToken(userId, refreshToken)

    return { accessToken, refreshToken }
  },

  invalidate: async (
    userId: User['id'],
    refreshToken: string
  ): Promise<void> => {
    const tokenPayload = tokenService.verifyRefreshToken(refreshToken)
    if (!tokenPayload) {
      throw new AppError('Неверный refresh token', 401)
    }

    const storedUserId = await tokenRepository.findRefreshToken(refreshToken)
    if (!storedUserId) {
      logger.warning(
        `Попытка выхода пользователя id: ${userId} с несуществующим refresh token: ${refreshToken}`
      )
      return
    }

    if (userId !== storedUserId) {
      throw new AppError('Несоответствие пользователя и токена', 401)
    }

    await tokenRepository.removeRefreshToken(userId, refreshToken)
  },

  refresh: async (refreshToken: string): Promise<RefreshSessionResult> => {
    const tokenPayload = tokenService.verifyRefreshToken(refreshToken)
    if (!tokenPayload) {
      throw new AppError('Неверный refresh token', 401)
    }

    const storedUserId = await tokenRepository.findRefreshToken(refreshToken)
    if (!storedUserId) {
      logger.warning(
        `Refresh token: ${refreshToken} для пользователя id: ${tokenPayload.userId} не найден или отозван`
      )
      throw new AppError('Неверный refresh token', 401)
    }

    if (tokenPayload.userId !== storedUserId) {
      logger.warning(
        `Рассогласование: токен для userId=${tokenPayload.userId}, но найден в Redis как для userId=${storedUserId}`
      )
      throw new AppError('Неверный refresh token', 401)
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      tokenService.generateTokens(storedUserId)

    await tokenRepository.removeRefreshToken(storedUserId, refreshToken)
    await tokenRepository.saveRefreshToken(storedUserId, newRefreshToken)

    return { newAccessToken, newRefreshToken }
  },
}
