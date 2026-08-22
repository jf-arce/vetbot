import { Navigate, Route, Routes } from 'react-router'

import { AppLayout } from '@/layouts/AppLayout'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { TurnosPage } from '@/pages/turnos/TurnosPage'
import { MascotasPage } from '@/pages/mascotas/MascotasPage'
import { MascotaDetallePage } from '@/pages/mascotas/MascotaDetallePage'
import { MascotaEditarPage } from '@/pages/mascotas/MascotaEditarPage'
import { AlertasPage } from '@/pages/alertas/AlertasPage'
import { SeguimientosPage } from '@/pages/seguimientos/SeguimientosPage'
import { ConversacionesPage } from '@/pages/conversaciones/ConversacionesPage'
import { ConversacionDetallePage } from '@/pages/conversaciones/ConversacionDetallePage'
import { ConfiguracionLayout } from '@/pages/configuracion/ConfiguracionLayout'
import { HorariosPage } from '@/pages/configuracion/HorariosPage'
import { ExcepcionesPage } from '@/pages/configuracion/ExcepcionesPage'
import { GeneralPage } from '@/pages/configuracion/GeneralPage'
import { AparienciaPage } from '@/pages/configuracion/AparienciaPage'
import { PerfilPage } from '@/pages/configuracion/PerfilPage'
import { SeguridadPage } from '@/pages/configuracion/SeguridadPage'
import { PreferenciasPage } from '@/pages/configuracion/PreferenciasPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { RUTAS } from '@/routes/paths'

/**
 * Mapa de rutas del panel (React Router v8, modo declarativo).
 * El `<BrowserRouter>` está en `src/main.tsx`.
 *
 * Este archivo NO tiene lógica: es solo el árbol. Cada `<Route>` apunta a una
 * página de `src/pages/`, y la ruta se declara en `src/routes/paths.ts`.
 *
 * Para agregar una sección:
 *   1. constante en `src/routes/paths.ts`
 *   2. página en `src/pages/<modulo>/`
 *   3. `<Route>` acá
 *   4. ítem en `src/components/layout/AppSidebar.tsx`
 *
 * Todo cuelga de `<AppLayout />`, que es una ruta layout sin `path`: aporta el
 * sidebar y renderiza la página activa en su `<Outlet />` sin sumar segmento
 * a la URL.
 */
export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />

        <Route path="turnos" element={<TurnosPage />} />

        <Route path="mascotas">
          <Route index element={<MascotasPage />} />
          <Route path=":mascotaId" element={<MascotaDetallePage />} />
          <Route path=":mascotaId/editar" element={<MascotaEditarPage />} />
        </Route>

        <Route path="alertas" element={<AlertasPage />} />
        <Route path="seguimientos" element={<SeguimientosPage />} />

        <Route path="conversaciones">
          <Route index element={<ConversacionesPage />} />
          <Route path=":clienteId" element={<ConversacionDetallePage />} />
        </Route>

        {/* Ruta layout con tabs propias: /configuracion redirige a la primera. */}
        <Route path="configuracion" element={<ConfiguracionLayout />}>
          <Route
            index
            element={<Navigate to={RUTAS.configuracionHorarios} replace />}
          />
          <Route path="horarios" element={<HorariosPage />} />
          <Route path="excepciones" element={<ExcepcionesPage />} />
          <Route path="general" element={<GeneralPage />} />
          <Route path="apariencia" element={<AparienciaPage />} />
          <Route path="perfil" element={<PerfilPage />} />
          <Route path="seguridad" element={<SeguridadPage />} />
          <Route path="preferencias" element={<PreferenciasPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
