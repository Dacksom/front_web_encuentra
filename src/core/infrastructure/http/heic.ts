/**
 * Conversión HEIC/HEIF → PNG (capa infrastructure).
 *
 * Los iPhone suben fotos en HEIC/HEIF y el backend las rechaza. Los navegadores
 * NO decodifican HEIC de forma fiable (ni con <img>/canvas), así que usamos
 * `heic2any` (libheif en wasm), importado de forma diferida para no cargarlo
 * cuando no hace falta.
 */

/** Detecta HEIC/HEIF por MIME o por extensión (iOS a veces manda type vacío). */
const isHeic = (f: File) =>
  /hei[cf]/i.test(f.type) ||
  /\.(heic|heif)$/i.test(f.name) ||
  (f.type === '' && /\.(heic|heif)$/i.test(f.name));

/** Convierte un archivo HEIC a PNG. Si no es HEIC o la conversión falla, lo deja igual. */
async function toPngIfHeic(file: File): Promise<File> {
  if (!isHeic(file)) return file;
  try {
    const heic2any = (await import('heic2any')).default;
    const out = await heic2any({ blob: file, toType: 'image/png' });
    const blob = Array.isArray(out) ? out[0] : out;
    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.png', { type: 'image/png' });
  } catch {
    return file; // último recurso: se envía tal cual
  }
}

/** Normaliza un lote de archivos antes de subirlos (convierte los HEIC). */
export const prepareFiles = (files: File[]) => Promise.all(files.map(toPngIfHeic));
