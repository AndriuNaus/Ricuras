"use client";

import { useState } from "react";
import { RamaCafe, TituloSeccion, FotoPendiente } from "./Botanica";

type Category = "sal" | "dulce" | "bebidas";

interface MenuItem {
  title: string;
  category: Category;
  description: string;
  tag: string;
}

// Platos destacados (sin precios). Confirmar nombres y descripciones con el restaurante.
const MENU_ITEMS: MenuItem[] = [
  { title: "Empanadas de verde", category: "sal", description: "Clásico de plátano verde, recién salidas.", tag: "De sal" },
  { title: "Deditos de yuca", category: "sal", description: "Para compartir o acompañar tu café.", tag: "De sal" },
  { title: "Torta de verde", category: "sal", description: "Una de las creaciones de la casa.", tag: "De sal" },
  { title: "Tigrillo lojano", category: "sal", description: "Verde majado con queso y huevo, al estilo de Loja.", tag: "De sal" },
  { title: "Waffle con frutos rojos", category: "dulce", description: "Recién hecho, con reducción de moras y arándanos.", tag: "De dulce" },
  { title: "Torta de chocolate", category: "dulce", description: "Húmeda, con cacao ecuatoriano.", tag: "De dulce" },
  { title: "Cheesecake de frutos andinos", category: "dulce", description: "Cremoso, con cobertura de fruta de temporada.", tag: "De dulce" },
  { title: "Capuchino", category: "bebidas", description: "Espresso con leche texturizada y latte art.", tag: "Bebidas" },
  { title: "Iced coffee", category: "bebidas", description: "Nuestro café en versión fría.", tag: "Bebidas" },
  { title: "Matcha latte", category: "bebidas", description: "Suave y equilibrado, frío o caliente.", tag: "Bebidas" },
  { title: "Bebidas especiales", category: "bebidas", description: "Jugos y bebidas de temporada.", tag: "Bebidas" },
];

const CATEGORIAS: { id: Category; label: string }[] = [
  { id: "sal", label: "De sal" },
  { id: "dulce", label: "De dulce" },
  { id: "bebidas", label: "Bebidas" },
];

export function MenuHighlights() {
  const [activeCategory, setActiveCategory] = useState<Category>("sal");
  const filteredItems = MENU_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <section id="menu" className="relative overflow-hidden py-20 md:py-24 px-4 sm:px-6">
      <RamaCafe className="absolute -right-12 top-10 w-[260px] h-[520px] text-ricuras-verde opacity-[0.09] -rotate-[10deg]" />

      <div className="relative max-w-[1240px] mx-auto flex flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <TituloSeccion acento="Lo más pedido" titulo="Sal, dulce y café" />

          {/* Pestañas de categoría */}
          <div role="group" aria-label="Categorías del menú" className="flex flex-wrap gap-2">
            {CATEGORIAS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCategory(c.id)}
                aria-pressed={activeCategory === c.id}
                className={`px-6 py-3 rounded-full border-[1.5px] border-ricuras-verde text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ricuras-dorado ${
                  activeCategory === c.id
                    ? "bg-ricuras-verde text-ricuras-crema font-bold"
                    : "text-ricuras-verde font-semibold hover:bg-ricuras-menta"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
          {filteredItems.map((item) => (
            <article
              key={item.title}
              className="bg-white rounded-[22px] overflow-hidden flex flex-col shadow-[0_1px_0_rgba(2,75,56,0.08),0_12px_30px_rgba(2,75,56,0.08)]"
            >
              <FotoPendiente etiqueta={`Foto: ${item.title.toLowerCase()}`} className="h-[220px]" />
              <div className="px-[22px] pt-5 pb-6 flex flex-col gap-2">
                <span className="self-start text-[11px] font-bold tracking-[0.12em] uppercase text-ricuras-verde bg-ricuras-menta px-2.5 py-1 rounded-full">
                  {item.tag}
                </span>
                <h3 className="font-display font-normal uppercase text-[26px] leading-tight text-ricuras-carbon">{item.title}</h3>
                <p className="text-sm text-[#4F4A40]">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
