import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useMemo } from 'react'

import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EmptyState } from '@/components/common/EmptyState'
import { type AccionesFilaTurno, crearColumnasTurnos } from '../lib/columnas'
import type { TurnoFila } from '../types'

export function TablaTurnos({
  turnos,
  ...acciones
}: { turnos: TurnoFila[] } & AccionesFilaTurno) {
  const columnas = useMemo(() => crearColumnasTurnos(acciones), [acciones])

  const tabla = useReactTable({
    data: turnos,
    columns: columnas,
    getCoreRowModel: getCoreRowModel(),
  })

  if (turnos.length === 0) {
    return (
      <EmptyState
        titulo="No hay turnos para este filtro"
        descripcion="Probá ajustar el rango de fechas, el veterinario o la búsqueda."
      />
    )
  }

  return (
    <Card className="overflow-hidden p-0 shadow-none">
      <Table>
        <TableHeader>
          {tabla.getHeaderGroups().map((grupo) => (
            <TableRow key={grupo.id}>
              {grupo.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {tabla.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
