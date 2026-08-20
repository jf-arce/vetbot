export type EstadoMascota = 'activo' | 'fallecido'

export type SexoMascota = 'macho' | 'hembra'

/** Ficha completa de la mascota — lo que pinta `MascotaHeader`. */
export interface MascotaDetalle {
  id: string
  nombre: string
  especie: string
  raza: string
  sexo: SexoMascota
  edad: string
  peso: string
  esterilizado: boolean
  estado: EstadoMascota
  /** Alergias, condiciones crónicas — mismo contexto que usa Claude en el triaje. Vacío = sin notas. */
  notasGenerales: string
  clienteNombre: string
  clienteTelefono: string
}

/**
 * `historia_clinica` (visitas reales) y `consultas` (triajes del bot) son
 * entidades distintas en el schema, pero comparten la misma línea de tiempo
 * en esta pantalla — `origen` es lo que las distingue acá.
 */
export type TipoEventoHistoria = 'consulta' | 'vacuna' | 'cirugia' | 'tratamiento' | 'control'

export type ClasificacionTriaje = 'baja' | 'media' | 'alta'

export interface EventoHistoria {
  id: string
  origen: 'historia_clinica' | 'triaje'
  fecha: Date
  tipo: TipoEventoHistoria
  descripcion: string
  veterinario?: string
  /** Solo presente cuando `origen === 'triaje'`. */
  clasificacion?: ClasificacionTriaje
}

export interface RecordatorioMascota {
  id: string
  tipo: 'vacuna' | 'desparasitacion' | 'control'
  fechaVencimiento: Date
  enviado: boolean
}

/** Valores del formulario de `MascotaEditView` — todo como el usuario lo tipea/selecciona. */
export interface MascotaFormValues {
  nombre: string
  especie: 'canino' | 'felino' | 'otro'
  raza: string
  /** String controlado por el <Input type="number">; se castea a number recién al armar el payload. */
  peso: string
  sexo: SexoMascota
  esterilizado: boolean
  estado: EstadoMascota
  notas_generales: string
}
