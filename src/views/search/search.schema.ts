/**
 * Schema de validación del formulario de búsqueda (familiar).
 *
 * QUÉ valida:
 *  - `photos`: al menos una foto.
 *  - identidad: basta el nombre O la cédula (no hacen falta ambos).
 *
 * CÓMO: Zod. `validateSearch` devuelve errores por campo en la forma que la
 * vista ya usa (`{ photos?, identidad? }`) para pintar los mensajes inline.
 */
import { z } from 'zod';

export const searchSchema = z
  .object({
    photos: z.array(z.any()).min(1, 'Por favor, selecciona o sube al menos una foto de la persona que buscas.'),
    nombre: z.string(),
    docNumero: z.string(),
  })
  // basta nombre O cédula
  .refine((d) => d.nombre.trim() !== '' || d.docNumero.trim() !== '', {
    message: 'Indica al menos el nombre o la cédula de quien buscas.',
    path: ['identidad'],
  });

export type SearchFormValues = z.infer<typeof searchSchema>;

/** Errores por campo: clave = campo, valor = mensaje. */
export type SearchErrors = { photos?: string; identidad?: string };

/** Valida y devuelve `{ ok, errors }`. La vista mapea errors a su estado. */
export function validateSearch(values: SearchFormValues): { ok: boolean; errors: SearchErrors } {
  const res = searchSchema.safeParse(values);
  if (res.success) return { ok: true, errors: {} };
  const errors: SearchErrors = {};
  for (const issue of res.error.issues) {
    const key = issue.path[0] as keyof SearchErrors;
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return { ok: false, errors };
}
