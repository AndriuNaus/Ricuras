# Checklist de Desarrollo - Ricuras de Sal y Dulce

## Fase 1: Fundamentos, Autenticacion y Landing Page
- [x] Inicializar aplicacion Next.js con TypeScript, ESLint y Tailwind CSS
- [x] Configurar paleta institucional y tokens de diseno (Espresso, Crema, Terracota, Verde Botanico)
- [x] Instalar y configurar componentes base (Lucide Icons, Radix UI / utilidades accesibles)
- [x] Estructurar clientes Supabase SSR (Browser, Server y Middleware)
- [x] Crear esquema de base de datos SQL para autenticacion, perfiles y roles (usuario, admin, superadmin) con RLS
- [x] Desarrollar Landing Page profesional y mobile-first:
  - [x] Barra de navegacion responsive con menu para dispositivos moviles
  - [x] Seccion principal (Hero) con propuesta de valor y llamados a la accion
  - [x] Presentacion de especialidades (Sal, Dulce, Cafe de Especialidad Lojano)
  - [x] Seccion de sedes y horarios (Matriz San Sebastian y Sede Loja Padel Club)
  - [x] Pie de pagina institucional con enlaces y datos de contacto
- [x] Modulo de acceso (Login) con redireccion segun rol de usuario
- [x] Middleware para proteccion de rutas segun rol

## Tarea Pendiente Posterior: Galeria Multimedia
- [ ] Integracion y carga de galeria multimedia completa (videos y fotografias en alta resolucion provenientes de redes sociales o almacenamiento en la nube)

## Fase 2: Panel Administrativo y Gestion de Personal
- [ ] Diseno del panel de administracion adaptado a pantallas moviles y escritorio
- [ ] Gestion de personal (listado, alta y edicion de colaboradores)
- [ ] Gestion de zonas del establecimiento (Piso 1, Barra, Cocina, Terraza, etc.)

## Fase 3: Modulo de Registro de Asistencia
- [ ] Sistema de marcacion manual rapida por colaborador
- [ ] Sistema de marcacion mediante camara web integrada
- [ ] Registro historico de asistencias con filtros por fecha, mes y colaborador
- [ ] Validacion de alternancia logica de jornadas (entrada y salida)

## Fase 4: Programacion y Asignacion de Tareas
- [ ] Planificador de asignaciones diarias y semanales por zona operativa
- [ ] Generador de imagen grafica exportable de tareas para distribucion por mensajeria

## Fase 5: Reportes y Exportables
- [ ] Generacion y descarga de reportes en formato Excel
- [ ] Generacion de reportes en formato PDF

## Fase 6: Integracion de Bot de WhatsApp
- [ ] Configuracion de Meta WhatsApp Cloud API y recepcion por webhook
- [ ] Verificacion de marcaciones con geolocalizacion y fotografia

## Fase 7: Despliegue y Puesta en Produccion
- [ ] Despliegue en Vercel y configuracion de variables de entorno de produccion
- [ ] Auditoria de seguridad, accesibilidad y rendimiento movil