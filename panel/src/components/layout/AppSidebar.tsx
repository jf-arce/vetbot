import { NavLink, useMatch } from 'react-router'
import {
  AlarmClockIcon,
  CalendarDaysIcon,
  LayoutDashboardIcon,
  MessagesSquareIcon,
  PawPrintIcon,
  SettingsIcon,
  TriangleAlertIcon,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { RUTAS } from '@/routes/paths'

/**
 * Navegación principal. Para agregar una sección nueva: sumá la ruta en
 * `src/routes/paths.ts`, la página en `src/App.tsx` y el ítem en una de las
 * listas de acá abajo.
 *
 * Ojo: los componentes de shadcn de este proyecto son la variante **Base UI**,
 * que usa `render={<Elemento />}` en vez del `asChild` de Radix.
 */

type ItemNav = {
  titulo: string
  ruta: string
  icono: typeof LayoutDashboardIcon
  /** `true` = solo activo en la ruta exacta (para que "/" no gane siempre). */
  exacta?: boolean
}

const OPERACION: ItemNav[] = [
  { titulo: 'Dashboard', ruta: RUTAS.dashboard, icono: LayoutDashboardIcon, exacta: true },
  { titulo: 'Turnos', ruta: RUTAS.turnos, icono: CalendarDaysIcon },
  { titulo: 'Mascotas', ruta: RUTAS.mascotas, icono: PawPrintIcon },
]

const SEGUIMIENTO: ItemNav[] = [
  { titulo: 'Alertas', ruta: RUTAS.alertas, icono: TriangleAlertIcon },
  { titulo: 'Seguimientos', ruta: RUTAS.seguimientos, icono: AlarmClockIcon },
  { titulo: 'Conversaciones', ruta: RUTAS.conversaciones, icono: MessagesSquareIcon },
]

const AJUSTES: ItemNav[] = [
  { titulo: 'Configuración', ruta: RUTAS.configuracion, icono: SettingsIcon },
]

function ItemMenu({ item }: { item: ItemNav }) {
  // `end: false` deja el ítem padre activo también en sus rutas hijas
  // (ej: "Mascotas" sigue marcado dentro de /mascotas/:mascotaId).
  const match = useMatch({ path: item.ruta, end: item.exacta ?? false })

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={match !== null}
        tooltip={item.titulo}
        render={<NavLink to={item.ruta} />}
      >
        <item.icono />
        <span>{item.titulo}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function GrupoNav({ label, items }: { label: string; items: ItemNav[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <ItemMenu key={item.ruta} item={item} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-1 py-1.5">
          <div className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-md">
            <PawPrintIcon className="size-4" />
          </div>
          <div className="grid text-sm leading-tight group-data-[collapsible=icon]:hidden">
            <span className="font-semibold">VetBot</span>
            <span className="text-muted-foreground text-xs">Panel de la clínica</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <GrupoNav label="Operación" items={OPERACION} />
        <GrupoNav label="Seguimiento" items={SEGUIMIENTO} />
        <GrupoNav label="Ajustes" items={AJUSTES} />
      </SidebarContent>
    </Sidebar>
  )
}
