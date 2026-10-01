import { apiRequest } from './client'
import { saveToken, clearSession } from '../session'
import type { LoginResponse } from '../../types/api'

export async function login(usuario: string, contrasena: string): Promise<void> {
  const response = await apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ usuario, contrasena }),
  })
  saveToken(response.token)
}

export async function logout(): Promise<void> {
  try {
    await apiRequest('/auth/logout', { method: 'POST' })
  } finally {
    clearSession()
  }
}
