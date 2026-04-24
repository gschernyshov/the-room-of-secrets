import { z, object, string } from 'zod'

export const changePasswordSchema = object({
  password: string('Некорректный формат пароля').min(
    6,
    'Пароль должен быть не менее 6 символов'
  ),
})

export type ChangePassword = z.infer<typeof changePasswordSchema>

export type FieldKey = keyof ChangePassword
