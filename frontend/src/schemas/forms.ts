import { z } from 'zod'

export const loginFormSchema = z.object({
  usuario: z.string().trim().min(1, 'Ingresa tu usuario').max(15, 'Máximo 15 caracteres'),
  contrasena: z.string().min(1, 'Ingresa tu contraseña'),
})

export const reservationFormSchema = z.object({
  nombreCliente: z.string().trim().min(1, 'Ingresa el nombre del cliente').max(255),
  numeroCliente: z.string().trim().regex(/^\+?[0-9 ()-]{7,20}$/, 'Ingresa un teléfono válido'),
  estadoPedido: z.enum(['Disponible', 'Cancelado']),
  numeroMesa: z.coerce.number().int().positive('La mesa debe ser positiva'),
  fechaReserva: z.string().optional().refine(
    (value) => !value || !Number.isNaN(new Date(value).getTime()),
    'Ingresa una fecha válida',
  ),
})

export type LoginForm = z.infer<typeof loginFormSchema>
export type ReservationForm = z.infer<typeof reservationFormSchema>
