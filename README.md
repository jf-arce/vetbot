# VetBot

Asistente veterinario por WhatsApp: atiende a los dueños de las mascotas las 24
horas, hace triaje de síntomas con IA, agenda turnos contra el Google Calendar
real de la clínica y avisa al equipo cuando un caso es urgente. Todo lo que
pasa queda registrado en un panel interno.

## El problema

Una clínica veterinaria chica pierde tiempo y pacientes en lo mismo de siempre:

- **El teléfono no da abasto.** Consultas repetidas ("¿está vomitando, lo
  llevo?", "¿cuándo toca la vacuna?") interrumpen la atención en el consultorio.
- **Fuera de horario no atiende nadie.** El dueño que escribe un domingo a la
  noche se queda sin respuesta, y muchas veces sin turno.
- **No hay filtro de urgencia.** Un caso grave y una consulta trivial entran
  por el mismo canal y compiten por la misma atención.
- **La agenda se coordina a mano.** Ida y vuelta de mensajes para encontrar un
  hueco que ya estaba ocupado.
- **Nadie hace seguimiento.** Después de la consulta no se sabe si la mascota
  mejoró, y los recordatorios de vacunas y desparasitaciones dependen de que
  alguien se acuerde.

## Qué hace

| Capacidad | Cómo |
|---|---|
| **Atiende 24/7 por WhatsApp** | Reconoce al cliente por su teléfono y, si es nuevo, lo registra a él y a su mascota en la misma charla |
| **Clasifica la urgencia** | Claude evalúa el síntoma con la historia clínica de la mascota como contexto y lo marca 🟢 baja / 🟡 media / 🔴 alta |
| **Da consejo o deriva** | Los casos leves se resuelven con una respuesta y un turno opcional; los graves disparan una alerta al equipo |
| **Agenda sola** | Cruza el horario de la clínica, los feriados y lo ocupado en Google Calendar, ofrece los huecos más próximos y crea el evento |
| **Confirma antes de crear** | Repite la elección en texto claro antes de reservar nada, para no agendar por un match accidental |
| **Consulta el historial** | El dueño pregunta por su mascota y recibe una respuesta legible, no un volcado de datos |
| **Hace seguimiento a 48hs** | Pregunta automáticamente cómo sigue la mascota después del turno y registra la respuesta |
| **Manda recordatorios** | Vacunas, desparasitaciones y controles salen por WhatsApp antes de vencer |
| **Deja todo a la vista** | El panel muestra turnos del día, alertas activas, seguimientos sin respuesta y el feed de conversaciones |

## Cómo funciona

```
WhatsApp ──webhook──► n8n ──► Claude API        (clasificar, triar, redactar)
                       │
                       ├───► Supabase           (clientes, mascotas, turnos, historia clínica…)
                       │
                       └───► Google Calendar    (disponibilidad y eventos)

Panel React ──────────► Supabase                (lectura directa, sin backend)
            └──────────► n8n                    (solo acciones que tocan Calendar o WhatsApp)
```

**No hay backend propio.** n8n es el orquestador de toda la lógica
conversacional y el panel habla directo con Postgres vía el SDK de Supabase;
la seguridad la dan las policies de RLS. Los únicos llamados del panel a n8n
son para acciones con efecto externo (cancelar un turno también borra el evento
de Calendar; reenviar un recordatorio manda un WhatsApp real).

### Stack

| Capa | Tecnología |
|---|---|
| WhatsApp | Evolution API |
| Orquestador | n8n |
| IA | Claude API (HTTP Request node) |
| Base de datos | Supabase (Postgres + REST/SDK) |
| Agenda | Google Calendar (nodo nativo de n8n) |
| Cron | Schedule Trigger de n8n |
| Panel | React 19 + Vite + Tailwind v4 + shadcn/ui |

### Los 8 workflows

| # | Workflow | Se dispara con |
|---|---|---|
| 01 | **Router de mensajes** — identifica o registra al cliente, revisa si hay un estado pendiente y clasifica la intención | Webhook de Evolution API |
| 02 | **Triaje de síntomas** — clasifica urgencia con contexto clínico y responde o escala | wf 01 (intención "síntoma") |
| 03 | **Consulta de historial** — arma una respuesta legible sobre la mascota | wf 01 (intención "historia clínica") |
| 04 | **Ofrecer turno** — calcula slots libres y manda las opciones | wf 01 o wf 02 |
| 05 | **Confirmación de turno** — confirma, crea el evento en Calendar y el registro en `turnos` | wf 01 con estado `esperando_eleccion_horario` |
| 06 | **Seguimiento post-turno** — pregunta cómo sigue la mascota a las 48hs | Schedule Trigger diario |
| 07 | **Recordatorios** — avisa vacunas y controles próximos a vencer | Schedule Trigger, 9am |
| 08 | **Alerta urgente** — resume el caso y notifica al equipo | wf 02 con clasificación 🔴 |

El router mantiene el estado de cada charla en la tabla `conversaciones`
(`esperando_confirmacion_turno`, `esperando_eleccion_horario`, …): n8n no tiene
memoria entre ejecuciones, así que esa fila es la máquina de estados del bot.

### Modelo de datos

```
clientes 1───N mascotas          mascotas 1───N historia_clinica
clientes 1───1 conversaciones    mascotas 1───N consultas
clientes 1───N mensajes          mascotas 1───N recordatorios

consultas 1───0/1 turnos         turnos 1───N seguimientos
consultas 1───0/1 alertas        turnos 1───0/1 historia_clinica
```

Más `horarios_atencion`, `excepciones_horario` y `configuracion_general`:
tablas de configuración global sin FKs, para que el horario de la clínica, los
feriados y parámetros como `duracion_turno_minutos` se editen sin tocar los
workflows.

Dos distinciones que importan: `conversaciones` es estado mutable (una fila por
cliente que se sobreescribe) mientras que `mensajes` es el log que se acumula; y
`consultas` es el registro de lo que hizo el bot, separado de
`historia_clinica`, que es el registro médico real.

Detalle campo por campo, con el porqué de cada uno, en
[`docs/vetbot-arquitectura-completa.md`](docs/vetbot-arquitectura-completa.md).

## Estructura del repo

```
docs/       arquitectura completa, división de tareas y el flujo end-to-end en HTML
workflows/  workflows de n8n
panel/      panel React — ver panel/README.md para arrancarlo
```

## Documentación

- [`docs/vetbot-arquitectura-completa.md`](docs/vetbot-arquitectura-completa.md)
  — los 8 workflows paso a paso y el modelo de datos con la justificación de
  cada campo.
- [`docs/vetbot-division-tareas.md`](docs/vetbot-division-tareas.md) — split del
  trabajo entre 3 devs (conversación/IA, agenda/datos, panel), dependencias y
  por qué no hay backend propio.
- [`docs/vetbot-flujo-completo.html`](docs/vetbot-flujo-completo.html) —
  diagrama del recorrido end-to-end, de un mensaje de WhatsApp hasta el turno
  agendado.
- [`panel/README.md`](panel/README.md) — arranque, rutas y convenciones del
  frontend.

## Estado

En construcción. El panel está en estado template: routing, layout, tipos y
capa de datos armados, con las pantallas por implementar (cada página lleva su
contrato documentado arriba de todo).
