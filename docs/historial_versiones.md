# Historial de Versiones — Frontend VetBot

Registro de versiones y actualizaciones del frontend del proyecto.

---

## v0.1.0 - Dashboard Principal
**Fecha:** 2026-08-18

- Implementación del layout base del Dashboard utilizando **Tailwind CSS** y componentes de **shadcn/ui**.
- Creación de navegación con paneles laterales ajustables integrando el componente `Resizable`.
- Mejora en la UX del feed de WhatsApp con `HoverCard` para respuestas y previsualizaciones instantáneas (`openDelay={0}`).
- Desarrollo de la interfaz para las Alertas de Urgencia (visuales y sonoras), utilizando un componente `Sheet` como panel lateral para visualizar el detalle de la Historia Clínica.
- Integración del frontend desacoplado, preparándolo para la conexión directa con el SDK nativo de Supabase.

---

## v0.2.0 - Módulo de Turnos
**Fecha:** 2026-08-19

- Creación de `TurnosView` como componente aislado.
- Implementación de tabla dinámica utilizando `@tanstack/react-table`.
- Creación de componentes UI específicos: `BadgePrioridad`, `BadgeEstadoTurno` y menú de acciones desplegable.
- Generación de datos mockeados (`mockTurnos.ts`).
- Integración y enrutado limpio en `TurnosPage.tsx`.

---

## v0.3.0 - Módulo de Mascotas
**Fecha:** 2026-08-20

- **Listado principal (`MascotasListView`):** tabla de pacientes con `Avatar` (tick verde superpuesto para estado `activo`), buscador por mascota/dueño, filtros por Especie y Raza, columna "Última Consulta" y `Badge` de estado. Acciones por fila con botón directo de WhatsApp y un `DropdownMenu` para navegar a la ficha o al formulario de edición.
- **Historia clínica (`MascotaView`):** ficha del paciente con `MascotaHeader` (datos básicos, badges y banner rojo de alerta cuando hay `notas_generales`) y `HistoriaTimeline`, una línea de tiempo de eventos médicos y triajes con color por clasificación de urgencia (borde y fondo del mismo tono, texto del motivo en un tono oscuro en vez de gris genérico) y resalte automático vía `?alerta_id=` en la URL. Sidebar con widgets de "Próximos Recordatorios" y "Gráfico de Peso" (placeholder).
- **Editar perfil (`MascotaEditView`):** formulario en grilla con los campos del schema (nombre, especie, raza, peso, sexo, esterilizado, estado, notas generales), precargado con mock por `id` y con guardado simulado (`console.log` del payload + redirección al listado).
- **Ruteo:** `/mascotas`, `/mascotas/:mascotaId` y `/mascotas/:mascotaId/editar` conectados en `App.tsx`, sin ningún enlace en el Sidebar para las rutas de detalle/edición — solo accesibles desde las acciones de la tabla.
- Datos mockeados dedicados por pantalla (`mockMascotaDetalle.ts`, `mockMascotasEdicion.ts`), a la espera de la conexión real a Supabase.

---

## v0.4.0 - Sincronización de schema, Alertas y Seguimientos (tablero Kanban)
**Fecha:** 2026-08-20

