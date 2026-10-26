export interface ScheduleCardData {
  date: string;
  employeeName: string;
  zoneName: string;
  color: string;
  startTime: string;
  endTime: string;
  notes?: string;
  isDayOff?: boolean;
}

export function shadeColor(hex: string, percent: number) {
  const clean = hex.replace("#", "");
  const num = parseInt(clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean, 16);
  const amt = Math.round(2.55 * percent);
  const r = Math.min(255, Math.max(0, (num >> 16) + amt));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));
  return "#" + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
}

function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

/** Devuelve los días ISO (YYYY-MM-DD) del rango. Para "mes" se pasa dateStr = "YYYY-MM". */
export function rangeDates(dateStr: string, period: "dia" | "semana" | "mes"): string[] {
  if (period === "dia") return [dateStr];
  if (period === "semana") {
    const d = new Date(dateStr + "T12:00:00");
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    return Array.from({ length: 7 }).map((_, i) => {
      const x = new Date(monday);
      x.setDate(monday.getDate() + i);
      return x.toISOString().split("T")[0];
    });
  }
  // mes
  const [y, m] = dateStr.split("-").map(Number);
  const last = new Date(y, m, 0).getDate();
  return Array.from({ length: last }).map((_, i) => `${dateStr}-${String(i + 1).padStart(2, "0")}`);
}

export function filterByRange<T extends ScheduleCardData>(items: T[], dateStr: string, period: "dia" | "semana" | "mes"): T[] {
  const dates = new Set(rangeDates(dateStr, period));
  return items.filter((a) => dates.has(a.date));
}

export function openSchedulePdfPreview(assignments: ScheduleCardData[], rangeLabel: string) {
  const grouped = assignments
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .reduce<Record<string, ScheduleCardData[]>>((acc, a) => {
      (acc[a.date] ||= []).push(a);
      return acc;
    }, {});

  const daySections = Object.entries(grouped)
    .map(([date, items]) => {
      const dt = new Date(date + "T12:00:00");
      const weekday = dt.toLocaleDateString("es-EC", { weekday: "long" });
      const formatted = dt.toLocaleDateString("es-EC", { day: "2-digit", month: "long" });

      // Un card por operario/día, con todas sus jornadas como pills
      const byEmp = items.reduce<Record<string, ScheduleCardData[]>>((acc, a) => {
        (acc[a.employeeName] ||= []).push(a);
        return acc;
      }, {});

      const cards = Object.entries(byEmp)
        .map(([emp, list]) => {
          const first = list[0];
          const dayOff = list.some((a) => a.isDayOff);
          const bg = dayOff
            ? "linear-gradient(135deg,#9CA3AF,#6B7280)"
            : `linear-gradient(135deg, ${first.color}, ${shadeColor(first.color, -28)})`;
          const pills = list
            .map((a, idx) => `J${idx + 1} · ${a.startTime}–${a.endTime}`)
            .map((t) => `<span class="pill">${t}</span>`)
            .join("");
          return `
            <div class="card" style="background:${bg}">
              <div class="card-top">
                <span class="avatar">${dayOff ? "☀" : initials(emp)}</span>
                <div class="min0">
                  <p class="emp">${emp}</p>
                  <p class="zone">${dayOff ? "Día libre" : first.zoneName}</p>
                </div>
                ${dayOff ? `<span class="badge">LIBRE</span>` : ""}
              </div>
              ${dayOff ? "" : `<div class="pills">${pills}</div>`}
              ${first.notes && !dayOff ? `<p class="notes">${first.notes}</p>` : ""}
            </div>`;
        })
        .join("");

      return `<div class="day">
        <div class="day-head"><span class="dw">${weekday}</span><span class="df">${formatted}</span></div>
        <div class="grid">${cards}</div>
      </div>`;
    })
    .join("");

  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Horario — ${rangeLabel}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f5f1ec;padding:24px;color:#2B1B17}
.container{max-width:860px;margin:0 auto;background:#fff;border-radius:24px;padding:32px;border:1px solid #EADFD3;box-shadow:0 10px 40px rgba(43,27,23,.08)}
header{text-align:center;border-bottom:2px solid #C86D3B;padding-bottom:16px;margin-bottom:20px}
h1{font-family:Georgia,serif;font-size:22px}
.sub{color:#8a7a72;font-size:12px;margin-top:4px}
.day{margin-bottom:22px;page-break-inside:avoid}
.day-head{display:flex;align-items:center;justify-content:space-between;background:#F5E6D3;border-radius:14px;padding:10px 16px;margin-bottom:10px}
.dw{font-weight:700;text-transform:capitalize;font-size:14px}
.df{font-size:12px;color:#7a6a60}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:10px}
@media print{.grid{grid-template-columns:repeat(3,1fr)}}
.card{border-radius:18px;padding:12px 14px;color:#fff;box-shadow:0 6px 16px rgba(43,27,23,.22);page-break-inside:avoid;min-height:110px;display:flex;flex-direction:column}
.card-top{display:flex;align-items:flex-start;gap:8px}
.avatar{width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,.22);border:1.5px solid rgba(255,255,255,.35);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0}
.min0{min-width:0;flex:1}
.emp{font-size:12px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.zone{font-size:10px;opacity:.85;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:9px;background:rgba(255,255,255,.25);padding:3px 8px;border-radius:99px;font-weight:700;letter-spacing:.5px}
.pills{display:flex;flex-wrap:wrap;gap:5px;margin-top:10px}
.pill{background:rgba(255,255,255,.22);border-radius:99px;padding:4px 9px;font-family:ui-monospace,monospace;font-size:9.5px;font-weight:600}
.notes{font-size:9.5px;opacity:.85;margin-top:8px;padding-top:7px;border-top:1px solid rgba(255,255,255,.18)}
footer{margin-top:10px;text-align:center;font-size:9px;color:#a99c94;border-top:1px solid #eee;padding-top:10px}
.print-btn{position:fixed;top:18px;right:18px;padding:11px 22px;background:#C86D3B;color:#fff;border:none;border-radius:12px;font-weight:700;cursor:pointer;box-shadow:0 6px 18px rgba(200,109,59,.35);font-size:13px}
.print-btn:hover{background:#b05d2e}
@media print{.print-btn{display:none}body{background:#fff;padding:0}.container{box-shadow:none;border:none;max-width:none}}
</style></head><body>
<button class="print-btn no-print" onclick="window.print()">⬇ Guardar PDF / Imprimir</button>
<div class="container">
  <header>
    <h1>Ricuras de Sal y Dulce</h1>
    <div class="sub">Horario para operarios — ${rangeLabel}</div>
  </header>
  ${daySections || '<p style="text-align:center;color:#a99c94;padding:40px 0">No hay asignaciones en este rango.</p>'}
  <footer>Ricuras de Sal y Dulce — Sistema de Gestión</footer>
</div>
</body></html>`;

  const w = window.open("", "_blank", "width=980,height=760");
  if (!w) {
    alert("Permite ventanas emergentes para ver la vista previa");
    return false;
  }
  w.document.write(html);
  w.document.close();
  return true;
}
