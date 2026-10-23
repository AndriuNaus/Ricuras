"use client";

import { useState, useEffect } from "react";
import { Settings, Plus, Trash2, Loader2 } from "lucide-react";

interface Zone { id: string; name: string; color_hex: string; description: string | null; sort_order: number; is_active: boolean; }

export default function ConfiguracionPage() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#C86D3B");
  const [isSaving, setIsSaving] = useState(false);

  const load = async () => {
    setIsLoading(true);
    const res = await fetch("/api/zones", { cache: "no-store" });
    const json = await res.json();
    setZones(json.data ?? []);
    setIsLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSaving(true);
    await fetch("/api/zones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), color_hex: color, sort_order: zones.length + 1 }),
    });
    setName("");
    await load();
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-espresso">Configuración (Superadmin)</h1>
        <p className="text-xs sm:text-sm text-brand-espresso/70 mt-0.5">
          Gestión de zonas operativas y parámetros del sistema. Acceso exclusivo para superadmin.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-brand-latte-border shadow-sm space-y-4">
        <h2 className="font-serif font-bold text-lg text-brand-espresso">Zonas Operativas</h2>
        {isLoading ? (
          <div className="flex items-center text-brand-espresso/60"><Loader2 className="w-4 h-4 animate-spin mr-2" />Cargando...</div>
        ) : (
          <ul className="space-y-2">
            {zones.map((z) => (
              <li key={z.id} className="flex items-center gap-3 p-3 rounded-xl bg-brand-latte/40">
                <span className="w-4 h-4 rounded-full" style={{ backgroundColor: z.color_hex }} />
                <span className="font-semibold text-brand-espresso">{z.name}</span>
                <span className="text-xs text-brand-espresso/60">{z.description}</span>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-brand-latte-border">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nueva zona" className="flex-1 p-2.5 rounded-lg border border-brand-latte-border bg-brand-latte/30 text-xs text-brand-espresso" />
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-12 h-10 rounded-lg border border-brand-latte-border" />
          <button type="submit" disabled={isSaving} className="btn-primary text-xs py-2.5 px-4 flex items-center gap-2">
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            <Plus className="w-4 h-4" />
            <span>Agregar</span>
          </button>
        </form>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-brand-latte-border shadow-sm space-y-2 text-xs text-brand-espresso/70">
        <p className="font-semibold text-brand-espresso">Rol Superadmin</p>
        <p>El superadmin puede gestionar zonas, administradores y configuración del sistema. Los admins operan asistencia, personal y tareas.</p>
      </div>
    </div>
  );
}
