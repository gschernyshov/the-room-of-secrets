import { Router } from 'express'
import {
  validateUpdateUsername,
  validateUpdateEmail,
  validateUpdatePassword,
} from '../domains/user/validations/index.js'
import { userHandler } from '../infrastructure/user/handlers/user.handler.js'
import { validateMiddleware } from '../middlewares/validation.middleware.js'
import { authenticateMiddleware } from '../infrastructure/authentication/middlewares/authenticate.middleware.js'

const router = Router()

router.post(
  '/update/username',
  authenticateMiddleware,
  ...validateUpdateUsername,
  validateMiddleware,
  userHandler.updateUsername
)

router.post(
  '/update/email',
  authenticateMiddleware,
  ...validateUpdateEmail,
  validateMiddleware,
  userHandler.updateEmail
)

router.post(
  '/update/password',
  authenticateMiddleware,
  ...validateUpdatePassword,
  validateMiddleware,
  userHandler.updatePassword
)

export default router
