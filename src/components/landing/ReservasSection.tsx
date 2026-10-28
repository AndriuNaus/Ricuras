"use client";

import { useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";
import { RamaCafe, TituloSeccion } from "./Botanica";

/**
 * Reservas por WhatsApp: el cliente llena el formulario y se abre WhatsApp
 * con el mensaje listo para enviar al restaurante. No guarda datos en la web.
 * Número en .env: NEXT_PUBLIC_WHATSAPP_RESERVAS (formato internacional sin "+", ej. 5939XXXXXXXX).
 */
const NUMERO_WHATSAPP = (process.env.NEXT_PUBLIC_WHATSAPP_RESERVAS ?? "").replace(/\D/g, "");

const CASAS = ["Matriz · San Sebastián", "Sucursal · Loja Pádel Club"];

/** Fecha de hoy (YYYY-MM-DD) en hora de Ecuador, para no permitir fechas pasadas. */
function hoyEC() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Guayaquil" }).format(new Date());
}

/** Horas disponibles cada 30 min, hasta 1 h antes del cierre (Lun–Sáb 21:30, Dom 18:30). */
function horasDisponibles(fecha: string) {
  const esDomingo = fecha ? new Date(`${fecha}T12:00:00`).getDay() === 0 : false;
  const ultima = esDomingo ? 17 * 60 + 30 : 20 * 60 + 30;
  const horas: string[] = [];
  for (let m = 7 * 60; m <= ultima; m += 30) {
    horas.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
  }
  return horas;
}

function fechaLegible(fecha: string) {
  return new Date(`${fecha}T12:00:00`).toLocaleDateString("es-EC", { weekday: "long", day: "numeric", month: "long" });
}

const campo =
  "w-full rounded-xl border border-[#D9CFBC] bg-white px-4 py-3 text-[15px] text-ricuras-carbon focus:outline-none focus:border-ricuras-verde focus:ring-2 focus:ring-ricuras-verde/20";
const etiqueta = "text-sm font-semibold text-ricuras-carbon";

export function ReservasSection() {
  const [nombre, setNombre] = useState("");
  const [casa, setCasa] = useState(CASAS[0]);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [personas, setPersonas] = useState("2");
  const [nota, setNota] = useState("");
  const [error, setError] = useState("");

  const horas = useMemo(() => horasDisponibles(fecha), [fecha]);

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nombre.trim() || !fecha || !hora) {
      setError("Completa tu nombre, la fecha y la hora.");
      return;
    }
    if (fecha < hoyEC()) {
      setError("La fecha no puede ser anterior a hoy.");
      return;
    }
    if (!NUMERO_WHATSAPP) {
      setError("Las reservas por WhatsApp aún no están configuradas. Escríbenos por Instagram.");
      return;
    }

    const mensaje = [
      "¡Hola Ricuras! Quisiera reservar una mesa:",
      `• Nombre: ${nombre.trim()}`,
      `• Casa: ${casa}`,
      `• Fecha: ${fechaLegible(fecha)}`,
      `• Hora: ${hora}`,
      `• Personas: ${personas}`,
      nota.trim() ? `• Nota: ${nota.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="reservas" className="relative overflow-hidden bg-ricuras-verde text-ricuras-crema">
      <RamaCafe className="absolute -left-10 top-6 w-[240px] h-[480px] text-ricuras-dorado opacity-[0.16] -rotate-[12deg]" />

      <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 py-20 md:py-24 grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 items-center">
        <div className="flex flex-col gap-5">
          <TituloSeccion oscuro acento="Te guardamos un lugar" titulo="Reserva tu mesa" />
          <p className="text-[17px] text-ricuras-crema/85 max-w-[460px]">
            Para desayunos, reuniones o celebraciones. Llena tus datos y te confirmamos la reserva por WhatsApp.
          </p>
          <ol className="flex flex-col gap-3 pt-2">
            {["Completa el formulario", "Se abre WhatsApp con tu mensaje listo", "Te confirmamos la reserva"].map((paso, i) => (
              <li key={paso} className="flex items-center gap-3.5 font-semibold">
                <span className="w-9 h-9 shrink-0 rounded-full border-[1.5px] border-ricuras-dorado text-ricuras-dorado-claro flex items-center justify-center font-display text-lg">
                  {i + 1}
                </span>
                {paso}
              </li>
            ))}
          </ol>
        </div>

        <form
          onSubmit={enviar}
          noValidate
          className="bg-ricuras-crema text-ricuras-carbon rounded-[26px] p-6 sm:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.25)] grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className={etiqueta}>Nombre</span>
            <input className={campo} value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" maxLength={80} required />
          </label>

          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className={etiqueta}>Casa</span>
            <select className={campo} value={casa} onChange={(e) => setCasa(e.target.value)}>
              {CASAS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={etiqueta}>Fecha</span>
            <input
              type="date"
              className={campo}
              value={fecha}
              min={hoyEC()}
              onChange={(e) => {
                setFecha(e.target.value);
                setHora("");
              }}
              required
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={etiqueta}>Hora</span>
            <select className={campo} value={hora} onChange={(e) => setHora(e.target.value)} required>
              <option value="">Elige una hora</option>
              {horas.map((h) => (
                <option key={h}>{h}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className={etiqueta}>Personas</span>
            <select className={campo} value={personas} onChange={(e) => setPersonas(e.target.value)}>
              {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((n) => (
                <option key={n} value={n}>
                  {n} {n === "1" ? "persona" : "personas"}
                </option>
              ))}
              <option value="Más de 12">Más de 12 personas</option>
            </select>
          </label>

          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className={etiqueta}>
              Nota <span className="font-normal text-[#6B6457]">(opcional)</span>
            </span>
            <textarea
              className={`${campo} min-h-[88px] resize-y`}
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              maxLength={300}
              placeholder="Cumpleaños, silla para bebé, etc."
            />
          </label>

          {error && (
            <p role="alert" className="sm:col-span-2 text-sm font-semibold text-[#9B2C1F] bg-[#F9E3DE] rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="sm:col-span-2 inline-flex items-center justify-center gap-2.5 py-4 rounded-full bg-ricuras-verde text-ricuras-crema font-bold hover:bg-ricuras-noche transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ricuras-dorado focus-visible:ring-offset-2"
          >
            <MessageCircle className="w-5 h-5" aria-hidden="true" />
            Reservar por WhatsApp
          </button>
        </form>
      </div>
    </section>
  );
}
