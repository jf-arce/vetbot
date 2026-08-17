# VetBot — Arquitectura completa

## Stack

| Capa | Tecnología |
|---|---|
| WhatsApp | Evolution API |
| Orquestador | n8n (self-hosted o cloud) |
| IA | Claude API (HTTP Request node) |
| Base de datos | **A definir** — relacional (Postgres/Supabase/MySQL/etc). El diseño de abajo es agnóstico del motor. |
| Agenda | Google Calendar (nodo nativo n8n) |
| Cron | Schedule Trigger (nativo n8n) |
| Panel | React + Vite + Tailwind |

---

## Flujo completo, workflow por workflow

### 01 — Mensaje entrante (router)

**Dispara:** webhook de Evolution API por cada mensaje entrante.

**Pasos:**
1. Busca `cliente` por `telefono` en la DB.
2. Si no existe → sub-flujo de **registro**: pide nombre del dueño, luego nombre/especie/raza de la mascota → crea `cliente` + `mascota`.
3. Con el cliente ya identificado, revisa si hay una `conversacion` con estado pendiente (ej: `esperando_confirmacion_turno`, `esperando_eleccion_horario`) → si hay, interpreta la respuesta en ese contexto y salta directo al workflow correspondiente (04/05), sin pasar por clasificación de intención.
4. Si no hay estado pendiente → clasifica la intención del mensaje por IA en una de 4 categorías:
   - **Turno directo** → dispara wf 04
   - **Historia clínica** → dispara wf 03
   - **Síntoma** → dispara wf 02
   - **Otro** (cuidados, comida, baño, etc.) → responde con consejo general vía Claude, sin workflow separado

**Entidades que toca:** `clientes` (lectura/creación), `mascotas` (creación si es alta nueva), `conversaciones` (lectura de estado).

---

### 02 — Triaje de síntomas

**Dispara:** wf 01 cuando detecta intención "síntoma".

**Pasos:**
1. Busca `historia_clinica` de la mascota (si tiene) → arma contexto.
2. HTTP Request a Claude con: síntoma descripto + contexto de historia clínica + criterios de la clínica.
3. Claude clasifica: 🟢 baja / 🟡 media / 🔴 alta.
4. Ramas fijas:
   - 🟢🟡 → responde consejo + pregunta de cierre ofreciendo turno opcional → guarda `conversacion.estado = esperando_confirmacion_turno`
   - 🔴 → responde indicando que se acerque + dispara wf 08 (alerta urgente)
5. Guarda el registro en `consultas`.

**Entidades:** `historia_clinica` (lectura), `consultas` (creación), `conversaciones` (actualización de estado).

---

### 03 — Consulta de historial

**Dispara:** wf 01 cuando detecta intención "historia clínica".

**Pasos:**
1. Busca `mascota` del cliente (si tiene varias, pregunta cuál).
2. Trae `historia_clinica` asociada.
3. HTTP Request a Claude con el historial como contexto → genera respuesta personalizada y legible (no un volcado de datos crudos).

**Entidades:** `mascotas` (lectura), `historia_clinica` (lectura).

---

### 04 — Ofrecer turno / agenda

**Dispara:** wf 01 (intención "turno directo") o wf 02 (dueño acepta turno opcional).

**Pasos:**
1. Lee `horarios_atencion` (día de la semana correspondiente), `excepciones_horario` (feriados o cierres puntuales dentro del rango) y `configuracion_general` (`duracion_turno_minutos`, `dias_anticipacion`, `turnos_a_mostrar`).
2. Google Calendar node → `Get Many` o `Free/Busy` sobre el rango de `dias_anticipacion`.
3. Function node → cruza horario base − excepciones − ocupado en Calendar → arma la lista completa de slots libres, ordenados cronológicamente.
4. Selecciona los primeros `turnos_a_mostrar` de esa lista — los slots libres más próximos en el tiempo, ordenados cronológicamente. No hace falta lógica extra para priorizar casos de urgencia media: al ya ofrecer siempre los más próximos disponibles, ese caso queda cubierto por defecto.
5. Formatea esas opciones → envía por Evolution API.
6. Guarda `conversacion.estado = esperando_eleccion_horario`.

