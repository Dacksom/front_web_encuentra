/**
 * Contrato del repositorio de reportes.
 */
import { ReporteCreado } from './report.model';

export interface ReportRepository {
  /** POST /reportes/falla — el usuario describe un problema de la página. */
  reportFalla(descripcion: string): Promise<ReporteCreado>;
  /** POST /reportes/publicacion — marca una publicación/foto como inadecuada o falsa. */
  reportPublicacion(personId: string): Promise<ReporteCreado>;
}
