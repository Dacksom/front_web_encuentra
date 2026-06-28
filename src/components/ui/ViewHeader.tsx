/**
 * Encabezado de una vista: chip de icono + título + subtítulo, con un slot de
 * acción a la derecha (típicamente el botón "¿Cómo funciona?").
 */
import React from 'react';
import type { LucideIcon } from 'lucide-react';
import IconChip from './IconChip';
import { Accent } from './accents';

interface Props {
  icon: LucideIcon;
  accent: Accent;
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}

export default function ViewHeader({ icon, accent, title, subtitle, action }: Props) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 mb-4 border-b border-slate-100">
      <div className="flex items-center gap-3">
        <IconChip icon={icon} accent={accent} />
        <div>
          <h2 className="text-lg font-bold text-slate-800 leading-tight">{title}</h2>
          <p className="text-sm text-slate-500 leading-snug">{subtitle}</p>
        </div>
      </div>
      {action}
    </div>
  );
}
