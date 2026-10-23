import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-brand-latte flex flex-col justify-center items-center px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-brand-latte-border shadow-sm text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-2xl font-bold text-brand-espresso">
            Acceso no autorizado
          </h1>
          <p className="text-sm text-brand-espresso/70 leading-relaxed">
            Su cuenta no posee permisos de administración o superadministración para ingresar a este panel.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-brand-latte border border-brand-latte-border text-xs text-brand-espresso/70 text-left">
          <p className="font-semibold text-brand-espresso mb-1">¿Necesita acceso?</p>
          <p>
            Comuníquese con el administrador del restaurante para que asigne el rol correspondiente a su perfil.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg text-sm font-semibold text-brand-espresso bg-brand-latte hover:bg-brand-latte-subtle border border-brand-latte-border transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Regresar a la página principal</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
