import { getSupabase } from '@/lib/supabase'

/**
 * Actualiza la contraseña de la sesión ACTIVA de Supabase Auth. El panel
 * hoy no tiene login (no hay `AuthProvider` ni pantalla de ingreso en
 * `App.tsx`), así que sin sesión esto tira "Auth session missing" — queda
 * conectado al SDK real para que funcione apenas exista un flujo de
 * autenticación, en vez de tener que reescribirlo después.
 */
export async function actualizarContrasena(password: string): Promise<void> {
  const { error } = await getSupabase().auth.updateUser({ password })
  if (error) throw error
}
