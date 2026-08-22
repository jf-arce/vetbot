import { Fragment, useEffect, useRef } from 'react'

import { EmptyState } from '@/components/common/EmptyState'
import { Skeleton } from '@/components/ui/skeleton'
import type { Mensaje } from '@/types/db'
import { etiquetaDia } from '../lib/formatoDia'
import { BurbujaMensaje } from './BurbujaMensaje'

export function HiloMensajes({ mensajes, cargando }: { mensajes: Mensaje[]; cargando: boolean }) {
  const finRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    finRef.current?.scrollIntoView({ block: 'end' })
  }, [mensajes.length])

  if (cargando) {
    return (
      <div className="flex flex-col gap-3 p-3">
        <Skeleton className="h-12 w-2/3 self-start rounded-2xl" />
        <Skeleton className="h-8 w-1/2 self-end rounded-2xl" />
        <Skeleton className="h-14 w-3/5 self-start rounded-2xl" />
      </div>
    )
  }

  if (mensajes.length === 0) {
    return (
      <div className="p-4">
        <EmptyState titulo="Sin mensajes con este cliente" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 p-3">
      {mensajes.map((mensaje, indice) => {
        const dia = etiquetaDia(new Date(mensaje.created_at))
        const diaPrevio = indice > 0 ? etiquetaDia(new Date(mensajes[indice - 1].created_at)) : null
        const mostrarSeparador = dia !== diaPrevio

        return (
          <Fragment key={mensaje.id}>
            {mostrarSeparador ? (
              <div className="my-1 flex justify-center">
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-[0.7rem] text-muted-foreground">
                  {dia}
                </span>
              </div>
            ) : null}
            <BurbujaMensaje
              direccion={mensaje.direccion}
              contenido={mensaje.contenido}
              created_at={mensaje.created_at}
            />
          </Fragment>
        )
      })}
      <div ref={finRef} />
    </div>
  )
}
