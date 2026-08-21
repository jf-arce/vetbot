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
