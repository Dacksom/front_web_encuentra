/**
 * Tarjeta blanca contenedora (el wrapper de cada vista).
 */
import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function Card({ children, className = '', id }: Props) {
  return (
    <div id={id} className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6 ${className}`}>
      {children}
    </div>
  );
}
