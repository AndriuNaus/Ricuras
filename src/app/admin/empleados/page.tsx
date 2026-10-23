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
} from "lucide-react";

interface Employee {
  id: string;
  full_name: string;
  position: string;
  phone: string | null;
  is_active: boolean;
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
      setEmployees(json.data ?? []);
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

  const handleDeactivate = async (id: string) => {
    if (!confirm("¿Desactivar este colaborador?")) return;
    try {
      const res = await fetch(`/api/employees/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "No se pudo desactivar.");
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === id ? { ...emp, is_active: false } : emp))
      );
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
            Registro, administración y control de colaboradores de Ricuras de Sal y Dulce.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="btn-primary text-xs py-2.5 px-4 flex items-center gap-2 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Registrar Colaborador</span>
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
          placeholder="Buscar colaborador por nombre o cargo..."
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
            No hay colaboradores registrados.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-brand-latte-border bg-brand-latte/40 text-brand-espresso/70 uppercase tracking-wider font-semibold text-[11px]">
                  <th className="py-3 px-4">Colaborador</th>
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
                      {emp.is_active ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-botanical/10 text-brand-botanical">
                          <CheckCircle2 className="w-3 h-3" />
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-600">
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {emp.is_active && (
                        <button
                          type="button"
                          onClick={() => handleDeactivate(emp.id)}
                          className="p-1.5 rounded-lg text-brand-espresso/60 hover:text-red-600 hover:bg-red-50 transition-colors"
                          aria-label="Desactivar colaborador"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
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
                Registrar Colaborador
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
