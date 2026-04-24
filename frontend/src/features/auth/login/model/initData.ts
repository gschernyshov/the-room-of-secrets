import { type LoginData } from './schema'

export const initLoginData: LoginData = {
  email: '',
  password: '',
}

export const fieldNames = Object.keys(initLoginData) as Array<keyof LoginData>
