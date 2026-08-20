# Contrato Dev 1 ↔ Dev 2 (y aviso a Dev 3)

> Escrito el 19/08/2026 al cerrar la Fase 1 de [`dev1-plan.md`](dev1-plan.md).
> Documenta los cambios de schema que Dev 1 aplicó sobre tablas compartidas, y
> el contrato de datos entre el wf 02 (Dev 1) y el wf 04 (Dev 2).

## 1. Qué cambió del schema y por qué

Migración `dev1_ajustes_router_enum` + `dev1_ajustes_router`, aplicada por MCP
sobre el proyecto `brhswrfgdexiumqisuql`. Motivo general: el plan v1 asumía
nombres y restricciones que la base real no tenía (detalle completo en
[`dev1-plan.md`](dev1-plan.md), sección "Lo que el schema real contradice").

| Cambio | Tabla | Por qué |
|---|---|---|
| `ADD VALUE 'esperando_eleccion_mascota'` | enum `Conversacion_Estado` | El wf 03 (historial) necesita un estado propio cuando el cliente tiene más de una mascota y hay que preguntar cuál |
| `cliente_id` pasa a nullable | `mensajes` | Antes era NOT NULL y no se podía loguear el mensaje de un número que todavía no está registrado. El router inserta con `cliente_id = NULL` y hace backfill al cerrar el registro |
| `+ columna telefono` (text) | `mensajes` | De quién vino el mensaje, disponible aunque no haya `cliente_id` todavía |
| `+ columna wa_message_id` (text) + índice único parcial | `mensajes` | Evolution reintenta el webhook; dedup por `data.key.id` de WhatsApp. El índice es `WHERE wa_message_id IS NOT NULL` para no romper mensajes viejos/manuales sin ese campo |
| `contexto` de `json` a `jsonb` | `conversaciones` | `jsonb` permite hacer merge (`||`) en los `UPDATE` del router sin traer y reescribir el objeto entero |
| `INSERT` de `telefono_veterinario` | `configuracion_general` | Destino de las notificaciones del wf 08 (alerta urgente). **El valor quedó como placeholder `<a completar>`** — hay que reemplazarlo por el número real antes de la demo |

Las 13 tablas estaban vacías al momento de migrar (0 filas salvo
`configuracion_general`), así que no hubo riesgo de datos ni backfill
necesario.

## 2. Forma del JSON de `conversaciones.contexto` por estado

`contexto` es `jsonb`. El router (wf 01) y el wf 03 lo leen/escriben según el
`estado` de la fila. Forma actual por estado:

**`esperando_datos_registro`** (máquina de pasos del alta de cliente/mascota):

```json
{
  "paso": "nombre_dueno" | "nombre_mascota" | "especie" | "sexo" | "raza",
  "datos": {
    "nombre_dueno": "string opcional, se va completando",
    "nombre_mascota": "string opcional",
    "especie": "uno de los 32 valores del enum, opcional",
    "sexo": "valor del enum de sexo, opcional",
    "raza": "string opcional, paso salteable"
  }
}
```

**`esperando_eleccion_mascota`** (nuevo estado, lo agrega Dev 1 — lo usa el
wf 03 cuando el cliente tiene más de una mascota):

```json
{
  "mascota_ids": ["uuid", "uuid", "..."]
}
```

El router/wf 03 interpreta la respuesta del cliente (nombre o número de
opción) contra esta lista para resolver a un solo `mascota_id` y sigue el
flujo de historial con ese id.

**`esperando_confirmacion_turno`** y **`esperando_eleccion_horario`**: son
estado de Dev 2 (wf 04/05) — Dev 1 solo los lee para el `Switch` del router y
los setea al cerrar el triaje (`baja`/`media` → oferta de turno). La forma
exacta de su `contexto` la define Dev 2; si cambia, avisar acá.

**`esperando_respuesta_seguimiento`**: estado de Dev 2 (wf 06). Dev 1 solo lo
switchea en el router para no clasificar por IA una respuesta de seguimiento.

**`libre`**: `contexto` no tiene forma fija — normalmente `{}` o resabios del
último estado, no se lee.

## 3. Handoff wf 02 (Dev 1) → wf 04 (Dev 2)

El triaje de síntomas (wf 02) clasifica en `baja` / `media` / `alta`.
Para `baja`/`media`, después de mandar el consejo, el wf 02:

1. Hace `UPDATE conversaciones SET estado = 'esperando_confirmacion_turno', contexto = contexto || '{"origen": "triaje", "consulta_id": "<uuid>"}'::jsonb, update_at = now() WHERE cliente_id = ...`
2. Llama al wf 04 con un nodo **Execute Workflow**, pasando:

