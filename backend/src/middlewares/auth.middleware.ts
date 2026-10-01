import type { Context, Next } from 'hono'
import type { AppEnv } from '../types/context.js'
import { verifyToken } from '../utils/jwt.js'

export async function authMiddleware(c: Context<AppEnv>, next: Next): Promise<Response | void> {
  const header = c.req.header('Authorization')
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined

  if (!token) {
    return c.json({ error: { code: 'UNAUTHORIZED', message: 'Se requiere un token Bearer' } }, 401)
  }

  try {
    c.set('authUser', await verifyToken(token))
    await next()
  } catch {
    return c.json({ error: { code: 'UNAUTHORIZED', message: 'Token inválido o expirado' } }, 401)
  }
}
