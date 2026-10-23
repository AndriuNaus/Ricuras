# Estado del Proyecto - Ricuras de Sal y Dulce

**Última actualización:** 2026-10-23

## Estado Actual: ✅ LISTO PARA DESPLIEGUE (push pendiente con GitHub Desktop)

### Fase Actual
- Base del proyecto Next.js 14+ (App Router) con TypeScript y Tailwind CSS configurada.
- Paleta institucional y tokens de diseño aplicados.
- Clientes Supabase SSR (Browser, Server y Middleware) estructurados.
- Esquema SQL inicial con RLS y tablas base creado en `supabase/migrations/001_initial_schema.sql`.
- Landing Page pública implementada con secciones: Hero, Especialidades, Café, Sedes, Galería y Footer.
- Módulo de Login con redirección por rol implementado.
- Middleware de protección de rutas `/admin` y `/login` implementado.
- **Asignación v2 (Tabla) completada:** Vista día/semana/mes, drag & drop, tarjetas estilo referencia con gradiente, avatar iniciales, color editable, múltiples jornadas por operario/día, duplicar a día siguiente, replicar a toda la semana.

### Decisiones Tomadas
- **Stack:** Next.js 14+ / Supabase / Vercel
- **Auth:** Supabase Auth con roles en tabla `profiles`
- **Asistencia:** 3 métodos (manual, cámara, WhatsApp futuro)
- **Terminología:** "Colaborador" → "Operario"
- **Persistencia asignaciones:** por ahora en memoria (próximo paso: tabla `task_assignments` en Supabase)

### Próximos Pasos
1. Push a GitHub (GitHub Desktop) → Vercel redeploy automático.
2. Verificar despliegue en producción.
3. Implementar persistencia de `task_assignments` en Supabase (RLS incluido).
4. Continuar Fase 2/3: CRUD zonas, tareas persistentes, reportes, bot WhatsApp.

### Bloqueos
- Push desde CLI sin autenticación GitHub; usar GitHub Desktop.
- Asignaciones v2 se pierden al recargar (sin persistencia en BD aún).

---CHECKLIST---

## Tarea Pendiente Posterior: Galeria Multimedia
- [ ] Integracion y carga de galeria multimedia completa (videos y fotografias en alta resolucion provenientes de redes sociales o almacenamiento en la nube)

## Fase 2: Panel Administrativo y Gestion de Personal
- [x] Diseno del panel de administracion adaptado a pantallas moviles y escritorio
- [x] Gestion de personal (listado, alta y edicion de colaboradores)
- [x] Gestion de zonas del establecimiento (Piso 1, Barra, Cocina, Terraza, etc.)

## Fase 3: Modulo de Registro de Asistencia
- [x] Sistema de marcacion manual rapida por colaborador
- [x] Sistema de marcacion mediante camara web integrada
- [x] Registro historico de asistencias con filtros por fecha, mes y colaborador
- [x] Validacion de alternancia logica de jornadas (entrada y salida)

## Fase 4: Programacion y Asignacion de Tareas
- [x] Planificador de asignaciones diarias y semanales por zona operativa (Asignación v2)
- [x] Tarjetas visuales estilo referencia (gradiente, avatar, jornadas múltiples)
- [x] Drag & drop entre días + duplicar + replicar semana
- [x] Color editable por tarjeta
- [ ] Generador de imagen grafica exportable de tareas para distribucion por mensajeria
- [ ] Persistencia en Supabase (tabla `task_assignments`)

## Fase 5: Reportes y Exportables
- [x] Generacion y descarga de reportes en formato Excel (CSV)
- [x] Generacion de reportes en formato PDF (imprimir navegador)

## Fase 6: Integracion de Bot de WhatsApp
- [ ] Configuracion de Meta WhatsApp Cloud API y recepcion por webhook
- [ ] Verificacion de marcaciones con geolocalizacion y fotografia

## Fase 7: Despliegue y Puesta en Produccion
- [x] Despliegue en Vercel y configuracion de variables de entorno de produccion
- [ ] Auditoria de seguridad, accesibilidad y rendimiento movil
- [ ] Rate limiting / firewall para bots (Vercel Firewall / Upstash / Cloudflare)