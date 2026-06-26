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
    <div className="min-h-screen flex flex-col font-sans" id="app-root-container">
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
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-xl border border-rose-100/50">
                <Heart size={20} className="fill-rose-500 text-rose-500 animate-[pulse_2s_infinite]" />
              </div>
              <div>
                <h1 className="text-base font-black text-slate-800 tracking-tight leading-none uppercase">Reencuentro</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">S.O.S Desastres Venezuela</p>
              </div>
            </div>

            {/* Top Status (Live Indicator) */}
            <div className="hidden md:flex items-center gap-2 text-xs font-semibold bg-slate-50 border border-slate-200/50 rounded-lg py-1 px-2.5 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
              <span>Base de Datos Activa</span>
              <span className="text-slate-300">|</span>
              <span className="font-mono">{foundPersons.length} Rostros Indexados</span>
            </div>
          </div>
        </div>

        {/* Tab Selector Section */}
        <div className="bg-slate-50/50 border-t border-slate-100 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex overflow-x-auto space-x-1 py-1.5 scrollbar-none">
            <button
              onClick={() => setActiveTab('buscar')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'buscar'
                  ? 'bg-white text-rose-600 shadow-sm border border-slate-200/40'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              id="tab-btn-buscar"
            >
              <Search size={14} />
              Buscar Familiar (Reconocimiento Facial)
            </button>

            <button
              onClick={() => setActiveTab('reportar')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'reportar'
                  ? 'bg-white text-rose-600 shadow-sm border border-slate-200/40'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              id="tab-btn-reportar"
            >
              <PlusCircle size={14} />
              Reportar Persona Encontrada
            </button>

            <button
              onClick={() => setActiveTab('api')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'api'
                  ? 'bg-white text-rose-600 shadow-sm border border-slate-200/40'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              id="tab-btn-api"
            >
              <FileCode size={14} />
              Guía de Integración API (Chroma & DeepFace)
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
      </main>

      {/* Main Footer */}
      <footer className="bg-white border-t border-slate-100 py-6 mt-12 text-center text-slate-400 text-xs font-medium space-y-1">
        <p className="text-slate-500 flex items-center justify-center gap-1">
          <span>Hecho con</span> <Heart size={10} className="fill-rose-500 text-rose-500" /> <span>para el soporte humanitario en emergencias de Venezuela.</span>
        </p>
        <p className="text-[10px] text-slate-400">
          Esta plataforma cumple con los lineamientos de protección de identidad para menores y heridos desorientados de las Naciones Unidas.
        </p>
      </footer>
    </div>
  );
}
