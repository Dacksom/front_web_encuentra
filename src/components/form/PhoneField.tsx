/**
 * Campo de teléfono venezolano: prefijo (select) + 7 dígitos.
 * Ej.: 0424 + 8135166 → 04248135166. Solo deja escribir dígitos en el número.
 */
import React from 'react';
import { Phone } from 'lucide-react';
import { inputClasses } from './Field';
import { RING } from '../ui/accents';

/** Prefijos móviles de Venezuela. */
export const PHONE_PREFIXES = ['0414', '0424', '0412', '0416', '0426', '0422'];

interface Props {
  prefijo: string;
  numero: string;
  onPrefijo: (value: string) => void;
  onNumero: (value: string) => void;
  error?: boolean;
  id?: string;
}

export default function PhoneField({ prefijo, numero, onPrefijo, onNumero, error, id }: Props) {
  return (
    <div className="flex gap-2">
      <select
        value={prefijo}
        onChange={(e) => onPrefijo(e.target.value)}
        className={`px-3 py-2.5 bg-white border border-slate-200 focus:ring-2 rounded-xl text-slate-800 text-sm outline-none transition-all font-bold shadow-sm shrink-0 ${RING.blue}`}
        aria-label="Prefijo telefónico"
      >
        {PHONE_PREFIXES.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Phone size={16} className="text-slate-400" />
        </div>
        <input
          type="tel"
          inputMode="numeric"
          placeholder="8135166"
          maxLength={7}
          value={numero}
          onChange={(e) => onNumero(e.target.value.replace(/\D/g, ''))}
          className={inputClasses('blue', !!error, true)}
          id={id}
        />
      </div>
    </div>
  );
}
