export type Token = string

export type TokenPayload = {
  sub: string
  userId: number
  iat: number
  exp: number
}
