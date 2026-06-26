/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FoundPerson {
  id: string;
  name: string; // Optional name, "Desconocido" if unknown
  ci: string; // Optional Cédula, "Desconocido" if unknown
  hospitalName: string; // Hospital/Refuge/Location where they are
  locationAddress: string; // Actual location details
  contactPhone: string; // Reporter's contact phone
  physicalDescription: string; // Physical features, state of health, clothing
  imageUrl: string; // Image placeholder / dataUrl for visual UI
  dateFound: string; // ISO date string
  status: 'refugiado' | 'hospitalizado' | 'desconocido' | 'reunificado';
}

export interface MatchResult {
  foundPerson: FoundPerson;
  similarity: number; // 0 to 1 scale (e.g. 0.85 = 85% similarity)
  distance: number; // The exact mathematical distance from ChromaDB (e.g., < 1 is high certainty)
  isCertain: boolean; // distance < 1
}

export interface SearchRequest {
  requesterCi: string;
  missingPersonImage: string; // Data URL or file name
  dateRequested: string;
}
