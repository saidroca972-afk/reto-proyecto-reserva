import type { Context } from 'hono'
import type { AppEnv } from '../types/context.js'
import { parseJson, parseQuery } from '../middlewares/validation.middleware.js'
import {
  createReservationSchema,
  reservationFiltersSchema,
  reservationIdSchema,
  updateReservationSchema,
} from '../schemas/reservas.schema.js'
import { editReservation, getReservations, registerReservation } from '../services/reservas.service.js'

export async function createReservationController(c: Context<AppEnv>) {
  const input = await parseJson(c, createReservationSchema)
  const reservation = await registerReservation(input)
  return c.json({ data: reservation }, 201)
}

export async function updateReservationController(c: Context<AppEnv>) {
  const id = reservationIdSchema.parse(c.req.param('id'))
  const input = await parseJson(c, updateReservationSchema)
  const reservation = await editReservation(id, input)

  if (!reservation) {
    return c.json({ error: { code: 'NOT_FOUND', message: 'Reserva no encontrada' } }, 404)
  }

  return c.json({ data: reservation })
}

export async function listReservationsController(c: Context<AppEnv>) {
  const filters = parseQuery(c, reservationFiltersSchema)
  const reservations = await getReservations(filters)
  return c.json({ data: reservations })
}
