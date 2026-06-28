/**
 * Modelos de dominio del flujo "persona encontrada" (camelCase).
 * Forma que consume la UI. Sin dependencias de capas externas.
 */

export type FoundPersonStatus =
  | 'refugiado'
  | 'hospitalizado'
  | 'desconocido'
  | 'reunificado';

/** Persona hallada e indexada. Se muestra en las tarjetas y el modal de detalle. */
export interface FoundPerson {
  id: string;
  name: string;
  ci: string;
  hospitalName: string;
  locationAddress: string;
  contactPhone: string;
  physicalDescription: string;
  imageUrl: string;
  dateFound: string; // ISO
  status: FoundPersonStatus;
}

/**
 * Datos que captura `ReportView` (rescatista) para registrar a una persona.
 *
 * Nota sobre protección de menores: cuando `esMenor` es true, la UI oculta el
 * documento propio y exige el del responsable. El front envía siempre
 * nombre/apellido y el backend decide qué persiste.
 */
export interface RegisterFoundPersonInput {
  files: File[];
  esMenor: boolean;
  nombre?: string;
  apellido?: string;
  docTipo?: string;
  docNumero?: string;
  refugio?: string;
  ubicacion?: string;
  telefonoResponsable?: string;
  docResponsable?: string;
  descripcion?: string;
}

/** Aviso que el back devuelve cuando un familiar ya buscaba a la persona registrada. */
export interface AlertaFamiliar {
  person_id: string;
  familiar_nombre?: string | null;
  familiar_telefono?: string | null;
  image_url: string;
  coincidencia: number; // 0-100
  confianza: string; // 'alta' | 'media' | 'baja'
}

/** Resultado de registrar una persona encontrada (POST /encontrados). */
export interface ResultadoRegistro {
  codigo: string;
  person_id: string;
  alerta?: AlertaFamiliar | null;
}

/**
 * ¿La cédula es real y mostrable? Falsa para vacío o marcadores como
 * "Desconocido" / "No aplica (Menor de edad)". Regla de presentación de dominio.
 */
export const hasValidCi = (ci: string): boolean => !!ci && !/desconocido|no aplica/i.test(ci);
