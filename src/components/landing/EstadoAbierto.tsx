"use client";

import { useEffect, useState } from "react";

/**
 * Indica si Ricuras está abierto ahora, en hora de Ecuador.
 * Horario de ambas casas (Instagram): Lun–Sáb 07:00–21:30, Dom 07:00–18:30.
 * Se calcula en el navegador (useEffect) para no desfasar con el servidor.
 */
function calcularEstado(ahora: Date) {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Guayaquil",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(ahora);
  const dia = partes.find((p) => p.type === "weekday")?.value;
  const hora = Number(partes.find((p) => p.type === "hour")?.value) % 24;
  const minuto = Number(partes.find((p) => p.type === "minute")?.value);
  const minutos = hora * 60 + minuto;

  const esDomingo = dia === "Sun";
  const apertura = 7 * 60;
  const cierre = esDomingo ? 18 * 60 + 30 : 21 * 60 + 30;
  const horario = esDomingo ? "Domingo 07:00 – 18:30" : "Lun – Sáb 07:00 – 21:30";

  return { abierto: minutos >= apertura && minutos < cierre, horario };
}

export function EstadoAbierto() {
  const [estado, setEstado] = useState<{ abierto: boolean; horario: string } | null>(null);

  useEffect(() => {
    setEstado(calcularEstado(new Date()));
    const id = setInterval(() => setEstado(calcularEstado(new Date())), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-ricuras-crema text-ricuras-noche rounded-2xl px-5 py-4 shadow-[0_18px_40px_rgba(0,0,0,0.28)] flex items-center gap-3.5">
      <span
        aria-hidden="true"
        className={`w-3 h-3 rounded-full ${estado === null ? "bg-ricuras-arena" : estado.abierto ? "bg-[#2E9E5B]" : "bg-[#B4552D]"}`}
      />
      <span className="flex flex-col leading-snug">
        <span className="font-bold text-[15px]">
          {estado === null ? "Horario de atención" : estado.abierto ? "Abierto ahora" : "Cerrado ahora"}
        </span>
        <span className="text-[13px] text-[#3D4A44]">{estado?.horario ?? "Lun – Sáb 07:00 – 21:30"}</span>
      </span>
    </div>
  );
}
