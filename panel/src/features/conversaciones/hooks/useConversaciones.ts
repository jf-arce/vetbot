import { useEffect, useMemo, useState } from 'react'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

import { getSupabase } from '@/lib/supabase'
import { listarMascotasDeCliente } from '@/services/mascotas'
import { listarMensajesDeCliente, listarUltimosMensajes, obtenerCliente, obtenerConversacion } from '@/services/mensajes'
import type { Cliente, Conversacion, MascotaConDueno, Mensaje } from '@/types/db'
import { CONVERSACIONES_RESUMEN_MOCK, MOCK_POR_CLIENTE } from '../data/mockConversaciones'
import { agruparPorCliente } from '../lib/agruparPorCliente'
import type { MensajeConCliente } from '../types'

const LIMITE_LISTA = 50

/**
 * Hook único para el módulo de Conversaciones: maneja la lista maestra
 * (siempre activa) y, si se pasa `clienteId`, el hilo de detalle de ese
 * cliente. Ambas mitades se mantienen al día en vivo vía Supabase Realtime
 * (`postgres_changes` sobre `mensajes`/`conversaciones`) — primer uso de
 * Realtime en este repo.
 *
 * `cargandoLista`/`cargandoDetalle` son estado DERIVADO (no un flag que se
 * prende/apaga a mano dentro del efecto) — evita el patrón que castiga
 * `react-hooks/set-state-in-effect`: en vez de "todavía no llegó la
 * respuesta" se pregunta "¿lo que tengo en pantalla corresponde a lo que se
 * pidió?".
 *
 * Requiere que `mensajes` y `conversaciones` estén agregadas a la
 * publicación `supabase_realtime` del proyecto; si no, los canales quedan
 * `SUBSCRIBED` pero nunca reciben eventos.
 *
 * Sin filas reales (o si falla la conexión) cae a `data/mockConversaciones.ts`
 * — mismo criterio que Alertas/Seguimientos. Un `clienteId` de conversación
 * mock resuelve directo desde ahí, sin pegarle a Supabase ni abrir canal.
 */
