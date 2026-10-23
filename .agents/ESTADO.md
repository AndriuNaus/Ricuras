# Estado del Proyecto - Ricuras de Sal y Dulce

**Última actualización:** 2026-10-22

## Estado Actual: ✅ LISTO PARA DESPLIEGUE (push pendiente con GitHub Desktop)

### Fase Actual
- Base del proyecto Next.js 14+ (App Router) con TypeScript y Tailwind CSS configurada.
- Paleta institucional y tokens de diseño aplicados.
- Clientes Supabase SSR (Browser, Server y Middleware) estructurados.
- Esquema SQL inicial con RLS y tablas base creado en `supabase/migrations/001_initial_schema.sql`.
- Landing Page pública implementada con secciones: Hero, Especialidades, Café, Sedes, Galería y Footer.
- Módulo de Login con redirección por rol implementado.
- Middleware de protección de rutas `/admin` y `/login` implementado.

### Decisiones Tomadas
- **Stack:** Next.js 14+ / Supabase / Vercel
- **Auth:** Supabase Auth con roles en tabla `profiles`
- **Asistencia:** 3 métodos (manual, cámara, WhatsApp futuro)

### Próximos Pasos
1. Iniciar Fase 2: Panel Administrativo y Gestión de Personal.
2. Conectar las páginas mock del admin con Supabase (empleados, asistencia, tareas).
3. Implementar CRUD de empleados y zonas.
4. Implementar marcación real con persistencia y fotos en Storage.

### Bloqueos
- Ninguno actualmente. Se requiere configurar variables de entorno de Supabase para operación real.
