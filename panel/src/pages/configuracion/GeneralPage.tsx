import { EmptyState } from '@/components/common/EmptyState'

/**
 * ─── CONTRATO DEL MÓDULO ───────────────────────────────────────────────────
 *
 * Tabla: `configuracion_general` — clave-valor, para poder sumar parámetros
 * sin migrar el schema. Todos los valores se guardan como texto y cada
 * workflow los castea.
 *
 * Datos: `services/configuracion.ts`
 *   listarConfiguracion() / guardarConfiguracion(clave, valor)
 *
 * Claves que usa el wf 04 hoy (ver el type `ClaveConfiguracion`):
 *   · duracion_turno_minutos — tamaño del bloque al calcular huecos (ej "30")
 *   · dias_anticipacion      — hasta cuántos días se mira disponibilidad ("7")
 *   · turnos_a_mostrar       — cuántas opciones se ofrecen por mensaje ("4")
 *
 * Qué mostrar: un form con un campo por clave conocida, con su descripción en
 * castellano al lado (no dejar al usuario adivinando qué significa la clave).
 * Las claves desconocidas que aparezcan en la tabla se listan igual, como
 * texto libre, así el panel no se rompe cuando Dev 1 o Dev 2 agreguen una.
 *
 * Acción: guardar → `guardarConfiguracion` hace upsert por clave.
 * Validar que los tres valores de arriba sean enteros positivos: si alguien
 * guarda "abc" en duracion_turno_minutos, el bot deja de ofrecer turnos.
 * ───────────────────────────────────────────────────────────────────────────
 */
export function GeneralPage() {
  return (
    <EmptyState
      titulo="Parámetros generales sin implementar"
      descripcion="Ver el contrato en el comentario de src/pages/configuracion/GeneralPage.tsx"
    />
  )
}
