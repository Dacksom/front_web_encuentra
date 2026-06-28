/**
 * Resolución de URLs de imágenes (capa infrastructure).
 *
 * El backend puede devolver URLs completas (https://…) o rutas relativas
 * (ej. `/fotos/personas/abc.jpg`). Cuando llega solo la ruta, le anteponemos un
 * origen de medios.
 *
 * Prioridad del origen:
 *   1. `VITE_MEDIA_URL` (si está configurada).
 *   2. El origen de `VITE_API_URL` (si es absoluta).
 *   3. '' → se sirve como ruta relativa.
 */

const MEDIA_BASE = (() => {
  const explicit = import.meta.env.VITE_MEDIA_URL;
  if (explicit) return explicit.replace(/\/$/, '');
  const api = import.meta.env.VITE_API_URL;
  if (api && /^https?:/.test(api)) {
    try {
      return new URL(api).origin;
    } catch {
      /* URL inválida: caemos a relativo */
    }
  }
  return '';
})();

/** Devuelve siempre una URL utilizable: deja las completas, completa las relativas. */
export function resolveImageUrl(u: string): string {
  if (!u) return u;
  if (/^(https?:|data:|blob:)/.test(u)) return u; // ya es URL completa
  const path = u.startsWith('/') ? u : `/${u}`;
  return MEDIA_BASE ? `${MEDIA_BASE}${path}` : path;
}
