import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Solo las rutas que usan sesión. La landing pública (/) no pasa por aquí:
  // así carga más rápido y no depende de que Supabase responda.
  matcher: ["/admin/:path*", "/dashboard/:path*", "/login", "/api/:path*"],
};
