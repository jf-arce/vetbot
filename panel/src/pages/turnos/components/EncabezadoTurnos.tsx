import { PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/PageHeader'
import { SelectorVistaTurnos, type VistaTurnos } from './SelectorVistaTurnos'

export function EncabezadoTurnos({
  vista,
  onVistaChange,
  onNuevoTurno,
}: {
  vista: VistaTurnos
  onVistaChange: (vista: VistaTurnos) => void
  onNuevoTurno: () => void
}) {
  return (
    <PageHeader
      titulo="Gestión de Turnos - Panel de Acción de Prioridad"
      descripcion="Agenda del día ordenada por urgencia clínica"
      acciones={
        <>
          <SelectorVistaTurnos vista={vista} onVistaChange={onVistaChange} />
          <Button onClick={onNuevoTurno}>
            <PlusIcon />
            Nuevo Turno
          </Button>
        </>
      }
    />
  )
}
