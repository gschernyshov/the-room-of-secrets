import { type RegisterFormData } from '../lib/registerSchema'

export const initRegisterData: RegisterFormData = {
  username: '',
  email: '',
  password: '',
}

export const fieldNames = Object.keys(initRegisterData) as Array<
  keyof RegisterFormData
>
