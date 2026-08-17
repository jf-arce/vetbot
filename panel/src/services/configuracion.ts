import { desempaquetar, getSupabase } from '@/lib/supabase'
import type {
  ClaveConfiguracion,
  ConfiguracionGeneral,
  ExcepcionHorario,
  HorarioAtencion,
} from '@/types/db'

/**
 * Tablas de configuración de la clínica. No tienen FKs hacia el resto del
 * modelo: son datos globales que lee el wf 04 antes de calcular disponibilidad.
 * Editarlas desde el panel cambia el comportamiento del bot en caliente.
 */

// --- horarios_atencion ------------------------------------------------------

export async function listarHorarios(): Promise<HorarioAtencion[]> {
  return desempaquetar(await getSupabase().from('horarios_atencion').select('*'))
  // TODO(dev): ordenar por día de la semana. Como `dia_semana` es un enum de
  // texto, el orden alfabético no sirve — ordenar en el frontend con un array
  // ['lunes', ..., 'domingo'], o pedirle a Dev 2 una columna `orden`.
}

export async function actualizarHorario(
  id: number,
  cambios: Partial<Omit<HorarioAtencion, 'id'>>,
): Promise<void> {
  desempaquetar(
    await getSupabase().from('horarios_atencion').update(cambios).eq('id', id),
  )
}

// --- excepciones_horario ----------------------------------------------------

/** Feriados y cierres puntuales, de la fecha más próxima en adelante. */
export async function listarExcepciones(
  desde = new Date(),
): Promise<ExcepcionHorario[]> {
  return desempaquetar(
    await getSupabase()
      .from('excepciones_horario')
      .select('*')
      .gte('fecha', desde.toISOString().slice(0, 10))
      .order('fecha', { ascending: true }),
  )
}

export async function crearExcepcion(
  excepcion: Omit<ExcepcionHorario, 'id'>,
): Promise<void> {
  desempaquetar(await getSupabase().from('excepciones_horario').insert(excepcion))
}

export async function eliminarExcepcion(id: number): Promise<void> {
  desempaquetar(await getSupabase().from('excepciones_horario').delete().eq('id', id))
}

// --- configuracion_general (clave-valor) ------------------------------------

export async function listarConfiguracion(): Promise<ConfiguracionGeneral[]> {
  return desempaquetar(
    await getSupabase()
      .from('configuracion_general')
      .select('*')
      .order('clave', { ascending: true }),
  )
}

export async function guardarConfiguracion(
  clave: ClaveConfiguracion,
  valor: string,
): Promise<void> {
  desempaquetar(
    await getSupabase()
      .from('configuracion_general')
      .upsert({ clave, valor }, { onConflict: 'clave' }),
  )
}
