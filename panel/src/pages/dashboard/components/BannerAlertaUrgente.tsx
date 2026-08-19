import { useEffect } from 'react'
import { TriangleAlertIcon, XIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { SONIDO_DING_DATA_URI } from '../lib/sonidoDing'
import type { AlertaUrgente } from '../types'

/**
 * Banner flotante para la emergencia en camino. Se monta solo cuando hay una
 * alerta de prioridad alta activa, así que el `useEffect` de acá abajo dispara
 * el sonido una única vez, justo cuando aparece.
 *
 * El tono es deliberadamente suave (ver `lib/sonidoDing.ts`): nada de sirena
 * ni alarma fuerte, para no alterar a otros animales en la sala de espera.
 */
export function BannerAlertaUrgente({
  alerta,
  onVerDetalles,
  onCerrar,
}: {
  alerta: AlertaUrgente
  onVerDetalles: () => void
  onCerrar: () => void
}) {
  useEffect(() => {
    const audio = new Audio(SONIDO_DING_DATA_URI)
    audio.volume = 0.4
    audio.play().catch(() => {
      // Los navegadores bloquean el autoplay sin interacción previa del
      // usuario en la página; no hay nada que mostrarle por esto.
    })
  }, [])

  return (
    <div className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div className="flex w-full max-w-xl items-center gap-3 rounded-xl bg-red-600 px-4 py-3 text-white shadow-2xl shadow-red-500/50 ring-1 ring-red-800/50">
        <TriangleAlertIcon className="size-6 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">¡ALERTA DE PRIORIDAD ALTA!</p>
          <p className="truncate text-sm">
            {alerta.nombreMascota} - {alerta.raza} en camino
          </p>
          <p className="text-xs text-red-100">
            Llegada estimada en {alerta.llegadaEstimada}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
            onClick={onVerDetalles}
          >
            Ver detalles
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-white hover:bg-white/10 hover:text-white"
            onClick={onCerrar}
          >
            <XIcon />
            <span className="sr-only">Cerrar alerta</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
