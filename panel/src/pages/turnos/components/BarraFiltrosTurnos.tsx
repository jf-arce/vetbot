import type { DateRange } from 'react-day-picker'

import { BuscadorTurnos } from './BuscadorTurnos'
import { FiltroVeterinarios } from './FiltroVeterinarios'
import { SelectorRangoFechas } from './SelectorRangoFechas'

export function BarraFiltrosTurnos({
  rangoFechas,
  onRangoFechasChange,
  veterinarios,
  veterinariosSeleccionados,
  onVeterinariosSeleccionadosChange,
  busqueda,
  onBusquedaChange,
}: {
  rangoFechas: DateRange | undefined
  onRangoFechasChange: (rango: DateRange | undefined) => void
  veterinarios: string[]
  veterinariosSeleccionados: string[]
  onVeterinariosSeleccionadosChange: (seleccionados: string[]) => void
  busqueda: string
  onBusquedaChange: (busqueda: string) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <SelectorRangoFechas rango={rangoFechas} onRangoChange={onRangoFechasChange} />
      <FiltroVeterinarios
        veterinarios={veterinarios}
        seleccionados={veterinariosSeleccionados}
        onSeleccionadosChange={onVeterinariosSeleccionadosChange}
      />
      <BuscadorTurnos valor={busqueda} onValorChange={onBusquedaChange} />
    </div>
  )
}