export function useConversaciones(clienteId?: string) {
  // ---- Lista maestra ------------------------------------------------------
  // `null` = todavía no llegó la primera respuesta (ni éxito ni error).
  const [mensajesRecientes, setMensajesRecientes] = useState<MensajeConCliente[] | null>(null)
  const [errorLista, setErrorLista] = useState<string | null>(null)
  const [tickLista, setTickLista] = useState(0)

  const conversacionesReales = useMemo(() => agruparPorCliente(mensajesRecientes ?? []), [mensajesRecientes])
  const cargandoLista = mensajesRecientes === null && !errorLista
  // Sin filas reales (todavía no hay bot escribiéndole a nadie, o falla la
  // conexión) se muestran conversaciones de ejemplo — mismo criterio que
  // `data/mockAlertas.ts`/`data/mockSeguimientos.ts`. En cuanto haya una fila
  // real esto se tapa solo.
  const conversaciones = !cargandoLista && conversacionesReales.length === 0 ? CONVERSACIONES_RESUMEN_MOCK : conversacionesReales

  function recargarLista() {
    setTickLista((valor) => valor + 1)
  }

  useEffect(() => {
    let cancelado = false

    listarUltimosMensajes(LIMITE_LISTA)
      .then((datos) => {
        if (cancelado) return
        setMensajesRecientes(datos as MensajeConCliente[])
        setErrorLista(null)
      })
      .catch((error: unknown) => {
        if (cancelado) return
        setErrorLista(error instanceof Error ? error.message : 'No se pudo cargar la lista.')
      })

    return () => {
      cancelado = true
    }
  }, [tickLista])

  useEffect(() => {
    // `getSupabase()` tira sincrónicamente si faltan las env vars — sin
    // try/catch acá ese throw queda sin capturar dentro del efecto y tira
    // abajo toda la app (pantalla en blanco). Mismo criterio que
    // `lib/supabase.ts`: sin `.env` el panel tiene que poder navegarse igual.
    let supabase: ReturnType<typeof getSupabase>
    try {
      supabase = getSupabase()
    } catch {
      return
    }

    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const canal = supabase
      .channel('conversaciones-lista')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mensajes' }, () => {
        // El payload no trae el join con `clientes` que necesita la lista —
        // más simple y confiable refetchear (debounced) que armar el merge a mano.
        if (timeoutId) clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          listarUltimosMensajes(LIMITE_LISTA)
            .then((datos) => setMensajesRecientes(datos as MensajeConCliente[]))
            .catch(() => {
              // Un fallo puntual del refetch en vivo no debe tirar abajo la pantalla.
            })
        }, 300)
      })
      .subscribe()

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      supabase.removeChannel(canal)
    }
  }, [])

  // ---- Hilo de detalle -----------------------------------------------------
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [mensajes, setMensajes] = useState<Mensaje[]>([])
  const [conversacion, setConversacion] = useState<Conversacion | null>(null)
  const [mascotas, setMascotas] = useState<MascotaConDueno[]>([])
  const [errorDetalle, setErrorDetalle] = useState<string | null>(null)
  const [tickDetalle, setTickDetalle] = useState(0)

  // Un `clienteId` de una conversación de ejemplo no existe en Supabase —
  // se resuelve entero desde el mock, sin pegarle a la red ni abrir canal.
  const mock = clienteId ? MOCK_POR_CLIENTE.get(clienteId) : undefined

  // "Cargando" = se pidió un cliente pero lo que hay en pantalla todavía es
  // de otro (o no hay nada), y no hay un error ya mostrado por ese pedido.
  const cargandoDetalle = !mock && clienteId !== undefined && cliente?.id !== clienteId && !errorDetalle

  function recargarDetalle() {
    setTickDetalle((valor) => valor + 1)
  }

  useEffect(() => {
    if (!clienteId || mock) return

    let cancelado = false

    Promise.all([
      obtenerCliente(clienteId),
      listarMensajesDeCliente(clienteId),
      obtenerConversacion(clienteId),
      listarMascotasDeCliente(clienteId),
    ])
      .then(([datoCliente, datoMensajes, datoConversacion, datoMascotas]) => {
        if (cancelado) return
        setCliente(datoCliente)
        setMensajes(datoMensajes)
        setConversacion(datoConversacion)
        setMascotas(datoMascotas)
        setErrorDetalle(null)
      })
      .catch((error: unknown) => {
        if (cancelado) return
        setErrorDetalle(error instanceof Error ? error.message : 'No se pudo cargar la conversación.')
      })

    return () => {
      cancelado = true
    }
  }, [clienteId, tickDetalle, mock])

  useEffect(() => {
    if (!clienteId || mock) return

    let supabase: ReturnType<typeof getSupabase>
    try {
      supabase = getSupabase()
    } catch {
      return
    }

    const canal = supabase
      .channel(`conversacion-${clienteId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'mensajes', filter: `cliente_id=eq.${clienteId}` },
        (payload: RealtimePostgresChangesPayload<Mensaje>) => {
          const nuevo = payload.new as Mensaje
          setMensajes((actuales) =>
            actuales.some((mensaje) => mensaje.id === nuevo.id) ? actuales : [...actuales, nuevo],
          )
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'conversaciones', filter: `cliente_id=eq.${clienteId}` },
        (payload: RealtimePostgresChangesPayload<Conversacion>) => {
          if (payload.eventType === 'DELETE') {
            setConversacion(null)
          } else {
            setConversacion(payload.new as Conversacion)
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(canal)
    }
  }, [clienteId, mock])

  return {
    conversaciones,
    cargandoLista,
    errorLista,
    recargarLista,

    cliente: mock ? mock.cliente : cliente,
    mensajes: mock ? mock.mensajes : mensajes,
    conversacion: mock ? mock.conversacion : conversacion,
    mascotas: mock ? mock.mascotas : mascotas,
    cargandoDetalle,
    errorDetalle: mock ? null : errorDetalle,
    recargarDetalle,
  }
}
