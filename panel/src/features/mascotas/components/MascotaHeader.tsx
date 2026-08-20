import { PhoneIcon, TriangleAlertIcon } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import type { MascotaDetalle } from '../types'

function iniciales(nombre: string) {
  return nombre.slice(0, 2).toUpperCase()
}

function BadgeEstado({ estado }: { estado: MascotaDetalle['estado'] }) {
  if (estado === 'activo') {
    return (
      <Badge
        variant="secondary"
        className="bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400"
      >
        Activo
      </Badge>
    )
  }

  return (
    <Badge variant="secondary" className="bg-muted text-muted-foreground">
      Fallecido
    </Badge>
  )
}

export function MascotaHeader({ mascota }: { mascota: MascotaDetalle }) {
  const tieneNotas = mascota.notasGenerales.trim().length > 0

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex items-start gap-4">
        <Avatar size="lg">
          <AvatarFallback>{iniciales(mascota.nombre)}</AvatarFallback>
        </Avatar>

        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{mascota.nombre}</h1>
            <BadgeEstado estado={mascota.estado} />
            {mascota.esterilizado ? (
              <Badge variant="outline">Esterilizado</Badge>
            ) : null}
          </div>

          <p className="text-sm text-muted-foreground">
            {mascota.especie} · {mascota.raza} · {mascota.sexo === 'macho' ? 'Macho' : 'Hembra'} ·{' '}
            {mascota.edad} · {mascota.peso}
          </p>

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <PhoneIcon className="size-3.5" />
            <span>
              {mascota.clienteNombre} · {mascota.clienteTelefono}
            </span>
          </div>
        </div>
      </div>

      {tieneNotas ? (
        <Alert
          variant="destructive"
          className="border-red-200 bg-red-50 lg:max-w-sm dark:border-red-500/30 dark:bg-red-500/10"
        >
          <TriangleAlertIcon />
          <AlertTitle>Atención</AlertTitle>
          <AlertDescription>{mascota.notasGenerales}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  )
}
