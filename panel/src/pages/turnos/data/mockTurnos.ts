import type { TurnoFila } from '../types'

/**
 * Datos mockeados para maquetar Turnos sin esperar al schema real de Dev 2
 * (mismo criterio que `pages/dashboard/data/mockDashboard.ts`). Reemplazar por
 * `listarTurnosDelDia` / `listarProximosTurnos` de `services/turnos.ts` cuando
 * el schema esté cerrado.
 */

function hoyA(hora: number, minuto: number): Date {
  const fecha = new Date()
  fecha.setHours(hora, minuto, 0, 0)
  return fecha
}

export const TURNOS_MOCK: TurnoFila[] = [
  {
    id: 1,
    fechaHora: hoyA(9, 0),
    nombreMascota: 'Zeus',
    especie: 'perro',
    notaManejo:
      'Muy enérgico: se asusta e hiperventila con ruidos fuertes o explosiones (fuegos artificiales, tormentas, bocinas).',
    nombreDueno: 'Martina Gómez',
    veterinario: 'Dra. Carla Ibáñez',
    motivo: 'Control',
    prioridad: null,
    estado: 'confirmado',
  },
  {
    id: 2,
    fechaHora: hoyA(9, 30),
    nombreMascota: 'Luna',
    especie: 'gato',
    notaManejo: null,
    nombreDueno: 'Ezequiel Paz',
    veterinario: 'Dr. Martín Sosa',
    motivo: 'Vacuna',
    prioridad: 'baja',
    estado: 'pendiente',
  },
  {
    id: 3,
    fechaHora: hoyA(10, 15),
    nombreMascota: 'Rocky',
    especie: 'perro',
    notaManejo: 'Raza braquicéfala — vigilar de cerca ante signos de dificultad respiratoria.',
    nombreDueno: 'Sofía Herrera',
    veterinario: 'Dra. Carla Ibáñez',
    motivo: 'Urgencia',
    prioridad: 'alta',
    estado: 'confirmado',
  },
  {
    id: 4,
    fechaHora: hoyA(11, 0),
    nombreMascota: 'Nala',
    especie: 'gato',
    notaManejo: null,
    nombreDueno: 'Julián Torres',
    veterinario: 'Dra. Lucía Fernández',
    motivo: 'Control',
    prioridad: null,
    estado: 'pendiente',
  },
  {
    id: 5,
    fechaHora: hoyA(11, 45),
    nombreMascota: 'Michi',
    especie: 'gato',
    notaManejo: 'Se estresa fácil con el transporte — dejar reposar unos minutos antes de manipular.',
    nombreDueno: 'Valentina Ríos',
    veterinario: 'Dr. Martín Sosa',
    motivo: 'Consulta',
    prioridad: 'media',
    estado: 'confirmado',
  },
  {
    id: 6,
    fechaHora: hoyA(13, 30),
    nombreMascota: 'Coco',
    especie: 'perro',
    notaManejo: null,
    nombreDueno: 'Ramiro Acosta',
    veterinario: 'Dra. Lucía Fernández',
    motivo: 'Vacuna',
    prioridad: null,
    estado: 'atendido',
  },
  {
    id: 7,
    fechaHora: hoyA(14, 0),
    nombreMascota: 'Thor',
    especie: 'perro',
    notaManejo: null,
    nombreDueno: 'Ariana Correa',
    veterinario: 'Dr. Martín Sosa',
    motivo: 'Consulta',
    prioridad: 'media',
    estado: 'pendiente',
  },
  {
    id: 8,
    fechaHora: hoyA(15, 15),
    nombreMascota: 'Bruno',
    especie: 'perro',
    notaManejo: null,
    nombreDueno: 'Camila Suárez',
    veterinario: 'Dra. Carla Ibáñez',
    motivo: 'Cirugía menor',
    prioridad: 'baja',
    estado: 'cancelado',
  },
  {
    id: 9,
    fechaHora: hoyA(16, 0),
    nombreMascota: 'Simba',
    especie: 'gato',
    notaManejo: null,
    nombreDueno: 'Nicolás Vega',
    veterinario: 'Dra. Lucía Fernández',
    motivo: 'Consulta',
    prioridad: 'baja',
    estado: 'no_asistio',
  },
]

export const VETERINARIOS_MOCK: string[] = Array.from(
  new Set(TURNOS_MOCK.map((turno) => turno.veterinario)),
)
