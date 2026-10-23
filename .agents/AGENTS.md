# Agentes del Proyecto Ricuras

## Convenciones del Proyecto

### Stack Tecnológico
- **Frontend:** Next.js 14+ (App Router) + TypeScript + Tailwind CSS
- **Backend:** Next.js API Routes (serverless) + Supabase
- **Base de Datos:** Supabase PostgreSQL con RLS
- **Auth:** Supabase Auth con roles (usuario, admin, superadmin)
- **Storage:** Supabase Storage (fotos de marcación)
- **Deploy:** Vercel (frontend + API) + Supabase (DB + Auth + Storage)
- **Bot WhatsApp:** Meta WhatsApp Cloud API + Webhook en Vercel/VPS

### Estructura del Proyecto
```
src/
├── app/                    # Next.js App Router
│   ├── (landing)/          # Landing page pública
│   ├── (auth)/             # Login, registro
│   ├── (dashboard)/        # Panel admin/superadmin
│   │   ├── asistencia/     # Control de asistencia
│   │   ├── tareas/         # Asignación de tareas
│   │   ├── reportes/       # Reportes y exportables
│   │   └── empleados/      # Gestión de empleados
│   └── api/                # API Routes
│       ├── attendance/     # Endpoints de asistencia
│       ├── tasks/          # Endpoints de tareas
│       ├── employees/      # Endpoints de empleados
│       ├── reports/        # Endpoints de reportes
│       └── webhook/        # WhatsApp webhook
├── components/             # Componentes React
│   ├── ui/                 # Componentes base (botones, inputs, etc.)
│   ├── landing/            # Componentes de landing
│   ├── dashboard/          # Componentes del dashboard
│   └── attendance/         # Componentes de asistencia
├── lib/                    # Utilidades y configuración
│   ├── supabase/           # Clientes de Supabase
│   ├── whatsapp/           # Lógica del bot de WhatsApp
│   └── utils/              # Utilidades generales
├── hooks/                  # Custom hooks
├── types/                  # TypeScript types/interfaces
└── styles/                 # Estilos globales
```

### Roles del Sistema
- **superadmin**: Acceso total, gestión de admins, configuración del sistema
- **admin**: Gestión de empleados, marcaciones, tareas, reportes
- **usuario**: Solo acceso a la landing page pública

### Reglas de Desarrollo
1. Usar Server Components por defecto, Client Components solo cuando sea necesario
2. Validar con Zod en todos los endpoints API
3. RLS habilitado en todas las tablas de Supabase
4. Responsive-first con Tailwind CSS
5. Internacionalización preparada (español por defecto)
6. Componentes accesibles (WCAG AA)
