/**
 * Utilidades de fecha en la zona horaria del restaurante (Loja, Ecuador).
 * Ecuador continental está en UTC-5 todo el año (sin horario de verano),
 * por eso el desfase es fijo. Nunca usar toISOString() para obtener "el día":
 * devuelve la fecha en UTC y después de las 19:00 ya marca el día siguiente.
 */
export const ZONA_HORARIA = "America/Guayaquil";
export const OFFSET_EC = "-05:00";

/** Fecha YYYY-MM-DD de un instante, vista en hora de Ecuador. */
export function fechaEC(instante: Date | string = new Date()): string {
  const d = typeof instante === "string" ? new Date(instante) : instante;
  // en-CA formatea como YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: ZONA_HORARIA,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

/** Fecha de hoy (YYYY-MM-DD) en Ecuador, sin importar dónde corra el código. */
export function hoyEC(): string {
  return fechaEC(new Date());
}

/** Inicio del día en Ecuador, listo para filtrar columnas timestamptz. */
export function inicioDiaEC(fecha: string): string {
  return `${fecha}T00:00:00${OFFSET_EC}`;
}

/** Fin del día en Ecuador, listo para filtrar columnas timestamptz. */
export function finDiaEC(fecha: string): string {
  return `${fecha}T23:59:59.999${OFFSET_EC}`;
}

/** Último día (YYYY-MM-DD) de un mes "YYYY-MM", sin depender de la zona horaria. */
export function ultimoDiaMes(mes: string): string {
  const [y, m] = mes.split("-").map(Number);
  // Día 0 del mes siguiente = último día del mes; se calcula en UTC para no desfasar
  const ultimo = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return `${mes}-${String(ultimo).padStart(2, "0")}`;
}
