import type { Cliente, DireccionMensaje, EstadoSeguimiento, Mascota, Seguimiento, Turno } from '@/types/db'

export type MascotaResumen = Pick<Mascota, 'id' | 'nombre' | 'especie'>

export type ClienteResumen = Pick<Cliente, 'id' | 'nombre' | 'telefono'>

export interface TurnoResumen extends Pick<Turno, 'id' | 'motivo' | 'fecha_hora'> {
  mascota: MascotaResumen | null
  cliente: ClienteResumen | null
}

/** Mismo shape que `mensajes` (real: `direccion`, `contenido`, `created_at`) — el hilo que arma el Sheet de auditoría. */
export interface MensajeChat {
  direccion: DireccionMensaje
  contenido: string
  created_at: string
}

/**
 * Forma real que debería devolver `listarSeguimientos()` en
 * `services/seguimientos.ts` — su `SELECT_DETALLADO` ya trae `turno` con el
 * join a `mascotas`/`clientes`/`consultas`; acá solo se listan los campos que
 * esta vista consume.
 *
 * `resumenIa` y `chat` NO son columnas reales de `seguimientos` — no existe
 * hoy un campo para el resumen del estado del paciente ni una forma de traer
 * el hilo de `mensajes` asociado a un seguimiento puntual (esa tabla se
 * relaciona por `cliente_id`, no por `seguimiento_id`). Quedan tipados acá
 * como lo que el mock necesita para la UI; si el equipo quiere esto de
 * verdad, hace falta una columna nueva (o una vista que calcule el resumen)
 * y una consulta a `mensajes` filtrada por cliente + rango de fechas.
 */
export interface SeguimientoConDetalle extends Seguimiento {
  turno: TurnoResumen | null
  resumenIa: string
  chat: MensajeChat[]
  /** Simulado en el frontend — no hay un mecanismo real todavía para pausar al bot para un cliente puntual. */
  botPausado: boolean
}

export type GrupoTablero = 'vencidos' | 'hoy' | 'manana'

export type EstadoBot = 'esperando' | 'consultando' | 'sin_respuesta' | 'completado' | 'pausado'

export type { EstadoSeguimiento }
