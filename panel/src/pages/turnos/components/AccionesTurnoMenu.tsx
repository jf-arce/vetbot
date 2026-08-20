import { CalendarClockIcon, CheckIcon, MoreVerticalIcon, XIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

/**
 * Acciones por fila. "Cancelar" NO es un update directo de Supabase: tiene
 * que borrar también el evento de Google Calendar, así que sale por webhook
 * de n8n — ver el TODO de `cancelarTurno()` en `services/turnos.ts`.
 */
export function AccionesTurnoMenu({
  onConfirmar,
  onReagendar,
  onCancelar,
}: {
  onConfirmar: () => void
  onReagendar: () => void
  onCancelar: () => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label="Acciones del turno">
            <MoreVerticalIcon />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onConfirmar}>
          <CheckIcon />
          Confirmar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onReagendar}>
          <CalendarClockIcon />
          Reagendar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={onCancelar}>
          <XIcon />
          Cancelar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
