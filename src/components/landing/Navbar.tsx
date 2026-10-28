"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShieldCheck } from "lucide-react";
import { MarcaRicuras } from "./Botanica";

const ENLACES = [
  { href: "#menu", label: "Menú" },
  { href: "#cafe", label: "Café" },
  { href: "#casas", label: "Nuestras casas" },
  { href: "#reservas", label: "Reservas" },
  { href: "#instagram", label: "Instagram" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-ricuras-verde/95 backdrop-blur-md border-b border-ricuras-dorado/30 text-ricuras-crema">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo (provisional hasta tener el archivo original) */}
          <Link href="/" className="flex items-center gap-3 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ricuras-dorado">
            <span className="w-12 h-12 rounded-full border-[1.5px] border-ricuras-dorado flex items-center justify-center text-ricuras-dorado">
              <MarcaRicuras className="w-7 h-7" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-semibold tracking-[0.32em] text-lg">RICURAS</span>
              <span className="text-[10px] tracking-[0.3em] text-ricuras-dorado-claro">DE SAL Y DULCE</span>
            </span>
          </Link>

          {/* Navegación escritorio */}
          <nav aria-label="Principal" className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium">
            {ENLACES.map((e) => (
              <Link
                key={e.href}
                href={e.href}
                className="py-2 hover:text-ricuras-dorado-claro transition-colors focus:outline-none focus-visible:text-ricuras-dorado-claro"
              >
                {e.label}
              </Link>
            ))}
            {/* Acceso al panel de administración */}
            <Link
              href="/login"
              aria-label="Acceso del personal"
              title="Acceso del personal"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-ricuras-crema/40 hover:bg-ricuras-noche transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ricuras-dorado"
            >
              <ShieldCheck className="w-4 h-4 text-ricuras-dorado-claro" aria-hidden="true" />
              <span className="hidden xl:inline">Personal</span>
            </Link>
            <Link
              href="#reservas"
              className="px-6 py-3 rounded-full bg-ricuras-dorado text-ricuras-noche font-bold hover:bg-ricuras-dorado-claro transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ricuras-crema"
            >
              Reservar mesa
            </Link>
          </nav>

          {/* Móvil: acceso al panel + botón de menú */}
          <div className="flex lg:hidden items-center gap-2">
          <Link
            href="/login"
            aria-label="Acceso del personal"
            className="p-3 rounded-full border border-ricuras-crema/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-ricuras-dorado"
          >
            <ShieldCheck className="w-6 h-6 text-ricuras-dorado-claro" aria-hidden="true" />
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="p-3 rounded-full border border-ricuras-crema/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-ricuras-dorado"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          </div>
        </div>
      </div>

      {/* Menú desplegable móvil */}
      {isOpen && (
        <nav aria-label="Principal móvil" className="lg:hidden border-t border-ricuras-dorado/30 bg-ricuras-verde px-4 pt-3 pb-6 space-y-1">
          {ENLACES.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-3 rounded-lg text-base font-medium hover:bg-ricuras-noche transition-colors"
            >
              {e.label}
            </Link>
          ))}
          <Link
            href="#reservas"
            onClick={() => setIsOpen(false)}
            className="block mt-3 text-center py-3.5 rounded-full bg-ricuras-dorado text-ricuras-noche font-bold"
          >
            Reservar mesa
          </Link>
          <Link
            href="/login"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-2 mt-2 py-3.5 rounded-full border border-ricuras-crema/40 font-semibold"
          >
            <ShieldCheck className="w-4 h-4 text-ricuras-dorado-claro" aria-hidden="true" />
            Acceso del personal
          </Link>
        </nav>
      )}
    </header>
  );
}
