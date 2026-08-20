import {
  HISTORIA_MOCK,
  MASCOTA_DETALLE_MOCK,
  RECORDATORIOS_MOCK,
} from '../data/mockMascotaDetalle'
import { HistoriaTimeline } from './HistoriaTimeline'
import { MascotaHeader } from './MascotaHeader'
import { WidgetsSidebar } from './WidgetsSidebar'

/**
 * Ficha completa de la mascota: header con datos + alerta, historia clínica
 * (timeline) a la izquierda y widgets auxiliares a la derecha.
 *
 * Mock temporal — se conecta a `obtenerMascota` / `listarHistoriaClinica` /
 * `listarRecordatoriosDeMascota` (`services/mascotas.ts`) cuando el schema
 * esté cerrado. El `:mascotaId` de la URL todavía no se usa para filtrar.
 */
export function MascotaView() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <MascotaHeader mascota={MASCOTA_DETALLE_MOCK} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">Historia clínica</h2>
          <HistoriaTimeline eventos={HISTORIA_MOCK} />
        </div>

        <div className="lg:col-span-1">
          <WidgetsSidebar recordatorios={RECORDATORIOS_MOCK} />
        </div>
      </div>
    </div>
  )
}
