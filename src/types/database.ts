export type UserRole = "usuario" | "admin" | "superadmin";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: string;
  full_name: string;
  phone: string | null;
  document_id: string | null;
  position: string;
  photo_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Zone {
  id: string;
  name: string;
  color_hex: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export type AttendanceMethod = "manual" | "camara" | "whatsapp";
export type AttendanceRecordType = "entrada" | "salida";
export type AttendanceStatus = "valido" | "rechazado";

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  record_type: AttendanceRecordType;
  method: AttendanceMethod;
  timestamp: string;
  photo_url: string | null;
  latitude: number | null;
  longitude: number | null;
  status: AttendanceStatus;
  rejection_reason: string | null;
  notes: string | null;
  registered_by: string | null;
  created_at: string;
  employee?: Employee;
}

export type TaskShift = "manana" | "tarde" | "noche" | "completo";

export interface TaskAssignment {
  id: string;
  employee_id: string;
  zone_id: string;
  assignment_date: string;
  shift: TaskShift;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  employee?: Employee;
  zone?: Zone;
}
