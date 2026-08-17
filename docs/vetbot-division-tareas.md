# VetBot — División de tareas (3 desarrolladores)

Split por **módulo funcional**, no por día — permite trabajo en paralelo real desde el arranque. Única dependencia dura: el schema de DB debe estar cerrado el día 1 antes de que nadie escriba nodos que lean/escriban tablas.

---

## Dev 1 — Conversación e IA (el "cerebro" del bot)

**Workflows:** 01 (router: registro + estado pendiente + clasificación de intención), 02 (triaje de síntomas), 03 (consulta de historial), 08 (alerta urgente)

**Qué construye:**
- El webhook que recibe mensajes de Evolution API y decide a dónde van.
- El sub-flujo de registro de cliente/mascota nuevo.
- La lectura de `conversaciones.estado` y la lógica de "¿matchea el patrón esperado o no?".
- Los 3 prompts de Claude: clasificación de intención, triaje de urgencia (con contexto de historia clínica), y respuesta de historial personalizada.
- El disparo de notificación al equipo cuando el triaje da 🔴.

**Entidades que toca:** `clientes`, `mascotas`, `conversaciones`, `mensajes`, `consultas`, `alertas`, `historia_clinica` (solo lectura)

**Tecnología:** n8n, Claude API (HTTP Request node), Evolution API (webhook + envío), DB (lectura/escritura)

**Es el módulo más pesado en ingeniería de prompts** — vale la pena que lo tome quien tenga más cintura escribiendo y testeando system prompts, porque de esto depende la calidad percibida del bot en la demo.

---

## Dev 2 — Agenda, turnos y datos

**Workflows:** 04 (ofrecer turno), 05 (confirmación de turno), 06 (seguimiento 48hs), 07 (recordatorios)

**Qué construye:**
- Integración con Google Calendar (`Free/Busy`, `Create Event`).
- El Function node que cruza `horarios_atencion` − `excepciones_horario` − ocupado en Calendar → arma los slots libres.
- El paso de confirmación explícita antes de crear el turno.
- Los dos Schedule Triggers (seguimiento y recordatorios) corriendo por cron.
- **Dueño del `schema.sql`** (o DDL equivalente): como es quien más tablas relacionales toca, arranca el día 1 escribiendo el schema completo para que los otros dos puedan levantar sobre eso — pero se define en conjunto antes de escribir código.

**Entidades que toca:** `turnos`, `seguimientos`, `recordatorios`, `horarios_atencion`, `excepciones_horario`, `configuracion_general`, `historia_clinica` (escritura post-turno)

**Tecnología:** n8n, Google Calendar node, Schedule Trigger, DB (diseño + lectura/escritura)

---

## Dev 3 — Panel (frontend)

**Módulo:** Panel React completo — las 4 secciones (Dashboard, Mascotas, Turnos, Alertas)

**Qué construye:**
- Dashboard con métricas (turnos del día, consultas resueltas sin turno, alertas activas, recordatorios enviados).
- Vista de turnos del día con chip de urgencia (viene del triaje de Dev 1).
- Vista de alertas/seguimientos pendientes (lee `alertas` y `seguimientos`).
- Feed de últimas conversaciones (lee `mensajes`).
- Historial por mascota (lee `historia_clinica`).
- La capa de conexión a la DB (REST/SDK según el motor que se elija) — es quien más código de "consulta y mostrá" escribe, así que conviene que sea quien defina esa capa de acceso a datos del lado frontend.

**Entidades que toca (todas de lectura):** `turnos`, `mascotas`, `clientes`, `alertas`, `seguimientos`, `mensajes`, `historia_clinica`, `recordatorios`

**Tecnología:** React, Vite, Tailwind, cliente REST/SDK de la DB elegida

---

## Dependencias entre módulos

| Quién depende de quién | Por qué |
|---|---|
| Todos ← schema de DB (Dev 2, día 1) | Nadie puede escribir nodos de lectura/escritura sin las tablas definidas |
| Dev 1 (wf 02) → wf 04 de Dev 2 | El triaje dispara la oferta de turno opcional — necesitan acordar el formato del estado que se pasa |
| Dev 3 ← Dev 1 y Dev 2 | El panel lee datos que generan los workflows de ambos — puede maquetar con datos mock mientras tanto y conectar al final |
| Dev 1 (wf 08) → Dev 3 | La tabla `alertas` que llena Dev 1 es la que muestra el dashboard de Dev 3 |

**Sugerencia de orden:** día 1 se define el schema entre los 3 (aunque lo escriba Dev 2). A partir de ahí, cada uno puede avanzar con su módulo en paralelo sin bloquearse — Dev 3 puede incluso maquetar el panel con datos hardcodeados desde el día 1 y conectar a la DB real recién el día 3-4, cuando ya haya datos reales generados por los otros dos.

---

## No hay backend propio — quién habla con quién

No se agrega ningún servidor intermedio (Express, etc.). Cada capa se comunica así:

| Origen | Destino | Para qué | Vía |
|---|---|---|---|
| WhatsApp | n8n | Toda la lógica conversacional (Dev 1 y Dev 2) | Webhook de Evolution API |
| n8n | DB | Leer/escribir durante la conversación | Nodo nativo de la DB |
| n8n | Claude API | Prompts de clasificación, triaje, respuestas | HTTP Request node |
| n8n | Google Calendar | Disponibilidad, crear/cancelar eventos | Nodo nativo de Calendar |
| Panel (Dev 3) | DB | CRUD directo (turnos, mascotas, alertas) y métricas del dashboard | REST/SDK nativo de la DB — usar vistas o funciones SQL (RPC) para las métricas agregadas, no lógica en el frontend |
| Panel (Dev 3) | n8n | Solo para acciones del panel que además deben tocar un servicio externo (ej: cancelar un turno → también cancela el evento en Calendar; reenviar un recordatorio → dispara WhatsApp real) | Webhook puntual expuesto por n8n |

**Motor de DB elegido: Supabase** (Postgres + REST/SDK + auth incluidos) — es el único evaluado que resuelve conexión sin fricción tanto desde n8n (nodo nativo) como desde el panel (SDK directo, sin backend intermedio). Alternativas como Neon o Postgres pelado exigirían armar una capa de REST propia (PostgREST, Hasura, o un backend a medida) solo para que el panel pueda leer la DB de forma segura desde el navegador — fricción innecesaria para el alcance de este sprint.
