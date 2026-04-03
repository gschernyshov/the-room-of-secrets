import { Router } from 'express'
import { register } from 'prom-client'
import { getMetrics } from '../monitoring/metrics.js'

const router = Router()

router.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType)
    const metrics = await getMetrics()
    res.send(metrics)
  } catch (err) {
    res.status(500).end(err.message)
  }
})

export default router