```json
{
  "cliente_id": "uuid",
  "mascota_id": "uuid",
  "consulta_id": "uuid",
  "clasificacion": "baja | media",
  "telefono": "string, para que el 04 no tenga que volver a resolverlo"
}
```

`consulta_id` referencia la fila que el wf 02 ya insertó en `consultas`
(`mensaje_original`, `consejo_generado`, `clasificacion` — sin `resumen_caso`,
esa columna no existe ahí). Si Dev 2 necesita el resumen del caso para ofrecer
turno con contexto, se agrega `resumen_caso` al payload de arriba en vez de
volver a consultarlo — avisar antes de asumirlo si hace falta.

Para `alta`, el wf 02 no llama al wf 04: llama al wf 08 (alerta urgente, de
Dev 1 también) y el flujo de turno no aplica hasta que un humano cierre la
alerta.

**Pendiente de acordar con Dev 2:** el campo exacto que el wf 04 espera para
"origen" (si usa `contexto.origen` o prefiere un parámetro del Execute
Workflow) y si necesita el `resumen_caso` en el handoff. Escribir la
resolución acá cuando se defina.

### 3.1. Estado real de wf04/wf05 al 20/08/2026 (bloqueado)

Dev 2 pasó `workflows/04-ofrecer-turno.json` y `workflows/05-confirmacion-turno.json`.
Revisados: **no están en la misma instancia de n8n que wf00/01/02/03/08**
(`josefranciscoarce.app.n8n.cloud`), y usan un patrón distinto:

- Webhook propio (`POST /webhook/ofrecer-turno`, `POST /webhook/confirmar-turno`)
  en vez de `Execute Workflow Trigger` como los de Dev 1 — hay que acordar un
  solo patrón antes de integrarlos al router.
- El último nodo de cada uno (`HTTP Request`) está **sin URL configurada** —
  da la impresión de que iba a responder por WhatsApp pero no quedó
  conectado a nada.
- wf04 actualiza `conversaciones.estado = 'esperando_eleccion_horario'` pero
  **no persiste la lista de horarios ofrecidos en `contexto`** — sin eso, el
  wf 01 no tiene con qué interpretar cuál horario eligió el dueño cuando
  responda.
- Usan credenciales que no existen en nuestra instancia: **Supabase (API
  REST)** de Dev 2 y **Google Calendar OAuth2** de la cuenta
  `zentexlabs@gmail.com`. Ninguna de las dos se puede crear por MCP/script —
  Google Calendar en particular requiere un login OAuth interactivo de quien
  tenga acceso a esa cuenta.

**Bloqueado hasta que:** Dev 2 (o quien tenga acceso a esa cuenta de Google)
cree esas dos credenciales directamente en `josefranciscoarce.app.n8n.cloud`.
Recién ahí se puede importar wf04/wf05, adaptarlos al patrón de Execute
Workflow, agregar la persistencia de `contexto.slots` y conectarlos al wf00
para responder. Mientras tanto, el router (wf 01) sigue con la rama
`esperando_eleccion_horario` respondiendo un mensaje genérico (ver sticky
note en el canvas del wf 01 y `workflows/workflows.md`).

## 4. Nota de RLS (fuera de alcance de Dev 1)

**RLS está deshabilitado en las 13 tablas.** Los workflows de n8n no lo
necesitan (entran por Postgres directo, connection pooler), pero el panel de
Dev 3 usa la anon key de Supabase — hoy, con RLS off, esa key puede leer y
modificar historias clínicas y teléfonos de cualquier fila. Es tarea de
Dev 2/Dev 3, no se toca desde acá. Queda asentado para que no se pierda antes
de exponer el panel fuera de la demo.

## 5. Aviso para Dev 3 (sin tocar `panel/`)

`panel/src/types/db.ts` es un espejo manual del schema que ya estaba
desactualizado **antes** de esta migración, y ahora lo está más:

- Antes: `Especie = 'perro' | 'gato' | 'otro'` contra un enum real de 32
  valores; `EstadoMascota = 'activo'` contra el valor real `'vivo'`.
- Ahora, además: el enum de `conversaciones.estado` sumó
  `esperando_eleccion_mascota`, y `mensajes` sumó las columnas `telefono` y
  `wa_message_id` (y `cliente_id` pasó a nullable).

Corrección (la corre Dev 3, no Dev 1):

```bash
npx supabase gen types typescript --project-id brhswrfgdexiumqisuql > src/types/db.ts
```
