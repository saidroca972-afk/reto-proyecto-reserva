import { database } from '../config/database.js'

export type ReservationRow = {
  Identificador: number
  NombreCliente: string
  NumeroCliente: string
  EstadoPedido: 'Disponible' | 'Cancelado'
  NumeroMesa: number
  FechaReserva: Date
}

export type ReservationInput = {
  nombreCliente?: string
  numeroCliente?: string
  estadoPedido?: 'Disponible' | 'Cancelado'
  numeroMesa?: number
  fechaReserva?: Date
}

export type ReservationFilters = {
  estado?: 'Disponible' | 'Cancelado'
  numeroMesa?: number
  nombreCliente?: string
  fechaDesde?: Date
  fechaHasta?: Date
}

function toPostgresTimestamp(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`
}

export async function createReservation(input: ReservationInput): Promise<number> {
  const values: Array<string | number> = [input.nombreCliente!, input.numeroCliente!, input.estadoPedido!, input.numeroMesa!]
  let query = 'INSERT INTO tablareserva (nombrecliente, numerocliente, estadopedido, numeromesa) VALUES ($1, $2, $3, $4)'

  if (input.fechaReserva) {
    query = 'INSERT INTO tablareserva (nombrecliente, numerocliente, estadopedido, numeromesa, fechareserva) VALUES ($1, $2, $3, $4, $5)'
    values.push(toPostgresTimestamp(input.fechaReserva))
  }

  const result = await database.query<{ identificador: number }>(`${query} RETURNING identificador`, values)
  const row = result.rows[0]
  if (!row) throw new Error('No se pudo obtener el identificador de la reserva')
  return row.identificador
}

export async function updateReservation(id: number, input: ReservationInput): Promise<boolean> {
  const columns: string[] = []
  const values: Array<string | number> = []
  const mappings: Array<[keyof ReservationInput, string]> = [
    ['nombreCliente', 'NombreCliente'],
    ['numeroCliente', 'NumeroCliente'],
    ['estadoPedido', 'EstadoPedido'],
    ['numeroMesa', 'NumeroMesa'],
    ['fechaReserva', 'FechaReserva'],
  ]

  for (const [key, column] of mappings) {
    if (input[key] !== undefined) {
      const postgresColumn = column.toLowerCase()
      columns.push(`${postgresColumn} = $${values.length + 1}`)
      values.push(key === 'fechaReserva' && input[key] instanceof Date
        ? toPostgresTimestamp(input[key])
        : input[key] as string | number)
    }
  }

  values.push(id)
  const result = await database.query(`UPDATE tablareserva SET ${columns.join(', ')} WHERE identificador = $${values.length}`, values)
  return (result.rowCount ?? 0) > 0
}

export async function findReservationById(id: number): Promise<ReservationRow | undefined> {
  const result = await database.query<ReservationRow>(
    'SELECT identificador AS "Identificador", nombrecliente AS "NombreCliente", numerocliente AS "NumeroCliente", estadopedido AS "EstadoPedido", numeromesa AS "NumeroMesa", fechareserva AS "FechaReserva" FROM tablareserva WHERE identificador = $1',
    [id],
  )
  return result.rows[0]
}

export async function listReservations(filters: ReservationFilters): Promise<ReservationRow[]> {
  const conditions: string[] = []
  const values: Array<string | number> = []

  if (filters.estado) {
    conditions.push(`estadopedido = $${values.length + 1}`)
    values.push(filters.estado)
  }
  if (filters.numeroMesa !== undefined) {
    conditions.push(`numeromesa = $${values.length + 1}`)
    values.push(filters.numeroMesa)
  }
  if (filters.nombreCliente) {
    conditions.push(`nombrecliente ILIKE $${values.length + 1}`)
    values.push(`%${filters.nombreCliente}%`)
  }
  if (filters.fechaDesde) {
    conditions.push(`fechareserva >= $${values.length + 1}`)
    values.push(toPostgresTimestamp(filters.fechaDesde))
  }
  if (filters.fechaHasta) {
    conditions.push(`fechareserva <= $${values.length + 1}`)
    values.push(toPostgresTimestamp(filters.fechaHasta))
  }

  const where = conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : ''
  const result = await database.query<ReservationRow>(
    `SELECT identificador AS "Identificador", nombrecliente AS "NombreCliente", numerocliente AS "NumeroCliente", estadopedido AS "EstadoPedido", numeromesa AS "NumeroMesa", fechareserva AS "FechaReserva" FROM tablareserva${where} ORDER BY fechareserva ASC`,
    values,
  )
  return result.rows
}
