/**
 * Chip cuadrado con un icono, en color accent. Usado en los headers de vista.
 */
import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Accent, CHIP } from './accents';

interface Props {
  icon: LucideIcon;
  accent: Accent;
  size?: number;
}

export default function IconChip({ icon: Icon, accent, size = 22 }: Props) {
  return (
    <div className={`p-2.5 rounded-xl shrink-0 ${CHIP[accent]}`}>
      <Icon size={size} />
    </div>
  );
}
