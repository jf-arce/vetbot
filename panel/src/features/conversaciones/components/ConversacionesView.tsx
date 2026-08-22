import { MessagesSquareIcon } from 'lucide-react'

import { EmptyState } from '@/components/common/EmptyState'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { useIsMobile } from '@/hooks/use-mobile'
import { useConversaciones } from '../hooks/useConversaciones'
import { PanelHiloConversacion } from './PanelHiloConversacion'
import { PanelListaConversaciones } from './PanelListaConversaciones'

const ALTO_VISTA = 'h-[calc(100vh-220px)]'

export function ConversacionesView({ clienteId }: { clienteId?: string }) {
  const esMobile = useIsMobile()
  const {
    conversaciones,
    cargandoLista,
    errorLista,
    recargarLista,
    cliente,
    mensajes,
    conversacion,
    mascotas,
    cargandoDetalle,
    errorDetalle,
    recargarDetalle,
  } = useConversaciones(clienteId)

  const listaProps = {
    conversaciones,
    cargando: cargandoLista,
    error: errorLista,
    clienteIdActivo: clienteId,
    onReintentar: recargarLista,
  }

  const hiloProps = {
    cliente,
    mensajes,
    conversacion,
    mascotas,
    cargando: cargandoDetalle,
    error: errorDetalle,
    onReintentar: recargarDetalle,
  }

  if (esMobile) {
    return (
      <div className={`${ALTO_VISTA} overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10`}>
        {clienteId ? (
          <PanelHiloConversacion {...hiloProps} />
        ) : (
          <PanelListaConversaciones {...listaProps} />
        )}
      </div>
    )
  }

  return (
    <div className={`${ALTO_VISTA} overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10`}>
      <ResizablePanelGroup orientation="horizontal">
        {/* `react-resizable-panels` v4: los números son píxeles, no porcentaje — hay que pasar string para porcentaje. */}
        <ResizablePanel defaultSize="30" minSize="20" maxSize="45">
          <PanelListaConversaciones {...listaProps} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize="70">
          {clienteId ? (
            <PanelHiloConversacion {...hiloProps} />
          ) : (
            <div className="flex h-full items-center justify-center p-4">
              <EmptyState
                icono={<MessagesSquareIcon className="size-6" />}
                titulo="Elegí una conversación"
                descripcion="Seleccioná un cliente de la lista para ver el hilo completo con el bot."
              />
            </div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
