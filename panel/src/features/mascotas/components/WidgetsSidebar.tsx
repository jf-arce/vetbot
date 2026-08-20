import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { AlarmClockIcon, LineChartIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { RecordatorioMascota } from '../types'

const TEXTO_TIPO_RECORDATORIO: Record<RecordatorioMascota['tipo'], string> = {
  vacuna: 'Vacuna',
  desparasitacion: 'Desparasitación',
  control: 'Control',
}

function WidgetProximosRecordatorios({
  recordatorios,
}: {
  recordatorios: RecordatorioMascota[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <AlarmClockIcon className="size-4 text-muted-foreground" />
          Próximos Recordatorios
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recordatorios.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin recordatorios pendientes.</p>
        ) : (
          <ul className="space-y-2.5">
            {recordatorios.map((recordatorio) => (
              <li key={recordatorio.id} className="flex items-center justify-between gap-2 text-sm">
                <span>{TEXTO_TIPO_RECORDATORIO[recordatorio.tipo]}</span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {format(recordatorio.fechaVencimiento, 'd MMM yyyy', { locale: es })}
                  </span>
                  {recordatorio.enviado ? (
                    <Badge variant="secondary" className="bg-muted text-muted-foreground">
                      Enviado
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
                    >
                      Pendiente
                    </Badge>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

/** Placeholder — la evolución real sale de `historia_clinica.peso_registrado` (servicio: `listarEvolucionPeso`). */
function WidgetGraficoPeso() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <LineChartIcon className="size-4 text-muted-foreground" />
          Gráfico de Peso
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
          Evolución de peso — pendiente de conectar
        </div>
      </CardContent>
    </Card>
  )
}

export function WidgetsSidebar({ recordatorios }: { recordatorios: RecordatorioMascota[] }) {
  return (
    <div className="flex flex-col gap-4">
      <WidgetProximosRecordatorios recordatorios={recordatorios} />
      <WidgetGraficoPeso />
    </div>
  )
}
