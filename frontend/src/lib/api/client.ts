import { getToken, clearSession } from '../session'
import type { ApiError } from '../../types/api'

const API_URL = (import.meta.env.PUBLIC_API_URL || '/api').replace(/\/$/, '')

export class ApiRequestError extends Error {
  status: number
  code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
    this.code = code
  }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set('Content-Type', 'application/json')

  const token = getToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, { ...init, headers })
  } catch {
    throw new ApiRequestError('No se puede conectar con el backend', 0, 'API_UNAVAILABLE')
  }
  const body = await response.json().catch(() => ({})) as T & ApiError

  if (!response.ok) {
    if (response.status === 401) clearSession()
    const messages: Record<string, string> = {
      DATABASE_UNAVAILABLE: 'No se puede conectar con la base de datos',
      DATABASE_AUTHENTICATION_FAILED: 'Las credenciales de PostgreSQL no son válidas',
      DATABASE_NOT_FOUND: 'La base de datos configurada no existe',
      DATABASE_SCHEMA_ERROR: 'El esquema de PostgreSQL no está configurado',
      API_UNAVAILABLE: 'No se puede conectar con el backend',
    }
    throw new ApiRequestError(
      body.error?.message || messages[body.error?.code || ''] || 'No fue posible completar la solicitud',
      response.status,
      body.error?.code,
    )
  }

  return body as T
}
