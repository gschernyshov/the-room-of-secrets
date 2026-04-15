import { Request, Response } from 'express'
import { userService } from '../../../domains/user/services/user.service.js'

export const userHandler = {
  me: async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user.id

    try {
      const user = await userService.me(userId)

      res.status(200).json({
        success: true,
        data: user,
      })
    } catch (error) {
      res
        .status(error.statusCode)
        .json({ success: false, error: { message: error.message } })
    }
  },

  updateUsername: async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user.id
    const { username } = req.body

    try {
      await userService.updateUsername(userId, username)

      res.status(200).json({
        success: true,
      })
    } catch (error) {
      res
        .status(error.statusCode)
        .json({ success: false, error: { message: error.message } })
    }
  },

  updateEmail: async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user.id
    const { email } = req.body

    try {
      await userService.updateEmail(userId, email)

      res.status(200).json({
        success: true,
      })
    } catch (error) {
      res
        .status(error.statusCode)
        .json({ success: false, error: { message: error.message } })
    }
  },

  updatePassword: async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user.id
    const { password } = req.body

    try {
      await userService.updatePassword(userId, password)

      res.status(200).json({
        success: true,
      })
    } catch (error) {
      res
        .status(error.statusCode)
        .json({ success: false, error: { message: error.message } })
    }
  },
}
