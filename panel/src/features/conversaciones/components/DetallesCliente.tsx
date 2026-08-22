import { useState } from 'react'
import { Link } from 'react-router'
import { ChevronDownIcon, PawPrintIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { rutaMascota } from '@/routes/paths'
import { cn } from '@/lib/utils'
import type { MascotaConDueno } from '@/types/db'

/**
 * Franja colapsada por defecto con las mascotas del cliente y el `contexto`
 * (JSON) de la conversación. No hay `Collapsible`/`Accordion` en
 * `components/ui/` — se resuelve con un toggle simple en vez de agregar un
 * primitivo nuevo.
 */
export function DetallesCliente({
  mascotas,
  contexto,
}: {
  mascotas: MascotaConDueno[]
  contexto: Record<string, unknown> | null
}) {
  const [abierto, setAbierto] = useState(false)

  if (mascotas.length === 0 && !contexto) return null

  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => setAbierto((valor) => !valor)}
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        Detalles del cliente
        <ChevronDownIcon className={cn('size-3.5 transition-transform', abierto && 'rotate-180')} />
      </button>

      {abierto ? (
        <div className="flex flex-col gap-3 px-3 pb-3">
          {mascotas.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {mascotas.map((mascota) => (
                <Link key={mascota.id} to={rutaMascota(mascota.id)}>
                  <Badge variant="outline" className="gap-1">
                    <PawPrintIcon className="size-3" />
                    {mascota.nombre}
                  </Badge>
                </Link>
              ))}
            </div>
          ) : null}

          {contexto ? (
            <pre className="overflow-x-auto rounded-lg bg-muted/60 p-2.5 text-[0.7rem] text-muted-foreground">
              {JSON.stringify(contexto, null, 2)}
            </pre>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
