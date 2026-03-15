import jwt from 'jsonwebtoken'
import { type Token, type TokenPayload } from '../types/token.type.js'
import { type User } from '../../../domains/user/types/user.type.js'

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET
const ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_ACCESS_TOKEN_EXPIRES_IN
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET
const REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_TOKEN_EXPIRES_IN

type GenerateTokensResult = Record<'accessToken' | 'refreshToken', Token>
type VerifyTokenResult = TokenPayload | null

export const tokenService = {
  generateTokens: (userId: User['id']): GenerateTokensResult => {
    const accessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    })

    const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    })

    return { accessToken, refreshToken }
  },

  verifyToken: (token: string): VerifyTokenResult => {
    try {
      return jwt.verify(token, ACCESS_TOKEN_SECRET)
    } catch (_) {
      return null
    }
  },

  verifyRefreshToken: (token: string): VerifyTokenResult => {
    try {
      return jwt.verify(token, REFRESH_TOKEN_SECRET)
    } catch (_) {
      return null
    }
  },
}
