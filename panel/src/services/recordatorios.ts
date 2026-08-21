import { desempaquetar, getSupabase } from '@/lib/supabase'
import type { Mascota, Recordatorio } from '@/types/db'

/**
 * Recordatorios de vacuna / desparasitación / control.
 * Los envía el cron de las 9am (wf 07) y marca `enviado = true`.
 */

export type RecordatorioConMascota = Recordatorio & {
  mascota: Pick<Mascota, 'id' | 'nombre' | 'especie'> | null
}

/** Recordatorios que vencen en los próximos `dias` y todavía no se enviaron. */
export async function listarRecordatoriosProximos(
  dias = 7,
): Promise<RecordatorioConMascota[]> {
  const hasta = new Date()
  hasta.setDate(hasta.getDate() + dias)

  return desempaquetar(
    await getSupabase()
      .from('recordatorios')
      .select('*, mascota:mascotas(id, nombre, especie)')
      .eq('enviado', false)
      .lte('fecha_vencimiento', hasta.toISOString().slice(0, 10))
      .order('fecha_vencimiento', { ascending: true }),
  )
}

export async function listarRecordatoriosDeMascota(
  mascotaId: string,
): Promise<Recordatorio[]> {
  return desempaquetar(
    await getSupabase()
      .from('recordatorios')
      .select('*')
      .eq('mascota_id', mascotaId)
      .order('fecha_vencimiento', { ascending: true }),
  )
}

/**
 * TODO(dev): "reenviar recordatorio" manda un WhatsApp real, así que no va
 * contra Supabase: es un POST al webhook que exponga n8n (mismo criterio que
 * `cancelarTurno` en `services/turnos.ts`).
 */
export async function reenviarRecordatorio(recordatorioId: string): Promise<void> {
  throw new Error(`TODO: reenviar recordatorio ${recordatorioId} vía webhook de n8n`)
}
