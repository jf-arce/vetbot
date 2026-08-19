import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { inicialesDe } from '../lib/iniciales'
import type { TurnoDia } from '../types'

function FilaTurno({ turno }: { turno: TurnoDia }) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <Avatar>
        <AvatarFallback>{inicialesDe(turno.nombreMascota)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{turno.nombreMascota}</p>
        <p className="truncate text-xs text-muted-foreground">{turno.raza}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-xs text-muted-foreground">{turno.hora}</span>
        <Badge
          variant="secondary"
          className={
            turno.tipo === 'Consulta'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400'
              : 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400'
          }
        >
          {turno.tipo}
        </Badge>
      </div>
    </div>
  )
}

export function PanelTurnosDelDia({ turnos }: { turnos: TurnoDia[] }) {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Turnos del día</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 pr-3">
          <div className="divide-y">
            {turnos.map((turno) => (
              <FilaTurno key={turno.id} turno={turno} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
