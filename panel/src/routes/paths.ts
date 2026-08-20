/**
 * Fuente única de verdad de las URLs del panel.
 *
 * Regla del proyecto: ningún `<Link to="/turnos">` con string hardcodeado.
 * Siempre `<Link to={RUTAS.turnos}>` o el helper correspondiente, así renombrar
 * una ruta es un cambio en un solo archivo.
 */

export const RUTAS = {
  dashboard: '/',
  turnos: '/turnos',
  mascotas: '/mascotas',
  alertas: '/alertas',
  seguimientos: '/seguimientos',
  conversaciones: '/conversaciones',
  configuracion: '/configuracion',
  configuracionHorarios: '/configuracion/horarios',
  configuracionExcepciones: '/configuracion/excepciones',
  configuracionGeneral: '/configuracion/general',
} as const

/** Ficha de una mascota + su historia clínica. */
export function rutaMascota(mascotaId: number | string): string {
  return `${RUTAS.mascotas}/${mascotaId}`
}

/** Formulario de edición del perfil de una mascota. */
export function rutaEditarMascota(mascotaId: number | string): string {
  return `${rutaMascota(mascotaId)}/editar`
}

/** Hilo completo de WhatsApp de un cliente. */
export function rutaConversacion(clienteId: number | string): string {
  return `${RUTAS.conversaciones}/${clienteId}`
}
