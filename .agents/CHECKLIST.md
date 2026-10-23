## Tarea Pendiente Posterior: Galeria Multimedia
- [ ] Integracion y carga de galeria multimedia completa (videos y fotografias en alta resolucion provenientes de redes sociales o almacenamiento en la nube)

## Fase 1: Fundacion y Landing (COMPLETADA)
- [x] Next.js 14+ App Router + TypeScript + Tailwind
- [x] Paleta institucional y tokens de diseño
- [x] Clientes Supabase (browser, server, middleware)
- [x] Esquema SQL + RLS (`supabase/migrations/001_initial_schema.sql`)
- [x] Landing Page: Hero, Especialidades, Café, Sedes, Galería, Footer
- [x] Login con redirección por rol
- [x] Middleware protección `/admin` y `/login`
- [x] Vercel deploy + variables de entorno

## Fase 2: Panel Administrativo y Gestion de Personal
- [x] Diseno del panel de administracion adaptado a pantallas moviles y escritorio
- [x] Gestion de personal (listado, alta y edicion de colaboradores) — `/admin/empleados`
- [x] Gestion de zonas del establecimiento — `/admin/configuracion` (superadmin)
- [x] API employees CRUD + roles (admin/superadmin)
- [x] API zones CRUD

## Fase 3: Modulo de Registro de Asistencia
- [x] Sistema de marcacion manual rapida por colaborador — `/admin/asistencia`
- [x] Sistema de marcacion mediante camara web integrada
- [x] Registro historico de asistencias con filtros por fecha, mes y colaborador
- [x] Validacion de alternancia logica de jornadas (entrada y salida)
- [x] API attendance GET/POST con persistencia
- [x] Export CSV + Print-to-PDF en `/admin/reportes`

## Fase 4: Programacion y Asignacion de Tareas
- [x] Planificador de asignaciones diarias y semanales por zona operativa — `/admin/asignacion-v2`
- [x] Vistas: Día / Semana actual / Mes (calendario tipo Google Calendar)
- [x] Tarjetas visuales estilo referencia (gradiente, avatar iniciales, zona, jornada J1/J2, notas)
- [x] Múltiples jornadas por operario y día (J1 08:00–12:00, J2 18:00–22:00)
- [x] Horarios custom editables + presets rápidos
- [x] Color de tarjeta editable (selector en modal + hereda de zona)
- [x] Drag & drop tarjetas entre días
- [x] Duplicar tarjeta al día siguiente (hover)
- [x] Replicar día a toda la semana / todos los días del mes
- [x] Terminología: "Colaborador" → "Operario"
- [ ] Generador de imagen grafica exportable de tareas para distribucion por mensajeria
- [ ] **PENDIENTE:** Persistencia en Supabase (tabla `task_assignments` + RLS)

## Fase 5: Reportes y Exportables
- [x] Generacion y descarga de reportes en formato Excel (CSV) — `/admin/reportes`
- [x] Generacion de reportes en formato PDF (imprimir navegador)

## Fase 6: Integracion de Bot de WhatsApp
- [ ] Configuracion de Meta WhatsApp Cloud API y recepcion por webhook
- [ ] Verificacion de marcaciones con geolocalizacion y fotografia

## Fase 7: Despliegue y Puesta en Produccion
- [x] Despliegue en Vercel y configuracion de variables de entorno de produccion
- [ ] Push a main → Vercel auto-deploy verificado
- [ ] Auditoria de seguridad, accesibilidad y rendimiento movil
- [ ] Rate limiting / firewall para bots (Vercel Firewall / Upstash / Cloudflare)
- [ ] Headers de seguridad en `next.config.mjs` (ya añadidos)