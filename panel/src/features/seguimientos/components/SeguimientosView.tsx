import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { PageHeader } from '@/components/layout/PageHeader'
import { cn } from '@/lib/utils'
import { MOCK_SEGUIMIENTOS } from '../data/mockSeguimientos'
import { estaEnProximos7Dias, grupoDeFecha } from '../lib/agrupar'
import type { GrupoTablero, SeguimientoConDetalle } from '../types'
import { SelectorFechaSeguimientos } from './SelectorFechaSeguimientos'
import { SheetDetalleSeguimiento } from './SheetDetalleSeguimiento'
import { TarjetaSeguimiento } from './TarjetaSeguimiento'
import { TarjetasKpi } from './TarjetasKpi'

const FECHA_POR_DEFECTO = new Date(2026, 7, 20) // 20 de agosto de 2026

const COLUMNAS: { grupo: GrupoTablero; titulo: string; vacio: string; claseColumna?: string }[] = [
  {
    grupo: 'vencidos',
    titulo: 'Vencidos',
    vacio: 'No hay seguimientos vencidos.',
    claseColumna: 'border-red-200 bg-red-50/50 dark:border-red-500/30 dark:bg-red-500/10',
  },
  { grupo: 'hoy', titulo: 'Hoy', vacio: 'No hay seguimientos programados para hoy.' },
  { grupo: 'manana', titulo: 'Mañana', vacio: 'No hay seguimientos programados para mañana.' },
]

/**
 * Tablero de auditoría del bot (mock en `data/mockSeguimientos.ts`, mismo
 * criterio que `AlertasView`). El panel NO manda WhatsApps manuales — todo
 * el contacto con el cliente lo hace el bot (wf 06 + wf 01); acá solo se
 * audita esa conversación y, si hace falta, se pausa para que un humano
 * tome el caso.
 *
 * Cuando se conecte a Supabase: `seguimientos` sale de `listarSeguimientos()`
 * (`services/seguimientos.ts`); "Pausar bot" necesita un mecanismo nuevo que
 * hoy no existe en el schema (ver nota en `../types.ts`).
 */
export function SeguimientosView() {
  const [seguimientos, setSeguimientos] = useState<SeguimientoConDetalle[]>(MOCK_SEGUIMIENTOS)
  const [fechaReferencia, setFechaReferencia] = useState<Date>(FECHA_POR_DEFECTO)
  const [seguimientoSeleccionado, setSeguimientoSeleccionado] = useState<SeguimientoConDetalle | null>(
    null,
  )
  const [sheetAbierto, setSheetAbierto] = useState(false)

  const { columnas, kpis } = useMemo(() => {
    const porGrupo: Record<GrupoTablero, SeguimientoConDetalle[]> = {
      vencidos: [],
      hoy: [],
      manana: [],
    }

    let paraCompletar = 0
    let proximos7Dias = 0

    for (const seguimiento of seguimientos) {
      if (seguimiento.estado !== 'respondido') paraCompletar += 1
      if (estaEnProximos7Dias(seguimiento.fecha_programada, fechaReferencia)) proximos7Dias += 1

      const grupo = grupoDeFecha(seguimiento.fecha_programada, fechaReferencia)
      if (grupo) porGrupo[grupo].push(seguimiento)
    }

    for (const lista of Object.values(porGrupo)) {
      lista.sort((a, b) => a.fecha_programada.localeCompare(b.fecha_programada))
    }

    return {
      columnas: porGrupo,
      kpis: {
        seguimientosHoy: porGrupo.hoy.length,
        paraCompletar,
        proximos7Dias,
      },
    }
  }, [seguimientos, fechaReferencia])

  function abrirChat(seguimiento: SeguimientoConDetalle) {
    setSeguimientoSeleccionado(seguimiento)
    setSheetAbierto(true)
  }

  function pausarBot(seguimiento: SeguimientoConDetalle) {
    setSeguimientos((actuales) =>
      actuales.map((item) => (item.id === seguimiento.id ? { ...item, botPausado: true } : item)),
    )
    setSheetAbierto(false)
    toast.info(`Bot pausado para ${seguimiento.turno?.mascota?.nombre ?? 'este caso'}`, {
      description:
        'Simulado — el schema real todavía no tiene un mecanismo para pausar la automatización de un cliente puntual.',
    })
  }

  return (
    <>
      <PageHeader
        titulo="Seguimientos Programados"
        descripcion="Auditoría del seguimiento automático del bot"
        acciones={<SelectorFechaSeguimientos fecha={fechaReferencia} onFechaChange={setFechaReferencia} />}
      />

      <TarjetasKpi {...kpis} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {COLUMNAS.map(({ grupo, titulo, vacio, claseColumna }) => {
          const lista = columnas[grupo]

          return (
            <section
              key={grupo}
              className={cn(
                'max-h-[calc(100vh-300px)] overflow-y-auto pr-1',
                // Sin plugin de scrollbar instalado (no está en package.json) — estilo fino vía
                // arbitrary properties: [scrollbar-*] cubre Firefox, [&::-webkit-scrollbar*] cubre Chrome/Safari/Edge.
                '[scrollbar-color:var(--color-border)_transparent] [scrollbar-width:thin]',
                '[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent',
              )}
            >
              <h2 className="sticky top-0 z-10 bg-background/95 pb-3 text-sm font-medium text-muted-foreground backdrop-blur-sm">
                {titulo}
                {lista.length > 0 ? ` (${lista.length})` : ''}
              </h2>

              {lista.length === 0 ? (
                <p className="text-sm text-muted-foreground">{vacio}</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {lista.map((seguimiento) => (
                    <TarjetaSeguimiento
                      key={seguimiento.id}
                      seguimiento={seguimiento}
                      fechaReferencia={fechaReferencia}
                      className={claseColumna}
                      onVerChat={() => abrirChat(seguimiento)}
                    />
                  ))}
                </div>
              )}
            </section>
          )
        })}
      </div>

      <SheetDetalleSeguimiento
        seguimiento={seguimientoSeleccionado}
        fechaReferencia={fechaReferencia}
        open={sheetAbierto}
        onOpenChange={setSheetAbierto}
        onPausarBot={pausarBot}
      />
    </>
  )
}
