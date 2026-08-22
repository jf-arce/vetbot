import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarOffIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import { toast } from 'sonner'

import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { crearExcepcion, eliminarExcepcion, listarExcepciones } from '@/services/configuracion'
import type { ExcepcionHorario } from '@/types/db'
import { OFFSET_TZ_CLINICA, aHoraDb } from './lib/horaTz'

/**
 * ─── CONTRATO DEL MÓDULO ───────────────────────────────────────────────────
 *
 * Tabla: `excepciones_horario` — hoy 0 filas (confirmado vía MCP).
 * `services/configuracion.ts` → listarExcepciones() ya filtra desde hoy y
 * ordena por fecha. `hora_apertura`/`hora_cierre` son `timetz` nullable,
 * solo se cargan cuando `cerrado=false` — ver `lib/horaTz.ts` para el offset
 * (acá siempre `OFFSET_TZ_CLINICA`, no hay fila previa de la que copiarlo).
 * ───────────────────────────────────────────────────────────────────────────
 */
export function ExcepcionesPage() {
  const [excepciones, setExcepciones] = useState<ExcepcionHorario[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)
  const [idEnConfirmacion, setIdEnConfirmacion] = useState<string | null>(null)

  const [dialogAbierto, setDialogAbierto] = useState(false)
  const [fecha, setFecha] = useState<Date | undefined>(undefined)
  const [cerrado, setCerrado] = useState(true)
  const [apertura, setApertura] = useState('')
  const [cierre, setCierre] = useState('')
  const [motivo, setMotivo] = useState('')
  const [creando, setCreando] = useState(false)

  useEffect(() => {
    listarExcepciones()
      .then((datos) => {
        setExcepciones(datos)
        setError(null)
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'No se pudo cargar.'))
  }, [tick])

  function resetFormulario() {
    setFecha(undefined)
    setCerrado(true)
    setApertura('')
    setCierre('')
    setMotivo('')
  }

  const horarioIncompleto = !cerrado && (!apertura || !cierre || apertura >= cierre)

  async function handleCrear() {
    if (!fecha || horarioIncompleto) return

    setCreando(true)
    try {
      await crearExcepcion({
        fecha: format(fecha, 'yyyy-MM-dd'),
        cerrado,
        hora_apertura: cerrado ? null : aHoraDb(apertura, OFFSET_TZ_CLINICA),
        hora_cierre: cerrado ? null : aHoraDb(cierre, OFFSET_TZ_CLINICA),
        motivo: motivo.trim() || null,
      })
      toast.success('Excepción agregada')
      setDialogAbierto(false)
      resetFormulario()
      setTick((valor) => valor + 1)
    } catch (err) {
      toast.error('No se pudo agregar', { description: err instanceof Error ? err.message : undefined })
    } finally {
      setCreando(false)
    }
  }

  async function handleEliminar(id: string) {
    try {
      await eliminarExcepcion(id)
      setIdEnConfirmacion(null)
      toast.success('Excepción eliminada')
      setTick((valor) => valor + 1)
    } catch (err) {
      toast.error('No se pudo eliminar', { description: err instanceof Error ? err.message : undefined })
    }
  }

  if (error && !excepciones) {
    return <ErrorState mensaje={error} onReintentar={() => setTick((valor) => valor + 1)} />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Excepciones</CardTitle>
        <CardDescription>Feriados y cierres puntuales — el bot no ofrece turnos esos días/horas.</CardDescription>

        <CardAction>
        <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
          <DialogTrigger
            render={
              <Button size="sm">
                <PlusIcon />
                Agregar
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nueva excepción</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <Calendar
                mode="single"
                selected={fecha}
                onSelect={setFecha}
                disabled={{ before: new Date() }}
                locale={es}
                className="mx-auto"
              />

              <div className="flex items-center gap-2.5">
                <Switch id="cerrado" checked={cerrado} onCheckedChange={setCerrado} />
                <Label htmlFor="cerrado">{cerrado ? 'Cerrado todo el día' : 'Abre con horario especial'}</Label>
              </div>

              {!cerrado ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="excepcion-apertura">Apertura</Label>
                    <Input
                      id="excepcion-apertura"
                      type="time"
                      value={apertura}
                      onChange={(evento) => setApertura(evento.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="excepcion-cierre">Cierre</Label>
                    <Input
                      id="excepcion-cierre"
                      type="time"
                      value={cierre}
                      onChange={(evento) => setCierre(evento.target.value)}
                    />
                  </div>
                  {horarioIncompleto ? (
                    <p className="col-span-2 text-xs text-destructive">
                      Completá apertura y cierre (apertura antes que cierre).
                    </p>
                  ) : null}
                </div>
              ) : null}

              <div className="space-y-1.5">
                <Label htmlFor="excepcion-motivo">Motivo (opcional)</Label>
                <Input
                  id="excepcion-motivo"
                  placeholder="Ej: Feriado nacional"
                  value={motivo}
                  onChange={(evento) => setMotivo(evento.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleCrear} disabled={!fecha || horarioIncompleto || creando}>
                Guardar excepción
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </CardAction>
      </CardHeader>

      <CardContent>
        {!excepciones ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, indice) => (
              <Skeleton key={indice} className="h-14 w-full" />
            ))}
          </div>
        ) : excepciones.length === 0 ? (
          <EmptyState
            icono={<CalendarOffIcon className="size-6" />}
            titulo="No hay excepciones cargadas"
            descripcion="Los feriados y cierres puntuales que agregues van a aparecer acá."
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {excepciones.map((excepcion) => (
              <li
                key={excepcion.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-border p-3"
              >
                <div>
                  <p className="font-medium">
                    {format(new Date(`${excepcion.fecha}T00:00:00`), "d 'de' MMMM, yyyy", { locale: es })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {excepcion.cerrado
                      ? 'Cerrado todo el día'
                      : `Horario especial: ${excepcion.hora_apertura?.slice(0, 5)} a ${excepcion.hora_cierre?.slice(0, 5)}`}
                    {excepcion.motivo ? ` · ${excepcion.motivo}` : ''}
                  </p>
                </div>

                {idEnConfirmacion === excepcion.id ? (
                  <div className="flex shrink-0 items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">¿Eliminar?</span>
                    <Button size="sm" variant="destructive" onClick={() => handleEliminar(excepcion.id)}>
                      Sí
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setIdEnConfirmacion(null)}>
                      No
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    className="shrink-0"
                    onClick={() => setIdEnConfirmacion(excepcion.id)}
                  >
                    <Trash2Icon />
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
