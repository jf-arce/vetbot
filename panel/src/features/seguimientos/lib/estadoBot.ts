import { startOfDay } from 'date-fns'

import type { EstadoBot, SeguimientoConDetalle } from '../types'

/**
 * Traduce el `estado` real de `seguimientos` (pendiente/respondido/sin_respuesta)
 * más la fecha programada a un estado de proceso del bot para auditoría.
 * `esperando`/`consultando` son la misma fila con `estado = 'pendiente'`,
 * diferenciadas por si el cron todavía no llegó a esa fecha o ya la pasó.
 * `pausado` es un override 100% de frontend (ver `SeguimientoConDetalle.botPausado`).
 */
export function estadoBotDe(
  seguimiento: Pick<SeguimientoConDetalle, 'estado' | 'fecha_programada' | 'botPausado'>,
  fechaReferencia: Date,
): EstadoBot {
  if (seguimiento.botPausado) return 'pausado'
  if (seguimiento.estado === 'respondido') return 'completado'
  if (seguimiento.estado === 'sin_respuesta') return 'sin_respuesta'

  const fecha = new Date(`${seguimiento.fecha_programada}T00:00:00`)
  return fecha > startOfDay(fechaReferencia) ? 'esperando' : 'consultando'
}
