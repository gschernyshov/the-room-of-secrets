import { type LoginFormData } from '../lib/loginSchema'

export const initLoginFormData: LoginFormData = {
  email: '',
  password: '',
}

export const fieldNames = Object.keys(initLoginFormData) as Array<
  keyof LoginFormData
>
