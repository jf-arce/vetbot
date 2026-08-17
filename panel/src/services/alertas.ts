import { desempaquetar, getSupabase } from '@/lib/supabase'
import type { AlertaDetallada, EstadoAlerta } from '@/types/db'

/**
 * Alertas urgentes: las crea el wf 08 cuando el triaje del wf 02 da 🔴.
 * Quedan visibles hasta que un humano las marca como atendidas desde acá —
 * es la única escritura importante del panel además del estado de turnos.
 */

const SELECT_DETALLADA = `
  *,
  mascota:mascotas(id, nombre, especie),
  cliente:clientes(id, nombre, telefono),
  consulta:consultas(id, mensaje_original, clasificacion)
`

export async function listarAlertas(
  estado?: EstadoAlerta,
): Promise<AlertaDetallada[]> {
  let query = getSupabase()
    .from('alertas')
    .select(SELECT_DETALLADA)
    .order('created_at', { ascending: false })

  if (estado) {
    query = query.eq('estado', estado)
  }

  return desempaquetar(await query)
}

/** Marca la alerta como atendida. `atendidoPor` es texto libre por ahora. */
export async function marcarAlertaAtendida(
  alertaId: number,
  atendidoPor: string,
): Promise<void> {
  desempaquetar(
    await getSupabase()
      .from('alertas')
      .update({ estado: 'atendido' satisfies EstadoAlerta, atendido_por: atendidoPor })
      .eq('id', alertaId),
  )
}
