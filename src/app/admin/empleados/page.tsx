"use client";

import { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Phone,
  Shield,
  Search,
  CheckCircle2,
  MoreVertical,
  Loader2,
  X,
  Coffee,
  Pause,
  Trash2,
  RotateCcw,
  Power,
} from "lucide-react";

interface Employee {
  id: string;
  full_name: string;
  position: string;
  phone: string | null;
  is_active: boolean;
  status: string | null;
}

interface NewEmployeeForm {
  full_name: string;
  position: string;
  phone: string;
}

export default function EmpleadosPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [form, setForm] = useState<NewEmployeeForm>({
    full_name: "",
    position: "Polifuncional",
    phone: "",
  });

  const loadEmployees = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/employees", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || "No se pudo cargar el personal.");
      }
      setEmployees(
        (json.data ?? []).map((r: Employee) => ({ ...r, status: r.status ?? (r.is_active ? "activo" : "inactivo") }))
      );
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const filtered = employees.filter((e) =>
    e.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim()) return;
    setIsSaving(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.full_name.trim(),
          position: form.position.trim() || "Polifuncional",
          phone: form.phone.trim() || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || "No se pudo registrar el colaborador.");
      }
      setEmployees((prev) => [...prev, json.data].sort((a, b) => a.full_name.localeCompare(b.full_name)));
      setForm({ full_name: "", position: "Polifuncional", phone: "" });
      setIsModalOpen(false);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsSaving(false);
    }
  };

  const statusMap = (emp: { is_active: boolean; status: string | null }) =>
    !emp.is_active ? "inactivo" : emp.status ?? "activo";

  const updateEmployeeLocally = (id: string, updates: Partial<Employee>) =>
    setEmployees((prev) => prev.map((emp) => (emp.id === id ? { ...emp, ...updates } : emp)));

  const handleStatus = async (id: string, is_active: boolean, status: string) => {
    try {
      const res = await fetch(`/api/employees/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active, status }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "No se pudo actualizar el estado.");
      updateEmployeeLocally(id, json.data);
      setOpenMenuId(null);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Error desconocido");
      setOpenMenuId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este operario DEFINITIVAMENTE?\n\nSe borra de la base de datos y no se puede deshacer. Si solo quiere no aparece en los listados, use Desactivar.")) return;
    setOpenMenuId(null);
    try {
      const res = await fetch(`/api/employees/${id}?hard=true`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "No se pudo eliminar.");
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-latte-border">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-espresso">
            Gestión de Personal
          </h1>
          <p className="text-xs sm:text-sm text-brand-espresso/70 mt-0.5">
            Registro, administración y control de operarios de Ricuras de Sal y Dulce.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="btn-primary text-xs py-2.5 px-4 flex items-center gap-2 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Registrar Operario</span>
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-3">
          <Shield className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="p-4 rounded-2xl bg-white border border-brand-latte-border shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-brand-espresso/40 shrink-0" />
        <input
          type="text"
          placeholder="Buscar operario por nombre o cargo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-xs text-brand-espresso placeholder:text-brand-espresso/30 bg-transparent focus:outline-none"
        />
      </div>

      <div className="p-6 rounded-3xl bg-white border border-brand-latte-border shadow-sm space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-brand-espresso/60">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            <span className="text-xs">Cargando personal...</span>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-xs text-brand-espresso/60 text-center py-12">
            No hay operarios registrados.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-brand-latte-border bg-brand-latte/40 text-brand-espresso/70 uppercase tracking-wider font-semibold text-[11px]">
                  <th className="py-3 px-4">Operario</th>
                  <th className="py-3 px-4">Cargo Operativo</th>
                  <th className="py-3 px-4">Contacto Telefónico</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-latte-border">
                {filtered.map((emp) => (
                  <tr key={emp.id} className="hover:bg-brand-latte/20 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-brand-espresso">
                      {emp.full_name}
                    </td>
                    <td className="py-3.5 px-4 text-brand-espresso/70">{emp.position}</td>
                    <td className="py-3.5 px-4 text-brand-espresso/70">
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-brand-terracotta" />
                        {emp.phone || "—"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {statusMap(emp) === "activo" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-botanical/10 text-brand-botanical">
                          <CheckCircle2 className="w-3 h-3" />
                          Activo
                        </span>
                      ) : statusMap(emp) === "vacaciones" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600">
                          <Coffee className="w-3 h-3" />
                          Vacaciones
                        </span>
                      ) : statusMap(emp) === "suspendido" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600">
                          <Pause className="w-3 h-3" />
                          Suspendido
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-600">
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right relative">
                      <button
                        type="button"
                        onClick={() => setOpenMenuId(openMenuId === emp.id ? null : emp.id)}
                        className="p-1.5 rounded-lg text-brand-espresso/60 hover:text-brand-terracotta hover:bg-brand-latte/60 transition-colors"
                        aria-label="Acciones del operario"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {openMenuId === emp.id && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setOpenMenuId(null)}
                          />
                          <div className="absolute right-4 top-2 z-50 w-44 bg-white rounded-xl border border-brand-latte-border shadow-lg py-1 text-left">
                            {emp.is_active && emp.status === "activo" && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm("¿Enviar a vacaciones? Puede reactivarlo después.")) {
                                      handleStatus(emp.id, true, "vacaciones");
                                    } else setOpenMenuId(null);
                                  }}
                                  className="w-full px-3 py-2 text-[11px] font-semibold text-brand-espresso hover:bg-brand-latte/40 flex items-center gap-2"
                                >
                                  <Coffee className="w-3.5 h-3.5 text-blue-500" /> Vacaciones
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm("¿Suspender este operario?")) {
                                      handleStatus(emp.id, true, "suspendido");
                                    } else setOpenMenuId(null);
                                  }}
                                  className="w-full px-3 py-2 text-[11px] font-semibold text-brand-espresso hover:bg-brand-latte/40 flex items-center gap-2"
                                >
                                  <Pause className="w-3.5 h-3.5 text-amber-500" /> Suspender
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm("¿Desactivar este operario? Conserva su historial.")) {
                                      handleStatus(emp.id, false, "activo");
                                    } else setOpenMenuId(null);
                                  }}
                                  className="w-full px-3 py-2 text-[11px] font-semibold text-brand-espresso hover:bg-brand-latte/40 flex items-center gap-2"
                                >
                                  <Power className="w-3.5 h-3.5 text-brand-espresso/60" /> Desactivar
                                </button>
                              </>
                            )}
                            {(!emp.is_active || emp.status !== "activo") && (
                              <button
                                type="button"
                                onClick={() => handleStatus(emp.id, true, "activo")}
                                className="w-full px-3 py-2 text-[11px] font-semibold text-brand-espresso hover:bg-brand-latte/40 flex items-center gap-2"
                              >
                                <RotateCcw className="w-3.5 h-3.5 text-brand-botanical" /> Reactivar
                              </button>
                            )}
                            <div className="my-1 border-t border-brand-latte-border" />
                            <button
                              type="button"
                              onClick={() => handleDelete(emp.id)}
                              className="w-full px-3 py-2 text-[11px] font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Eliminar
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-brand-latte-border shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-brand-espresso">
                Registrar Operario
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-brand-espresso/60 hover:bg-brand-latte"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-espresso mb-1">
                  Nombre completo
                </label>
                <input
                  type="text"
                  required
                  value={form.full_name}
                  onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                  className="w-full p-2.5 rounded-lg border border-brand-latte-border bg-brand-latte/30 text-xs text-brand-espresso"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-espresso mb-1">
                  Cargo
                </label>
                <select
                  value={form.position}
                  onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))}
                  className="w-full p-2.5 rounded-lg border border-brand-latte-border bg-brand-latte/30 text-xs text-brand-espresso"
                >
                  <option value="Barista">Barista</option>
                  <option value="Atención en Salón">Atención en Salón</option>
                  <option value="Cocina">Cocina</option>
                  <option value="Repostería">Repostería</option>
                  <option value="Atención Pádel">Atención Pádel</option>
                  <option value="Polifuncional">Polifuncional</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-espresso mb-1">
                  Teléfono
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="w-full p-2.5 rounded-lg border border-brand-latte-border bg-brand-latte/30 text-xs text-brand-espresso"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 btn-secondary text-xs py-2.5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 btn-primary text-xs py-2.5 flex items-center justify-center gap-2"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Guardar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
