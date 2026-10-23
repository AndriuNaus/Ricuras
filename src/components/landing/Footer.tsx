import Link from "next/link";
import { Coffee, Shield, Instagram, Facebook, MapPin, Phone } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-espresso text-brand-latte pt-16 pb-12 border-t border-brand-espresso-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Columna Marca */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-brand-terracotta flex items-center justify-center text-white">
                <Coffee className="w-5 h-5 text-brand-amber" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-white">
                Ricuras
              </span>
            </div>
            <p className="text-xs text-brand-latte/70 leading-relaxed">
              Cafetería de especialidad, repostería artesanal y cocina tradicional lojana. Dos puntos de encuentro en la ciudad de Loja, Ecuador.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/ricurasdesalydulce/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-brand-terracotta flex items-center justify-center text-white transition-colors"
                aria-label="Instagram oficial de Ricuras"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/ricurasdesalydulce/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-brand-terracotta flex items-center justify-center text-white transition-colors"
                aria-label="Facebook oficial de Ricuras"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Columna Sedes */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-brand-terracotta">
              Sedes en Loja
            </h4>
            <div className="space-y-3 text-xs text-brand-latte/75">
              <div>
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-terracotta" /> Sede San Sebastián
                </p>
                <p className="text-white/60 mt-0.5">Calle Olmedo 16-33 y González Suárez</p>
                <p className="text-white/50 text-[11px]">Sector histórico</p>
              </div>

              <div>
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-botanical" /> Sede Loja Pádel Club
                </p>
                <p className="text-white/60 mt-0.5">Av. Zoilo Rodríguez</p>
                <p className="text-white/50 text-[11px]">Six Wellness Center</p>
              </div>
            </div>
          </div>

          {/* Columna Horarios & Contacto */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-brand-terracotta">
              Atención & Reservas
            </h4>
            <div className="space-y-2 text-xs text-brand-latte/75">
              <p>
                <strong className="text-white">Lunes a Sábado:</strong> 07:00 a 22:00
              </p>
              <p>
                <strong className="text-white">Domingos:</strong> 07:00 a 18:30
              </p>
              <p className="flex items-center gap-1.5 pt-1 text-white">
                <Phone className="w-3.5 h-3.5 text-brand-terracotta" />
                <span>+593 7-258-3041</span>
              </p>
            </div>
          </div>

          {/* Columna Portal Administrativo */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-brand-terracotta">
              Portal Interno
            </h4>
            <p className="text-xs text-brand-latte/70 leading-relaxed">
              Sistema de gestión operativa para registro de asistencia, programación de turnos y control administrativo.
            </p>
            <div className="pt-1">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-medium border border-white/15 transition-all"
              >
                <Shield className="w-3.5 h-3.5 text-brand-amber" />
                <span>Acceso Colaboradores / Admin</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-latte/50">
          <p>
            © {currentYear} Ricuras de Sal y Dulce. Todos los derechos reservados. Loja, Ecuador.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#inicio" className="hover:text-white transition-colors">
              Volver arriba
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">
              Portal Privado
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