**Entidades:** `horarios_atencion` (lectura), `excepciones_horario` (lectura), `configuracion_general` (lectura), `conversaciones` (actualización). No toca `turnos` todavía — eso es en el 05.

---

### 05 — Confirmación de turno

**Dispara:** wf 01 cuando detecta que la respuesta matchea el patrón de un horario ofrecido, con estado `esperando_eleccion_horario`.

**Pasos:**
1. Repite la elección en texto claro: *"Confirmás turno para [mascota] el [fecha] a las [hora]?"* — antes de crear nada. Esto evita el edge case de que un mensaje viejo sin relación haya matcheado el patrón por coincidencia.
2. Si confirma → Google Calendar node → `Create Event` (con mascota, motivo, teléfono en la descripción).
3. Crea registro en `turnos`, guardando el `calendar_event_id` devuelto.
4. Limpia `conversacion.estado` (vuelve a libre).
5. Confirma por WhatsApp.
6. Si no confirma → cancela, limpia `conversacion.estado`, no crea nada.

**Entidades:** `turnos` (creación), `conversaciones` (actualización).

---

### 06 — Seguimiento post-turno

**Dispara:** Schedule Trigger, corre diario, busca `turnos` con `fecha_hora` = hace 48hs y `estado = atendido`.

**Pasos:**
1. Por cada turno encontrado, crea un registro en `seguimientos` (`estado = pendiente`).
2. Envía WhatsApp preguntando cómo sigue la mascota.
3. La respuesta del dueño (capturada por wf 01 con lógica similar a los otros estados pendientes) actualiza el `seguimiento` con la respuesta y cambia `estado = respondido`.
4. Si no hay respuesta en X días → queda `sin_respuesta`, visible en el dashboard como alerta liviana.

**Entidades:** `turnos` (lectura), `seguimientos` (creación/actualización).

---

### 07 — Recordatorios

**Dispara:** Schedule Trigger, corre todos los días a las 9am.

**Pasos:**
1. Busca en `recordatorios` los que vencen en los próximos 7 días y `enviado = false`.
2. Loop de items → Evolution API → manda WhatsApp proactivo a cada dueño.
3. Marca `enviado = true`, guarda `fecha_envio`.

**Entidades:** `recordatorios` (lectura/actualización), `mascotas` (para datos del mensaje), `clientes` (teléfono).

---

### 08 — Alerta urgente *(nuevo)*

**Dispara:** wf 02 cuando la clasificación es 🔴.

**Pasos:**
1. Crea registro en `alertas` con el resumen del caso generado por Claude.
2. Notifica al equipo (WhatsApp/Telegram/email) con ese resumen.
3. El registro queda visible en el dashboard (sección Alertas) hasta que un humano lo marca como atendido.

**Entidades:** `alertas` (creación), `consultas` (referencia al triaje que la disparó).

---

## Entidades y análisis de propiedades

### `clientes`
El dueño de la mascota — es quien escribe por WhatsApp.

| Campo | Tipo | Por qué |
|---|---|---|
| `id` | PK | — |
| `nombre` | texto | Personalizar mensajes |
| `telefono` | texto, único, indexado | Es la clave de matcheo en cada mensaje entrante — el campo más consultado del sistema |
| `email` | texto, opcional | Para notificaciones fuera de WhatsApp si hace falta |
| `direccion` | texto, opcional | Solo si en algún momento ofrecés visitas a domicilio |
| `estado` | enum (activo/inactivo) | Para poder "dar de baja" sin borrar historial |
| `created_at` | timestamp | — |

### `mascotas`
| Campo | Tipo | Por qué |
|---|---|---|
| `id` | PK | — |
| `cliente_id` | FK | — |
| `nombre` | texto | — |
| `especie` | texto/enum | Perro, gato, otro — afecta triaje y dosis |
| `raza` | texto, opcional | Algunas razas tienen predisposiciones médicas relevantes para el triaje |
| `fecha_nacimiento` | fecha, opcional | Edad exacta importa para dosis y urgencia (cachorro vs adulto) |
| `sexo` | enum | Relevante clínicamente |
| `peso` | numérico | Crítico para cualquier indicación de medicación |
| `esterilizado` | booleano | Relevante en varios cuadros clínicos |
| `estado` | enum (activo/fallecido) | Para dejar de mandar recordatorios automáticamente sin borrar el historial |
| `notas_generales` | texto, opcional | Alergias conocidas, condiciones crónicas — útil como contexto rápido para Claude en cada triaje |

