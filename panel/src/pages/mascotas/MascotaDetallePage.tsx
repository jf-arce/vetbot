import { Link, useParams } from 'react-router'
import { ArrowLeftIcon } from 'lucide-react'

import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/button'
import { RUTAS } from '@/routes/paths'

/**
 * ─── CONTRATO DEL MÓDULO ───────────────────────────────────────────────────
 *
 * Qué es: la ficha completa del paciente. Es la pantalla más "clínica" del
 * panel y la que más consulta el veterinario.
 *
 * Param de ruta: `:mascotaId` (llega como string — castear con Number()).
 *
 * Datos:
 *   · services/mascotas.ts        → obtenerMascota(id)
 *   · services/historiaClinica.ts → listarHistoriaClinica(id)
 *   · services/historiaClinica.ts → listarEvolucionPeso(id)
 *   · services/turnos.ts          → listarTurnosDeMascota(id)
 *   · services/recordatorios.ts   → listarRecordatoriosDeMascota(id)
 *
 * Qué mostrar:
 *   1. Card de datos: especie, raza, sexo, peso, esterilizado, edad, estado,
 *      y `notas_generales` bien visible (ahí van alergias y crónicas — es el
 *      mismo contexto que usa Claude para el triaje).
 *   2. Dueño: nombre + teléfono, con link a /conversaciones/:clienteId.
 *   3. Timeline de historia clínica ordenada por fecha desc, con `tipo` como
 *      Badge (consulta/vacuna/cirugia/tratamiento/control), diagnóstico,
 *      tratamiento, veterinario y adjuntos si hay.
 *   4. Turnos de la mascota (pasados y futuros).
 *   5. Recordatorios con su `fecha_vencimiento` y si ya se enviaron.
 *
 * Si el id no existe, `obtenerMascota` tira error por el `.single()` →
 * mostrar <ErrorState /> (o un 404 propio), no romper la pantalla.
 *
 * Solo lectura: las entradas de historia clínica las escribe el equipo
 * clínico / Dev 2 post-turno, no este panel.
 * ───────────────────────────────────────────────────────────────────────────
 */
export function MascotaDetallePage() {
  const { mascotaId } = useParams()

  return (
    <>
      <PageHeader
        titulo="Ficha de la mascota"
        descripcion={`Historia clínica, turnos y recordatorios · mascota #${mascotaId}`}
        acciones={
          // `nativeButton={false}`: Base UI necesita saber que el render
          // devuelve un <a> (el Link) y no un <button> nativo.
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link to={RUTAS.mascotas} />}
          >
            <ArrowLeftIcon />
            Volver
          </Button>
        }
      />
      <EmptyState
        titulo="Ficha sin implementar"
        descripcion="Ver el contrato del módulo en el comentario de src/pages/mascotas/MascotaDetallePage.tsx"
      />
    </>
  )
}
