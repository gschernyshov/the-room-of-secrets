import { body } from 'express-validator'

export const validateUpdateEmail = [
  body('newEmail')
    .exists()
    .withMessage('Email обязателен')
    .bail()
    .isEmail()
    .withMessage('Некорректный email')
    .normalizeEmail(),
]
