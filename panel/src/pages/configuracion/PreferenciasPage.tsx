import { useState } from 'react'
import { BellRingIcon, type LucideIcon, ShieldAlertIcon } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

interface PreferenciaBot {
  clave: string
  titulo: string
  descripcion: string
  icono: LucideIcon
  valorInicial: boolean
}

const PREFERENCIAS_MOCK: PreferenciaBot[] = [
  {
    clave: 'notificaciones_triaje_alto',
    titulo: 'Notificaciones sonoras de triaje alto',
    descripcion: 'Reproduce un sonido en el panel cuando entra una alerta de urgencia alta.',
    icono: BellRingIcon,
    valorInicial: true,
  },
  {
    clave: 'horario_guardia_activo',
    titulo: 'Horario de guardia activo',
    descripcion: 'El bot avisa que hay guardia disponible fuera del horario de atención habitual.',
    icono: ShieldAlertIcon,
    valorInicial: false,
  },
]

/**
 * ─── CONTRATO DEL MÓDULO ───────────────────────────────────────────────────
 *
 * Mock — no existe una tabla en Supabase para preferencias de UI/bot todavía
 * (no confundir con `configuracion_general`, que es de parámetros del wf 04,
 * no de esto). El estado vive solo en este componente: al recargar la
 * página vuelve a los valores por defecto. Cuando exista la tabla real,
 * cambiar `useState` por `services/preferencias.ts` siguiendo el mismo
 * patrón que `services/configuracion.ts`.
 * ───────────────────────────────────────────────────────────────────────────
 */
export function PreferenciasPage() {
  const [valores, setValores] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(PREFERENCIAS_MOCK.map((preferencia) => [preferencia.clave, preferencia.valorInicial])),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferencias del bot</CardTitle>
        <CardDescription>
          Vista previa — todavía no hay tabla en Supabase para esto, los cambios no persisten.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {PREFERENCIAS_MOCK.map((preferencia) => {
          const Icono = preferencia.icono
          return (
            <div
              key={preferencia.clave}
              className="flex items-start justify-between gap-4 rounded-lg border border-border p-3"
            >
              <div className="flex gap-2.5">
                <Icono className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div className="space-y-0.5">
                  <Label htmlFor={preferencia.clave}>{preferencia.titulo}</Label>
                  <p className="text-sm text-muted-foreground">{preferencia.descripcion}</p>
                </div>
              </div>
              <Switch
                id={preferencia.clave}
                checked={valores[preferencia.clave]}
                onCheckedChange={(marcado) =>
                  setValores((actuales) => ({ ...actuales, [preferencia.clave]: marcado }))
                }
              />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
