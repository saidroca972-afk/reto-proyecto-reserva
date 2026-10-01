import { database } from '../config/database.js'
import type { Administrator } from '../types/models.js'

export async function findByUsername(usuario: string): Promise<Administrator | undefined> {
  const result = await database.query<Administrator>(
    'SELECT identificador AS "Identificador", usuario AS "Usuario", contrasena AS "Contrasena" FROM administrador WHERE usuario = $1 LIMIT 1',
    [usuario],
  )
  return result.rows[0]
}
