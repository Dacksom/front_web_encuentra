/**
 * DTOs de la respuesta de POST /buscados (snake_case, forma del backend).
 * NO se usan en la UI: se mapean a modelos de dominio antes de salir de la capa.
 */

/** Una persona candidata devuelta por el cotejo facial. */
export interface CandidatoDto {
  person_id: string;
  estado: string; // 'buscada' | 'encontrada'
  es_menor?: boolean;
  nombre?: string | null;
  apellido?: string | null;
  edad?: string | null;
  refugio?: string | null;
  ubicacion?: string | null;
  telefono?: string | null;
  descripcion?: string | null;
  image_url: string;
  distancia: number;
  coincidencia: number; // 0-100
  confianza: string; // 'alta' | 'media' | 'baja'
}

/** Sobre de respuesta con la lista de coincidencias. */
export interface ResultadoBusquedaDto {
  codigo: string;
  total: number;
  coincidencias: CandidatoDto[];
}
