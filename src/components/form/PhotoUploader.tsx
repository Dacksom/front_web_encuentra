/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Subida de fotos (drag&drop + grilla de miniaturas) compartida por ambos forms.
 */
import React, { useRef } from 'react';
import { Upload, X, Camera } from 'lucide-react';

export type Photo = { file: File; url: string };

const ACCENTS = {
  rose: {
    zoneEmpty: 'border-rose-600 bg-rose-50/40',
    zoneFilled: 'border-rose-300 bg-rose-50/20',
    iconWrap: 'bg-rose-50 text-rose-500',
    add: 'border-rose-300 text-rose-500 hover:border-rose-500 hover:bg-rose-50',
  },
  blue: {
    zoneEmpty: 'border-blue-600 bg-blue-50/30',
    zoneFilled: 'border-blue-300 bg-blue-50/20',
    iconWrap: 'bg-blue-50 text-blue-500',
    add: 'border-blue-300 text-blue-500 hover:border-blue-500 hover:bg-blue-50',
  },
};

interface Props {
  photos: Photo[];
  max: number;
  accent: keyof typeof ACCENTS;
  error?: boolean;
  disabled?: boolean;
  onAdd: (files: FileList | File[]) => void;
  onRemove: (idx: number) => void;
}

export default function PhotoUploader({ photos, max, accent, error, disabled, onAdd, onRemove }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const a = ACCENTS[accent];
  const zone = error ? 'border-red-400 bg-red-50/30' : photos.length ? a.zoneFilled : a.zoneEmpty;
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) onAdd(e.target.files);
    e.target.value = '';
  };

  return (
    <>
      {/* Subir desde archivos/galería */}
      <input type="file" ref={inputRef} onChange={handleInput} accept="image/*" multiple={max > 1} className="hidden" />
      {/* Tomar foto con la cámara (capture abre la cámara en móvil) */}
      <input type="file" ref={cameraRef} onChange={handleInput} accept="image/*" capture="environment" className="hidden" />
      <div
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onDrop={(e) => { e.preventDefault(); e.stopPropagation(); if (e.dataTransfer.files) onAdd(e.dataTransfer.files); }}
        className={`border-2 border-dashed rounded-xl p-4 transition-all ${zone} ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
        id="image-dropzone"
      >
        {photos.length === 0 ? (
          <div className="text-center py-4">
            <div className={`w-11 h-11 rounded-full ${a.iconWrap} flex items-center justify-center mx-auto mb-2`}>
              <Upload size={20} />
            </div>
            <p className="text-sm font-semibold text-slate-700">Sube una foto o tómala con la cámara</p>
            <p className="text-xs text-slate-400 mt-0.5">JPG o PNG — rostro frontal claro{max > 1 ? ` (hasta ${max})` : ''}</p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <button type="button" onClick={() => inputRef.current?.click()} className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border-2 ${a.add} text-xs font-bold transition-all`}>
                <Upload size={15} /> Subir foto
              </button>
              <button type="button" onClick={() => cameraRef.current?.click()} className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border-2 ${a.add} text-xs font-bold transition-all`}>
                <Camera size={15} /> Tomar foto
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
            {photos.map((p, idx) => (
              <div key={idx} className="relative aspect-square">
                <img src={p.url} alt={`Foto ${idx + 1}`} className="w-full h-full object-contain bg-slate-100 rounded-lg border border-slate-200 shadow-sm" />
                <button
                  type="button"
                  onClick={() => onRemove(idx)}
                  className="absolute -top-1.5 -right-1.5 bg-white text-slate-500 p-1 rounded-full shadow-md border border-slate-200 hover:text-rose-600 hover:border-rose-200 transition-all z-10"
                  aria-label="Quitar foto"
                >
                  <X size={13} strokeWidth={3} />
                </button>
              </div>
            ))}
            {photos.length < max && (
              <>
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className={`aspect-square rounded-lg border-2 border-dashed ${a.add} flex flex-col items-center justify-center gap-1 transition-all`}
                >
                  <Upload size={18} />
                  <span className="text-[10px] font-bold">Subir</span>
                </button>
                <button
                  type="button"
                  onClick={() => cameraRef.current?.click()}
                  className={`aspect-square rounded-lg border-2 border-dashed ${a.add} flex flex-col items-center justify-center gap-1 transition-all`}
                >
                  <Camera size={18} />
                  <span className="text-[10px] font-bold">Cámara</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
