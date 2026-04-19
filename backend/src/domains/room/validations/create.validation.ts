import { body } from 'express-validator'

export const validateCreate = [
  body('name')
    .exists()
    .withMessage('Имя комнаты обязательно')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('Имя комнаты не может быть пустым')
    .bail()
    .isLength({ min: 2 })
    .withMessage('Имя комнаты должно быть не короче 2 символов'),
]
