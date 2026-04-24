import { z, object, string, email } from 'zod'

export const registerSchema = object({
  username: string('Некорректный формат username').min(
    2,
    'Username должен быть не короче 2 символов'
  ),
  email: email('Некорректный email'),
  password: string('Некорректный формат пароля').min(
    6,
    'Пароль должен быть не менее 6 символов'
  ),
})

export type RegisterData = z.infer<typeof registerSchema>
