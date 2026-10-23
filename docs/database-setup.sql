-- Esquema Inicial de Base de Datos para Ricuras de Sal y Dulce
-- Base de datos: PostgreSQL con Supabase RLS

-- 1. Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabla de perfiles de usuario vinculada con auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'usuario' CHECK (role IN ('usuario', 'admin', 'superadmin')),
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Habilitar RLS en profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Funciones helper (SECURITY DEFINER para evitar recursion en RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_active = TRUE AND role IN ('admin', 'superadmin')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_active = TRUE AND role = 'superadmin'
  );
$$;

-- Politicas RLS para profiles
CREATE POLICY "Los usuarios pueden ver su propio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Los administradores pueden ver todos los perfiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Los superadministradores pueden gestionar perfiles"
  ON public.profiles FOR ALL
  USING (public.is_superadmin());

-- Trigger para crear automaticamente el perfil tras el registro en Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'usuario')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Tabla de colaboradores / empleados
CREATE TABLE IF NOT EXISTS public.employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  phone TEXT,
  document_id TEXT UNIQUE,
  position TEXT NOT NULL DEFAULT 'Polifuncional',
  photo_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Solo administradores pueden consultar empleados"
  ON public.employees FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Solo administradores pueden crear o actualizar empleados"
  ON public.employees FOR ALL
  USING (public.is_admin());

-- 4. Tabla de zonas del establecimiento
CREATE TABLE IF NOT EXISTS public.zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  color_hex TEXT NOT NULL DEFAULT '#C86D3B',
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Administradores pueden gestionar zonas"
  ON public.zones FOR ALL
  USING (public.is_admin());

-- Insercion de zonas predeterminadas
INSERT INTO public.zones (name, color_hex, description, sort_order) VALUES
  ('Barra y Cafeteria', '#C86D3B', 'Preparacion de cafe de especialidad, bebidas y despacho', 1),
  ('Piso 1 (Salon Principal)', '#2C1A11', 'Atencion de mesas en el salon interior', 2),
  ('Cocina y Despacho', '#8B261D', 'Elaboracion de platos de sal y repostería', 3),
  ('Terraza y Patio', '#2D5A3D', 'Mesas exteriores con ambientacion de plantas', 4),
  ('Sede Loja Padel Club', '#1E40AF', 'Sucursal Six Wellness Center / Padel', 5)
ON CONFLICT DO NOTHING;

-- 5. Tabla de registros de asistencia
CREATE TABLE IF NOT EXISTS public.attendance_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  record_type TEXT NOT NULL CHECK (record_type IN ('entrada', 'salida')),
  method TEXT NOT NULL CHECK (method IN ('manual', 'camara', 'whatsapp')),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  photo_url TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  status TEXT NOT NULL DEFAULT 'valido' CHECK (status IN ('valido', 'rechazado')),
  rejection_reason TEXT,
  notes TEXT,
  registered_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attendance_employee_date ON public.attendance_records(employee_id, timestamp);

ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Administradores pueden gestionar marcaciones"
  ON public.attendance_records FOR ALL
  USING (public.is_admin());

-- 6. Tabla de asignacion de tareas y turnos por dia/semana
CREATE TABLE IF NOT EXISTS public.task_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  zone_id UUID NOT NULL REFERENCES public.zones(id) ON DELETE RESTRICT,
  assignment_date DATE NOT NULL,
  shift TEXT NOT NULL DEFAULT 'completo' CHECK (shift IN ('manana', 'tarde', 'noche', 'completo')),
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_date ON public.task_assignments(assignment_date);

ALTER TABLE public.task_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Administradores pueden gestionar tareas"
  ON public.task_assignments FOR ALL
  USING (public.is_admin());

-- 7. Bucket de almacenamiento para fotos de asistencia
INSERT INTO storage.buckets (id, name, public)
VALUES ('attendance-photos', 'attendance-photos', true)
ON CONFLICT (id) DO NOTHING;
