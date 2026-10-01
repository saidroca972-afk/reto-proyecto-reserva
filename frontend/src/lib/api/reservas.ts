import { apiRequest } from './client'
import type { Reservation, ReservationFilters, ReservationInput } from '../../types/api'

type BackendReservation = {
  Identificador: number
  NombreCliente: string
  NumeroCliente: string
  EstadoPedido: 'Disponible' | 'Cancelado'
  NumeroMesa: number
  FechaReserva: string
}

type ListResponse = { data: BackendReservation[] }
type ItemResponse = { data: BackendReservation }

function normalize(item: BackendReservation): Reservation {
  return {
    id: item.Identificador,
    nombreCliente: item.NombreCliente,
    numeroCliente: item.NumeroCliente,
    estadoPedido: item.EstadoPedido,
    numeroMesa: item.NumeroMesa,
    fechaReserva: item.FechaReserva,
  }
}

export async function listReservations(filters: ReservationFilters = {}): Promise<Reservation[]> {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== '') params.set(key, String(value))
  }
  const query = params.toString() ? `?${params.toString()}` : ''
  const response = await apiRequest<ListResponse>(`/reservas${query}`)
  return response.data.map(normalize)
}

export async function createReservation(input: ReservationInput): Promise<Reservation> {
  const response = await apiRequest<ItemResponse>('/reservas', {
    method: 'POST',
    body: JSON.stringify(input),
  })
  return normalize(response.data)
}

export async function updateReservation(id: number, input: Partial<ReservationInput>): Promise<Reservation> {
  const response = await apiRequest<ItemResponse>(`/reservas/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
  return normalize(response.data)
}
