import { Link, useParams } from 'react-router'
import { ArrowLeftIcon } from 'lucide-react'

import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/button'
import { RUTAS } from '@/routes/paths'

/**
 * ─── CONTRATO DEL MÓDULO ───────────────────────────────────────────────────
 *
 * Qué es: el hilo completo de WhatsApp de un cliente, estilo chat.
 *
 * Param de ruta: `:clienteId` (string → Number()).
 *
 * Datos: `services/mensajes.ts`
 *   · obtenerCliente(clienteId)         → nombre y teléfono del encabezado
 *   · listarMensajesDeCliente(clienteId) → los mensajes, orden cronológico
 *   · obtenerConversacion(clienteId)     → el ESTADO actual del bot
 *   · services/mascotas.ts → listarMascotasDeCliente(clienteId)
 *
 * Qué mostrar:
 *   · Burbujas alineadas por `direccion`: entrante (dueño) a la izquierda,
 *     saliente (bot) a la derecha. Separadores por día.
 *   · Badge con el estado de la conversación: libre, esperando_eleccion_horario,
 *     esperando_confirmacion_turno, esperando_datos_registro,
 *     esperando_respuesta_seguimiento. Es lo que explica por qué el bot está
 *     "esperando" algo, y es lo primero que se mira cuando una charla se trabó.
 *   · `conversacion.contexto` (JSON) en un bloque colapsable — es data de debug
 *     útil cuando un flujo multi-paso quedó a medias.
 *   · Mascotas del cliente, con link a cada ficha.
 *
 * `obtenerConversacion` puede devolver null (cliente sin conversación activa):
 * contemplarlo, no asumir que siempre hay fila.
 *
 * Solo lectura: no se responde desde el panel.
 * ───────────────────────────────────────────────────────────────────────────
 */
export function ConversacionDetallePage() {
  const { clienteId } = useParams()

  return (
    <>
      <PageHeader
        titulo="Conversación"
        descripcion={`Hilo completo y estado del bot · cliente #${clienteId}`}
        acciones={
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link to={RUTAS.conversaciones} />}
          >
            <ArrowLeftIcon />
            Volver
          </Button>
        }
      />
      <EmptyState
        titulo="Hilo sin implementar"
        descripcion="Ver el contrato del módulo en el comentario de src/pages/conversaciones/ConversacionDetallePage.tsx"
      />
    </>
  )
}
