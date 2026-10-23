"use client";

import { useState } from "react";
import { FileBarChart, Download, FileSpreadsheet, FileText, Calendar, Filter } from "lucide-react";

export default function ReportesPage() {
  const [selectedMonth, setSelectedMonth] = useState("2026-10");
  const [exportType, setExportType] = useState<"asistencia" | "turnos">("asistencia");

  const handleExport = async (format: "excel" | "pdf") => {
    if (format === "pdf") {
      window.print();
      return;
    }

    try {
      const res = await fetch(`/api/attendance?month=${selectedMonth}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "No se pudo obtener los datos");

      const rows = json.data ?? [];
      const header = ["Empleado", "Tipo", "Metodo", "Fecha/Hora", "Estado"];
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
      a.download = `asistencia-${selectedMonth}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al exportar");
    }
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
              Reporte Mensual de Asistencia
            </h3>
            <p className="text-xs text-brand-espresso/70 leading-relaxed">
              Consolidado con desglose de días asistidos, horas totales de jornada, minutos de margen y retrasos calculados.
            </p>

            <div className="pt-2">
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
          </div>

          <div className="pt-4 border-t border-brand-latte-border flex flex-wrap gap-3">
            <button
              onClick={() => handleExport("excel")}
              type="button"
              className="btn-primary text-xs py-2.5 px-4 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Excel (.xlsx)</span>
            </button>
            <button
              onClick={() => handleExport("pdf")}
              type="button"
              className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-brand-espresso" />
              <span>Exportar PDF</span>
            </button>
          </div>
        </div>

        {/* Reporte de Asignacion de Tareas */}
        <div className="p-8 rounded-3xl bg-white border border-brand-latte-border shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-latte flex items-center justify-center text-brand-botanical">
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
