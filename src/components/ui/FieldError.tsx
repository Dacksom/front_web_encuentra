/**
 * Línea de error roja con icono. Renderiza null si no hay mensaje.
 */
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  message?: string | null;
  id?: string;
}

export default function FieldError({ message, id }: Props) {
  if (!message) return null;
  return (
    <p className="text-xs text-red-600 mt-1 flex items-center gap-1" id={id}>
      <AlertCircle size={13} className="shrink-0" />
      {message}
    </p>
  );
}
