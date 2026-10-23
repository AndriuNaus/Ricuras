"use client";

import { useState } from "react";
import Link from "next/navigation";
import { usePathname, useRouter } from "next/navigation";
import {
  Coffee,
  Clock,
  ClipboardList,
  CalendarDays,
  Users,
  FileBarChart,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { name: "Resumen General", href: "/admin", icon: Coffee },
  { name: "Registro de Asistencia", href: "/admin/asistencia", icon: Clock },
  { name: "Asignación de Tareas", href: "/admin/tareas", icon: ClipboardList },
  { name: "Asignación v2 (Tabla)", href: "/admin/asignacion-v2", icon: CalendarDays },
  { name: "Gestión de Personal", href: "/admin/empleados", icon: Users },
  { name: "Reportes & Exportables", href: "/admin/reportes", icon: FileBarChart },
  { name: "Configuración (Superadmin)", href: "/admin/configuracion", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
    } catch (err) {
      console.error(err);
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-brand-latte flex flex-col md:flex-row">
      {/* Barra superior en movil */}
      <header className="md:hidden sticky top-0 z-40 bg-white border-b border-brand-latte-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-espresso flex items-center justify-center text-white">
            <Coffee className="w-4 h-4 text-brand-amber" />
          </div>
          <div>
            <p className="font-serif font-bold text-sm text-brand-espresso leading-none">
              Ricuras
            </p>
            <p className="text-[10px] text-brand-terracotta uppercase font-semibold">
              Panel Admin
            </p>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          type="button"
          className="p-2 rounded-lg border border-brand-latte-border text-brand-espresso bg-brand-latte"
          aria-label="Abrir navegación de administración"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar en escritorio */}
      <aside
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } md:block md:w-64 bg-white border-r border-brand-latte-border shrink-0 flex flex-col justify-between fixed md:sticky top-0 z-30 h-screen`}
      >
        <div className="p-6 space-y-6">
          {/* Logo del panel */}
          <div className="flex items-center gap-3 pb-6 border-b border-brand-latte-border">
            <div className="w-10 h-10 rounded-xl bg-brand-espresso flex items-center justify-center text-white shadow-sm">
              <Coffee className="w-5 h-5 text-brand-amber" />
            </div>
            <div>
              <p className="font-serif font-bold text-base text-brand-espresso">
                Ricuras
              </p>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-brand-terracotta">
                Gestión Operativa
              </p>
            </div>
          </div>

          {/* Enlaces de navegacion */}
          <nav className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? "bg-brand-espresso text-white shadow-sm"
                      : "text-brand-espresso/70 hover:text-brand-espresso hover:bg-brand-latte"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-brand-amber" : "text-brand-espresso/60"}`} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-brand-amber" />}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Pie del sidebar */}
        <div className="p-6 border-t border-brand-latte-border space-y-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between text-xs font-medium text-brand-espresso/70 hover:text-brand-espresso py-1.5"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              Ver Sitio Web
            </span>
            <span className="text-[10px] uppercase tracking-wider text-brand-terracotta font-semibold">
              Público
            </span>
          </a>

          <button
            onClick={handleSignOut}
            type="button"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenido principal del dashboard */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
