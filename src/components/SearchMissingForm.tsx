/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Search, User, Shield, Camera, Upload, AlertCircle, FileText, Heart, MapPin, Phone, Eye, ArrowRight, RefreshCw, CheckCircle2, HelpCircle } from 'lucide-react';
import { FoundPerson, MatchResult } from '../types';

interface SearchMissingFormProps {
  foundPersons: FoundPerson[];
  onTriggerReunion: (person: FoundPerson) => void;
}

export default function SearchMissingForm({ foundPersons, onTriggerReunion }: SearchMissingFormProps) {
  const [showHelp, setShowHelp] = useState(false);
  const [requesterCi, setRequesterCi] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState('');
  const [searchResults, setSearchResults] = useState<MatchResult[] | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<FoundPerson | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSuccessReunion, setIsSuccessReunion] = useState(false);
  const [matchRequestedPerson, setMatchRequestedPerson] = useState<FoundPerson | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-configured demo images representing sample missing people
  const sampleMissingPeople = [
    {
      name: "Juan Carlos Pérez",
      url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      hint: "Coincidirá con registro hospitalario"
    },
    {
      name: "María Alejandra",
      url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      hint: "Coincidirá con registro periférico"
    },
    {
      name: "Familiar Desconocido",
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      hint: "Coincidencia parcial en refugio"
    }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (url: string) => {
    setSelectedImage(url);
    setImageFile(null);
    setError(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) {
      setError('Por favor, selecciona o sube una imagen de la persona que buscas.');
      return;
    }

    setError(null);
    setIsAnalyzing(true);
    setAnalysisProgress(5);
    setAnalysisStep('Iniciando carga de imagen...');

    // Simulate DeepFace & ChromaDB pipeline
    const steps = [
      { p: 15, msg: 'Normalizando dimensiones de la imagen...' },
      { p: 35, msg: 'Ejecutando DeepFace.represent(model_name="Facenet")...' },
      { p: 60, msg: 'Extrayendo vector de características faciales (embedding)...' },
      { p: 80, msg: 'Consultando base de datos ChromaDB por cercanía de coseno...' },
      { p: 95, msg: 'Filtrando resultados por prioridad de semejanza...' },
      { p: 100, msg: 'Búsqueda completada.' }
    ];

    let currentStepIdx = 0;
    const interval = setInterval(() => {
      if (currentStepIdx < steps.length) {
        setAnalysisProgress(steps[currentStepIdx].p);
        setAnalysisStep(steps[currentStepIdx].msg);
        currentStepIdx++;
      } else {
        clearInterval(interval);
        // Compute mockup similarity scores matching the actual elements in foundPersons
        const results: MatchResult[] = foundPersons.map((person) => {
          // If the uploaded image belongs to the same person conceptually, give it a very high score
          let distance = 0.5 + Math.random() * 0.9; // default random distance
          
          if (selectedImage.includes('photo-1500648767791') && person.name.includes('Juan Carlos')) {
            distance = 0.12; // Perfect match
          } else if (selectedImage.includes('photo-1494790108377') && person.name.includes('María Alejandra')) {
            distance = 0.18; // Perfect match
          } else if (selectedImage.includes('photo-1534528741775') && person.id.includes('77a281fb')) {
            distance = 0.45; // Partial match
          }

          const similarity = Math.max(0, Math.min(100, Math.round((1.5 - distance) * 100)));
          
          return {
            foundPerson: person,
            similarity,
            distance,
            isCertain: distance < 1
          };
        });

        // Sort by priority of similarity (distance ascending, score descending)
        results.sort((a, b) => a.distance - b.distance);

        setSearchResults(results);
        setIsAnalyzing(false);
      }
    }, 700);
  };

  const handleRequestReunion = (person: FoundPerson) => {
    setMatchRequestedPerson(person);
    setIsSuccessReunion(true);
    onTriggerReunion(person);
  };

  const handleResetSearch = () => {
    setSelectedImage(null);
    setImageFile(null);
    setSearchResults(null);
    setSelectedCandidate(null);
    setIsSuccessReunion(false);
    setMatchRequestedPerson(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6" id="search-missing-view">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 mb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
            <Search size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Buscar un Familiar / Ser Querido</h2>
            <p className="text-sm text-slate-500">Usa el sistema de comparación facial inteligente para buscar en hospitales y refugios.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowHelp(!showHelp)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
            showHelp 
              ? 'bg-rose-500 text-white border-rose-500 shadow-sm' 
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
          id="btn-toggle-help"
        >
          <HelpCircle size={15} />
          {showHelp ? 'CERRAR PROCEDIMIENTO' : '¿CÓMO FUNCIONA?'}
        </button>
      </div>

      {showHelp && (
        <div className="mb-6 bg-rose-50/50 border border-rose-100 rounded-2xl p-5 space-y-4 text-slate-700 transition-all" id="help-procedure-container">
          <h3 className="text-sm font-bold text-rose-900 uppercase tracking-wide flex items-center gap-2">
            <HelpCircle size={16} className="text-rose-500" />
            Procedimiento Oficial de Búsqueda y Reencuentro
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
            <div className="bg-white p-3.5 rounded-xl border border-rose-100/40 shadow-sm space-y-1.5">
              <span className="inline-flex w-5 h-5 items-center justify-center rounded-full bg-rose-100 text-rose-700 text-[10px] font-black">1</span>
              <h4 className="text-xs font-bold text-slate-800">Subir Fotografía</h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                Sube o selecciona una foto del rostro de la persona que buscas. El algoritmo requiere visibilidad frontal clara.
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-rose-100/40 shadow-sm space-y-1.5">
              <span className="inline-flex w-5 h-5 items-center justify-center rounded-full bg-rose-100 text-rose-700 text-[10px] font-black">2</span>
              <h4 className="text-xs font-bold text-slate-800">Cotejo Facial AI</h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                El sistema extrae un vector de características (embeddings) y realiza una comparación de distancia coseno en la base de datos ChromaDB.
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-rose-100/40 shadow-sm space-y-1.5">
              <span className="inline-flex w-5 h-5 items-center justify-center rounded-full bg-rose-100 text-rose-700 text-[10px] font-black">3</span>
              <h4 className="text-xs font-bold text-slate-800">Ver Coincidencias</h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                Se ordenarán los resultados por semejanza facial. Podrás ver la descripción física de la persona encontrada y el centro de refugio.
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-rose-100/40 shadow-sm space-y-1.5">
              <span className="inline-flex w-5 h-5 items-center justify-center rounded-full bg-rose-100 text-rose-700 text-[10px] font-black">4</span>
              <h4 className="text-xs font-bold text-slate-800">Contacto Seguro</h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                Al encontrar una coincidencia cierta, solicita el reencuentro. Preséntate con tu identificación oficial en el hospital o refugio para completar el enlace.
              </p>
            </div>
          </div>
        </div>
      )}

      {isSuccessReunion ? (
        <div className="text-center py-8 px-4 max-w-lg mx-auto" id="success-reunion-screen">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100 animate-bounce">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Solicitud de Reencuentro Registrada</h3>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Se ha enviado una notificación de coincidencia a los encargados en <strong>{matchRequestedPerson?.hospitalName}</strong>. 
          </p>
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 my-6 text-left text-xs text-slate-600 space-y-2">
            <p><strong>Persona Encontrada:</strong> {matchRequestedPerson?.name}</p>
            <p><strong>Ubicación:</strong> {matchRequestedPerson?.locationAddress}</p>
            <p><strong>Teléfono de Enlace:</strong> {matchRequestedPerson?.contactPhone}</p>
            <p className="text-[11px] text-amber-600 font-semibold">⚠️ Por seguridad, presenta tu documento de identidad al momento de establecer contacto físico en el centro.</p>
          </div>
          <button
            onClick={handleResetSearch}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm rounded-xl transition-all shadow-sm"
            id="btn-reunion-back"
          >
            Realizar Nueva Búsqueda
          </button>
        </div>
      ) : !searchResults ? (
        <form onSubmit={startAnalysis} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-2.5 text-sm" id="search-error">
              <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Step 1: Image Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Camera size={14} className="text-slate-400" />
              Fotografía del Rostro de la Persona Buscada
            </label>

            {/* Drag & Drop Area */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => !isAnalyzing && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                selectedImage 
                  ? 'border-rose-300 bg-rose-50/10' 
                  : 'border-slate-200 hover:border-rose-300 bg-slate-50/40 hover:bg-slate-50'
              } ${isAnalyzing ? 'opacity-50 pointer-events-none' : ''}`}
              id="image-dropzone"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />

              {selectedImage ? (
                <div className="relative inline-block group">
                  <img
                    src={selectedImage}
                    alt="Búsqueda"
                    className="w-40 h-40 object-cover rounded-xl border border-slate-100 shadow-sm mx-auto"
                    referrerPolicy="no-referrer"
                  />
                  {/* Facial Scanner Animation effect during search */}
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-rose-500/10 overflow-hidden rounded-xl">
                      <div className="absolute left-0 right-0 h-1 bg-rose-500 shadow-lg shadow-rose-400/50 animate-[bounce_1.5s_infinite]"></div>
                    </div>
                  )}
                  <span className="block mt-2 text-xs font-semibold text-rose-600 group-hover:underline">Cambiar imagen</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
                    <Upload size={20} />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">Arrastra una foto de perfil o haz clic para subir</p>
                  <p className="text-xs text-slate-400">Archivos JPG, PNG con resolución recomendada clara de rostro</p>
                </div>
              )}
            </div>

            {/* Quick Demo Samples Selector */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2.5">O prueba el simulador con una muestra:</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {sampleMissingPeople.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSample(sample.url)}
                    disabled={isAnalyzing}
                    className={`flex items-center gap-2.5 p-2 rounded-lg text-left border text-xs transition-all ${
                      selectedImage === sample.url
                        ? 'border-rose-400 bg-rose-50/40 font-semibold text-rose-700'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <img src={sample.url} alt="Muestra" className="w-8 h-8 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                    <div className="truncate">
                      <p className="font-semibold truncate">{sample.name}</p>
                      <p className="text-[9px] text-slate-400 truncate">{sample.hint}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Trigger / Scanning Simulation overlay */}
          {isAnalyzing ? (
            <div className="space-y-3 bg-slate-50 border border-slate-100 rounded-xl p-4 text-center animate-pulse" id="analysis-status">
              <div className="flex justify-between text-xs text-slate-600 font-medium">
                <span>{analysisStep}</span>
                <span>{analysisProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-rose-500 transition-all duration-300"
                  style={{ width: `${analysisProgress}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">EJECUTANDO PIPELINE DE CHROMA VECTORDATER - FACENET DISTANCE COMPARATOR</p>
            </div>
          ) : (
            <button
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
              id="btn-trigger-search"
            >
              <Search size={16} />
              Iniciar Reconocimiento Facial Inteligente
            </button>
          )}
        </form>
      ) : (
        /* Matches and Search results screen */
        <div className="space-y-6" id="search-results-section">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-rose-50/50 border border-rose-100 rounded-xl p-4">
            <div>
              <p className="text-xs font-bold text-rose-800 uppercase tracking-wider">Cotejo completado con éxito</p>
              <h3 className="text-sm font-semibold text-slate-800 mt-0.5">Se encontraron {searchResults.length} posibles registros faciales coincidentes.</h3>
            </div>
            <button
              onClick={handleResetSearch}
              className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg text-xs hover:bg-slate-50 transition-all flex items-center gap-1 shrink-0"
              id="btn-re-search"
            >
              <RefreshCw size={12} />
              Buscar de nuevo
            </button>
          </div>

          {/* Horizontal Split Layout: List of matches on left, drill-down details card on right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Resultados Ordenados por Grado de Semejanza:</p>
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {searchResults.map((result, idx) => {
                  const isMatchPerfect = result.distance < 0.3;
                  const isMatchHigh = result.distance < 0.5 && result.distance >= 0.3;
                  
                  return (
                    <div
                      key={result.foundPerson.id}
                      onClick={() => setSelectedCandidate(result.foundPerson)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex gap-3 ${
                        selectedCandidate?.id === result.foundPerson.id
                          ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-400'
                          : 'border-slate-100 bg-white hover:bg-slate-50/50'
                      }`}
                      id={`match-card-${idx}`}
                    >
                      <img
                        src={result.foundPerson.imageUrl}
                        alt="Encontrado"
                        className="w-14 h-14 rounded-lg object-cover shrink-0 border border-slate-100"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-sm font-bold text-slate-800 truncate">
                            {result.foundPerson.name}
                          </h4>
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                            isMatchPerfect 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : isMatchHigh 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {result.similarity}% de Semejanza
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 truncate mt-0.5 flex items-center gap-1">
                          <MapPin size={12} className="text-slate-400 shrink-0" />
                          {result.foundPerson.hospitalName}
                        </p>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/50 text-[10px] text-slate-400 font-mono">
                          <span>ID de Registro: {result.foundPerson.id.substring(0, 12)}...</span>
                          <span className="flex items-center gap-1 text-slate-500 font-semibold">
                            Cercanía: {result.distance.toFixed(4)} 
                            {result.distance < 1 ? ' (Certeza)' : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Candidate Details panel on right */}
            <div className="lg:col-span-5 bg-slate-50/80 border border-slate-100 rounded-xl p-4 flex flex-col justify-between">
              {selectedCandidate ? (
                <div className="space-y-4" id="candidate-detail-pane">
                  <div className="text-center pb-4 border-b border-slate-200/60">
                    <img
                      src={selectedCandidate.imageUrl}
                      alt={selectedCandidate.name}
                      className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-sm mx-auto mb-2"
                      referrerPolicy="no-referrer"
                    />
                    <h4 className="font-bold text-slate-800">{selectedCandidate.name}</h4>
                    <p className="text-xs text-slate-400 font-mono">Cédula: {selectedCandidate.ci}</p>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div>
                      <span className="font-bold text-slate-700 block mb-0.5">Ubicación Actual:</span>
                      <p className="text-slate-600 flex items-start gap-1">
                        <MapPin size={12} className="text-rose-500 shrink-0 mt-0.5" />
                        <span><strong>{selectedCandidate.hospitalName}</strong> - {selectedCandidate.locationAddress}</span>
                      </p>
                    </div>

                    <div>
                      <span className="font-bold text-slate-700 block mb-0.5">Descripción Física y Estado:</span>
                      <p className="text-slate-600 leading-relaxed bg-white border border-slate-200/50 rounded-lg p-2.5 font-sans italic">
                        "{selectedCandidate.physicalDescription}"
                      </p>
                    </div>

                    <div>
                      <span className="font-bold text-slate-700 block mb-0.5">Contacto de Enlace o Rescate:</span>
                      <p className="text-slate-600 flex items-center gap-1.5 font-mono">
                        <Phone size={12} className="text-slate-400 shrink-0" />
                        {selectedCandidate.contactPhone}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200/60 space-y-2">
                    <button
                      onClick={() => handleRequestReunion(selectedCandidate)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-all flex items-center justify-center gap-1"
                      id="btn-request-reunion"
                    >
                      <Heart size={12} />
                      Confirmar Parecido / Solicitar Reencuentro
                    </button>
                    <p className="text-[10px] text-slate-400 text-center">
                      Se notificará al administrador del refugio para coordinar de forma privada.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-12 px-4 h-full">
                  <div className="p-3 bg-slate-100 rounded-full text-slate-400 mb-3">
                    <Eye size={22} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-700">Explorar Registro</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-[200px] leading-relaxed">
                    Selecciona cualquier candidato de la lista de la izquierda para ver su descripción física detallada, hospital y teléfono de enlace.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
