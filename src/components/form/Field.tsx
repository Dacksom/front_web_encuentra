/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Campo de formulario reutilizable (input/textarea) con label, icono, error,
 * hint y contador. Usa las primitivas de `ui/` (InputLabel, FieldError, accents).
 */
import React, { useId } from 'react';
import type { LucideIcon } from 'lucide-react';
import InputLabel from '../ui/InputLabel';
import FieldError from '../ui/FieldError';
import { inputClasses, type Accent } from '../ui/accents';

// Re-export por compatibilidad: varios módulos importan inputClasses desde aquí.
export { inputClasses };

type FieldAccent = Extract<Accent, 'blue' | 'rose'>;

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
  accent?: FieldAccent;
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
  const autoId = useId();
  const fieldId = id ?? autoId;

  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex items-center justify-between gap-2">
          <InputLabel htmlFor={fieldId} required={required} optional={optional}>
            {label}
          </InputLabel>
          {counter && maxLength && (
            <span className="text-[10px] font-semibold text-slate-400 normal-case tabular-nums">{value.length}/{maxLength}</span>
          )}
        </div>
      )}
      <div className="relative">
        {Icon && (
          <div className={`absolute left-0 pl-3.5 flex pointer-events-none text-slate-400 ${multiline ? 'top-3 items-start' : 'inset-y-0 items-center'}`}>
            <Icon size={16} />
          </div>
        )}
        {multiline ? (
          <textarea id={fieldId} placeholder={placeholder} rows={rows} maxLength={maxLength} value={value} onChange={(e) => handle(e.target.value)} className={cls} />
        ) : (
          <input id={fieldId} type={type} inputMode={inputMode} placeholder={placeholder} maxLength={maxLength} value={value} onChange={(e) => handle(e.target.value)} className={cls} />
        )}
      </div>
      {error ? <FieldError message={error} /> : hint && <p className="text-[11px] text-slate-400">{hint}</p>}
    </div>
  );
}
