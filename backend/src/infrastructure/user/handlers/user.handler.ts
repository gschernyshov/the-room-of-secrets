import { Request, Response } from 'express'
import { userService } from '../../../domains/user/services/user.service.js'

export const userHandler = {
  updateUsername: async (req: Request, res: Response) => {
    const userId = req.user.id
    const { newUsername } = req.body

    await userService.updateUsername(userId, newUsername)

    res.status(201).json({
      success: true,
    })

    try {
    } catch (error) {
      res
        .status(error.statusCode)
        .json({ success: false, error: { message: error.message } })
    }
  },

  updateEmail: async (req: Request, res: Response) => {
    const userId = req.user.id
    const { newEmail } = req.body

    await userService.updateEmail(userId, newEmail)

    res.status(201).json({
      success: true,
    })

    try {
    } catch (error) {
      res
        .status(error.statusCode)
        .json({ success: false, error: { message: error.message } })
    }
  },

  updatePassword: async (req: Request, res: Response) => {
    const userId = req.user.id
    const { newPassword } = req.body

    await userService.updatePassword(userId, newPassword)

    res.status(201).json({
      success: true,
    })

    try {
    } catch (error) {
      res
        .status(error.statusCode)
        .json({ success: false, error: { message: error.message } })
    }
  },
}
