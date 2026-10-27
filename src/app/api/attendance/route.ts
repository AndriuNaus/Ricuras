import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin, authErrorResponse } from "@/lib/auth";
import { inicioDiaEC, finDiaEC, ultimoDiaMes } from "@/lib/fecha";

const clockSchema = z.object({
  employee_id: z.string().uuid(),
  record_type: z.enum(["entrada", "salida"]),
  method: z.enum(["manual", "camara", "whatsapp"]).default("manual"),
  // URL externa (p. ej. Drive del bot) o ruta dentro del bucket privado "attendance-photos"
  photo_url: z
    .union([z.string().url(), z.string().regex(/^attendance\/[\w.-]+$/)])
    .optional()
    .nullable(),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
});

export async function GET(request: Request) {
  const { supabase, error } = await requireAdmin();
  if (error) return authErrorResponse(error);

  const url = new URL(request.url);
  const employeeId = url.searchParams.get("employee_id");
  const date = url.searchParams.get("date");
  const month = url.searchParams.get("month");
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  const dateRe = /^\d{4}-\d{2}-\d{2}$/;
  const monthRe = /^\d{4}-\d{2}$/;
  if (date && !dateRe.test(date)) return NextResponse.json({ error: "Formato de fecha inválido (YYYY-MM-DD)" }, { status: 400 });
  if (month && !monthRe.test(month)) return NextResponse.json({ error: "Formato de mes inválido (YYYY-MM)" }, { status: 400 });
  if (from && !dateRe.test(from)) return NextResponse.json({ error: "Formato de fecha inválido (YYYY-MM-DD)" }, { status: 400 });
  if (to && !dateRe.test(to)) return NextResponse.json({ error: "Formato de fecha inválido (YYYY-MM-DD)" }, { status: 400 });

  let query = supabase
    .from("attendance_records")
    .select("*, employees(full_name, position)")
    .order("timestamp", { ascending: false });

  if (employeeId) query = query.eq("employee_id", employeeId);
  // Los días se cortan en hora de Ecuador (UTC-5), no en UTC: así una marcación
  // de las 21:00 queda en su día y no en el siguiente.
  if (from && to) {
    query = query.gte("timestamp", inicioDiaEC(from)).lte("timestamp", finDiaEC(to));
  } else if (date) {
    query = query.gte("timestamp", inicioDiaEC(date)).lte("timestamp", finDiaEC(date));
  } else if (month) {
    query = query.gte("timestamp", inicioDiaEC(`${month}-01`)).lte("timestamp", finDiaEC(ultimoDiaMes(month)));
  } else {
    // Sin filtro: solo las más recientes, para no descargar toda la tabla
    query = query.limit(200);
  }

  const { data, error: dbError } = await query;
  if (dbError) { console.error("DB error:", dbError); return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 }); }

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const { supabase, error, userId } = await requireAdmin();
  if (error) return authErrorResponse(error);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo JSON inválido" }, { status: 400 });
  }

  const parsed = clockSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos", details: parsed.error.flatten() }, { status: 400 });
  }

  // Regla de negocio: ENTRADA y SALIDA deben alternarse (nunca dos iguales seguidas).
  // Se compara con la última marcación válida del empleado.
  const { data: ultima, error: ultimaError } = await supabase
    .from("attendance_records")
    .select("record_type")
    .eq("employee_id", parsed.data.employee_id)
    .eq("status", "valido")
    .order("timestamp", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (ultimaError) { console.error("DB error:", ultimaError); return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 }); }

  const esperado = ultima?.record_type === "entrada" ? "salida" : "entrada";
  if (parsed.data.record_type !== esperado) {
    return NextResponse.json(
      { error: `Este empleado ya tiene una ${parsed.data.record_type.toUpperCase()} registrada. Ahora le corresponde marcar ${esperado.toUpperCase()}.` },
      { status: 409 }
    );
  }

  const { data, error: dbError } = await supabase
    .from("attendance_records")
    .insert({ ...parsed.data, registered_by: userId })
    .select("*, employees(full_name, position)")
    .single();

  if (dbError) { console.error("DB error:", dbError); return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 }); }

  return NextResponse.json({ data }, { status: 201 });
}
