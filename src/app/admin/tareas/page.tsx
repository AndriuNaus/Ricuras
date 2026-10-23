"use client";

import { useState, useRef } from "react";
import {
  ClipboardList,
  Calendar,
  Download,
  Share2,
  Check,
  Plus,
  Trash2,
  Coffee,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface EmployeeItem {
  id: string;
  name: string;
  position: string;
}

interface ZoneItem {
  id: string;
  name: string;
  colorHex: string;
}

interface Assignment {
  id: string;
  date: string;
  employeeId: string;
  employeeName: string;
  zoneId: string;
  zoneName: string;
  zoneColor: string;
  shift: "Mañana (07:00 - 15:00)" | "Tarde (14:00 - 22:00)" | "Jornada Completa";
  notes?: string;
}

const ZONES: ZoneItem[] = [
  { id: "z1", name: "Barra & Cafetería de Especialidad", colorHex: "#C86D3B" },
  { id: "z2", name: "Piso 1 (Salón Principal San Sebastián)", colorHex: "#2C1A11" },
  { id: "z3", name: "Cocina & Platos Típicos", colorHex: "#8B261D" },
  { id: "z4", name: "Terraza & Espacio Botánico", colorHex: "#2D5A3D" },
  { id: "z5", name: "Sede Loja Pádel Club / Six Wellness", colorHex: "#1E40AF" },
];

const EMPLOYEES: EmployeeItem[] = [
  { id: "e1", name: "Carlos Jaramillo", position: "Barista" },
  { id: "e2", name: "María Elena Cueva", position: "Atención en Salón" },
  { id: "e3", name: "Luis Fernando Morocho", position: "Cocina" },
  { id: "e4", name: "Andrea Villamagua", position: "Repostería" },
  { id: "e5", name: "Juan Pablo Soto", position: "Atención Pádel" },
];

export default function TareasPage() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [viewMode, setViewMode] = useState<"dia" | "semana" | "tabla">("dia");
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: "a1",
      date: new Date().toISOString().split("T")[0],
      employeeId: "e1",
      employeeName: "Carlos Jaramillo",
      zoneId: "z1",
      zoneName: "Barra & Cafetería de Especialidad",
      zoneColor: "#C86D3B",
      shift: "Mañana (07:00 - 15:00)",
      notes: "Control de molienda y espresso matutino",
    },
    {
      id: "a2",
      date: new Date().toISOString().split("T")[0],
      employeeId: "e2",
      employeeName: "María Elena Cueva",
      zoneId: "z2",
      zoneName: "Piso 1 (Salón Principal San Sebastián)",
      zoneColor: "#2C1A11",
      shift: "Jornada Completa",
      notes: "Atención de mesas y pedidos",
    },
    {
      id: "a3",
      date: new Date().toISOString().split("T")[0],
      employeeId: "e3",
      employeeName: "Luis Fernando Morocho",
      zoneId: "z3",
      zoneName: "Cocina & Platos Típicos",
      zoneColor: "#8B261D",
      shift: "Mañana (07:00 - 15:00)",
      notes: "Preparación de tigrillo, bolones y tamales",
    },
    {
      id: "a4",
      date: new Date().toISOString().split("T")[0],
      employeeId: "e5",
      employeeName: "Juan Pablo Soto",
      zoneId: "z5",
      zoneName: "Sede Loja Pádel Club / Six Wellness",
      zoneColor: "#1E40AF",
      shift: "Tarde (14:00 - 22:00)",
      notes: "Barra deportiva y atención en canchas",
    },
  ]);

  // Estados para nuevo formulario
  const [newEmployeeId, setNewEmployeeId] = useState(EMPLOYEES[0].id);
  const [newZoneId, setNewZoneId] = useState(ZONES[0].id);
  const [newShift, setNewShift] = useState<Assignment["shift"]>("Mañana (07:00 - 15:00)");
  const [newNotes, setNewNotes] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  const previewCardRef = useRef<HTMLDivElement>(null);

  const handleAddAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = EMPLOYEES.find((item) => item.id === newEmployeeId);
    const zone = ZONES.find((item) => item.id === newZoneId);
    if (!emp || !zone) return;

    const newAssoc: Assignment = {
      id: Math.random().toString(36).substring(7),
      date: selectedDate,
      employeeId: emp.id,
      employeeName: emp.name,
      zoneId: zone.id,
      zoneName: zone.name,
      zoneColor: zone.colorHex,
      shift: newShift,
      notes: newNotes.trim() || undefined,
    };

    setAssignments((prev) => [...prev, newAssoc]);
    setNewNotes("");
    setNotification(`Asignación guardada para ${emp.name} en ${zone.name}.`);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleRemoveAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((item) => item.id !== id));
  };

  // Descargar la tarjeta de tareas como imagen o imprimir
  const handleExportImage = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-latte-border">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-espresso">
            Asignación de Tareas y Zonas
          </h1>
          <p className="text-xs sm:text-sm text-brand-espresso/70 mt-0.5">
            Planifique y distribuya los puestos de trabajo del equipo por día o semana y exporte la gráfica para WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportImage}
            type="button"
            className="btn-primary text-xs py-2.5 px-4 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Gráfica para WhatsApp</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Barra de control de fecha y modo */}
      <div className="p-4 rounded-2xl bg-white border border-brand-latte-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-brand-terracotta" />
          <div className="flex items-center gap-2">
            <label htmlFor="task-date" className="text-xs font-semibold uppercase tracking-wider text-brand-espresso">
              Fecha de Programación:
            </label>
            <input
              id="task-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs font-medium p-1.5 rounded-lg border border-brand-latte-border bg-brand-latte text-brand-espresso"
            />
          </div>
        </div>

        <div className="inline-flex p-1 rounded-xl bg-brand-latte border border-brand-latte-border">
          <button
            onClick={() => setViewMode("dia")}
            type="button"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "dia" ? "bg-white text-brand-espresso shadow-sm" : "text-brand-espresso/60"
            }`}
          >
            Vista Diaria
          </button>
          <button
            onClick={() => setViewMode("semana")}
            type="button"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "semana" ? "bg-white text-brand-espresso shadow-sm" : "text-brand-espresso/60"
            }`}
          >
            Vista Semanal
          </button>
          <button
            onClick={() => setViewMode("tabla")}
            type="button"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "tabla" ? "bg-white text-brand-espresso shadow-sm" : "text-brand-espresso/60"
            }`}
          >
            Vista Tabla
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Formulario para agregar asignacion */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-brand-latte-border shadow-sm space-y-5">
          <div>
            <h3 className="font-serif font-bold text-lg text-brand-espresso">
              Nueva Asignación de Turno
            </h3>
            <p className="text-xs text-brand-espresso/60 mt-0.5">
              Defina qué colaborador cubrirá qué zona en esta jornada.
            </p>
          </div>

          <form onSubmit={handleAddAssignment} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-brand-espresso mb-1">
                Colaborador
              </label>
              <select
                value={newEmployeeId}
                onChange={(e) => setNewEmployeeId(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-brand-latte-border bg-brand-latte/30 text-brand-espresso text-xs"
              >
                {EMPLOYEES.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} ({e.position})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-brand-espresso mb-1">
                Zona Operativa
              </label>
              <select
                value={newZoneId}
                onChange={(e) => setNewZoneId(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-brand-latte-border bg-brand-latte/30 text-brand-espresso text-xs"
              >
                {ZONES.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-brand-espresso mb-1">
                Horario / Turno
              </label>
              <select
                value={newShift}
                onChange={(e) => setNewShift(e.target.value as Assignment["shift"])}
                className="w-full p-2.5 rounded-lg border border-brand-latte-border bg-brand-latte/30 text-brand-espresso text-xs"
              >
                <option value="Mañana (07:00 - 15:00)">Mañana (07:00 - 15:00)</option>
                <option value="Tarde (14:00 - 22:00)">Tarde (14:00 - 22:00)</option>
                <option value="Jornada Completa">Jornada Completa (Rotativa)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-brand-espresso mb-1">
                Instrucciones Específicas (Opcional)
              </label>
              <input
                type="text"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="Ej. Apoyo en barra en hora punta"
                className="w-full p-2.5 rounded-lg border border-brand-latte-border bg-brand-latte/30 text-brand-espresso text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full btn-primary text-xs py-2.5 flex items-center justify-center gap-2 mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar a la Hoja de Turnos</span>
            </button>
          </form>
        </div>

        {viewMode === "semana" && (
          <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-brand-latte-border shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-lg text-brand-espresso">Programación Semanal</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-brand-latte-border bg-brand-latte/40">
                    <th className="py-2 px-3 text-left">Colaborador</th>
                    {Array.from({ length: 7 }).map((_, i) => {
                      const d = new Date(selectedDate);
                      d.setDate(d.getDate() + i);
                      return <th key={i} className="py-2 px-3 text-center">{d.toLocaleDateString("es-EC", { weekday: "short", day: "2-digit" })}</th>;
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-latte-border">
                  {EMPLOYEES.map((emp) => (
                    <tr key={emp.id}>
                      <td className="py-2 px-3 font-semibold">{emp.name}</td>
                      {Array.from({ length: 7 }).map((_, i) => {
                        const d = new Date(selectedDate);
                        d.setDate(d.getDate() + i);
                        const dayStr = d.toISOString().split("T")[0];
                        const items = assignments.filter((a) => a.employeeId === emp.id && a.date === dayStr);
                        return (
                          <td key={i} className="py-2 px-3 text-center">
                            {items.length ? items.map((it) => (
                              <div key={it.id} className="text-[10px] rounded px-1.5 py-0.5 mb-1" style={{ backgroundColor: it.zoneColor + "22", color: it.zoneColor }}>
                                {it.zoneName.split(" ")[0]} • {it.shift.split(" ")[0]}
                              </div>
                            )) : <span className="text-brand-espresso/30">—</span>}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {viewMode === "tabla" && (
          <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-brand-latte-border shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-lg text-brand-espresso">Tabla de Asignaciones del Día</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-brand-latte-border bg-brand-latte/40 text-brand-espresso/70 uppercase tracking-wider font-semibold text-[11px]">
                    <th className="py-3 px-4 text-left">Colaborador</th>
                    <th className="py-3 px-4 text-left">Zona Operativa</th>
                    <th className="py-3 px-4 text-left">Horario</th>
                    <th className="py-3 px-4 text-left">Instrucciones</th>
                    <th className="py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-latte-border">
                  {assignments.filter((a) => a.date === selectedDate).map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 px-4 font-semibold">{item.employeeName}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.zoneColor }} />
                          {item.zoneName}
                        </span>
                      </td>
                      <td className="py-3 px-4">{item.shift}</td>
                      <td className="py-3 px-4 text-brand-espresso/70">{item.notes || "—"}</td>
                      <td className="py-3 px-4 text-right">
                        <button onClick={() => handleRemoveAssignment(item.id)} className="p-1.5 text-brand-espresso/40 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {viewMode === "dia" && (
        <div className="lg:col-span-7 space-y-4">
          <div
            ref={previewCardRef}
            className="p-8 rounded-3xl bg-white border border-brand-latte-border shadow-md space-y-6 print:m-0 print:border-none print:shadow-none"
          >
            {/* Cabecera de la lamina grafica */}
            <div className="flex items-center justify-between pb-4 border-b-2 border-brand-latte-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-espresso flex items-center justify-center text-white">
                  <Coffee className="w-5 h-5 text-brand-amber" />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-xl text-brand-espresso">
                    Ricuras de Sal y Dulce
                  </h2>
                  <p className="text-[11px] uppercase tracking-wider font-semibold text-brand-terracotta">
                    Programación Oficial de Zonas & Turnos
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs font-semibold text-brand-espresso">Fecha Asignada</p>
                <p className="font-mono text-xs text-brand-espresso/70">{selectedDate}</p>
              </div>
            </div>

            {/* Listado de asignaciones graficas */}
            <div className="space-y-3">
              {assignments.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-brand-latte-border bg-brand-latte/30 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.zoneColor }}
                      />
                      <span className="font-serif font-bold text-sm text-brand-espresso">
                        {item.employeeName}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-brand-espresso/80 pl-4.5">
                      Zona: <strong className="text-brand-espresso">{item.zoneName}</strong>
                    </p>

                    <p className="text-[11px] text-brand-espresso/60 pl-4.5">
                      Turno: {item.shift} {item.notes && `• Nota: ${item.notes}`}
                    </p>
                  </div>

                  <button
                    onClick={() => handleRemoveAssignment(item.id)}
                    type="button"
                    className="p-2 text-brand-espresso/40 hover:text-red-600 transition-colors shrink-0 print:hidden"
                    title="Eliminar asignación"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-brand-latte-border flex items-center justify-between text-[11px] text-brand-espresso/60">
              <span>Sedes: San Sebastián & Loja Pádel Club</span>
              <span>Documento de distribución interna</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-brand-latte-subtle border border-brand-latte-border text-xs text-brand-espresso/70 flex items-center justify-between">
            <span>
              💡 <strong>Sugerencia de envío:</strong> Use el botón &quot;Exportar Gráfica para WhatsApp&quot; para generar la versión lista para imprimir o capturar como imagen y compartir en el grupo de colaboradores.
            </span>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
