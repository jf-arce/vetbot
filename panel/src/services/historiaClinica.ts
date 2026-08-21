import { desempaquetar, getSupabase } from '@/lib/supabase'
import type { HistoriaClinica } from '@/types/db'

/**
 * Historia clínica: el registro médico real de la mascota.
 * Ojo: NO es lo mismo que `consultas`, que es el log de triajes del bot.
 */

/** Entradas de historia clínica de una mascota, de la más nueva a la más vieja. */
export async function listarHistoriaClinica(
  mascotaId: string,
): Promise<HistoriaClinica[]> {
  return desempaquetar(
    await getSupabase()
      .from('historias_clinicas')
      .select('*')
      .eq('mascota_id', mascotaId)
      .order('fecha', { ascending: false }),
  )
}

/**
 * Serie de pesos para graficar la evolución en el tiempo.
 * Solo las entradas que registraron peso.
 */
export async function listarEvolucionPeso(
  mascotaId: string,
): Promise<Pick<HistoriaClinica, 'fecha' | 'peso_registrado'>[]> {
  return desempaquetar(
    await getSupabase()
      .from('historias_clinicas')
      .select('fecha, peso_registrado')
      .eq('mascota_id', mascotaId)
      .not('peso_registrado', 'is', null)
      .order('fecha', { ascending: true }),
  )
}
