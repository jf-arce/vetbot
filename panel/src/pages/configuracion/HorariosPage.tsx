import { useEffect, useState } from 'react'
import { SaveIcon } from 'lucide-react'
import { toast } from 'sonner'

import { ErrorState } from '@/components/common/ErrorState'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { actualizarHorario, listarHorarios } from '@/services/configuracion'
import type { DiaSemana, HorarioAtencion } from '@/types/db'
import { aHoraDb, aHoraInput, aOffset } from './lib/horaTz'

/**
 * ─── CONTRATO DEL MÓDULO ───────────────────────────────────────────────────
 *
 * Tabla: `horarios_atencion`. Confirmado vía MCP: hoy tiene 6 filas reales
 * (lunes a sábado, todas `activo=true`, 09:00-18:00 salvo sábado 09:00-13:00)
 * — **no hay fila de domingo**. El service (`actualizarHorario`) solo hace
 * UPDATE por `id`, no INSERT, así que domingo no se puede crear desde acá
 * sin coordinarlo con Dev 2 (fuera de alcance del panel); se muestran
 * únicamente los días que ya tienen fila.
 *
 * `hora_apertura`/`hora_cierre` son `timetz` — ver `lib/horaTz.ts` para el
 * manejo del offset.
 * ───────────────────────────────────────────────────────────────────────────
 */

const ORDEN_DIAS: DiaSemana[] = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']

const ETIQUETA_DIA: Record<DiaSemana, string> = {
  lunes: 'Lunes',
  martes: 'Martes',
  miercoles: 'Miércoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
  sabado: 'Sábado',
  domingo: 'Domingo',
}

interface FilaHorario {
  id: string
  dia_semana: DiaSemana
  apertura: string
  cierre: string
  activo: boolean
  offsetApertura: string
  offsetCierre: string
}

function aFila(horario: HorarioAtencion): FilaHorario {
  return {
    id: horario.id,
    dia_semana: horario.dia_semana,
    apertura: aHoraInput(horario.hora_apertura),
    cierre: aHoraInput(horario.hora_cierre),
    activo: horario.activo,
    offsetApertura: aOffset(horario.hora_apertura),
    offsetCierre: aOffset(horario.hora_cierre),
  }
}

export function HorariosPage() {
  const [filas, setFilas] = useState<FilaHorario[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    listarHorarios()
      .then((datos) => {
        const ordenados = [...datos].sort(
          (a, b) => ORDEN_DIAS.indexOf(a.dia_semana) - ORDEN_DIAS.indexOf(b.dia_semana),
        )
        setFilas(ordenados.map(aFila))
        setError(null)
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'No se pudo cargar.'))
  }, [tick])

  function actualizarFila<Campo extends keyof FilaHorario>(id: string, campo: Campo, valor: FilaHorario[Campo]) {
    setFilas((actuales) =>
      actuales ? actuales.map((fila) => (fila.id === id ? { ...fila, [campo]: valor } : fila)) : actuales,
    )
  }

  const filasInvalidas = (filas ?? []).filter(
    (fila) => fila.activo && fila.apertura && fila.cierre && fila.apertura >= fila.cierre,
  )

  async function handleGuardar() {
    if (!filas || filasInvalidas.length > 0) return

    setGuardando(true)
    try {
      await Promise.all(
        filas.map((fila) =>
          actualizarHorario(fila.id, {
            hora_apertura: aHoraDb(fila.apertura, fila.offsetApertura),
            hora_cierre: aHoraDb(fila.cierre, fila.offsetCierre),
            activo: fila.activo,
          }),
        ),
      )
      toast.success('Horarios actualizados')
    } catch (err) {
      toast.error('No se pudo guardar', { description: err instanceof Error ? err.message : undefined })
    } finally {
      setGuardando(false)
    }
  }

  if (error && !filas) {
    return <ErrorState mensaje={error} onReintentar={() => setTick((valor) => valor + 1)} />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Horarios de atención</CardTitle>
        <CardDescription>El bot solo ofrece turnos dentro de estos horarios.</CardDescription>
      </CardHeader>
      <CardContent>
        {!filas ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, indice) => (
              <Skeleton key={indice} className="h-9 w-full" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Día</TableHead>
                <TableHead>Apertura</TableHead>
                <TableHead>Cierre</TableHead>
                <TableHead className="text-right">Activo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filas.map((fila) => {
                const invalida = filasInvalidas.some((f) => f.id === fila.id)
                return (
                  <TableRow key={fila.id}>
                    <TableCell className="font-medium">{ETIQUETA_DIA[fila.dia_semana]}</TableCell>
                    <TableCell>
                      <Input
                        type="time"
                        className="w-32"
                        disabled={!fila.activo}
                        value={fila.apertura}
                        onChange={(evento) => actualizarFila(fila.id, 'apertura', evento.target.value)}
                        aria-invalid={invalida}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="time"
                        className="w-32"
                        disabled={!fila.activo}
                        value={fila.cierre}
                        onChange={(evento) => actualizarFila(fila.id, 'cierre', evento.target.value)}
                        aria-invalid={invalida}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Switch
                        checked={fila.activo}
                        onCheckedChange={(marcado) => actualizarFila(fila.id, 'activo', marcado)}
                      />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
        {filasInvalidas.length > 0 ? (
          <p className="mt-2 text-xs text-destructive">
            {ETIQUETA_DIA[filasInvalidas[0].dia_semana]}: la apertura tiene que ser antes que el cierre.
          </p>
        ) : null}
      </CardContent>
      <CardFooter className="justify-end bg-transparent">
        <Button onClick={handleGuardar} disabled={!filas || guardando || filasInvalidas.length > 0}>
          <SaveIcon />
          Guardar cambios
        </Button>
      </CardFooter>
    </Card>
  )
}
