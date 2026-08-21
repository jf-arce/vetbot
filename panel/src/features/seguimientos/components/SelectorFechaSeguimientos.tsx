import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

/** Mismo criterio que `dashboard/components/SelectorFecha.tsx`, pero controlado desde el padre: acá la fecha maneja qué es "vencido/hoy/mañana" en el tablero. */
export function SelectorFechaSeguimientos({
  fecha,
  onFechaChange,
}: {
  fecha: Date
  onFechaChange: (fecha: Date) => void
}) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline">
            <CalendarIcon />
            {format(fecha, "d 'de' MMMM, yyyy", { locale: es })}
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={fecha}
          onSelect={(seleccion) => {
            if (seleccion) onFechaChange(seleccion)
          }}
          locale={es}
        />
      </PopoverContent>
    </Popover>
  )
}
