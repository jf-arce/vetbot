import { Badge } from '@/components/ui/badge'
import type { PrioridadTurno } from '../types'

const ESTILO_POR_PRIORIDAD: Record<PrioridadTurno, { texto: string; clase: string }> = {
  alta: {
    texto: 'ALTA',
    clase: 'bg-red-300 text-red-950 dark:bg-red-500/30 dark:text-red-200',
  },
  media: {
    texto: 'MEDIA',
    clase: 'bg-yellow-300 text-yellow-950 dark:bg-yellow-500/30 dark:text-yellow-200',
  },
  baja: {
    texto: 'BAJA',
    clase: 'bg-green-300 text-green-950 dark:bg-green-500/30 dark:text-green-200',
  },
}

/**
 * Prioridad que sale del triaje de urgencia (wf 02, Dev 1). `null` = turno
 * pedido directo, no pasó por triaje — no se muestra badge.
 */
export function BadgePrioridad({ prioridad }: { prioridad: PrioridadTurno | null }) {
  if (!prioridad) return null

  const { texto, clase } = ESTILO_POR_PRIORIDAD[prioridad]

  return (
    <Badge variant="secondary" className={clase}>
      {texto}
    </Badge>
  )
}
