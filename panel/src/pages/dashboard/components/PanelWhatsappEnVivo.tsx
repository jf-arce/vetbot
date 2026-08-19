import { MessageCircleIcon } from 'lucide-react'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { MensajeWhatsapp } from '../types'

function FilaMensaje({ mensaje }: { mensaje: MensajeWhatsapp }) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-400">
        <MessageCircleIcon className="size-4" />
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <p className="truncate text-sm font-medium">{mensaje.telefono}</p>
        <HoverCard>
          <HoverCardTrigger
            delay={0}
            closeDelay={0}
            render={<p className="cursor-default truncate text-xs text-muted-foreground" />}
          >
            {mensaje.fragmento}
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="flex items-center gap-2 border-b pb-2">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-400">
                <MessageCircleIcon className="size-3.5" />
              </div>
              <p className="flex-1 text-sm font-medium">{mensaje.telefono}</p>
              <span className="text-xs text-muted-foreground">
                {mensaje.tiempoTranscurrido}
              </span>
            </div>
            <div className="mt-2.5 rounded-lg bg-green-50 px-3 py-2 text-sm text-foreground dark:bg-green-500/10">
              {mensaje.mensajeCompleto}
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
      <span className="shrink-0 text-xs text-muted-foreground">
        {mensaje.tiempoTranscurrido}
      </span>
    </div>
  )
}

export function PanelWhatsappEnVivo({ mensajes }: { mensajes: MensajeWhatsapp[] }) {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>WhatsApp en vivo</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 pr-3">
          <div className="divide-y">
            {mensajes.map((mensaje) => (
              <FilaMensaje key={mensaje.id} mensaje={mensaje} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="justify-center gap-2 text-xs text-muted-foreground">
        <span className="size-2 rounded-full bg-green-500" />
        Conectado
      </CardFooter>
    </Card>
  )
}
