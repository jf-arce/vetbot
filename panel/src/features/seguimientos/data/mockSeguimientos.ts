import type { SeguimientoConDetalle } from '../types'

/**
 * Mock temporal — se reemplaza por `listarSeguimientos()`
 * (`services/seguimientos.ts`) cuando el wf 06 empiece a escribir filas
 * reales. Fechas ancladas al 20 de agosto de 2026 (el default del
 * `DatePicker` del header) para que el tablero muestre algo en las 3
 * columnas sin depender de la fecha real del sistema.
 *
 * Respeta nombres de columna y enums del schema real de Supabase (ver
 * `src/types/db.ts`): `fecha_programada` es `date` (sin hora), `motivo` vive
 * en `turnos` no en `seguimientos`, especies válidas del enum real.
 * `resumenIa`, `chat` y `botPausado` NO son columnas reales — ver el
 * comentario en `../types.ts`.
 */
export const MOCK_SEGUIMIENTOS: SeguimientoConDetalle[] = [
  {
    id: '1',
    turno_id: '901',
    fecha_programada: '2026-08-17',
    respuesta: null,
    fecha_respuesta: null,
    estado: 'sin_respuesta',
    created_at: '2026-08-17T09:00:00.000Z',
    botPausado: false,
    turno: {
      id: '901',
      motivo: 'Castración — control post-quirúrgico',
      fecha_hora: '2026-08-15T14:30:00.000Z',
      mascota: { id: '201', nombre: 'Firulais', especie: 'perro' },
      cliente: { id: '301', nombre: 'Marcos Gómez', telefono: '+54 9 11 4455-1234' },
    },
    resumenIa:
      'Se envió la consulta de seguimiento hace 3 días y no hubo respuesta. Sin señales de alarma previas al alta — el vet debería llamar para confirmar que la recuperación sigue en curso.',
    chat: [
      {
        direccion: 'saliente',
        contenido:
          'Hola Marcos! 🐾 Vengo a preguntar cómo sigue Firulais después de la cirugía del lunes. ¿Cómo lo ves?',
        created_at: '2026-08-17T13:00:00.000Z',
      },
    ],
  },
  {
    id: '2',
    turno_id: '902',
    fecha_programada: '2026-08-19',
    respuesta: null,
    fecha_respuesta: null,
    estado: 'pendiente',
    created_at: '2026-08-19T09:00:00.000Z',
    botPausado: false,
    turno: {
      id: '902',
      motivo: 'Consulta por vómitos reiterados',
      fecha_hora: '2026-08-17T11:00:00.000Z',
      mascota: { id: '202', nombre: 'Michi', especie: 'gato' },
      cliente: { id: '302', nombre: 'Laura Fernández', telefono: '+54 9 11 5566-2345' },
    },
    resumenIa:
      'El bot preguntó ayer por los vómitos de Michi y todavía no hubo respuesta del dueño — está dentro de la ventana normal de espera, pero ya pasó la fecha programada.',
    chat: [
      {
        direccion: 'saliente',
        contenido: 'Hola Laura! ¿Cómo siguió Michi con los vómitos? ¿Volvió a comer normal?',
        created_at: '2026-08-19T13:00:00.000Z',
      },
    ],
  },
  {
    id: '3',
    turno_id: '903',
    fecha_programada: '2026-08-20',
    respuesta: null,
    fecha_respuesta: null,
    estado: 'pendiente',
    created_at: '2026-08-20T09:00:00.000Z',
    botPausado: false,
    turno: {
      id: '903',
      motivo: 'Vacunación antirrábica',
      fecha_hora: '2026-08-18T10:00:00.000Z',
      mascota: { id: '203', nombre: 'Rocky', especie: 'perro' },
      cliente: { id: '303', nombre: 'Diego Álvarez', telefono: '+54 9 11 3344-3456' },
    },
    resumenIa:
      'Control de rutina post-vacuna, sin antecedentes de reacciones. El bot mandó el mensaje hoy a la mañana, todavía dentro de la ventana normal de respuesta.',
    chat: [
      {
        direccion: 'saliente',
        contenido: 'Hola Diego! Pasaron 48hs de la vacuna de Rocky — ¿notaste alguna reacción o está todo bien?',
        created_at: '2026-08-20T13:00:00.000Z',
      },
    ],
  },
  {
    id: '4',
    turno_id: '904',
    fecha_programada: '2026-08-20',
    respuesta: 'Todo perfecto, ya está saltando por toda la casa 😄 gracias!',
    fecha_respuesta: '2026-08-20T15:40:00.000Z',
    estado: 'respondido',
    created_at: '2026-08-20T09:00:00.000Z',
    botPausado: false,
    turno: {
      id: '904',
      motivo: 'Cirugía de cadera — control post-quirúrgico',
      fecha_hora: '2026-08-18T09:00:00.000Z',
      mascota: { id: '204', nombre: 'Nube', especie: 'gato' },
      cliente: { id: '303', nombre: 'Diego Álvarez', telefono: '+54 9 11 3344-3456' },
    },
    resumenIa:
      'Recuperación sin complicaciones según el dueño — movilidad normal, come bien, sin dolor aparente. No requiere intervención humana.',
    chat: [
      {
        direccion: 'saliente',
        contenido: 'Hola Diego! ¿Cómo sigue Nube de la cadera? ¿La ves cómoda al moverse?',
        created_at: '2026-08-20T13:05:00.000Z',
      },
      {
        direccion: 'entrante',
        contenido: 'Todo perfecto, ya está saltando por toda la casa 😄 gracias!',
        created_at: '2026-08-20T15:40:00.000Z',
      },
      {
        direccion: 'saliente',
        contenido: '¡Buenísimo! Cualquier cosa rara nos escribís. Que siga todo así 🐾',
        created_at: '2026-08-20T15:41:00.000Z',
      },
    ],
  },
  {
    id: '5',
    turno_id: '905',
    fecha_programada: '2026-08-21',
    respuesta: null,
    fecha_respuesta: null,
    estado: 'pendiente',
    created_at: '2026-08-20T09:00:00.000Z',
    botPausado: false,
    turno: {
      id: '905',
      motivo: 'Control por alergia cutánea',
      fecha_hora: '2026-08-19T16:00:00.000Z',
      mascota: { id: '205', nombre: 'Toby', especie: 'perro' },
      cliente: { id: '304', nombre: 'Julián Torres', telefono: '+54 9 11 7788-5678' },
    },
    resumenIa: 'Todavía no se cumplieron las 48hs — el bot va a escribir mañana automáticamente.',
    chat: [],
  },
  {
    id: '6',
    turno_id: '906',
    fecha_programada: '2026-08-21',
    respuesta: null,
    fecha_respuesta: null,
    estado: 'pendiente',
    created_at: '2026-08-20T09:00:00.000Z',
    botPausado: false,
    turno: {
      id: '906',
      motivo: 'Fractura en pata trasera — control de yeso',
      fecha_hora: '2026-08-19T12:00:00.000Z',
      mascota: { id: '206', nombre: 'Coco', especie: 'cacatúa' },
      cliente: { id: '305', nombre: 'Sofía Ramírez', telefono: '+54 9 11 6677-4567' },
    },
    resumenIa: 'Caso más delicado por ser ave — el bot todavía no contactó al dueño, programado para mañana.',
    chat: [],
  },
  {
    id: '7',
    turno_id: '907',
    fecha_programada: '2026-08-24',
    respuesta: null,
    fecha_respuesta: null,
    estado: 'pendiente',
    created_at: '2026-08-20T09:00:00.000Z',
    botPausado: false,
    turno: {
      id: '907',
      motivo: 'Control post-desparasitación',
      fecha_hora: '2026-08-22T10:00:00.000Z',
      mascota: { id: '207', nombre: 'Luna', especie: 'gato' },
      cliente: { id: '301', nombre: 'Marcos Gómez', telefono: '+54 9 11 4455-1234' },
    },
    resumenIa: 'Programado a futuro, fuera de la ventana Vencidos/Hoy/Mañana — cuenta para "Próximos 7 días".',
    chat: [],
  },
  {
    id: '8',
    turno_id: '908',
    fecha_programada: '2026-08-27',
    respuesta: null,
    fecha_respuesta: null,
    estado: 'pendiente',
    created_at: '2026-08-20T09:00:00.000Z',
    botPausado: false,
    turno: {
      id: '908',
      motivo: 'Control de dermatitis',
      fecha_hora: '2026-08-25T10:00:00.000Z',
      mascota: { id: '208', nombre: 'Max', especie: 'perro' },
      cliente: { id: '302', nombre: 'Laura Fernández', telefono: '+54 9 11 5566-2345' },
    },
    resumenIa: 'Más de 7 días a futuro — no debería contar en el KPI "Próximos 7 días" (caso límite para probar el cálculo).',
    chat: [],
  },
]
