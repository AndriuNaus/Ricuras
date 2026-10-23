import Link from "next/link";
import { ArrowRight, MapPin, Coffee, Sparkles, Clock, CheckCircle2 } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:py-24 border-b border-brand-latte-border">
      {/* Fondo sutil con acento botanico */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Contenido principal */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-brand-terracotta/20 bg-brand-terracotta/5 text-brand-terracotta text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cafetería de Especialidad & Gastronomía Típica</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-brand-espresso leading-[1.12]">
              El auténtico sabor lojano en cada taza y bocado.
            </h1>

            <p className="text-base sm:text-lg text-brand-espresso/80 max-w-2xl leading-relaxed">
              Tradición artesanal, café de especialidad de altura y recetas regionales ecuatorianas preparadas con dedicación en el sector histórico de San Sebastián y Six Wellness Center.
            </p>

            {/* Acciones principales */}
            <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto pt-2">
              <Link
                href="#especialidades"
                className="btn-primary w-full sm:w-auto text-center flex items-center justify-center gap-2 group"
              >
                <span>Explorar Especialidades</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="#sedes"
                className="btn-secondary w-full sm:w-auto text-center flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4 text-brand-terracotta" />
                <span>Nuestras Sedes</span>
              </Link>
            </div>

            {/* Credenciales y distintivos */}
            <div className="pt-6 border-t border-brand-latte-border w-full grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium text-brand-espresso/70">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-botanical shrink-0" />
                <span>Granos de Altura Lojanos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-botanical shrink-0" />
                <span>Desayunos Típicos al Instante</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-botanical shrink-0" />
                <span>Ambiente Natural y Acogedor</span>
              </div>
            </div>
          </div>

          {/* Tarjeta de presentacion visual */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Marco decorativo */}
              <div className="relative rounded-3xl bg-white border border-brand-latte-border shadow-xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-brand-latte-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-espresso flex items-center justify-center text-brand-amber">
                      <Coffee className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-serif font-bold text-base text-brand-espresso">
                        Ricuras San Sebastián
                      </p>
                      <p className="text-xs text-brand-espresso/60 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-brand-terracotta" />
                        Calle Olmedo 16-33, Loja
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-brand-botanical/10 text-brand-botanical">
                    Abierto
                  </span>
                </div>

                {/* Resumen de servicio del dia */}
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-brand-latte border border-brand-latte-border space-y-2">
                    <p className="text-xs uppercase font-bold tracking-wider text-brand-terracotta">
                      Recomendación de la Casa
                    </p>
                    <p className="font-serif font-semibold text-lg text-brand-espresso">
                      Tigrillo Lojano con Cecina & Café de Filtro V60
                    </p>
                    <p className="text-xs text-brand-espresso/70">
                      Plátano verde majado artesanalmente, queso fresco regional, huevo y notas aromáticas de café lojano recién tostado.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl border border-brand-latte-border bg-white flex flex-col justify-between">
                      <span className="text-brand-espresso/60 flex items-center gap-1 mb-1">
                        <Clock className="w-3.5 h-3.5 text-brand-terracotta" /> Horario
                      </span>
                      <span className="font-semibold text-brand-espresso">
                        Lunes a Sábado: 07:00 – 22:00
                      </span>
                    </div>
                    <div className="p-3.5 rounded-xl border border-brand-latte-border bg-white flex flex-col justify-between">
                      <span className="text-brand-espresso/60 flex items-center gap-1 mb-1">
                        <Coffee className="w-3.5 h-3.5 text-brand-amber" /> Origen Café
                      </span>
                      <span className="font-semibold text-brand-espresso">
                        100% Arábica de Loja
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-brand-espresso/60">
                  <span>Punto de entrega disponible en PedidoIQ</span>
                  <span className="font-semibold text-brand-espresso">Sector San Sebastián</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
