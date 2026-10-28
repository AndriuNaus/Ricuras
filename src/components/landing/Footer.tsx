import Link from "next/link";
import { Instagram, Facebook } from "lucide-react";
import { MarcaRicuras } from "./Botanica";

export function Footer() {
  const anio = new Date().getFullYear();

  return (
    <footer className="bg-ricuras-noche text-ricuras-crema">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-14 pb-8 flex flex-col gap-8">
        <div className="flex flex-wrap justify-between gap-8">
          {/* Marca */}
          <div className="flex flex-col gap-3 max-w-[360px]">
            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-full border-[1.5px] border-ricuras-dorado flex items-center justify-center text-ricuras-dorado">
                <MarcaRicuras className="w-6 h-6" />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="font-semibold tracking-[0.32em] text-xl">RICURAS</span>
                <span className="text-[11px] tracking-[0.3em] text-ricuras-dorado-claro">DE SAL Y DULCE</span>
              </span>
            </div>
            <p className="text-sm text-ricuras-crema/75">Café de especialidad y cocina tradicional manabita y ecuatoriana en Loja, Ecuador.</p>
            <div className="flex gap-2.5 pt-1">
              <a
                href="https://www.instagram.com/ricurasdesalydulce/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de Ricuras"
                className="w-11 h-11 rounded-full border border-ricuras-dorado/50 flex items-center justify-center hover:bg-ricuras-verde transition-colors"
              >
                <Instagram className="w-5 h-5" aria-hidden="true" />
              </a>
              <a
                href="https://www.facebook.com/ricurasdesalydulce/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook de Ricuras"
                className="w-11 h-11 rounded-full border border-ricuras-dorado/50 flex items-center justify-center hover:bg-ricuras-verde transition-colors"
              >
                <Facebook className="w-5 h-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="flex flex-wrap gap-12 text-sm">
            <div className="flex flex-col gap-2">
              <span className="font-bold tracking-[0.1em] uppercase text-xs text-ricuras-dorado-claro">Visítanos</span>
              <Link href="#casas" className="hover:text-ricuras-dorado-claro transition-colors">Matriz · Calle Olmedo</Link>
              <Link href="#casas" className="hover:text-ricuras-dorado-claro transition-colors">Sucursal · Loja Pádel Club</Link>
              <Link href="#reservas" className="hover:text-ricuras-dorado-claro transition-colors">Reservar mesa</Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-bold tracking-[0.1em] uppercase text-xs text-ricuras-dorado-claro">Horario</span>
              <span>Lun – Sáb · 07:00 – 21:30</span>
              <span>Domingo · 07:00 – 18:30</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-3 pt-5 border-t border-ricuras-dorado-claro/25 text-[13px] text-ricuras-crema/70">
          <span>© {anio} Ricuras de Sal y Dulce · Loja, Ecuador</span>
          <Link href="/login" className="underline underline-offset-4 hover:text-ricuras-crema">
            Acceso del personal
          </Link>
        </div>
      </div>
    </footer>
  );
}
