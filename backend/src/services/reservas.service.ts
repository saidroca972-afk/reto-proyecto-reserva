import {
  createReservation,
  findReservationById,
  listReservations,
  updateReservation,
  type ReservationFilters,
  type ReservationInput,
} from '../repositories/reservas.repository.js'

export async function registerReservation(input: ReservationInput) {
  const id = await createReservation(input)
  return findReservationById(id)
}

export async function editReservation(id: number, input: ReservationInput) {
  const updated = await updateReservation(id, input)
  if (!updated) return undefined
  return findReservationById(id)
}

export function getReservations(filters: ReservationFilters) {
  return listReservations(filters)
}
