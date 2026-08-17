import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'

/**
 * ─── CONTRATO DEL MÓDULO ───────────────────────────────────────────────────
 *
 * Qué es: la bandeja de urgencias. Cada fila la creó el wf 08 porque el triaje
 * del wf 02 clasificó un síntoma como 🔴 alta y derivó a un humano.
 * Es la pantalla más crítica del panel: si una alerta queda sin ver, el
 * sistema falló.
 *
 * Datos: `services/alertas.ts` → listarAlertas(estado?)
 *
 * Qué mostrar por alerta:
 *   · `resumen_caso` — el resumen que generó Claude, protagonista de la card.
 *     La gracia es que el veterinario no tenga que leer toda la conversación.
 *   · Mascota (link a su ficha) + dueño + teléfono para llamar ya.
 *   · `consulta.mensaje_original`: el síntoma tal cual lo escribió el dueño.
 *   · Hace cuánto entró (date-fns → formatDistanceToNow con locale es).
 *   · Link a la conversación completa: /conversaciones/:clienteId.
 *
 * Filtros: tabs pendientes / atendidas. Arranca en pendientes.
 *
 * Acción (esta pantalla SÍ escribe):
 *   · "Marcar como atendida" → marcarAlertaAtendida(id, atendidoPor).
 *     `atendido_por` es texto libre por ahora (no hay login todavía);
 *     pedirlo en un Dialog con un Input, o precargarlo desde un selector de
 *     veterinario si se implementa la tabla `veterinarios`.
 *   · Refrescar la lista después de escribir y confirmar con toast.
 *
 * Detalle de UX que importa: una alerta pendiente vieja tiene que verse peor
 * que una nueva (color/orden), no todas iguales.
 * ───────────────────────────────────────────────────────────────────────────
 */
export function AlertasPage() {
  return (
    <>
      <PageHeader
        titulo="Alertas"
        descripcion="Casos de urgencia alta derivados por el triaje del bot"
      />
      <EmptyState
        titulo="Alertas sin implementar"
        descripcion="Ver el contrato del módulo en el comentario de src/pages/alertas/AlertasPage.tsx"
      />
    </>
  )
}
