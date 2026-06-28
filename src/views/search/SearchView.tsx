/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Vista "Buscar Familiar" (flujo familiar):
 * sube foto + identidad → cotejo facial → lista de coincidencias → detalle.
 * La validación vive en `search.schema.ts`; la red en `core/container`.
 */
import React, { useState, useRef } from 'react';
import { Search, Camera, HelpCircle, ArrowRight } from 'lucide-react';
import { buscarPersona, reportarPublicacion, FoundPerson, MatchResult } from '../../core/container';
import PhotoUploader, { Photo, appendImages } from '../../components/form/PhotoUploader';
import DocumentInput from '../../components/form/DocumentInput';
import { inputClasses } from '../../components/form/Field';
import { useFormDraft } from '../../components/form/useFormDraft';
import { Card, ViewHeader, Button, FieldError } from '../../components/ui';
import HelpModal, { HelpStep } from '../../components/modals/HelpModal';
import CandidateDetailModal from '../../components/modals/CandidateDetailModal';
import AnalysisProgress from './AnalysisProgress';
import MatchCard from './MatchCard';
import { validateSearch } from './search.schema';

// ponytail: capacidad — 1 = una sola foto; subir para permitir más.
const MAX_IMAGES = 1;
const PAGE_SIZE = 6;

const HELP_STEPS: HelpStep[] = [
  { n: 1, t: 'Subir Fotografía', d: 'Sube una foto del rostro de la persona que buscas. Se requiere visibilidad frontal clara.' },
  { n: 2, t: 'Cotejo Facial AI', d: 'El sistema extrae un vector facial (embedding) y lo compara por distancia coseno en ChromaDB.' },
  { n: 3, t: 'Ver Coincidencias', d: 'Los resultados se ordenan por semejanza. Verás la descripción física y el centro de refugio.' },
  { n: 4, t: 'Contacto Seguro', d: 'Ante una coincidencia cierta, solicita el reencuentro y preséntate con tu identificación oficial.' },
];

