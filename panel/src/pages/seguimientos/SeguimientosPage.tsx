import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'

/**
 * ─── CONTRATO DEL MÓDULO ───────────────────────────────────────────────────
 *
 * Qué es: el control post-consulta. El cron del wf 06 corre todos los días,
 * busca turnos atendidos hace 48hs y le pregunta al dueño por WhatsApp cómo
 * sigue la mascota. Acá se ve qué contestaron y quién nunca contestó.
 *
 * Datos: `services/seguimientos.ts` → listarSeguimientos(estado?)
 *
 * Columnas: fecha programada · mascota (link a ficha) · dueño ·
 *           motivo del turno original · estado · respuesta
 *
 * Estados: pendiente (enviado, esperando) | respondido | sin_respuesta
 *   `sin_respuesta` va como alerta liviana — no es urgente como una 🔴, pero
 *   es el caso que alguien debería mirar y eventualmente llamar.
 *
 * Filtros: tabs por estado. Por defecto mostrar pendientes + sin_respuesta,
 *          que son los accionables.
 *
 * Solo lectura: quien responde es el dueño por WhatsApp y quien actualiza la
 * fila es el wf 01 cuando llega esa respuesta. El panel no escribe acá.
 * ───────────────────────────────────────────────────────────────────────────
 */
export function SeguimientosPage() {
  return (
    <>
      <PageHeader
        titulo="Seguimientos"
        descripcion="Control a las 48hs de cada turno atendido"
      />
      <EmptyState
        titulo="Seguimientos sin implementar"
        descripcion="Ver el contrato del módulo en el comentario de src/pages/seguimientos/SeguimientosPage.tsx"
      />
    </>
  )
}
