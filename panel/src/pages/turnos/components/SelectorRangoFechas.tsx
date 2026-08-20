import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

function etiquetaDe(rango: DateRange | undefined): string {
  if (!rango?.from) return 'Elegir fechas'
  if (!rango.to || rango.to.getTime() === rango.from.getTime()) {
    return format(rango.from, "d 'de' MMM", { locale: es })
  }
  return `${format(rango.from, 'd MMM', { locale: es })} – ${format(rango.to, 'd MMM', { locale: es })}`
}

/** DateRangePicker armado sobre Popover + Calendar (mode="range"), igual criterio que `dashboard/components/SelectorFecha.tsx`. */
export function SelectorRangoFechas({
  rango,
  onRangoChange,
}: {
  rango: DateRange | undefined
  onRangoChange: (rango: DateRange | undefined) => void
}) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline">
            <CalendarIcon />
            {etiquetaDe(rango)}
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0">
        <Calendar mode="range" selected={rango} onSelect={onRangoChange} locale={es} />
      </PopoverContent>
    </Popover>
  )
}
