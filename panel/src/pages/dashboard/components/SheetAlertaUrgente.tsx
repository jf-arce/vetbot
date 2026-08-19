import { FileTextIcon, PhoneIcon, TriangleAlertIcon } from 'lucide-react'
import { Link } from 'react-router'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { rutaMascota } from '@/routes/paths'
import { inicialesDe } from '../lib/iniciales'
import type { AlertaUrgente } from '../types'

export function SheetAlertaUrgente({
  alerta,
  open,
  onOpenChange,
}: {
  alerta: AlertaUrgente
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400">
              <TriangleAlertIcon className="size-4" />
            </div>
            <SheetTitle>Alerta de prioridad alta</SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex-1 space-y-6 overflow-y-auto px-4">
          <div className="flex items-center gap-4">
            <Avatar size="lg">
              <AvatarFallback>{inicialesDe(alerta.nombreMascota)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">{alerta.nombreMascota}</p>
                <Badge
                  variant="secondary"
                  className="bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400"
                >
                  Alta
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {alerta.raza} · {alerta.edad} · {alerta.peso}
              </p>
            </div>
          </div>

          <Separator />

          <section className="space-y-1.5">
            <h3 className="text-sm font-medium">Motivo de la alerta</h3>
            <p className="text-sm text-muted-foreground">{alerta.motivo}</p>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-sm font-medium">Detalles del triaje (IA)</h3>
            <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">Vómitos: </span>
                {alerta.triaje.vomitos}
              </li>
              <li>
                <span className="font-medium text-foreground">Frecuencia respiratoria: </span>
                {alerta.triaje.frecuencia}
              </li>
              <li>
                <span className="font-medium text-foreground">Apetito: </span>
                {alerta.triaje.apetito}
              </li>
              <li>
                <span className="font-medium text-foreground">Nivel de energía: </span>
                {alerta.triaje.nivelEnergia}
              </li>
              <li>
                <span className="font-medium text-foreground">Última comida: </span>
                {alerta.triaje.ultimaComida}
              </li>
            </ul>
          </section>

          <section className="rounded-lg bg-red-50 p-3 text-sm text-red-900 dark:bg-red-500/10 dark:text-red-300">
            <p className="font-medium">Recomendación de acción</p>
            <p className="mt-1">{alerta.recomendacion}</p>
          </section>
        </div>

        <SheetFooter className="flex-row justify-end gap-2">
          <Button
            variant="outline"
            render={<Link to={rutaMascota(alerta.mascotaId)} />}
            nativeButton={false}
          >
            <FileTextIcon />
            Ver historia clínica
          </Button>
          <Button
            variant="destructive"
            className="bg-red-600 text-white hover:bg-red-700"
            render={<a href={`tel:${alerta.telefonoDueno}`} />}
            nativeButton={false}
          >
            <PhoneIcon />
            Llamar al dueño
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
