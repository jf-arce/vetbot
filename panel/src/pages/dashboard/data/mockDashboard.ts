import type {
  AlertaActiva,
  AlertaUrgente,
  MensajeWhatsapp,
  MetricaDashboard,
  TurnoDia,
} from '../types'

/**
 * Datos mockeados para maquetar el dashboard sin esperar a que Dev 1/Dev 2
 * tengan datos reales en Supabase (ver `docs/vetbot-division-tareas.md`).
 * Reemplazar por los services de `src/services/` cuando el schema esté cerrado.
 */

export const METRICAS_MOCK: MetricaDashboard[] = [
  {
    id: 'turnos-hoy',
    titulo: 'Turnos hoy',
    valor: 14,
    variacion: '+12% vs ayer',
    tonoVariacion: 'positivo',
  },
  {
    id: 'consultas-triaje',
    titulo: 'Consultas (triaje)',
    valor: 23,
    variacion: '+8% vs ayer',
    tonoVariacion: 'positivo',
  },
  {
    id: 'alertas-activas',
    titulo: 'Alertas activas',
    valor: 3,
    variacion: '-25% vs ayer',
    tonoVariacion: 'negativo',
  },
  {
    id: 'seguimientos-48hs',
    titulo: 'Seguimientos 48hs',
    valor: 7,
    variacion: 'Pendientes',
    tonoVariacion: 'neutro',
  },
]

export const TURNOS_DEL_DIA_MOCK: TurnoDia[] = [
  { id: 1, nombreMascota: 'Milo', raza: 'Golden Retriever', hora: '09:00', tipo: 'Control' },
  { id: 2, nombreMascota: 'Luna', raza: 'Gato Siamés', hora: '09:30', tipo: 'Consulta' },
  { id: 3, nombreMascota: 'Toby', raza: 'Beagle', hora: '10:15', tipo: 'Consulta' },
  { id: 4, nombreMascota: 'Nala', raza: 'Gato Persa', hora: '11:00', tipo: 'Control' },
  { id: 5, nombreMascota: 'Rocky', raza: 'Bulldog Francés', hora: '11:45', tipo: 'Consulta' },
  { id: 6, nombreMascota: 'Coco', raza: 'Caniche Toy', hora: '13:30', tipo: 'Control' },
  { id: 7, nombreMascota: 'Simba', raza: 'Gato Común Europeo', hora: '14:00', tipo: 'Consulta' },
  { id: 8, nombreMascota: 'Bruno', raza: 'Labrador', hora: '15:15', tipo: 'Control' },
]

export const ALERTAS_ACTIVAS_MOCK: AlertaActiva[] = [
  {
    id: 1,
    nombreMascota: 'Rocky',
    raza: 'Bulldog Francés',
    urgencia: 'alta',
    tiempoTranscurrido: 'hace 2 min',
    sintomas: 'Vómitos recurrentes, decaído, no come desde ayer a la noche.',
  },
  {
    id: 2,
    nombreMascota: 'Michi',
    raza: 'Gato Mestizo',
    urgencia: 'media',
    tiempoTranscurrido: 'hace 18 min',
    sintomas: 'Cojea de la pata trasera izquierda después de saltar de la mesa.',
  },
  {
    id: 3,
    nombreMascota: 'Thor',
    raza: 'Pastor Alemán',
    urgencia: 'media',
    tiempoTranscurrido: 'hace 41 min',
    sintomas: 'Picazón intensa y enrojecimiento en la zona del abdomen.',
  },
]

export const MENSAJES_WHATSAPP_MOCK: MensajeWhatsapp[] = [
  {
    id: 1,
    telefono: '+54 9 11 3344-5566',
    tiempoTranscurrido: 'hace 1 min',
    fragmento: 'Hola, quería consultar si tienen turno para mañana a la tarde...',
    mensajeCompleto:
      'Hola, quería consultar si tienen turno para mañana a la tarde. Es para el control anual de mi gata Nala, ya la tienen registrada con ustedes. ¿Tienen algo disponible después de las 16?',
  },
  {
    id: 2,
    telefono: '+54 9 11 2211-8899',
    tiempoTranscurrido: 'hace 6 min',
    fragmento: 'Perfecto, muchas gracias! Ahí confirmo el horario que me pasaron.',
    mensajeCompleto:
      'Perfecto, muchas gracias! Ahí confirmo el horario que me pasaron para el jueves a las 10:15. Nos vemos con Toby.',
  },
  {
    id: 3,
    telefono: '+54 9 11 4455-3322',
    tiempoTranscurrido: 'hace 12 min',
    fragmento: 'Mi perro está vomitando desde esta mañana, ¿es grave?',
    mensajeCompleto:
      'Mi perro está vomitando desde esta mañana, ¿es grave? Ya van tres veces y está bastante decaído, no quiso ni desayunar. ¿Puedo llevarlo ahora o mejor pido un turno?',
  },
  {
    id: 4,
    telefono: '+54 9 11 7788-1122',
    tiempoTranscurrido: 'hace 25 min',
    fragmento: 'Buenas tardes, ¿a qué hora abren los sábados?',
    mensajeCompleto:
      'Buenas tardes, ¿a qué hora abren los sábados? Quería llevar a mi perro a vacunar pero entre semana no tengo cómo acercarme.',
  },
  {
    id: 5,
    telefono: '+54 9 11 5566-4433',
    tiempoTranscurrido: 'hace 34 min',
    fragmento: 'Ya le di la medicación que me indicaron, gracias por el seguimiento.',
    mensajeCompleto:
      'Ya le di la medicación que me indicaron, gracias por el seguimiento. Lo veo mucho mejor que ayer, ya volvió a comer con ganas.',
  },
]

export const ALERTA_URGENTE_MOCK: AlertaUrgente = {
  mascotaId: 5,
  nombreMascota: 'Rocky',
  raza: 'Bulldog Francés',
  edad: '3 años',
  peso: '14 kg',
  llegadaEstimada: '15 min',
  motivo:
    'El dueño reporta vómitos recurrentes (4 episodios en las últimas 3 horas), decaimiento marcado y rechazo total del alimento desde ayer a la noche. La raza es de riesgo por su conformación braquicéfala.',
  triaje: {
    vomitos: '4 episodios en las últimas 3 horas, con restos de bilis',
    frecuencia: 'Respiración agitada, jadeo constante incluso en reposo',
    apetito: 'Rechazo total del alimento desde hace más de 12 horas',
    nivelEnergia: 'Muy decaído, no responde a estímulos habituales',
    ultimaComida: 'Ayer a las 20:00 hs',
  },
  recomendacion:
    'Priorizar la atención inmediata al llegar. Contactar al dueño para confirmar el estado actual y adelantar indicaciones de traslado seguro.',
  telefonoDueno: '+54 9 11 6677-8899',
  nombreDueno: 'Martina Gómez',
}
