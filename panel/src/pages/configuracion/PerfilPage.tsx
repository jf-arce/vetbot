import { useEffect, useState } from 'react'
import { SaveIcon } from 'lucide-react'
import { toast } from 'sonner'

import { ErrorState } from '@/components/common/ErrorState'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { guardarConfiguracion, listarConfiguracion } from '@/services/configuracion'

/**
 * ─── CONTRATO DEL MÓDULO ───────────────────────────────────────────────────
 *
 * No existe una tabla `clinicas`/`usuarios` en el schema real (confirmado
 * vía MCP) — "nombre de la clínica" y "teléfono principal" se guardan como
 * dos filas más de `configuracion_general` (clave-valor, la misma tabla que
 * usa Configuración → General para los parámetros del wf 04):
 *   · `telefono_veterinario` — YA EXISTE con el placeholder `<a completar>`
 *     (es el pendiente real que Dev 1 anotó en `docs/todo.md`: sin esto el
 *     wf 08 de alerta urgente no tiene a quién avisar).
 *   · `nombre_clinica` — no existe todavía, se crea con el primer guardado
 *     (upsert por clave, `guardarConfiguracion` ya lo soporta).
 *
 * Datos: `services/configuracion.ts` → listarConfiguracion() / guardarConfiguracion(clave, valor)
 * ───────────────────────────────────────────────────────────────────────────
 */
export function PerfilPage() {
  const [cargado, setCargado] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)
  const [nombreClinica, setNombreClinica] = useState('')
  const [telefono, setTelefono] = useState('')
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    listarConfiguracion()
      .then((filas) => {
        setNombreClinica(filas.find((fila) => fila.clave === 'nombre_clinica')?.valor ?? '')
        setTelefono(filas.find((fila) => fila.clave === 'telefono_veterinario')?.valor ?? '')
        setCargado(true)
        setError(null)
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'No se pudo cargar la configuración.')
      })
  }, [tick])

  async function handleGuardar() {
    setGuardando(true)
    try {
      await Promise.all([
        guardarConfiguracion('nombre_clinica', nombreClinica.trim()),
        guardarConfiguracion('telefono_veterinario', telefono.trim()),
      ])
      toast.success('Datos de la clínica actualizados')
    } catch (err) {
      toast.error('No se pudo guardar', {
        description: err instanceof Error ? err.message : undefined,
      })
    } finally {
      setGuardando(false)
    }
  }

  if (error && !cargado) {
    return <ErrorState mensaje={error} onReintentar={() => setTick((valor) => valor + 1)} />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil de la clínica</CardTitle>
        <CardDescription>
          Estos datos los usa el bot para presentarse y para saber a quién avisar en una urgencia.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="nombre-clinica">Nombre de la clínica</Label>
            {cargado ? (
              <Input
                id="nombre-clinica"
                placeholder="Ej: Veterinaria San Martín"
                value={nombreClinica}
                onChange={(evento) => setNombreClinica(evento.target.value)}
              />
            ) : (
              <Skeleton className="h-8 w-full" />
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="telefono-veterinario">Teléfono principal</Label>
            {cargado ? (
              <Input
                id="telefono-veterinario"
                placeholder="Ej: +54 9 11 5555-5555"
                value={telefono}
                onChange={(evento) => setTelefono(evento.target.value)}
              />
            ) : (
              <Skeleton className="h-8 w-full" />
            )}
            <p className="text-xs text-muted-foreground">
              A este número le llega la alerta cuando el bot clasifica un caso como urgente.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-end bg-transparent">
        <Button onClick={handleGuardar} disabled={!cargado || guardando}>
          <SaveIcon />
          Guardar cambios
        </Button>
      </CardFooter>
    </Card>
  )
}
