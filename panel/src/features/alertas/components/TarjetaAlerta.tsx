import type { ClasificacionTriaje } from '@/types/db'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { tiempoRelativo } from '../lib/tiempo'
import type { AlertaConDetalle } from '../types'

/**
 * Borde + fondo difuminado según urgencia — mismo criterio que
 * `ESTILO_POR_CLASIFICACION` en `features/mascotas/components/HistoriaTimeline.tsx`
 * (misma paleta de colores, para que un caso 🔴 se vea igual en las dos pantallas).
 */
const ESTILO_URGENCIA: Record<
  ClasificacionTriaje,
  { texto: string; badge: string; tarjeta: string }
> = {
  alta: {
    texto: 'Alta',
    badge: 'bg-red-300 text-red-950 dark:bg-red-500/30 dark:text-red-200',
    tarjeta:
      'border-red-300 bg-red-50/70 hover:bg-red-100/70 dark:border-red-500/40 dark:bg-red-500/10 dark:hover:bg-red-500/15',
  },
  media: {
    texto: 'Media',
    badge: 'bg-yellow-300 text-yellow-950 dark:bg-yellow-500/30 dark:text-yellow-200',
    tarjeta:
      'border-yellow-300 bg-yellow-50/70 hover:bg-yellow-100/70 dark:border-yellow-500/40 dark:bg-yellow-500/10 dark:hover:bg-yellow-500/15',
  },
  baja: {
    texto: 'Baja',
    badge: 'bg-green-300 text-green-950 dark:bg-green-500/30 dark:text-green-200',
    tarjeta:
      'border-green-300 bg-green-50/70 hover:bg-green-100/70 dark:border-green-500/40 dark:bg-green-500/10 dark:hover:bg-green-500/15',
  },
}

const ESTILO_SIN_CLASIFICAR = {
  tarjeta: 'border-border bg-card hover:bg-accent/50',
}

function iniciales(nombre: string) {
  return nombre.slice(0, 2).toUpperCase()
}

export function TarjetaAlerta({
  alerta,
  onVerDetalle,
}: {
  alerta: AlertaConDetalle
  onVerDetalle: () => void
}) {
  const urgencia = alerta.consulta?.clasificacion ? ESTILO_URGENCIA[alerta.consulta.clasificacion] : null

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onVerDetalle}
      onKeyDown={(evento) => {
        if (evento.key === 'Enter' || evento.key === ' ') onVerDetalle()
      }}
      className={cn(
        'flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors',
        urgencia?.tarjeta ?? ESTILO_SIN_CLASIFICAR.tarjeta,
      )}
    >
      <Avatar size="lg">
        <AvatarFallback>{iniciales(alerta.mascota?.nombre ?? '?')}</AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="min-w-0">
          <span className="font-medium">{alerta.mascota?.nombre ?? 'Mascota sin identificar'}</span>
          {alerta.mascota?.raza ? (
            <span className="text-muted-foreground"> · {alerta.mascota.raza}</span>
          ) : null}
        </div>

        <p className="text-sm">
          <span className="font-medium">Síntomas: </span>
          {alerta.resumen_caso}
        </p>

        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Dueño: </span>
          {alerta.cliente?.nombre ?? 'Sin datos'}
          {alerta.cliente?.telefono ? ` · ${alerta.cliente.telefono}` : ''}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5">
        {urgencia ? (
          <Badge variant="secondary" className={urgencia.badge}>
            {urgencia.texto}
          </Badge>
        ) : null}
        <span className="text-xs whitespace-nowrap text-muted-foreground">
          {tiempoRelativo(new Date(alerta.created_at))}
        </span>
      </div>
    </div>
  )
}
