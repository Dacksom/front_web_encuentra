/**
 * Modal de detalle de una coincidencia: ubicación, descripción, contacto y
 * botón para escribir por WhatsApp al enlace/rescate.
 */
import React from 'react';
import { MapPin, Phone, Heart, X } from 'lucide-react';
import Modal from '../ui/Modal';
import { FoundPerson, hasValidCi } from '../../core/container';

interface Props {
  person: FoundPerson | null;
  onClose: () => void;
}

/** Arma el enlace de WhatsApp normalizando el teléfono a internacional (+58). */
const waLink = (phone: string) => {
  let d = (phone || '').replace(/\D/g, '');
  if (d.startsWith('58')) {
    /* ya internacional */
  } else if (d.startsWith('0')) {
    d = `58${d.slice(1)}`;
  } else {
    d = `58${d}`;
  }
  return `https://wa.me/${d}`;
};

export default function CandidateDetailModal({ person, onClose }: Props) {
  if (!person) return null;

  return (
    // padded=false + showClose=false: la imagen va a sangre y el cierre se dibuja
    // en blanco sobre ella.
    <Modal open onClose={onClose} zIndex="z-[60]" panelClassName="flex flex-col overflow-hidden" showClose={false}>
      {/* Cabecera con foto fija (no hace scroll) */}
      <div className="relative shrink-0">
        <img
          src={person.imageUrl}
          alt={person.name}
          className="w-full h-64 sm:h-72 object-contain"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10">
          <h4 className="font-bold text-white text-xl leading-tight">{person.name}</h4>
          {hasValidCi(person.ci) && (
            <p className="text-xs text-white/80 font-mono mt-0.5">Cédula: {person.ci}</p>
          )}
        </div>
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-3 right-3 text-white bg-black/30 hover:bg-black/50 p-1.5 rounded-full transition-all backdrop-blur-sm"
        >
          <X size={18} />
        </button>
      </div>

      {/* Contenido con scroll */}
      <div className="overflow-y-auto p-5 sm:p-6 space-y-4 text-sm" id="candidate-detail-pane">
        <div>
          <span className="font-bold text-slate-700 block mb-1">Ubicación Actual:</span>
          <p className="text-slate-600 flex items-start gap-1.5">
            <MapPin size={16} className="text-rose-500 shrink-0 mt-0.5" />
            <span><strong>{person.hospitalName}</strong> - {person.locationAddress}</span>
          </p>
        </div>

        <div>
          <span className="font-bold text-slate-700 block mb-1">Descripción Física y Estado:</span>
          <p className="text-slate-600 leading-relaxed bg-slate-50 border border-slate-200/50 rounded-xl p-3 font-sans italic text-xs">
            "{person.physicalDescription}"
          </p>
        </div>

        <div>
          <span className="font-bold text-slate-700 block mb-1">Contacto de Enlace o Rescate:</span>
          <p className="text-slate-700 flex items-center gap-2 font-mono bg-slate-50 px-3 py-2 rounded-lg border border-slate-200/50">
            <Phone size={14} className="text-slate-400 shrink-0" />
            {person.contactPhone}
          </p>
        </div>

        <div className="pt-4 border-t border-slate-200/60">
          {/* Es un enlace (no botón): se mantiene <a> con estilo de acción emerald. */}
          <a
            href={waLink(person.contactPhone)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            id="btn-request-reunion"
          >
            <Heart size={16} />
            Contactar vía WhatsApp
          </a>
        </div>
      </div>
    </Modal>
  );
}
