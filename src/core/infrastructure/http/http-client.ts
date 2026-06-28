/**
 * Cliente HTTP de bajo nivel (capa infrastructure), sobre axios.
 *
 * Dos helpers usados por TODOS los repositorios:
 *  - `postForm`  → peticiones `multipart/form-data` (suben fotos en el campo `files`).
 *                  Se pasa un `FormData`; axios fija solo el boundary multipart.
 *  - `postJson`  → peticiones JSON normales.
 *
 * Ambos centralizan:
 *  - La base URL (`VITE_API_URL`, por defecto `/api`).
 *  - El manejo del error 422 de FastAPI, cuyo cuerpo trae `detail` (string o lista
 *    de `{ msg }`). Se convierte en un `Error` con mensaje legible para la UI.
 */
import axios from 'axios';

/** Instancia compartida. Sin Content-Type por defecto: axios lo deduce (JSON o multipart). */
const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, ''),
});

/** Extrae un mensaje de error legible del error de axios (formato FastAPI). */
function readError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const detail = err.response?.data?.detail;
    if (detail) {
      return Array.isArray(detail)
        ? detail.map((d: { msg: string }) => d.msg).join(' · ')
        : String(detail);
    }
    if (err.response) return `Error ${err.response.status}`;
  }
  return err instanceof Error ? err.message : 'Error de red';
}

/** POST multipart. El `FormData` ya debe traer los archivos y campos listos. */
export async function postForm<T>(path: string, form: FormData): Promise<T> {
  try {
    const res = await api.post<T>(path, form);
    return res.data;
  } catch (err) {
    throw new Error(readError(err));
  }
}

/** POST JSON. */
export async function postJson<T>(path: string, body: unknown): Promise<T> {
  try {
    const res = await api.post<T>(path, body, { headers: { 'Content-Type': 'application/json' } });
    return res.data;
  } catch (err) {
    throw new Error(readError(err));
  }
}
