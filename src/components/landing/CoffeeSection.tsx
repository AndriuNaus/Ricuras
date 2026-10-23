import { Coffee, Award, Compass, Flame } from "lucide-react";

export function CoffeeSection() {
  return (
    <section id="cafe" className="py-16 md:py-24 bg-brand-latte border-b border-brand-latte-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-amber/30 bg-brand-amber/10 text-brand-espresso text-xs font-semibold tracking-wide uppercase">
              <Award className="w-3.5 h-3.5 text-brand-amber" />
              <span>Café de Especialidad 100% Lojano</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-brand-espresso leading-tight">
              De los valles de Loja a tu taza.
            </h2>

            <p className="text-sm sm:text-base text-brand-espresso/80 leading-relaxed">
              Loja es mundialmente reconocida por sus microclimas privilegiados y altitudes entre los 1.600 y 2.100 msnm. En Ricuras de Sal y Dulce seleccionamos granos arábicos de pequeños caficultores de la provincia, tostados con precisión para preservar sus notas a panela, jazmín y cacao fino.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-espresso text-brand-amber flex items-center justify-center shrink-0 mt-0.5">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-brand-espresso">Trazabilidad y Origen</h4>
                  <p className="text-xs text-brand-espresso/70">
                    Lotes cosechados a mano en valles como Puyango, Chaguarpamba y Vilcabamba.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-espresso text-brand-amber flex items-center justify-center shrink-0 mt-0.5">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-brand-espresso">Tueste Medio Artesanal</h4>
                  <p className="text-xs text-brand-espresso/70">
                    Curvas de tostado diseñadas para realzar acidez brillante y cuerpo sedoso sin amargor excesivo.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-white border border-brand-latte-border shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-brand-latte flex items-center justify-center text-brand-terracotta">
                  <Coffee className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-lg text-brand-espresso">Espresso Bar</h3>
                <p className="text-xs text-brand-espresso/70 leading-relaxed">
                  Extracciones a 9 bares de presión con emulsión perfecta de leche fresca entera o vegetal.
                </p>
                <div className="text-[11px] font-semibold text-brand-terracotta pt-2">
                  Espresso • Americano • Flat White • Cortado
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-brand-latte-border shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-brand-latte flex items-center justify-center text-brand-botanical">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-lg text-brand-espresso">Métodos Filtrados</h3>
                <p className="text-xs text-brand-espresso/70 leading-relaxed">
                  Infusiones lentas por gravedad que separan los aceites aromáticos para una taza limpia y compleja.
                </p>
                <div className="text-[11px] font-semibold text-brand-botanical pt-2">
                  V60 • Chemex • Aeropress • Prensa Francesa
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-brand-latte-border shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-brand-latte flex items-center justify-center text-brand-amber">
                  <Flame className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-lg text-brand-espresso">Bebidas Frías</h3>
                <p className="text-xs text-brand-espresso/70 leading-relaxed">
                  Extracciones en frío de más de 16 horas y combinaciones refrescantes para tardes cálidas.
                </p>
                <div className="text-[11px] font-semibold text-brand-amber pt-2">
                  Cold Brew • Iced Latte • Tonic Coffee • Affogato
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-brand-latte-border shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-brand-latte flex items-center justify-center text-brand-espresso">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-lg text-brand-espresso">Café para Llevar</h3>
                <p className="text-xs text-brand-espresso/70 leading-relaxed">
                  Bolsas en grano o molido al momento según el método que utilices en tu hogar u oficina.
                </p>
                <div className="text-[11px] font-semibold text-brand-espresso pt-2">
                  Presentaciones de 250g y 500g
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
