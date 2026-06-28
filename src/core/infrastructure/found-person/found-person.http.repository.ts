/**
 * Implementación HTTP de FoundPersonRepository → POST /encontrados (multipart).
 */
import {
  RegisterFoundPersonInput,
  ResultadoRegistro,
} from '../../domain/found-person/found-person.model';
import { FoundPersonRepository } from '../../domain/found-person/found-person.repository';
import { postForm } from '../http/http-client';
import { appendIf } from '../http/form-data';
import { prepareFiles } from '../http/heic';

export function createFoundPersonHttpRepository(): FoundPersonRepository {
  return {
    async register(input: RegisterFoundPersonInput) {
      const fd = new FormData();
      (await prepareFiles(input.files)).forEach((f) => fd.append('files', f));
      fd.append('es_menor', String(input.esMenor));
      // nombre/apellido se envían siempre (también para menores); el back decide qué guardar.
      appendIf(fd, 'nombre', input.nombre);
      appendIf(fd, 'apellido', input.apellido);
      appendIf(fd, 'doc_tipo', input.docTipo);
      appendIf(fd, 'doc_numero', input.docNumero);
      appendIf(fd, 'refugio', input.refugio);
      appendIf(fd, 'ubicacion', input.ubicacion);
      appendIf(fd, 'telefono_responsable', input.telefonoResponsable);
      appendIf(fd, 'doc_responsable', input.docResponsable);
      appendIf(fd, 'descripcion', input.descripcion);

      return postForm<ResultadoRegistro>('/encontrados', fd);
    },
  };
}
