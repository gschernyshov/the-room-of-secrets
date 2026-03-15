import { Router } from 'express'
import {
  validateUpdateUsername,
  validateUpdateEmail,
  validateUpdatePassword,
} from '../domains/user/validations/index.js'
import { validateMiddleware } from '../middlewares/validation.middleware.js'
import { authenticateMiddleware } from '../infrastructure/authentication/middlewares/authenticate.middleware.js'
import { userHandler } from '../infrastructure/user/handlers/user.handler.js'

const router = Router()

router.get('/me', authenticateMiddleware, userHandler.me)

router.post(
  '/update/username',
  ...validateUpdateUsername,
  validateMiddleware,
  authenticateMiddleware,
  userHandler.updateUsername
)

router.post(
  '/update/email',
  ...validateUpdateEmail,
  validateMiddleware,
  authenticateMiddleware,
  userHandler.updateEmail
)

router.post(
  '/update/password',
  ...validateUpdatePassword,
  validateMiddleware,
  authenticateMiddleware,
  userHandler.updatePassword
)

export default router
