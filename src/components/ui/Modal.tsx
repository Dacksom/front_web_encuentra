/**
 * Shell de modal: overlay + panel centrado + cierre por click-fuera y botón X.
 * El contenido (children) lo pone cada modal.
 *
 *  - `panelClassName` controla padding/overflow del panel (default: con padding).
 *  - `showClose=false` para modales que dibujan su propio cierre (p.ej. sobre una imagen).
 */
import React from 'react';
import { X } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;       // clase tailwind, ej. 'max-w-md'
  zIndex?: string;         // clase tailwind, ej. 'z-50'
  panelClassName?: string; // padding/overflow del panel
  showClose?: boolean;
  id?: string;
}

export default function Modal({
  open,
  onClose,
  children,
  maxWidth = 'max-w-md',
  zIndex = 'z-50',
  panelClassName = 'p-6 overflow-y-auto',
  showClose = true,
  id,
}: Props) {
  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 ${zIndex} flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm`}
      onClick={onClose}
      id={id}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full ${maxWidth} relative max-h-[90vh] animate-[fadeIn_0.2s_ease-out] ${panelClassName}`}
        onClick={(e) => e.stopPropagation()}
      >
        {showClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute top-4 right-4 z-10 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-all"
          >
            <X size={18} />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
