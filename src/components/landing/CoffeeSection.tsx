import { RamaCafe, TituloSeccion, FotoPendiente, Hojita } from "./Botanica";

const BEBIDAS = [
  "Clásicos de espresso: americano, capuchino y latte",
  "Iced coffee para los días de sol",
  "Matcha y bebidas especiales",
];

export function CoffeeSection() {
  return (
    <section id="cafe" className="relative overflow-hidden bg-ricuras-verde text-ricuras-crema">
      <RamaCafe className="absolute -right-8 -bottom-20 w-[240px] h-[480px] text-ricuras-dorado opacity-[0.16] rotate-[20deg]" />

      <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 py-20 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <FotoPendiente oscuro etiqueta="Foto: línea de iced coffee" className="h-[380px] sm:h-[460px] rounded-[28px] order-2 lg:order-1" />

        <div className="flex flex-col gap-5 order-1 lg:order-2">
          <TituloSeccion oscuro acento="Nuestro café" titulo="Café de especialidad, frío o caliente" />
          <p className="text-[17px] text-ricuras-crema/85 max-w-[520px]">
            Preparado al momento por nuestros baristas: clásicos de espresso, iced coffee y matcha para cualquier hora del día.
          </p>
          <ul className="flex flex-col">
            {BEBIDAS.map((b) => (
              <li key={b} className="flex items-center gap-3.5 py-3.5 border-b border-ricuras-dorado-claro/30 font-semibold">
                <Hojita className="w-[22px] h-[22px] shrink-0 text-ricuras-dorado-claro" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
