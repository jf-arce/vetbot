import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'

/**
 * ─── CONTRATO DEL MÓDULO ───────────────────────────────────────────────────
 *
 * Qué es: la agenda. Los turnos los crea el bot (wf 05) después de que el
 * dueño elige horario; el panel los mira y les cambia el estado.
 *
 * Datos: `services/turnos.ts`
 *   · listarTurnosDelDia(fecha)   → vista por defecto (hoy)
 *   · listarProximosTurnos()      → tab "Próximos"
 *
 * Columnas: hora · mascota (link a /mascotas/:id) · dueño + teléfono ·
 *           motivo · estado · urgencia · acciones
 *
 * Chip de urgencia: sale de `turno.consulta.clasificacion` — es el triaje del
 * wf 02 (Dev 1). Puede venir en null: un turno pedido directo no pasó por
 * triaje, y en ese caso no se muestra chip.
 *   🟢 baja = verde · 🟡 media = ámbar · 🔴 alta = rojo (usar Badge)
 *
 * Estados de turno: pendiente | confirmado | atendido | cancelado | no_asistio
 *
 * Filtros: selector de fecha (Calendar ya está en ui/), filtro por estado,
 *          tabs "Hoy" / "Próximos".
 *
 * Acciones:
 *   · Marcar atendido / no asistió → actualizarEstadoTurno() (Supabase directo)
 *   · Cancelar turno → ⚠️ NO es un update de Supabase. Tiene que borrar también
 *     el evento de Google Calendar, así que va por un webhook de n8n. Ver el
 *     TODO de `cancelarTurno()` en services/turnos.ts y la tabla "quién habla
 *     con quién" de docs/vetbot-division-tareas.md.
 *
 * Al confirmar una acción, feedback con `toast` de sonner (ya montado en el
 * layout): import { toast } from 'sonner'.
 * ───────────────────────────────────────────────────────────────────────────
 */
export function TurnosPage() {
  return (
    <>
      <PageHeader
        titulo="Turnos"
        descripcion="Agenda del día y próximos turnos agendados por el bot"
      />
      <EmptyState
        titulo="Turnos sin implementar"
        descripcion="Ver el contrato del módulo en el comentario de src/pages/turnos/TurnosPage.tsx"
      />
    </>
  )
}
