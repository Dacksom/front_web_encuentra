/**
 * Contrato del repositorio de cotejo facial.
 */
import { MatchResult, SearchByImageInput } from './match-result.model';

export interface SearchRepository {
  /** POST /buscados — devuelve coincidencias ordenadas por semejanza (multipart). */
  searchByImage(input: SearchByImageInput): Promise<MatchResult[]>;
}
