import Link from "next/link";
import {
  Clock,
  ClipboardList,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Shield,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { hoyEC, inicioDiaEC, finDiaEC, ZONA_HORARIA } from "@/lib/fecha";

// Siempre datos frescos: el resumen cambia con cada marcación
export const dynamic = "force-dynamic";

interface MarcacionHoy {
  employee_id: string;
  record_type: "entrada" | "salida";
  status: "valido" | "rechazado";
  timestamp: string;
  employees: { full_name: string } | null;
}

/** Indicadores del día calculados desde Supabase (hora de Ecuador). */
async function obtenerResumenHoy() {
  const supabase = await createClient();
  const hoy = hoyEC();

  const [empleados, zonas, marcaciones] = await Promise.all([
    supabase.from("employees").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("zones").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase
      .from("attendance_records")
      .select("employee_id, record_type, status, timestamp, employees(full_name)")
      .gte("timestamp", inicioDiaEC(hoy))
      .lte("timestamp", finDiaEC(hoy))
      .order("timestamp", { ascending: true }),
  ]);

  const registros = (marcaciones.data ?? []) as unknown as MarcacionHoy[];
  const validos = registros.filter((r) => r.status === "valido");

  // Última marcación válida de cada empleado: si es ENTRADA, está en turno ahora
  const ultimaPorEmpleado = new Map<string, MarcacionHoy>();
  for (const r of validos) ultimaPorEmpleado.set(r.employee_id, r);
  const enTurno = Array.from(ultimaPorEmpleado.values()).filter((r) => r.record_type === "entrada");

  const marcaronHoy = new Set(validos.filter((r) => r.record_type === "entrada").map((r) => r.employee_id)).size;

  return {
    empleadosActivos: empleados.count ?? 0,
    zonasActivas: zonas.count ?? 0,
    marcaronHoy,
    enTurno,
    rechazadas: registros.filter((r) => r.status === "rechazado").length,
    hayError: Boolean(empleados.error || zonas.error || marcaciones.error),
  };
}

function horaEC(timestamp: string) {
  return new Date(timestamp).toLocaleTimeString("es-EC", { timeZone: ZONA_HORARIA, hour: "2-digit", minute: "2-digit" });
}

export default async function AdminDashboardPage() {
  const resumen = await obtenerResumenHoy();
  // timeZone explícito: el servidor (Vercel) corre en UTC
  const todayFormatted = new Intl.DateTimeFormat("es-EC", {
    timeZone: ZONA_HORARIA,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  const tarjetas = [
    {
      titulo: "Colaboradores",
      valor: resumen.empleadosActivos,
      detalle: "Personal activo en nómina",
      icono: <Users className="w-4 h-4 text-brand-terracotta" />,
    },
    {
      titulo: "Marcaron Hoy",
      valor: `${resumen.marcaronHoy} / ${resumen.empleadosActivos}`,
      detalle: "Con al menos una entrada válida",
      icono: <CheckCircle2 className="w-4 h-4 text-brand-botanical" />,
    },
    {
      titulo: "En Turno Ahora",
      valor: resumen.enTurno.length,
      detalle: "Entrada sin salida registrada",
      icono: <Clock className="w-4 h-4 text-brand-botanical" />,
    },
    {
      titulo: "Rechazadas Hoy",
      valor: resumen.rechazadas,
      detalle: "Fuera de geocerca u otro motivo",
      icono: <AlertTriangle className="w-4 h-4 text-brand-amber" />,
    },
  ];

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

      {resumen.hayError && (
        <p className="text-xs p-3 rounded-xl bg-red-50 text-red-700 border border-red-200">
          No se pudieron cargar algunos datos. Revisa la conexión con Supabase.
        </p>
      )}

      {/* Indicadores operativos (datos reales del día) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tarjetas.map((t) => (
          <div
            key={t.titulo}
            className="p-5 rounded-2xl bg-white border border-brand-latte-border shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-brand-espresso/60 uppercase tracking-wider">
                {t.titulo}
              </span>
              <div className="w-8 h-8 rounded-lg bg-brand-latte flex items-center justify-center text-brand-espresso">
                {t.icono}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold font-serif text-brand-espresso">{t.valor}</p>
              <p className="text-[11px] text-brand-espresso/60 mt-1">{t.detalle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quién está trabajando en este momento */}
      <div className="p-6 rounded-3xl bg-white border border-brand-latte-border shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-bold text-lg text-brand-espresso">En turno ahora</h2>
          <span className="text-[11px] text-brand-espresso/50 flex items-center gap-1">
            <ClipboardList className="w-3.5 h-3.5" />
            {resumen.zonasActivas} zonas activas
          </span>
        </div>
        {resumen.enTurno.length === 0 ? (
          <p className="text-xs text-brand-espresso/50 italic">Nadie tiene una entrada abierta en este momento.</p>
        ) : (
          <ul className="divide-y divide-brand-latte-border">
            {resumen.enTurno.map((r) => (
              <li key={r.employee_id} className="py-2 flex items-center justify-between text-sm">
                <span className="text-brand-espresso">{r.employees?.full_name ?? "Empleado"}</span>
                <span className="font-mono text-xs text-brand-botanical">Entró {horaEC(r.timestamp)}</span>
              </li>
            ))}
          </ul>
        )}
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
