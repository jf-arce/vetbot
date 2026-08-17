import { EmptyState } from '@/components/common/EmptyState'

/**
 * ─── CONTRATO DEL MÓDULO ───────────────────────────────────────────────────
 *
 * Tabla: `horarios_atencion` — el horario semanal de la clínica como dato
 * editable, no hardcodeado en el workflow. Lo lee el wf 04 cada vez que
 * calcula qué turnos ofrecer, así que un cambio acá afecta al bot en vivo.
 *
 * Datos: `services/configuracion.ts` → listarHorarios() / actualizarHorario()
 *
 * Qué mostrar: una fila por día (lunes → domingo, en ese orden — ver el TODO
 * de orden en el service), con hora de apertura, hora de cierre y un Switch
 * de `activo`.
 *
 * Acciones: editar horas y togglear el día. `activo = false` marca el día como
 * cerrado sin borrar la fila (ej: domingo).
 *
 * Validar antes de guardar: apertura < cierre, y avisar si el día queda activo
 * con horas vacías.
 * ───────────────────────────────────────────────────────────────────────────
 */
export function HorariosPage() {
  return (
    <EmptyState
      titulo="Horarios sin implementar"
      descripcion="Ver el contrato en el comentario de src/pages/configuracion/HorariosPage.tsx"
    />
  )
}
