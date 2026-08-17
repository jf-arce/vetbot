import type { MetricasDashboard } from '@/types/db'

/**
 * Métricas del dashboard.
 *
 * TODO(dev): estas cuentas NO se hacen en el frontend (bajar 3 tablas enteras
 * para contar filas es exactamente lo que hay que evitar). Van en Postgres
 * como vista o como función RPC, y acá solo se la llama. Coordinar con Dev 2:
 *
 *   -- en Supabase
 *   create or replace function metricas_dashboard()
 *   returns table (
 *     turnos_hoy int,
 *     consultas_resueltas_sin_turno int,
 *     alertas_activas int,
 *     recordatorios_enviados_hoy int,
 *     seguimientos_sin_respuesta int
 *   ) ...
 *
 * y después:
 *
 *   return desempaquetar<MetricasDashboard[]>(
 *     await getSupabase().rpc('metricas_dashboard'),
 *   )[0]
 *
 * Las 4 métricas pedidas en docs/vetbot-division-tareas.md son: turnos del día,
 * consultas resueltas sin turno, alertas activas y recordatorios enviados.
 */
export async function obtenerMetricas(): Promise<MetricasDashboard> {
  throw new Error('TODO: implementar la RPC metricas_dashboard en Supabase')
}