- **Sincronización de `types/db.ts` con el schema real de Supabase** (proyecto "Veterinaria Bot", vía MCP): ids `uuid` en vez de `number`, `mascotas.castrado` (no `esterilizado`), `EstadoMascota` `vivo/fallecido` (no `activo`), enum `Especie` completo (~32 valores, incluye exóticos), `conversaciones.update_at` (typo real de columna). Se ajustaron 7 archivos de `src/services/` en consecuencia, y se corrigieron dos bugs reales que habrían fallado contra la DB real: `services/historiaClinica.ts` apuntaba a la tabla `historia_clinica` (no existe, es `historias_clinicas`) y `services/mensajes.ts` ordenaba por una columna `timestamp` inexistente (es `created_at`).
- **Pendiente de seguridad detectado (sin resolver):** RLS deshabilitado en las 13 tablas de `public` — cualquiera con la key `anon` del panel puede leer/escribir cualquier fila. Requiere definir políticas antes de activarlo (fuera del alcance del panel).
- **Módulo de Alertas (`AlertasView`):** patrón Master-Detail con lista vertical de cards — sin botón "Ver detalle" (toda la card abre el Sheet), borde + fondo difuminado según nivel de triaje (mismo criterio de color que `HistoriaTimeline` de Mascotas), urgencia + tiempo relativo ("Hace 15 min") al costado de la card, y filtro por pills de urgencia (Todas/Alta/Media/Baja). El `Sheet` de detalle muestra resumen de la IA, síntoma original, consejo generado, datos del dueño (con accesos a la conversación y a la ficha de la mascota) y "Marcar como Atendido" simulado. Se descartó el tab "Seguimientos 48hs" dentro de Alertas por duplicar la sección `/seguimientos` que ya existe en el Sidebar.
- **Módulo de Seguimientos, rediseñado como tablero Kanban (`SeguimientosView`):** 3 columnas fijas (Vencidos / Hoy / Mañana) agrupadas por `fecha_programada` relativa a un `DatePicker` en el header (default 20/ago/2026), cada una con scroll independiente (`max-h` + `overflow-y-auto`, scrollbar fina vía *arbitrary properties* de Tailwind) y título sticky. Arriba, 3 KPIs con ícono (Seguimientos hoy, Para completar, Próximos 7 días). Regla de negocio aplicada: el panel es de **auditoría** del bot, no un canal de contacto — sin botón de WhatsApp en la card. Badge de estado del bot (Esperando hora / Consultando... / Sin respuesta / Completado / Pausado). El `Sheet` muestra el resumen de la IA y un hilo de chat simulado estilo WhatsApp entre bot y cliente, con un botón destructivo "Pausar bot y tomar control manual" (simulado — no existe todavía un mecanismo real en el schema para esto).

---

## v0.5.0 - Módulo de Conversaciones (tiempo real) y fixes de runtime
**Fecha:** 2026-08-21

- **Módulo de Conversaciones (`features/conversaciones/`), Master-Detail con datos reales de Supabase:** panel izquierdo con la lista de clientes (avatar, último mensaje, hora relativa, puntito indicador cuando el dueño escribió último y todavía no hay respuesta del bot en la lista) y panel derecho con el hilo completo — burbujas alineadas por `direccion` (dueño izquierda, bot derecha en verde), separadores de día ("Hoy"/"Ayer"), `Badge` con los 6 estados reales de `EstadoConversacion`, franja colapsable con las mascotas del cliente y el `contexto` (JSON) de la conversación. Layout con `ResizablePanelGroup` (paneles redimensionables), reemplazando los dos placeholders (`ConversacionesPage`, `ConversacionDetallePage`) que ya tenían el ruteo (`/conversaciones`, `/conversaciones/:clienteId`) armado desde antes.
- **Primer uso de Supabase Realtime en el repo:** `useConversaciones` (hook único para lista + detalle) abre canales `postgres_changes` sobre `mensajes`/`conversaciones` — la lista se reordena y el hilo/badge se actualizan solos al llegar un mensaje o cambiar el estado del bot, sin recargar la página. Requirió habilitar la publicación `supabase_realtime` en el proyecto de Supabase (estaba vacía, 0 tablas) vía migración.
- **Fallback a datos mockeados (`data/mockConversaciones.ts`):** mismo criterio que Alertas/Seguimientos — si `mensajes`/`conversaciones` no tienen filas reales (o falla la conexión a Supabase), la lista muestra 3 conversaciones de ejemplo con timestamps relativos a "ahora". En cuanto haya una fila real, la tapa automáticamente.
- **Se sacó la caja de "escribir un mensaje"** que había en el diseño inicial (se podía tipear pero no mandaba nada — confuso). Se reemplazó por una franja fija de solo lectura: "El bot responde automáticamente por WhatsApp — este panel es de solo lectura".
- **Dos bugs de runtime reales, encontrados y corregidos durante la verificación en navegador:**
  - `getSupabase()` llamado directo (no dentro de una `async function` de `services/`) dentro de un `useEffect` no capturaba el throw síncrono si faltaban las env vars — sin `ErrorBoundary` en el árbol, eso tiraba abajo **toda la app** (pantalla en blanco), no solo la sección. Se resolvió con `try/catch` alrededor de `getSupabase()` en los dos efectos que abren canales de Realtime.
  - `react-resizable-panels` v4 (la librería detrás de `components/ui/resizable.tsx`) interpreta un `number` en `defaultSize`/`minSize`/`maxSize` como **píxeles**, no porcentaje (hay que pasar `string`) — el panel izquierdo se veía comprimido a ~30px en vez de 30% del ancho.
