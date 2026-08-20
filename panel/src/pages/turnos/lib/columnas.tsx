import { createColumnHelper } from '@tanstack/react-table'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { TriangleAlertIcon } from 'lucide-react'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { AccionesTurnoMenu } from '../components/AccionesTurnoMenu'
import { BadgeEstadoTurno } from '../components/BadgeEstadoTurno'
import { BadgePrioridad } from '../components/BadgePrioridad'
import type { TurnoFila } from '../types'

/** Acciones de fila que dispara la columna "Acciones" (ver contrato del módulo). */
export interface AccionesFilaTurno {
  onConfirmar: (turno: TurnoFila) => void
  onReagendar: (turno: TurnoFila) => void
  onCancelar: (turno: TurnoFila) => void
}

const columnHelper = createColumnHelper<TurnoFila>()

export function crearColumnasTurnos(acciones: AccionesFilaTurno) {
  return [
    columnHelper.display({
      id: 'turno',
      header: 'Turnos del Día con Prioridad',
      cell: ({ row }) => {
        const turno = row.original
        return (
          <div className="flex items-center gap-2.5">
            <BadgePrioridad prioridad={turno.prioridad} />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-medium">{turno.nombreMascota}</span>
                {turno.notaManejo ? (
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <span className="inline-flex text-orange-500">
                          <TriangleAlertIcon className="size-3.5" />
                        </span>
                      }
                    />
                    <TooltipContent>{turno.notaManejo}</TooltipContent>
                  </Tooltip>
                ) : null}
              </div>
              <p className="truncate text-xs text-muted-foreground">{turno.nombreDueno}</p>
            </div>
          </div>
        )
      },
    }),
    columnHelper.accessor('veterinario', {
      header: 'Veterinario',
      cell: (info) => <span className="text-sm">{info.getValue()}</span>,
    }),
    columnHelper.accessor('fechaHora', {
      id: 'tiempo',
      header: 'Tiempo',
      cell: (info) => (
        <span className="text-sm tabular-nums">
          {format(info.getValue(), 'HH:mm', { locale: es })}
        </span>
      ),
    }),
    columnHelper.accessor('motivo', {
      header: 'Uso',
      cell: (info) => <span className="text-sm">{info.getValue()}</span>,
    }),
    columnHelper.accessor('estado', {
      header: 'Estado',
      cell: (info) => <BadgeEstadoTurno estado={info.getValue()} />,
    }),
    columnHelper.display({
      id: 'acciones',
      header: () => <span className="sr-only">Acciones</span>,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <AccionesTurnoMenu
            onConfirmar={() => acciones.onConfirmar(row.original)}
            onReagendar={() => acciones.onReagendar(row.original)}
            onCancelar={() => acciones.onCancelar(row.original)}
          />
        </div>
      ),
    }),
  ]
}
