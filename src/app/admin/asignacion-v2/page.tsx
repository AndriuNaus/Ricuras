"use client";

import { useState, useEffect } from "react";
import { CalendarDays, Copy, Plus, Trash2, X, Loader2 } from "lucide-react";

interface Employee { id: string; full_name: string; }
interface Zone { id: string; name: string; color_hex: string; }
interface Assignment { id: string; date: string; employeeId: string; employeeName: string; zoneId: string; zoneName: string; zoneColor: string; shift: string; notes?: string; }

export default function AsignacionV2Page() {
  const [view, setView] = useState<"dia" | "semana" | "mes">("semana");
  const [baseDate, setBaseDate] = useState(new Date().toISOString().split("T")[0]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [modalDay, setModalDay] = useState<string | null>(null);
  const [form, setForm] = useState({ employeeId: "", zoneId: "", shift: "Mañana (07:00 - 15:00)", notes: "" });

  useEffect(() => {
    (async () => {
      const [er, zr] = await Promise.all([
        fetch("/api/employees", { cache: "no-store" }),
        fetch("/api/zones", { cache: "no-store" }),
      ]);
      const ej = await er.json();
      const zj = await zr.json();
      setEmployees(ej.data ?? []);
      setZones(zj.data ?? []);
      if (ej.data?.length) setForm((f) => ({ ...f, employeeId: ej.data[0].id }));
      if (zj.data?.length) setForm((f) => ({ ...f, zoneId: zj.data[0].id }));
    })();
  }, []);

  const daysOfWeek = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  const daysOfMonth = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  const visibleDays = view === "dia" ? [baseDate] : view === "semana" ? daysOfWeek : daysOfMonth;

  const addAssignment = () => {
    if (!modalDay || !form.employeeId || !form.zoneId) return;
    const emp = employees.find((e) => e.id === form.employeeId);
    const zone = zones.find((z) => z.id === form.zoneId);
    if (!emp || !zone) return;
    const a: Assignment = {
      id: Math.random().toString(36).substring(7),
      date: modalDay,
      employeeId: emp.id,
      employeeName: emp.full_name,
      zoneId: zone.id,
      zoneName: zone.name,
      zoneColor: zone.color_hex,
      shift: form.shift,
      notes: form.notes.trim() || undefined,
    };
    setAssignments((prev) => [...prev, a]);
    setModalDay(null);
    setForm((f) => ({ ...f, notes: "" }));
  };

  const copyDayToWeek = () => {
    if (!modalDay) return;
    const src = assignments.filter((a) => a.date === modalDay);
    const newOnes: Assignment[] = [];
    visibleDays.forEach((day) => {
      if (day === modalDay) return;
      src.forEach((a) => {
        newOnes.push({ ...a, id: Math.random().toString(36).substring(7), date: day });
      });
    });
    setAssignments((prev) => [...prev, ...newOnes]);
  };

  const removeAssignment = (id: string) => setAssignments((prev) => prev.filter((a) => a.id !== id));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-latte-border">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-espresso">Asignación v2 (Tabla)</h1>
          <p className="text-xs sm:text-sm text-brand-espresso/70 mt-0.5">Programa por día, semana o mes. Haz clic en una celda para asignar.</p>
        </div>
        <div className="inline-flex p-1 rounded-xl bg-brand-latte border border-brand-latte-border">
          {(["dia", "semana", "mes"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${view === v ? "bg-white text-brand-espresso shadow-sm" : "text-brand-espresso/60"}`}>
              {v === "dia" ? "Día" : v === "semana" ? "Semana" : "Mes"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-brand-espresso">Fecha base:</label>
        <input type="date" value={baseDate} onChange={(e) => setBaseDate(e.target.value)} className="text-xs p-1.5 rounded-lg border border-brand-latte-border bg-brand-latte text-brand-espresso" />
      </div>

      <div className="p-4 rounded-3xl bg-white border border-brand-latte-border shadow-sm overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-brand-latte-border bg-brand-latte/40">
              <th className="py-2 px-3 text-left font-semibold">Colaborador</th>
              {visibleDays.map((day) => (
                <th key={day} className="py-2 px-3 text-center font-semibold">
                  {new Date(day).toLocaleDateString("es-EC", { weekday: "short", day: "2-digit", month: "short" })}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-latte-border">
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td className="py-2 px-3 font-semibold">{emp.full_name}</td>
                {visibleDays.map((day) => {
                  const items = assignments.filter((a) => a.employeeId === emp.id && a.date === day);
                  return (
                    <td key={day} className="py-2 px-3 text-center align-top min-w-[120px]">
                      {items.map((it) => (
                        <div key={it.id} className="mb-1 rounded px-1.5 py-0.5 text-[10px]" style={{ backgroundColor: it.zoneColor + "22", color: it.zoneColor }}>
                          {it.zoneName.split(" ")[0]} • {it.shift.split(" ")[0]}
                          <button onClick={() => removeAssignment(it.id)} className="ml-1 text-red-500">×</button>
                        </div>
                      ))}
                      <button onClick={() => { setModalDay(day); setForm((f) => ({ ...f, employeeId: emp.id })); }} className="text-[10px] text-brand-terracotta hover:underline">
                        + asignar
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-brand-latte-border shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-brand-espresso">Asignar para {modalDay}</h2>
              <button onClick={() => setModalDay(null)} className="p-1.5 rounded-lg text-brand-espresso/60 hover:bg-brand-latte"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-brand-espresso mb-1">Colaborador</label>
                <select value={form.employeeId} onChange={(e) => setForm((f) => ({ ...f, employeeId: e.target.value }))} className="w-full p-2.5 rounded-lg border border-brand-latte-border bg-brand-latte/30 text-brand-espresso">
                  {employees.map((e) => <option key={e.id} value={e.id}>{e.full_name}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-brand-espresso mb-1">Zona</label>
                <select value={form.zoneId} onChange={(e) => setForm((f) => ({ ...f, zoneId: e.target.value }))} className="w-full p-2.5 rounded-lg border border-brand-latte-border bg-brand-latte/30 text-brand-espresso">
                  {zones.map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-brand-espresso mb-1">Horario</label>
                <select value={form.shift} onChange={(e) => setForm((f) => ({ ...f, shift: e.target.value }))} className="w-full p-2.5 rounded-lg border border-brand-latte-border bg-brand-latte/30 text-brand-espresso">
                  <option>Mañana (07:00 - 15:00)</option>
                  <option>Tarde (14:00 - 22:00)</option>
                  <option>Jornada Completa</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-brand-espresso mb-1">Instrucciones</label>
                <input value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} className="w-full p-2.5 rounded-lg border border-brand-latte-border bg-brand-latte/30 text-brand-espresso" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setModalDay(null)} className="flex-1 btn-secondary text-xs py-2.5">Cancelar</button>
              <button onClick={addAssignment} className="flex-1 btn-primary text-xs py-2.5 flex items-center justify-center gap-2"><Plus className="w-4 h-4" /><span>Guardar</span></button>
            </div>
            <button onClick={copyDayToWeek} className="w-full btn-secondary text-xs py-2.5 flex items-center justify-center gap-2">
              <Copy className="w-4 h-4" />
              <span>Copiar este día a toda la semana visible</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
EOF
echo done