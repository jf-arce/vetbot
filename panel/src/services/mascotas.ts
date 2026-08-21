import { desempaquetar, getSupabase } from '@/lib/supabase'
import type { MascotaConDueno } from '@/types/db'

const SELECT_CON_DUENO = `
  *,
  cliente:clientes(id, nombre, telefono)
`

/** Listado de mascotas. `busqueda` filtra por nombre de la mascota. */
export async function listarMascotas(busqueda?: string): Promise<MascotaConDueno[]> {
  let query = getSupabase()
    .from('mascotas')
    .select(SELECT_CON_DUENO)
    .order('nombre', { ascending: true })

  if (busqueda?.trim()) {
    query = query.ilike('nombre', `%${busqueda.trim()}%`)
  }

  // TODO(dev): para buscar también por dueño o teléfono conviene una vista o
  // una función SQL — PostgREST no filtra bien sobre tablas relacionadas.
  return desempaquetar(await query)
}

export async function obtenerMascota(mascotaId: string): Promise<MascotaConDueno> {
  return desempaquetar(
    await getSupabase()
      .from('mascotas')
      .select(SELECT_CON_DUENO)
      .eq('id', mascotaId)
      .single(),
  )
}

export async function listarMascotasDeCliente(
  clienteId: string,
): Promise<MascotaConDueno[]> {
  return desempaquetar(
    await getSupabase()
      .from('mascotas')
      .select(SELECT_CON_DUENO)
      .eq('cliente_id', clienteId)
      .order('nombre', { ascending: true }),
  )
}
