import { Link } from 'react-router'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { rutaConversacion } from '@/routes/paths'
import { tiempoRelativo } from '../lib/tiempo'
import type { ConversacionResumen } from '../types'

function iniciales(nombre: string) {
  return nombre.slice(0, 2).toUpperCase()
}

export function TarjetaConversacion({
  conversacion,
  seleccionada,
}: {
  conversacion: ConversacionResumen
  seleccionada: boolean
}) {
  const { cliente, ultimoMensaje } = conversacion
  const prefijo = ultimoMensaje.direccion === 'saliente' ? 'Bot: ' : ''
  // El dueño escribió último y todavía no hay respuesta del bot en la lista
  // — señal visual liviana, no un campo nuevo (no hay "leído/no leído" real).
  const esperandoBot = ultimoMensaje.direccion === 'entrante'

  return (
    <Link
      to={rutaConversacion(cliente.id)}
      className={cn(
        'flex items-center gap-3 rounded-xl border border-transparent p-3 transition-colors hover:bg-accent/50',
        seleccionada && 'border-border bg-accent/70 hover:bg-accent/70',
      )}
    >
      <Avatar>
        <AvatarFallback>{iniciales(cliente.nombre)}</AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate font-medium">{cliente.nombre}</span>
        <p className={cn('line-clamp-1 text-sm', esperandoBot ? 'text-foreground/80' : 'text-muted-foreground')}>
          {prefijo}
          {ultimoMensaje.contenido}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <span className="text-xs whitespace-nowrap text-muted-foreground">
          {tiempoRelativo(new Date(ultimoMensaje.created_at))}
        </span>
        {esperandoBot ? (
          <span className="size-1.5 rounded-full bg-primary" aria-label="Esperando respuesta del bot" />
        ) : null}
      </div>
    </Link>
  )
}
