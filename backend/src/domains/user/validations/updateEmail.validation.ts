import { body } from 'express-validator'

export const validateUpdateEmail = [
  body('email')
    .exists()
    .withMessage('Email обязателен')
    .bail()
    .isEmail()
    .withMessage('Некорректный email')
    .normalizeEmail(),
]
