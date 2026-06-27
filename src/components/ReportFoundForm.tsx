/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { PlusCircle, Camera, AlertCircle, MapPin, Phone, Building, Check, Heart, User, HelpCircle, Baby } from 'lucide-react';
import { FoundPerson } from '../types';
import { reportarEncontrado, ResultadoRegistro } from '../api';
import PhotoUploader, { Photo } from './form/PhotoUploader';
import HelpModal, { HelpStep } from './form/HelpModal';
import DocumentInput from './form/DocumentInput';
import LocationCombobox, { useSavedLocations } from './form/LocationCombobox';
import { useFormDraft } from './form/useFormDraft';
import Field, { inputClasses } from './form/Field';

interface ReportFoundFormProps {
  onAddPerson: (person: FoundPerson) => void;
}

// ponytail: capacity knob — backend accepts varias fotos del mismo registro
const MAX_IMAGES = 1;

// Teléfono VE: prefijo elegido + 7 dígitos. Ej: 0424 + 8135166 -> 04248135166.
const PHONE_PREFIXES = ['0424', '0412', '0416', '0426', '0422'];

const HELP_STEPS: HelpStep[] = [
  { n: 1, t: 'Capturar Foto', d: 'Carga una o varias fotos. El rostro debe estar bien iluminado y de frente.' },
  { n: 2, t: 'Definir Edad', d: 'Indica si es menor de edad. Si lo es, se ocultan nombre y apellido y se pide la identificación del responsable.' },
  { n: 3, t: 'Refugio y Contacto', d: 'Ingresa el refugio/hospital y el teléfono del responsable (obligatorios).' },
  { n: 4, t: 'Indexación Facial', d: 'Al enviar, el rostro se procesa y queda disponible de inmediato para las búsquedas.' },
];