export default function SearchView() {
  const [showHelp, setShowHelp] = useState(false);
  // Persistido entre cambios de pestaña (draft 'search.*')
  const [photos, setPhotos] = useFormDraft<Photo[]>('search.photos', []);
  const [qNombre, setQNombre] = useFormDraft('search.qNombre', '');
  const [qDocTipo, setQDocTipo] = useFormDraft('search.qDocTipo', 'V');
  const [qDocNumero, setQDocNumero] = useFormDraft('search.qDocNumero', '');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState('');
  const [searchResults, setSearchResults] = useState<MatchResult[] | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<FoundPerson | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [idError, setIdError] = useState<string | null>(null);
  const [reportedIds, setReportedIds] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const inFlight = useRef(false); // evita peticiones duplicadas si el usuario satura el botón

  const addFiles = (files: FileList | File[]) => {
    setPhotos((prev) => appendImages(prev, files, MAX_IMAGES));
    setError(null);
  };
  const removePhoto = (idx: number) => setPhotos((prev) => prev.filter((_, i) => i !== idx));

  const startAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (inFlight.current) return; // ya hay una búsqueda en curso

    // Validación con schema: ambos errores salen en el mismo click.
    const { ok, errors } = validateSearch({ photos, nombre: qNombre, docNumero: qDocNumero });
    setError(errors.photos ?? null);
    setIdError(errors.identidad ?? null);
    if (!ok) return;

    inFlight.current = true;
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisStep('Subiendo fotos...');
    setPage(0);

    // Loader pausado a ~10s: sube hasta 95% y espera la respuesta del back;
    // al responder salta a 100% (llegue antes o después).
    const TOTAL_MS = 10000;
    const start = Date.now();
    let done = false;

    const tick = setInterval(() => {
      if (done) return;
      const pct = Math.min(95, ((Date.now() - start) / TOTAL_MS) * 100);
      setAnalysisProgress(Math.round(pct));
      setAnalysisStep(
        pct < 20 ? 'Normalizando imagen...' :
        pct < 45 ? 'Extrayendo rasgos faciales...' :
        pct < 70 ? 'Consultando base de datos...' :
        'Comparando coincidencias...'
      );
    }, 100);

    buscarPersona({
      files: photos.map((p) => p.file),
      nombre: qNombre,
      docTipo: qDocTipo,
      docNumero: qDocNumero,
    })
      .then((results) => {
        done = true;
        inFlight.current = false;
        clearInterval(tick);
        setAnalysisProgress(100);
        setAnalysisStep('Búsqueda completada.');
        setTimeout(() => {
          setSearchResults(results);
          setIsAnalyzing(false);
        }, 400);
      })
      .catch((err) => {
        done = true;
        inFlight.current = false;
        clearInterval(tick);
        setIsAnalyzing(false);
        setAnalysisProgress(0);
        setError(err instanceof Error ? err.message : 'No se pudo completar la búsqueda. Intenta de nuevo.');
      });
  };

  const handleResetSearch = () => {
    setPhotos([]);
    setIdError(null);
    setSearchResults(null);
    setSelectedCandidate(null);
    setReportedIds([]);
    setPage(0);
  };

  const totalPages = searchResults ? Math.ceil(searchResults.length / PAGE_SIZE) : 0;
  const pageItems = searchResults ? searchResults.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE) : [];

  return (
    <Card id="search-missing-view">
      <ViewHeader
        icon={Search}
        accent="rose"
        title="Buscar Familiar"
        subtitle="Sube una foto y busca coincidencias por reconocimiento facial."
        action={
          <Button variant="secondary" icon={HelpCircle} onClick={() => setShowHelp(true)} id="btn-toggle-help">
            ¿CÓMO FUNCIONA?
          </Button>
        }
      />

      <HelpModal
        open={showHelp}
        onClose={() => setShowHelp(false)}
        title="Procedimiento de Búsqueda y Reencuentro"
        steps={HELP_STEPS}
        accent="rose"
        id="help-procedure-modal"
      />

      {!searchResults ? (
        <form onSubmit={startAnalysis} className="space-y-5">
          <div className="space-y-3">
            {/* Paso 1: fotos */}
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Camera size={14} className="text-blue-600" />
                Fotos de la persona
              </label>
              {photos.length > 0 && <span className="text-[11px] font-semibold text-slate-400">{photos.length}/{MAX_IMAGES}</span>}
            </div>

            <PhotoUploader photos={photos} max={MAX_IMAGES} accent="blue" error={!!error} disabled={isAnalyzing} onAdd={addFiles} onRemove={removePhoto} />
            <FieldError message={error} id="search-error" />

            {/* Paso 2: identidad — basta nombre O cédula */}
            <div className="space-y-2 pt-1">
              <div>
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Datos de la persona que buscas <span className="text-rose-500">*</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Completa su nombre o su cedula
                  <strong> (no hacen falta ambos).</strong></p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="search-nombre" className="text-[11px] font-semibold text-slate-500 normal-case block">Nombre</label>
                  <input
                    id="search-nombre"
                    type="text"
                    placeholder="Nombre de quien buscas"
                    maxLength={80}
                    value={qNombre}
                    onChange={(e) => { setQNombre(e.target.value); setIdError(null); }}
                    className={inputClasses('rose', !!idError)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="search-doc" className="text-[11px] font-semibold text-slate-500 normal-case block">Cédula</label>
                  <DocumentInput
                    tipo={qDocTipo}
                    numero={qDocNumero}
                    onTipo={setQDocTipo}
                    onNumero={(v) => { setQDocNumero(v); setIdError(null); }}
                    accent="rose"
                    error={!!idError}
                    numeroId="search-doc"
                  />
                </div>
              </div>
              <FieldError message={idError} />
            </div>
          </div>

          {/* Disparador / overlay de análisis */}
          {isAnalyzing ? (
            <AnalysisProgress step={analysisStep} progress={analysisProgress} />
          ) : (
            <Button type="submit" variant="primary" accent="rose" size="xl" fullWidth icon={Search} id="btn-trigger-search">
              Iniciar Búsqueda
            </Button>
          )}
        </form>
      ) : (
        /* Pantalla de resultados */
        <div className="space-y-6" id="search-results-section">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-rose-50/50 border border-rose-100 rounded-xl p-5">
            <div>
              <p className="text-xs font-bold text-rose-800 uppercase tracking-wider">Comparación completada con éxito</p>
              <h3 className="text-sm font-semibold text-slate-800 mt-0.5">Se encontraron {searchResults.length} registros coincidentes.</h3>
            </div>
            <Button
              variant="primary"
              accent="rose"
              size="lg"
              icon={Search}
              onClick={handleResetSearch}
              className="w-full sm:w-auto shrink-0"
              id="btn-re-search"
            >
              Buscar de nuevo
            </Button>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Posibles coincidencias — toca una para ver sus datos:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pageItems.map((result, idx) => {
                const person = result.foundPerson;
                // `display:contents` => el wrapper no genera caja; MatchCard sigue
                // siendo el item de la grilla. El key va aquí (elemento intrínseco)
                // porque el proyecto no usa @types/react y key sobre componente
                // propio rompe el chequeo de tipos.
                return (
                  <div key={person.id} className="contents">
                    <MatchCard
                      person={person}
                      index={idx}
                      isReported={reportedIds.includes(person.id)}
                      isConfirming={confirmingId === person.id}
                      onSelect={() => setSelectedCandidate(person)}
                      onFlag={() => setConfirmingId(person.id)}
                      onConfirmYes={() => {
                        setReportedIds((prev) => [...prev, person.id]);
                        setConfirmingId(null);
                        // Envía el reporte al back (no bloquea la UI).
                        reportarPublicacion(person.id).catch(() => {});
                      }}
                      onConfirmNo={() => setConfirmingId(null)}
                    />
                  </div>
                );
              })}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ArrowRight size={15} className="rotate-180" /> Anterior
                </button>
                <span className="text-xs font-semibold text-slate-500 tabular-nums">Página {page + 1} de {totalPages}</span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Siguiente <ArrowRight size={15} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de detalle de la coincidencia seleccionada */}
      <CandidateDetailModal person={selectedCandidate} onClose={() => setSelectedCandidate(null)} />
    </Card>
  );
}
