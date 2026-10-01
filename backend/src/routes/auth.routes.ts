import { Hono } from 'hono'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import type { AppEnv } from '../types/context.js'
import { loginController, logoutController } from '../controllers/auth.controller.js'

export const authRoutes = new Hono<AppEnv>()

authRoutes.post('/login', loginController)
authRoutes.post('/logout', authMiddleware, logoutController)
