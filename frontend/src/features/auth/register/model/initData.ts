import { type RegisterData } from './schema'

export const initRegisterData: RegisterData = {
  username: '',
  email: '',
  password: '',
}

export const fieldNames = Object.keys(initRegisterData) as Array<
  keyof RegisterData
>
