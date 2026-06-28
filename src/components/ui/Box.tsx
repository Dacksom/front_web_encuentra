/**
 * Caja/callout de color accent (fondo claro + borde). Para avisos de éxito,
 * error de formulario, info, etc.
 */
import React from 'react';
import { Accent, BOX } from './accents';

interface Props {
  children: React.ReactNode;
  accent: Accent;
  className?: string;
  id?: string;
}

export default function Box({ children, accent, className = '', id }: Props) {
  return (
    <div id={id} className={`border rounded-xl ${BOX[accent]} ${className}`}>
      {children}
    </div>
  );
}
