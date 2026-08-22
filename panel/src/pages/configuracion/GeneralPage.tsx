import { useEffect, useMemo, useState } from 'react'
import { SaveIcon } from 'lucide-react'
import { toast } from 'sonner'

import { ErrorState } from '@/components/common/ErrorState'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { guardarConfiguracion, listarConfiguracion } from '@/services/configuracion'
import type { ClaveConfiguracion } from '@/types/db'

/**
 * ─── CONTRATO DEL MÓDULO ───────────────────────────────────────────────────
 *
 * Tabla: `configuracion_general` — clave-valor. Confirmado vía MCP: hoy
 * tiene `duracion_turno_minutos`=30, `dias_anticipacion`=7,
 * `turnos_a_mostrar`=4 (las 3 que usa el wf 04) + `telefono_veterinario` y
 * `nombre_clinica`, que ahora viven en Configuración → Perfil (no se
 * duplican acá).
 *
 * Las 3 claves conocidas se validan como enteros positivos: si alguien
 * guarda "abc" en `duracion_turno_minutos`, el bot deja de ofrecer turnos.
 * Cualquier otra clave que aparezca en la tabla (que no sea de Perfil) se
 * lista igual como texto libre, para no romper el panel si Dev 1/Dev 2
 * agregan una nueva.
 * ───────────────────────────────────────────────────────────────────────────
 */

const CAMPOS_CONOCIDOS: { clave: ClaveConfiguracion; etiqueta: string; descripcion: string }[] = [
  {
    clave: 'duracion_turno_minutos',
    etiqueta: 'Duración del turno (minutos)',
    descripcion: 'Tamaño de cada bloque al calcular huecos libres.',
  },
  {
    clave: 'dias_anticipacion',
    etiqueta: 'Días de anticipación',
    descripcion: 'Hasta cuántos días a futuro se consulta disponibilidad.',
  },
  {
    clave: 'turnos_a_mostrar',
    etiqueta: 'Turnos a mostrar',
    descripcion: 'Cuántas opciones de horario se ofrecen por mensaje.',
  },
]

const CLAVES_CONOCIDAS = CAMPOS_CONOCIDOS.map((campo) => campo.clave)
// Ya tienen su propia pantalla — no se muestran acá para no duplicar.
const CLAVES_EN_PERFIL: ClaveConfiguracion[] = ['nombre_clinica', 'telefono_veterinario']

function esEnteroPositivo(valor: string): boolean {
  return /^\d+$/.test(valor.trim()) && Number(valor) > 0
}

export function GeneralPage() {
  const [valores, setValores] = useState<Record<string, string> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    listarConfiguracion()
      .then((filas) => {
        const visibles = filas.filter(
          (fila) => !CLAVES_EN_PERFIL.includes(fila.clave as ClaveConfiguracion),
        )
        setValores(Object.fromEntries(visibles.map((fila) => [fila.clave, fila.valor])))
        setError(null)
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'No se pudo cargar.'))
  }, [tick])

  const clavesDesconocidas = useMemo(
    () => Object.keys(valores ?? {}).filter((clave) => !CLAVES_CONOCIDAS.includes(clave as ClaveConfiguracion)),
    [valores],
  )

  const invalidas = CAMPOS_CONOCIDOS.filter(
    (campo) => valores && valores[campo.clave] !== undefined && !esEnteroPositivo(valores[campo.clave]),
  )

  function actualizarValor(clave: string, valor: string) {
    setValores((actuales) => (actuales ? { ...actuales, [clave]: valor } : actuales))
  }

  async function handleGuardar() {
    if (!valores || invalidas.length > 0) return

    setGuardando(true)
    try {
      await Promise.all(
        Object.entries(valores).map(([clave, valor]) =>
          guardarConfiguracion(clave as ClaveConfiguracion, valor.trim()),
        ),
      )
      toast.success('Parámetros actualizados')
    } catch (err) {
      toast.error('No se pudo guardar', { description: err instanceof Error ? err.message : undefined })
    } finally {
      setGuardando(false)
    }
  }

  if (error && !valores) {
    return <ErrorState mensaje={error} onReintentar={() => setTick((valor) => valor + 1)} />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parámetros del bot de turnos</CardTitle>
        <CardDescription>Los usa el flujo que ofrece horarios disponibles (wf 04) para calcular qué mostrar.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {!valores ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, indice) => (
              <Skeleton key={indice} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {CAMPOS_CONOCIDOS.map((campo) => {
                const esInvalida = invalidas.some((f) => f.clave === campo.clave)
                return (
                  <div key={campo.clave} className="space-y-1.5">
                    <Label htmlFor={campo.clave}>{campo.etiqueta}</Label>
                    <Input
                      id={campo.clave}
                      inputMode="numeric"
                      value={valores[campo.clave] ?? ''}
                      onChange={(evento) => actualizarValor(campo.clave, evento.target.value)}
                      aria-invalid={esInvalida}
                    />
                    <p className="text-xs text-muted-foreground">{campo.descripcion}</p>
                    {esInvalida ? <p className="text-xs text-destructive">Tiene que ser un entero positivo.</p> : null}
                  </div>
                )
              })}
            </div>

            {clavesDesconocidas.length > 0 ? (
              <div className="space-y-3 border-t border-border pt-4">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Otras claves en la tabla
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {clavesDesconocidas.map((clave) => (
                    <div key={clave} className="space-y-1.5">
                      <Label htmlFor={clave}>{clave}</Label>
                      <Input
                        id={clave}
                        value={valores[clave] ?? ''}
                        onChange={(evento) => actualizarValor(clave, evento.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </>
        )}
      </CardContent>
      <CardFooter className="justify-end bg-transparent">
        <Button onClick={handleGuardar} disabled={!valores || guardando || invalidas.length > 0}>
          <SaveIcon />
          Guardar cambios
        </Button>
      </CardFooter>
    </Card>
  )
}
