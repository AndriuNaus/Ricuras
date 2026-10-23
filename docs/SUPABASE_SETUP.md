# Configuracion de Supabase para Ricuras

## 1. Crear el proyecto
1. Entra a https://supabase.com y crea un proyecto gratuito.
2. Espera a que termine de aprovisionarse.

## 2. Ejecutar el esquema SQL
1. En el dashboard de Supabase, ve a **SQL Editor**.
2. Abre el archivo `docs/database-setup.sql` del proyecto (o `supabase/migrations/001_initial_schema.sql`).
3. Copia **todo** su contenido y pegalo en el SQL Editor.
4. Ejecuta el script (Run).

No pegues la ruta del archivo; pega el contenido SQL.

## 3. Obtener URL y anon key
1. En Supabase, ve a **Project Settings > API**.
2. Copia:
   - **Project URL** -> `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. (Opcional) Copia la **service_role key** -> `SUPABASE_SERVICE_ROLE_KEY` (solo para servidor, nunca en cliente).

## 4. Configurar variables de entorno
Edita `.env.local` en la raiz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU-ANON-KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 5. Ejecutar la app
```bash
npm install
npm run dev
```

## 6. Crear usuarios admin
En Supabase Auth, crea usuarios con email/password. Luego, en la tabla `profiles`, cambia su `role` a `admin` o `superadmin` segun corresponda.

## 7. Si ya ejecutaste el esquema y da error de recursion en profiles
Ejecuta tambien `docs/fix-rls-recursion.sql` en el SQL Editor. Corrige las politicas RLS que causan recursion infinita.