### `conversaciones`
Es el estado volátil de la charla — lo que le permite al router saber "qué está esperando" de cada cliente. **No es un historial**: es el puntero al estado *actual*, una fila por cliente que se sobreescribe en cada cambio (n8n no tiene memoria propia entre ejecuciones, así que esto hace ese papel). No se acumula — mutable, no un log.

| Campo | Tipo | Por qué |
|---|---|---|
| `id` | PK | — |
| `cliente_id` | FK, único (una conversación activa por cliente) | — |
| `estado` | enum (libre, esperando_confirmacion_turno, esperando_eleccion_horario, esperando_datos_registro, esperando_respuesta_seguimiento) | El corazón de la máquina de estados del router |
| `contexto` | JSON | Datos parciales mientras dura un flujo multi-paso (ej: mascota a medio registrar, turno a medio confirmar) |
| `updated_at` | timestamp | Para poder expirar estados viejos (ej: si no responde en 24hs, resetear a libre) |

### `mensajes`
El log real de la charla — a diferencia de `conversaciones`, esta tabla sí se acumula siempre. Es la que alimenta el feed de "últimas conversaciones" del dashboard.

| Campo | Tipo | Por qué |
|---|---|---|
| `id` | PK | — |
| `cliente_id` | FK | — |
| `direccion` | enum (entrante/saliente) | Distingue lo que escribió el dueño de lo que respondió el bot |
| `contenido` | texto | — |
| `timestamp` | timestamp | Orden cronológico del feed |

### `historia_clinica`
El registro médico real — distinto de `consultas`, que es el log de interacciones del bot.

| Campo | Tipo | Por qué |
|---|---|---|
| `id` | PK | — |
| `mascota_id` | FK | — |
| `turno_id` | FK, opcional | Si la entrada nace de un turno atendido en persona |
| `fecha` | fecha | — |
| `tipo` | enum (consulta, vacuna, cirugia, tratamiento, control) | Para poder filtrar y para lógica de recordatorios (ej: vacunas) |
| `diagnostico` | texto | — |
| `tratamiento_indicado` | texto | — |
| `peso_registrado` | numérico, opcional | Permite trackear evolución de peso en el tiempo |
| `veterinario` | texto o FK a tabla `veterinarios` si hay varios | Trazabilidad de quién atendió |
| `adjuntos` | array de URLs, opcional | Estudios, radiografías |
| `notas` | texto, opcional | — |

### `consultas`
El log de cada interacción de triaje del bot — separado de la historia clínica real.

| Campo | Tipo | Por qué |
|---|---|---|
| `id` | PK | — |
| `mascota_id` | FK, opcional (puede no estar identificada aún) | — |
| `conversacion_id` | FK | — |
| `mensaje_original` | texto | El síntoma tal cual lo describió el dueño |
| `clasificacion` | enum (baja/media/alta) | — |
| `consejo_generado` | texto | Lo que devolvió Claude, para poder auditar después |
| `created_at` | timestamp | — |

### `turnos`
| Campo | Tipo | Por qué |
|---|---|---|
| `id` | PK | — |
| `mascota_id` | FK | — |
| `cliente_id` | FK | — |
| `consulta_id` | FK, opcional | Si el turno nació de un triaje |
| `calendar_event_id` | texto | El puente hacia el evento real en Google Calendar |
| `fecha_hora` | timestamp | — |
| `motivo` | texto | — |
| `estado` | enum (pendiente, confirmado, atendido, cancelado, no_asistio) | Para filtrar el dashboard y para que wf 06 sepa a qué turnos hacer seguimiento |
| `created_at` | timestamp | — |

