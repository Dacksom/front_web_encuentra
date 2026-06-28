/**
 * Caso de uso: reportar una publicación/foto como inadecuada o falsa.
 */
import { ReportRepository } from '../../../domain/report/report.repository';

export function makeReportPublicacion(repo: ReportRepository) {
  return (personId: string) => repo.reportPublicacion(personId);
}
