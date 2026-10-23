"use client";

import { useState, useEffect } from "react";
import { CalendarPlus, Copy, GripVertical, Plus, Trash2, X, Sun, Coffee } from "lucide-react";

interface Employee { id: string; full_name: string; }
interface Zone { id: string; name: string; color_hex: string; }
interface Shift { startTime: string; endTime: string; }
interface Assignment {
  id: string;
  date: string;
  employeeId: string;
  employeeName: string;
  zoneId: string;
  zoneName: string;
  zoneColor: string;
  color: string;
  startTime: string;
  endTime: string;
  notes?: string;
  isDayOff?: boolean;
}

const PRESETS = [
  { label: "Mañana", start: "07:00", end: "15:00" },
  { label: "Tarde", start: "14:00", end: "22:00" },
  { label: "Jornada completa", start: "07:00", end: "22:00" },
];

function toISO(d: Date) {
  return d.toISOString().split("T")[0];
}

function shadeColor(hex: string, percent: number) {
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

function getWeekDays(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return Array.from({ length: 7 }).map((_, i) => {
    const x = new Date(monday);
    x.setDate(monday.getDate() + i);
    return toISO(x);
  });
}

function getMonthWeeks(dateStr: string) {
  const base = new Date(dateStr + "T12:00:00");
  const first = new Date(base.getFullYear(), base.getMonth(), 1);
  const startDay = first.getDay();
  const start = new Date(first);
  start.setDate(first.getDate() - (startDay === 0 ? 6 : startDay - 1));
  return Array.from({ length: 6 }).map((_, w) =>
    Array.from({ length: 7 }).map((_, d) => {
      const x = new Date(start);
      x.setDate(start.getDate() + w * 7 + d);
      return toISO(x);
    })
  );
}

export default function AsignacionV2Page() {
  const [view, setView] = useState<"dia" | "semana" | "mes">("semana");
  const [baseDate, setBaseDate] = useState(toISO(new Date()));
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [modalDay, setModalDay] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [form, setForm] = useState({
    employeeId: "",
    zoneId: "",
    color: "#C86D3B",
    shifts: [{ startTime: "08:00", endTime: "15:00" }] as Shift[],
    notes: "",
    isDayOff: false,
  });

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

  const weekDays = getWeekDays(baseDate);
  const monthWeeks = getMonthWeeks(baseDate);
  const visibleDays = view === "dia" ? [baseDate] : weekDays;

  const selectView = (v: "dia" | "semana" | "mes") => {
    setView(v);
    if (v === "semana") setBaseDate(toISO(new Date()));
  };

  const buildAssignments = (date: string): Assignment[] => {
    const emp = employees.find((e) => e.id === form.employeeId);
    if (!emp) return [];
    
    // Día libre: crea una asignación especial sin zona ni horarios
    if (form.isDayOff) {
      return [{
        id: Math.random().toString(36).substring(7),
        date,
        employeeId: emp.id,
        employeeName: emp.full_name,
        zoneId: "",
        zoneName: "Día libre",
        zoneColor: "#9CA3AF",
        color: "#9CA3AF",
        startTime: "",
        endTime: "",
        notes: form.notes.trim() || "Día libre",
        isDayOff: true,
      }];
    }
    
    const zone = zones.find((z) => z.id === form.zoneId);
    if (!zone) return [];
    return form.shifts
      .filter((s) => s.startTime && s.endTime)
      .map((s) => ({
        id: Math.random().toString(36).substring(7),
        date,
        employeeId: emp.id,
        employeeName: emp.full_name,
        zoneId: zone.id,
        zoneName: zone.name,
        zoneColor: zone.color_hex,
        color: form.color || zone.color_hex,
        startTime: s.startTime,
        endTime: s.endTime,
        notes: form.notes.trim() || undefined,
      }));
  };

  const saveShifts = (replicate: boolean, keepOpen: boolean) => {
    if (!modalDay) return;
    const base = buildAssignments(modalDay);
    if (!base.length) return;
    if (replicate) {
      const days = view === "mes" ? monthWeeks.flat() : visibleDays;
      const copies = days
        .filter((day) => day !== modalDay)
        .flatMap((day) =>
          base.map((a) => ({ ...a, id: Math.random().toString(36).substring(7), date: day }))
        );
      setAssignments((prev) => [...prev, ...base, ...copies]);
    } else {
      setAssignments((prev) => [...prev, ...base]);
    }
    setForm((f) => ({ ...f, notes: "" }));
    if (!keepOpen) setModalDay(null);
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

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
    setDraggedId(id);
  };

  const handleDrop = (e: React.DragEvent, day: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") || draggedId;
    if (!id) return;
    setAssignments((prev) => prev.map((a) => (a.id === id ? { ...a, date: day } : a)));
    setDraggedId(null);
  };

  const duplicateToNextDay = (id: string) => {
    const original = assignments.find((a) => a.id === id);
    if (!original) return;
    const d = new Date(original.date + "T12:00:00");
    d.setDate(d.getDate() + 1);
    setAssignments((prev) => [
      ...prev,
      { ...original, id: Math.random().toString(36).substring(7), date: toISO(d) },
    ]);
  };

  const dayAssignments = modalDay ? assignments.filter((a) => a.date === modalDay) : [];

  const addShiftRow = () => setForm((f) => ({ ...f, shifts: [...f.shifts, { startTime: "08:00", endTime: "15:00" }] }));
  const updateShift = (i: number, key: keyof Shift, value: string) =>
    setForm((f) => ({ ...f, shifts: f.shifts.map((s, idx) => (idx === i ? { ...s, [key]: value } : s)) }));
  const removeShiftRow = (i: number) =>
    setForm((f) => ({ ...f, shifts: f.shifts.length > 1 ? f.shifts.filter((_, idx) => idx !== i) : f.shifts }));

  const renderCell = (emp: Employee, day: string, big = false) => {
    const items = assignments.filter((a) => a.employeeId === emp.id && a.date === day);
    return (
      <div className={big ? "space-y-2" : "space-y-1.5"}>
        {items.map((it, idx) => (
          <div
            key={it.id}
            draggable
            onDragStart={(e) => handleDragStart(e, it.id)}
            onDragEnd={() => setDraggedId(null)}
            className={`group relative overflow-hidden rounded-2xl p-3 text-left shadow-md cursor-grab active:cursor-grabbing transition-transform hover:-translate-y-0.5 ${draggedId === it.id ? "opacity-50" : ""}`}
            style={it.isDayOff
              ? { background: "linear-gradient(135deg, #9CA3AF, #6B7280)" }
              : { background: `linear-gradient(135deg, ${it.color}, ${shadeColor(it.color, -28)})`, color: "white" }}
          >
            <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-white/10" />
            <div className="relative flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-[10px] font-bold shrink-0">
                  {it.isDayOff ? <Sun className="w-4 h-4" /> : initials(it.employeeName)}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate">{it.employeeName}</p>
                  <p className="text-[10px] text-white/80 truncate">{it.zoneName}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                {!it.isDayOff && <GripVertical className="w-4 h-4 text-white/60" />}
                <button onClick={() => duplicateToNextDay(it.id)} title="Duplicar al día siguiente" className="text-white/80 hover:text-white">
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => removeAssignment(it.id)} title="Eliminar" className="text-white/90 hover:text-red-200 font-bold">×</button>
              </div>
            </div>
            {it.isDayOff ? (
              <div className="relative mt-2 flex items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium">
                  <Coffee className="w-3.5 h-3.5" /> Día libre
                </span>
              </div>
            ) : (
              <>
                <div className="relative mt-2 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-mono">
                    J{idx + 1} · {it.startTime}–{it.endTime}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-white/70">Jornada</span>
                </div>
                {it.notes && <p className="relative mt-1.5 text-[10px] text-white/80 line-clamp-2">{it.notes}</p>}
              </>
            )}
          </div>
        ))}
        <button
          onClick={() => {
            setModalDay(day);
            setForm((f) => ({ ...f, employeeId: emp.id, isDayOff: false }));
          }}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-brand-terracotta/30 bg-brand-terracotta/5 text-brand-terracotta text-[11px] font-semibold hover:bg-brand-terracotta/10"
        >
          <CalendarPlus className="w-3.5 h-3.5" />
          Programar
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-latte-border">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-espresso">Asignación v2 (Tabla)</h1>
          <p className="text-xs sm:text-sm text-brand-espresso/70 mt-0.5">Programa por día, semana o mes. Haz clic en una celda para asignar turnos.</p>
        </div>
        <div className="inline-flex p-1 rounded-xl bg-brand-latte border border-brand-latte-border">
          {(["dia", "semana", "mes"] as const).map((v) => (
            <button key={v} onClick={() => selectView(v)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${view === v ? "bg-white text-brand-espresso shadow-sm" : "text-brand-espresso/60"}`}>
              {v === "dia" ? "Día" : v === "semana" ? "Semana actual" : "Mes"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm font-semibold uppercase tracking-wider text-brand-espresso">Fecha base:</label>
        <input type="date" value={baseDate} onChange={(e) => setBaseDate(e.target.value)} className="text-sm p-2 rounded-lg border border-brand-latte-border bg-brand-latte text-brand-espresso" />
        <button onClick={() => setModalDay(baseDate)} className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Asignar turno</span>
        </button>
      </div>

      {view === "mes" ? (
        <div className="rounded-3xl bg-white border border-brand-latte-border shadow-sm overflow-x-auto min-h-[70vh]">
          <div className="grid grid-cols-7 border-b border-brand-latte-border bg-brand-latte/40">
            {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
              <div key={d} className="py-3 text-center text-xs font-bold uppercase tracking-wider text-brand-espresso">{d}</div>
            ))}
          </div>
          {monthWeeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 border-b border-brand-latte-border last:border-b-0">
              {week.map((day) => {
                const inMonth = new Date(day + "T12:00:00").getMonth() === new Date(baseDate + "T12:00:00").getMonth();
                const dayItems = assignments.filter((a) => a.date === day);
                return (
                  <div
                    key={day}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, day)}
                    className={`min-h-[150px] p-2 border-r border-brand-latte-border last:border-r-0 transition-colors ${inMonth ? "bg-white" : "bg-brand-latte/30"} ${draggedId ? "hover:bg-brand-terracotta/10" : ""}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-bold ${inMonth ? "text-brand-espresso" : "text-brand-espresso/30"}`}>{new Date(day + "T12:00:00").getDate()}</span>
                      <button onClick={() => setModalDay(day)} className="text-brand-terracotta" title="Programar"><CalendarPlus className="w-4 h-4" /></button>
                    </div>
                    <div className="space-y-1">
                      {dayItems.map((it, idx) => (
                        <div
                          key={it.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, it.id)}
                          onDragEnd={() => setDraggedId(null)}
                          className={`group rounded-xl px-2 py-1.5 text-[10px] shadow-sm cursor-grab ${draggedId === it.id ? "opacity-50" : ""}`}
                          style={it.isDayOff
                            ? { background: "linear-gradient(135deg, #9CA3AF, #6B7280)", color: "white" }
                            : { background: `linear-gradient(135deg, ${it.color}, ${shadeColor(it.color, -28)})`, color: "white" }}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-semibold truncate flex items-center gap-1">
                              {it.isDayOff && <Sun className="w-3.5 h-3.5" />}
                              {it.employeeName.split(" ")[0]} · {it.zoneName}
                            </span>
                            <button onClick={() => duplicateToNextDay(it.id)} title="Duplicar al día siguiente" className="opacity-0 group-hover:opacity-100 text-white/80 hover:text-white">
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="font-mono text-white/80">
                            {it.isDayOff ? "Día libre" : `J${idx + 1}: ${it.startTime}-${it.endTime}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-white border border-brand-latte-border shadow-sm overflow-x-auto min-h-[70vh]">
          <table className="w-full text-[15px] border-collapse">
            <thead>
              <tr className="border-b border-brand-latte-border bg-brand-latte/40">
                <th className="py-5 px-5 text-left font-bold uppercase tracking-wider text-xs min-w-[220px]">Operario</th>
                {visibleDays.map((day) => (
                  <th key={day} className="py-5 px-5 text-center font-bold uppercase tracking-wider text-xs min-w-[190px]">
                    {new Date(day + "T12:00:00").toLocaleDateString("es-EC", { weekday: "short", day: "2-digit", month: "short" })}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-latte-border">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-brand-latte/20">
                  <td className="py-5 px-5 font-semibold text-brand-espresso whitespace-nowrap">{emp.full_name}</td>
                  {visibleDays.map((day) => (
                    <td
                      key={day}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDrop(e, day)}
                      className={`py-5 px-5 text-center align-top transition-colors ${draggedId ? "hover:bg-brand-terracotta/10" : ""}`}
                    >
                      {renderCell(emp, day, true)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl border border-brand-latte-border shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-brand-espresso">Asignar turnos</h2>
                <p className="text-xs text-brand-espresso/60">Fecha: {modalDay}</p>
              </div>
              <button onClick={() => setModalDay(null)} className="p-2 rounded-lg text-brand-espresso/60 hover:bg-brand-latte"><X className="w-5 h-5" /></button>
            </div>

            {dayAssignments.length > 0 && (
              <div className="p-3 rounded-xl bg-brand-latte/50 border border-brand-latte-border space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-espresso">Turnos ya asignados</p>
                {dayAssignments.map((a, idx) => (
                  <div key={a.id} className="flex items-center justify-between text-xs">
                    <span>
                      <strong>{a.employeeName}</strong> — {a.zoneName}
                      {a.isDayOff ? " · Día libre" : ` · J${idx + 1} ${a.startTime}-${a.endTime}`}
                    </span>
                    <button onClick={() => removeAssignment(a.id)} className="text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-brand-espresso mb-1 text-xs">Operario</label>
                <select value={form.employeeId} onChange={(e) => setForm((f) => ({ ...f, employeeId: e.target.value }))} className="w-full p-2.5 rounded-lg border border-brand-latte-border bg-brand-latte/30 text-brand-espresso">
                  {employees.map((e) => <option key={e.id} value={e.id}>{e.full_name}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-semibold uppercase tracking-wider text-brand-espresso mb-1 text-xs">Zona</label>
                <select value={form.zoneId} onChange={(e) => {
                  const z = zones.find((x) => x.id === e.target.value);
                  setForm((f) => ({ ...f, zoneId: e.target.value, color: z?.color_hex ?? f.color }));
                }} className="w-full p-2.5 rounded-lg border border-brand-latte-border bg-brand-latte/30 text-brand-espresso">
                  {zones.map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-brand-espresso">Color de la tarjeta</label>
              <input type="color" value={form.color} onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))} className="w-12 h-9 rounded-lg border border-brand-latte-border bg-white p-1" />
              <span className="text-xs text-brand-espresso/60">{form.color}</span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-brand-latte/50 border border-brand-latte-border">
              <input
                type="checkbox"
                id="dayOff"
                checked={form.isDayOff}
                onChange={(e) => setForm((f) => ({ ...f, isDayOff: e.target.checked, shifts: e.target.checked ? [] : [{ startTime: "08:00", endTime: "15:00" }] }))}
                className="w-4 h-4 text-brand-terracotta border-brand-latte-border rounded focus:ring-brand-terracotta"
              />
              <label htmlFor="dayOff" className="text-sm font-semibold text-brand-espresso cursor-pointer">
                Día libre (sin turno)
              </label>
            </div>

            {!form.isDayOff && (
              <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {PRESETS.map((p) => (
                  <button key={p.label} type="button" onClick={() => setForm((f) => ({ ...f, shifts: f.shifts.map((s, i) => i === f.shifts.length - 1 ? { startTime: p.start, endTime: p.end } : s) }))} className="px-3 py-1.5 rounded-lg border border-brand-latte-border text-xs font-semibold text-brand-espresso hover:bg-brand-latte">
                    {p.label}
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                {form.shifts.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-brand-espresso w-8">J{i + 1}</span>
                    <input type="time" value={s.startTime} onChange={(e) => updateShift(i, "startTime", e.target.value)} className="flex-1 p-2 rounded-lg border border-brand-latte-border bg-brand-latte/30 text-sm text-brand-espresso" />
                    <span className="text-brand-espresso/50">a</span>
                    <input type="time" value={s.endTime} onChange={(e) => updateShift(i, "endTime", e.target.value)} className="flex-1 p-2 rounded-lg border border-brand-latte-border bg-brand-latte/30 text-sm text-brand-espresso" />
                    <button type="button" onClick={() => removeShiftRow(i)} className="p-1.5 text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-brand-espresso/60 mt-2">Ejemplo: J1 08:00-12:00 y J2 18:00-22:00 para una persona con dos jornadas el mismo día.</p>
            </div>
          )}

            <div>
              <label className="block font-semibold uppercase tracking-wider text-brand-espresso mb-1 text-xs">Instrucciones</label>
              <input value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} className="w-full p-2.5 rounded-lg border border-brand-latte-border bg-brand-latte/30 text-brand-espresso text-sm" />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => saveShifts(false, true)} className="flex-1 btn-secondary text-sm py-2.5 flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                <span>Guardar y seguir</span>
              </button>
              <button onClick={() => saveShifts(false, false)} className="flex-1 btn-primary text-sm py-2.5 flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                <span>Guardar turno</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-brand-latte-border">
              <button onClick={() => saveShifts(true, false)} className="flex-1 btn-secondary text-sm py-2.5 flex items-center justify-center gap-2">
                <Copy className="w-4 h-4" />
                <span>Guardar y replicar todos los días</span>
              </button>
              <button onClick={copyDayToWeek} className="flex-1 btn-secondary text-sm py-2.5 flex items-center justify-center gap-2">
                <Copy className="w-4 h-4" />
                <span>Copiar turnos del día a la semana</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
