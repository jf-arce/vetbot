import { SeguimientosView } from '@/features/seguimientos/components/SeguimientosView'

/**
 * ─── CONTRATO DEL MÓDULO ───────────────────────────────────────────────────
 *
 * Qué es: el control post-consulta. El cron del wf 06 corre todos los días,
 * busca turnos atendidos hace 48hs y le pregunta al dueño por WhatsApp cómo
 * sigue la mascota. Acá se ve qué contestaron y quién nunca contestó.
 *
 * Datos: `services/seguimientos.ts` → listarSeguimientos(estado?)
 *
 * Columnas: fecha programada · mascota (link a ficha) · dueño ·
 *           motivo del turno original · estado · respuesta
 *
 * Estados: pendiente (enviado, esperando) | respondido | sin_respuesta
 *   `sin_respuesta` va como alerta liviana — no es urgente como una 🔴, pero
 *   es el caso que alguien debería mirar y eventualmente llamar.
 *
 * Layout: tablero Kanban de 3 columnas (Vencidos / Hoy / Mañana), agrupadas
 *         por `fecha_programada` relativa al `DatePicker` del header — no por
 *         tabs de estado. Arriba, 3 KPIs (seguimientos hoy, para completar,
 *         próximos 7 días).
 *
 * Regla de negocio: el vet NO manda WhatsApps manuales desde acá — esta
 * pantalla es de AUDITORÍA de lo que hace el bot (wf 06 + wf 01), no un canal
 * de contacto alternativo. Por eso no hay botón de WhatsApp en la tarjeta.
 *
 * Actualiza: el panel ahora permite "pausar el bot" para un caso puntual
 * (ver Sheet de detalle) — simulado, todavía no existe un mecanismo real en
 * el schema para eso (ver nota en `features/seguimientos/types.ts`). Fuera de
 * esa acción, sigue siendo el wf 01 quien escribe `respuesta`/`estado` cuando
 * llega la respuesta del dueño.
 * ───────────────────────────────────────────────────────────────────────────
 */
export function SeguimientosPage() {
  return <SeguimientosView />
}
