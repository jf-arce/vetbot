import { useState } from 'react'
import { KeyRoundIcon } from 'lucide-react'
import { toast } from 'sonner'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { actualizarContrasena } from '@/services/auth'

const LARGO_MINIMO = 8

/**
 * ─── CONTRATO DEL MÓDULO ───────────────────────────────────────────────────
 *
 * `services/auth.ts` → actualizarContrasena(password), que llama a
 * `supabase.auth.updateUser({ password })` — el método real del SDK, no un
 * mock. Pero el panel hoy no tiene login (no hay `AuthProvider` ni pantalla
 * de ingreso en `App.tsx`, confirmado: cero uso de `supabase.auth` en todo
 * `src/` antes de este archivo), así que sin sesión activa esto falla con
 * "Auth session missing" — se avisa explícito en la UI en vez de simular que
 * funciona. Queda conectado al SDK real para que ande apenas exista login,
 * sin tener que reescribirlo.
 * ───────────────────────────────────────────────────────────────────────────
 */
export function SeguridadPage() {
  const [nueva, setNueva] = useState('')
  const [confirmacion, setConfirmacion] = useState('')
  const [enviando, setEnviando] = useState(false)

  const esValida = nueva.length >= LARGO_MINIMO
  const coinciden = confirmacion.length > 0 && nueva === confirmacion

  async function handleSubmit() {
    if (!esValida || !coinciden) return

    setEnviando(true)
    try {
      await actualizarContrasena(nueva)
      toast.success('Contraseña actualizada')
      setNueva('')
      setConfirmacion('')
    } catch (error) {
      toast.error('No se pudo cambiar la contraseña', {
        description: error instanceof Error ? error.message : undefined,
      })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cambiar contraseña</CardTitle>
        <CardDescription>Se aplica a la sesión con la que estés usando el panel.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Alert>
          <KeyRoundIcon />
          <AlertTitle>Todavía no hay login en el panel</AlertTitle>
          <AlertDescription>
            Sin una sesión activa de Supabase Auth este formulario va a fallar — llama al SDK real
            (`auth.updateUser`), no está simulado. Queda listo para cuando se agregue el flujo de ingreso.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="password-nueva">Contraseña nueva</Label>
            <Input
              id="password-nueva"
              type="password"
              autoComplete="new-password"
              value={nueva}
              onChange={(evento) => setNueva(evento.target.value)}
            />
            {nueva.length > 0 && !esValida ? (
              <p className="text-xs text-destructive">Mínimo {LARGO_MINIMO} caracteres.</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password-confirmacion">Confirmar contraseña</Label>
            <Input
              id="password-confirmacion"
              type="password"
              autoComplete="new-password"
              value={confirmacion}
              onChange={(evento) => setConfirmacion(evento.target.value)}
            />
            {confirmacion.length > 0 && !coinciden ? (
              <p className="text-xs text-destructive">Las contraseñas no coinciden.</p>
            ) : null}
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-end bg-transparent">
        <Button onClick={handleSubmit} disabled={!esValida || !coinciden || enviando}>
          <KeyRoundIcon />
          Actualizar contraseña
        </Button>
      </CardFooter>
    </Card>
  )
}
