import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { MessageSquareTextIcon } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { estadoBotDe } from '../lib/estadoBot'
import type { EstadoBot, SeguimientoConDetalle } from '../types'

const ESTILO_ESTADO_BOT: Record<EstadoBot, { texto: string; clase: string }> = {
  esperando: {
    texto: 'Esperando hora',
    clase: 'bg-slate-200 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300',
  },
  consultando: {
    texto: 'Consultando...',
    clase: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400',
  },
  sin_respuesta: {
    texto: 'Sin respuesta',
    clase: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
  },
  completado: {
    texto: 'Completado',
    clase: 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400',
  },
  pausado: {
    texto: 'Pausado',
    clase: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400',
  },
}

function iniciales(nombre: string) {
  return nombre.slice(0, 2).toUpperCase()
}

export function TarjetaSeguimiento({
  seguimiento,
  fechaReferencia,
  className,
  onVerChat,
}: {
  seguimiento: SeguimientoConDetalle
  fechaReferencia: Date
  className?: string
  onVerChat: () => void
}) {
  const mascota = seguimiento.turno?.mascota
  const estadoBot = ESTILO_ESTADO_BOT[estadoBotDe(seguimiento, fechaReferencia)]

  return (
    <div className={cn('flex flex-col gap-3 rounded-xl border bg-card p-4', className)}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar size="lg" className="shrink-0">
            <AvatarFallback>{iniciales(mascota?.nombre ?? '?')}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium">{mascota?.nombre ?? 'Mascota sin identificar'}</p>
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {seguimiento.turno?.motivo ?? 'Sin motivo registrado'}
            </p>
          </div>
        </div>

        <Badge variant="secondary" className={cn('shrink-0', estadoBot.clase)}>
          {estadoBot.texto}
        </Badge>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-3">
        <span className="text-xs text-muted-foreground">
          {format(new Date(`${seguimiento.fecha_programada}T00:00:00`), "d 'de' MMM", { locale: es })}
        </span>
        <Button
          variant="outline"
          size="xs"
          className="text-muted-foreground"
          onClick={onVerChat}
        >
          <MessageSquareTextIcon />
          Ver chat
        </Button>
      </div>
    </div>
  )
}
