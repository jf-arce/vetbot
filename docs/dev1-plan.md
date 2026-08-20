# Plan — Dev 1 (VetBot): Evolution API + workflows 01 / 02 / 03 / 08

> Versión 2 (19/08/2026), escrita **después** de leer el schema real de
> Supabase por MCP. Reemplaza al plan anterior, que asumía nombres de tablas y
> restricciones que la base no tiene. Es autocontenido: se ejecuta de acá sin
> volver a reconstruir contexto. El estado del terreno está en
> [`dev1-estado.md`](dev1-estado.md).

## Contexto

Dev 1 es el "cerebro" conversacional del bot. Según
[`vetbot-division-tareas.md`](vetbot-division-tareas.md) le toca el router
(wf 01), el triaje de síntomas (wf 02), la consulta de historial (wf 03) y la
alerta urgente (wf 08) — más los 3 prompts de IA, que son lo que define la
calidad percibida en la demo.

La versión anterior de este plan se escribió sin poder leer la base. Ya está
leída (proyecto `Veterinaria Bot`, ref `brhswrfgdexiumqisuql`, Postgres 17) y
aparecieron cuatro choques que rompían el wf 01 tal como estaba diseñado.

Estado verificado hoy: n8n Cloud en **0 workflows / 0 credenciales**, Docker
sin contenedores del proyecto, `workflows/` vacío, Evolution API sin tocar.

### Lo que el schema real contradice del plan viejo

| Supuesto del plan v1 | Realidad en Supabase |
|---|---|
| tabla `historia_clinica` | es **`historias_clinicas`** (plural), y ordena por `fecha` — no tiene `created_at` |
| insert en `mensajes` apenas llega el webhook | `mensajes.cliente_id` es **NOT NULL** → revienta con un número desconocido |
| dedup por `data.key.id` | no hay columna donde persistirlo |
| registro = dueño → mascota → especie → raza | `mascotas.sexo` es **NOT NULL sin default**, y `especie` es un enum cerrado de 32 valores — no acepta texto libre |
| `esperando_eleccion_mascota` en el enum | no existe — confirmado |

Enum real de `conversaciones.estado`: `libre`, `esperando_confirmacion_turno`,
`esperando_eleccion_horario`, `esperando_datos_registro`,
`esperando_respuesta_seguimiento`.

Otros detalles a tener a mano al cablear:

- `conversaciones.cliente_id` es **unique** → una conversación por cliente, el
  upsert va por esa columna.
- La columna de timestamp se llama **`update_at`** (sic) y **no tiene trigger**:
  cada `UPDATE` la escribe a mano.
- `consultas` **no tiene `resumen_caso`** — ese campo vive solo en `alertas`.
- `configuracion_general` tiene hoy 3 claves: `dias_anticipacion` (7),
  `duracion_turno_minutos` (30), `turnos_a_mostrar` (4).

### Límite de propiedad

`panel/` es de otro dev: **no se toca ni un archivo**. Lo de Dev 1 es `docs/`,
`workflows/`, la carpeta nueva `evolution/` (infra de WhatsApp) y el schema de
Supabase. Todo lo que necesite el panel se pide por
`docs/contrato-dev1-dev2.md`.

### Fuera de alcance, pero hay que decirlo

**RLS está deshabilitado en las 13 tablas.** A estos workflows no los afecta
(entran por Postgres directo), pero el panel usa la anon key: hoy cualquiera
con esa key lee y modifica historias clínicas y teléfonos. Es de Dev 2/Dev 3 —
queda asentado en el contrato, no se toca acá.

### Por qué cinco workflows y no uno

Decidido: `00 — Enviar WhatsApp`, `01 router`, `02 triaje`, `03 historial`,
`08 alerta`. El criterio no es el tamaño sino **quién llama a qué**:

- **00** lo invocan los 4 workflows de Dev 1 y los 4 de Dev 2 → es el único
  lugar que conoce la URL del túnel, que cambia en cada restart de cloudflared.
- **01** es el único con el Webhook de Evolution.
- **02** cruza la frontera de equipo en las dos direcciones: lo llama el router
  y le pasa la posta al wf 04 de Dev 2.
