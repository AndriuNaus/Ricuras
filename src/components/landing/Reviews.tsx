import { Star } from "lucide-react";
import { RamaCafe } from "./Botanica";

// Reseñas de Google que el propio restaurante compartió en su Instagram
const RESENAS = [
  {
    texto: "Hay platos innovadores que no los encontrarás en otras cafeterías. Ambiente elegante, tranquilo y servicio rápido.",
    autor: "Fanny V.",
  },
  {
    texto: "Restaurante amplio y luminoso, comida sabrosa a buen precio.",
    autor: "Kevin D.",
  },
];

export function Reviews() {
  return (
    <section aria-labelledby="resenas-titulo" className="relative overflow-hidden bg-ricuras-noche text-ricuras-crema">
      <RamaCafe className="absolute -left-5 -top-16 w-[200px] h-[400px] text-ricuras-dorado opacity-[0.14] rotate-[200deg]" />

      <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 py-20 md:py-[88px] flex flex-col gap-9">
        <h2 id="resenas-titulo" className="text-center font-display font-normal uppercase leading-none text-[2.2rem] sm:text-5xl">
          ¿Qué dicen nuestros clientes?
        </h2>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {RESENAS.map((r) => (
            <figure key={r.autor} className="m-0 bg-ricuras-verde border border-ricuras-dorado-claro/35 rounded-[22px] p-[30px] flex flex-col gap-4">
              <div role="img" aria-label="5 de 5 estrellas" className="flex gap-1 text-ricuras-dorado-claro">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-[18px] h-[18px] fill-current" aria-hidden="true" />
                ))}
              </div>
              <blockquote className="m-0 text-lg leading-relaxed">«{r.texto}»</blockquote>
              <figcaption className="text-sm text-ricuras-crema/75">{r.autor} · Reseña en Google</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
