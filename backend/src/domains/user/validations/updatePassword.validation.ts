import { body } from 'express-validator'

export const validateUpdatePassword = [
  body('password')
    .exists()
    .withMessage('Пароль обязателен')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Пароль не может быть пустым')
    .bail()
    .isLength({ min: 6 })
    .withMessage('Пароль должен быть не менее 6 символов'),
]
