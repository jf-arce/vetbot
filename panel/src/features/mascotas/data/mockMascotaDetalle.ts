import type { EventoHistoria, MascotaDetalle, RecordatorioMascota } from '../types'

/**
 * Datos mockeados para maquetar la ficha de mascota sin esperar al schema
 * real (mismo criterio que `pages/turnos/data/mockTurnos.ts`). Reemplazar por
 * `obtenerMascota` / `listarHistoriaClinica` / `listarRecordatoriosDeMascota`
 * de `services/mascotas.ts` cuando el schema esté cerrado.
 *
 * Todas las fechas están ancladas cerca de "hoy" (agosto 2026) para que la
 * demo se vea coherente sin importar cuándo se corra.
 */

function fecha(dia: number, mesIndice: number, anio = 2026): Date {
  return new Date(anio, mesIndice, dia)
}

export const MASCOTA_DETALLE_MOCK: MascotaDetalle = {
  id: '3',
  nombre: 'Rocky',
  especie: 'Perro',
  raza: 'Bulldog Francés',
  sexo: 'macho',
  edad: '4 años',
  peso: '12.5 kg',
  esterilizado: true,
  estado: 'activo',
  notasGenerales:
    'Raza braquicéfala — propenso a dificultad respiratoria con calor o esfuerzo. Alérgico a la amoxicilina.',
  clienteNombre: 'Diego Álvarez',
  clienteTelefono: '+54 9 11 3344-3456',
}

export const HISTORIA_MOCK: EventoHistoria[] = [
  {
    id: 'evt-1',
    origen: 'triaje',
    fecha: fecha(17, 7),
    tipo: 'consulta',
    descripcion:
      'Dueño reportó tos seca y dificultad para respirar tras paseo con calor. Triaje clasificó como urgencia alta por antecedente de raza braquicéfala.',
    clasificacion: 'alta',
  },
  {
    id: 'evt-2',
    origen: 'historia_clinica',
    fecha: fecha(15, 7),
    tipo: 'consulta',
    descripcion: 'Control por el episodio respiratorio. Buena evolución, sin signos de distrés.',
    veterinario: 'Dra. Carla Ibáñez',
  },
  {
    id: 'evt-3',
    origen: 'historia_clinica',
    fecha: fecha(28, 6),
    tipo: 'vacuna',
    descripcion: 'Refuerzo antirrábico anual.',
    veterinario: 'Dr. Martín Sosa',
  },
  {
    id: 'evt-4',
    origen: 'triaje',
    fecha: fecha(10, 6),
    tipo: 'consulta',
    descripcion: 'Consulta por picazón en las patas. Se recomendó baño con shampoo dermatológico.',
    clasificacion: 'baja',
  },
  {
    id: 'evt-5',
    origen: 'historia_clinica',
    fecha: fecha(2, 2),
    tipo: 'cirugia',
    descripcion: 'Castración. Sin complicaciones post-quirúrgicas.',
    veterinario: 'Dra. Carla Ibáñez',
  },
  {
    id: 'evt-6',
    origen: 'historia_clinica',
    fecha: fecha(14, 0),
    tipo: 'control',
    descripcion: 'Control de peso y chequeo general de rutina.',
    veterinario: 'Dr. Martín Sosa',
  },
]

export const RECORDATORIOS_MOCK: RecordatorioMascota[] = [
  {
    id: 'rec-1',
    tipo: 'desparasitacion',
    fechaVencimiento: fecha(28, 7),
    enviado: false,
  },
  {
    id: 'rec-2',
    tipo: 'control',
    fechaVencimiento: fecha(15, 8),
    enviado: false,
  },
  {
    id: 'rec-3',
    tipo: 'vacuna',
    fechaVencimiento: fecha(28, 5, 2027),
    enviado: false,
  },
]
