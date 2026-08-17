import { EmptyState } from '@/components/common/EmptyState'

/**
 * ─── CONTRATO DEL MÓDULO ───────────────────────────────────────────────────
 *
 * Tabla: `excepciones_horario` — feriados y cierres puntuales que rompen el
 * patrón semanal. El wf 04 las resta al horario base antes de ofrecer turnos.
 *
 * Datos: `services/configuracion.ts`
 *   listarExcepciones() / crearExcepcion() / eliminarExcepcion()
 *
 * Qué mostrar: lista de fechas futuras con su motivo y si el día está cerrado
 * entero o abre con horario especial (ej: 24/12 medio día → `cerrado = false`
 * + hora_apertura/hora_cierre propias).
 *
 * Acciones: agregar (Dialog con Calendar, ya está en ui/) y eliminar.
 * Al eliminar, confirmar antes — es un cambio que habilita turnos reales.
 *
 * Detalle: si `cerrado = true`, las horas van deshabilitadas en el form.
 * ───────────────────────────────────────────────────────────────────────────
 */
export function ExcepcionesPage() {
  return (
    <EmptyState
      titulo="Excepciones sin implementar"
      descripcion="Ver el contrato en el comentario de src/pages/configuracion/ExcepcionesPage.tsx"
    />
  )
}
