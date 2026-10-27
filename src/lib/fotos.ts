/**
 * Convierte lo guardado en attendance_records.photo_url en una dirección que el
 * navegador pueda mostrar:
 * - Ruta del bucket privado ("attendance/xxx.jpg") → endpoint protegido que firma el link.
 * - Link público antiguo de Supabase Storage → se extrae la ruta y se usa el mismo endpoint
 *   (sigue funcionando cuando el bucket pase a privado).
 * - Cualquier otra URL (p. ej. Google Drive del bot) → se deja igual.
 */
export function fotoSrc(photoUrl: string | null | undefined): string | undefined {
  if (!photoUrl) return undefined;
  if (photoUrl.startsWith("data:")) return photoUrl;

  const marcaPublica = "/storage/v1/object/public/attendance-photos/";
  const idx = photoUrl.indexOf(marcaPublica);
  const path = idx >= 0 ? photoUrl.slice(idx + marcaPublica.length) : photoUrl.startsWith("attendance/") ? photoUrl : null;

  return path ? `/api/attendance/foto?path=${encodeURIComponent(path)}` : photoUrl;
}
