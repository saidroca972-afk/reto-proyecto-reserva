import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { authRoutes } from './routes/auth.routes.js'
import { reservasRoutes } from './routes/reservas.routes.js'
import { errorMiddleware } from './middlewares/error.middleware.js'
import type { AppEnv } from './types/context.js'
import { env } from './config/env.js'
import { database } from './config/database.js'

export const app = new Hono<AppEnv>()

app.use('*', logger())
app.use('*', cors({
  origin: (origin) => {
    if (env.CORS_ORIGIN === '*') return '*'
    const allowedOrigins = env.CORS_ORIGIN.split(',').map((value) => value.trim())
    return allowedOrigins.includes(origin) ? origin : ''
  },
}))
app.onError(errorMiddleware)

app.get('/api/health', async (c) => {
  try {
    await database.query('SELECT 1')
    return c.json({ status: 'ok', database: 'connected' })
  } catch (error) {
    console.error('[database-health]', error)
    return c.json({ status: 'error', database: 'unavailable' }, 503)
  }
})
app.route('/api/auth', authRoutes)
app.route('/api/reservas', reservasRoutes)

app.notFound((c) => c.json({ error: { code: 'NOT_FOUND', message: 'Ruta no encontrada' } }, 404))
