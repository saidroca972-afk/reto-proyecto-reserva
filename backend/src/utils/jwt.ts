import { SignJWT, jwtVerify } from 'jose'
import { env } from '../config/env.js'
import type { AuthUser } from '../types/context.js'

const secret = new TextEncoder().encode(env.JWT_SECRET)

export async function createToken(user: AuthUser): Promise<string> {
  return new SignJWT({ usuario: user.usuario })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setSubject(String(user.id))
    .setIssuedAt()
    .setExpirationTime(env.JWT_EXPIRES_IN)
    .sign(secret)
}

export async function verifyToken(token: string): Promise<AuthUser> {
  const { payload } = await jwtVerify(token, secret, { algorithms: ['HS256'] })
  const id = Number(payload.sub)
  const usuario = typeof payload.usuario === 'string' ? payload.usuario : ''

  if (!Number.isInteger(id) || id <= 0 || !usuario) {
    throw new Error('JWT inválido')
  }

  return { id, usuario }
}
