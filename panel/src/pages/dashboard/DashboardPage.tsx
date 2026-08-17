import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'

/**
 * ─── CONTRATO DEL MÓDULO ───────────────────────────────────────────────────
 *
 * Qué es: la pantalla de arranque de la clínica. Estado del día de un vistazo.
 *
 * Datos:
 *   · Métricas → `services/dashboard.ts` → obtenerMetricas()
 *     (turnos del día, consultas resueltas sin turno, alertas activas,
 *      recordatorios enviados). ⚠️ Se calculan con una RPC/vista de Postgres,
 *      NO contando filas en el frontend — ver el TODO de ese service.
 *   · Feed de conversaciones → `services/mensajes.ts` → listarUltimosMensajes()
 *   · Alertas activas → `services/alertas.ts` → listarAlertas('pendiente')
 *   · Turnos de hoy → `services/turnos.ts` → listarTurnosDelDia(new Date())
 *
 * Qué mostrar:
 *   1. Fila de 4 tarjetas de métrica (Card + número grande + label).
 *   2. Bloque "Alertas activas": si hay alguna 🔴 sin atender tiene que saltar
 *      a la vista — es lo más urgente de toda la app. Link a /alertas.
 *   3. Bloque "Turnos de hoy": tabla corta, link a /turnos.
 *   4. Bloque "Últimas conversaciones": lista de mensajes con nombre del dueño
 *      y hora, cada ítem linkea a /conversaciones/:clienteId.
 *   5. Alerta liviana si hay seguimientos en `sin_respuesta`.
 *
 * Sin acciones de escritura: el dashboard solo lee.
 *
 * Componentes disponibles: Card, Badge, Table, Skeleton (para el loading),
 * ErrorState (para el catch). Fechas: `date-fns`, ya instalado.
 * ───────────────────────────────────────────────────────────────────────────
 */
export function DashboardPage() {
  return (
    <>
      <PageHeader
        titulo="Dashboard"
        descripcion="Turnos del día, alertas activas y últimas conversaciones"
      />
      <EmptyState
        titulo="Dashboard sin implementar"
        descripcion="Ver el contrato del módulo en el comentario de src/pages/dashboard/DashboardPage.tsx"
      />
    </>
  )
}
