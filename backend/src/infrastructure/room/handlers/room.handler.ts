import { Request, Response } from 'express'
import { roomService } from '../../../domains/room/services/room.service.js'
import { userService } from '../../../domains/user/services/user.service.js'
import { AppError } from '../../../shared/utils/errors.js'
import { messageService } from '../../../domains/message/services/message.service.js'

export const roomHandler = {
  create: async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user.id
    const name = req.body.name

    try {
      const room = await roomService.create(name, userId)

      await userService.addRoom(userId, room.id)

      return res.status(200).json({
        success: true,
        data: room,
      })
    } catch (error) {
      if (error instanceof AppError)
        return res
          .status(error.statusCode)
          .json({ success: false, error: { message: error.message } })

      return res.status(500).json({
        success: false,
        error: {
          message: 'При создании комнаты возникла непредвиденная ошибка',
        },
      })
    }
  },

  leave: async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user.id
    const roomId = req.body.id

    try {
      const deletedRoom = await roomService.leave(roomId, userId)
      if (deletedRoom) messageService.deleteByRoomId(roomId)

      await userService.deleteRoom(userId, roomId)

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
          message: 'При выходе из комнаты возникла непредвиденная ошибка',
        },
      })
    }
  },

  getRoomsByUser: async (req: Request, res: Response): Promise<Response> => {
    const userId = req.user.id

    try {
      const rooms = await roomService.getRoomsByUser(userId)

      return res.status(200).json({
        success: true,
        data: rooms,
      })
    } catch (error) {
      if (error instanceof AppError)
        return res
          .status(error.statusCode)
          .json({ success: false, error: { message: error.message } })

      return res.status(500).json({
        success: false,
        error: {
          message: 'При получении комнат возникла непредвиденная ошибка',
        },
      })
    }
  },
}
