import { useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

/**
 * DatePicker simulado (Popover + Calendar) para el header del dashboard.
 * Por ahora solo cambia el label — conectarlo a los services es tarea de
 * cuando el módulo deje de leer datos mockeados.
 */
export function SelectorFecha() {
  const [fecha, setFecha] = useState<Date | undefined>(new Date())

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline">
            <CalendarIcon />
            {fecha ? format(fecha, "d 'de' MMMM, yyyy", { locale: es }) : 'Elegir fecha'}
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={fecha}
          onSelect={setFecha}
          locale={es}
        />
      </PopoverContent>
    </Popover>
  )
}
