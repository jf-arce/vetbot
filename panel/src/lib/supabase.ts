import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Cliente único de Supabase para todo el panel.
 *
 * El panel habla DIRECTO con la DB (no hay backend propio, ver
 * `docs/vetbot-division-tareas.md`), así que esta key es la `anon` pública y
 * toda la seguridad real vive en las policies de RLS de Postgres.
 * Nunca poner acá la `service_role`.
 *
 * Variables (ver `.env.example`):
 *   VITE_SUPABASE_URL
 *   VITE_SUPABASE_ANON_KEY
 *
 * Cuando Dev 2 cierre el schema, tipar el cliente de punta a punta:
 *   createClient<Database>(url, anonKey)  // Database generado por supabase gen types
 */

let cliente: SupabaseClient | null = null

/**
 * A propósito NO se valida al importar el módulo: sin `.env` el panel tiene que
 * poder navegarse igual. El error salta recién cuando una página pide datos.
 */
export function getSupabase(): SupabaseClient {
  if (cliente) return cliente

  const url = import.meta.env.VITE_SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error(
      'Faltan VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY. Copiá .env.example a .env y completá los valores.',
    )
  }

  cliente = createClient(url, anonKey)
  return cliente
}

/**
 * Supabase no tira excepciones: devuelve `{ data, error }`. Este helper
 * convierte eso en "devolvé los datos o tirá un Error", que es lo que esperan
 * las páginas para poder mostrar `<ErrorState />`.
 */
export function desempaquetar<T>(respuesta: {
  data: unknown
  error: { message: string } | null
}): T {
  if (respuesta.error) throw new Error(respuesta.error.message)
  return respuesta.data as T
}
