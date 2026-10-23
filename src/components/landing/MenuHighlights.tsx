"use client";

import { useState } from "react";
import { Utensils, Cake, Coffee, Check } from "lucide-react";

type Category = "sal" | "dulce" | "bebidas";

interface MenuItem {
  title: string;
  category: Category;
  description: string;
  tag: string;
  badge?: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    title: "Tigrillo Lojano con Cecina",
    category: "sal",
    description: "Plátano verde majado al punto exacto con queso criollo artesanal, huevo y lonchas de cecina lojana ahumada.",
    tag: "Plato Emblemático",
    badge: "Popular",
  },
  {
    title: "Bolón Mixto Tradicional",
    category: "sal",
    description: "Crujiente esfera de plátano verde con abundante chicharrón crocante y queso tierno de la región.",
    tag: "Desayuno Típico",
  },
  {
    title: "Tamal Lojano de Pollo",
    category: "sal",
    description: "Elaborado con masa de maíz suave cocida al vapor en hoja de achira, relleno con especias tradicionales y carne selecta.",
    tag: "Receta Ancestral",
  },
  {
    title: "Mofongo Especial Ricuras",
    category: "sal",
    description: "Verde frito majado con ajo suave, chicharrones artesanales y servido con consomé casero de cortesía.",
    tag: "Especialidad de la Casa",
    badge: "Recomendado",
  },
  {
    title: "Waffle Artesanal con Frutos Rojos",
    category: "dulce",
    description: "Waffle belga recién horneado, dorado por fuera y suave por dentro, servido con reducción natural de moras y arándanos.",
    tag: "Repostería",
    badge: "Favorito",
  },
  {
    title: "Torta Húmeda de Chocolate Lojano",
    category: "dulce",
    description: "Elaborada con cacao fino de aroma nacional al 70%, ganache untuosa y textura aterciopelada.",
    tag: "Chocolatería",
  },
  {
    title: "Cheesecake Horneado de Frutos Andinos",
    category: "dulce",
    description: "Base crujiente de galleta artesanal, crema de queso suave y cobertura de taxo o maracuyá fresca.",
    tag: "Pastelería Fina",
  },
  {
    title: "Cappuccino de Especialidad",
    category: "bebidas",
    description: "Espresso doble con granos arábicos de Loja, leche vaporizada microtexturizada y arte latte profesional.",
    tag: "Cafetería",
    badge: "Barista",
  },
  {
    title: "Café Filtrado V60 de Altura",
    category: "bebidas",
    description: "Método de extracción por goteo que exalta las notas florales, cítricas y el dulzor achocolatado del café lojano.",
    tag: "Método Manual",
  },
  {
    title: "Matcha Latte Ceremonial",
    category: "bebidas",
    description: "Té verde japonés ceremonial batido con leche vegetal o tradicional, suave, antioxidante y equilibrado.",
    tag: "Bebida Especial",
  },
];

export function MenuHighlights() {
  const [activeCategory, setActiveCategory] = useState<Category>("sal");

  const filteredItems = MENU_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <section id="especialidades" className="py-16 md:py-24 bg-white border-b border-brand-latte-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <p className="text-xs uppercase font-bold tracking-widest text-brand-terracotta">
            Nuestra Carta Selecta
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-espresso">
            El balance perfecto entre sal, dulce y café.
          </h2>
          <p className="text-sm sm:text-base text-brand-espresso/70">
            Cada plato honra la despensa agrícola del sur de Ecuador y el legado gastronómico de la provincia de Loja.
          </p>
        </div>

        {/* Pestañas de seleccion */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-xl bg-brand-latte border border-brand-latte-border gap-1">
            <button
              onClick={() => setActiveCategory("sal")}
              type="button"
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all focus:outline-none ${
                activeCategory === "sal"
                  ? "bg-brand-espresso text-white shadow-sm"
                  : "text-brand-espresso/70 hover:text-brand-espresso hover:bg-white/60"
              }`}
            >
              <Utensils className="w-4 h-4 text-brand-amber" />
              <span>Especialidades de Sal</span>
            </button>

            <button
              onClick={() => setActiveCategory("dulce")}
              type="button"
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all focus:outline-none ${
                activeCategory === "dulce"
                  ? "bg-brand-espresso text-white shadow-sm"
                  : "text-brand-espresso/70 hover:text-brand-espresso hover:bg-white/60"
              }`}
            >
              <Cake className="w-4 h-4 text-brand-terracotta" />
              <span>Repostería & Dulce</span>
            </button>

            <button
              onClick={() => setActiveCategory("bebidas")}
              type="button"
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all focus:outline-none ${
                activeCategory === "bebidas"
                  ? "bg-brand-espresso text-white shadow-sm"
                  : "text-brand-espresso/70 hover:text-brand-espresso hover:bg-white/60"
              }`}
            >
              <Coffee className="w-4 h-4 text-brand-botanical" />
              <span>Cafetería & Bebidas</span>
            </button>
          </div>
        </div>

        {/* Grilla de platos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl border border-brand-latte-border bg-brand-latte/40 hover:bg-brand-latte transition-colors duration-200 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-serif font-bold text-lg text-brand-espresso">
                    {item.title}
                  </h3>
                  {item.badge && (
                    <span className="shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-terracotta/10 text-brand-terracotta border border-brand-terracotta/20">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-brand-espresso/80 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-brand-latte-border/60 flex items-center justify-between text-xs">
                <span className="text-brand-terracotta font-medium flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  {item.tag}
                </span>
                <span className="text-brand-espresso/60 italic">
                  Preparación artesanal fresca
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
