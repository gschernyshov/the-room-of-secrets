import { Token } from '../../../infrastructure/authentication/types/token.type.js'

export type CreateSessionResult = Record<'accessToken' | 'refreshToken', Token>
export type RefreshSessionResult = Record<
  'newAccessToken' | 'newRefreshToken',
  Token
>
