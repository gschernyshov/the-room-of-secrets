import { Router } from 'express'
import {
  validateRegister,
  validateLogin,
  validateLogout,
  validateRefresh,
} from '../domains/authentication/validations/index.js'
import { authHandler } from '../infrastructure/authentication/handlers/auth.handler.js'
import { validateMiddleware } from '../middlewares/validation.middleware.js'
import { authenticateMiddleware } from '../infrastructure/authentication/middlewares/authenticate.middleware.js'

const router = Router()

router.post(
  '/register',
  ...validateRegister,
  validateMiddleware,
  authHandler.register
)

router.post('/login', ...validateLogin, validateMiddleware, authHandler.login)

router.post(
  '/logout',
  authenticateMiddleware,
  ...validateLogout,
  validateMiddleware,
  authHandler.logout
)

router.post(
  '/refresh',
  ...validateRefresh,
  validateMiddleware,
  authHandler.refresh
)

router.get('/state', authenticateMiddleware, (_, res) => {
  return res
    .status(200)
    .json({ success: true, data: { message: 'Пользователь авторизован' } })
})

export default router
