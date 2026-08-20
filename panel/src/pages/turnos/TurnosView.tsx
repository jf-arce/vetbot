import { endOfDay, startOfDay } from 'date-fns'
import { useMemo, useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { toast } from 'sonner'

import { EmptyState } from '@/components/common/EmptyState'
import { BarraFiltrosTurnos } from './components/BarraFiltrosTurnos'
import { EncabezadoTurnos } from './components/EncabezadoTurnos'
import { TablaTurnos } from './components/TablaTurnos'
import type { VistaTurnos } from './components/SelectorVistaTurnos'
import { TURNOS_MOCK, VETERINARIOS_MOCK } from './data/mockTurnos'
import type { TurnoFila } from './types'

/**
 * ─── CONTRATO DEL MÓDULO ───────────────────────────────────────────────────
 *
 * Vista maquetada con datos mockeados (ver `data/mockTurnos.ts`), mismo
 * criterio que `pages/dashboard/DashboardPage.tsx`. Cuando se conecte a
 * Supabase, `turnos` sale de `listarTurnosDelDia` / `listarProximosTurnos`
 * (`services/turnos.ts`) mapeado a `TurnoFila`.
 *
 * "Confirmar" → `actualizarEstadoTurno()` (Supabase directo).
 * "Cancelar"  → NO es un update directo: borra también el evento de Google
 *   Calendar, así que sale por el webhook de n8n que expone Dev 2. Ver el
 *   TODO de `cancelarTurno()` en `services/turnos.ts`.
 * "Reagendar" → pendiente de definir flujo (probablemente un Dialog con
 *   nueva fecha/hora); acá queda como acción de placeholder.
 * ───────────────────────────────────────────────────────────────────────────
 */
export function TurnosView() {
  const [vista, setVista] = useState<VistaTurnos>('lista')
  const [turnos, setTurnos] = useState<TurnoFila[]>(TURNOS_MOCK)
  const [rangoFechas, setRangoFechas] = useState<DateRange | undefined>(undefined)
  const [veterinariosSeleccionados, setVeterinariosSeleccionados] = useState<string[]>([])
  const [busqueda, setBusqueda] = useState('')

  const turnosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()

    return turnos
      .filter((turno) => {
        if (!rangoFechas?.from) return true
        const desde = startOfDay(rangoFechas.from)
        const hasta = endOfDay(rangoFechas.to ?? rangoFechas.from)
        return turno.fechaHora >= desde && turno.fechaHora <= hasta
      })
      .filter((turno) =>
        veterinariosSeleccionados.length === 0
          ? true
          : veterinariosSeleccionados.includes(turno.veterinario),
      )
      .filter((turno) => {
        if (!termino) return true
        return (
          turno.nombreMascota.toLowerCase().includes(termino) ||
          turno.nombreDueno.toLowerCase().includes(termino) ||
          turno.veterinario.toLowerCase().includes(termino)
        )
      })
      .sort((a, b) => a.fechaHora.getTime() - b.fechaHora.getTime())
  }, [turnos, rangoFechas, veterinariosSeleccionados, busqueda])

  function actualizarEstadoLocal(turnoId: number, estado: TurnoFila['estado']) {
    setTurnos((actuales) =>
      actuales.map((turno) => (turno.id === turnoId ? { ...turno, estado } : turno)),
    )
  }

  function manejarConfirmar(turno: TurnoFila) {
    actualizarEstadoLocal(turno.id, 'confirmado')
    toast.success(`Turno de ${turno.nombreMascota} confirmado`)
  }

  function manejarReagendar(turno: TurnoFila) {
    toast.info(`Reagendar ${turno.nombreMascota}: flujo pendiente de implementar`)
  }

  function manejarCancelar(turno: TurnoFila) {
    actualizarEstadoLocal(turno.id, 'cancelado')
    toast.info(`Turno de ${turno.nombreMascota} cancelado (simulado)`, {
      description: 'En producción esto dispara el webhook de n8n que borra el evento en Calendar.',
    })
  }

  function manejarNuevoTurno() {
    toast.info('Formulario de nuevo turno pendiente de implementar')
  }

  return (
    <>
      <EncabezadoTurnos vista={vista} onVistaChange={setVista} onNuevoTurno={manejarNuevoTurno} />

      <BarraFiltrosTurnos
        rangoFechas={rangoFechas}
        onRangoFechasChange={setRangoFechas}
        veterinarios={VETERINARIOS_MOCK}
        veterinariosSeleccionados={veterinariosSeleccionados}
        onVeterinariosSeleccionadosChange={setVeterinariosSeleccionados}
        busqueda={busqueda}
        onBusquedaChange={setBusqueda}
      />

      {vista === 'lista' ? (
        <TablaTurnos
          turnos={turnosFiltrados}
          onConfirmar={manejarConfirmar}
          onReagendar={manejarReagendar}
          onCancelar={manejarCancelar}
        />
      ) : (
        <EmptyState
          titulo={vista === 'calendario' ? 'Vista Calendario' : 'Vista Timeline'}
          descripcion="Todavía no implementada — por ahora la agenda se gestiona desde la vista Lista."
        />
      )}
    </>
  )
}
