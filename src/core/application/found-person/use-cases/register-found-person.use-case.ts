/**
 * Caso de uso: registrar una persona hallada.
 * Thin wrapper sobre el repositorio. La regla de protección de menores la aplica
 * el backend (ver `RegisterFoundPersonInput`).
 */
import { RegisterFoundPersonInput } from '../../../domain/found-person/found-person.model';
import { FoundPersonRepository } from '../../../domain/found-person/found-person.repository';

export function makeRegisterFoundPerson(repo: FoundPersonRepository) {
  return (input: RegisterFoundPersonInput) => repo.register(input);
}
