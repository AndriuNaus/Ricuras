"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Coffee, ShieldCheck } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-brand-latte/90 backdrop-blur-md border-b border-brand-latte-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo institucional */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="w-10 h-10 rounded-lg bg-brand-espresso flex items-center justify-center text-brand-latte group-hover:bg-brand-terracotta transition-colors">
              <Coffee className="w-5 h-5 text-brand-amber" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-brand-espresso leading-none">
                Ricuras
              </span>
              <span className="text-[10px] sm:text-xs tracking-widest uppercase font-semibold text-brand-terracotta mt-0.5">
                De Sal y Dulce • Café
              </span>
            </div>
          </Link>

          {/* Navegacion escritorio */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-brand-espresso/80">
            <Link
              href="#especialidades"
              className="hover:text-brand-terracotta transition-colors py-2 focus:outline-none focus:text-brand-terracotta"
            >
              Especialidades
            </Link>
            <Link
              href="#cafe"
              className="hover:text-brand-terracotta transition-colors py-2 focus:outline-none focus:text-brand-terracotta"
            >
              Café de Origen
            </Link>
            <Link
              href="#sedes"
              className="hover:text-brand-terracotta transition-colors py-2 focus:outline-none focus:text-brand-terracotta"
            >
              Sedes y Horarios
            </Link>
            <Link
              href="#experiencia"
              className="hover:text-brand-terracotta transition-colors py-2 focus:outline-none focus:text-brand-terracotta"
            >
              Experiencia
            </Link>
          </nav>

          {/* Accion portal de acceso */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wider uppercase text-brand-espresso bg-white border border-brand-latte-border rounded-lg shadow-sm hover:bg-brand-latte-subtle hover:border-brand-espresso/20 transition-all focus:outline-none focus:ring-2 focus:ring-brand-espresso/20"
            >
              <ShieldCheck className="w-4 h-4 text-brand-terracotta" />
              Portal Colaboradores
            </Link>
          </div>

          {/* Boton menu movil */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/login"
              className="p-2 text-brand-espresso rounded-lg border border-brand-latte-border bg-white"
              aria-label="Acceso al portal"
            >
              <ShieldCheck className="w-5 h-5 text-brand-terracotta" />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="p-2 rounded-lg text-brand-espresso hover:bg-brand-latte-subtle focus:outline-none border border-brand-latte-border bg-white"
              aria-expanded={isOpen}
              aria-label="Abrir menú de navegación"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu desplegable para dispositivos moviles */}
      {isOpen && (
        <div className="md:hidden border-b border-brand-latte-border bg-brand-latte px-4 pt-3 pb-6 space-y-3">
          <Link
            href="#especialidades"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-brand-espresso hover:bg-white transition-colors"
          >
            Especialidades
          </Link>
          <Link
            href="#cafe"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-brand-espresso hover:bg-white transition-colors"
          >
            Café de Origen
          </Link>
          <Link
            href="#sedes"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-brand-espresso hover:bg-white transition-colors"
          >
            Sedes y Horarios
          </Link>
          <Link
            href="#experiencia"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-brand-espresso hover:bg-white transition-colors"
          >
            Experiencia
          </Link>
          <div className="pt-2 border-t border-brand-latte-border">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold tracking-wide uppercase text-white bg-brand-espresso rounded-lg shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-brand-amber" />
              Portal Colaboradores y Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
