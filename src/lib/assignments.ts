/** Asignación tal como la usa la UI (tarjeta de asignación v2). */
export interface AssignmentRecord {
  id: string;
  date: string;
  employeeId: string;
  employeeName: string;
  zoneId: string;
  zoneName: string;
  zoneColor: string;
  color: string;
  startTime: string;
  endTime: string;
  notes?: string;
  isDayOff?: boolean;
}

/** Fila tal como viene del endpoint /api/assignments (con joins a employees y zones). */
export function mapDbAssignment(row: Record<string, unknown>): AssignmentRecord {
  const isDayOff = Boolean(row.is_day_off);
  const zone = row.zones as { name?: string; color_hex?: string } | null;
  const employee = row.employees as { full_name?: string } | null;
  return {
    id: String(row.id),
    date: String(row.assignment_date),
    employeeId: String(row.employee_id),
    employeeName: employee?.full_name ?? "Operario",
    zoneId: (row.zone_id as string) ?? "",
    zoneName: isDayOff ? "Día libre" : zone?.name ?? "—",
    zoneColor: zone?.color_hex ?? "#9CA3AF",
    color: (row.color_hex as string) ?? (isDayOff ? "#9CA3AF" : "#C86D3B"),
    startTime: typeof row.start_time === "string" ? row.start_time.slice(0, 5) : "",
    endTime: typeof row.end_time === "string" ? row.end_time.slice(0, 5) : "",
    notes: (row.notes as string) ?? undefined,
    isDayOff,
  };
}

/** GET /api/assignments con filtros de rango. */
export async function fetchAssignments(params: {
  from?: string;
  to?: string;
  day?: string;
  month?: string;
}): Promise<AssignmentRecord[]> {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => Boolean(v)).map(([k, v]) => [k, v as string])
  ).toString();
  const res = await fetch(`/api/assignments${qs ? `?${qs}` : ""}`, { cache: "no-store" });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || "No se pudo cargar las asignaciones");
  return (json.data ?? []).map(mapDbAssignment);
}

/** Convierte una asignación de la UI en payload válido para la BD. */
export function toDbPayload(a: {
  assignmentDate: string;
  employeeId: string;
  zoneId?: string;
  startTime?: string;
  endTime?: string;
  color?: string;
  isDayOff?: boolean;
  notes?: string;
}) {
  return {
    assignment_date: a.assignmentDate,
    employee_id: a.employeeId,
    zone_id: a.isDayOff ? null : a.zoneId || null,
    start_time: a.isDayOff ? null : a.startTime || null,
    end_time: a.isDayOff ? null : a.endTime || null,
    color_hex: a.isDayOff ? "#9CA3AF" : a.color || "#C86D3B",
    is_day_off: Boolean(a.isDayOff),
    notes: a.notes?.trim() || null,
  };
}
