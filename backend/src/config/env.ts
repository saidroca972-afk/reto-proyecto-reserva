import { config } from 'dotenv'
import { z } from 'zod'

// En desarrollo, el archivo backend/.env debe prevalecer sobre variables antiguas
// que hayan quedado definidas en la terminal o en otro proceso.
config({ override: true })

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().url().refine(
    (value) => value.startsWith('postgresql://') || value.startsWith('postgres://'),
    'DATABASE_URL debe utilizar el protocolo PostgreSQL',
  ),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET debe tener al menos 32 caracteres'),
  JWT_EXPIRES_IN: z.string().default('2h'),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(4).max(15).default(8),
  DATABASE_SSL: z.enum(['true', 'false']).default('true').transform((value) => value === 'true'),
  CORS_ORIGIN: z.string().default('*'),
  PORT: z.coerce.number().int().positive().default(3000),
})

export const env = envSchema.parse(process.env)
