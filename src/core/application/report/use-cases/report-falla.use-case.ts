/**
 * Caso de uso: reportar una falla de la página.
 */
import { ReportRepository } from '../../../domain/report/report.repository';

export function makeReportFalla(repo: ReportRepository) {
  return (descripcion: string) => repo.reportFalla(descripcion);
}
