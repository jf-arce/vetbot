import { desempaquetar, getSupabase } from '@/lib/supabase'
import type { EstadoSeguimiento, SeguimientoDetallado } from '@/types/db'

/**
 * Seguimientos post-turno: los crea el cron del wf 06 a las 48hs de un turno
 * atendido. El panel solo los lee — quien los responde es el dueño por
 * WhatsApp y quien los actualiza es el wf 01.
 */

const SELECT_DETALLADO = `
  *,
  turno:turnos(
    *,
    mascota:mascotas(id, nombre, especie),
    cliente:clientes(id, nombre, telefono),
    consulta:consultas(id, clasificacion)
  )
`

export async function listarSeguimientos(
  estado?: EstadoSeguimiento,
): Promise<SeguimientoDetallado[]> {
  let query = getSupabase()
    .from('seguimientos')
    .select(SELECT_DETALLADO)
    .order('fecha_programada', { ascending: false })

  if (estado) {
    query = query.eq('estado', estado)
  }

  return desempaquetar(await query)
}
