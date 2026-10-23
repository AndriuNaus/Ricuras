"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Coffee, Shield, ArrowLeft, Lock, Mail, AlertCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message || "Credenciales incorrectas. Verifique su correo y contraseña.");
        setIsLoading(false);
        return;
      }

      if (data?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, is_active")
          .eq("id", data.user.id)
          .single();

        if (profile && !profile.is_active) {
          setErrorMessage("Esta cuenta se encuentra inactiva. Contacte al administrador.");
          await supabase.auth.signOut();
          setIsLoading(false);
          return;
        }

        if (profile?.role === "admin" || profile?.role === "superadmin") {
          router.push(redirectPath);
        } else {
          router.push("/");
        }
      }
    } catch (err) {
      setErrorMessage("No fue posible establecer conexión con el servicio de autenticación.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white py-8 px-6 shadow-sm border border-brand-latte-border rounded-2xl sm:px-10">
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold uppercase tracking-wider text-brand-espresso"
          >
            Correo Electrónico
          </label>
          <div className="mt-2 relative rounded-lg shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-espresso/40">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ricuras.ec"
              className="block w-full pl-10 pr-3 py-2.5 text-sm rounded-lg border border-brand-latte-border text-brand-espresso placeholder:text-brand-espresso/30 focus:outline-none focus:ring-2 focus:ring-brand-terracotta focus:border-transparent bg-brand-latte/20"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs font-semibold uppercase tracking-wider text-brand-espresso"
          >
            Contraseña
          </label>
          <div className="mt-2 relative rounded-lg shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-espresso/40">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="block w-full pl-10 pr-3 py-2.5 text-sm rounded-lg border border-brand-latte-border text-brand-espresso placeholder:text-brand-espresso/30 focus:outline-none focus:ring-2 focus:ring-brand-terracotta focus:border-transparent bg-brand-latte/20"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold text-white bg-brand-espresso hover:bg-brand-espresso-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-espresso transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-brand-amber" />
              <span>Validando credenciales...</span>
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 text-brand-amber" />
              <span>Iniciar Sesión</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-brand-latte-border text-center">
        <p className="text-xs text-brand-espresso/60 leading-relaxed">
          El acceso a este portal está restringido exclusivamente a colaboradores autorizados por Ricuras de Sal y Dulce.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-brand-latte flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-espresso/70 hover:text-brand-terracotta mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al sitio web</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-espresso flex items-center justify-center text-white">
            <Coffee className="w-5 h-5 text-brand-amber" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-brand-espresso">
              Ricuras de Sal y Dulce
            </h1>
            <p className="text-xs text-brand-espresso/70">
              Portal Interno • Gestión Operativa
            </p>
          </div>
        </div>

        <h2 className="mt-6 text-xl sm:text-2xl font-bold tracking-tight text-brand-espresso">
          Acceso al Sistema Administrativo
        </h2>
        <p className="mt-1 text-xs text-brand-espresso/70">
          Ingrese con sus credenciales de colaborador o administrador.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Suspense
          fallback={
            <div className="bg-white p-8 rounded-2xl border border-brand-latte-border text-center text-xs text-brand-espresso/60">
              Cargando formulario de acceso...
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