- **08** queda aparte aunque hoy solo lo dispare el triaje: el wf 06 de Dev 2
  (seguimiento a 48hs) va a querer alertar cuando el dueño responde "está
  peor", y embebido no lo puede llamar. Son 3 nodos.
- **03** aparte para poder ejecutarlo con datos pinneados, sin simular un
  webhook entero, y para no inflar el canvas del router.

Lo que **no** se hace en ningún caso es un workflow único: un solo execution
log para todo es imposible de depurar en vivo, y el handoff con Dev 2 igual
obliga a sub-workflows.

---

## Fase 0 — Evolution API local + túnel

Decisión ya tomada: Evolution corre en **Docker local + túnel cloudflared**.
n8n es Cloud, así que puede *recibir* el webhook de un Evolution local, pero no
puede *llegar* a `localhost:8080` para mandar las respuestas — el túnel
resuelve esa dirección, a costo cero.

Todo vive en una carpeta nueva `evolution/` del repo.

### 0.1 Archivos a crear

**`evolution/docker-compose.yml`** — cuatro servicios:

| Servicio | Imagen | Para qué |
|---|---|---|
| `evolution-api` | `evoapicloud/evolution-api:v2.2.3` (el namespace `atendai/*` se migró a `evoapicloud/*` en Docker Hub; el viejo devuelve 401/pull denied) | La API. Puerto `8080:8080`, volumen `evolution_instances:/evolution/instances` |
| `postgres` | `postgres:16-alpine` | Persistencia de instancias/mensajes de Evolution. **Base propia, NO la de Supabase** — son datos de infra de WhatsApp, no del dominio del bot |
| `redis` | `redis:7-alpine` | Cache de sesión de Baileys |
| `cloudflared` | `cloudflare/cloudflared:latest` | `tunnel --no-autoupdate --url http://evolution-api:8080` → URL pública gratuita `*.trycloudflare.com` |

**`evolution/.env.example`**:

```dotenv
SERVER_URL=                       # se completa con la URL del túnel (paso 0.3)
SERVER_PORT=8080
LANGUAGE=es
AUTHENTICATION_API_KEY=           # openssl rand -hex 16

DATABASE_ENABLED=true
DATABASE_PROVIDER=postgresql
DATABASE_CONNECTION_URI=postgresql://evolution:evolution@postgres:5432/evolution?schema=public
DATABASE_SAVE_DATA_INSTANCE=true
DATABASE_SAVE_DATA_NEW_MESSAGE=true

CACHE_REDIS_ENABLED=true
CACHE_REDIS_URI=redis://redis:6379/6
CACHE_REDIS_PREFIX_KEY=vetbot
CACHE_LOCAL_ENABLED=false

WEBHOOK_GLOBAL_ENABLED=false      # el webhook se setea por instancia, no global
DEL_INSTANCE=false
```

**`evolution/.gitignore`** — *antes* de crear el `.env` real. No hay
`.gitignore` en la raíz del repo (solo dentro de `panel/`, que no se toca), y
git respeta los anidados. Tiene que ignorar `.env` y dejar pasar
`.env.example`; si no, la `AUTHENTICATION_API_KEY` termina commiteada.

**`evolution/README.md`** — el ritual de arranque y el de "se cayó el túnel"
(ver 0.5), para que no dependa de ninguna conversación.

### 0.2 Levantar

```bash
cd evolution && cp .env.example .env   # completar AUTHENTICATION_API_KEY
docker compose up -d
docker compose logs -f evolution-api   # esperar "Server running"
```

### 0.3 Sacar la URL pública y cerrar el círculo

```bash
docker compose logs cloudflared | grep trycloudflare.com
```

Esa URL va a `SERVER_URL` en el `.env` → `docker compose up -d evolution-api`
para que la tome. Verificación:

```bash
curl -H "apikey: $APIKEY" https://<url-del-tunel>/instance/fetchInstances
```

### 0.4 Crear la instancia

