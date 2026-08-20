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
