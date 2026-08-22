/**
 * Tipos de las entidades de la base de datos.
 *
 * Espejo del schema real del proyecto Supabase "Veterinaria Bot"
 * (`brhswrfgdexiumqisuql`), consultado vía MCP el 2026-08-20. Se mantiene
 * como interfaces nombradas (no el `Database` crudo de
 * `supabase gen types`) para no forzar a `src/services/` a reescribirse
 * contra el shape genérico `Tables<'x'>` — si en algún momento se quiere
 * ese nivel de fidelidad, regenerar con:
 *
 *   npx supabase gen types typescript --project-id brhswrfgdexiumqisuql > src/types/db.ts.raw
 *
 * y portar los cambios a mano.
 *
 * Nota sobre nulos: se usa `| null` (no `?`) en los campos opcionales porque es
 * lo que devuelve Postgres para una columna nullable.
 */

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export type EstadoCliente = 'activo' | 'inactivo'

/** Enum real `Especie` — no se limita a perro/gato, la clínica atiende exóticos. */
export type Especie =
  | 'perro'
  | 'gato'
  | 'hamster'
  | 'caballo'
  | 'conejo'
  | 'huron'
  | 'cobayo'
  | 'chinchilla'
  | 'loro'
  | 'guacamayo'
  | 'periquito'
  | 'canario'
  | 'cacatúa'
  | 'ninfas'
  | 'gallina'
  | 'pato'
  | 'ganso'
  | 'paloma'
  | 'búho'
  | 'tortuga'
  | 'iguana'
  | 'vaca'
  | 'toro'
  | 'cerdo'
  | 'oveja'
  | 'cabra'
  | 'llama'
  | 'alpaca'
  | 'pony'
  | 'burro'
  | 'mula'
  | 'pez'

export type Sexo = 'macho' | 'hembra'

export type EstadoMascota = 'vivo' | 'fallecido'

/** El corazón de la máquina de estados del router (wf 01). */
export type EstadoConversacion =
  | 'libre'
  | 'esperando_confirmacion_turno'
  | 'esperando_eleccion_horario'
  | 'esperando_datos_registro'
  | 'esperando_respuesta_seguimiento'
  | 'esperando_eleccion_mascota'

export type DireccionMensaje = 'entrante' | 'saliente'

export type TipoHistoriaClinica =
  | 'consulta'
  | 'vacuna'
  | 'cirugia'
  | 'tratamiento'
  | 'control'

/** Resultado del triaje de síntomas (wf 02): 🟢 baja / 🟡 media / 🔴 alta. */
export type ClasificacionTriaje = 'baja' | 'media' | 'alta'

export type EstadoTurno =
  | 'pendiente'
  | 'confirmado'
  | 'atendido'
  | 'cancelado'
  | 'no_asistio'

export type EstadoSeguimiento = 'pendiente' | 'respondido' | 'sin_respuesta'

export type TipoRecordatorio = 'vacuna' | 'desparasitacion' | 'control'

export type EstadoAlerta = 'pendiente' | 'atendido'

export type DiaSemana =
  | 'lunes'
  | 'martes'
  | 'miercoles'
  | 'jueves'
  | 'viernes'
  | 'sabado'
  | 'domingo'

// ---------------------------------------------------------------------------
// Entidades
// ---------------------------------------------------------------------------

/** El dueño de la mascota — es quien escribe por WhatsApp. */
export interface Cliente {
  id: string
  nombre: string
  /** Clave de matcheo de cada mensaje entrante. Único e indexado. */
  telefono: string
  email: string | null
  direccion: string | null
  estado: EstadoCliente
  created_at: string
}

export interface Mascota {
  id: string
  cliente_id: string
  nombre: string
  especie: Especie
  raza: string | null
  fecha_nacimiento: string | null
  sexo: Sexo
  peso: number | null
  castrado: boolean
  estado: EstadoMascota
  /** Alergias, condiciones crónicas — contexto rápido para el triaje. */
  notas_generales: string | null
  created_at: string
}

/**
 * Estado volátil de la charla: una fila por cliente que se SOBREESCRIBE.
 * No es un historial — para eso está `mensajes`.
 */
export interface Conversacion {
  id: string
  cliente_id: string
  estado: EstadoConversacion
  /** Datos parciales de un flujo multi-paso (mascota a medio registrar, etc.). */
  contexto: Record<string, unknown> | null
  /** Typo real de la columna en el DDL: `update_at`, no `updated_at`. */
  update_at: string
}

/** El log real de la charla — esta tabla sí se acumula. Alimenta el feed. */
export interface Mensaje {
  id: string
  cliente_id: string | null
  direccion: DireccionMensaje
  contenido: string
  created_at: string
  telefono: string | null
  wa_message_id: string | null
}

/** El registro médico real — distinto de `consultas`, que es el log del bot. */
export interface HistoriaClinica {
  id: string
  mascota_id: string
  turno_id: string | null
  fecha: string
  tipo: TipoHistoriaClinica
  diagnostico: string
  tratamiento_indicado: string
  peso_registrado: number | null
  veterinario: string | null
  /** URL de un estudio/radiografía. En el schema real es un único texto, no un array. */
  adjuntos: string | null
  notas: string | null
}

