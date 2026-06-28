/**
 * Implementación HTTP de ReportRepository → POST /reportes/* (JSON).
 */
import { ReporteCreado } from '../../domain/report/report.model';
import { ReportRepository } from '../../domain/report/report.repository';
import { postJson } from '../http/http-client';

/** URL oficial del proyecto, adjunta en los reportes de falla. */
const PROJECT_URL = 'https://symtechven.com/';

export function createReportHttpRepository(): ReportRepository {
  return {
    reportFalla(descripcion: string) {
      return postJson<ReporteCreado>('/reportes/falla', {
        descripcion: descripcion.trim(),
        url: PROJECT_URL,
      });
    },
    reportPublicacion(personId: string) {
      return postJson<ReporteCreado>('/reportes/publicacion', {
        person_id: personId,
        descripcion: 'contenido ofensivo o los resultados no concuerdan',
      });
    },
  };
}
