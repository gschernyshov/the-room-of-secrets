import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'

export const app = express()

app.use(
  cors({
    origin: process.env.CORS_ORIGINS || 'http://localhost:8003',
    credentials: true,
  })
)

app.use(cookieParser())
app.use(express.json({ limit: '10mb' }))

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
