import { Badge } from '@/components/ui/badge'
import type { EstadoConversacion } from '@/types/db'

/** Mismo patrón visual que `ESTILO_ESTADO_BOT` en `features/seguimientos`. */
const ESTILO_ESTADO: Record<EstadoConversacion, { texto: string; clase: string }> = {
  libre: {
    texto: 'Libre',
    clase: 'bg-slate-200 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300',
  },
  esperando_confirmacion_turno: {
    texto: 'Esperando confirmación de turno',
    clase: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400',
  },
  esperando_eleccion_horario: {
    texto: 'Esperando elección de horario',
    clase: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400',
  },
  esperando_datos_registro: {
    texto: 'Esperando datos de registro',
    clase: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
  },
  esperando_respuesta_seguimiento: {
    texto: 'Esperando respuesta de seguimiento',
    clase: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400',
  },
  esperando_eleccion_mascota: {
    texto: 'Esperando elección de mascota',
    clase: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
  },
}

export function BadgeEstadoConversacion({ estado }: { estado: EstadoConversacion }) {
  const estilo = ESTILO_ESTADO[estado]
  return (
    <Badge variant="secondary" className={estilo.clase}>
      {estilo.texto}
    </Badge>
  )
}
