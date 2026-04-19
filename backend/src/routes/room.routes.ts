import { Router } from 'express'
import {
  validateCreate,
  validateLeave,
} from '../domains/room/validations/index.js'
import { validateMiddleware } from '../middlewares/validation.middleware.js'
import { authenticateMiddleware } from '../infrastructure/authentication/middlewares/authenticate.middleware.js'
import { roomHandler } from '../infrastructure/room/handlers/room.handler.js'

const router = Router()

router.post(
  '/create',
  ...validateCreate,
  validateMiddleware,
  authenticateMiddleware,
  roomHandler.create
)

router.delete(
  '/leave',
  ...validateLeave,
  validateMiddleware,
  authenticateMiddleware,
  roomHandler.leave
)

router.get('/user', authenticateMiddleware, roomHandler.getRoomsByUser)

export default router
