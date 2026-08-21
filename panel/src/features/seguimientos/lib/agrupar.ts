import { addDays, isSameDay, startOfDay } from 'date-fns'

import type { GrupoTablero } from '../types'

function fechaDe(fechaProgramada: string) {
  return new Date(`${fechaProgramada}T00:00:00`)
}

/**
 * `fecha_programada` es `date` en Postgres (sin hora) — se ancla a
 * medianoche local para comparar contra la fecha de referencia (el
 * `DatePicker` del header, no necesariamente "hoy" real).
 *
 * El tablero solo tiene 3 columnas: `null` = fuera de la ventana
 * vencido/hoy/mañana (igual se cuenta en el KPI "Próximos 7 días").
 */
export function grupoDeFecha(fechaProgramada: string, fechaReferencia: Date): GrupoTablero | null {
  const fecha = fechaDe(fechaProgramada)
  const referencia = startOfDay(fechaReferencia)

  if (isSameDay(fecha, referencia)) return 'hoy'
  if (isSameDay(fecha, addDays(referencia, 1))) return 'manana'
  if (fecha < referencia) return 'vencidos'
  return null
}

export function estaEnProximos7Dias(fechaProgramada: string, fechaReferencia: Date): boolean {
  const fecha = fechaDe(fechaProgramada)
  const referencia = startOfDay(fechaReferencia)
  const limite = addDays(referencia, 6)
  return fecha >= referencia && fecha <= limite
}