- Se creó un `.env` local (no commiteado, ya estaba en `.gitignore`) con las credenciales `anon` reales del proyecto "Veterinaria Bot", porque no existía ninguno en el checkout — sin eso, cualquier página que lea Supabase directo iba a fallar.

---

## v0.6.0 - Módulo de Configuración completo (7 tabs)
**Fecha:** 2026-08-22

`/configuracion` ya tenía ruteo y 3 tabs sin implementar (Horarios, Excepciones, General). Esta versión suma 4 tabs nuevas al mismo layout y termina de implementar las 3 que ya existían — quedan las 7 en una sola pantalla, sin duplicar navegación.

- **Apariencia:** selector Claro/Oscuro/Sistema con `next-themes` — la dependencia y el `useTheme()` de `components/ui/sonner.tsx` ya estaban, pero faltaba el `<ThemeProvider>` en la raíz (`main.tsx`). `attribute="class"` matchea el `.dark` de `index.css`; persistencia en localStorage y detección de preferencia del sistema las maneja la librería.
- **Perfil:** no existe una tabla `clinicas`/`usuarios` en el schema real — "nombre de la clínica" y "teléfono principal" se guardan como dos filas más de `configuracion_general` (la misma tabla clave-valor de General). `telefono_veterinario` ya existía con el placeholder `<a completar>` que Dev 1 dejó pendiente en `docs/todo.md`: esta pantalla es la forma real de completarlo. UPDATE real probado contra Supabase.
- **Seguridad:** "Cambiar contraseña" llama a `supabase.auth.updateUser()` de verdad (`services/auth.ts`), no un mock — pero el panel no tiene login todavía (cero uso de `supabase.auth` en el resto del repo), así que hoy falla con "Auth session missing". Queda un aviso explícito en la UI en vez de simular que funciona.
- **Preferencias del Bot:** mock con 2 switches (notificaciones de triaje alto, horario de guardia), estado solo local — no hay tabla en Supabase para esto todavía.
- **Horarios, Excepciones y General, implementadas:**
  - Horarios: tabla de los 6 días reales (`horarios_atencion` no tiene fila de domingo), con validación apertura < cierre. `hora_apertura`/`hora_cierre` son `timetz` (`"HH:mm:ss±TZ"`) — se agregó `lib/horaTz.ts` para convertir contra el `type="time"` del input preservando el offset original (mandar `"HH:mm"` pelado hace que Postgres lo interprete con la zona de la sesión, no la de la fila, y corre el horario 3hs).
  - Excepciones: Dialog con `Calendar` (días pasados deshabilitados) para cargar feriados/cierres puntuales, con confirmación inline antes de eliminar (sin agregar un `AlertDialog` nuevo).
  - General: los 3 parámetros del wf 04 (`duracion_turno_minutos`, `dias_anticipacion`, `turnos_a_mostrar`), validados como enteros positivos: si se guarda texto no numérico, se bloquea el guardado con el campo en rojo. Cualquier otra clave de la tabla que no sea de Perfil se lista igual como texto libre.
- Bug de layout encontrado y corregido: el header de Excepciones usaba `flex` a mano sobre `CardHeader` (que es `grid` por dentro), estirando el botón "Agregar" a lo ancho completo — se resolvió usando el slot `CardAction` que el componente ya expone para esto.
- Todo lo escrito (UPDATE de horarios, INSERT/DELETE de excepciones, upsert de `nombre_clinica`) se probó contra la base real vía datos de prueba insertados y borrados después — las tablas quedaron en el mismo estado en que estaban antes de la sesión.

---
