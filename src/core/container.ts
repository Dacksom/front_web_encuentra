/**
 * Composition root (raíz de composición).
 *
 * Único lugar donde se "cablean" las capas: instancia los repositorios HTTP,
 * los inyecta en los casos de uso y exporta funciones listas para la UI. Los
 * componentes importan SOLO desde aquí, nunca repos ni la red directamente.
 *
 *   vista → (estas funciones) → use-case → repository → http-client → backend
 *
 * Para tests/mock: reemplazar las fábricas `create*HttpRepository` por dobles
 * que cumplan el mismo contrato de dominio.
 */
import { createFoundPersonHttpRepository } from './infrastructure/found-person/found-person.http.repository';
import { createSearchHttpRepository } from './infrastructure/search/search.http.repository';
import { createReportHttpRepository } from './infrastructure/report/report.http.repository';
import { makeRegisterFoundPerson } from './application/found-person/use-cases/register-found-person.use-case';
import { makeSearchByImage } from './application/search/use-cases/search-by-image.use-case';
import { makeReportFalla } from './application/report/use-cases/report-falla.use-case';
import { makeReportPublicacion } from './application/report/use-cases/report-publicacion.use-case';

// --- Repositorios (infraestructura) ---
const foundPersonRepo = createFoundPersonHttpRepository();
const searchRepo = createSearchHttpRepository();
const reportRepo = createReportHttpRepository();

// --- API pública para la UI (casos de uso ya inyectados) ---

/** Familiar: cotejar una foto y obtener coincidencias. */
export const buscarPersona = makeSearchByImage(searchRepo);

/** Rescatista: registrar e indexar una persona encontrada. */
export const reportarEncontrado = makeRegisterFoundPerson(foundPersonRepo);

/** Reportar una falla de la página. */
export const reportarFalla = makeReportFalla(reportRepo);

/** Reportar una publicación/foto como inadecuada o falsa. */
export const reportarPublicacion = makeReportPublicacion(reportRepo);

/** Predicado de dominio reexportado: ¿la cédula es real y mostrable? */
export { hasValidCi } from './domain/found-person/found-person.model';

// Re-export de tipos que la UI necesita tipar.
export type {
  FoundPerson,
  RegisterFoundPersonInput,
  ResultadoRegistro,
  AlertaFamiliar,
} from './domain/found-person/found-person.model';
export type { MatchResult, SearchByImageInput } from './domain/search/match-result.model';
export type { ReporteCreado } from './domain/report/report.model';
