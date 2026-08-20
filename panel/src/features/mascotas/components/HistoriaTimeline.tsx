import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useSearchParams } from 'react-router'
import {
  CalendarIcon,
  ScissorsIcon,
  StethoscopeIcon,
  SyringeIcon,
  UserIcon,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { ClasificacionTriaje, EventoHistoria, TipoEventoHistoria } from '../types'

const ICONO_POR_TIPO: Record<TipoEventoHistoria, typeof StethoscopeIcon> = {
  consulta: StethoscopeIcon,
  vacuna: SyringeIcon,
  cirugia: ScissorsIcon,
  tratamiento: StethoscopeIcon,
  control: CalendarIcon,
}

/**
 * Una paleta por categoría: `badge` para los chips de tipo/clasificación,
 * `tarjeta` para el borde + fondo difuminado del recuadro del evento, y
 * `motivo` para el texto de la descripción — más oscuro que un gris genérico,
 * pero todavía dentro del mismo tono que el resto de la tarjeta.
 */
type PaletaEvento = { badge: string; tarjeta: string; motivo: string }

const ESTILO_POR_TIPO: Record<TipoEventoHistoria, { texto: string } & PaletaEvento> = {
  consulta: {
    texto: 'Consulta',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
    tarjeta: 'border-blue-200 bg-blue-50/60 dark:border-blue-500/30 dark:bg-blue-500/10',
    motivo: 'text-blue-950 dark:text-blue-200',
  },
  vacuna: {
    texto: 'Vacuna',
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400',
    tarjeta: 'border-purple-200 bg-purple-50/60 dark:border-purple-500/30 dark:bg-purple-500/10',
    motivo: 'text-purple-950 dark:text-purple-200',
  },
  cirugia: {
    texto: 'Cirugía',
    badge: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
    tarjeta: 'border-red-200 bg-red-50/60 dark:border-red-500/30 dark:bg-red-500/10',
    motivo: 'text-red-950 dark:text-red-200',
  },
  tratamiento: {
    texto: 'Tratamiento',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
    tarjeta: 'border-amber-200 bg-amber-50/60 dark:border-amber-500/30 dark:bg-amber-500/10',
    motivo: 'text-amber-950 dark:text-amber-200',
  },
  control: {
    texto: 'Control',
    badge: 'bg-slate-200 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300',
    tarjeta: 'border-slate-200 bg-slate-50/60 dark:border-slate-500/30 dark:bg-slate-500/10',
    motivo: 'text-slate-800 dark:text-slate-200',
  },
}

const ESTILO_POR_CLASIFICACION: Record<ClasificacionTriaje, { texto: string } & PaletaEvento> = {
  alta: {
    texto: 'Triaje alta',
    badge: 'bg-red-300 text-red-950 dark:bg-red-500/30 dark:text-red-200',
    tarjeta: 'border-red-300 bg-red-50/70 dark:border-red-500/40 dark:bg-red-500/10',
    motivo: 'text-red-950 dark:text-red-200',
  },
  media: {
    texto: 'Triaje media',
    badge: 'bg-yellow-300 text-yellow-950 dark:bg-yellow-500/30 dark:text-yellow-200',
    tarjeta: 'border-yellow-300 bg-yellow-50/70 dark:border-yellow-500/40 dark:bg-yellow-500/10',
    motivo: 'text-yellow-950 dark:text-yellow-200',
  },
  baja: {
    texto: 'Triaje baja',
    badge: 'bg-green-300 text-green-950 dark:bg-green-500/30 dark:text-green-200',
    tarjeta: 'border-green-300 bg-green-50/70 dark:border-green-500/40 dark:bg-green-500/10',
    motivo: 'text-green-950 dark:text-green-200',
  },
}

/** Clasificación de triaje manda si existe; si no, el color sale del tipo de evento. */
function paletaDeEvento(evento: EventoHistoria): PaletaEvento {
  return evento.clasificacion
    ? ESTILO_POR_CLASIFICACION[evento.clasificacion]
    : ESTILO_POR_TIPO[evento.tipo]
}

function BadgeTipoEvento({ tipo }: { tipo: TipoEventoHistoria }) {
  const { texto, badge } = ESTILO_POR_TIPO[tipo]
  return (
    <Badge variant="secondary" className={badge}>
      {texto}
    </Badge>
  )
}

function BadgeClasificacion({ clasificacion }: { clasificacion: ClasificacionTriaje }) {
  const { texto, badge } = ESTILO_POR_CLASIFICACION[clasificacion]
  return (
    <Badge variant="secondary" className={badge}>
      {texto}
    </Badge>
  )
}

/**
 * Lista vertical de `historia_clinica` + `consultas` (triajes) ordenada por
 * fecha desc. Si llega `?alerta_id=<id>` en la URL (ej: al entrar desde el
 * `SheetAlertaUrgente` del dashboard), el evento con ese id se resalta para
 * que el veterinario lo encuentre sin tener que buscarlo en la lista.
 */
export function HistoriaTimeline({ eventos }: { eventos: EventoHistoria[] }) {
  const [searchParams] = useSearchParams()
  const alertaId = searchParams.get('alerta_id')

  const ordenados = [...eventos].sort((a, b) => b.fecha.getTime() - a.fecha.getTime())

  if (ordenados.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Todavía no hay eventos en la historia clínica de esta mascota.
      </p>
    )
  }

  return (
    <ol className="relative space-y-4 border-l border-border pl-6">
      {ordenados.map((evento) => {
        const Icono = ICONO_POR_TIPO[evento.tipo]
        const destacado = alertaId !== null && alertaId === evento.id
        const paleta = paletaDeEvento(evento)

        return (
          <li
            key={evento.id}
            className={cn(
              'relative rounded-lg border p-3',
              paleta.tarjeta,
              destacado && 'ring-2 ring-red-500',
            )}
          >
            <span className="absolute top-4 -left-[1.6rem] flex size-5 items-center justify-center rounded-full bg-background ring-1 ring-border">
              <Icono className="size-3 text-muted-foreground" />
            </span>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">
                {format(evento.fecha, "d 'de' MMMM yyyy", { locale: es })}
              </span>
              <BadgeTipoEvento tipo={evento.tipo} />
              {evento.clasificacion ? (
                <BadgeClasificacion clasificacion={evento.clasificacion} />
              ) : null}
            </div>

            <p className={cn('mt-1.5 text-sm', paleta.motivo)}>{evento.descripcion}</p>

            {evento.veterinario ? (
              <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                <UserIcon className="size-3" />
                {evento.veterinario}
              </div>
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}
