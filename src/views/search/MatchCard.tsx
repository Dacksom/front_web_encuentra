/**
 * Tarjeta de una coincidencia de búsqueda.
 * Muestra foto + datos y permite (a) abrir el detalle o (b) reportar como falso.
 * El estado (reportado / confirmando) lo controla la vista padre.
 */
import React from 'react';
import { MapPin, FileText, ArrowRight, Flag } from 'lucide-react';
import Button from '../../components/ui/Button';
import { FoundPerson, hasValidCi } from '../../core/container';

interface Props {
  person: FoundPerson;
  index: number;
  isReported: boolean;   // ya marcado como falso
  isConfirming: boolean; // pidiendo confirmación "¿reportar como falso?"
  onSelect: () => void;
  onFlag: () => void;        // abre la confirmación
  onConfirmYes: () => void;  // confirma reporte falso
  onConfirmNo: () => void;   // cancela la confirmación
}

export default function MatchCard({
  person, index, isReported, isConfirming, onSelect, onFlag, onConfirmYes, onConfirmNo,
}: Props) {
  return (
    <div
      role="button"
      tabIndex={isReported ? -1 : 0}
      onClick={() => !isReported && onSelect()}
      onKeyDown={(e) => {
        if (!isReported && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`group text-left bg-white rounded-2xl border overflow-hidden transition-all ${
        isReported
          ? 'border-slate-200 opacity-60 cursor-default'
          : 'border-slate-200 hover:border-rose-300 hover:shadow-lg cursor-pointer'
      }`}
      id={`match-card-${index}`}
    >
      <img
        src={person.imageUrl}
        alt={person.name}
        className={`w-full h-56 object-contain bg-slate-100 ${isReported ? 'grayscale' : ''}`}
        referrerPolicy="no-referrer"
      />
      <div className="p-4 space-y-2">
        <h4 className="text-base font-bold text-slate-800 leading-tight">{person.name}</h4>
        <p className="text-sm text-slate-600 flex items-start gap-1.5">
          <MapPin size={15} className="text-rose-500 shrink-0 mt-0.5" />
          <span className="line-clamp-2">{person.hospitalName}</span>
        </p>
        {hasValidCi(person.ci) && (
          <p className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
            <FileText size={13} className="text-slate-400 shrink-0" />
            {person.ci}
          </p>
        )}

        {isReported ? (
          <p className="flex items-center gap-1.5 text-xs font-bold text-amber-600 pt-1">
            <Flag size={13} /> Reportado como falso. ¡Gracias!
          </p>
        ) : isConfirming ? (
          <div className="flex items-center justify-between gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
            <span className="text-xs font-semibold text-slate-600">¿Reportar como falso?</span>
            <div className="flex items-center gap-1.5 shrink-0">
              <Button variant="primary" accent="amber" size="sm" onClick={(e) => { e.stopPropagation(); onConfirmYes(); }}>
                Sí
              </Button>
              <Button variant="soft" accent="slate" size="sm" onClick={(e) => { e.stopPropagation(); onConfirmNo(); }}>
                No
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-rose-600 group-hover:gap-2 transition-all">
              Ver información <ArrowRight size={15} />
            </span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onFlag(); }}
              className="p-1.5 rounded-full text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all shrink-0"
              title="Reportar como falso"
              aria-label="Reportar como falso"
            >
              <Flag size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
