/**
 * Etiqueta de campo en mayúsculas, con marca de obligatorio/opcional.
 */
import React from 'react';

interface Props {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  optional?: boolean;
  className?: string;
}

export default function InputLabel({ children, htmlFor, required, optional, className = '' }: Props) {
  return (
    <label htmlFor={htmlFor} className={`text-xs font-bold text-slate-700 uppercase tracking-wider block ${className}`}>
      {children}
      {required && <span className="text-rose-500"> *</span>}
      {optional && <span className="text-slate-400 font-medium normal-case"> (opcional)</span>}
    </label>
  );
}
