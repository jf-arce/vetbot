import { AlertCircleIcon, CalendarCheckIcon, CalendarClockIcon } from 'lucide-react'

import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function TarjetasKpi({
  seguimientosHoy,
  paraCompletar,
  proximos7Dias,
}: {
  seguimientosHoy: number
  paraCompletar: number
  proximos7Dias: number
}) {
  const items = [
    {
      titulo: 'Seguimientos hoy',
      valor: seguimientosHoy,
      icono: CalendarCheckIcon,
      claseIcono: 'text-green-600 dark:text-green-500',
    },
    {
      titulo: 'Para completar',
      valor: paraCompletar,
      icono: AlertCircleIcon,
      claseIcono: 'text-red-600 dark:text-red-500',
    },
    {
      titulo: 'Próximos 7 días',
      valor: proximos7Dias,
      icono: CalendarClockIcon,
      claseIcono: 'text-blue-600 dark:text-blue-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {items.map((item) => (
        <Card key={item.titulo}>
          <CardHeader>
            <CardTitle className="text-sm font-normal text-muted-foreground">{item.titulo}</CardTitle>
            <CardAction>
              <item.icono className={cn('size-4', item.claseIcono)} />
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tabular-nums">{item.valor}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
