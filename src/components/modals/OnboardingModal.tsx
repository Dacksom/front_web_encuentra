/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modal de bienvenida que aparece solo la primera vez que se abre la app.
 */
import React from 'react';
import { Search, PlusCircle, Heart } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface Props {
  onClose: () => void;
  onSelect: (tab: 'buscar' | 'reportar') => void;
}

export default function OnboardingModal({ onClose, onSelect }: Props) {
  return (
    <Modal open onClose={onClose} maxWidth="max-w-lg" zIndex="z-[80]" panelClassName="p-6 sm:p-7 overflow-y-auto">
      <div className="text-center mb-5">
        <div className="relative w-12 h-12 rounded-xl shadow-sm overflow-hidden flex items-center justify-center mx-auto mb-3">
          <div className="absolute inset-0 flex flex-col">
            <div className="flex-1 bg-amber-400" />
            <div className="flex-1 bg-blue-600" />
            <div className="flex-1 bg-rose-600" />
          </div>
          <Heart size={22} className="relative text-white fill-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]" />
        </div>
        <h2 className="text-lg font-black text-slate-800 tracking-tight">Bienvenido a VzlaEncuentra</h2>
        <p className="text-sm text-slate-500 mt-1">Así puedes ayudar a reunir familias.</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <button
          type="button"
          onClick={() => onSelect('buscar')}
          className="text-left bg-rose-50/60 border border-rose-100 rounded-xl p-4 flex gap-3 hover:bg-rose-50 hover:border-rose-300 hover:shadow-md transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0">
            <Search size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-rose-900">Buscar familiar</h3>
            <p className="text-xs text-slate-600 leading-snug mt-0.5">
              Sube la foto de tu ser querido. Analizamos su rostro y lo comparamos con las personas ya reportadas.
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSelect('reportar')}
          className="text-left bg-blue-50/60 border border-blue-100 rounded-xl p-4 flex gap-3 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
            <PlusCircle size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-blue-900">Reportar persona encontrada</h3>
            <p className="text-xs text-slate-600 leading-snug mt-0.5">
              ¿Ayudaste a alguien? Registra su foto y sus datos para que su familia pueda dar con ella. Reporta solo casos reales.
            </p>
          </div>
        </button>
      </div>

      <Button variant="primary" accent="slate" size="lg" fullWidth onClick={onClose} className="mt-5">
        Entendido, empezar
      </Button>
    </Modal>
  );
}
