# Memoria del Proyecto

## Decisiones de Arquitectura

### 2026-10-22 - Stack Tecnológico
- **Decisión:** Next.js 14+ (App Router) + Supabase + Vercel
- **Razón:** Escalabilidad, costo bajo, familiaridad del desarrollador con el stack
- **Alternativas descartadas:** Node.js puro + Google Sheets (del esquema original) — se migra a PostgreSQL para escalabilidad

### 2026-10-22 - Base de Datos
- **Decisión:** Supabase PostgreSQL en lugar de Google Sheets
- **Razón:** El esquema original usaba Google Sheets, pero PostgreSQL ofrece mejor rendimiento, RLS, relaciones, y escalabilidad
- **Se mantiene:** La lógica de negocio del esquema original (validaciones, geocerca, motor de tiempos)

### 2026-10-22 - Métodos de Marcación
- **Decisión:** Implementar 3 métodos progresivamente
  1. Manual (botón por empleado) - Fase 1
  2. Cámara de laptop (foto + timestamp) - Fase 1
  3. Bot de WhatsApp - Fase posterior
- **Razón:** Comenzar con lo más simple y agregar complejidad progresivamente

## Lecciones Aprendidas
(Se actualizará durante el desarrollo)

## Errores Conocidos
(Se actualizará durante el desarrollo)

### 2026-10-22 - Reanudación de desarrollo
- Fase 1 marcada como completada (landing, auth, middleware, esquema SQL).
- Iniciada Fase 2 con CRUD de empleados conectado a Supabase y rutas API validadas con Zod.
- Build de producción verificado sin errores.

### 2026-10-22 - Continuación Fase 2
- Asistencia conectada a Supabase (carga y registro persistente).
- Tareas: vistas Diaria, Semanal y Tabla; asignaciones con fecha.
- Empleados: cargo seleccionable por lista.
- Reportes: exportación CSV (Excel) y PDF (impresión).
- Corregida recursión RLS en profiles mediante funciones SECURITY DEFINER.

### 2026-10-22 - Asignacion v2 y Superadmin
- Agregada pestaña "Asignación v2 (Tabla)" con programación por día/semana/mes y copia a toda la semana.
- Agregada pestaña "Configuración (Superadmin)" para gestión de zonas.
- Explicado rol superadmin: gestión de zonas, admins y configuración del sistema.

### 2026-10-22 - Preparacion para despliegue
- Creado .gitignore para no subir .env.local ni node_modules.
- Repositorio listo para push manual con GitHub Desktop.
- Vercel conectado al repo para deploy automatico tras push.
