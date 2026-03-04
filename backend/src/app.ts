import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'

export const app = express()

app.use(cors({ origin: process.env.CORS_ORIGINS || 'http://localhost:3003' }))
app.use(cors())
app.use(express.json({ limit: '10mb' }))

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
