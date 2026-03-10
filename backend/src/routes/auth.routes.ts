import { Router } from 'express'
import { authLimiterMiddleware } from '../middlewares/authLimter.middleware.js'
import {
  validateRegister,
  validateLogin,
  validateLogout,
  validateRefresh,
} from '../domains/authentication/validations/index.js'
import { validateMiddleware } from '../middlewares/validation.middleware.js'
import { authenticateMiddleware } from '../infrastructure/authentication/middlewares/authenticate.middleware.js'
import { authHandler } from '../infrastructure/authentication/handlers/auth.handler.js'

const router = Router()

router.post(
  '/register',
  authLimiterMiddleware,
  ...validateRegister,
  validateMiddleware,
  authHandler.register
)

router.post(
  '/login',
  authLimiterMiddleware,
  ...validateLogin,
  validateMiddleware,
  authHandler.login
)

router.post(
  '/logout',
  authLimiterMiddleware,
  ...validateLogout,
  validateMiddleware,
  authenticateMiddleware,
  authHandler.logout
)

router.post(
  '/refresh',
  authLimiterMiddleware,
  ...validateRefresh,
  validateMiddleware,
  authHandler.refresh
)

export default router
