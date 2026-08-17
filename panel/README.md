# VetBot — Panel

Panel interno de la clínica: turnos, mascotas, alertas de urgencia y auditoría
de las conversaciones del bot. Lee la base de Supabase **directo desde el
navegador** — no hay backend propio (ver `docs/vetbot-division-tareas.md`).

Este repo está en estado **template**: el routing, el layout, los tipos y la
capa de datos están armados; las pantallas están vacías. Cada página tiene
arriba un comentario `─── CONTRATO DEL MÓDULO ───` que dice qué lee, qué
muestra y qué acciones tiene. **Empezá por ahí.**

## Stack

React 19 · TypeScript · Vite · Tailwind v4 · shadcn/ui (estilo `base-nova`,
sobre **Base UI**) · React Router v8 · `@supabase/supabase-js`

## Arranque

```bash
npm install
cp .env.example .env    # completar con la URL y la anon key de Supabase
npm run dev
```

Sin `.env` el panel levanta y se navega igual: el error de credenciales salta
recién cuando una página pide datos.

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | `tsc -b` + build de producción |
| `npm run lint` | ESLint |

## Rutas

| Ruta | Página | Lee |
|---|---|---|
| `/` | Dashboard | métricas (RPC), alertas, turnos, mensajes |
| `/turnos` | Turnos del día y próximos | `turnos`, `mascotas`, `clientes`, `consultas` |
| `/mascotas` | Listado de pacientes | `mascotas`, `clientes` |
| `/mascotas/:mascotaId` | Ficha + historia clínica | `historia_clinica`, `turnos`, `recordatorios` |
| `/alertas` | Urgencias 🔴 del triaje (wf 08) | `alertas`, `consultas` |
| `/seguimientos` | Control 48hs post-turno (wf 06) | `seguimientos`, `turnos` |
| `/conversaciones` | Feed de mensajes | `mensajes`, `clientes` |
| `/conversaciones/:clienteId` | Hilo completo + estado del bot | `mensajes`, `conversaciones` |
| `/configuracion/horarios` | Horario semanal | `horarios_atencion` |
| `/configuracion/excepciones` | Feriados y cierres | `excepciones_horario` |
| `/configuracion/general` | Parámetros clave-valor | `configuracion_general` |

`/configuracion` redirige a `/configuracion/horarios`. Cualquier otra URL cae
en el 404.

## Estructura

```
src/
  App.tsx                    árbol de rutas (y nada más)
  main.tsx                   <BrowserRouter>
  routes/paths.ts            constantes y helpers de URL
  layouts/AppLayout.tsx      sidebar + <Outlet /> + providers globales
  components/
    layout/                  AppSidebar, PageHeader
    common/                  EmptyState, ErrorState
    ui/                      shadcn — generado, no editar a mano
  pages/<modulo>/            una carpeta por módulo
  services/                  acceso a datos, una función por caso de uso
  lib/supabase.ts            cliente de Supabase + helper `desempaquetar`
  types/db.ts                tipos de las entidades del schema
```

## Convenciones

- **Importar de `react-router`, nunca de `react-router-dom`.** Desde v7 el
  paquete está unificado; `react-router-dom` quedó deprecado.
- **shadcn de este proyecto es la variante Base UI**: se usa
  `render={<Elemento />}`, no el `asChild` de Radix. Si el render devuelve un
  `<a>` (por ejemplo un `<Link>`), el `Button` necesita además
  `nativeButton={false}`.
- **Ningún componente importa `supabase` directo**: todo pasa por
  `src/services/`. Si falta una consulta, se agrega ahí.
- **Ninguna URL hardcodeada**: se usa `RUTAS` / `rutaMascota()` de
  `src/routes/paths.ts`.
- **Los agregados se calculan en Postgres**, no en el frontend: para las
  métricas del dashboard va una vista o una función RPC (coordinar con Dev 2).
- `noUnusedLocals` y `noUnusedParameters` están activos: un import de más
  rompe el build.
- Agregar una sección = ruta en `paths.ts` → página en `pages/` → `<Route>` en
  `App.tsx` → ítem en `AppSidebar.tsx`.

## Pendiente antes de conectar a datos reales

1. **Tipos**: `src/types/db.ts` es un espejo manual del schema del doc de
   arquitectura. Cuando Dev 2 cierre el DDL, reemplazarlo por
   `npx supabase gen types typescript` y tipar el cliente:
   `createClient<Database>(...)`.
2. **Nombres de las relaciones**: los `select` con joins
   (`mascota:mascotas(...)`) dependen de cómo queden las FKs. Ajustar si no
   matchean.
3. **Métricas del dashboard**: falta la RPC `metricas_dashboard` — ver
   `src/services/dashboard.ts`.
4. **Webhooks de n8n**: cancelar un turno y reenviar un recordatorio no van
   contra Supabase (tocan Google Calendar y WhatsApp). Faltan las URLs que
   expone Dev 2 — ver los TODO en `services/turnos.ts` y
   `services/recordatorios.ts`.
5. **RLS**: el panel usa la key `anon` pública, así que la seguridad real son
   las policies de Postgres. La `service_role` nunca va en el frontend.
6. **Fetching**: hoy no hay librería de data fetching. Para caché,
   revalidación y estados de carga conviene sumar TanStack Query antes de que
   se llenen las pantallas de `useEffect`.
