import { Outlet } from 'react-router'

import { AppSidebar } from '@/components/layout/AppSidebar'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

/**
 * Chrome de la app: sidebar fijo + área de contenido donde el router monta la
 * página activa (`<Outlet />`). Todo lo que deba estar en TODAS las pantallas
 * (toaster, providers, barra superior) va acá y en ningún otro lado.
 */
export function AppLayout() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />

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

        <Toaster />
      </SidebarProvider>
    </TooltipProvider>
  )
}
