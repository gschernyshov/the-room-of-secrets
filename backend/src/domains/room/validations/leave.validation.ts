import { body } from 'express-validator'

export const validateLeave = [
  body('id')
    .exists()
    .withMessage('ID комнаты обязательно')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('ID комнаты не может быть пустым')
    .bail()
    .isUUID(4)
    .withMessage('ID комнаты должно быть корректным UUID v4'),
]
