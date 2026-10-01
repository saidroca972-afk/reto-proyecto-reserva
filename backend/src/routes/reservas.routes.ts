import { Hono } from 'hono'
import type { AppEnv } from '../types/context.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import {
  createReservationController,
  listReservationsController,
  updateReservationController,
} from '../controllers/reservas.controller.js'

export const reservasRoutes = new Hono<AppEnv>()

reservasRoutes.use('*', authMiddleware)
reservasRoutes.post('/', createReservationController)
reservasRoutes.put('/:id', updateReservationController)
reservasRoutes.patch('/:id', updateReservationController)
reservasRoutes.get('/', listReservationsController)
