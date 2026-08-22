import { BotIcon } from 'lucide-react'

/**
 * Antes había una caja de texto tipo chat que se podía escribir pero no
 * mandaba nada — confuso/antiintuitivo. El panel es de auditoría, no un
 * canal de contacto (ver contrato en `pages/conversaciones/`): esta franja
 * lo deja explícito en vez de simular un input que no hace nada.
 */
export function PieHiloSoloLectura() {
  return (
    <div className="flex items-center gap-2 border-t border-border bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground">
      <BotIcon className="size-3.5 shrink-0" />
      El bot responde automáticamente por WhatsApp — este panel es de solo lectura.
    </div>
  )
}
