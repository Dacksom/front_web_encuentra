/**
 * BACK → FRONT. Mapea los DTOs del cotejo (snake_case) a modelos de dominio.
 *
 * `resolveUrl` se inyecta para no acoplar la capa application con infrastructure:
 * el repositorio le pasa `resolveImageUrl`.
 */
import { FoundPerson } from '../../../domain/found-person/found-person.model';
import { MatchResult } from '../../../domain/search/match-result.model';
import { CandidatoDto, ResultadoBusquedaDto } from '../dto/candidato.dto';

type UrlResolver = (u: string) => string;

const toFoundPerson = (c: CandidatoDto, resolveUrl: UrlResolver): FoundPerson => ({
  id: c.person_id,
  name: c.es_menor
    ? 'Menor protegido'
    : [c.nombre, c.apellido].filter(Boolean).join(' ').trim() || 'Sin nombre',
  ci: '', // /buscados no devuelve el documento del candidato
  hospitalName: c.refugio ?? '',
  locationAddress: c.ubicacion ?? '',
  contactPhone: c.telefono ?? '',
  physicalDescription: c.descripcion ?? '',
  imageUrl: resolveUrl(c.image_url),
  dateFound: '',
  status: c.estado === 'encontrada' ? 'refugiado' : 'desconocido',
});

const toMatch = (c: CandidatoDto, resolveUrl: UrlResolver): MatchResult => ({
  foundPerson: toFoundPerson(c, resolveUrl),
  similarity: c.coincidencia / 100,
  distance: c.distancia,
  isCertain: c.confianza === 'alta',
});

/** Convierte el sobre de respuesta en la lista de coincidencias de dominio. */
export const mapBusqueda = (res: ResultadoBusquedaDto, resolveUrl: UrlResolver): MatchResult[] =>
  res.coincidencias.map((c) => toMatch(c, resolveUrl));
