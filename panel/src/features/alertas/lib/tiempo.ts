import { differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns'

/** "Hace 15 min" / "Hace 3 h" / "Hace 2 d" — más compacto que el default de date-fns. */
export function tiempoRelativo(fecha: Date, ahora = new Date()): string {
  const minutos = differenceInMinutes(ahora, fecha)
  if (minutos < 1) return 'Recién'
  if (minutos < 60) return `Hace ${minutos} min`

  const horas = differenceInHours(ahora, fecha)
  if (horas < 24) return `Hace ${horas} h`

  const dias = differenceInDays(ahora, fecha)
  return `Hace ${dias} d`
}
