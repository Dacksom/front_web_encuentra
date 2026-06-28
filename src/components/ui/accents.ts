/**
 * Sistema de "accent" (color) compartido por las primitivas UI.
 *
 * Tailwind v4 NO genera clases dinámicas (`bg-${accent}-600`): por eso cada accent
 * se mapea a strings de clases LITERALES (Tailwind escanea este archivo y las
 * detecta). Estos mapas son la única fuente de color de la UI.
 */

export type Accent = 'rose' | 'blue' | 'emerald' | 'amber' | 'slate' | 'red';

/** Botón relleno (texto blanco). */
export const SOLID: Record<Accent, string> = {
  rose: 'bg-rose-600 hover:bg-rose-700',
  blue: 'bg-blue-600 hover:bg-blue-700',
  emerald: 'bg-emerald-600 hover:bg-emerald-700',
  amber: 'bg-amber-500 hover:bg-amber-600',
  slate: 'bg-slate-900 hover:bg-slate-800',
  red: 'bg-red-600 hover:bg-red-700',
};

/** Botón/etiqueta suave (fondo claro + texto del color + borde tenue). */
export const SOFT: Record<Accent, string> = {
  rose: 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200',
  blue: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200',
  emerald: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200',
  amber: 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200',
  slate: 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200',
  red: 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200',
};

/** Chip de icono (fondo claro + icono del color, sin borde). */
export const CHIP: Record<Accent, string> = {
  rose: 'bg-rose-50 text-rose-600',
  blue: 'bg-blue-50 text-blue-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  slate: 'bg-slate-50 text-slate-600',
  red: 'bg-red-50 text-red-600',
};

/** Caja/callout (fondo claro + borde + texto). */
export const BOX: Record<Accent, string> = {
  rose: 'bg-rose-50 border-rose-200 text-rose-800',
  blue: 'bg-blue-50 border-blue-200 text-blue-800',
  emerald: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  amber: 'bg-amber-50 border-amber-200 text-amber-800',
  slate: 'bg-slate-50 border-slate-200 text-slate-800',
  red: 'bg-red-50 border-red-200 text-red-700',
};

/** Foco de inputs/selects. */
export const RING: Record<Accent, string> = {
  rose: 'focus:border-rose-500 focus:ring-rose-500/20',
  blue: 'focus:border-blue-500 focus:ring-blue-500/20',
  emerald: 'focus:border-emerald-500 focus:ring-emerald-500/20',
  amber: 'focus:border-amber-500 focus:ring-amber-500/20',
  slate: 'focus:border-slate-500 focus:ring-slate-500/20',
  red: 'focus:border-red-500 focus:ring-red-500/20',
};

/** Acento por defecto de los inputs (la mayoría son azules). */
type InputAccent = Extract<Accent, 'blue' | 'rose'>;

/** className compartido por todos los inputs/selects/textarea. */
export function inputClasses(accent: InputAccent = 'blue', error?: boolean, hasIcon?: boolean): string {
  const border = error
    ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
    : `border-slate-200 ${RING[accent]}`;
  const padLeft = hasIcon ? 'pl-10' : 'pl-3.5';
  return `w-full ${padLeft} pr-3.5 py-2.5 bg-white border focus:ring-2 rounded-xl text-slate-800 text-sm placeholder-slate-400 outline-none transition-all font-medium shadow-sm ${border}`;
}
