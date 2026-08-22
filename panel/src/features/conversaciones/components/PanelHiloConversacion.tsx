import { ErrorState } from '@/components/common/ErrorState'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import type { Cliente, Conversacion, MascotaConDueno, Mensaje } from '@/types/db'
import { DetallesCliente } from './DetallesCliente'
import { EncabezadoHilo } from './EncabezadoHilo'
import { HiloMensajes } from './HiloMensajes'
import { PieHiloSoloLectura } from './PieHiloSoloLectura'

export function PanelHiloConversacion({
  cliente,
  mensajes,
  conversacion,
  mascotas,
  cargando,
  error,
  onReintentar,
}: {
  cliente: Cliente | null
  mensajes: Mensaje[]
  conversacion: Conversacion | null
  mascotas: MascotaConDueno[]
  cargando: boolean
  error: string | null
  onReintentar: () => void
}) {
  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <ErrorState mensaje={error} onReintentar={onReintentar} />
      </div>
    )
  }

  if (cargando || !cliente) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 border-b border-border p-3">
          <Skeleton className="size-8 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
        </div>
        <div className="flex-1 p-3">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <EncabezadoHilo cliente={cliente} conversacion={conversacion} />
      <DetallesCliente mascotas={mascotas} contexto={conversacion?.contexto ?? null} />
      <ScrollArea className="flex-1">
        <HiloMensajes mensajes={mensajes} cargando={false} />
      </ScrollArea>
      <PieHiloSoloLectura />
    </div>
  )
}
