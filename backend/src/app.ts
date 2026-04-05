import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import metricsRoutes from './routes/metrics.routes.js'
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import { registerMetrics } from './infrastructure/monitoring/metrics.js'

export const app = express()

app.use(
  cors({
    origin: process.env.CORS_ORIGINS || 'http://localhost:8003',
    credentials: true,
  })
)

app.use(cookieParser())
app.use(express.json({ limit: '10mb' }))
app.use(registerMetrics)

app.get('/metrics', metricsRoutes)

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
