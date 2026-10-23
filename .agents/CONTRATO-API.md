# Contrato API - Proyecto Ricuras

## Base URL
```
Desarrollo: http://localhost:3000/api
Producción: https://ricuras.vercel.app/api
```

## Autenticación
Todas las rutas protegidas requieren un token JWT de Supabase en el header:
```
Authorization: Bearer <supabase_access_token>
```

## Endpoints

### Auth
```
POST   /api/auth/login          # Login con email/password
POST   /api/auth/register       # Registro (solo superadmin puede crear admins)
POST   /api/auth/logout         # Cerrar sesión
GET    /api/auth/me             # Perfil del usuario actual
```

### Empleados
```
GET    /api/employees           # Listar empleados (admin+)
POST   /api/employees           # Crear empleado (admin+)
GET    /api/employees/:id       # Detalle de empleado
PUT    /api/employees/:id       # Actualizar empleado
DELETE /api/employees/:id       # Desactivar empleado
```

### Asistencia / Marcaciones
```
POST   /api/attendance/clock    # Registrar entrada/salida
GET    /api/attendance          # Listar marcaciones (filtros: fecha, empleado, mes)
GET    /api/attendance/today    # Marcaciones de hoy
GET    /api/attendance/:id      # Detalle de marcación
```

### Tareas / Asignaciones
```
GET    /api/tasks               # Listar asignaciones
POST   /api/tasks               # Crear asignación
PUT    /api/tasks/:id           # Actualizar asignación
DELETE /api/tasks/:id           # Eliminar asignación
GET    /api/tasks/week/:date    # Asignaciones de la semana
POST   /api/tasks/bulk          # Crear asignaciones masivas (semanal)
```

### Zonas / Áreas
```
GET    /api/zones               # Listar zonas del restaurante
POST   /api/zones               # Crear zona
PUT    /api/zones/:id           # Actualizar zona
DELETE /api/zones/:id           # Eliminar zona
```

### Reportes
```
GET    /api/reports/attendance   # Reporte de asistencia (exportable)
GET    /api/reports/tasks        # Reporte de tareas (exportable)
GET    /api/reports/summary      # Resumen mensual
GET    /api/reports/export/:type # Exportar (excel, pdf, image)
```

### Webhook WhatsApp
```
GET    /api/webhook/whatsapp    # Verificación de Meta
POST   /api/webhook/whatsapp    # Recibir mensajes de WhatsApp
```
