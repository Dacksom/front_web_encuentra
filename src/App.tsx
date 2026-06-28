/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Shell de la aplicación: layout (header/footer), navegación entre las dos
 * vistas (Buscar / Reportar), onboarding y modal de reporte de error.
 * La lógica de cada flujo vive en su vista (`views/`); aquí solo se rutea.
 */
import React, { useState } from 'react';
import { Search, PlusCircle, Info } from 'lucide-react';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import FlagBar from './components/layout/FlagBar';
import OnboardingModal from './components/modals/OnboardingModal';
import ErrorReportModal from './components/modals/ErrorReportModal';
import SearchView from './views/search/SearchView';
import ReportView from './views/report/ReportView';

type Tab = 'buscar' | 'reportar';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('buscar');
  const [infoTip, setInfoTip] = useState<Tab | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  // El onboarding se muestra solo la primera visita (marca en localStorage).
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('ven_onboarded'));

  const closeOnboarding = () => {
    localStorage.setItem('ven_onboarded', '1');
    setShowOnboarding(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans overflow-x-hidden" id="app-root-container">
      {showOnboarding && (
        <OnboardingModal
          onClose={closeOnboarding}
          onSelect={(tab) => { setActiveTab(tab); closeOnboarding(); }}
        />
      )}

      <FlagBar />
      <Header onReportError={() => setIsErrorModalOpen(true)} />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Navegación entre vistas (tabs) */}
        <div className="relative max-w-4xl mx-auto mb-5">
          {/* Capa transparente para cerrar el tooltip al hacer click fuera */}
          {infoTip && <div className="fixed inset-0 z-40" onClick={() => setInfoTip(null)} />}

          <div className="flex rounded-xl border-2 border-slate-200 overflow-hidden shadow-sm" role="tablist">
            <button
              onClick={() => { setActiveTab('buscar'); setInfoTip(null); }}
              role="tab"
              aria-selected={activeTab === 'buscar'}
              className={`relative flex-1 basis-1/2 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 px-2 py-3 text-xs sm:text-base font-bold transition-all duration-300 ${
                activeTab === 'buscar'
                  ? 'bg-rose-600 text-white shadow-inner'
                  : 'bg-white text-rose-600 hover:bg-rose-50'
              }`}
            >
              <Search size={20} className="shrink-0" />
              <span className="text-center leading-tight">Buscar Familiar</span>
              <span
                role="button"
                tabIndex={0}
                aria-label="Qué es Buscar Familiar"
                onClick={(e) => { e.stopPropagation(); setInfoTip(infoTip === 'buscar' ? null : 'buscar'); }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); setInfoTip(infoTip === 'buscar' ? null : 'buscar'); } }}
                className="absolute top-1 right-1 inline-flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
              >
                <Info size={15} />
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('reportar'); setInfoTip(null); }}
              role="tab"
              aria-selected={activeTab === 'reportar'}
              className={`relative flex-1 basis-1/2 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 px-2 py-3 text-xs sm:text-base font-bold border-l-2 border-slate-200 transition-all duration-300 ${
                activeTab === 'reportar'
                  ? 'bg-blue-600 text-white shadow-inner'
                  : 'bg-white text-blue-600 hover:bg-blue-50'
              }`}
            >
              <PlusCircle size={20} className="shrink-0" />
              <span className="text-center leading-tight">Reportar Persona Encontrada</span>
              <span
                role="button"
                tabIndex={0}
                aria-label="Qué es Reportar Persona Encontrada"
                onClick={(e) => { e.stopPropagation(); setInfoTip(infoTip === 'reportar' ? null : 'reportar'); }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); setInfoTip(infoTip === 'reportar' ? null : 'reportar'); } }}
                className="absolute top-1 right-1 inline-flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
              >
                <Info size={15} />
              </span>
            </button>
          </div>

          {/* Tooltips explicativos de cada tab */}
          {infoTip === 'buscar' && (
            <div className="absolute z-50 top-full mt-2 left-0 w-72 max-w-[calc(100%-1rem)] bg-white border border-rose-200 rounded-xl shadow-lg p-3.5 text-left">
              <p className="text-xs font-bold text-rose-900 mb-1">Buscar familiar</p>
              <p className="text-xs text-slate-600 leading-snug">Sube la foto de tu ser querido. Analizamos su rostro y lo comparamos con las personas ya reportadas.</p>
            </div>
          )}
          {infoTip === 'reportar' && (
            <div className="absolute z-50 top-full mt-2 right-0 w-72 max-w-[calc(100%-1rem)] bg-white border border-blue-200 rounded-xl shadow-lg p-3.5 text-left">
              <p className="text-xs font-bold text-blue-900 mb-1">Reportar persona encontrada</p>
              <p className="text-xs text-slate-600 leading-snug">¿Ayudaste a alguien? Registra su foto y sus datos para que su familia pueda dar con ella. Reporta solo casos reales.</p>
            </div>
          )}
        </div>

        {/* Vista activa */}
        {activeTab === 'buscar' && <SearchView />}
        {activeTab === 'reportar' && <ReportView />}
      </main>

      <Footer />

      <ErrorReportModal open={isErrorModalOpen} onClose={() => setIsErrorModalOpen(false)} />
    </div>
  );
}
