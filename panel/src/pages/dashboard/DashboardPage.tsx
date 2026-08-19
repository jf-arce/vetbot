import { useState, type ReactNode } from 'react'
import { CalendarDaysIcon, ClockIcon, StethoscopeIcon, TriangleAlertIcon } from 'lucide-react'

import { PageHeader } from '@/components/layout/PageHeader'
import { BannerAlertaUrgente } from './components/BannerAlertaUrgente'
import { PanelAlertasActivas } from './components/PanelAlertasActivas'
import { PanelTurnosDelDia } from './components/PanelTurnosDelDia'
import { PanelWhatsappEnVivo } from './components/PanelWhatsappEnVivo'
import { SelectorFecha } from './components/SelectorFecha'
import { SheetAlertaUrgente } from './components/SheetAlertaUrgente'
import { TarjetaMetrica } from './components/TarjetaMetrica'
import {
  ALERTAS_ACTIVAS_MOCK,
  ALERTA_URGENTE_MOCK,
  MENSAJES_WHATSAPP_MOCK,
  METRICAS_MOCK,
  TURNOS_DEL_DIA_MOCK,
} from './data/mockDashboard'

const ICONO_POR_METRICA: Record<string, { icono: ReactNode; colorIcono: string }> = {
  'turnos-hoy': {
    icono: <CalendarDaysIcon className="size-4.5" />,
    colorIcono: 'text-violet-500',
  },
  'consultas-triaje': {
    icono: <StethoscopeIcon className="size-4.5" />,
    colorIcono: 'text-blue-500',
  },
  'alertas-activas': {
    icono: <TriangleAlertIcon className="size-4.5" />,
    colorIcono: 'text-red-500',
  },
  'seguimientos-48hs': {
    icono: <ClockIcon className="size-4.5" />,
    colorIcono: 'text-green-500',
  },
}

/**
 * Vista maquetada con datos mockeados (ver `data/mockDashboard.ts`). Cuando
 * el módulo se conecte a Supabase, `isUrgentEmergency` pasa a derivarse de
 * `alertas` (la tabla que llena el wf 08 de Dev 1) en vez de este flag fijo.
 */
export function DashboardPage() {
  const [isUrgentEmergency] = useState(true)
  const [bannerVisible, setBannerVisible] = useState(true)
  const [sheetAbierto, setSheetAbierto] = useState(false)

  const mostrarBanner = isUrgentEmergency && bannerVisible

  return (
    <>
      <PageHeader
        titulo="Dashboard"
        descripcion="Turnos del día, alertas activas y últimas conversaciones"
        acciones={<SelectorFecha />}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {METRICAS_MOCK.map((metrica) => (
          <TarjetaMetrica
            key={metrica.id}
            titulo={metrica.titulo}
            valor={metrica.valor}
            variacion={metrica.variacion}
            tonoVariacion={metrica.tonoVariacion}
            icono={ICONO_POR_METRICA[metrica.id].icono}
            colorIcono={ICONO_POR_METRICA[metrica.id].colorIcono}
          />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <PanelTurnosDelDia turnos={TURNOS_DEL_DIA_MOCK} />
        <PanelAlertasActivas alertas={ALERTAS_ACTIVAS_MOCK} />
        <PanelWhatsappEnVivo mensajes={MENSAJES_WHATSAPP_MOCK} />
      </div>

      {mostrarBanner ? (
        <BannerAlertaUrgente
          alerta={ALERTA_URGENTE_MOCK}
          onVerDetalles={() => setSheetAbierto(true)}
          onCerrar={() => setBannerVisible(false)}
        />
      ) : null}

      <SheetAlertaUrgente
        alerta={ALERTA_URGENTE_MOCK}
        open={sheetAbierto}
        onOpenChange={setSheetAbierto}
      />
    </>
  )
}
