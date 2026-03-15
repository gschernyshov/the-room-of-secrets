import { Request, Response } from 'express'
import { authService } from '../../../domains/authentication/services/auth.service.js'
import { parseTTL } from '../../../shared/utils/parseTTL.js'

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
      return res
        .status(error.statusCode)
        .json({ success: false, error: { message: error.message } })
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
      return res.status(error.statusCode).json({
        success: false,
        error: { message: error.message, type: error.type },
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
      return res
        .status(error.statusCode)
        .json({ success: false, error: { message: error.message } })
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
      return res
        .status(error.statusCode)
        .json({ success: false, error: { message: error.message } })
    }
  },
}
