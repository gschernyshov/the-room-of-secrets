import { body } from 'express-validator'

export const validateUpdateUsername = [
  body('newUsername')
    .exists()
    .withMessage('Username обязателен')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Username не может быть пустым')
    .bail()
    .isLength({ min: 2 })
    .withMessage('Username должен быть не короче 2 символов'),
]
