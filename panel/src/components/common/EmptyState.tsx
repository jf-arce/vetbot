import type { ReactNode } from 'react'
import { InboxIcon } from 'lucide-react'

import { Card } from '@/components/ui/card'

/**
 * Placeholder de "todavía no hay nada acá".
 * Mientras el módulo no esté implementado sirve como marcador visual; después
 * queda para el caso real de lista vacía.
 */
export function EmptyState({
  titulo = 'Sin datos todavía',
  descripcion,
  icono,
  accion,
}: {
  titulo?: string
  descripcion?: string
  icono?: ReactNode
  accion?: ReactNode
}) {
  return (
    <Card className="flex flex-col items-center justify-center gap-3 border-dashed px-6 py-14 text-center shadow-none">
      <div className="text-muted-foreground">
        {icono ?? <InboxIcon className="size-6" />}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">{titulo}</p>
        {descripcion ? (
          <p className="text-muted-foreground max-w-md text-sm">{descripcion}</p>
        ) : null}
      </div>
      {accion}
    </Card>
  )
}
