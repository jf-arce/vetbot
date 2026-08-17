/**
 * Tipos de las entidades de la base de datos.
 *
 * ⚠️ Esto es un espejo MANUAL del schema descripto en
 * `docs/vetbot-arquitectura-completa.md`. Es lo que hay hasta que Dev 2 cierre
 * el DDL definitivo. Cuando exista el schema real en Supabase, reemplazar todo
 * este archivo por los tipos generados:
 *
 *   npx supabase gen types typescript --project-id <id> > src/types/db.ts
 *
 * Nota sobre nulos: se usa `| null` (no `?`) en los campos opcionales porque es
 * lo que devuelve Postgres para una columna nullable.
 */

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export type EstadoCliente = 'activo' | 'inactivo'

export type Especie = 'perro' | 'gato' | 'otro'

export type Sexo = 'macho' | 'hembra'

export type EstadoMascota = 'activo' | 'fallecido'

/** El corazón de la máquina de estados del router (wf 01). */
export type EstadoConversacion =
  | 'libre'
  | 'esperando_confirmacion_turno'
  | 'esperando_eleccion_horario'
  | 'esperando_datos_registro'
  | 'esperando_respuesta_seguimiento'

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
  id: number
  nombre: string
  /** Clave de matcheo de cada mensaje entrante. Único e indexado. */
  telefono: string
  email: string | null
  direccion: string | null
  estado: EstadoCliente
  created_at: string
}

export interface Mascota {
  id: number
  cliente_id: number
  nombre: string
  especie: Especie
  raza: string | null
  fecha_nacimiento: string | null
  sexo: Sexo | null
  peso: number | null
  esterilizado: boolean | null
  estado: EstadoMascota
  /** Alergias, condiciones crónicas — contexto rápido para el triaje. */
  notas_generales: string | null
}

/**
 * Estado volátil de la charla: una fila por cliente que se SOBREESCRIBE.
 * No es un historial — para eso está `mensajes`.
 */
export interface Conversacion {
  id: number
  cliente_id: number
  estado: EstadoConversacion
  /** Datos parciales de un flujo multi-paso (mascota a medio registrar, etc.). */
  contexto: Record<string, unknown> | null
  updated_at: string
}

/** El log real de la charla — esta tabla sí se acumula. Alimenta el feed. */
export interface Mensaje {
  id: number
  cliente_id: number
  direccion: DireccionMensaje
  contenido: string
  timestamp: string
}

/** El registro médico real — distinto de `consultas`, que es el log del bot. */
export interface HistoriaClinica {
  id: number
  mascota_id: number
  turno_id: number | null
  fecha: string
  tipo: TipoHistoriaClinica
  diagnostico: string | null
  tratamiento_indicado: string | null
  peso_registrado: number | null
  veterinario: string | null
  /** URLs de estudios, radiografías. */
  adjuntos: string[] | null
  notas: string | null
}

/** Log de cada triaje del bot (wf 02) — no es historia clínica. */
export interface Consulta {
  id: number
  mascota_id: number | null
  conversacion_id: number
  /** El síntoma tal cual lo describió el dueño. */
  mensaje_original: string
  clasificacion: ClasificacionTriaje
  /** Lo que devolvió Claude, para poder auditar después. */
  consejo_generado: string | null
  created_at: string
}

export interface Turno {
  id: number
  mascota_id: number
  cliente_id: number
  /** Presente si el turno nació de un triaje (wf 02 → wf 04). */
  consulta_id: number | null
  /** Puente hacia el evento real en Google Calendar. */
  calendar_event_id: string | null
  fecha_hora: string
  motivo: string | null
  estado: EstadoTurno
  created_at: string
}

/** Seguimiento post-turno a las 48hs (wf 06). */
export interface Seguimiento {
  id: number
  turno_id: number
  fecha_programada: string
  respuesta: string | null
  fecha_respuesta: string | null
  estado: EstadoSeguimiento
}

/** Recordatorios proactivos que envía el cron diario de las 9am (wf 07). */
export interface Recordatorio {
  id: number
  mascota_id: number
  tipo: TipoRecordatorio
  fecha_vencimiento: string
  enviado: boolean
  fecha_envio: string | null
}

/** Alerta urgente generada por un triaje 🔴 (wf 08). */
export interface Alerta {
  id: number
  consulta_id: number
  mascota_id: number
  cliente_id: number
  /** Resumen del caso generado por Claude, para no leer toda la charla. */
  resumen_caso: string
  estado: EstadoAlerta
  atendido_por: string | null
  created_at: string
}

/** Opcional — solo si la clínica tiene más de un veterinario. */
export interface Veterinario {
  id: number
  nombre: string
  telefono: string
  activo: boolean
}

/** Horario de la clínica como dato editable, no hardcodeado en el workflow. */
export interface HorarioAtencion {
  id: number
  dia_semana: DiaSemana
  hora_apertura: string
  hora_cierre: string
  /** `false` marca el día como cerrado sin borrar la fila. */
  activo: boolean
}

/** Feriados o cierres puntuales que rompen el patrón semanal. */
export interface ExcepcionHorario {
  id: number
  fecha: string
  cerrado: boolean
  hora_apertura: string | null
  hora_cierre: string | null
  motivo: string | null
}

/**
 * Parámetros globales en formato clave-valor: sumar un parámetro nuevo no
 * requiere migrar el schema. El valor se castea según la clave.
 */
export interface ConfiguracionGeneral {
  clave: ClaveConfiguracion | (string & {})
  valor: string
}

/** Claves usadas por los workflows hasta ahora (wf 04). */
export type ClaveConfiguracion =
  /** Tamaño de cada bloque al calcular huecos libres. Ej: "30". */
  | 'duracion_turno_minutos'
  /** Hasta cuántos días a futuro se consulta disponibilidad. Ej: "7". */
  | 'dias_anticipacion'
  /** Cuántas opciones de horario se ofrecen por mensaje. Ej: "4". */
  | 'turnos_a_mostrar'

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
 * Métricas del dashboard. Se calculan en Postgres (vista o función RPC),
 * NO sumando filas en el frontend. Ver `src/services/dashboard.ts`.
 */
export interface MetricasDashboard {
  turnos_hoy: number
  consultas_resueltas_sin_turno: number
  alertas_activas: number
  recordatorios_enviados_hoy: number
  seguimientos_sin_respuesta: number
}