```bash
curl -X POST https://<url>/instance/create \
  -H "apikey: $APIKEY" -H "Content-Type: application/json" \
  -d '{"instanceName":"vetbot","integration":"WHATSAPP-BAILEYS","qrcode":true}'
```

El webhook a n8n se setea **después** de crear el wf 01 (hace falta su URL de
producción): `POST /webhook/set/vetbot`, `webhookByEvents: false` y un único
evento, `MESSAGES_UPSERT`. Suscribir solo ese evento evita que el router reciba
ruido (`SEND_MESSAGE`, `PRESENCE_UPDATE`, etc.).

### 0.5 Dos cosas que hay que saber

- **La URL del quick tunnel cambia en cada restart de `cloudflared`.** Cuando
  pasa hay que rehacer tres cosas: `SERVER_URL` en el `.env`, la URL base de la
  credencial de Evolution en n8n, y el `/webhook/set`. Con un dominio propio se
  reemplaza por un *named tunnel* y el problema desaparece — queda documentado
  en el README, no se hace ahora.
- **El túnel expone Evolution a internet.** Lo único que la protege es
  `AUTHENTICATION_API_KEY`: generarla random y nunca commitear el `.env`.

### 0.6 El QR queda pendiente

Sin número, `GET /instance/connect/vetbot` no se completa. **No bloquea nada**:
todo lo demás se prueba con payloads simulados. Cuando aparezca el chip, se
escanea el QR y el mismo flujo pasa a ser real sin tocar un solo nodo.

**Salida de la fase:** `docker compose ps` con los 4 servicios `Up`, la URL
`*.trycloudflare.com` cargada en `SERVER_URL`, instancia `vetbot` creada y
`fetchInstances` devolviéndola.

---

## Fase 1 — Migración de schema

Se aplica por el MCP de Supabase, en una migración `dev1_ajustes_router`. Las
tablas están vacías (0 filas en todas menos `configuracion_general`), así que
no hay riesgo de datos.

```sql
-- 1. Estado que necesita el wf 03 cuando el cliente tiene >1 mascota
ALTER TYPE "Conversacion_Estado" ADD VALUE 'esperando_eleccion_mascota';

-- 2. El mensaje entrante de un número desconocido se loguea antes de que
--    exista el cliente; se le asigna el cliente_id al completar el registro
ALTER TABLE mensajes ALTER COLUMN cliente_id DROP NOT NULL;
ALTER TABLE mensajes ADD COLUMN telefono text;   -- de quién vino, sin cliente aún

-- 3. Evolution reintenta el webhook: dedup por id de WhatsApp
ALTER TABLE mensajes ADD COLUMN wa_message_id text;
CREATE UNIQUE INDEX mensajes_wa_message_id_key
  ON mensajes (wa_message_id) WHERE wa_message_id IS NOT NULL;

-- 4. contexto es json; jsonb permite merge (||) en los UPDATE del router
ALTER TABLE conversaciones ALTER COLUMN contexto TYPE jsonb USING contexto::jsonb;

-- 5. Destino de las alertas del wf 08
INSERT INTO configuracion_general (clave, valor)
VALUES ('telefono_veterinario', '<a completar>');
```

`ALTER TYPE ... ADD VALUE` no siempre convive con otro DDL en la misma
transacción: si la migración falla, va partida en dos (el enum primero, solo).

**Parte no opcional de esta fase:** escribir `docs/contrato-dev1-dev2.md` con

- qué cambió del schema y por qué,
- la forma del JSON de `conversaciones.contexto` en cada estado,
- cómo el wf 02 le pasa la posta al wf 04 (nodo Execute Workflow + qué campos),
- la nota de RLS,
- y un aviso para Dev 3 **sin tocar `panel/`**: `panel/src/types/db.ts` es un
  espejo manual ya desactualizado contra el schema real (dice
  `Especie = 'perro'|'gato'|'otro'` contra un enum de 32 valores, y
  `EstadoMascota = 'activo'` contra `'vivo'`), y esta migración además le
  agrega un valor al enum de estados y dos columnas a `mensajes`. La corrección
  es `npx supabase gen types typescript --project-id brhswrfgdexiumqisuql >
  src/types/db.ts`, y la corre Dev 3.

