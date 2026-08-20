import { Badge } from '@/components/ui/badge'
import type { EstadoTurno } from '@/types/db'

const ESTILO_POR_ESTADO: Record<EstadoTurno, { texto: string; clase: string }> = {
  pendiente: {
    texto: 'Pendiente',
    clase: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  },
  confirmado: {
    texto: 'Confirmado',
    clase: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
  },
  atendido: {
    texto: 'Atendido',
    clase: 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400',
  },
  cancelado: {
    texto: 'Cancelado',
    clase: 'bg-muted text-muted-foreground',
  },
  no_asistio: {
    texto: 'No asistió',
    clase: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
  },
}

export function BadgeEstadoTurno({ estado }: { estado: EstadoTurno }) {
  const { texto, clase } = ESTILO_POR_ESTADO[estado]

  return (
    <Badge variant="secondary" className={clase}>
      {texto}
    </Badge>
  )
}
