import type { Alerta, ClasificacionTriaje, Cliente, Consulta, Mascota } from '@/types/db'

export type MascotaResumen = Pick<Mascota, 'id' | 'nombre' | 'especie' | 'raza'>

export type ClienteResumen = Pick<Cliente, 'id' | 'nombre' | 'telefono'>

export type ConsultaResumen = Pick<
  Consulta,
  'id' | 'mensaje_original' | 'clasificacion' | 'consejo_generado'
>

/**
 * Forma real que devuelve (o debería devolver) `listarAlertas()` en
 * `services/alertas.ts` — mismo criterio que `AlertaDetallada` de
 * `types/db.ts`, pero el `select` de ahí no trae `raza` ni
 * `consejo_generado`, que esta vista sí necesita para el panel de detalle.
 * Cuando se conecte a Supabase, ajustar el `SELECT_DETALLADA` del service
 * para incluirlos.
 */
export interface AlertaConDetalle extends Alerta {
  mascota: MascotaResumen | null
  cliente: ClienteResumen | null
  consulta: ConsultaResumen | null
}

export type FiltroUrgencia = ClasificacionTriaje | 'todas'
