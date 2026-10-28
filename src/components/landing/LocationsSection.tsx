import { MapPin } from "lucide-react";
import { TituloSeccion, FotoPendiente } from "./Botanica";

interface Casa {
  tipo: string;
  nombre: string;
  direccion: string;
  foto: string;
  mapa: string;
  pedidos?: string;
}

// Horario de ambas casas según el Instagram de Ricuras
const HORARIO = [
  { dias: "Lunes a sábado", horas: "07:00 – 21:30" },
  { dias: "Domingo", horas: "07:00 – 18:30" },
];

const CASAS: Casa[] = [
  {
    tipo: "Matriz",
    nombre: "San Sebastián",
    direccion: "Calle José Joaquín de Olmedo 16-33 y González Suárez, Loja",
    foto: "Foto: fachada de la matriz",
    mapa: "https://maps.google.com/?q=Ricuras+de+Sal+y+Dulce+Loja+Olmedo",
    pedidos: "https://pedidoiq.app",
  },
  {
    tipo: "Sucursal",
    nombre: "Loja Pádel Club",
    direccion: "Av. Zoilo Rodríguez y Víctor Vivar · Six Wellness Center, Loja",
    foto: "Foto: fachada de vidrio de la sucursal",
    mapa: "https://maps.google.com/?q=Loja+Padel+Club",
  },
];

export function LocationsSection() {
  return (
    <section id="casas" className="py-20 md:py-24 px-4 sm:px-6">
      <div className="max-w-[1240px] mx-auto flex flex-col gap-10">
        <TituloSeccion centrado acento="Te esperamos" titulo="Nuestras dos casas en Loja" />

        <div className="grid gap-7 grid-cols-1 md:grid-cols-2">
          {CASAS.map((c) => (
            <article key={c.nombre} className="bg-white rounded-[26px] overflow-hidden flex flex-col shadow-[0_12px_30px_rgba(2,75,56,0.08)]">
              <FotoPendiente etiqueta={c.foto} className="h-[260px]" />
              <div className="px-7 pt-6 pb-8 flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold tracking-[0.14em] uppercase text-ricuras-tierra">{c.tipo}</span>
                  <h3 className="font-display font-normal uppercase text-[30px] leading-tight text-ricuras-verde">{c.nombre}</h3>
                  <p className="text-[15px] text-[#4F4A40] flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-1 shrink-0 text-ricuras-tierra" aria-hidden="true" />
                    {c.direccion}
                  </p>
                </div>

                <dl className="border-t border-[#E8DFCF]">
                  {HORARIO.map((h) => (
                    <div key={h.dias} className="flex justify-between py-2.5 border-b border-[#E8DFCF] text-[15px]">
                      <dt className="text-[#4F4A40]">{h.dias}</dt>
                      <dd className="font-bold">{h.horas}</dd>
                    </div>
                  ))}
                </dl>

                <div className="flex flex-wrap gap-2.5">
                  <a
                    href={c.mapa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-full bg-ricuras-verde text-ricuras-crema text-sm font-bold hover:bg-ricuras-noche transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ricuras-dorado"
                  >
                    Cómo llegar
                  </a>
                  {c.pedidos && (
                    <a
                      href={c.pedidos}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-[11px] rounded-full border-[1.5px] border-ricuras-verde text-ricuras-verde text-sm font-bold hover:bg-ricuras-menta transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ricuras-dorado"
                    >
                      Pedir a domicilio
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
