import Link from "next/link";
import { MapPin, Coffee, UtensilsCrossed, Truck } from "lucide-react";
import { RamaCafe, FotoPendiente } from "./Botanica";
import { EstadoAbierto } from "./EstadoAbierto";

export function Hero() {
  return (
    <>
      <section id="inicio" className="relative overflow-hidden bg-ricuras-verde text-ricuras-crema">
        {/* Ramas de café decorativas, como en el logo */}
        <RamaCafe className="absolute right-3 -top-8 w-[300px] h-[600px] text-ricuras-dorado opacity-20 rotate-[14deg]" />
        <RamaCafe className="absolute -left-10 -bottom-32 w-[220px] h-[440px] text-ricuras-dorado opacity-[0.14] -rotate-[28deg]" />

        <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 pt-16 pb-20 lg:pt-20 lg:pb-24 grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-14 items-center">
          <div className="flex flex-col items-start gap-6">
            <p className="font-script text-[1.9rem] leading-tight text-ricuras-dorado-claro">Bienvenidos a Ricuras</p>
            <h1 className="font-display font-normal uppercase leading-[0.98] tracking-[0.01em] text-[3rem] sm:text-[4.4rem] lg:text-[5.4rem]">
              Café de especialidad y sabor manabita
            </h1>
            <p className="text-lg max-w-[520px] text-ricuras-crema/85">
              Combinamos la cocina tradicional manabita y ecuatoriana con café preparado por nuestros baristas. Desayunos típicos, platos de verde y repostería en nuestras dos casas de Loja.
            </p>
            <div className="flex flex-wrap gap-3.5 pt-1">
              <Link
                href="#menu"
                className="px-8 py-4 rounded-full bg-ricuras-dorado text-ricuras-noche font-bold hover:bg-ricuras-dorado-claro transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ricuras-crema"
              >
                Ver el menú
              </Link>
              <Link
                href="#reservas"
                className="px-7 py-[15px] rounded-full border-[1.5px] border-ricuras-crema/70 font-semibold hover:bg-ricuras-crema hover:text-ricuras-verde transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ricuras-dorado"
              >
                Reservar mesa
              </Link>
            </div>
          </div>

          <div className="relative">
            <FotoPendiente oscuro etiqueta="Foto: barista haciendo latte art" className="h-[420px] sm:h-[520px] rounded-[28px]" />
            <div className="absolute -left-2 sm:-left-5 bottom-7">
              <EstadoAbierto />
            </div>
          </div>
        </div>
      </section>

      {/* Franja de distintivos */}
      <section aria-label="Lo que nos distingue" className="bg-ricuras-noche text-ricuras-crema">
        <ul className="max-w-[1240px] mx-auto px-4 sm:px-6 py-6 flex flex-wrap justify-between gap-x-10 gap-y-4 text-sm font-semibold tracking-[0.06em] uppercase">
          <li className="flex items-center gap-2.5"><MapPin className="w-5 h-5 text-ricuras-dorado-claro" aria-hidden="true" />Dos casas en Loja</li>
          <li className="flex items-center gap-2.5"><Coffee className="w-5 h-5 text-ricuras-dorado-claro" aria-hidden="true" />Café de especialidad</li>
          <li className="flex items-center gap-2.5"><UtensilsCrossed className="w-5 h-5 text-ricuras-dorado-claro" aria-hidden="true" />Cocina manabita y ecuatoriana</li>
          <li className="flex items-center gap-2.5"><Truck className="w-5 h-5 text-ricuras-dorado-claro" aria-hidden="true" />Pedidos en PedidoIQ</li>
        </ul>
      </section>
    </>
  );
}
