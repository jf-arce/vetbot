import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { RUTAS } from '@/routes/paths'

export function NotFoundPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <p className="text-muted-foreground font-mono text-sm">404</p>
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold">Página no encontrada</h1>
        <p className="text-muted-foreground text-sm">
          La ruta que abriste no existe en el panel.
        </p>
      </div>
      <Button nativeButton={false} render={<Link to={RUTAS.dashboard} />}>
        Ir al dashboard
      </Button>
    </div>
  )
}
