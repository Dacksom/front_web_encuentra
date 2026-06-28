/**
 * Encabezado de la app: logo + acceso a "Reportar Error".
 * `onReportError` lo provee App (abre el modal de reporte de falla).
 */
import React from 'react';
import { Heart, AlertTriangle } from 'lucide-react';
import Button from '../ui/Button';

interface Props {
  onReportError: () => void;
}

export default function Header({ onReportError }: Props) {
  return (
    <header className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3 shrink min-w-0">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl shadow-sm overflow-hidden shrink-0 flex items-center justify-center">
              <div className="absolute inset-0 flex flex-col">
                <div className="flex-1 bg-amber-400" />
                <div className="flex-1 bg-blue-600" />
                <div className="flex-1 bg-rose-600" />
              </div>
              <Heart size={18} className="relative text-white fill-white sm:w-5 sm:h-5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] animate-pulse" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-black text-slate-800 tracking-tight leading-none truncate">VzlaEncuentra</h1>
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 truncate">S.O.S. - Búsqueda de personas</p>
            </div>
          </div>

          {/* Acción: reportar error */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Button
              variant="soft"
              accent="amber"
              icon={AlertTriangle}
              iconSize={14}
              onClick={onReportError}
              className="shrink-0 whitespace-nowrap"
            >
              Reportar Error
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
