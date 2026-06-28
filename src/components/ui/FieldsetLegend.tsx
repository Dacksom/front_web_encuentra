/**
 * Leyenda de sección dentro de un <fieldset> (icono + texto en mayúsculas).
 */
import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  children: React.ReactNode;
}

export default function FieldsetLegend({ icon: Icon, children }: Props) {
  return (
    <legend className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2.5 flex items-center gap-2">
      <Icon size={13} className="text-slate-400" />
      {children}
    </legend>
  );
}
