/**
 * Barra de progreso del cotejo facial (estado "analizando").
 * `step` = texto del paso actual, `progress` = 0..100.
 */
import React from 'react';

interface Props {
  step: string;
  progress: number;
}

export default function AnalysisProgress({ step, progress }: Props) {
  return (
    <div className="space-y-2.5 bg-slate-50 border border-slate-100 rounded-xl p-4" id="analysis-status">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-slate-600 font-medium truncate">{step}</span>
        <span className="text-rose-600 font-bold tabular-nums shrink-0">{progress}%</span>
      </div>
      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-rose-500 rounded-full transition-[width] duration-200 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-[11px] text-slate-400">Reconocimiento facial en proceso, no cierres esta ventana.</p>
    </div>
  );
}
