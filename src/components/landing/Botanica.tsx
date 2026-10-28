import { ImageIcon } from "lucide-react";

/**
 * Elementos gráficos de la marca Ricuras: ramas de café en línea (como el logo
 * y los posts de Instagram), separadores y espacios para fotos reales.
 */

/** Rama de café dibujada en línea (hojas + granos). Solo decorativa. */
export function RamaCafe({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 240"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
    >
      <path d="M60 238C56 180 64 120 60 6" />
      <path d="M59 206C40 203 25 190 20 170c19 3 34 16 39 36z" />
      <path d="M59 206L28 178" />
      <path d="M61 176c19-3 34-16 39-36-19 3-34 16-39 36z" />
      <path d="M61 176l31-28" />
      <path d="M60 142c-17-3-30-15-34-33 17 3 30 15 34 33z" />
      <path d="M60 142l-27-25" />
      <path d="M61 110c16-3 28-14 32-31-16 3-28 14-32 31z" />
      <path d="M61 110l25-23" />
      <path d="M60 78c-13-3-22-12-25-26 13 3 22 12 25 26z" />
      <path d="M61 52c11-2 19-10 21-21-11 2-19 10-21 21z" />
      <circle cx="52" cy="190" r="4.5" />
      <circle cx="46" cy="196" r="4.5" />
      <circle cx="68" cy="128" r="4" />
      <circle cx="73" cy="134" r="4" />
    </svg>
  );
}

/** Hojita usada en separadores y listas. */
export function Hojita({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 21V9" />
      <path d="M12 15c-3.5-.4-6-2.6-6.6-6 3.5.4 6 2.6 6.6 6z" />
      <path d="M12 12c3.5-.4 6-2.6 6.6-6-3.5.4-6 2.6-6.6 6z" />
    </svg>
  );
}

/** Separador dorado: línea – hojita – línea. */
export function Ornamento({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`flex items-center gap-2.5 text-ricuras-dorado ${className}`}>
      <span className="h-px w-11 bg-current" />
      <Hojita className="w-5 h-5" />
      <span className="h-px w-11 bg-current" />
    </div>
  );
}

/**
 * Marca provisional (taza con brote). Reemplazar por el archivo del logo
 * original de Ricuras (PNG/SVG) cuando el restaurante lo entregue.
 */
export function MarcaRicuras({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M9 17h13v3.5a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6z" />
      <path d="M22 18.5h1.6a2.4 2.4 0 0 1 0 4.8H22" />
      <path d="M15.5 17V5" />
      <path d="M15.5 13c-3.2-.3-5.4-2.2-6-5.2 3.2.3 5.4 2.2 6 5.2z" />
      <path d="M15.5 10c3.2-.3 5.4-2.2 6-5.2-3.2.3-5.4 2.2-6 5.2z" />
      <path d="M15.5 6.5c-1.6-.4-2.6-1.6-2.8-3.2 1.6.4 2.6 1.6 2.8 3.2z" />
    </svg>
  );
}

/** Título de sección: frase a mano + titular grueso + separador. */
export function TituloSeccion({
  acento,
  titulo,
  oscuro = false,
  centrado = false,
}: {
  acento: string;
  titulo: string;
  oscuro?: boolean;
  centrado?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${centrado ? "items-center text-center" : "items-start"}`}>
      <p className={`font-script text-2xl sm:text-[1.7rem] leading-tight ${oscuro ? "text-ricuras-dorado-claro" : "text-ricuras-tierra"}`}>
        {acento}
      </p>
      <h2
        className={`font-display font-normal uppercase leading-none text-[2.4rem] sm:text-5xl lg:text-[3.6rem] ${
          oscuro ? "text-ricuras-crema" : "text-ricuras-verde"
        }`}
      >
        {titulo}
      </h2>
      <Ornamento className="pt-2" />
    </div>
  );
}

/**
 * Espacio reservado para una foto real. Cuando lleguen las fotos del
 * restaurante, cambiar por <Image src="/fotos/..." /> de next/image.
 */
export function FotoPendiente({
  etiqueta,
  oscuro = false,
  className = "",
}: {
  etiqueta: string;
  oscuro?: boolean;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={`Foto pendiente: ${etiqueta}`}
      className={`flex flex-col items-center justify-center gap-2 text-center p-6 ${
        oscuro
          ? "bg-ricuras-noche border-[1.5px] border-dashed border-ricuras-dorado-claro/60 text-ricuras-crema"
          : "bg-ricuras-arena text-[#4A3F2A]"
      } ${className}`}
    >
      <ImageIcon className={`w-8 h-8 ${oscuro ? "text-ricuras-dorado-claro" : "text-[#6B5A3A]"}`} aria-hidden="true" />
      <span className="text-sm font-semibold">{etiqueta}</span>
    </div>
  );
}
