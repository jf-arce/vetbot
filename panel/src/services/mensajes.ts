import { desempaquetar, getSupabase } from '@/lib/supabase'
import type { Cliente, Conversacion, Mensaje } from '@/types/db'

/**
 * `mensajes` es el log acumulado de la charla (alimenta el feed).
 * `conversaciones` es el estado ACTUAL del cliente — una fila por cliente que
 * se sobreescribe, no un historial.
 */

/** Últimos mensajes de todos los clientes: el feed del dashboard. */
export async function listarUltimosMensajes(
  limite = 30,
): Promise<(Mensaje & { cliente: Pick<Cliente, 'id' | 'nombre' | 'telefono'> | null })[]> {
  return desempaquetar(
    await getSupabase()
      .from('mensajes')
      .select('*, cliente:clientes(id, nombre, telefono)')
      .order('created_at', { ascending: false })
      .limit(limite),
  )
}

/**
 * TODO(dev): el feed de "últimas conversaciones" ideal es un mensaje por
 * cliente (el más reciente), no los últimos N mensajes sueltos. Eso en
 * PostgREST no sale — pedirle a Dev 2 una vista con DISTINCT ON (cliente_id)
 * y consumirla desde acá.
 */

/** Hilo completo de un cliente, en orden cronológico. */
export async function listarMensajesDeCliente(clienteId: string): Promise<Mensaje[]> {
  return desempaquetar(
    await getSupabase()
      .from('mensajes')
      .select('*')
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: true }),
  )
}

/** Estado actual de la conversación (qué está esperando el bot de ese cliente). */
export async function obtenerConversacion(
  clienteId: string,
): Promise<Conversacion | null> {
  return desempaquetar(
    await getSupabase()
      .from('conversaciones')
      .select('*')
      .eq('cliente_id', clienteId)
      .maybeSingle(),
  )
}

export async function obtenerCliente(clienteId: string): Promise<Cliente> {
  return desempaquetar(
    await getSupabase().from('clientes').select('*').eq('id', clienteId).single(),
  )
}
