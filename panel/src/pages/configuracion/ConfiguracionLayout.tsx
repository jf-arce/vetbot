import { NavLink, Outlet } from 'react-router'

import { PageHeader } from '@/components/layout/PageHeader'
import { cn } from '@/lib/utils'
import { RUTAS } from '@/routes/paths'

/**
 * Ruta layout de /configuracion: encabezado + tabs + `<Outlet />` donde el
 * router monta la sub-página activa. Las tabs son rutas de verdad, así que
 * cada una tiene su URL y se puede compartir o recargar.
 */

const TABS = [
  { titulo: 'Horarios', ruta: RUTAS.configuracionHorarios },
  { titulo: 'Excepciones', ruta: RUTAS.configuracionExcepciones },
  { titulo: 'General', ruta: RUTAS.configuracionGeneral },
]

export function ConfiguracionLayout() {
  return (
    <>
      <PageHeader
        titulo="Configuración"
        descripcion="Horarios de atención, feriados y parámetros que usa el bot para ofrecer turnos"
      />

      <nav className="bg-muted text-muted-foreground inline-flex w-fit items-center gap-1 rounded-lg p-1">
        {TABS.map((tab) => (
          <NavLink
            key={tab.ruta}
            to={tab.ruta}
            className={({ isActive }) =>
              cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-background text-foreground shadow-sm'
                  : 'hover:text-foreground',
              )
            }
          >
            {tab.titulo}
          </NavLink>
        ))}
      </nav>

      <Outlet />
    </>
  )
}
