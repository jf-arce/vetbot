import { desempaquetar, getSupabase } from '@/lib/supabase'
import type { EstadoTurno, TurnoDetallado } from '@/types/db'

/**
 * Turnos (wf 04 los ofrece, wf 05 los crea).
 *
 * El `select` con joins anidados es sintaxis de PostgREST: trae las relaciones
 * en una sola request. Los nombres de las relaciones dependen de cómo se
 * llamen las FKs en el schema final de Dev 2 — ajustar si no matchean.
 */

const SELECT_DETALLADO = `
  *,
  mascota:mascotas(id, nombre, especie),
  cliente:clientes(id, nombre, telefono),
  consulta:consultas(id, clasificacion)
`

/** Turnos de un día puntual, ordenados por hora. Es la vista principal. */
export async function listarTurnosDelDia(fecha: Date): Promise<TurnoDetallado[]> {
  const desde = new Date(fecha)
  desde.setHours(0, 0, 0, 0)
  const hasta = new Date(desde)
  hasta.setDate(hasta.getDate() + 1)

  return desempaquetar(
    await getSupabase()
      .from('turnos')
      .select(SELECT_DETALLADO)
      .gte('fecha_hora', desde.toISOString())
      .lt('fecha_hora', hasta.toISOString())
      .order('fecha_hora', { ascending: true }),
  )
}

/** Próximos turnos a partir de ahora. `estados` filtra por estado si se pasa. */
export async function listarProximosTurnos(opciones?: {
  estados?: EstadoTurno[]
  limite?: number
}): Promise<TurnoDetallado[]> {
  let query = getSupabase()
    .from('turnos')
    .select(SELECT_DETALLADO)
    .gte('fecha_hora', new Date().toISOString())
    .order('fecha_hora', { ascending: true })
    .limit(opciones?.limite ?? 50)

  if (opciones?.estados?.length) {
    query = query.in('estado', opciones.estados)
  }

  return desempaquetar(await query)
}

/** Historial de turnos de una mascota, del más nuevo al más viejo. */
export async function listarTurnosDeMascota(
  mascotaId: string,
): Promise<TurnoDetallado[]> {
  return desempaquetar(
    await getSupabase()
      .from('turnos')
      .select(SELECT_DETALLADO)
      .eq('mascota_id', mascotaId)
      .order('fecha_hora', { ascending: false }),
  )
}

/** Cambio de estado que NO toca Google Calendar (ej: marcar "atendido"). */
export async function actualizarEstadoTurno(
  turnoId: string,
  estado: EstadoTurno,
): Promise<void> {
  desempaquetar(
    await getSupabase().from('turnos').update({ estado }).eq('id', turnoId),
  )
}

/**
 * TODO(dev): cancelar un turno NO va contra Supabase directo.
 * Tiene que borrar también el evento de Google Calendar
 * (`turnos.calendar_event_id`), y eso solo lo puede hacer n8n. Cuando Dev 2
 * exponga el webhook, esto es un POST a esa URL:
 *
 *   const res = await fetch(import.meta.env.VITE_N8N_WEBHOOK_CANCELAR_TURNO, {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ turno_id: turnoId, motivo }),
 *   })
 *   if (!res.ok) throw new Error('No se pudo cancelar el turno')
 *
 * Ver la tabla "quién habla con quién" en docs/vetbot-division-tareas.md.
 */
export async function cancelarTurno(turnoId: string, motivo?: string): Promise<void> {
  throw new Error(
    `TODO: cancelar turno ${turnoId}${motivo ? ` (${motivo})` : ''} vía webhook de n8n`,
  )
}
