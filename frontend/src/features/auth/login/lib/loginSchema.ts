import { z, object, email, string } from 'zod'

export const loginSchema = object({
  email: email('Некорректный email'),
  password: string('Некорректный формат пароля').min(
    6,
    'Пароль должен быть не менее 6 символов'
  ),
})

export type LoginFormData = z.infer<typeof loginSchema>
