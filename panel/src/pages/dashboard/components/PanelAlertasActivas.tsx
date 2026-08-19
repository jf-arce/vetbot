import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { inicialesDe } from '../lib/iniciales'
import type { AlertaActiva } from '../types'

function FilaAlerta({ alerta }: { alerta: AlertaActiva }) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <Avatar>
        <AvatarFallback>{inicialesDe(alerta.nombreMascota)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium">{alerta.nombreMascota}</p>
          <Badge
            variant="secondary"
            className={
              alerta.urgencia === 'alta'
                ? 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400'
                : 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400'
            }
          >
            {alerta.urgencia === 'alta' ? 'Alta' : 'Media'}
          </Badge>
        </div>
        <p className="truncate text-xs text-muted-foreground">{alerta.raza}</p>
        <p className="truncate text-xs text-muted-foreground">{alerta.sintomas}</p>
      </div>
      <span className="shrink-0 text-xs text-muted-foreground">
        {alerta.tiempoTranscurrido}
      </span>
    </div>
  )
}

export function PanelAlertasActivas({ alertas }: { alertas: AlertaActiva[] }) {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Alertas activas</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 pr-3">
          <div className="divide-y">
            {alertas.map((alerta) => (
              <FilaAlerta key={alerta.id} alerta={alerta} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
