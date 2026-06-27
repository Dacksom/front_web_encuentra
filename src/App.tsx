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
  Activity
} from 'lucide-react';

import { FoundPerson } from './types';
import { INITIAL_FOUND_PERSONS } from './data';
import SearchMissingForm from './components/SearchMissingForm';
import ReportFoundForm from './components/ReportFoundForm';
import ApiIntegrationGuide from './components/ApiIntegrationGuide';

export default function App() {
  const [activeTab, setActiveTab] = useState<'buscar' | 'reportar' | 'api'>('buscar');
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [foundPersons, setFoundPersons] = useState<FoundPerson[]>([]);
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

  // Save to localStorage whenever foundPersons updates
  const savePersons = (updatedList: FoundPerson[]) => {
    setFoundPersons(updatedList);
    localStorage.setItem('ven_disaster_found_persons', JSON.stringify(updatedList));
    
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

  const handleTriggerReunion = (reunitedPerson: FoundPerson) => {
    const updated = foundPersons.map(p => {
      if (p.id === reunitedPerson.id) {
        return { ...p, status: 'reunificado' as const };
      }
      return p;
    });
    savePersons(updated);

    // Increment reunited count
    const newStats = {
      ...stats,
      reunitedCount: stats.reunitedCount + 1
    };
    setStats(newStats);
    localStorage.setItem('ven_disaster_stats', JSON.stringify(newStats));
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
              <div className="p-1.5 sm:p-2 bg-rose-600 rounded-xl shadow-sm border border-rose-700 shrink-0 flex items-center justify-center">
                <Heart size={18} className="text-white fill-white sm:w-5 sm:h-5 animate-pulse" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-base font-black text-slate-800 tracking-tight leading-none uppercase truncate">Reencuentro</h1>
                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 truncate">S.O.S. - Búsqueda de personas</p>
              </div>
            </div>

            {/* Top Status and Actions */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">

              <button
                onClick={() => setIsErrorModalOpen(true)}
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
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Main Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 max-w-4xl mx-auto px-2">
          <button
            onClick={() => setActiveTab('buscar')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-2 p-3 rounded-xl text-sm sm:text-base font-bold transition-all duration-300 ${
              activeTab === 'buscar'
                ? 'bg-rose-600 text-white ring-2 ring-offset-2 ring-offset-[#e2e8f0] ring-rose-500 shadow-md'
                : 'bg-rose-500 text-white hover:bg-rose-600 shadow-sm opacity-95 hover:opacity-100'
            }`}
          >
            <Search size={22} />
            <span className="text-center">Buscar Familiar (Reconocimiento Facial)</span>
          </button>

          <button
            onClick={() => setActiveTab('reportar')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-2 p-3 rounded-xl text-sm sm:text-base font-bold transition-all duration-300 ${
              activeTab === 'reportar'
                ? 'bg-blue-600 text-white ring-2 ring-offset-2 ring-offset-[#e2e8f0] ring-blue-500 shadow-md'
                : 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm opacity-95 hover:opacity-100'
            }`}
          >
            <PlusCircle size={22} />
            <span className="text-center">Reportar Persona Encontrada</span>
          </button>
        </div>



        {activeTab === 'buscar' && (
          <SearchMissingForm 
            foundPersons={foundPersons} 
            onTriggerReunion={handleTriggerReunion} 
          />
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
        <div className="flex justify-center mt-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold bg-white border border-slate-200/60 rounded-lg py-1.5 px-3 text-slate-600 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Cantidad de rostros encontrados: <span className="font-mono text-slate-800 font-bold">{foundPersons.length}</span></span>
          </div>
        </div>
      </main>

      {/* Main Footer */}
      <footer className="bg-slate-50 mt-12 border-t border-slate-200">
        <div className="h-1.5 w-full flex">
          <div className="h-full w-1/3 bg-amber-400"></div>
          <div className="h-full w-1/3 bg-blue-600"></div>
          <div className="h-full w-1/3 bg-rose-600"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col items-center justify-center text-center space-y-2">
          <h3 className="text-sm sm:text-base font-bold text-slate-800 flex flex-wrap items-center justify-center gap-1.5">
            Hecho con <Heart size={18} className="fill-rose-500 text-rose-500 animate-pulse" /> para el soporte humanitario en Venezuela
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Plataforma dedicada a facilitar el reencuentro familiar en situaciones de emergencia. Cumplimos con los lineamientos internacionales de protección de identidad para menores y heridos desorientados.
          </p>
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
            <p className="text-sm text-slate-600 mb-4">
              Describe brevemente el problema que encontraste para que podamos solucionarlo lo antes posible.
            </p>
            <textarea 
              className="w-full border border-slate-200 rounded-xl p-3 text-sm min-h-[100px] focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              placeholder="Ej: La imagen no carga, el botón de enviar no funciona..."
            ></textarea>
            <div className="mt-5 flex justify-end gap-3">
              <button 
                onClick={() => setIsErrorModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  alert('¡Gracias por tu reporte! Lo revisaremos pronto.');
                  setIsErrorModalOpen(false);
                }}
                className="px-4 py-2 text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-white rounded-lg shadow-sm transition-all"
              >
                Enviar Reporte
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
