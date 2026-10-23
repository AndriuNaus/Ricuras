-- Corrige la recursion infinita en las politicas RLS de profiles.
-- Ejecutar en Supabase > SQL Editor.

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

-- profiles
DROP POLICY IF EXISTS "Los usuarios pueden ver su propio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Los administradores pueden ver todos los perfiles" ON public.profiles;
DROP POLICY IF EXISTS "Los superadministradores pueden gestionar perfiles" ON public.profiles;

CREATE POLICY "Los usuarios pueden ver su propio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Los administradores pueden ver todos los perfiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Los superadministradores pueden gestionar perfiles"
  ON public.profiles FOR ALL
  USING (public.is_superadmin());

-- employees
DROP POLICY IF EXISTS "Solo administradores pueden consultar empleados" ON public.employees;
DROP POLICY IF EXISTS "Solo administradores pueden crear o actualizar empleados" ON public.employees;

CREATE POLICY "Solo administradores pueden consultar empleados"
  ON public.employees FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Solo administradores pueden crear o actualizar empleados"
  ON public.employees FOR ALL
  USING (public.is_admin());

-- zones
DROP POLICY IF EXISTS "Administradores pueden gestionar zonas" ON public.zones;

CREATE POLICY "Administradores pueden gestionar zonas"
  ON public.zones FOR ALL
  USING (public.is_admin());

-- attendance_records
DROP POLICY IF EXISTS "Administradores pueden gestionar marcaciones" ON public.attendance_records;

CREATE POLICY "Administradores pueden gestionar marcaciones"
  ON public.attendance_records FOR ALL
  USING (public.is_admin());

-- task_assignments
DROP POLICY IF EXISTS "Administradores pueden gestionar tareas" ON public.task_assignments;

CREATE POLICY "Administradores pueden gestionar tareas"
  ON public.task_assignments FOR ALL
  USING (public.is_admin());
