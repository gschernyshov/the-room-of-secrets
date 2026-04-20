import { Request, Response } from 'express'
import { authService } from '../../../domains/authentication/services/auth.service.js'
import { parseTTL } from '../../../shared/utils/parseTTL.js'
import { AppError } from '../../../shared/utils/errors.js'

const REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_TOKEN_EXPIRES_IN

const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
  maxAge: parseTTL(REFRESH_TOKEN_EXPIRES_IN) * 1000,
}

const CLEAR_REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
}

export const authHandler = {
  register: async (req: Request, res: Response): Promise<Response> => {
    const { username, email, password } = req.body

    try {
      const { refreshToken, ...data } = await authService.register(
        username,
        email,
        password
      )

      res.cookie('refreshToken', refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS)

      return res.status(201).json({
        success: true,
        data,
      })
    } catch (error) {
      if (error instanceof AppError)
        return res
          .status(error.statusCode)
          .json({ success: false, error: { message: error.message } })

      return res.status(500).json({
        success: false,
        error: {
          message:
            'При регистрации пользователя возникла непредвиденная ошибка',
        },
      })
    }
  },

  login: async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body

    try {
      const { refreshToken, ...data } = await authService.login(email, password)

      res.cookie('refreshToken', refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS)

      return res.status(200).json({
        success: true,
        data,
      })
    } catch (error) {
      if (error instanceof AppError)
        return res.status(error.statusCode).json({
          success: false,
          error: { message: error.message, type: error.type },
        })

      return res.status(500).json({
        success: false,
        error: {
          message:
            'При аутентификации пользователя возникла непредвиденная ошибка',
        },
      })
    }
  },

  logout: async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user.id
    const refreshToken = req.cookies.refreshToken

    res.clearCookie('refreshToken', CLEAR_REFRESH_TOKEN_COOKIE_OPTIONS)

    try {
      await authService.logout(userId, refreshToken)

      return res.status(200).json({ success: true })
    } catch (error) {
      if (error instanceof AppError)
        return res
          .status(error.statusCode)
          .json({ success: false, error: { message: error.message } })

      return res.status(500).json({
        success: false,
        error: {
          message: 'При выходе из системы возникла непредвиденная ошибка',
        },
      })
    }
  },

  refresh: async (req: Request, res: Response): Promise<Response> => {
    const refreshToken = req.cookies.refreshToken

    res.clearCookie('refreshToken', CLEAR_REFRESH_TOKEN_COOKIE_OPTIONS)

    try {
      const { newAccessToken, newRefreshToken } =
        await authService.refresh(refreshToken)

      res.cookie('refreshToken', newRefreshToken, REFRESH_TOKEN_COOKIE_OPTIONS)

      return res.status(200).json({ success: true, data: { newAccessToken } })
    } catch (error) {
      if (error instanceof AppError)
        return res
          .status(error.statusCode)
          .json({ success: false, error: { message: error.message } })

      return res.status(500).json({
        success: false,
        error: {
          message:
            'При выдаче access token и refresh token возникла непредвиденная ошибка',
        },
      })
    }
  },
}
