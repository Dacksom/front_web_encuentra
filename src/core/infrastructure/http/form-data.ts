/**
 * Helper para construir cuerpos `multipart/form-data` (capa infrastructure).
 */

/** Agrega un campo al FormData solo si tiene valor (evita mandar campos vacíos). */
export const appendIf = (fd: FormData, key: string, val?: string) => {
  if (val && val.trim()) fd.append(key, val.trim());
};
