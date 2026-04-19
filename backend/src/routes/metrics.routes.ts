import { Router } from 'express'
import { register } from 'prom-client'
import { getMetrics } from '../infrastructure/monitoring/metrics.js'

const router = Router()

router.get('/metrics', async (_, res) => {
  try {
    const metrics = await getMetrics()

    res.set('Content-Type', register.contentType)
    res.send(metrics)
  } catch (error) {
    res
      .status(500)
      .end(error instanceof Error ? error.message : 'Внутренняя ошибка сервера')
  }
})

export default router
