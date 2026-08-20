# Dev 1 — Estado y contexto de arranque

Actualizado el 19/08/2026 al terminar la ejecución del plan
([`dev1-plan.md`](dev1-plan.md)) de punta a punta. Sirve para retomar sin
volver a reconstruir el contexto.

## Alcance de Dev 1

Workflows **01** (router), **02** (triaje de síntomas), **03** (consulta de
historial) y **08** (alerta urgente), más el sub-workflow **00** (envío de
WhatsApp) y los tres prompts de IA. Ver
[`vetbot-division-tareas.md`](vetbot-division-tareas.md).

## Estado del terreno al cerrar la sesión

| Pieza | Estado |
|---|---|
| `evolution/` | Docker Compose con 4 servicios (`evolution-api`, `postgres`, `redis`, `cloudflared`), **arriba y funcionando**. Instancia `vetbot` creada (`WHATSAPP-BAILEYS`, sin escanear QR todavía) |
| Supabase | Migración `dev1_ajustes_router_enum` + `dev1_ajustes_router` aplicada y verificada. Ver `contrato-dev1-dev2.md` para el detalle |
| n8n Cloud | **5 workflows creados y validados**: 00, 01, 02, 03, 08. Todos en borrador (`active: false`), sin publicar |
| `workflows/` | Los 5 exportados como JSON + `workflows.md` con la guía de import/credenciales |
| `panel/` | Sin tocar (no es alcance de Dev 1) |
| Número de WhatsApp | Sigue sin haber — no bloqueó nada, todo se construyó con payloads simulados |

## IDs de los workflows en n8n (`josefranciscoarce.app.n8n.cloud`)

| Workflow | ID |
|---|---|
| 00 - Enviar WhatsApp | `dXu7S5atkZfbcZrw` |
| 01 - Router | `IFgEZ5HkY22VE6RO` |
| 02 - Triaje de Síntomas | `TT5XtFwwoUclp39B` |
| 03 - Consulta de Historial | `B5RIwuuQFPJXCXp6` |
| 08 - Alerta Urgente | `6aYwJYE5eyLDA2FL` |

## Decisión no prevista en el plan: `atendai/evolution-api` → `evoapicloud/evolution-api`

El plan v2 especificaba la imagen `atendai/evolution-api:v2.2.3`. Al hacer
`docker compose up` dio `pull access denied` — Docker Hub devuelve 401/404
para ese namespace. Está confirmado por la comunidad: el proyecto migró su
publicación a `evoapicloud/evolution-api` manteniendo los mismos tags. Se
corrigió `evolution/docker-compose.yml` y quedó anotado en `dev1-plan.md`.
Si se re-clona este repo en otra máquina y vuelve a fallar el pull, es la
primera cosa a revisar.

## Credenciales de n8n: ya resueltas (20/08/2026)

Las 3 credenciales están cargadas y probadas end-to-end contra el wf 01
(Postgres real, Evolution real, Gemini real). Se encontraron y resolvieron
dos problemas no obvios en el camino:

1. **Postgres: `self-signed certificate in certificate chain`.** El driver
   `pg` que usa n8n valida la cadena de certificados por default y no
   reconoce la de Supabase (aunque `psql` con `sslmode=require` conecta sin
   problema, porque no valida cadena). Se resolvió activando **"Ignore SSL
   Issues (Insecure)"** en la credencial Postgres de n8n, además de SSL en
   `require`. Esto **no** desactiva el cifrado — la conexión sigue yendo por
   TLS, solo deja de verificar la identidad del certificado contra una CA de
   confianza. Es el ajuste estándar para este caso (pooler de Supabase +
   n8n), no un agujero de seguridad real para este proyecto.
2. **`there is no unique or exclusion constraint matching the ON CONFLICT
   specification`** en el insert de `mensajes` del wf 01. El índice único de
   `wa_message_id` (Fase 1 del plan) es parcial (`WHERE wa_message_id IS NOT
   NULL`), y Postgres no lo toma como target de `ON CONFLICT (wa_message_id)`
   a menos que la cláusula repita el mismo `WHERE`. Se corrigió el nodo
   `Registrar Mensaje Entrante` del wf 01 a
   `ON CONFLICT (wa_message_id) WHERE wa_message_id IS NOT NULL DO NOTHING`
   — reflejado también en `workflows/01-router.json`.

Con ambos fixes, la cadena completa `Webhook → Normalizar Mensaje → Registrar
Mensaje Entrante → Buscar Cliente → Cliente Existe? → Crear Cliente Nuevo →
Crear Conversacion Registro → Preparar Pregunta Alta` corre sin errores
contra Supabase real. Se probó disparando el webhook del wf 01 vía MCP con un
payload simulado y confirmando fila por fila en la ejecución; los datos de
prueba (teléfono `5490000000000`) se borraron después.

El único error esperado en esa prueba fue al final, en `Enviar por
Evolution` (`Timed Out`) — correcto, todavía no hay QR escaneado.

## Pendientes reales para que esto funcione de punta a punta

1. **Reemplazar `telefono_veterinario` en `configuracion_general`** — quedó
   con el placeholder `<a completar>` (Fase 1 del plan). El wf 08 no puede
   notificar a nadie hasta que tenga un número real.
2. **Publicar los 5 workflows** (`active: true`) y recién ahí tomar la URL
   de producción del webhook del wf 01 para el `POST /webhook/set/vetbot` de
   Evolution.
3. **Correr la batería de verificación** de la sección "Verificación" del
   plan: 5 payloads `MESSAGES_UPSERT` simulados (cliente nuevo, síntoma leve,
   síntoma grave, pedido de historial, mensaje ambiguo) contra la URL de test
   del wf 01, confirmando filas en Supabase después de cada uno.
4. **Acordar con Dev 2** el reemplazo de las 3 ramas placeholder del router
   (`esperando_confirmacion_turno`, `esperando_eleccion_horario`,
   `esperando_respuesta_seguimiento`) por `Execute Workflow` a los wf 04/05/06
   reales — hoy responden con un mensaje genérico (ver sticky note en el
   canvas del wf 01 y `workflows/workflows.md`).
5. **Cuando aparezca el número de WhatsApp**: `GET /instance/connect/vetbot`,
   escanear el QR, y correr la misma batería desde un teléfono real.

## Simplificaciones tomadas por tiempo (documentadas en `workflows/workflows.md`)

- wf02 (triaje) toma la primera mascota viva del cliente sin preguntar si hay
  más de una (wf03 sí lo resuelve).
- La rama "otro" del router responde con un mensaje fijo, no con una cuarta
  llamada a IA.
- wf01 crea el cliente con `nombre = telefono` como placeholder hasta que el
  wizard de alta completa el nombre real — necesario porque
  `conversaciones.cliente_id` es `NOT NULL` (detalle en `contrato-dev1-dev2.md`).

## Riesgos conocidos (sin cambios respecto a la sesión anterior)

- **RLS deshabilitado en las 13 tablas.** No afecta a los workflows (entran
  por Postgres directo), pero el panel usa la anon key. Es de Dev 2/Dev 3.
- La URL del quick tunnel de Cloudflare **cambia en cada restart**. Cuando
  pasa: `evolution/.env` (`SERVER_URL`) → credencial de n8n → `webhook/set`.
  Node único a tocar: `Config Evolution` del wf 00.
- El túnel expone Evolution a internet: única defensa, `AUTHENTICATION_API_KEY`.
- Evolution usa Baileys (no oficial): riesgo de ban, usar número secundario.
- Free tier de Gemini con límite de rate: puede tirar 429 con mensajes
  seguidos en la demo.
