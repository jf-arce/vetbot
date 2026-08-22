import { PageHeader } from '@/components/layout/PageHeader'
import { ConversacionesView } from '@/features/conversaciones/components/ConversacionesView'

/**
 * ─── CONTRATO DEL MÓDULO ───────────────────────────────────────────────────
 *
 * Qué es: el feed de lo que está hablando el bot. Sirve para auditar la
 * calidad de las respuestas de Claude, que es medio punto del proyecto.
 *
 * Datos: `services/mensajes.ts` → listarUltimosMensajes(limite)
 *
 * Qué mostrar: lista de clientes con su último mensaje, hora, y si el último
 * lo escribió el dueño (`direccion = 'entrante'`) o lo respondió el bot
 * (`saliente`). Cada ítem linkea a `rutaConversacion(clienteId)`.
 *
 * ⚠️ Ojo con el service: hoy trae los últimos N mensajes SUELTOS, no el último
 * mensaje de cada cliente. Para el feed correcto hace falta una vista con
 * DISTINCT ON (cliente_id) — está anotado como TODO en services/mensajes.ts.
 * Mientras tanto se puede agrupar en el frontend, sabiendo que es una
 * aproximación (un cliente muy charlatán tapa a los demás).
 *
 * Solo lectura: el panel NO manda mensajes de WhatsApp. Todo lo saliente sale
 * de n8n vía Evolution API.
 * ───────────────────────────────────────────────────────────────────────────
 */
export function ConversacionesPage() {
  return (
    <>
      <PageHeader
        titulo="Conversaciones"
        descripcion="Últimos mensajes intercambiados entre los dueños y el bot"
      />
      <ConversacionesView />
    </>
  )
}
