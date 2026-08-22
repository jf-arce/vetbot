/**
 * `hora_apertura`/`hora_cierre` son columnas `timetz` en Supabase — vienen
 * como `"HH:mm:ss±TZ"` (ej. `"09:00:00-03"`). Los inputs `type="time"` solo
 * manejan `"HH:mm"`, así que hay que ida y vuelta con el offset: si se manda
 * `"09:00"` pelado, Postgres lo interpreta con la zona de la sesión (no la
 * de la fila), corriendo el horario.
 *
 * No hay selector de zona horaria en ningún lado del schema — las 6 filas
 * reales de `horarios_atencion` usan todas `-03` (Argentina), así que se
 * asume ese offset para valores nuevos (una excepción sin fila previa de la
 * que copiar el offset real).
 */
export const OFFSET_TZ_CLINICA = '-03'

export function aHoraInput(valorDb: string | null): string {
  return valorDb ? valorDb.slice(0, 5) : ''
}

export function aOffset(valorDb: string | null): string {
  return valorDb && valorDb.length >= 9 ? valorDb.slice(8) : OFFSET_TZ_CLINICA
}

export function aHoraDb(horaInput: string, offset: string): string {
  return `${horaInput}:00${offset}`
}
