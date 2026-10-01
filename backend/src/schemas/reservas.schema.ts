import { z } from 'zod'

const phoneSchema = z.string().trim().regex(/^\+?[0-9 ()-]{7,20}$/, 'Número telefónico inválido')

export const createReservationSchema = z.object({
  nombreCliente: z.string().trim().min(1).max(255),
  numeroCliente: phoneSchema,
  estadoPedido: z.enum(['Disponible', 'Cancelado']),
  numeroMesa: z.coerce.number().int().positive(),
  fechaReserva: z.coerce.date().optional(),
})

export const updateReservationSchema = createReservationSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  'Debe enviarse al menos un campo para actualizar',
)

export const reservationIdSchema = z.coerce.number().int().positive()

export const reservationFiltersSchema = z.object({
  estado: z.enum(['Disponible', 'Cancelado']).optional(),
  numeroMesa: z.coerce.number().int().positive().optional(),
  nombreCliente: z.string().trim().min(1).optional(),
  fechaDesde: z.coerce.date().optional(),
  fechaHasta: z.coerce.date().optional(),
}).refine(
  (value) => !value.fechaDesde || !value.fechaHasta || value.fechaDesde <= value.fechaHasta,
  'fechaDesde no puede ser posterior a fechaHasta',
)
