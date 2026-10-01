import { findByUsername } from '../repositories/administrador.repository.js'
import { comparePassword } from '../utils/password.js'
import { createToken } from '../utils/jwt.js'

export async function login(usuario: string, contrasena: string): Promise<string> {
  const administrator = await findByUsername(usuario)

  if (!administrator || !(await comparePassword(contrasena, administrator.Contrasena))) {
    throw new Error('INVALID_CREDENTIALS')
  }

  return createToken({ id: administrator.Identificador, usuario: administrator.Usuario })
}
