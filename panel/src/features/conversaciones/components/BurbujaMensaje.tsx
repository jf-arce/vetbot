import { format } from 'date-fns'

import { cn } from '@/lib/utils'
import type { DireccionMensaje } from '@/types/db'

/** Mismo criterio visual que `BurbujaChat` en `features/seguimientos` — bot a la derecha (verde), dueño a la izquierda. */
export function BurbujaMensaje({
  direccion,
  contenido,
  created_at,
}: {
  direccion: DireccionMensaje
  contenido: string
  created_at: string
}) {
  const esBot = direccion === 'saliente'

  return (
    <div className={cn('flex flex-col gap-0.5', esBot ? 'items-end' : 'items-start')}>
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap',
          esBot
            ? 'rounded-tr-sm bg-green-100 text-green-950 dark:bg-green-500/15 dark:text-green-100'
            : 'rounded-tl-sm bg-muted text-foreground',
        )}
      >
        {contenido}
      </div>
      <span className="px-1 text-[0.7rem] text-muted-foreground">
        {format(new Date(created_at), 'HH:mm')}
      </span>
    </div>
  )
}
