import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { BotIcon, CalendarClockIcon, PauseIcon, SparklesIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
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

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{titulo}</h3>
      {children}
    </div>
  )
}

function BurbujaChat({ direccion, contenido, created_at }: { direccion: 'entrante' | 'saliente'; contenido: string; created_at: string }) {
  const esBot = direccion === 'saliente'

  return (
    <div className={cn('flex flex-col gap-0.5', esBot ? 'items-end' : 'items-start')}>
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-3 py-2 text-sm',
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

/** Contenido keyed por `seguimiento.id` desde el padre — evita que quede estado de un caso pegado al abrir otro. */
function ContenidoDetalle({
  seguimiento,
  fechaReferencia,
  onPausarBot,
}: {
  seguimiento: SeguimientoConDetalle
  fechaReferencia: Date
  onPausarBot: (seguimiento: SeguimientoConDetalle) => void
}) {
  const mascota = seguimiento.turno?.mascota
  const cliente = seguimiento.turno?.cliente
  const estado = estadoBotDe(seguimiento, fechaReferencia)
  const estiloEstado = ESTILO_ESTADO_BOT[estado]
  const puedePausar = estado !== 'completado' && estado !== 'pausado'

  return (
    <>
      <SheetHeader>
        <SheetTitle>{mascota?.nombre ?? 'Mascota sin identificar'}</SheetTitle>
        <SheetDescription>
          {cliente?.nombre ?? 'Sin datos'}
          {cliente?.telefono ? ` · ${cliente.telefono}` : ''}
        </SheetDescription>
      </SheetHeader>

      <div className="flex flex-col gap-5 overflow-y-auto px-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className={estiloEstado.clase}>
            {estiloEstado.texto}
          </Badge>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarClockIcon className="size-3" />
            Programado para{' '}
            {format(new Date(`${seguimiento.fecha_programada}T00:00:00`), "d 'de' MMMM", { locale: es })}
          </span>
        </div>

        <Seccion titulo="Resumen de la IA">
          <p className="flex items-start gap-2 rounded-lg bg-muted/60 p-3 text-sm text-foreground/90">
            <SparklesIcon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
            {seguimiento.resumenIa}
          </p>
        </Seccion>

        <Separator />

        <Seccion titulo="Conversación con el bot">
          {seguimiento.chat.length === 0 ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <BotIcon className="size-4" />
              El bot todavía no le escribió al dueño — está programado para{' '}
              {format(new Date(`${seguimiento.fecha_programada}T00:00:00`), "d 'de' MMM", { locale: es })}.
            </p>
          ) : (
            <div className="flex flex-col gap-3 rounded-lg border border-border bg-background p-3">
              {seguimiento.chat.map((mensaje) => (
                <BurbujaChat key={mensaje.created_at} {...mensaje} />
              ))}
            </div>
          )}
        </Seccion>
      </div>

      <SheetFooter>
        {puedePausar ? (
          <Button variant="destructive" className="w-full" onClick={() => onPausarBot(seguimiento)}>
            <PauseIcon />
            Pausar bot y tomar control manual
          </Button>
        ) : (
          <p className="text-center text-xs text-muted-foreground">
            {estado === 'pausado'
              ? 'Bot pausado — este caso está en control manual.'
              : 'Seguimiento completado — nada que auditar.'}
          </p>
        )}
      </SheetFooter>
    </>
  )
}

export function SheetDetalleSeguimiento({
  seguimiento,
  fechaReferencia,
  open,
  onOpenChange,
  onPausarBot,
}: {
  seguimiento: SeguimientoConDetalle | null
  fechaReferencia: Date
  open: boolean
  onOpenChange: (open: boolean) => void
  onPausarBot: (seguimiento: SeguimientoConDetalle) => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        {seguimiento ? (
          <ContenidoDetalle
            key={seguimiento.id}
            seguimiento={seguimiento}
            fechaReferencia={fechaReferencia}
            onPausarBot={onPausarBot}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
