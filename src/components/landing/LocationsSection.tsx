import { MapPin, Clock, Phone, ExternalLink } from "lucide-react";

export function LocationsSection() {
  return (
    <section id="sedes" className="py-16 md:py-24 bg-white border-b border-brand-latte-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <p className="text-xs uppercase font-bold tracking-widest text-brand-terracotta">
            Puntos de Encuentro
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-espresso">
            Nuestras sedes en la ciudad de Loja.
          </h2>
          <p className="text-sm sm:text-base text-brand-espresso/70">
            Encuéntranos en el corazón tradicional de San Sebastián o en nuestras instalaciones deportivas en Six Wellness Center.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sede Matriz San Sebastian */}
          <div className="p-8 rounded-3xl bg-brand-latte/60 border border-brand-latte-border flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-terracotta/10 text-brand-terracotta border border-brand-terracotta/20">
                Sede Matriz • San Sebastián
              </div>

              <h3 className="font-serif font-bold text-2xl text-brand-espresso">
                Cafetería & Salón Principal
              </h3>

              <p className="text-sm text-brand-espresso/80 leading-relaxed">
                Ubicada en una de las zonas más emblemáticas y tradicionales de Loja, a pocos pasos de la Calle Lourdes. Un espacio acogedor decorado con vegetación natural, ideal para desayunos familiares, reuniones de trabajo o un café por la tarde.
              </p>

              <div className="space-y-3 pt-2 text-xs sm:text-sm text-brand-espresso">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-brand-terracotta shrink-0 mt-0.5" />
                  <span>Calle José Joaquín de Olmedo 16-33 y González Suárez, Loja, Ecuador</span>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-brand-terracotta shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Lunes a Sábado: 07:00 – 22:00</p>
                    <p className="text-brand-espresso/70">Domingos: 07:00 – 18:30</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-brand-terracotta shrink-0" />
                  <span>+593 7-258-3041</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-brand-latte-border flex flex-wrap gap-3">
              <a
                href="https://maps.google.com/?q=Ricuras+de+Sal+y+Dulce+Loja+Olmedo"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-xs flex items-center gap-2 py-2.5 px-4"
              >
                <span>Cómo Llegar</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://pedidoiq.app"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-xs flex items-center gap-2 py-2.5 px-4"
              >
                <span>Pedir a Domicilio</span>
              </a>
            </div>
          </div>

          {/* Sede Loja Padel Club */}
          <div className="p-8 rounded-3xl bg-brand-latte/60 border border-brand-latte-border flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-botanical/10 text-brand-botanical border border-brand-botanical/20">
                Sede Deportiva & Wellness
              </div>

              <h3 className="font-serif font-bold text-2xl text-brand-espresso">
                Loja Pádel Club / Six Wellness Center
              </h3>

              <p className="text-sm text-brand-espresso/80 leading-relaxed">
                Diseñado para acompañar tus jornadas de entrenamiento y recreación deportiva. Disfruta de un espresso energizante, batidos nutritivos, bolones al paso o snacks frescos antes y después de cada partido.
              </p>

              <div className="space-y-3 pt-2 text-xs sm:text-sm text-brand-espresso">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-brand-botanical shrink-0 mt-0.5" />
                  <span>Av. Zoilo Rodríguez, Complejo Loja Pádel Club, Loja, Ecuador</span>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-brand-botanical shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Lunes a Domingo: Horario extendido</p>
                    <p className="text-brand-espresso/70">Coordinado con torneos y reservas de pistas</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-brand-botanical shrink-0" />
                  <span>Atención en pista y barra deportiva</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-brand-latte-border flex flex-wrap gap-3">
              <a
                href="https://maps.google.com/?q=Loja+Padel+Club"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-xs flex items-center gap-2 py-2.5 px-4"
              >
                <span>Ubicación Pádel Club</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
