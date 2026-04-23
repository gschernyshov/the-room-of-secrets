import { z, string, email } from 'zod'

export const changeInfoSchema = z
  .object({
    username: string('Некорректный формат username')
      .min(2, 'Username должен быть не короче 2 символов')
      .optional(),
    email: email('Некорректный email').optional(),
  })
  .refine(data => data.username !== undefined || data.email !== undefined, {
    path: ['root'],
    message: 'Укажите хотя бы одно поле',
  })

export type ChangeInfoFormData = z.infer<typeof changeInfoSchema>

export type FieldKey = keyof ChangeInfoFormData
