/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Search, 
  PlusCircle, 
  Building, 
  Phone, 
  MapPin, 
  User, 
  FileCode, 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle, 
  Clock, 
  Users, 
  ExternalLink,
  ShieldAlert,
  Activity,
  Instagram,
  Mail,
  Info
} from 'lucide-react';

import { FoundPerson } from './types';
import { INITIAL_FOUND_PERSONS } from './data';
import SearchMissingForm from './components/SearchMissingForm';
import ReportFoundForm from './components/ReportFoundForm';
import ApiIntegrationGuide from './components/ApiIntegrationGuide';
import OnboardingModal from './components/OnboardingModal';
import { reportarFalla } from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState<'buscar' | 'reportar' | 'api'>('reportar');
  const [infoTip, setInfoTip] = useState<'buscar' | 'reportar' | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [errorSending, setErrorSending] = useState(false);
  const [errorSent, setErrorSent] = useState(false);
  const [errorSendError, setErrorSendError] = useState<string | null>(null);

  const openErrorModal = () => {
    setErrorText('');
    setErrorSent(false);
    setErrorSendError(null);
    setIsErrorModalOpen(true);
  };

  const submitFalla = async () => {
    if (errorText.trim().length < 3 || errorSending) return;
    setErrorSending(true);
    setErrorSendError(null);
    try {
      await reportarFalla(errorText);
      setErrorSent(true);
      setErrorText('');
    } catch (err) {
      setErrorSendError(err instanceof Error ? err.message : 'No se pudo enviar el reporte. Intenta de nuevo.');
    } finally {
      setErrorSending(false);
    }
  };
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('ven_onboarded'));

  const closeOnboarding = () => {
    localStorage.setItem('ven_onboarded', '1');
    setShowOnboarding(false);
  };
  const [foundPersons, setFoundPersons] = useState<FoundPerson[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>(() => localStorage.getItem('ven_disaster_last_updated') || new Date().toISOString());
  const [now, setNow] = useState(() => Date.now());
  const [stats, setStats] = useState({
    totalFound: 142,
    totalMissingSearched: 485,
    reunitedCount: 58,
    activeShelters: 12
  });

  // Load from localStorage or seed initial found persons on component mount
  useEffect(() => {
    const stored = localStorage.getItem('ven_disaster_found_persons');
    if (stored) {
      try {
        setFoundPersons(JSON.parse(stored));
      } catch (e) {
        setFoundPersons(INITIAL_FOUND_PERSONS);
      }
    } else {
      setFoundPersons(INITIAL_FOUND_PERSONS);
      localStorage.setItem('ven_disaster_found_persons', JSON.stringify(INITIAL_FOUND_PERSONS));
    }

    const storedStats = localStorage.getItem('ven_disaster_stats');
    if (storedStats) {
      try {
        setStats(JSON.parse(storedStats));
      } catch (e) {
        // use default state
      }
    }
  }, []);

  // Tick "now" every 30s so the relative "última actualización" stays fresh
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);

  // Format elapsed time as "hace 30 seg" / "hace 20 min" / "hace 1h 20min"
  const formatAgo = (iso: string) => {
    const s = Math.max(0, Math.floor((now - new Date(iso).getTime()) / 1000));
    if (s < 60) return `hace ${s} seg`;
    const m = Math.floor(s / 60);
    if (m < 60) return `hace ${m} min`;
    const h = Math.floor(m / 60);
    const rm = m % 60;
    return rm ? `hace ${h}h ${rm}min` : `hace ${h}h`;
  };

  // Save to localStorage whenever foundPersons updates
  const savePersons = (updatedList: FoundPerson[]) => {
    setFoundPersons(updatedList);
    localStorage.setItem('ven_disaster_found_persons', JSON.stringify(updatedList));

    const now = new Date().toISOString();
    setLastUpdated(now);
    localStorage.setItem('ven_disaster_last_updated', now);

    // Update total found stat dynamically
    const newStats = {
      ...stats,
      totalFound: 137 + (updatedList.length - INITIAL_FOUND_PERSONS.length)
    };
    setStats(newStats);
    localStorage.setItem('ven_disaster_stats', JSON.stringify(newStats));
  };

  const handleAddPerson = (newPerson: FoundPerson) => {
    const updated = [newPerson, ...foundPersons];
    savePersons(updated);
  };


  // Emergency helplines for Venezuelan civil support
  const emergencyHotlines = [
    { agency: "Protección Civil Nacional", phone: "0800-PCCIVIL (7224845)", hours: "24 Horas", desc: "Coordinación nacional de desastres y rescate." },
    { agency: "Cuerpo de Bomberos de Caracas", phone: "(0212) 545-4545", hours: "24 Horas", desc: "Emergencias viales, rescate y atención primaria." },
    { agency: "Cruz Roja Venezolana", phone: "(0212) 571-4111", hours: "8:00 AM - 6:00 PM", desc: "Búsqueda de familiares, apoyo médico y humanitario." },
    { agency: "Servicio de Emergencias VEN 911", phone: "911", hours: "24 Horas", desc: "Línea única de atención para emergencias y patrullaje." }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans overflow-x-hidden" id="app-root-container">
      {showOnboarding && (
        <OnboardingModal
          onClose={closeOnboarding}
          onSelect={(tab) => { setActiveTab(tab); closeOnboarding(); }}
        />
      )}

      {/* Patriotic Subtle Accent Bar representing the Venezuelan Flag colors */}
      <div className="h-1.5 w-full flex">
        <div className="h-full w-1/3 bg-amber-400"></div>
        <div className="h-full w-1/3 bg-blue-600"></div>
        <div className="h-full w-1/3 bg-rose-600"></div>
      </div>

      {/* Main Header / Navigation */}
      <header className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo area */}
            <div className="flex items-center gap-2 sm:gap-3 shrink min-w-0">
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl shadow-sm overflow-hidden shrink-0 flex items-center justify-center">
                <div className="absolute inset-0 flex flex-col">
                  <div className="flex-1 bg-amber-400"></div>
                  <div className="flex-1 bg-blue-600"></div>
                  <div className="flex-1 bg-rose-600"></div>
                </div>
                <Heart size={18} className="relative text-white fill-white sm:w-5 sm:h-5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] animate-pulse" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-base font-black text-slate-800 tracking-tight leading-none truncate">VzlaEncuentra</h1>
                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 truncate">S.O.S. - Búsqueda de personas</p>
              </div>
            </div>

            {/* Top Status and Actions */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">

              <button
                onClick={openErrorModal}
                className="flex items-center gap-1.5 sm:gap-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm shrink-0 whitespace-nowrap"
              >
                <AlertTriangle size={14} />
                <span>Reportar Error</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Main Action Buttons */}
        <div className="relative max-w-4xl mx-auto mb-5">
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



        {activeTab === 'buscar' && (
          <SearchMissingForm />
        )}

        {activeTab === 'reportar' && (
          <ReportFoundForm 
            onAddPerson={handleAddPerson} 
          />
        )}

        {activeTab === 'api' && (
          <ApiIntegrationGuide />
        )}

        {/* Global Database Status (placed below active form) */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {[
            { label: 'Rostros encontrados', value: foundPersons.length, color: 'bg-emerald-400' },
            { label: 'Personas reportadas', value: stats.totalFound, color: 'bg-blue-400' },
            { label: 'Matches realizados', value: stats.reunitedCount, color: 'bg-rose-400' },
            {
              label: 'Última actualización',
              value: formatAgo(lastUpdated),
              color: 'bg-amber-400',
            },
          ].map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-2 bg-white border border-slate-200/60 rounded-xl py-2 px-3 shadow-sm min-w-0"
            >
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${s.color} animate-pulse`}></span>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide leading-tight truncate">{s.label}</p>
                <p className="text-sm font-bold text-slate-800 font-mono leading-tight truncate">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Main Footer */}
      <footer className="bg-slate-50 border-t border-slate-200">
        <div className="h-1.5 w-full flex">
          <div className="h-full w-1/3 bg-amber-400"></div>
          <div className="h-full w-1/3 bg-blue-600"></div>
          <div className="h-full w-1/3 bg-rose-600"></div>
        </div>
        <div className="max-w-7xl mx-auto p-4 sm:px-6 lg:px-8 py-6 flex flex-col
         justify-center text-center space-y-2">
          <h3 className="text-sm sm:text-base font-bold text-slate-800 flex flex-wrap items-center justify-center gap-1.5">
            Hecho con <Heart size={18} className="fill-rose-500 text-rose-500 animate-pulse" /> para el soporte humanitario en Venezuela
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Plataforma dedicada a facilitar el reencuentro familiar en situaciones de emergencia. Cumplimos con los lineamientos internacionales de protección de identidad para menores y heridos desorientados.
          </p>

          <div className="pt-4 flex flex-col items-center gap-3">
            <p className="text-xs sm:text-sm text-slate-500 max-w-md">
              Para dudas, aportes o problemas, comunícate con nosotros:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <a
                href="https://instagram.com/Venezuelaencuentra"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white shadow-md hover:shadow-lg hover:scale-[1.03] transition-all bg-gradient-to-tr from-amber-500 via-rose-600 to-purple-600"
              >
                <Instagram size={18} />
                @Venezuelaencuentra
              </a>
              <a
                href="https://tiktok.com/@venezuelaencuentra"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white shadow-md hover:shadow-lg hover:scale-[1.03] transition-all bg-slate-900 hover:bg-black"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M16.5 3c.3 2.3 1.6 3.9 3.9 4.1v2.7c-1.3.1-2.5-.3-3.9-1.1v5.9c0 3.4-2.5 5.4-5.3 5.4A5.4 5.4 0 0 1 6 14.6c0-3.2 3-5.5 6.1-4.7v2.8c-.5-.2-1-.2-1.5-.1-1.2.2-2 1-1.9 2.3.1 1.2 1 1.9 2.2 1.8 1.2-.1 1.9-1 1.9-2.3V3h2.7Z"/>
                </svg>
                @venezuelaencuentra
              </a>
              <a
                href="mailto:Venezuelaencuentra@gmail.com"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white shadow-md hover:shadow-lg hover:scale-[1.03] transition-all bg-rose-600 hover:bg-rose-700"
              >
                <Mail size={18} />
                Email
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Error Reporting Modal */}
      {isErrorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <button 
              onClick={() => setIsErrorModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl font-bold"
            >
              &times;
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                <AlertTriangle size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Reportar un Error</h3>
            </div>

            {errorSent ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-100">
                  <CheckCircle size={26} />
                </div>
                <p className="text-sm font-semibold text-slate-800">¡Gracias por tu reporte!</p>
                <p className="text-xs text-slate-500 mt-1">Lo revisaremos pronto.</p>
                <button
                  onClick={() => setIsErrorModalOpen(false)}
                  className="mt-5 px-4 py-2 text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-all"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-slate-600 mb-4">
                  Describe brevemente el problema que encontraste para que podamos solucionarlo lo antes posible.
                </p>
                <textarea
                  maxLength={350}
                  value={errorText}
                  onChange={(e) => setErrorText(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm min-h-[100px] focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  placeholder="Ej: La imagen no carga, el botón de enviar no funciona..."
                ></textarea>
                <p className="text-[10px] text-slate-400 text-right mt-1 tabular-nums">{errorText.length}/350</p>
                {errorSendError && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertTriangle size={13} className="shrink-0" />{errorSendError}
                  </p>
                )}
                <div className="mt-4 flex justify-end gap-3">
                  <button
                    onClick={() => setIsErrorModalOpen(false)}
                    className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={submitFalla}
                    disabled={errorText.trim().length < 3 || errorSending}
                    className="px-4 py-2 text-sm font-semibold bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg shadow-sm transition-all"
                  >
                    {errorSending ? 'Enviando…' : 'Enviar Reporte'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
