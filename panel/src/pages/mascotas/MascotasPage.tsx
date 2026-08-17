import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'

/**
 * ─── CONTRATO DEL MÓDULO ───────────────────────────────────────────────────
 *
 * Qué es: el padrón de pacientes. Las mascotas las da de alta el sub-flujo de
 * registro del wf 01 cuando escribe un número desconocido por WhatsApp.
 *
 * Datos: `services/mascotas.ts` → listarMascotas(busqueda?)
 *
 * Columnas: nombre · especie · raza · edad (calcular desde `fecha_nacimiento`
 *           con date-fns) · dueño · teléfono · estado
 *
 * Filtros: buscador por nombre (debounce), filtro por especie, y por defecto
 *          ocultar las mascotas con `estado = 'fallecido'`.
 *
 * Navegación: cada fila linkea a `rutaMascota(mascota.id)` (src/routes/paths).
 *
 * Nota: buscar por nombre del DUEÑO no sale con PostgREST filtrando sobre la
 * relación — si hace falta, pedir una vista a Dev 2. Está anotado en el service.
 * ───────────────────────────────────────────────────────────────────────────
 */
export function MascotasPage() {
  return (
    <>
      <PageHeader
        titulo="Mascotas"
        descripcion="Pacientes registrados y sus dueños"
      />
      <EmptyState
        titulo="Mascotas sin implementar"
        descripcion="Ver el contrato del módulo en el comentario de src/pages/mascotas/MascotasPage.tsx"
      />
    </>
  )
}
