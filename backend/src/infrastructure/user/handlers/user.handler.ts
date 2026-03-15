import { Request, Response } from 'express'
import { userService } from '../../../domains/user/services/user.service.js'

export const userHandler = {
  me: async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user.id

    try {
      const user = await userService.me(userId)

      res.status(200).json({
        succces: true,
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
    const { newUsername } = req.body

    try {
      await userService.updateUsername(userId, newUsername)

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
    const { newEmail } = req.body

    try {
      await userService.updateEmail(userId, newEmail)

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
    const { newPassword } = req.body

    try {
      await userService.updatePassword(userId, newPassword)

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
