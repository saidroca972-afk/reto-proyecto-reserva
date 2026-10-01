import type { Context } from 'hono'
import type { AppEnv } from '../types/context.js'
import { parseJson } from '../middlewares/validation.middleware.js'
import { loginSchema } from '../schemas/auth.schema.js'
import { login } from '../services/auth.service.js'

export async function loginController(c: Context<AppEnv>) {
  const input = await parseJson(c, loginSchema)

  try {
    const token = await login(input.usuario, input.contrasena)
    return c.json({ message: 'Inicio de sesión exitoso', token })
  } catch (error) {
    if (error instanceof Error && error.message === 'INVALID_CREDENTIALS') {
      return c.json({ error: { code: 'INVALID_CREDENTIALS', message: 'Usuario o contraseña incorrectos' } }, 401)
    }
    throw error
  }
}

export function logoutController(c: Context<AppEnv>) {
  return c.json({ message: 'Sesión cerrada. Elimine el token del cliente.' })
}
