import type { Cliente, Conversacion, MascotaConDueno, Mensaje } from '@/types/db'
import type { ConversacionResumen } from '../types'

/**
 * Mock temporal — mismo criterio que `data/mockAlertas.ts` y
 * `data/mockSeguimientos.ts`. Se usa como fallback (ver `useConversaciones`)
 * cuando `mensajes`/`conversaciones` todavía no tienen filas reales en
 * Supabase, para poder ver el módulo poblado sin depender de insertar datos
 * de prueba a mano. En cuanto haya una fila real, la lista real la tapa —
 * ver `agruparPorCliente`.
 */
export interface ConversacionMock {
  cliente: Cliente
  conversacion: Conversacion | null
  mensajes: Mensaje[]
  mascotas: MascotaConDueno[]
}

const ahora = Date.now()
const minutos = (n: number) => new Date(ahora - n * 60_000).toISOString()

const CLIENTE_MARIA: Cliente = {
  id: 'mock-cliente-maria',
  nombre: 'María Gómez',
  telefono: '+54 9 11 1111-1111',
  email: null,
  direccion: null,
  estado: 'activo',
  created_at: minutos(60 * 24 * 10),
}

const CLIENTE_JORGE: Cliente = {
  id: 'mock-cliente-jorge',
  nombre: 'Jorge Pérez',
  telefono: '+54 9 11 2222-2222',
  email: null,
  direccion: null,
  estado: 'activo',
  created_at: minutos(60 * 24 * 30),
}

const CLIENTE_LUCIA: Cliente = {
  id: 'mock-cliente-lucia',
  nombre: 'Lucía Fernández',
  telefono: '+54 9 11 3333-3333',
  email: null,
  direccion: null,
  estado: 'activo',
  created_at: minutos(60 * 24 * 3),
}

export const CONVERSACIONES_MOCK: ConversacionMock[] = [
  {
    cliente: CLIENTE_MARIA,
    conversacion: {
      id: 'mock-conversacion-maria',
      cliente_id: CLIENTE_MARIA.id,
      estado: 'esperando_eleccion_horario',
      contexto: { mascota_elegida: 'Firulais', turnos_sugeridos: [1, 2, 3] },
      update_at: minutos(105),
    },
    mensajes: [
      { id: 'mock-msg-m1', cliente_id: CLIENTE_MARIA.id, direccion: 'entrante', contenido: 'Hola, mi perro Firulais está vomitando desde ayer', created_at: minutos(60 * 27), telefono: CLIENTE_MARIA.telefono, wa_message_id: null },
      { id: 'mock-msg-m2', cliente_id: CLIENTE_MARIA.id, direccion: 'saliente', contenido: 'Hola María! Cuéntame un poco más: ¿el vómito tiene sangre o algo raro?', created_at: minutos(60 * 26 + 55), telefono: CLIENTE_MARIA.telefono, wa_message_id: null },
      { id: 'mock-msg-m3', cliente_id: CLIENTE_MARIA.id, direccion: 'entrante', contenido: 'No, es normal nomás, pero ya van 3 veces', created_at: minutos(60 * 26 + 50), telefono: CLIENTE_MARIA.telefono, wa_message_id: null },
      { id: 'mock-msg-m4', cliente_id: CLIENTE_MARIA.id, direccion: 'saliente', contenido: 'Entendido, te recomiendo traerlo. ¿Querés que te ofrezca un turno para hoy?', created_at: minutos(120), telefono: CLIENTE_MARIA.telefono, wa_message_id: null },
      { id: 'mock-msg-m5', cliente_id: CLIENTE_MARIA.id, direccion: 'entrante', contenido: 'Sí por favor', created_at: minutos(110), telefono: CLIENTE_MARIA.telefono, wa_message_id: null },
      { id: 'mock-msg-m6', cliente_id: CLIENTE_MARIA.id, direccion: 'saliente', contenido: 'Tengo estos horarios libres hoy: 15:00, 16:30 o 18:00. ¿Cuál preferís?', created_at: minutos(105), telefono: CLIENTE_MARIA.telefono, wa_message_id: null },
    ],
    mascotas: [
      {
        id: 'mock-mascota-firulais',
        cliente_id: CLIENTE_MARIA.id,
        nombre: 'Firulais',
        especie: 'perro',
        raza: 'Mestizo',
        fecha_nacimiento: null,
        sexo: 'macho',
        peso: null,
        castrado: true,
        estado: 'vivo',
        notas_generales: null,
        created_at: minutos(60 * 24 * 10),
        cliente: { id: CLIENTE_MARIA.id, nombre: CLIENTE_MARIA.nombre, telefono: CLIENTE_MARIA.telefono },
      },
    ],
  },
  {
    cliente: CLIENTE_JORGE,
    conversacion: null,
    mensajes: [
      { id: 'mock-msg-j1', cliente_id: CLIENTE_JORGE.id, direccion: 'entrante', contenido: 'Buenas, quiero saber si atienden los sábados', created_at: minutos(29), telefono: CLIENTE_JORGE.telefono, wa_message_id: null },
      { id: 'mock-msg-j2', cliente_id: CLIENTE_JORGE.id, direccion: 'saliente', contenido: 'Hola Jorge! Sí, atendemos sábados de 9 a 13hs.', created_at: minutos(27), telefono: CLIENTE_JORGE.telefono, wa_message_id: null },
    ],
    mascotas: [],
  },
  {
    cliente: CLIENTE_LUCIA,
    conversacion: {
      id: 'mock-conversacion-lucia',
      cliente_id: CLIENTE_LUCIA.id,
      estado: 'esperando_datos_registro',
      contexto: { paso: 'falta raza y edad de la mascota' },
      update_at: minutos(8),
    },
    mensajes: [
      { id: 'mock-msg-l1', cliente_id: CLIENTE_LUCIA.id, direccion: 'entrante', contenido: 'Hola! Quiero registrar a mi gata para un turno', created_at: minutos(12), telefono: CLIENTE_LUCIA.telefono, wa_message_id: null },
      { id: 'mock-msg-l2', cliente_id: CLIENTE_LUCIA.id, direccion: 'saliente', contenido: 'Genial! Contame el nombre, raza y edad de tu gata para darla de alta', created_at: minutos(10), telefono: CLIENTE_LUCIA.telefono, wa_message_id: null },
      { id: 'mock-msg-l3', cliente_id: CLIENTE_LUCIA.id, direccion: 'entrante', contenido: 'Se llama Michi', created_at: minutos(8), telefono: CLIENTE_LUCIA.telefono, wa_message_id: null },
    ],
    mascotas: [],
  },
]

export const MOCK_POR_CLIENTE = new Map(CONVERSACIONES_MOCK.map((item) => [item.cliente.id, item]))

/** Fila de lista maestra derivada del último mensaje de cada mock — mismo shape que devuelve `agruparPorCliente`. */
export const CONVERSACIONES_RESUMEN_MOCK: ConversacionResumen[] = CONVERSACIONES_MOCK.map((item) => {
  const ultimo = item.mensajes[item.mensajes.length - 1]
  return {
    cliente: { id: item.cliente.id, nombre: item.cliente.nombre, telefono: item.cliente.telefono },
    ultimoMensaje: {
      id: ultimo.id,
      direccion: ultimo.direccion,
      contenido: ultimo.contenido,
      created_at: ultimo.created_at,
    },
  }
}).sort((a, b) => new Date(b.ultimoMensaje.created_at).getTime() - new Date(a.ultimoMensaje.created_at).getTime())
