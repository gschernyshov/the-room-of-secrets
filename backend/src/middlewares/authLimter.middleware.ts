import { rateLimit } from 'express-rate-limit'

export const authLimiterMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'development' ? 100 : 5,
  message: {
    success: false,
    error: { message: 'Превышено количество запросов к серверу' },
  },
})
