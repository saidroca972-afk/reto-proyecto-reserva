import type { ErrorHandler } from 'hono'
import { ZodError } from 'zod'

type DatabaseError = Error & { code?: string }

function isDatabaseError(error: unknown): error is DatabaseError {
  if (!(error instanceof Error)) return false
  const code = (error as DatabaseError).code
  return ['ECONNREFUSED', 'ENOTFOUND', 'ETIMEDOUT', 'EAI_AGAIN', '57P01', '53300'].includes(code || '')
}

function getDatabaseResponse(error: DatabaseError, c: Parameters<ErrorHandler>[1]) {
  if (error.code === '28P01') {
    return c.json({ error: { code: 'DATABASE_AUTHENTICATION_FAILED', message: 'Las credenciales de PostgreSQL no son válidas' } }, 503)
  }
  if (error.code === '3D000') {
    return c.json({ error: { code: 'DATABASE_NOT_FOUND', message: 'La base de datos configurada no existe' } }, 503)
  }
  if (error.code === '42P01') {
    return c.json({ error: { code: 'DATABASE_SCHEMA_ERROR', message: 'No existe una tabla requerida en PostgreSQL' } }, 500)
  }
  return c.json({ error: { code: 'DATABASE_UNAVAILABLE', message: 'No se puede conectar con PostgreSQL' } }, 503)
}

export const errorMiddleware: ErrorHandler = (error, c) => {
  if (error instanceof ZodError) {
    return c.json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Los datos enviados no son válidos',
        details: error.issues,
      },
    }, 400)
  }

  console.error('[api-error]', error)
  if (isDatabaseError(error) || ['28P01', '3D000', '42P01'].includes((error as DatabaseError).code || '')) {
    return getDatabaseResponse(error as DatabaseError, c)
  }
  const message = process.env.NODE_ENV === 'development' && error instanceof Error
    ? error.message
    : 'Error interno del servidor'
  return c.json({ error: { code: 'INTERNAL_ERROR', message } }, 500)
}
