export type Administrator = {
  Identificador: number
  Usuario: string
  Contrasena: string
}

export type Reservation = {
  Identificador: number
  NombreCliente: string
  NumeroCliente: string
  EstadoPedido: 'Disponible' | 'Cancelado'
  NumeroMesa: number
  FechaReserva: string
}
