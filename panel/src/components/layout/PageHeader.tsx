import type { ReactNode } from 'react'

/**
 * Encabezado estándar de cada página del panel.
 * `acciones` es el slot de la derecha (botones, filtros, selector de fecha).
 */
export function PageHeader({
  titulo,
  descripcion,
  acciones,
}: {
  titulo: string
  descripcion?: string
  acciones?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {titulo}
        </h1>
        {descripcion ? (
          <p className="text-muted-foreground text-sm">{descripcion}</p>
        ) : null}
      </div>
      {acciones ? <div className="flex items-center gap-2">{acciones}</div> : null}
    </div>
  )
}
