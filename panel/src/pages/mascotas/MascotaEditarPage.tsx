import { Link, useParams } from 'react-router'
import { ArrowLeftIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { MascotaEditView } from '@/features/mascotas/components/MascotaEditView'
import { rutaMascota } from '@/routes/paths'

/**
 * Wrapper de ruta para `/mascotas/:mascotaId/editar` — sin link en el
 * Sidebar a propósito: solo se llega acá desde "Editar Perfil" en la tabla.
 */
export function MascotaEditarPage() {
  const { mascotaId } = useParams()

  return (
    <div className="flex flex-col gap-2">
      <div className="px-6 pt-4">
        {/* `nativeButton={false}`: Base UI necesita saber que el render
            devuelve un <a> (el Link) y no un <button> nativo. */}
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={<Link to={mascotaId ? rutaMascota(mascotaId) : '/mascotas'} />}
        >
          <ArrowLeftIcon />
          Volver a la ficha
        </Button>
      </div>
      <MascotaEditView />
    </div>
  )
}
