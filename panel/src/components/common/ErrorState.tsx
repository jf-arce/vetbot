import { OctagonXIcon } from 'lucide-react'

import { Alert, AlertAction, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

/**
 * Error de carga de datos. Todas las funciones de `src/services/` tiran
 * `Error` cuando Supabase devuelve `error`, así que alcanza con catchear y
 * pasar el mensaje acá.
 */
export function ErrorState({
  titulo = 'No se pudieron cargar los datos',
  mensaje,
  onReintentar,
}: {
  titulo?: string
  mensaje?: string
  onReintentar?: () => void
}) {
  return (
    <Alert variant="destructive">
      <OctagonXIcon />
      <AlertTitle>{titulo}</AlertTitle>
      {mensaje ? <AlertDescription>{mensaje}</AlertDescription> : null}
      {onReintentar ? (
        <AlertAction>
          <Button size="sm" variant="outline" onClick={onReintentar}>
            Reintentar
          </Button>
        </AlertAction>
      ) : null}
    </Alert>
  )
}
