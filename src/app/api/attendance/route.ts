import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const clockSchema = z.object({
  employee_id: z.string().uuid(),
  record_type: z.enum(["entrada", "salida"]),
  method: z.enum(["manual", "camara", "whatsapp"]).default("manual"),
  photo_url: z.string().url().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
});

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { supabase, error: "No autenticado" as const };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .single();

  if (!profile || !profile.is_active || (profile.role !== "admin" && profile.role !== "superadmin")) {
    return { supabase, error: "No autorizado" as const };
  }

  return { supabase, error: null, userId: user.id };
}

export async function GET(request: Request) {
  const { supabase, error } = await requireAdmin();
  if (error) {
    return NextResponse.json({ error }, { status: error === "No autenticado" ? 401 : 403 });
  }

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
  if (from && to) {
    query = query.gte("timestamp", `${from}T00:00:00`).lte("timestamp", `${to}T23:59:59`);
  } else if (date) {
    query = query.gte("timestamp", `${date}T00:00:00`).lte("timestamp", `${date}T23:59:59`);
  } else if (month) {
    const [y, m] = month.split("-");
    const start = `${y}-${m}-01T00:00:00`;
    const endDate = new Date(Number(y), Number(m), 0).toISOString().slice(0, 10);
    query = query.gte("timestamp", start).lte("timestamp", `${endDate}T23:59:59`);
  }

  const { data, error: dbError } = await query;
  if (dbError) { console.error("DB error:", dbError); return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 }); }

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const { supabase, error, userId } = await requireAdmin();
  if (error) {
    return NextResponse.json({ error }, { status: error === "No autenticado" ? 401 : 403 });
  }

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

  const { data, error: dbError } = await supabase
    .from("attendance_records")
    .insert({ ...parsed.data, registered_by: userId })
    .select("*, employees(full_name, position)")
    .single();

  if (dbError) { console.error("DB error:", dbError); return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 }); }

  return NextResponse.json({ data }, { status: 201 });
}
