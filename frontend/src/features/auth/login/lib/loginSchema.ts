import { z, string, object } from 'zod'

export const loginSchema = object({
  email: string().email('Некорректный email'),
  password: string().min(6, 'Пароль должен быть не менее 6 символов'),
})

export type LoginFormData = z.infer<typeof loginSchema>
