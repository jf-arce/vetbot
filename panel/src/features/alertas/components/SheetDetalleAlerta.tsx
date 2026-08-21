import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CheckCircleIcon, MessageCircleIcon, PawPrintIcon, PhoneIcon, SparklesIcon } from 'lucide-react'
import { Link } from 'react-router'

import type { ClasificacionTriaje } from '@/types/db'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { rutaConversacion, rutaMascota } from '@/routes/paths'
import { tiempoRelativo } from '../lib/tiempo'
import type { AlertaConDetalle } from '../types'

/** Misma paleta que `TarjetaAlerta` (y que `ESTILO_POR_CLASIFICACION` de `HistoriaTimeline`). */
const ESTILO_URGENCIA: Record<ClasificacionTriaje, { texto: string; clase: string }> = {
  alta: {
    texto: 'Urgencia alta',
    clase: 'bg-red-300 text-red-950 dark:bg-red-500/30 dark:text-red-200',
  },
  media: {
    texto: 'Urgencia media',
    clase: 'bg-yellow-300 text-yellow-950 dark:bg-yellow-500/30 dark:text-yellow-200',
  },
  baja: {
    texto: 'Urgencia baja',
    clase: 'bg-green-300 text-green-950 dark:bg-green-500/30 dark:text-green-200',
  },
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{titulo}</h3>
      {children}
    </div>
  )
}

export function SheetDetalleAlerta({
  alerta,
  open,
  onOpenChange,
  onMarcarAtendida,
}: {
  alerta: AlertaConDetalle | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onMarcarAtendida: (alerta: AlertaConDetalle) => void
}) {
  const urgencia = alerta?.consulta?.clasificacion ? ESTILO_URGENCIA[alerta.consulta.clasificacion] : null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        {alerta ? (
          <>
            <SheetHeader>
              <SheetTitle>{alerta.mascota?.nombre ?? 'Mascota sin identificar'}</SheetTitle>
              <SheetDescription>
                {alerta.mascota
                  ? `${alerta.mascota.especie} · ${alerta.mascota.raza ?? 'raza no registrada'}`
                  : 'El cliente todavía no confirmó de cuál de sus mascotas se trata.'}
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-col gap-5 overflow-y-auto px-4">
              <div className="flex flex-wrap items-center gap-2">
                {urgencia ? (
                  <Badge variant="secondary" className={urgencia.clase}>
                    {urgencia.texto}
                  </Badge>
                ) : null}
                <span className="text-xs text-muted-foreground">
                  {tiempoRelativo(new Date(alerta.created_at))} ·{' '}
                  {format(new Date(alerta.created_at), "d 'de' MMMM, HH:mm", { locale: es })}
                </span>
              </div>

              <Seccion titulo="Resumen del caso (IA)">
                <p className="text-sm">{alerta.resumen_caso}</p>
              </Seccion>

              <Separator />

              <Seccion titulo="Síntoma reportado por el dueño">
                <p className="rounded-lg bg-muted/60 p-3 text-sm text-foreground/90 italic">
                  "{alerta.consulta?.mensaje_original ?? 'Sin registro del mensaje original.'}"
                </p>
              </Seccion>

              <Seccion titulo="Consejo generado por la IA">
                <p className="flex items-start gap-2 text-sm text-muted-foreground">
                  <SparklesIcon className="mt-0.5 size-3.5 shrink-0" />
                  {alerta.consulta?.consejo_generado ?? 'Sin consejo registrado.'}
                </p>
              </Seccion>

              <Separator />

              <Seccion titulo="Dueño">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{alerta.cliente?.nombre ?? 'Sin datos'}</p>
                      {alerta.cliente?.telefono ? (
                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                          <PhoneIcon className="size-3" />
                          {alerta.cliente.telefono}
                        </p>
                      ) : null}
                    </div>

                    {alerta.cliente?.telefono ? (
                      <Button
                        variant="outline"
                        size="sm"
                        nativeButton={false}
                        render={<a href={`tel:${alerta.cliente.telefono}`} />}
                      >
                        <PhoneIcon />
                        Llamar
                      </Button>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {alerta.cliente ? (
                      <Button
                        variant="outline"
                        size="sm"
                        nativeButton={false}
                        render={<Link to={rutaConversacion(alerta.cliente.id)} />}
                      >
                        <MessageCircleIcon />
                        Ver conversación
                      </Button>
                    ) : null}
                    {alerta.mascota ? (
                      <Button
                        variant="outline"
                        size="sm"
                        nativeButton={false}
                        render={<Link to={rutaMascota(alerta.mascota.id)} />}
                      >
                        <PawPrintIcon />
                        Ver ficha de la mascota
                      </Button>
                    ) : null}
                  </div>
                </div>
              </Seccion>
            </div>

            <SheetFooter>
              {alerta.estado === 'atendido' ? (
                <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                  <CheckCircleIcon className="size-4 text-green-600 dark:text-green-500" />
                  Atendida por {alerta.atendido_por ?? 'el equipo'}
                </div>
              ) : (
                <Button className="w-full" onClick={() => onMarcarAtendida(alerta)}>
                  <CheckCircleIcon />
                  Marcar como Atendido
                </Button>
              )}
            </SheetFooter>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
