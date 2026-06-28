/**
 * Schema de validación del formulario de reporte (rescatista).
 *
 * QUÉ valida:
 *  - `photos`: al menos una foto.
 *  - `refugio`: obligatorio (refugio/hospital/centro receptor).
 *  - `telNumero`: exactamente 7 dígitos (el prefijo se elige aparte).
 *  - `docResponsable`: obligatorio SOLO si es menor de edad.
 *
 * CÓMO: Zod con `superRefine` para la regla condicional del menor.
 * `validateReport` devuelve errores por campo en la forma que la vista usa.
 */
import { z } from 'zod';

export const reportSchema = z
  .object({
    photos: z.array(z.any()).min(1, 'Adjunta al menos una fotografía clara del rostro.'),
    refugio: z.string().trim().min(1, 'Indica el refugio, hospital o centro receptor.'),
    telNumero: z.string().length(7, 'El teléfono debe tener 7 dígitos.'),
    isChild: z.boolean(),
    docResponsable: z.string(),
  })
  .superRefine((d, ctx) => {
    if (d.isChild && d.docResponsable.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['docResponsable'],
        message: 'La identificación del responsable es obligatoria para un menor.',
      });
    }
  });

export type ReportFormValues = z.infer<typeof reportSchema>;

/** Errores por campo, igual que el `errors` Record que ya maneja la vista. */
export type ReportErrors = Record<string, string>;

/** Valida y devuelve `{ ok, errors }`. */
export function validateReport(values: ReportFormValues): { ok: boolean; errors: ReportErrors } {
  const res = reportSchema.safeParse(values);
  if (res.success) return { ok: true, errors: {} };
  const errors: ReportErrors = {};
  for (const issue of res.error.issues) {
    const key = String(issue.path[0] ?? '_form');
    // mapeo del campo del schema al nombre de error que usa la vista
    const field = key === 'telNumero' ? 'telefono' : key;
    if (!errors[field]) errors[field] = issue.message;
  }
  return { ok: false, errors };
}
