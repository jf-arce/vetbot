import { useTheme } from 'next-themes'
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const OPCIONES_TEMA = [
  { valor: 'light', etiqueta: 'Claro', icono: SunIcon },
  { valor: 'dark', etiqueta: 'Oscuro', icono: MoonIcon },
  { valor: 'system', etiqueta: 'Sistema', icono: MonitorIcon },
] as const

/**
 * ─── CONTRATO DEL MÓDULO ───────────────────────────────────────────────────
 *
 * El `ThemeProvider` de `next-themes` está montado en `src/main.tsx`
 * (`attribute="class"`, matchea el `.dark` de `index.css`). Este componente
 * solo lee/escribe `theme` vía `useTheme()` — persistencia en localStorage y
 * detección de la preferencia del sistema las maneja la librería, no hay
 * lógica propia que mantener acá.
 * ───────────────────────────────────────────────────────────────────────────
 */
export function AparienciaPage() {
  const { theme, setTheme } = useTheme()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tema</CardTitle>
        <CardDescription>Elegí cómo se ve el panel en este dispositivo.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {OPCIONES_TEMA.map((opcion) => {
            const Icono = opcion.icono
            const activo = theme === opcion.valor
            return (
              <Button
                key={opcion.valor}
                variant={activo ? 'secondary' : 'outline'}
                onClick={() => setTheme(opcion.valor)}
              >
                <Icono />
                {opcion.etiqueta}
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
