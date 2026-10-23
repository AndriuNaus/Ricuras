import Link from "next/link";
import {
  Clock,
  ClipboardList,
  Users,
  CheckCircle2,
  Calendar,
  ArrowUpRight,
  Shield,
  Coffee,
} from "lucide-react";

export default function AdminDashboardPage() {
  const todayFormatted = new Intl.DateTimeFormat("es-EC", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <div className="space-y-8">
      {/* Encabezado del dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-latte-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-terracotta">
            <Shield className="w-3.5 h-3.5" />
            <span>Panel de Control Administrativo</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-espresso mt-1">
            Operaciones del Restaurante
          </h1>
          <p className="text-xs sm:text-sm text-brand-espresso/60 capitalize mt-0.5">
            {todayFormatted}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/asistencia"
            className="btn-primary text-xs py-2.5 px-4 flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            <span>Marcar Asistencia</span>
          </Link>
        </div>
      </div>

      {/* Indicadores operativos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-brand-latte-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-espresso/60 uppercase tracking-wider">
              Colaboradores
            </span>
            <div className="w-8 h-8 rounded-lg bg-brand-latte flex items-center justify-center text-brand-espresso">
              <Users className="w-4 h-4 text-brand-terracotta" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold font-serif text-brand-espresso">Activos</p>
            <p className="text-[11px] text-brand-espresso/60 mt-1">
              Personal habilitado en nómina
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-brand-latte-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-espresso/60 uppercase tracking-wider">
              Asistencia Hoy
            </span>
            <div className="w-8 h-8 rounded-lg bg-brand-latte flex items-center justify-center text-brand-espresso">
              <Clock className="w-4 h-4 text-brand-botanical" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold font-serif text-brand-espresso">En Turno</p>
            <p className="text-[11px] text-brand-botanical font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Jornada en curso
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-brand-latte-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-espresso/60 uppercase tracking-wider">
              Zonas Activas
            </span>
            <div className="w-8 h-8 rounded-lg bg-brand-latte flex items-center justify-center text-brand-espresso">
              <ClipboardList className="w-4 h-4 text-brand-amber" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold font-serif text-brand-espresso">5 Áreas</p>
            <p className="text-[11px] text-brand-espresso/60 mt-1">
              San Sebastián y Pádel Club
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-brand-latte-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-espresso/60 uppercase tracking-wider">
              Métodos Habilitados
            </span>
            <div className="w-8 h-8 rounded-lg bg-brand-latte flex items-center justify-center text-brand-espresso">
              <Coffee className="w-4 h-4 text-brand-espresso" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold font-serif text-brand-espresso">Manual & Cámara</p>
            <p className="text-[11px] text-brand-espresso/60 mt-1">
              WhatsApp en preparación
            </p>
          </div>
        </div>
      </div>

      {/* Accesos directos a modulos clave */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-brand-latte-border shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-brand-terracotta/10 text-brand-terracotta">
              Módulo de Asistencia
            </div>
            <h3 className="font-serif font-bold text-xl text-brand-espresso">
              Control de Entradas y Salidas
            </h3>
            <p className="text-xs text-brand-espresso/70 leading-relaxed">
              Permite registrar las marcaciones del personal mediante botones de un clic por colaborador o mediante la cámara integrada de la laptop del restaurante con captura fotográfica como comprobante.
            </p>
          </div>

          <div className="pt-4 border-t border-brand-latte-border">
            <Link
              href="/admin/asistencia"
              className="inline-flex items-center gap-2 text-xs font-semibold text-brand-terracotta hover:text-brand-terracotta-hover transition-colors"
            >
              <span>Abrir terminal de marcación</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-brand-latte-border shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-brand-botanical/10 text-brand-botanical">
              Módulo de Tareas
            </div>
            <h3 className="font-serif font-bold text-xl text-brand-espresso">
              Programación de Turnos por Zona
            </h3>
            <p className="text-xs text-brand-espresso/70 leading-relaxed">
              Organice y asigne a cada empleado su puesto diario (Piso 1, Barra, Cocina o Terraza), programe la rotación semanal y genere la imagen gráfica exportable para compartir por WhatsApp.
            </p>
          </div>

          <div className="pt-4 border-t border-brand-latte-border">
            <Link
              href="/admin/tareas"
              className="inline-flex items-center gap-2 text-xs font-semibold text-brand-botanical hover:text-brand-botanical-hover transition-colors"
            >
              <span>Gestionar tareas y asignaciones</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
