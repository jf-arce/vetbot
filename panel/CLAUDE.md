# CLAUDE.md

Guía para trabajar en este repo. Complementa el `README.md` (arranque, rutas,
pendientes) — acá va lo que hay que saber **antes de escribir código**.

## Qué es esto

Panel interno de VetBot (asistente veterinario por WhatsApp). Muestra turnos,
mascotas, alertas de urgencia y las conversaciones del bot.

**No hay backend propio.** El panel lee Supabase directo desde el navegador con
la key `anon`; los workflows de n8n son los que escriben la mayoría de los
datos. Contexto completo en `../docs/vetbot-arquitectura-completa.md` y
`../docs/vetbot-division-tareas.md`.

Estado actual: **template**. Routing, layout, tipos y capa de datos listos; las
páginas están vacías. Cada página abre con un comentario
`─── CONTRATO DEL MÓDULO ───` que dice qué lee, qué muestra y qué acciones
tiene. **Leer ese contrato antes de implementar una pantalla.**

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo (Vite) |
| `npm run build` | `tsc -b` + build de producción |
| `npm run lint` | ESLint |

No hay suite de tests. Después de un cambio no trivial, correr `npm run build`:
`noUnusedLocals` y `noUnusedParameters` están activos, así que un import de más
rompe el build (y `npm run dev` no lo detecta).

## Stack

React 19 · TypeScript · Vite 8 · Tailwind v4 · shadcn/ui estilo `base-nova`
sobre **Base UI** · React Router v8 · `@supabase/supabase-js` · `date-fns` ·
`lucide-react` · `sonner`

## Arquitectura

```
src/
  App.tsx                  árbol de rutas y nada más (sin lógica)
  main.tsx                 <BrowserRouter>
  routes/paths.ts          RUTAS + helpers (rutaMascota, rutaConversacion)
  layouts/AppLayout.tsx    sidebar + <Outlet /> + providers globales
  components/
    layout/                AppSidebar, PageHeader
    common/                EmptyState, ErrorState
    ui/                    shadcn — generado, no editar a mano
  pages/<modulo>/          una carpeta por módulo, contrato arriba de todo
  services/                acceso a datos: una función por caso de uso
  lib/supabase.ts          getSupabase() + helper desempaquetar()
  types/db.ts              tipos de las entidades del schema
```

Flujo de datos: **página → service → `getSupabase()` → Postgres**. Nada se
saltea un eslabón.

## Convenciones (no negociables)

- **Importar de `react-router`, nunca de `react-router-dom`.** Desde v7 el
  paquete está unificado y `react-router-dom` quedó deprecado.
- **shadcn acá es la variante Base UI, no Radix**: se usa
  `render={<Elemento />}`, no `asChild`. Si el render devuelve un `<a>` (p. ej.
  un `<Link>`), el `Button` necesita además `nativeButton={false}`.
- **Ningún componente importa `supabase` directo.** Todo pasa por
  `src/services/`; si falta una consulta, se agrega ahí.
- **Ninguna URL hardcodeada.** Siempre `RUTAS.x` o los helpers de
  `src/routes/paths.ts`.
- **Los agregados se calculan en Postgres**, no en el frontend: vista o RPC
  (coordinar con Dev 2). Nada de traer filas para contarlas en JS.
- **Nunca la key `service_role` en el frontend.** El panel corre en el
  navegador: la seguridad real son las policies de RLS.
- `desempaquetar()` convierte el `{ data, error }` de Supabase en "datos o
  throw", que es lo que las páginas esperan para poder mostrar `<ErrorState />`.
- El código y los comentarios están **en español**, igual que los nombres del
  schema (`turnos`, `mascotas`, `fecha_hora`). Mantener ese idioma.
- Sin `.env` el panel tiene que poder navegarse igual: el error de credenciales
  salta recién cuando una página pide datos. No validar al importar módulos.

## Agregar una sección

1. Constante en `src/routes/paths.ts`
2. Página en `src/pages/<modulo>/`
3. `<Route>` en `src/App.tsx`
4. Ítem en `src/components/layout/AppSidebar.tsx`

## Trampas conocidas

- Los `select` con joins (`mascota:mascotas(...)`) dependen de cómo queden los
  nombres de las FKs en el DDL final. Si una consulta devuelve `null` en la
  relación, es eso.
- `src/types/db.ts` es un espejo **manual** del doc de arquitectura. Cuando el
  schema esté cerrado, reemplazarlo por `npx supabase gen types typescript` y
  tipar el cliente: `createClient<Database>(...)`.
- Falta la RPC `metricas_dashboard` (ver `src/services/dashboard.ts`).
- Cancelar un turno y reenviar un recordatorio **no** van contra Supabase:
  tocan Google Calendar y WhatsApp, así que salen por webhook de n8n. Ver los
  TODO en `services/turnos.ts` y `services/recordatorios.ts`.
- Todavía no hay librería de data fetching. Antes de llenar las pantallas de
  `useEffect`, evaluar TanStack Query.
