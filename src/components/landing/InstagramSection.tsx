import { Instagram } from "lucide-react";
import { TituloSeccion, FotoPendiente } from "./Botanica";

const INSTAGRAM_URL = "https://www.instagram.com/ricurasdesalydulce/";

// Publicaciones a mostrar: reemplazar por las fotos reales del restaurante
const POSTS = ["Álbum mundialista", "Nueva sucursal", "Horarios", "Iced coffee", "Festeja a mamá", "Torta de verde"];

export function InstagramSection() {
  return (
    <section id="instagram" className="py-20 md:py-24 px-4 sm:px-6">
      <div className="max-w-[1240px] mx-auto flex flex-col gap-8">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <TituloSeccion acento="Síguenos" titulo="@ricurasdesalydulce" />
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-ricuras-verde text-ricuras-crema text-sm font-bold hover:bg-ricuras-noche transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ricuras-dorado"
          >
            <Instagram className="w-4 h-4" aria-hidden="true" />
            Ver en Instagram
          </a>
        </div>

        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {POSTS.map((p) => (
            <FotoPendiente key={p} etiqueta={`Post: ${p}`} className="aspect-square rounded-2xl !p-3 text-xs" />
          ))}
        </div>
      </div>
    </section>
  );
}
