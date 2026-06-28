/**
 * Caso de uso: cotejar un rostro contra la base indexada.
 * Thin wrapper sobre el repositorio (deja la puerta abierta a reglas futuras).
 */
import { SearchByImageInput } from '../../../domain/search/match-result.model';
import { SearchRepository } from '../../../domain/search/search.repository';

export function makeSearchByImage(repo: SearchRepository) {
  return (input: SearchByImageInput) => repo.searchByImage(input);
}
