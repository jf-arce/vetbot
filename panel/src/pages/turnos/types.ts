import type { EstadoTurno } from '@/types/db'

/**
 * Formas de datos que usa la UI de Turnos. Igual que en `pages/dashboard/types.ts`,
 * son más "planas" que `TurnoDetallado` de `types/db.ts`: acá se modela lo que
 * la tabla necesita mostrar. Cuando el módulo se conecte a Supabase, se arma
 * mapeando el resultado de `listarTurnosDelDia` / `listarProximosTurnos`.
 */

/** Sale de `turno.consulta.clasificacion` (triaje del wf 02, Dev 1). */
export type PrioridadTurno = 'alta' | 'media' | 'baja'

export interface TurnoFila {
  id: number
  fechaHora: Date
  nombreMascota: string
  especie: 'perro' | 'gato' | 'otro'
  /** `notas_generales` de la mascota — dispara el ícono de alerta con Tooltip. */
  notaManejo: string | null
  nombreDueno: string
  veterinario: string
  motivo: string
  /** `null` = turno pedido directo, no pasó por triaje. */
  prioridad: PrioridadTurno | null
  estado: EstadoTurno
}
