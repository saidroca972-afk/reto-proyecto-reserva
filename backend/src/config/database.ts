import { Pool } from 'pg'
import { env } from './env.js'

export const database = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: env.DATABASE_SSL ? { rejectUnauthorized: false } : undefined,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
})

export async function closeDatabase(): Promise<void> {
  await database.end()
}
