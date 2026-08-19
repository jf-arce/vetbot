import { useState, type CSSProperties } from 'react'
import { Outlet } from 'react-router'

import { AppSidebar } from '@/components/layout/AppSidebar'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

/** 16rem a 16px base — mismo valor que trae por defecto `SidebarProvider`. */
const ANCHO_SIDEBAR_INICIAL_PX = 256

/**
 * Chrome de la app: sidebar arrastrable + área de contenido donde el router
 * monta la página activa (`<Outlet />`). Todo lo que deba estar en TODAS las
 * pantallas (toaster, providers, barra superior) va acá y en ningún otro lado.
 *
 * El `Sidebar` de shadcn se posiciona internamente con `position: fixed` y
 * toma su ancho de la variable CSS `--sidebar-width` — no del tamaño de su
 * contenedor flex. Por eso el `ResizablePanel` que lo envuelve no dimensiona
 * el sidebar directamente: solo reporta el ancho en píxeles vía `onResize`,
 * que es lo que efectivamente mueve el borde real.
 */
export function AppLayout() {
  const [anchoSidebarPx, setAnchoSidebarPx] = useState(ANCHO_SIDEBAR_INICIAL_PX)

  return (
    <TooltipProvider>
      <SidebarProvider
        style={{ '--sidebar-width': `${anchoSidebarPx}px` } as CSSProperties}
      >
        <ResizablePanelGroup orientation="horizontal" className="min-h-svh w-full">
          <ResizablePanel
            defaultSize="20%"
            minSize="15%"
            maxSize="30%"
            onResize={(panelSize) => setAnchoSidebarPx(Math.round(panelSize.inPixels))}
          >
            <AppSidebar />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize="80%">
            <SidebarInset>
              <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-1 h-4" />
                {/* TODO(dev): acá va lo global de la barra superior si hace falta
                    (buscador de clientes por teléfono, selector de veterinario,
                    toggle de tema con `next-themes`, que ya está instalado). */}
              </header>

              <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <Outlet />
              </main>
            </SidebarInset>
          </ResizablePanel>
        </ResizablePanelGroup>

        <Toaster />
      </SidebarProvider>
    </TooltipProvider>
  )
}
