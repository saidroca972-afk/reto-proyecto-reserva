export type ApiError = {
  error?: {
    code?: string
    message?: string
    details?: unknown[]
  }
}

export type LoginResponse = {
  message: string
  token: string
}

export type Reservation = {
  id: number
  nombreCliente: string
  numeroCliente: string
  estadoPedido: 'Disponible' | 'Cancelado'
  numeroMesa: number
  fechaReserva: string
}

export type ReservationInput = {
  nombreCliente: string
  numeroCliente: string
  estadoPedido: 'Disponible' | 'Cancelado'
  numeroMesa: number
  fechaReserva?: string
}

export type ReservationFilters = {
  estado?: 'Disponible' | 'Cancelado'
  numeroMesa?: number
  nombreCliente?: string
  fechaDesde?: string
  fechaHasta?: string
}