export default function ReportFoundForm({ onAddPerson }: ReportFoundFormProps) {
  const [showHelp, setShowHelp] = useState(false);
  // Persistido entre cambios de pestaña (draft 'report.*')
  const [photos, setPhotos] = useFormDraft<Photo[]>('report.photos', []);
  const [isChild, setIsChild] = useFormDraft('report.isChild', false);
  const [nombre, setNombre] = useFormDraft('report.nombre', '');
  const [apellido, setApellido] = useFormDraft('report.apellido', '');
  const [docTipo, setDocTipo] = useFormDraft('report.docTipo', 'V');
  const [docNumero, setDocNumero] = useFormDraft('report.docNumero', '');
  const [refugio, setRefugio] = useFormDraft('report.refugio', '');
  const [ubicacion, setUbicacion] = useFormDraft('report.ubicacion', '');
  const [telPrefijo, setTelPrefijo] = useFormDraft('report.telPrefijo', '0424');
  const [telNumero, setTelNumero] = useFormDraft('report.telNumero', '');
  const [docResponsable, setDocResponsable] = useFormDraft('report.docResponsable', '');
  const [descripcion, setDescripcion] = useFormDraft('report.descripcion', '');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<ResultadoRegistro | null>(null);
  // Errores por campo: { photos, refugio, telefono, docResponsable, _form }
  const [errors, setErrors] = useState<Record<string, string>>({});
  const clearError = (field: string) => setErrors((prev) => (prev[field] ? { ...prev, [field]: '' } : prev));

  const { locations, remember, forget } = useSavedLocations();
  const inFlight = useRef(false); // evita registros duplicados si el usuario satura el botón

  const addFiles = (files: FileList | File[]) => {
    const imgs = Array.from(files).filter((f) => f.type.startsWith('image/'));
    setPhotos((prev) => {
      const room = MAX_IMAGES - prev.length;
      return [...prev, ...imgs.slice(0, room).map((file) => ({ file, url: URL.createObjectURL(file) }))];
    });
    clearError('photos');
  };
  const removePhoto = (idx: number) => setPhotos((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inFlight.current) return; // ya hay un registro en curso, ignora el reintento

    const errs: Record<string, string> = {};
    if (photos.length === 0) errs.photos = 'Adjunta al menos una fotografía clara del rostro.';
    if (!refugio.trim()) errs.refugio = 'Indica el refugio, hospital o centro receptor.';
    if (telNumero.length !== 7) errs.telefono = 'El teléfono debe tener 7 dígitos.';
    if (isChild && !docResponsable.trim()) errs.docResponsable = 'La identificación del responsable es obligatoria para un menor.';

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    const telefonoResponsable = `${telPrefijo}${telNumero}`;

    setErrors({});
    inFlight.current = true;
    setIsSubmitting(true);
    try {
      const res = await reportarEncontrado({
        files: photos.map((p) => p.file),
        esMenor: isChild,
        nombre,
        apellido,
        docTipo,
        docNumero,
        refugio,
        ubicacion,
        telefonoResponsable,
        docResponsable,
        descripcion,
      });
      setResult(res);
      remember(ubicacion);

      // Bump the local "personas reportadas" badge in App (cosmetic).
      onAddPerson({
        id: res.person_id,
        name: isChild ? 'Menor protegido' : [nombre, apellido].filter(Boolean).join(' ').trim() || 'Desconocido',
        ci: isChild ? 'No Aplica (Menor de edad)' : docNumero.trim() ? `${docTipo}-${docNumero.trim()}` : 'Desconocido',
        hospitalName: refugio.trim(),
        locationAddress: ubicacion.trim(),
        contactPhone: telefonoResponsable.trim(),
        physicalDescription: descripcion.trim(),
        imageUrl: photos[0]?.url ?? '',
        dateFound: new Date().toISOString(),
        status: 'refugiado',
      });
    } catch (err) {
      setErrors({ _form: err instanceof Error ? err.message : 'No se pudo registrar. Intenta de nuevo.' });
    } finally {
      inFlight.current = false;
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setPhotos([]);
    setIsChild(false);
    setNombre('');
    setApellido('');
    setDocTipo('V');
    setDocNumero('');
    setRefugio('');
    setUbicacion('');
    setTelPrefijo('0424');
    setTelNumero('');
    setDocResponsable('');
    setDescripcion('');
    setResult(null);
    setErrors({});
  };

  const FieldError = ({ field }: { field: string }) =>
    errors[field] ? <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle size={13} className="shrink-0" />{errors[field]}</p> : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6" id="report-found-view">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0">
            <PlusCircle size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 leading-tight">Reportar Persona Encontrada</h2>
            <p className="text-sm text-slate-500 leading-snug">Agrega a una persona encontrada a la base de datos.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowHelp(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 transition-all"
          id="btn-toggle-report-help"
        >
          <HelpCircle size={15} />
          ¿CÓMO FUNCIONA?
        </button>
      </div>

      <HelpModal
        open={showHelp}
        onClose={() => setShowHelp(false)}
        title="Cómo reportar una persona encontrada"
        steps={HELP_STEPS}
        accent="emerald"
        id="report-help-modal"
      />

      {result ? (
        <div className="text-center py-10 px-4 max-w-md mx-auto" id="report-success-screen">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-sm">
            <Check size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">¡Registro Exitoso!</h3>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            La persona quedó indexada. Su rostro ya puede coincidir con las búsquedas de sus seres queridos.
          </p>
          <p className="text-xs text-slate-400 font-mono mt-2">Código de registro: {result.codigo}</p>

          {result.alerta && (
            <div className="mt-5 bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-left text-sm space-y-1.5">
              <p className="font-bold text-emerald-800 flex items-center gap-1.5">
                <Heart size={15} className="fill-emerald-500 text-emerald-500" /> ¡Un familiar ya la buscaba!
              </p>
              {result.alerta.familiar_nombre && (
                <p className="text-slate-600"><strong>Familiar:</strong> {result.alerta.familiar_nombre}</p>
              )}
              {result.alerta.familiar_telefono && (
                <p className="text-slate-600 flex items-center gap-1.5">
                  <Phone size={14} className="text-emerald-600" /> {result.alerta.familiar_telefono}
                </p>
              )}
              <p className="text-[11px] text-emerald-700">Coincidencia {result.alerta.coincidencia}% · confianza {result.alerta.confianza}.</p>
            </div>
          )}

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleResetForm}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-all"
              id="btn-add-more"
            >
              Reportar Otra Persona
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {errors._form && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-2.5 text-sm" id="report-error">
              <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />
              <span>{errors._form}</span>
            </div>
          )}

          {/* Photos */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Camera size={14} className="text-blue-600" />
                Fotos de la persona <span className="text-rose-500">*</span>
              </label>
              {photos.length > 0 && <span className="text-[11px] font-semibold text-slate-400">{photos.length}/{MAX_IMAGES}</span>}
            </div>
            <PhotoUploader photos={photos} max={MAX_IMAGES} accent="blue" error={!!errors.photos} onAdd={addFiles} onRemove={removePhoto} />
            <FieldError field="photos" />
          </div>

          {/* Child Toggle Switch */}
          <div className="bg-amber-50/40 border-2 border-amber-200/60 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm" id="child-toggle-container">
            <div>
              <span className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Baby size={20} className="text-amber-500" />
                ¿Es menor de edad?
              </span>
              <p className="text-xs text-slate-500 mt-1">Actívalo para aplicar protección de identidad (oculta nombre y apellido).</p>
            </div>
            <button
              type="button"
              onClick={() => setIsChild(!isChild)}
              aria-pressed={isChild}
              className={`px-6 py-3 rounded-xl text-sm font-extrabold transition-all duration-300 shrink-0 flex items-center justify-center gap-2 shadow-sm border-2 ${
                isChild
                  ? 'bg-amber-500 border-amber-500 hover:bg-amber-600 text-white shadow-[0_4px_20px_rgba(245,158,11,0.4)] scale-105'
                  : 'bg-white border-amber-400 text-amber-700 hover:bg-amber-100 hover:border-amber-500 hover:shadow-md'
              }`}
              id="btn-toggle-child"
            >
              {isChild ? <Check size={18} /> : <Baby size={18} />}
              {isChild ? 'MENOR PROTEGIDO' : 'SÍ, ES MENOR'}
            </button>
          </div>

          {/* Section: Identity (hidden for minors) */}
          {!isChild && (
            <fieldset className="space-y-4">
              <legend className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2.5 flex items-center gap-2">
                <User size={13} className="text-slate-400" />
                Datos de la persona
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Nombre" optional value={nombre} onChange={setNombre} placeholder="Ej: Juan" maxLength={80} id="person-name-input" />
                <Field label="Apellido" optional value={apellido} onChange={setApellido} placeholder="Ej: Gómez" maxLength={80} id="person-lastname-input" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Documento de identidad <span className="text-slate-400 font-medium normal-case">(opcional)</span>
                </label>
                <DocumentInput tipo={docTipo} numero={docNumero} onTipo={setDocTipo} onNumero={setDocNumero} accent="blue" numeroId="person-doc-input" />
              </div>
            </fieldset>
          )}

          {/* Section: Location & contact */}
          <fieldset className="space-y-4">
            <legend className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2.5 flex items-center gap-2">
              <MapPin size={13} className="text-slate-400" />
              Ubicación y contacto
            </legend>

            <Field
              label="Refugio, Hospital o Ente Receptivo"
              required
              value={refugio}
              onChange={(v) => { setRefugio(v); clearError('refugio'); }}
              placeholder="Ej: Refugio Polideportivo de Catia"
              icon={Building}
              error={errors.refugio}
              id="refugio-input"
            />

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Dónde se encontró <span className="text-slate-400 font-medium normal-case">(opcional)</span>
              </label>
              <LocationCombobox value={ubicacion} onChange={setUbicacion} options={locations} onForget={forget} accent="blue" id="ubicacion-input" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Teléfono del responsable <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={telPrefijo}
                  onChange={(e) => setTelPrefijo(e.target.value)}
                  className="px-3 py-2.5 bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-slate-800 text-sm outline-none transition-all font-bold shadow-sm shrink-0"
                  aria-label="Prefijo telefónico"
                >
                  {PHONE_PREFIXES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Phone size={16} className="text-slate-400" />
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="8135166"
                    maxLength={7}
                    value={telNumero}
                    onChange={(e) => { setTelNumero(e.target.value.replace(/\D/g, '')); clearError('telefono'); }}
                    className={inputClasses('blue', !!errors.telefono, true)}
                    id="contact-phone-input"
                  />
                </div>
              </div>
              <FieldError field="telefono" />
            </div>

            {isChild && (
              <Field
                label="Identificación del responsable"
                required
                numeric
                value={docResponsable}
                onChange={(v) => { setDocResponsable(v); clearError('docResponsable'); }}
                placeholder="Ej: 11111111"
                maxLength={9}
                error={errors.docResponsable}
                hint="Obligatorio para registrar a un menor."
                id="doc-responsable-input"
              />
            )}

            <Field
              label="Descripción"
              optional
              multiline
              counter
              value={descripcion}
              onChange={setDescripcion}
              placeholder="Describe ropa, señas, estado físico, edad aproximada..."
              maxLength={350}
              rows={4}
              id="observation-input"
            />
          </fieldset>

          <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="text-rose-500">*</span> Campos obligatorios
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-base rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            id="btn-submit-report"
          >
            <PlusCircle size={20} />
            {isSubmitting ? 'Registrando…' : 'Reportar Persona Encontrada'}
          </button>
        </form>
      )}
    </div>
  );
}
