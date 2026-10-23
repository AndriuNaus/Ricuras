# Contexto del Proyecto - Ricuras de Sal y Dulce

## Stack y Arquitectura
- **Frontend:** Next.js 14+ (App Router) + TypeScript + Tailwind CSS
- **Backend:** Next.js API Routes (serverless) + Supabase (PostgreSQL + Auth + Storage)
- **Deploy:** Vercel (auto-deploy on push to `main`)
- **Auth:** Supabase Auth con roles: `usuario`, `admin`, `superadmin` (tabla `profiles`)
- **DB:** Supabase PostgreSQL con RLS habilitado en todas las tablas

## Paleta Institucional (tokens Tailwind)
- `brand-espresso` `#2B1B17` — texto principal, fondos oscuros
- `brand-terracotta` `#C86D3B` — acentos, botones primarios, bordes focus
- `brand-cream` `#F5E6D3` — fondos claros, tarjetas
- `brand-latte` `#E8D5C4` — bordes suaves, hover
- `brand-latte-border` `#DCC4B0` — bordes
- `brand-mint` `#A8D5BA` — éxito, estados positivos
- `brand-mint-dark` `#7AB88F` — hover éxito

## Rutas Principales
| Ruta | Descripción |
|------|-------------|
| `/` | Landing pública |
| `/login` | Login con redirección por rol |
| `/admin` | Dashboard admin (layout sidebar) |
| `/admin/empleados` | CRUD operarios + cargo selector |
| `/admin/asistencia` | Marcación manual + cámara |
| `/admin/asignacion-v2` | **Planificador v2** (día/semana/mes, drag&drop) |
| `/admin/tareas` | Planificador v1 (legacy, mantener) |
| `/admin/reportes` | Export CSV + print PDF |
| `/admin/configuracion` | Superadmin: zonas + gestión admins |
| `/api/health` | Health check Supabase |

## Asignación v2 — Estado Actual (2026-10-23)
- **En memoria** (`assignments` state). **No persiste en BD** (se pierde al recargar).
- **Tarjetas:** gradiente `linear-gradient(135deg, color, shadeColor(color,-28))`, avatar iniciales, nombre operario, zona, jornada `J{idx} · HH:MM–HH:MM`, notas, acciones hover (grip, duplicar, eliminar).
- **Color editable:** selector `<input type="color">` en modal; al cambiar zona, hereda `zone.color_hex`.
- **Múltiples jornadas:** form `shifts[]` con botón "Agregar jornada", presets (Mañana/Tarde/Completa), inputs time editables.
- **Drag & drop:** `handleDragStart/handleDrop` entre celdas (semana/mes).
- **Duplicar:** `duplicateToNextDay(id)` crea copia en día siguiente.
- **Replicar:** `saveShifts(true)` copia a todos los días visibles.
- **Vistas:** Día (1 col), Semana (7 cols, semana actual lunes-dom), Mes (grid 6×7 semanas tipo Google Calendar).

## Próximo Paso Crítico: Persistencia
Crear tabla `task_assignments` en Supabase con RLS:
```sql
create table public.task_assignments (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  employee_id uuid references public.profiles(id) not null,
  zone_id uuid references public.zones(id) not null,
  start_time time not null,
  end_time time not null,
  notes text,
  color_hex text default '#C86D3B',
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);
alter table public.task_assignments enable row level security;
-- RLS: admins ven todo, superadmin todo, usuarios solo propios (según rol en profiles)
```

## Variables de Entorno (`.env.local` — no commitear)
```
NEXT_PUBLIC_SUPABASE_URL=https://fpoexfmiluqnvzgshtgw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## Referencias Visuales
- Carpeta: `.agents/Fotos/`
- Imagen referencia tarjetas: `Captura desde 2026-10-23 12-49-37.png` (morado/violeta, tarjeta redondeada con avatar, texto blanco)

## Contactos / Enlaces
- GitHub: `https://github.com/AndriuNaus/Ricuras`
- Supabase: `https://fpoexfmiluqnvzgshtgw.supabase.co`
- Vercel: proyecto conectado al repo (auto-deploy on push)