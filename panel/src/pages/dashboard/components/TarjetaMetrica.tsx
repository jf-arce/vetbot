import type { ReactNode } from 'react'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const TONO_CLASES = {
  positivo: 'text-green-600 dark:text-green-500',
  negativo: 'text-red-600 dark:text-red-500',
  neutro: 'text-muted-foreground',
} as const

export function TarjetaMetrica({
  titulo,
  valor,
  variacion,
  tonoVariacion,
  icono,
  colorIcono,
}: {
  titulo: string
  valor: number
  variacion: string
  tonoVariacion: 'positivo' | 'negativo' | 'neutro'
  icono: ReactNode
  colorIcono: string
}) {
  return (
    <Card className="ring-border/60 shadow-none">
      <CardContent className="flex items-start justify-between gap-3">
        <div className="space-y-1.5">
          <p className="text-sm text-muted-foreground">{titulo}</p>
          <p className="text-3xl font-semibold tracking-tight">{valor}</p>
          <p className={cn('text-xs font-medium', TONO_CLASES[tonoVariacion])}>
            {variacion}
          </p>
        </div>
        <div className={cn('flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted/60', colorIcono)}>
          {icono}
        </div>
      </CardContent>
    </Card>
  )
}
