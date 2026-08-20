# Workflows

Los 5 workflows de Dev 1 (ver [`../docs/dev1-plan.md`](../docs/dev1-plan.md) y
[`../docs/dev1-estado.md`](../docs/dev1-estado.md)). Construidos y probados en
n8n Cloud (`https://josefranciscoarce.app.n8n.cloud`), exportados acá como
JSON para que el trabajo no viva solo en la nube.

| Archivo | Nombre en n8n | ID | Rol |
|---|---|---|---|
| `00-enviar-whatsapp.json` | 00 - Enviar WhatsApp | `dXu7S5atkZfbcZrw` | Sub-workflow central de envío. Lo llaman los otros 4. |
| `01-router.json` | 01 - Router | `IFgEZ5HkY22VE6RO` | Único con el Webhook de Evolution. Dedup, alta de cliente, máquina de estados, clasificación de intención por IA. |
| `02-triaje-sintomas.json` | 02 - Triaje de Síntomas | `TT5XtFwwoUclp39B` | Clasifica el síntoma con IA (baja/media/alta), fail-safe a `alta` si el modelo no responde en formato válido. |
| `03-consulta-historial.json` | 03 - Consulta de Historial | `B5RIwuuQFPJXCXp6` | Resuelve mascota (pregunta si hay más de una), redacta el historial con IA. |
| `08-alerta-urgente.json` | 08 - Alerta Urgente | `6aYwJYE5eyLDA2FL` | Inserta en `alertas` y notifica al teléfono del veterinario. |

## Cómo importarlos

Si hay que reconstruir la instancia de n8n desde cero (otra cuenta, otro
proyecto), importar **en este orden** — cada uno referencia el `workflowId`
de los anteriores en sus nodos `Execute Workflow`:

1. `00-enviar-whatsapp.json`
2. `08-alerta-urgente.json`
3. `03-consulta-historial.json`
4. `02-triaje-sintomas.json`
5. `01-router.json`

Después de importar, en n8n:

```
Workflows → Import from File → seleccionar el .json
```

**Los IDs no van a coincidir** con los de esta tabla (n8n asigna IDs nuevos al
importar). Hay que editar a mano cada nodo `Execute Workflow` que apunta a
otro workflow (buscar por nombre, ej. "00 - Enviar WhatsApp") y volver a
seleccionar el workflow correcto desde el picker — los nodos quedan con el ID
viejo "roto" hasta hacerlo.

## Credenciales que hay que configurar después de importar

Los workflows fueron creados vía MCP con **credenciales placeholder**
(`newCredential(...)` del SDK) — n8n no permite scriptear valores secretos,
así que cada nodo que necesita una credencial quedó con un slot vacío para
completar a mano en la UI (`Credentials` → abrir cada una → pegar el valor
real → Save). Son tres:

| Nombre de la credencial | Tipo | Dónde se usa | Valor a completar |
|---|---|---|---|
| **Supabase Postgres** | Postgres | Todos los nodos Postgres de los 5 workflows | Host/puerto del connection pooler de Supabase (`...pooler.supabase.com:6543`), usuario `postgres.<ref>`, password del proyecto (ref `brhswrfgdexiumqisuql`), SSL activado |
| **Evolution API** | HTTP Custom Auth Template | `Enviar por Evolution` en wf 00 (único lugar que le pega a Evolution directo) | Template `{"headers":{"apikey":"<AUTHENTICATION_API_KEY>"}}` — el valor está en `evolution/.env`, campo `AUTHENTICATION_API_KEY` |
| **Google Gemini** | Google PaLM API | Los 3 nodos de IA (`Clasificar Intencion` en wf01, `Triaje de Sintomas` en wf02, `Redactar Historial` en wf03) | API key de Google AI Studio. **Pendiente**: no se generó todavía (ver `docs/dev1-estado.md`) |

**El workflow no corre hasta completar estas tres.** Sin la de Postgres, todo
falla en el primer nodo de cada uno. Sin Evolution, el wf00 no puede enviar
(pero sí loguea localmente si se lo prueba con datos pineados). Sin Gemini,
los 3 nodos de IA fallan — el resto del flujo (registro, dedup, historial sin
redacción) sigue funcionando igual.

## Publicar (activar)

Los 5 quedaron creados en **borrador** (`active: false`). Antes de la demo,
publicar cada uno desde la UI de n8n (o `publish_workflow` por MCP) — el
Webhook del wf 01 solo queda con URL de producción una vez publicado, y esa
URL es la que hay que pasarle a `POST /webhook/set/vetbot` de Evolution (ver
`evolution/README.md`).

## Pendiente de Dev 2

El wf 01 tiene una sticky note en el canvas marcando esto: las ramas de
estado `esperando_confirmacion_turno`, `esperando_eleccion_horario` y
`esperando_respuesta_seguimiento` hoy responden con un mensaje genérico
("estamos procesando tu turno...") en vez de invocar los wf 04/05/06 de
Dev 2, porque esos workflows todavía no existen. Cuando Dev 2 los publique,
reemplazar esos 3 casos del switch "Router por Estado" por nodos
`Execute Workflow` apuntando a los IDs reales.

## Simplificaciones de esta primera versión (a revisar)

- **wf02 (triaje) asume una sola mascota por cliente**: toma la primera
  mascota viva registrada (`ORDER BY created_at ASC LIMIT 1`). Si un cliente
  tiene más de una, no pregunta cuál — a diferencia del wf03 (historial) que
  sí lo resuelve. Ajustar si aparece el caso en la demo.
- **La rama "otro" del router no usa IA para redactar** la respuesta, es un
  mensaje fijo invitando a elegir turno/historial/síntoma. El plan original
  hablaba de "consejo general" por IA — se simplificó para no pagar una
  cuarta llamada al modelo en el camino más frecuente (saludos).
- **wf01 crea el cliente con `nombre = telefono`** como placeholder hasta que
  el wizard de alta responde la primera pregunta (nombre del dueño) y lo
  actualiza. Es necesario porque `conversaciones.cliente_id` es NOT NULL y
  por eso hace falta un cliente antes de poder guardar el estado del wizard
  — ver el detalle en `docs/contrato-dev1-dev2.md`.