### `seguimientos`
| Campo | Tipo | Por qué |
|---|---|---|
| `id` | PK | — |
| `turno_id` | FK | — |
| `fecha_programada` | fecha | Cuándo debe dispararse (48hs post turno) |
| `respuesta` | texto, opcional | — |
| `fecha_respuesta` | timestamp, opcional | — |
| `estado` | enum (pendiente, respondido, sin_respuesta) | — |

### `recordatorios`
| Campo | Tipo | Por qué |
|---|---|---|
| `id` | PK | — |
| `mascota_id` | FK | — |
| `tipo` | enum (vacuna, desparasitacion, control) | — |
| `fecha_vencimiento` | fecha | — |
| `enviado` | booleano | — |
| `fecha_envio` | timestamp, opcional | — |

### `alertas`
| Campo | Tipo | Por qué |
|---|---|---|
| `id` | PK | — |
| `consulta_id` | FK | Referencia al triaje que la disparó |
| `mascota_id` | FK | — |
| `cliente_id` | FK | — |
| `resumen_caso` | texto | Lo que generó Claude, para que el veterinario no tenga que leer toda la charla |
| `estado` | enum (pendiente, atendido) | — |
| `atendido_por` | texto, opcional | — |
| `created_at` | timestamp | — |

### `veterinarios` *(opcional — solo si la clínica tiene más de uno)*
| Campo | Tipo | Por qué |
|---|---|---|
| `id` | PK | — |
| `nombre` | texto | — |
| `telefono` | texto | Para las notificaciones del wf 08 dirigidas a quien está de turno |
| `activo` | booleano | — |

### `horarios_atencion`
El horario de la clínica como dato editable, no hardcodeado en el workflow.

| Campo | Tipo | Por qué |
|---|---|---|
| `id` | PK | — |
| `dia_semana` | enum (lunes...domingo) | Permite horarios distintos por día (ej: sábado medio día) |
| `hora_apertura` | time | — |
| `hora_cierre` | time | — |
| `activo` | booleano | Marca un día como cerrado sin borrar la fila (ej: domingo `activo=false`) |

### `excepciones_horario`
Feriados o cierres puntuales que no siguen el patrón semanal habitual.

| Campo | Tipo | Por qué |
|---|---|---|
| `id` | PK | — |
| `fecha` | fecha | — |
| `cerrado` | booleano | Feriado completo |
| `hora_apertura` | time, opcional | Si ese día abre distinto (ej: 24/12 medio día) en vez de cerrado total |
| `hora_cierre` | time, opcional | — |
| `motivo` | texto, opcional | Para mostrar en el dashboard por qué ese día no hay turnos |

### `configuracion_general`
Parámetros globales del sistema, editables sin tocar el workflow.

| Campo | Tipo | Por qué |
|---|---|---|
| `clave` | texto, PK | Formato clave-valor para no tener que migrar el schema cada vez que se suma un parámetro nuevo |
| `valor` | texto | Se castea según la clave |

Claves usadas hasta ahora:

| Clave | Valor ejemplo | Para qué |
|---|---|---|
| `duracion_turno_minutos` | `"30"` | Tamaño de cada bloque al calcular huecos libres |
| `dias_anticipacion` | `"7"` | Hasta cuántos días a futuro se consulta disponibilidad |
| `turnos_a_mostrar` | `"4"` | Cuántas opciones de horario se le ofrecen al cliente en un mismo mensaje |

---

## Relaciones (resumen)

```
clientes 1───N mascotas
clientes 1───1 conversaciones
clientes 1───N mensajes
mascotas 1───N historia_clinica
mascotas 1───N consultas
mascotas 1───N recordatorios
consultas 1───0/1 turnos
consultas 1───0/1 alertas
turnos 1───N seguimientos
turnos 1───0/1 historia_clinica   (la visita generó un registro médico)
```

**Conexión con Google Calendar:** no es una relación de base de datos — es el campo `turnos.calendar_event_id`, que apunta a un recurso externo. Ninguna otra entidad sabe que Calendar existe.

**Tablas de configuración** (`horarios_atencion`, `excepciones_horario`, `configuracion_general`): no tienen FKs hacia el resto del modelo — son datos globales de la clínica, no ligados a un cliente ni a una mascota. Las consulta directamente el wf 04 antes de calcular disponibilidad.
