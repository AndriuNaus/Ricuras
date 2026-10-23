import { Image as ImageIcon, Video, Instagram, ArrowUpRight } from "lucide-react";

export function MediaPlaceholder() {
  return (
    <section id="experiencia" className="py-16 md:py-24 bg-brand-latte border-b border-brand-latte-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs uppercase font-bold tracking-widest text-brand-terracotta">
              Galería & Redes Oficiales
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-espresso">
              La experiencia Ricuras en imágenes.
            </h2>
            <p className="text-sm sm:text-base text-brand-espresso/70">
              Capturas reales de nuestros platos, arte latte, espacios botánicos y el ambiente diario que compartimos con nuestra comunidad.
            </p>
          </div>

          <a
            href="https://www.instagram.com/ricurasdesalydulce/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-brand-espresso text-brand-espresso text-xs font-semibold uppercase tracking-wider hover:bg-brand-espresso hover:text-white transition-colors self-start md:self-auto"
          >
            <Instagram className="w-4 h-4 text-brand-terracotta" />
            <span>Seguir en Instagram</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Grilla visual lista para recibir fotos y videos de alta resolucion */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group relative rounded-2xl border border-brand-latte-border bg-white p-6 shadow-sm flex flex-col justify-between min-h-[220px] hover:border-brand-terracotta/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-brand-latte flex items-center justify-center text-brand-espresso">
              <ImageIcon className="w-5 h-5 text-brand-amber" />
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase font-semibold text-brand-terracotta">Platos Típicos</p>
              <h4 className="font-serif font-bold text-base text-brand-espresso">Bolones & Tigrillo</h4>
              <p className="text-xs text-brand-espresso/70">
                Texturas doradas y preparación al momento en mesa.
              </p>
            </div>
          </div>

          <div className="group relative rounded-2xl border border-brand-latte-border bg-white p-6 shadow-sm flex flex-col justify-between min-h-[220px] hover:border-brand-terracotta/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-brand-latte flex items-center justify-center text-brand-espresso">
              <Coffee className="w-5 h-5 text-brand-terracotta" />
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase font-semibold text-brand-terracotta">Barismo & Latte Art</p>
              <h4 className="font-serif font-bold text-base text-brand-espresso">Café de Especialidad</h4>
              <p className="text-xs text-brand-espresso/70">
                Extracciones precisas y emulsión sedosa de leche.
              </p>
            </div>
          </div>

          <div className="group relative rounded-2xl border border-brand-latte-border bg-white p-6 shadow-sm flex flex-col justify-between min-h-[220px] hover:border-brand-terracotta/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-brand-latte flex items-center justify-center text-brand-espresso">
              <Video className="w-5 h-5 text-brand-botanical" />
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase font-semibold text-brand-botanical">Ambiente Vivo</p>
              <h4 className="font-serif font-bold text-base text-brand-espresso">Rincones Botánicos</h4>
              <p className="text-xs text-brand-espresso/70">
                Decoración con plantas naturales en San Sebastián.
              </p>
            </div>
          </div>

          <div className="group relative rounded-2xl border border-brand-latte-border bg-white p-6 shadow-sm flex flex-col justify-between min-h-[220px] hover:border-brand-terracotta/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-brand-latte flex items-center justify-center text-brand-espresso">
              <ImageIcon className="w-5 h-5 text-brand-espresso" />
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase font-semibold text-brand-espresso">Repostería Casera</p>
              <h4 className="font-serif font-bold text-base text-brand-espresso">Waffles & Postres</h4>
              <p className="text-xs text-brand-espresso/70">
                Horneados diarios con ingredientes frescos seleccionados.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 rounded-xl border border-dashed border-brand-latte-border bg-brand-latte/50 text-center text-xs text-brand-espresso/70">
          Módulo preparado para visualización de catálogo multimedia en alta definición (fotos y videos institucionales).
        </div>
      </div>
    </section>
  );
}

function Coffee(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 2v2" />
      <path d="M14 2v2" />
      <path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h12Z" />
      <path d="M6 2v2" />
    </svg>
  );
}
