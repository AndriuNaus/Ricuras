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

    // PDF: abrir ventana de impresión con reporte completo
    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) {
      alert("Permite ventanas emergentes para generar el PDF");
      return;
    }

    const grouped = reportData.reduce((acc, r) => {
      const name = r.employees?.full_name ?? "Desconocido";
      if (!acc[name]) acc[name] = [];
      acc[name].push(r);
      return acc;
    }, {} as Record<string, AttendanceRecord[]>);

    const totalRecords = reportData.length;
    const entradas = reportData.filter(r => r.record_type === "entrada").length;
    const salidas = reportData.filter(r => r.record_type === "salida").length;
    const unicos = new Set(reportData.map(r => r.employeeId)).size;

    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Reporte Asistencia - ${getDateRangeLabel()}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 11px; color: #1a1a1a; line-height: 1.4; padding: 20mm; }
    @page { margin: 15mm; size: A4; }
    header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #C86D3B; padding-bottom: 12px; }
    h1 { font-size: 22px; font-weight: 700; color: #2B1B17; margin-bottom: 4px; }
    .subtitle { font-size: 12px; color: #666; }
    .meta { display: flex; justify-content: space-between; margin: 16px 0; font-size: 11px; color: #444; }
    .meta div { display: flex; gap: 8px; align-items: center; }
    .meta strong { color: #2B1B17; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; page-break-inside: auto; }
    th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; font-size: 10px; }
    th { background: #F5E6D3; color: #2B1B17; font-weight: 600; position: sticky; top: 0; }
    tr:nth-child(even) td { background: #fafafa; }
    .employee-section { page-break-inside: avoid; break-inside: avoid; }
    .employee-name { font-weight: 700; font-size: 11px; color: #2B1B17; padding: 8px 0 4px; border-top: 1px solid #eee; }
    .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px; }
    .summary-card { background: #F5E6D3; border-radius: 8px; padding: 10px; text-align: center; }
    .summary-card .value { font-size: 20px; font-weight: 700; color: #C86D3B; }
    .summary-card .label { font-size: 10px; color: #555; text-transform: uppercase; }
    .entrada { color: #7AB88F; font-weight: 600; }
    .salida { color: #E07A5F; font-weight: 600; }
    .status-ok { color: #7AB88F; }
    .status-late { color: #E07A5F; }
    .status-early { color: #3A86FF; }
    footer { margin-top: 24px; text-align: center; font-size: 9px; color: #999; border-top: 1px solid #eee; padding-top: 8px; }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
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
  ${Object.entries(grouped).map(([emp, records]) => `
    <div class="employee-section">
      <div class="employee-name">${emp}</div>
      <table>
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
              <td class="${r.record_type === "entrada" ? "entrada" : "salida"}">${r.record_type}</td>
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