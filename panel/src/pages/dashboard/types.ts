/**
 * Formas de datos que usa la UI del dashboard.
 *
 * Son deliberadamente más "planas" que los tipos de `src/types/db.ts` (ej.
 * `TurnoDetallado`, `AlertaDetallada`): acá se modela lo que la pantalla
 * necesita mostrar. Cuando este módulo se conecte a Supabase, cada uno de
 * estos tipos se arma mapeando el resultado del service correspondiente.
 */

export type UrgenciaAlerta = 'alta' | 'media'

export type TipoTurno = 'Consulta' | 'Control'

export interface TurnoDia {
  id: number
  nombreMascota: string
  raza: string
  hora: string
  tipo: TipoTurno
  avatarUrl?: string
}

export interface AlertaActiva {
  id: number
  nombreMascota: string
  raza: string
  urgencia: UrgenciaAlerta
  tiempoTranscurrido: string
  sintomas: string
  avatarUrl?: string
}

export interface MensajeWhatsapp {
  id: number
  telefono: string
  tiempoTranscurrido: string
  fragmento: string
  /** Texto completo del mensaje — se muestra en el HoverCard de la fila. */
  mensajeCompleto: string
}

export interface MetricaDashboard {
  id: string
  titulo: string
  valor: number
  variacion: string
  tonoVariacion: 'positivo' | 'negativo' | 'neutro'
}

export interface DetalleTriajeIA {
  vomitos: string
  frecuencia: string
  apetito: string
  nivelEnergia: string
  ultimaComida: string
}

export interface AlertaUrgente {
  mascotaId: number
  nombreMascota: string
  raza: string
  edad: string
  peso: string
  llegadaEstimada: string
  motivo: string
  triaje: DetalleTriajeIA
  recomendacion: string
  telefonoDueno: string
  nombreDueno: string
}
