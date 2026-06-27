/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Cliente directo de los endpoints reales del swagger (Reencuentros API v2).
 * Solo /buscados (familiar) y /encontrados (rescatista) por ahora.
 * Ambos son multipart/form-data con el/los archivo(s) en el campo `files`.
 */
import { FoundPerson, MatchResult } from './types';

const API_BASE = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '');

/**
 * Origen para las fotos. El back puede enviar URLs completas o rutas relativas
 * (ej. /fotos/personas/abc.jpg). Si solo llega la ruta, le anteponemos este origen.
 * Prioridad: VITE_MEDIA_URL -> origen de VITE_API_URL (si es absoluta) -> '' (relativo).
 */
const MEDIA_BASE = (() => {
  const explicit = import.meta.env.VITE_MEDIA_URL;
  if (explicit) return explicit.replace(/\/$/, '');
  const api = import.meta.env.VITE_API_URL;
  if (api && /^https?:/.test(api)) {
    try {
      return new URL(api).origin;
    } catch {
      /* ignora URL inválida */
    }
  }
  return '';
})();

/** Devuelve siempre una URL utilizable: deja las completas y completa las relativas. */
export const resolveImageUrl = (u: string): string => {
  if (!u) return u;
  if (/^(https?:|data:|blob:)/.test(u)) return u; // ya es URL completa
  const path = u.startsWith('/') ? u : `/${u}`;
  return MEDIA_BASE ? `${MEDIA_BASE}${path}` : path; // sin base configurada -> ruta relativa
};

// ---- Tipos de respuesta (swagger) ----
export interface Candidato {
  person_id: string;
  estado: string; // 'buscada' | 'encontrada'
  es_menor?: boolean;
  nombre?: string | null;
  apellido?: string | null;
  edad?: string | null;
  refugio?: string | null;
  ubicacion?: string | null;
  telefono?: string | null;
  descripcion?: string | null;
  image_url: string;
  distancia: number;
  coincidencia: number; // 0-100
  confianza: string; // 'alta' | 'media' | 'baja'
}

export interface ResultadoBusqueda {
  codigo: string;
  total: number;
  coincidencias: Candidato[];
}

export interface AlertaFamiliar {
  person_id: string;
  familiar_nombre?: string | null;
  familiar_telefono?: string | null;
  image_url: string;
  coincidencia: number;
  confianza: string;
}

export interface ResultadoRegistro {
  codigo: string;
  person_id: string;
  alerta?: AlertaFamiliar | null;
}

// ---- Mapeo Candidato -> tipos de UI ----
const candidatoToFoundPerson = (c: Candidato): FoundPerson => ({
  id: c.person_id,
  name: c.es_menor ? 'Menor protegido' : [c.nombre, c.apellido].filter(Boolean).join(' ').trim() || 'Sin nombre',
  ci: '', // /buscados no devuelve documento del candidato
  hospitalName: c.refugio ?? '',
  locationAddress: c.ubicacion ?? '',
  contactPhone: c.telefono ?? '',
  physicalDescription: c.descripcion ?? '',
  imageUrl: resolveImageUrl(c.image_url),
  dateFound: '',
  status: c.estado === 'encontrada' ? 'refugiado' : 'desconocido',
});

const candidatoToMatch = (c: Candidato): MatchResult => ({
  foundPerson: candidatoToFoundPerson(c),
  similarity: c.coincidencia / 100,
  distance: c.distancia,
  isCertain: c.confianza === 'alta',
});

// ---- Helper POST multipart con manejo de errores 422 de FastAPI ----
async function postForm<T>(path: string, form: FormData): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { method: 'POST', body: form });
  if (!res.ok) {
    let msg = `Error ${res.status}`;
    try {
      const data = await res.json();
      if (data?.detail) {
        msg = Array.isArray(data.detail) ? data.detail.map((d: { msg: string }) => d.msg).join(' · ') : String(data.detail);
      }
    } catch {
      /* respuesta sin JSON */
    }
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

const appendIf = (fd: FormData, key: string, val?: string) => {
  if (val && val.trim()) fd.append(key, val.trim());
};

// ---- POST /buscados (flujo familiar) ----
export interface BuscarInput {
  files: File[];
  nombre?: string;
  apellido?: string;
  edad?: string;
  docTipo?: string;
  docNumero?: string;
  telefonoContacto?: string;
}

export async function buscarPersona(input: BuscarInput): Promise<MatchResult[]> {
  const fd = new FormData();
  input.files.forEach((f) => fd.append('files', f));
  appendIf(fd, 'nombre', input.nombre);
  appendIf(fd, 'apellido', input.apellido);
  appendIf(fd, 'edad', input.edad);
  appendIf(fd, 'doc_tipo', input.docTipo);
  appendIf(fd, 'doc_numero', input.docNumero);
  appendIf(fd, 'telefono_contacto', input.telefonoContacto);
  const res = await postForm<ResultadoBusqueda>('/buscados', fd);
  return res.coincidencias.map(candidatoToMatch);
}

// ---- POST /encontrados (flujo rescatista) ----
export interface EncontradoInput {
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

export async function reportarEncontrado(input: EncontradoInput): Promise<ResultadoRegistro> {
  const fd = new FormData();
  input.files.forEach((f) => fd.append('files', f));
  fd.append('es_menor', String(input.esMenor));
  if (!input.esMenor) {
    appendIf(fd, 'nombre', input.nombre);
    appendIf(fd, 'apellido', input.apellido);
  }
  appendIf(fd, 'doc_tipo', input.docTipo);
  appendIf(fd, 'doc_numero', input.docNumero);
  appendIf(fd, 'refugio', input.refugio);
  appendIf(fd, 'ubicacion', input.ubicacion);
  appendIf(fd, 'telefono_responsable', input.telefonoResponsable);
  appendIf(fd, 'doc_responsable', input.docResponsable);
  appendIf(fd, 'descripcion', input.descripcion);
  return postForm<ResultadoRegistro>('/encontrados', fd);
}
