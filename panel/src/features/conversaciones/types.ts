import type { Cliente, Conversacion, Mensaje } from '@/types/db'

export type ClienteResumen = Pick<Cliente, 'id' | 'nombre' | 'telefono'>

/**
 * Shape real que devuelve `listarUltimosMensajes()` en `services/mensajes.ts`
 * (join `mensajes` + `clientes`). `cliente` puede ser `null` si el mensaje
 * entrante no matcheó ningún teléfono registrado.
 */
export interface MensajeConCliente extends Mensaje {
  cliente: ClienteResumen | null
}

/**
 * Una fila de la lista maestra: un cliente + su mensaje más reciente.
 * No existe un campo de "leído/no leído" en `mensajes` — el brief original
 * lo pedía pero no hay soporte en el schema real, así que no se inventa acá.
 */
export interface ConversacionResumen {
  cliente: ClienteResumen
  ultimoMensaje: Pick<Mensaje, 'id' | 'direccion' | 'contenido' | 'created_at'>
}

export type { Conversacion, Mensaje }
