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

### 2026-10-23 - Asignacion v2 mejorada
- Tabla mas grande y legible.
- Termino "Operario" en lugar de "Colaborador".
- Horarios personalizados con entrada/salida editable.
- Soporte para multiples turnos del mismo operario en un dia.
- Boton para guardar y replicar el turno a todos los dias visibles.

### 2026-10-23 - Asignacion v2: jornadas y calendario
- Boton "+ turno" reemplazado por boton "Programar" con icono CalendarPlus.
- Modal permite varias jornadas por dia (J1, J2) con horas editables.
- Vista Semana muestra la semana actual (lunes a domingo).
- Vista Mes ahora es calendario tipo Google Calendar, organizado por semanas.
- Tabla ampliada (texto y celdas mas grandes).

### 2026-10-23 - Drag & drop y colores en Asignacion v2
- Tarjetas arrastrables para mover asignaciones entre dias (semana y mes).
- Boton de duplicar al dia siguiente en cada tarjeta.
- Selector de color editable por asignacion.
- Tarjetas con borde de color, sombra e icono de arrastre.

### 2026-10-23 - Tarjetas asignacion v2 estilo foto + drag & drop
- Se replico el modelo de tarjeta de la referencia: redondeada con gradiente, avatar iniciales, zona, turno J, notas y acciones.
- Color de tarjeta editable (selector en modal) y gradiente generado con shadeColor.
- Datos preservados: operario, zona, jornada/turno, notas.
- Drag & drop entre dias + duplicar al dia siguiente + eliminar.

### 2026-10-23 - Reportes: export PDF semana/mes/día
- Selector de período (Día/Semana/Mes) en /admin/reportes.
- PDF abre ventana de impresión con reporte completo agrupado por operario, resumen totales, tabla detallada.
- Excel (CSV) respeta el mismo rango de fechas.
- API attendance GET acepta `from` y `to` para rangos arbitrarios.
