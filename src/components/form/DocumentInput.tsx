/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Documento de identidad: selector de tipo + número (solo dígitos).
 * Compartido por buscar/reportar.
 */
import React from 'react';
import { inputClasses } from './Field';

export const DOC_TYPES = ['V', 'E', 'J', 'P', 'G', 'C', 'R'];

interface Props {
  tipo: string;
  numero: string;
  onTipo: (v: string) => void;
  onNumero: (v: string) => void;
  accent: 'blue' | 'rose';
  error?: boolean;
  numeroId?: string;
}

export default function DocumentInput({ tipo, numero, onTipo, onNumero, accent, error, numeroId }: Props) {
  const selectCls = `px-3 py-2.5 font-bold shrink-0 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm outline-none transition-all shadow-sm focus:ring-2 ${
    accent === 'rose' ? 'focus:border-rose-500 focus:ring-rose-500/20' : 'focus:border-blue-500 focus:ring-blue-500/20'
  }`;

  return (
    <div className="flex gap-2">
      <select value={tipo} onChange={(e) => onTipo(e.target.value)} className={selectCls} aria-label="Tipo de documento">
        {DOC_TYPES.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      <input
        type="text"
        inputMode="numeric"
        placeholder="Ej: 12345678"
        maxLength={9}
        value={numero}
        onChange={(e) => onNumero(e.target.value.replace(/\D/g, ''))}
        className={inputClasses(accent, error)}
        id={numeroId}
      />
    </div>
  );
}
