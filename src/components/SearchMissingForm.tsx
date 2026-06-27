/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Search, User, Shield, Camera, Upload, AlertCircle, FileText, Heart, MapPin, Phone, Eye, ArrowRight, RefreshCw, CheckCircle2, HelpCircle, X } from 'lucide-react';
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
      hint: "Foto de prueba del sistema"
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
            <h2 className="text-lg font-bold text-slate-800">Buscar Familiar</h2>
            <p className="text-sm text-slate-500">Sube una foto para buscar coincidencias mediante reconocimiento facial.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowHelp(!showHelp)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${showHelp
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
              <Camera size={14} className="text-rose-600" />
              Fotografía de la Persona
            </label>

            {/* Drag & Drop Area */}
            <div
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDrop(e);
              }}
              onClick={() => !isAnalyzing && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${selectedImage
                  ? 'border-rose-600 bg-rose-50/10'
                  : 'border-rose-600 hover:border-rose-700 bg-rose-50/40 hover:bg-rose-50'
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
                  
                  {/* Remove Image Button (X) */}
                  {!isAnalyzing && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(null);
                        setImageFile(null);
                        setError(null);
                      }}
                      className="absolute -top-2 -right-2 bg-white text-slate-500 p-1.5 rounded-full shadow-md border border-slate-200 hover:text-rose-600 hover:border-rose-200 transition-all z-10"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                  )}
                  {/* Facial Scanner Animation effect during search */}
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-rose-500/10 overflow-hidden rounded-xl">
                      <div className="absolute left-0 right-0 h-1 bg-rose-500 shadow-lg shadow-rose-400/50 animate-[bounce_1.5s_infinite]"></div>
                    </div>
                  )}
                  <span className="block mt-2 text-xs font-semibold text-rose-600 group-hover:underline">
                    Cambiar imagen
                  </span>
                  {sampleMissingPeople.some(s => s.url === selectedImage) && (
                    <span className="block mt-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Foto de prueba seleccionada
                    </span>
                  )}
                </div>
              ) : (
                <div className="space-y-1 py-4">
                  <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-2">
                    <Upload size={18} />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">Haz clic para subir la foto</p>
                  <p className="text-xs text-slate-400">Formatos JPG o PNG (rostro frontal claro)</p>
                </div>
              )}
            </div>

            {/* Quick Demo Samples Selector */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2 text-center">O usa una foto de prueba:</p>
              <div className="grid grid-cols-1 max-w-sm mx-auto">
                {sampleMissingPeople.map((sample, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-2 rounded-lg border text-xs transition-all ${
                      selectedImage === sample.url
                        ? 'border-rose-400 bg-rose-50/40 font-semibold text-rose-700'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600 cursor-pointer'
                    } ${isAnalyzing ? 'opacity-50 pointer-events-none' : ''}`}
                    onClick={() => {
                      if (!isAnalyzing && selectedImage !== sample.url) {
                        handleSelectSample(sample.url);
                      }
                    }}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={sample.url} alt="Muestra" className="w-8 h-8 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                      <div className="truncate text-left">
                        <p className="font-semibold truncate">{sample.name}</p>
                        <p className={`text-[9px] truncate ${selectedImage === sample.url ? 'text-rose-500 font-bold' : 'text-slate-400'}`}>
                          {selectedImage === sample.url ? "¡Foto de prueba seleccionada!" : sample.hint}
                        </p>
                      </div>
                    </div>
                    {selectedImage === sample.url && !isAnalyzing && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImage(null);
                          setImageFile(null);
                          setError(null);
                        }}
                        className="p-1.5 rounded-full hover:bg-rose-100 text-rose-500 transition-all shrink-0 ml-2 shadow-sm border border-rose-200 bg-white"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                      </button>
                    )}
                  </div>
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
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              id="btn-trigger-search"
            >
              <Search size={18} />
              Iniciar Búsqueda
            </button>
          )}
        </form>
      ) : (
        /* Matches and Search results screen */
        <div className="space-y-6" id="search-results-section">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-rose-50/50 border border-rose-100 rounded-xl p-5">
            <div>
              <p className="text-xs font-bold text-rose-800 uppercase tracking-wider">Comparación completada con éxito</p>
              <h3 className="text-sm font-semibold text-slate-800 mt-0.5">Se encontraron {searchResults.length} registros coincidentes.</h3>
            </div>
            <button
              onClick={handleResetSearch}
              className="w-full sm:w-auto py-2.5 px-5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 shrink-0"
              id="btn-re-search"
            >
              <Search size={18} />
              Buscar de nuevo
            </button>
          </div>

          {/* List of matches */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Resultados Ordenados por Grado de Semejanza:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
                {searchResults.map((result, idx) => {
                  const isMatchPerfect = result.distance < 0.3;
                  const isMatchHigh = result.distance < 0.5 && result.distance >= 0.3;

                  return (
                    <div
                      key={result.foundPerson.id}
                      onClick={() => setSelectedCandidate(result.foundPerson)}
                      className={`p-3 sm:p-4 rounded-xl border-2 text-left cursor-pointer transition-all flex gap-3 sm:gap-4 ${
                          selectedCandidate?.id === result.foundPerson.id
                            ? 'border-rose-500 bg-rose-50 ring-2 ring-rose-200 shadow-sm'
                            : isMatchPerfect
                              ? 'bg-emerald-50/60 border-emerald-400 hover:bg-emerald-50 hover:border-emerald-500 hover:shadow-md shadow-sm'
                              : isMatchHigh
                                ? 'bg-amber-50/60 border-amber-400 hover:bg-amber-50 hover:border-amber-500 hover:shadow-md shadow-sm'
                                : 'bg-slate-50 border-slate-300 hover:bg-slate-100 hover:border-slate-400 shadow-sm'
                        }`}
                      id={`match-card-${idx}`}
                    >
                      <img
                        src={result.foundPerson.imageUrl}
                        alt="Encontrado"
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200/60 shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
                          <h4 className="text-sm font-bold text-slate-800 leading-tight line-clamp-2 pr-1">
                            {result.foundPerson.name}
                          </h4>
                          <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-sm font-black uppercase tracking-wider shrink-0 border shadow-sm ${
                              isMatchPerfect
                                ? 'bg-emerald-500 text-white border-emerald-600 shadow-emerald-500/20'
                                : isMatchHigh
                                  ? 'bg-amber-400 text-amber-900 border-amber-500 shadow-amber-400/20'
                                  : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}>
                            {result.similarity}%
                          </span>
                        </div>
                        <div className="mt-2.5 text-center">
                           <span className="text-xs font-bold text-rose-600 hover:text-rose-700 underline underline-offset-2">Clic para verme &rarr;</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
      )}

      {/* Candidate Details Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-all" onClick={() => setSelectedCandidate(null)}>
          <div 
            className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md relative flex flex-col max-h-[90vh] overflow-y-auto animate-[fadeIn_0.2s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedCandidate(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-all"
            >
              <X size={18} />
            </button>
            <div className="space-y-4" id="candidate-detail-pane">
              <div className="text-center pb-4 border-b border-slate-200/60 pt-2">
                <img
                  src={selectedCandidate.imageUrl}
                  alt={selectedCandidate.name}
                  className="w-full h-72 object-cover rounded-xl shadow-md mx-auto mb-4"
                  referrerPolicy="no-referrer"
                />
                <h4 className="font-bold text-slate-800 text-xl">{selectedCandidate.name}</h4>
                <p className="text-sm text-slate-500 font-mono mt-1">Cédula: {selectedCandidate.ci}</p>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <span className="font-bold text-slate-700 block mb-1">Ubicación Actual:</span>
                  <p className="text-slate-600 flex items-start gap-1.5">
                    <MapPin size={16} className="text-rose-500 shrink-0 mt-0.5" />
                    <span><strong>{selectedCandidate.hospitalName}</strong> - {selectedCandidate.locationAddress}</span>
                  </p>
                </div>

                <div>
                  <span className="font-bold text-slate-700 block mb-1">Descripción Física y Estado:</span>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 border border-slate-200/50 rounded-xl p-3 font-sans italic text-xs">
                    "{selectedCandidate.physicalDescription}"
                  </p>
                </div>

                <div>
                  <span className="font-bold text-slate-700 block mb-1">Contacto de Enlace o Rescate:</span>
                  <p className="text-slate-700 flex items-center gap-2 font-mono bg-slate-50 px-3 py-2 rounded-lg border border-slate-200/50">
                    <Phone size={14} className="text-slate-400 shrink-0" />
                    {selectedCandidate.contactPhone}
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-2 border-t border-slate-200/60 space-y-3">
                <button
                  onClick={() => {
                    handleRequestReunion(selectedCandidate);
                    setSelectedCandidate(null);
                  }}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  id="btn-request-reunion"
                >
                  <Heart size={16} />
                  Contactar vía WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
