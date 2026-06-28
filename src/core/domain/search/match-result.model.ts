/**
 * Modelos de dominio del cotejo facial (camelCase).
 */
import { FoundPerson } from '../found-person/found-person.model';

/** Una coincidencia devuelta por el cotejo, ya en forma de UI. */
export interface MatchResult {
  foundPerson: FoundPerson;
  similarity: number; // 0..1 (coincidencia / 100)
  distance: number; // distancia coseno de ChromaDB (< 1 = certeza)
  isCertain: boolean; // confianza === 'alta'
}

/**
 * Datos que captura `SearchView` (familiar) para lanzar el cotejo.
 * Basta la foto + (nombre O cédula); el resto es opcional.
 */
export interface SearchByImageInput {
  files: File[];
  nombre?: string;
  apellido?: string;
  edad?: string;
  docTipo?: string;
  docNumero?: string;
  telefonoContacto?: string;
  limite?: number; // tope de resultados; la API lo acota a 30..50
}
