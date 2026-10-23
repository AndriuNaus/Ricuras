"use client";

import { useState, useEffect } from "react";
import { FileBarChart, Download, FileSpreadsheet, FileText, Calendar, Filter, ChevronDown } from "lucide-react";

interface AttendanceRecord {
  id: string;
  employeeId: string;
  record_type: "entrada" | "salida";
  method: string;
  timestamp: string;
  status: string;
  employees?: { full_name: string };
}

export default function ReportesPage() {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [exportType, setExportType] = useState<"asistencia" | "turnos">("asistencia");
  const [period, setPeriod] = useState<"dia" | "semana" | "mes">("mes");
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<AttendanceRecord[]>([]);

  const fetchData = async (dateRange: { from: string; to: string }) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/attendance?from=${dateRange.from}&to=${dateRange.to}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "No se pudo obtener los datos");
      setReportData(json.data ?? []);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al cargar datos");
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (period === "mes") {
      const [year, month] = selectedMonth.split("-").map(Number);
      const from = `${year}-${String(month).padStart(2, "0")}-01`;
      const to = new Date(year, month, 0).toISOString().split("T")[0];
      fetchData({ from, to });
    } else if (period === "semana") {
      const d = new Date(selectedDate + "T12:00:00");
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(d.setDate(diff));
      const from = monday.toISOString().split("T")[0];
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      const to = sunday.toISOString().split("T")[0];
      fetchData({ from, to });
    } else {
      fetchData({ from: selectedDate, to: selectedDate });
    }
  }, [selectedMonth, period, selectedDate]);

  const getDateRangeLabel = () => {
    if (period === "mes") return selectedMonth;
    if (period === "semana") {
      const d = new Date(selectedDate + "T12:00:00");
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(d.setDate(diff));
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      return `${monday.toLocaleDateString("es-EC", { day: "2-digit", month: "short" })} – ${sunday.toLocaleDateString("es-EC", { day: "2-digit", month: "short", year: "numeric" })}`;
    }
    return new Date(selectedDate + "T12:00:00").toLocaleDateString("es-EC", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
  };

  const handleExport = async (format: "excel" | "pdf") => {
    if (format === "excel") {
      try {
        const res = await fetch(`/api/attendance?from=${reportData[0] ? new Date(reportData[0].timestamp).toISOString().split("T")[0] : selectedMonth}&to=${reportData[reportData.length - 1] ? new Date(reportData[reportData.length - 1].timestamp).toISOString().split("T")[0] : selectedMonth}`, { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "No se pudo obtener los datos");

        const rows = json.data ?? [];
        const header = ["Empleado", "Tipo", "Método", "Fecha/Hora", "Estado"];
        const csv = [
          header.join(","),
          ...rows.map((r: any) =>
            [
              `"${(r.employees?.full_name ?? "").replace(/"/g, '""')}"`,
              r.record_type,
              r.method,
              new Date(r.timestamp).toLocaleString("es-EC"),
              r.status,
            ].join(",")
          ),
        ].join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `asistencia-${getDateRangeLabel().replace(/\s/g, "")}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Error al exportar");
      }
      return;
    }

    // PDF: vista previa con tarjetas estilo UI (gradiente, avatar, etc.)
    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) {
      alert("Permite ventanas emergentes para generar el PDF");
      return;
    }

    const groupedByDay = reportData.reduce((acc, r) => {
      const date = new Date(r.timestamp).toISOString().split("T")[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(r);
      return acc;
    }, {} as Record<string, AttendanceRecord[]>);

    const groupedByEmp = reportData.reduce((acc, r) => {
      const name = r.employees?.full_name ?? "Desconocido";
      if (!acc[name]) acc[name] = [];
      acc[name].push(r);
      return acc;
    }, {} as Record<string, AttendanceRecord[]>);

    const totalRecords = reportData.length;
    const entradas = reportData.filter(r => r.record_type === "entrada").length;
    const salidas = reportData.filter(r => r.record_type === "salida").length;
    const unicos = new Set(reportData.map(r => r.employeeId)).size;

    const initials = (name: string) => name.split(" ").filter(Boolean).slice(0, 2).map(n => n[0]).join("").toUpperCase();
    const shadeColor = (hex: string, percent: number) => {
      const clean = hex.replace("#", "");
      const num = parseInt(clean.length === 3 ? clean.split("").map(c => c + c).join("") : clean, 16);
      const amt = Math.round(2.55 * percent);
      const r = Math.min(255, Math.max(0, (num >> 16) + amt));
      const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
      const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));
      return "#" + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
    };

    // Colores por zona/turno (simulados)
    const zoneColors: Record<string, string> = {
      "entrada": "#C86D3B",
      "salida": "#7AB88F",
      "manual": "#3A86FF",
      "camara": "#E07A5F",
      "whatsapp": "#9B59B6",
    };

    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Reporte Asistencia - ${getDateRangeLabel()}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 11px; color: #1a1a1a; line-height: 1.4; background: #f5f5f5; padding: 20px; }
    @page { margin: 15mm; size: A4; }
    @media print {
      body { background: white; padding: 0; }
      .no-print { display: none; }
    }
    .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    header { text-align: center; margin-bottom: 24px; border-bottom: 3px solid #C86D3B; padding-bottom: 16px; }
    h1 { font-size: 24px; font-weight: 700; color: #2B1B17; margin-bottom: 4px; font-family: Georgia, serif; }
    .subtitle { font-size: 13px; color: #666; }
    .meta { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin: 20px 0; font-size: 11px; color: #444; }
    .meta div { display: flex; gap: 8px; align-items: center; background: #F5E6D3; padding: 8px 12px; border-radius: 8px; }
    .meta strong { color: #2B1B17; }
    .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
    .summary-card { background: linear-gradient(135deg, #F5E6D3, #E8D5C4); border-radius: 12px; padding: 16px; text-align: center; border: 1px solid #DCC4B0; }
    .summary-card .value { font-size: 24px; font-weight: 700; color: #C86D3B; line-height: 1; }
    .summary-card .label { font-size: 10px; color: #555; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }
    .section-title { font-size: 14px; font-weight: 700; color: #2B1B17; margin: 24px 0 12px; padding-bottom: 8px; border-bottom: 2px solid #E8D5C4; font-family: Georgia, serif; }
    .day-section { margin-bottom: 24px; page-break-inside: avoid; }
    .day-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; padding: 10px 14px; background: linear-gradient(135deg, #2B1B17, #1a100d); color: white; border-radius: 10px; }
    .day-header .date { font-size: 16px; font-weight: 700; }
    .day-header .weekday { font-size: 12px; opacity: 0.8; text-transform: uppercase; }
    .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
    .card { border-radius: 16px; padding: 16px; color: white; box-shadow: 0 4px 12px rgba(0,0,0,0.12); transition: transform 0.2s; position: relative; overflow: hidden; min-height: 140px; display: flex; flex-direction: column; }
    .card::before { content: ""; position: absolute; top: -30px; right: -30px; width: 80px; height: 80px; border-radius: 50%; background: rgba(255,255,255,0.1); }
    .card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 10px; }
    .card-avatar { width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.2); border: 2px solid rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
    .card-info { flex: 1; min-width: 0; }
    .card-name { font-size: 13px; font-weight: 700; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .card-zone { font-size: 10px; opacity: 0.85; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .card-actions { opacity: 0; transition: opacity 0.2s; }
    .card:hover .card-actions { opacity: 1; }
    .card-time { margin-top: auto; padding-top: 8px; }
    .time-pill { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.2); padding: 6px 10px; border-radius: 20px; font-size: 10px; font-family: monospace; font-weight: 600; }
    .time-pill.entrada { background: rgba(122, 184, 143, 0.3); }
    .time-pill.salida { background: rgba(224, 122, 95, 0.3); }
    .card-notes { font-size: 10px; opacity: 0.8; margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.15); line-height: 1.3; }
    .day-libre { background: linear-gradient(135deg, #9CA3AF, #6B7280); }
    .day-libre .time-pill { background: rgba(255,255,255,0.2); }
    .records-table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 10px; }
    .records-table th, .records-table td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; }
    .records-table th { background: #F5E6D3; color: #2B1B17; font-weight: 600; }
    .records-table tr:nth-child(even) td { background: #fafafa; }
    .entrada-badge { color: #7AB88F; font-weight: 600; }
    .salida-badge { color: #E07A5F; font-weight: 600; }
    .status-ok { color: #7AB88F; }
    .status-late { color: #E07A5F; }
    .status-early { color: #3A86FF; }
    footer { margin-top: 30px; text-align: center; font-size: 9px; color: #999; border-top: 1px solid #eee; padding-top: 12px; }
    .print-btn { position: fixed; top: 20px; right: 20px; padding: 12px 24px; background: #C86D3B; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px rgba(200,109,59,0.3); z-index: 100; }
    .print-btn:hover { background: #b05d33; }
    @media print {
      .print-btn { display: none; }
      .container { box-shadow: none; padding: 0; max-width: none; }
      .cards-grid { display: grid; grid-template-columns: repeat(3, 1fr); }
    }
  </style>
</head>
<body>
  <button class="print-btn no-print" onclick="window.print()">Imprimir / Guardar PDF</button>
  <div class="container">
    <header>
      <h1>Ricuras de Sal y Dulce</h1>
      <div class="subtitle">Reporte de Asistencia — ${getDateRangeLabel()}</div>
    </header>
    <div class="meta">
      <div><strong>Período:</strong> ${getDateRangeLabel()}</div>
      <div><strong>Generado:</strong> ${new Date().toLocaleString("es-EC")}</div>
    </div>
    <div class="summary">
      <div class="summary-card"><div class="value">${unicos}</div><div class="label">Operarios</div></div>
      <div class="summary-card"><div class="value">${totalRecords}</div><div class="label">Registros totales</div></div>
      <div class="summary-card"><div class="value entrada">${entradas}</div><div class="label">Entradas</div></div>
      <div class="summary-card"><div class="value salida">${salidas}</div><div class="label">Salidas</div></div>
    </div>

    <!-- Vista por día con tarjetas -->
    <h2 class="section-title">Resumen por Día (Estilo Tarjetas)</h2>
    ${Object.entries(groupedByDay).sort(([a], [b]) => a.localeCompare(b)).map(([date, records]) => {
      const dt = new Date(date + "T12:00:00");
      const weekday = dt.toLocaleDateString("es-EC", { weekday: "long" });
      const formattedDate = dt.toLocaleDateString("es-EC", { day: "2-digit", month: "long", year: "numeric" });
      
      // Agrupar por operario para este día
      const byEmp = records.reduce((acc, r) => {
        const name = r.employees?.full_name ?? "Desconocido";
        if (!acc[name]) acc[name] = { entrada: [], salida: [], method: r.method };
        acc[name][r.record_type].push(r);
        return acc;
      }, {} as Record<string, { entrada: AttendanceRecord[]; salida: AttendanceRecord[]; method: string }>);

      return `
      <div class="day-section">
        <div class="day-header">
          <div>
            <div class="date">${formattedDate}</div>
            <div class="weekday">${weekday}</div>
          </div>
        </div>
        <div class="cards-grid">
          ${Object.entries(byEmp).map(([emp, data]) => {
            const firstRecord = data.entrada[0] || data.salida[0];
            const color = zoneColors[data.method] || "#C86D3B";
            const darkerColor = shadeColor(color, -25);
            const hasEntrada = data.entrada.length > 0;
            const hasSalida = data.salida.length > 0;
            const entradaTime = hasEntrada ? new Date(data.entrada[0].timestamp).toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" }) : "--:--";
            const salidaTime = hasSalida ? new Date(data.salida[0].timestamp).toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" }) : "--:--";
            
            return `
            <div class="card" style="background: linear-gradient(135deg, ${color}, ${darkerColor});">
              <div class="card-header">
                <div class="flex items-center gap-3">
                  <div class="card-avatar">${initials(emp)}</div>
                  <div class="card-info">
                    <div class="card-name">${emp}</div>
                    <div class="card-zone">${data.method}</div>
                  </div>
                </div>
              </div>
              <div class="card-time">
                <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                  ${hasEntrada ? `<span class="time-pill entrada"><span>⬇</span> Entrada: ${entradaTime}</span>` : ""}
                  ${hasSalida ? `<span class="time-pill salida"><span>⬆</span> Salida: ${salidaTime}</span>` : ""}
                  ${!hasEntrada && !hasSalida ? `<span class="time-pill">Sin registros</span>` : ""}
                </div>
              </div>
            </div>
            `;
          }).join("")}
        </div>
      </div>
      `;
    }).join("")}

    <!-- Detalle completo por operario (tabla) -->
    <h2 class="section-title">Detalle Completo por Operario</h2>
    ${Object.entries(groupedByEmp).map(([emp, records]) => `
      <div class="employee-section" style="page-break-inside: avoid; margin-bottom: 20px;">
        <div style="font-weight: 700; font-size: 12px; color: #2B1B17; padding: 10px 0 6px; border-bottom: 2px solid #E8D5C4; margin-bottom: 8px;">${emp}</div>
        <table class="records-table">
          <thead>
            <tr>
              <th style="width:20%">Fecha</th>
              <th style="width:12%">Hora</th>
              <th style="width:18%">Tipo</th>
              <th style="width:18%">Método</th>
              <th style="width:18%">Estado</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            ${records.map(r => {
              const dt = new Date(r.timestamp);
              return `
              <tr>
                <td>${dt.toLocaleDateString("es-EC", { day: "2-digit", month: "short", weekday: "short" })}</td>
                <td>${dt.toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" })}</td>
                <td class="${r.record_type === "entrada" ? "entrada-badge" : "salida-badge"}">${r.record_type}</td>
                <td>${r.method}</td>
                <td class="status-${r.status?.toLowerCase() || "ok"}">${r.status}</td>
                <td></td>
              </tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>
    `).join("")}

    <footer>
      Generado automáticamente por Ricuras de Sal y Dulce — Sistema de Gestión
    </footer>
    <script>
      window.onload = function() { window.print(); window.onafterprint = function() { window.close(); }; };
    </script>
  </div>
</body>
</html>`;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-latte-border">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-espresso">
            Reportes & Exportables
          </h1>
          <p className="text-xs sm:text-sm text-brand-espresso/70 mt-0.5">
            Generación consolidada de horas trabajadas, retrasos y asignación de turnos.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reporte de Asistencia */}
        <div className="p-8 rounded-3xl bg-white border border-brand-latte-border shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-latte flex items-center justify-center text-brand-terracotta">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-xl text-brand-espresso">
              Reporte de Asistencia
            </h3>
            <p className="text-xs text-brand-espresso/70 leading-relaxed">
              Consolidado con desglose de días asistidos, horas totales de jornada, minutos de margen y retrasos calculados.
            </p>

            <div className="space-y-3 pt-2">
              {/* Selector período */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-espresso mb-1">
                  Período
                </label>
                <div className="flex flex-wrap gap-2">
                  {(["dia", "semana", "mes"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriod(p)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        period === p
                          ? "bg-brand-terracotta text-white shadow-sm"
                          : "bg-brand-latte/50 text-brand-espresso/70 hover:bg-brand-latte"
                      }`}
                    >
                      {p === "dia" ? "Día" : p === "semana" ? "Semana" : "Mes"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector fecha según período */}
              {(period === "dia" || period === "semana") && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-espresso mb-1">
                    {period === "dia" ? "Fecha" : "Semana (cualquier día)"}
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-brand-latte-border bg-brand-latte/30 text-xs text-brand-espresso font-medium"
                  />
                </div>
              )}

              {period === "mes" && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-espresso mb-1">
                    Mes de Evaluación
                  </label>
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-brand-latte-border bg-brand-latte/30 text-xs text-brand-espresso font-medium"
                  />
                </div>
              )}

              {loading && <p className="text-xs text-brand-terracotta">Cargando datos...</p>}
            </div>
          </div>

          <div className="pt-4 border-t border-brand-latte-border flex flex-wrap gap-3">
            <button
              onClick={() => handleExport("excel")}
              disabled={loading}
              type="button"
              className="btn-primary text-xs py-2.5 px-4 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Excel (.csv)</span>
            </button>
            <button
              onClick={() => handleExport("pdf")}
              disabled={loading}
              type="button"
              className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-brand-espresso" />
              <span>Exportar PDF ({period === "mes" ? "Mes" : period === "semana" ? "Semana" : "Día"})</span>
            </button>
          </div>
        </div>

        {/* Reporte de Asignacion de Tareas */}
        <div className="p-8 rounded-3xl bg-white border border-brand-latte-border shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-latte flex items-center justify-center text-brand-mint-dark">
              <FileBarChart className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-xl text-brand-espresso">
              Historial de Asignaciones y Turnos
            </h3>
            <p className="text-xs text-brand-espresso/70 leading-relaxed">
              Resumen de ocupación por zona operativa (Barra, Piso 1, Cocina, Terraza y Sede Pádel) para balancear la carga de trabajo.
            </p>

            <div className="pt-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-espresso mb-1">
                Tipo de Turno
              </label>
              <select className="w-full p-2.5 rounded-lg border border-brand-latte-border bg-brand-latte/30 text-xs text-brand-espresso font-medium">
                <option>Todos los turnos y zonas</option>
                <option>Solo Sede Matriz San Sebastián</option>
                <option>Solo Sede Loja Pádel Club</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-brand-latte-border flex flex-wrap gap-3">
            <button
              onClick={() => handleExport("excel")}
              type="button"
              className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-brand-terracotta" />
              <span>Exportar Resumen</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}