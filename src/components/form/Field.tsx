/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Campo de formulario reutilizable (input/textarea) con label, icono, error,
 * hint y contador. Fuente única del estilo de inputs: `inputClasses`.
 */
import React from 'react';
import type { LucideIcon } from 'lucide-react';

type Accent = 'blue' | 'rose';

const RING: Record<Accent, string> = {
  blue: 'focus:border-blue-500 focus:ring-blue-500/20',
  rose: 'focus:border-rose-500 focus:ring-rose-500/20',
};

/** className compartido por todos los inputs/selects/textarea. */
export function inputClasses(accent: Accent = 'blue', error?: boolean, hasIcon?: boolean): string {
  const border = error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : `border-slate-200 ${RING[accent]}`;
  const padLeft = hasIcon ? 'pl-10' : 'pl-3.5';
  return `w-full ${padLeft} pr-3.5 py-2.5 bg-white border focus:ring-2 rounded-xl text-slate-800 text-sm placeholder-slate-400 outline-none transition-all font-medium shadow-sm ${border}`;
}

interface FieldProps {
  label?: string;
  required?: boolean;
  optional?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
  inputMode?: 'text' | 'numeric' | 'tel' | 'email';
  type?: string;
  icon?: LucideIcon;
  error?: string;
  hint?: string;
  accent?: Accent;
  counter?: boolean;
  numeric?: boolean; // filtra a solo dígitos
  multiline?: boolean;
  rows?: number;
  id?: string;
}

export default function Field({
  label,
  required,
  optional,
  value,
  onChange,
  placeholder,
  maxLength,
  inputMode,
  type = 'text',
  icon: Icon,
  error,
  hint,
  accent = 'blue',
  counter,
  numeric,
  multiline,
  rows = 4,
  id,
}: FieldProps) {
  const handle = (v: string) => onChange(numeric ? v.replace(/\D/g, '') : v);
  const cls = `${inputClasses(accent, !!error, !!Icon)}${multiline ? ' resize-none' : ''}`;

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between gap-2">
          <span>
            {label}
            {required && <span className="text-rose-500"> *</span>}
            {optional && <span className="text-slate-400 font-medium normal-case"> (opcional)</span>}
          </span>
          {counter && maxLength && <span className="text-[10px] font-semibold text-slate-400 normal-case tabular-nums">{value.length}/{maxLength}</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className={`absolute left-0 pl-3.5 flex pointer-events-none text-slate-400 ${multiline ? 'top-3 items-start' : 'inset-y-0 items-center'}`}>
            <Icon size={16} />
          </div>
        )}
        {multiline ? (
          <textarea id={id} placeholder={placeholder} rows={rows} maxLength={maxLength} value={value} onChange={(e) => handle(e.target.value)} className={cls} />
        ) : (
          <input id={id} type={type} inputMode={inputMode} placeholder={placeholder} maxLength={maxLength} value={value} onChange={(e) => handle(e.target.value)} className={cls} />
        )}
      </div>
      {error ? (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <span className="shrink-0">⚠</span>
          {error}
        </p>
      ) : (
        hint && <p className="text-[11px] text-slate-400">{hint}</p>
      )}
    </div>
  );
}
