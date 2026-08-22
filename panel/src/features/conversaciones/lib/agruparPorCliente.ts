import type { ConversacionResumen, MensajeConCliente } from '../types'

/**
 * Agrupa mensajes sueltos en una fila por cliente (el más reciente).
 *
 * `listarUltimosMensajes()` trae los últimos N mensajes SUELTOS, no el
 * último mensaje de cada cliente — no hay una vista `DISTINCT ON
 * (cliente_id)` en Postgres todavía (ver TODO en `services/mensajes.ts`).
 * Mientras tanto esto es una aproximación en el frontend: como el input ya
 * viene ordenado `created_at desc`, quedarse con la primera ocurrencia por
 * cliente alcanza para dedupear quedándose con la más reciente. Un cliente
 * muy charlatán puede tapar a otros que no entraron en el límite `N`.
 */
export function agruparPorCliente(mensajes: MensajeConCliente[]): ConversacionResumen[] {
  const vistos = new Set<string>()
  const resumen: ConversacionResumen[] = []

  for (const mensaje of mensajes) {
    if (!mensaje.cliente) continue
    if (vistos.has(mensaje.cliente.id)) continue

    vistos.add(mensaje.cliente.id)
    resumen.push({
      cliente: mensaje.cliente,
      ultimoMensaje: {
        id: mensaje.id,
        direccion: mensaje.direccion,
        contenido: mensaje.contenido,
        created_at: mensaje.created_at,
      },
    })
  }

  return resumen
}