## Fase 2 — Credenciales en n8n Cloud

La instancia está vacía, hay que cargar tres:

1. **Postgres → Supabase.** Connection pooler (`...pooler.supabase.com`, puerto
   `6543`), SSL activado. El nodo Postgres nativo es preferible al nodo
   Supabase para los `SELECT`/`UPDATE` con joins del router.
2. **Header Auth → Evolution.** Header `apikey`, valor del `.env`. La URL base
   va en el nodo HTTP Request del sub-workflow 00.
3. **Google Gemini (PaLM) API.** Para el chat model de los tres prompts.
   Los prompts se escriben model-agnostic (salida estructurada + temperature
   baja) para que migrar a Claude sea cambiar credencial y nodo, no reescribir.

## Fase 3 — Sub-workflow `00 — Enviar WhatsApp`

Recibe `{telefono, texto, cliente_id?}`, hace `POST /message/sendText/vetbot` y
deja la fila en `mensajes` (`direccion = 'saliente'`). Centraliza el envío:
cuando cambia la URL del túnel se toca un nodo, no doce.

## Fase 4 — wf 01: router

El más grande. Cadena:

1. **Webhook** POST, path `vetbot-entrante`.
2. **Code "normalizar"**: `telefono` de `data.key.remoteJid`, texto de
   `message.conversation ?? message.extendedTextMessage.text`; descarta lo que
   no es una consulta real — `fromMe === true`, JIDs de grupo (`@g.us`),
   mensajes sin texto.
3. **Insert en `mensajes`** con `wa_message_id = data.key.id`, `telefono`, y
   `cliente_id` NULL si todavía no se conoce → `ON CONFLICT (wa_message_id) DO
   NOTHING` + `RETURNING id`. Si no devuelve fila, es un reintento de Evolution
   y el flujo corta ahí: dedup e insert resueltos en un solo nodo.
4. `SELECT` de `clientes` por `telefono` → **IF existe**.
   - **No existe** → sub-flujo de registro: máquina de pasos guardada en
     `conversaciones.contexto`, estado `esperando_datos_registro`. Pasos:
     nombre del dueño → nombre de la mascota → **especie** → **sexo** → raza
     (opcional, se puede saltear). Especie y sexo se normalizan contra los
     enums con un Code de sinónimos (`perrito/cachorro/can → perro`); si no
     matchea, se repregunta con las opciones más comunes en vez de romper el
     `INSERT`. Al cerrar: `INSERT clientes` + `INSERT mascotas` + backfill del
     `cliente_id` de los mensajes de ese `telefono` + estado `libre`.
   - **Existe** → `SELECT` de `conversaciones` → **Switch por estado** contra
     los strings reales del enum: `esperando_eleccion_horario` → wf 05 ·
     `esperando_confirmacion_turno` → interpretar sí/no → wf 04 ·
     `esperando_respuesta_seguimiento` → update de `seguimientos` ·
     `esperando_eleccion_mascota` → wf 03 · `libre` → paso 5.
5. **Clasificación de intención por IA** con salida estructurada
   `{intencion, razonamiento}` sobre las 4 categorías del doc (turno directo /
   historia clínica / síntoma / otro). Temperature `0`, few-shot en español
   rioplatense. El campo `razonamiento` no es adorno: es lo que deja depurar
   una clasificación mala sin adivinar.
6. **Switch de 4 salidas + fallback explícito.** El fallback nunca se descarta
   en silencio: cae en la rama "otro" (consejo general).

Cada rama cierra llamando al sub-workflow de Fase 3.

## Fase 5 — wf 02: triaje de síntomas

1. Trae contexto clínico: `mascotas` (especie, raza, peso, fecha de nacimiento,
   `notas_generales`) + últimas entradas de **`historias_clinicas`** ordenadas
   por **`fecha DESC`**.
2. **Prompt de triaje** con salida estructurada
   `{clasificacion, consejo, resumen_caso, razonamiento}` — `resumen_caso` se
   genera acá aunque solo lo use el wf 08, para no pagar una segunda llamada.
