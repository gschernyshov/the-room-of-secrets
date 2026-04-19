import { Request, Response } from 'express'
import { userService } from '../../../domains/user/services/user.service.js'
import { AppError } from '../../../shared/utils/errors.js'

export const userHandler = {
  me: async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user.id

    try {
      const user = await userService.me(userId)

      return res.status(200).json({
        success: true,
        data: user,
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
            'При запросе данных пользователя возникла непредвиденная ошибка',
        },
      })
    }
  },

  updateUsername: async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user.id
    const username = req.body.username

    try {
      await userService.updateUsername(userId, username)

      return res.status(200).json({
        success: true,
      })
    } catch (error) {
      if (error instanceof AppError)
        return res
          .status(error.statusCode)
          .json({ success: false, error: { message: error.message } })

      return res.status(500).json({
        success: false,
        error: {
          message: 'При обновлении username возникла непредвиденная ошибка',
        },
      })
    }
  },

  updateEmail: async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user.id
    const email = req.body.email

    try {
      await userService.updateEmail(userId, email)

      return res.status(200).json({
        success: true,
      })
    } catch (error) {
      if (error instanceof AppError)
        return res
          .status(error.statusCode)
          .json({ success: false, error: { message: error.message } })

      return res.status(500).json({
        success: false,
        error: {
          message: 'При обновлении email возникла непредвиденная ошибка',
        },
      })
    }
  },

  updatePassword: async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user.id
    const password = req.body.password

    try {
      await userService.updatePassword(userId, password)

      return res.status(200).json({
        success: true,
      })
    } catch (error) {
      if (error instanceof AppError)
        return res
          .status(error.statusCode)
          .json({ success: false, error: { message: error.message } })

      return res.status(500).json({
        success: false,
        error: {
          message: 'При обновлении пароля возникла непредвиденная ошибка',
        },
      })
    }
  },
}
