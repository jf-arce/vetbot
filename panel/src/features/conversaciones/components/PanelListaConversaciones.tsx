import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import type { ConversacionResumen } from '../types'
import { TarjetaConversacion } from './TarjetaConversacion'

export function PanelListaConversaciones({
  conversaciones,
  cargando,
  error,
  clienteIdActivo,
  onReintentar,
}: {
  conversaciones: ConversacionResumen[]
  cargando: boolean
  error: string | null
  clienteIdActivo?: string
  onReintentar: () => void
}) {
  return (
    <div className="flex h-full flex-col border-r border-border">
      <div className="p-3">
        <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Conversaciones</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1 p-2">
          {cargando ? (
            Array.from({ length: 6 }).map((_, indice) => (
              <div key={indice} className="flex items-center gap-3 p-3">
                <Skeleton className="size-8 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-2/3" />
                  <Skeleton className="h-3 w-4/5" />
                </div>
              </div>
            ))
          ) : conversaciones.length > 0 ? (
            // Con la lista real vacía se cae al mock (ver `useConversaciones`)
            // — no tiene sentido mostrar el error si igual hay algo para ver.
            conversaciones.map((conversacion) => (
              <TarjetaConversacion
                key={conversacion.cliente.id}
                conversacion={conversacion}
                seleccionada={conversacion.cliente.id === clienteIdActivo}
              />
            ))
          ) : error ? (
            <div className="p-2">
              <ErrorState mensaje={error} onReintentar={onReintentar} />
            </div>
          ) : (
            <div className="p-2">
              <EmptyState
                titulo="Todavía no hay conversaciones"
                descripcion="Acá van a aparecer los clientes en cuanto el bot les responda por WhatsApp."
              />
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