3. `INSERT` en `consultas`. `mensaje_original` y `consejo_generado` son NOT
   NULL: si el modelo no devuelve consejo, se escribe el texto de derivación,
   no cadena vacía. `resumen_caso` no se persiste acá (no hay columna): viaja
   en el ítem hacia el wf 08.
4. Switch: `baja`/`media` → consejo + oferta de turno + estado
   `esperando_confirmacion_turno`. `alta` → mensaje de derivación + Execute
   Workflow wf 08.
5. **Fail-safe clínico**: si la respuesta del modelo no parsea o la
   clasificación viene fuera del enum, se trata como `alta`. En un bot
   veterinario el error barato es escalar de más, no de menos.

## Fase 6 — wf 03: consulta de historial

`SELECT` de `mascotas` del cliente → si hay más de una, preguntar cuál y
guardar estado `esperando_eleccion_mascota` (el que agrega la Fase 1) con los
ids candidatos en `contexto` → traer `historias_clinicas` → prompt de redacción
(respuesta legible y humana, no un volcado de filas) → responder.

## Fase 7 — wf 08: alerta urgente

`INSERT` en `alertas` con el `resumen_caso` que ya trajo el wf 02 (+
`consulta_id`, `mascota_id`, `cliente_id`) → `SELECT valor FROM
configuracion_general WHERE clave = 'telefono_veterinario'` → notificar por el
sub-workflow de Fase 3 a ese número → la fila queda `pendiente` hasta que un
humano la cierre desde el panel de Dev 3.

## Fase 8 — Exportar al repo

Bajar los cuatro workflows + el sub-workflow a `workflows/` como JSON y
reescribir `workflows/workflows.md` (hoy es una línea con un título) con qué es
cada uno y cómo importarlos. Sin esto el trabajo vive solo en la nube de n8n.
Actualizar también `docs/dev1-estado.md` con lo verificado.

---

## Verificación

**Sin número de WhatsApp** (todo lo que se puede hacer hoy, de punta a punta):

1. **Fase 0**: `docker compose ps` → los 4 servicios `Up`; `curl` con la apikey
   a `/instance/fetchInstances` devuelve la instancia `vetbot`.
2. **Fase 1**: por MCP,
   `SELECT unnest(enum_range(NULL::"Conversacion_Estado"))` incluye
   `esperando_eleccion_mascota`, y `mensajes` acepta un insert con
   `cliente_id` NULL.
3. **Workflows**: guardar en `workflows/test/` cinco payloads
   `MESSAGES_UPSERT` (cliente nuevo, síntoma leve, síntoma grave, pedido de
   historial, mensaje ambiguo) y dispararlos con `curl` contra la URL de test
   del wf 01.
4. Verificar en Supabase después de cada disparo: fila en `mensajes`, estado
   correcto en `conversaciones`, fila en `consultas` con la clasificación
   esperada, y fila en `alertas` **solo** para el caso grave. Repetir el mismo
   payload dos veces: la segunda no debe crear nada (dedup).
5. El envío por WhatsApp va a fallar (no hay sesión): es lo esperado, y se
   confirma leyendo el error del nodo, no salteándolo.

**Con número** (cuando aparezca): `GET /instance/connect/vetbot`, escanear el
QR, `POST /webhook/set/vetbot` con `MESSAGES_UPSERT` como único evento, y
correr la misma batería escribiéndole al bot desde otro teléfono.

---

## Riesgos que conviene tener a la vista

- **El túnel gratuito es efímero** — para el día de la demo, levantarlo
  temprano y no reiniciarlo, o pasar a named tunnel con dominio.
- **El túnel expone Evolution a internet**: la única defensa es la apikey.
- **Baileys no es la API oficial**: riesgo real de ban. Razón de más para no
  usar un número personal.
- **Free tier de Gemini tiene límites de rate** — con varios mensajes seguidos
  en la demo puede tirar 429. Vale la pena decidir antes si se paga una key.
- **Dependencia con Dev 2**: se toca un schema que es suyo. El contrato escrito
  en la Fase 1 es lo que evita que eso se convierta en un conflicto.
