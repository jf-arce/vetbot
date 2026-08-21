import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { MOCK_ALERTAS } from '../data/mockAlertas'
import type { AlertaConDetalle, FiltroUrgencia } from '../types'
import { SheetDetalleAlerta } from './SheetDetalleAlerta'
import { TarjetaAlerta } from './TarjetaAlerta'

const FILTROS_URGENCIA: { valor: FiltroUrgencia; etiqueta: string }[] = [
  { valor: 'todas', etiqueta: 'Todas' },
  { valor: 'alta', etiqueta: 'Alta' },
  { valor: 'media', etiqueta: 'Media' },
  { valor: 'baja', etiqueta: 'Baja' },
]

/**
 * Mock temporal (`data/mockAlertas.ts`) — mismo criterio que `TurnosView`.
 * Cuando se conecte a Supabase, `alertas` sale de `listarAlertas('pendiente')`
 * (`services/alertas.ts`) y "Marcar como Atendido" pasa a llamar
 * `marcarAlertaAtendida(id, atendidoPor)` en vez de mutar el estado local.
 *
 * Seguimientos NO va acá: esa pantalla ya tiene su propia ruta (`/seguimientos`,
 * ver `pages/seguimientos/`) — mostrar los mismos datos acá duplicaría la
 * navegación.
 */
export function AlertasView() {
  const [alertas, setAlertas] = useState<AlertaConDetalle[]>(MOCK_ALERTAS)
  const [filtroUrgencia, setFiltroUrgencia] = useState<FiltroUrgencia>('todas')
  const [alertaSeleccionada, setAlertaSeleccionada] = useState<AlertaConDetalle | null>(null)
  const [sheetAbierto, setSheetAbierto] = useState(false)

  const alertasActivas = useMemo(
    () =>
      alertas
        .filter((alerta) => alerta.estado === 'pendiente')
        .filter((alerta) =>
          filtroUrgencia === 'todas' ? true : alerta.consulta?.clasificacion === filtroUrgencia,
        )
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    [alertas, filtroUrgencia],
  )

  function abrirDetalle(alerta: AlertaConDetalle) {
    setAlertaSeleccionada(alerta)
    setSheetAbierto(true)
  }

  function marcarAtendida(alerta: AlertaConDetalle) {
    setAlertas((actuales) =>
      actuales.map((item) =>
        item.id === alerta.id ? { ...item, estado: 'atendido', atendido_por: 'Vos' } : item,
      ),
    )
    setSheetAbierto(false)
    toast.success(`Alerta de ${alerta.mascota?.nombre ?? 'la mascota'} marcada como atendida`, {
      description: 'Simulado — falta conectar con marcarAlertaAtendida() en services/alertas.ts.',
    })
  }

  return (
    <>
      <PageHeader
        titulo="Alertas"
        descripcion="Casos de urgencia alta derivados por el triaje del bot"
      />

      <div className="flex flex-wrap items-center gap-2">
        {FILTROS_URGENCIA.map((filtro) => (
          <Button
            key={filtro.valor}
            size="sm"
            variant={filtroUrgencia === filtro.valor ? 'secondary' : 'ghost'}
            className="rounded-full"
            onClick={() => setFiltroUrgencia(filtro.valor)}
          >
            {filtro.etiqueta}
          </Button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {alertasActivas.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No hay alertas activas{filtroUrgencia === 'todas' ? '' : ` de urgencia ${filtroUrgencia}`} en
            este momento.
          </div>
        ) : (
          alertasActivas.map((alerta) => (
            <TarjetaAlerta key={alerta.id} alerta={alerta} onVerDetalle={() => abrirDetalle(alerta)} />
          ))
        )}
      </div>

      <SheetDetalleAlerta
        alerta={alertaSeleccionada}
        open={sheetAbierto}
        onOpenChange={setSheetAbierto}
        onMarcarAtendida={marcarAtendida}
      />
    </>
  )
}
