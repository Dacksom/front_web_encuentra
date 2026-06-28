/**
 * Implementación HTTP de SearchRepository → POST /buscados (multipart).
 */
import { SearchByImageInput } from '../../domain/search/match-result.model';
import { SearchRepository } from '../../domain/search/search.repository';
import { ResultadoBusquedaDto } from '../../application/search/dto/candidato.dto';
import { mapBusqueda } from '../../application/search/mappers/match-result.mapper';
import { postForm } from '../http/http-client';
import { appendIf } from '../http/form-data';
import { prepareFiles } from '../http/heic';
import { resolveImageUrl } from '../http/media-url';

export function createSearchHttpRepository(): SearchRepository {
  return {
    async searchByImage(input: SearchByImageInput) {
      const fd = new FormData();
      (await prepareFiles(input.files)).forEach((f) => fd.append('files', f));
      appendIf(fd, 'nombre', input.nombre);
      appendIf(fd, 'apellido', input.apellido);
      appendIf(fd, 'edad', input.edad);
      appendIf(fd, 'doc_tipo', input.docTipo);
      appendIf(fd, 'doc_numero', input.docNumero);
      appendIf(fd, 'telefono_contacto', input.telefonoContacto);
      // limite: la API lo exige entre 30 y 50.
      const limite = Math.min(50, Math.max(30, input.limite ?? 30));
      fd.append('limite', String(limite));

      const res = await postForm<ResultadoBusquedaDto>('/buscados', fd);
      return mapBusqueda(res, resolveImageUrl);
    },
  };
}
