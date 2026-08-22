import { format, isToday, isYesterday } from 'date-fns'
import { es } from 'date-fns/locale'

/** "Hoy" / "Ayer" / "8 de agosto" — para los separadores de día del hilo. */
export function etiquetaDia(fecha: Date): string {
  if (isToday(fecha)) return 'Hoy'
  if (isYesterday(fecha)) return 'Ayer'
  return format(fecha, "d 'de' MMMM", { locale: es })
}
