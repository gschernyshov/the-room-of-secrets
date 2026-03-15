import { cookie } from 'express-validator'

export const validateRefresh = [
  cookie('refreshToken')
    .exists()
    .withMessage('Refresh token обязателен')
    .bail()
    .notEmpty()
    .withMessage('Refresh token не может быть пустым'),
]
