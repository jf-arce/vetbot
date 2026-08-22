import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { Cliente, Conversacion } from '@/types/db'
import { BadgeEstadoConversacion } from './BadgeEstadoConversacion'

function iniciales(nombre: string) {
  return nombre.slice(0, 2).toUpperCase()
}

export function EncabezadoHilo({
  cliente,
  conversacion,
}: {
  cliente: Cliente
  conversacion: Conversacion | null
}) {
  return (
    <div className="flex items-center gap-3 border-b border-border p-3">
      <Avatar>
        <AvatarFallback>{iniciales(cliente.nombre)}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{cliente.nombre}</p>
        <p className="truncate text-sm text-muted-foreground">{cliente.telefono}</p>
      </div>

      {conversacion ? (
        <BadgeEstadoConversacion estado={conversacion.estado} />
      ) : (
        <span className="text-xs text-muted-foreground">Sin conversación activa</span>
      )}
    </div>
  )
}
