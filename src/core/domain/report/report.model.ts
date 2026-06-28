/**
 * Modelos de dominio de los reportes (falla de la página / publicación inadecuada).
 */

/** Reporte creado por el backend (POST /reportes/falla | /reportes/publicacion). */
export interface ReporteCreado {
  id: string;
  tipo: string;
  estado: string;
  created_at: string;
}
