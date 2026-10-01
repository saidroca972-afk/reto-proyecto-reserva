import type { Context } from 'hono'
import type { ZodSchema } from 'zod'

export async function parseJson<T>(c: Context, schema: ZodSchema<T>): Promise<T> {
  const body: unknown = await c.req.json()
  return schema.parse(body)
}

export function parseQuery<T>(c: Context, schema: ZodSchema<T>): T {
  return schema.parse(c.req.query())
}
