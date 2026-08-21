import { subHours, subMinutes } from 'date-fns'

import type { AlertaConDetalle } from '../types'

const ahora = new Date()

/**
 * Mock temporal — se reemplaza por `listarAlertas()` (`services/alertas.ts`)
 * cuando el wf 08 empiece a escribir filas reales en `alertas`. Respeta los
 * nombres de columna y enums del schema real de Supabase (ver
 * `src/types/db.ts`): `consulta.clasificacion` solo puede ser 'alta' en la
 * práctica (wf 08 dispara únicamente con triaje 🔴), se deja un caso 'media'
 * acá solo para poder probar el filtro de urgencia.
 */
export const MOCK_ALERTAS: AlertaConDetalle[] = [
  {
    id: '1',
    consulta_id: '101',
    mascota_id: '201',
    cliente_id: '301',
    resumen_caso:
      'Convulsión de ~2 minutos hace 15 minutos. Mascota desorientada, salivación excesiva, primer episodio según el dueño.',
    estado: 'pendiente',
    atendido_por: null,
    created_at: subMinutes(ahora, 15).toISOString(),
    mascota: { id: '201', nombre: 'Rocky', especie: 'perro', raza: 'Bulldog Francés' },
    cliente: { id: '301', nombre: 'Diego Álvarez', telefono: '+54 9 11 3344-3456' },
    consulta: {
      id: '101',
      mensaje_original:
        'Mi perro empezó a convulsionar hace un rato y quedó como perdido, no reacciona bien todavía',
      clasificacion: 'alta',
      consejo_generado:
        'Una convulsión de este tipo en un adulto sin antecedentes previos requiere evaluación veterinaria inmediata. Mientras se acercan: alejar objetos con los que pueda golpearse, no sujetarlo ni poner nada en la boca, y cronometrar si se repite.',
    },
  },
  {
    id: '2',
    consulta_id: '102',
    mascota_id: '202',
    cliente_id: '302',
    resumen_caso:
      'Vómitos reiterados (4 episodios) con sangre en las últimas 3 horas, decaimiento marcado, no come desde ayer.',
    estado: 'pendiente',
    atendido_por: null,
    created_at: subMinutes(ahora, 42).toISOString(),
    mascota: { id: '202', nombre: 'Michi', especie: 'gato', raza: 'Siamés' },
    cliente: { id: '302', nombre: 'Laura Fernández', telefono: '+54 9 11 5566-2345' },
    consulta: {
      id: '102',
      mensaje_original: 'Michi vomitó como 4 veces hoy y esta vez vi que tenía sangre',
      clasificacion: 'alta',
      consejo_generado:
        'Vómito con sangre asociado a decaimiento y anorexia de más de 24hs es indicación de guardia. Puede tratarse de un cuadro digestivo agudo, ingesta de un cuerpo extraño o algo más serio — no se recomienda esperar a un turno de rutina.',
    },
  },
  {
    id: '3',
    consulta_id: '103',
    mascota_id: null,
    cliente_id: '303',
    resumen_caso:
      'Dueño reporta dificultad respiratoria en su mascota (aún sin identificar cuál, tiene 2) — mensaje entrecortado, posible emergencia.',
    estado: 'pendiente',
    atendido_por: null,
    created_at: subHours(ahora, 1.5).toISOString(),
    mascota: null,
    cliente: { id: '303', nombre: 'Sofía Ramírez', telefono: '+54 9 11 6677-4567' },
    consulta: {
      id: '103',
      mensaje_original: 'no puede respirar bien ayuda porfavor',
      clasificacion: 'alta',
      consejo_generado:
        'Dificultad respiratoria es siempre una urgencia, independientemente de la causa. No se pudo confirmar todavía qué mascota es (el cliente tiene más de una registrada) — contactar por teléfono en vez de esperar la respuesta por WhatsApp.',
    },
  },
  {
    id: '4',
    consulta_id: '104',
    mascota_id: '204',
    cliente_id: '301',
    resumen_caso:
      'Cojera repentina en la pata trasera derecha tras un salto, se queja al apoyar. Sin heridas visibles.',
    estado: 'pendiente',
    atendido_por: null,
    created_at: subHours(ahora, 4).toISOString(),
    mascota: { id: '204', nombre: 'Luna', especie: 'gato', raza: 'Común Europeo' },
    cliente: { id: '301', nombre: 'Diego Álvarez', telefono: '+54 9 11 3344-3456' },
    consulta: {
      id: '104',
      mensaje_original: 'Luna saltó del sillón y ahora no quiere apoyar una patita, va cojeando',
      clasificacion: 'media',
      consejo_generado:
        'Podría ser un esguince leve o algo más (fractura, luxación) — sin poder examinarla no se puede descartar nada. Se recomendó reposo estricto y una consulta dentro de las próximas 24hs; se ofreció turno.',
    },
  },
  {
    id: '5',
    consulta_id: '105',
    mascota_id: '205',
    cliente_id: '304',
    resumen_caso:
      'Ya fue atendida por el equipo — picadura de abeja con hinchazón facial, se indicó antihistamínico y control en 24hs.',
    estado: 'atendido',
    atendido_por: 'Dra. Paz',
    created_at: subHours(ahora, 20).toISOString(),
    mascota: { id: '205', nombre: 'Toby', especie: 'perro', raza: 'Caniche' },
    cliente: { id: '304', nombre: 'Julián Torres', telefono: '+54 9 11 7788-5678' },
    consulta: {
      id: '105',
      mensaje_original: 'a toby le picó algo en el hocico y se le hincho toda la cara',
      clasificacion: 'alta',
      consejo_generado:
        'Una reacción alérgica con hinchazón facial puede progresar rápido a compromiso respiratorio — se indicó traerlo apenas fuera posible.',
    },
  },
]
