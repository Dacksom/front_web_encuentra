/**
 * Contrato del repositorio de personas encontradas.
 * El dominio define el QUÉ; la infraestructura implementa el CÓMO (HTTP).
 */
import { RegisterFoundPersonInput, ResultadoRegistro } from './found-person.model';

export interface FoundPersonRepository {
  /** POST /encontrados — registra e indexa una persona hallada (multipart). */
  register(input: RegisterFoundPersonInput): Promise<ResultadoRegistro>;
}