/** Log de cada triaje del bot (wf 02) — no es historia clínica. */
export interface Consulta {
  id: string
  mascota_id: string | null
  conversacion_id: string | null
  /** El síntoma tal cual lo describió el dueño. */
  mensaje_original: string
  clasificacion: ClasificacionTriaje
  /** Lo que devolvió Claude, para poder auditar después. */
  consejo_generado: string
  created_at: string
}

export interface Turno {
  id: string
  mascota_id: string
  cliente_id: string
  /** Presente si el turno nació de un triaje (wf 02 → wf 04). */
  consulta_id: string | null
  /** Puente hacia el evento real en Google Calendar. */
  calendar_event_id: string
  fecha_hora: string
  motivo: string
  estado: EstadoTurno
  created_at: string
}

/** Seguimiento post-turno a las 48hs (wf 06). */
export interface Seguimiento {
  id: string
  turno_id: string | null
  fecha_programada: string
  respuesta: string | null
  fecha_respuesta: string | null
  estado: EstadoSeguimiento
  created_at: string
}

/** Recordatorios proactivos que envía el cron diario de las 9am (wf 07). */
export interface Recordatorio {
  id: string
  mascota_id: string | null
  tipo: TipoRecordatorio
  fecha_vencimiento: string
  enviado: boolean
  fecha_envio: string | null
  created_at: string
}

/** Alerta urgente generada por un triaje 🔴 (wf 08). */
export interface Alerta {
  id: string
  consulta_id: string | null
  mascota_id: string | null
  cliente_id: string | null
  /** Resumen del caso generado por Claude, para no leer toda la charla. */
  resumen_caso: string
  estado: EstadoAlerta
  atendido_por: string | null
  created_at: string
}

/** Horario de la clínica como dato editable, no hardcodeado en el workflow. */
export interface HorarioAtencion {
  id: string
  dia_semana: DiaSemana
  hora_apertura: string
  hora_cierre: string
  /** `false` marca el día como cerrado sin borrar la fila. */
  activo: boolean
  created_at: string
}

/** Feriados o cierres puntuales que rompen el patrón semanal. */
export interface ExcepcionHorario {
  id: string
  fecha: string
  cerrado: boolean
  hora_apertura: string | null
  hora_cierre: string | null
  motivo: string | null
  created_at: string
}

/**
 * Parámetros globales en formato clave-valor: sumar un parámetro nuevo no
 * requiere migrar el schema. El valor se castea según la clave.
 */
export interface ConfiguracionGeneral {
  clave: ClaveConfiguracion | (string & {})
  valor: string
}

/** Claves usadas por los workflows hasta ahora (wf 04), más las que edita el panel en Configuración → Perfil. */
export type ClaveConfiguracion =
  /** Tamaño de cada bloque al calcular huecos libres. Ej: "30". */
  | 'duracion_turno_minutos'
  /** Hasta cuántos días a futuro se consulta disponibilidad. Ej: "7". */
  | 'dias_anticipacion'
  /** Cuántas opciones de horario se ofrecen por mensaje. Ej: "4". */
  | 'turnos_a_mostrar'
  /** A quién le llega la alerta urgente (wf 08). Hoy en `<a completar>` — pendiente real de Dev 1. */
  | 'telefono_veterinario'
  /** Nombre de la clínica, para mostrar en el panel. No lo usa ningún workflow todavía. */
  | 'nombre_clinica'

// ---------------------------------------------------------------------------
// Tipos compuestos (lo que devuelven los joins de `src/services/`)
// ---------------------------------------------------------------------------

export interface MascotaConDueno extends Mascota {
  cliente: Pick<Cliente, 'id' | 'nombre' | 'telefono'> | null
}

export interface TurnoDetallado extends Turno {
  mascota: Pick<Mascota, 'id' | 'nombre' | 'especie'> | null
  cliente: Pick<Cliente, 'id' | 'nombre' | 'telefono'> | null
  /** Trae la clasificación del triaje que originó el turno, si hubo. */
  consulta: Pick<Consulta, 'id' | 'clasificacion'> | null
}

export interface AlertaDetallada extends Alerta {
  mascota: Pick<Mascota, 'id' | 'nombre' | 'especie'> | null
  cliente: Pick<Cliente, 'id' | 'nombre' | 'telefono'> | null
  consulta: Pick<Consulta, 'id' | 'mensaje_original' | 'clasificacion'> | null
}

export interface SeguimientoDetallado extends Seguimiento {
  turno: TurnoDetallado | null
}

/**
 * Métricas del dashboard. Se calculan en Postgres (vista o función RPC,
 * todavía no existe — ver `src/services/dashboard.ts`), NO sumando filas en
 * el frontend.
 */
export interface MetricasDashboard {
  turnos_hoy: number
  consultas_resueltas_sin_turno: number
  alertas_activas: number
  recordatorios_enviados_hoy: number
  seguimientos_sin_respuesta: number
}
