import { Link, useParams } from 'react-router'
import { ArrowLeftIcon } from 'lucide-react'

import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { ConversacionesView } from '@/features/conversaciones/components/ConversacionesView'
import { RUTAS } from '@/routes/paths'

/**
 * ─── CONTRATO DEL MÓDULO ───────────────────────────────────────────────────
 *
 * Qué es: el hilo completo de WhatsApp de un cliente, estilo chat.
 *
 * Param de ruta: `:clienteId` — string, es el `uuid` real de `clientes.id`
 * (no se convierte a número).
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
 *   · Badge con el estado de la conversación (6 valores reales del enum):
 *     libre, esperando_confirmacion_turno, esperando_eleccion_horario,
 *     esperando_datos_registro, esperando_respuesta_seguimiento,
 *     esperando_eleccion_mascota. Es lo que explica por qué el bot está
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
        descripcion="Hilo completo y estado del bot"
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
      <ConversacionesView clienteId={clienteId} />
    </>
  )
}
