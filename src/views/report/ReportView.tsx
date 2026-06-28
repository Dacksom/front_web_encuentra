/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Vista "Reportar Persona Encontrada" (flujo rescatista):
 * captura foto + datos → registra e indexa → pantalla de éxito (con alerta si un
 * familiar ya buscaba a la persona).
 * Validación en `report.schema.ts`; red en `core/container`.
 */
import React, { useState, useRef } from 'react';
import { PlusCircle, Camera, AlertCircle, MapPin, Phone, Building, Check, Heart, User, HelpCircle } from 'lucide-react';
import { reportarEncontrado, ResultadoRegistro } from '../../core/container';
import PhotoUploader, { Photo, appendImages } from '../../components/form/PhotoUploader';
import DocumentInput from '../../components/form/DocumentInput';
import LocationCombobox, { useSavedLocations } from '../../components/form/LocationCombobox';
import Field from '../../components/form/Field';
import ChildToggle from '../../components/form/ChildToggle';
import PhoneField from '../../components/form/PhoneField';
import { useFormDraft } from '../../components/form/useFormDraft';
import { Card, ViewHeader, Button, InputLabel, FieldError, FieldsetLegend, Box } from '../../components/ui';
import HelpModal, { HelpStep } from '../../components/modals/HelpModal';
import { validateReport } from './report.schema';

// ponytail: capacidad — el back acepta varias fotos del mismo registro.
const MAX_IMAGES = 1;

const HELP_STEPS: HelpStep[] = [
  { n: 1, t: 'Capturar Foto', d: 'Carga una o varias fotos. El rostro debe estar bien iluminado y de frente.' },
  { n: 2, t: 'Definir Edad', d: 'Indica si es menor de edad. Si lo es, se ocultan nombre y apellido y se pide la identificación del responsable.' },
  { n: 3, t: 'Refugio y Contacto', d: 'Ingresa el refugio/hospital y el teléfono del responsable (obligatorios).' },
  { n: 4, t: 'Indexación Facial', d: 'Al enviar, el rostro se procesa y queda disponible de inmediato para las búsquedas.' },
];

export default function ReportView() {
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
  const [docRespTipo, setDocRespTipo] = useFormDraft('report.docRespTipo', 'V');
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
    setPhotos((prev) => appendImages(prev, files, MAX_IMAGES));
    clearError('photos');
  };
  const removePhoto = (idx: number) => setPhotos((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inFlight.current) return; // ya hay un registro en curso

    const { ok, errors: errs } = validateReport({ photos, refugio, telNumero, isChild, docResponsable });
    if (!ok) {
      setErrors(errs);
      return;
    }

    const telefonoResponsable = `${telPrefijo}${telNumero}`;
    const docResponsableFull = docResponsable.trim() ? `${docRespTipo}-${docResponsable.trim()}` : '';

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
        docResponsable: docResponsableFull,
        descripcion,
      });
      setResult(res);
      remember(ubicacion);
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
    setDocRespTipo('V');
    setDocResponsable('');
    setDescripcion('');
    setResult(null);
    setErrors({});
  };

  return (
    <Card id="report-found-view">
      <ViewHeader
        icon={PlusCircle}
        accent="blue"
        title="Reportar Persona Encontrada"
        subtitle="Agrega a una persona encontrada a la base de datos."
        action={
          <Button variant="secondary" icon={HelpCircle} onClick={() => setShowHelp(true)} id="btn-toggle-report-help">
            ¿CÓMO FUNCIONA?
          </Button>
        }
      />

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

          {/* Alerta: un familiar ya buscaba a esta persona */}
          {result.alerta && (
            <Box accent="emerald" className="mt-5 p-4 text-left text-sm space-y-1.5">
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
            </Box>
          )}

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="primary" accent="slate" onClick={handleResetForm} id="btn-add-more">
              Reportar Otra Persona
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {errors._form && (
            <Box accent="red" className="p-3.5 flex items-start gap-2.5 text-sm" id="report-error">
              <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />
              <span>{errors._form}</span>
            </Box>
          )}

          {/* Fotos */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Camera size={14} className="text-blue-600" />
                Fotos de la persona <span className="text-rose-500">*</span>
              </label>
              {photos.length > 0 && <span className="text-[11px] font-semibold text-slate-400">{photos.length}/{MAX_IMAGES}</span>}
            </div>
            <PhotoUploader photos={photos} max={MAX_IMAGES} accent="blue" error={!!errors.photos} onAdd={addFiles} onRemove={removePhoto} />
            <FieldError message={errors.photos} />
          </div>

          {/* Switch de menor de edad */}
          <ChildToggle value={isChild} onChange={setIsChild} />

          {/* Sección: identidad */}
          <fieldset className="space-y-4">
            <FieldsetLegend icon={User}>Datos de la persona</FieldsetLegend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Nombre" optional value={nombre} onChange={setNombre} placeholder="Ej: Juan" maxLength={80} id="person-name-input" />
              <Field label="Apellido" optional value={apellido} onChange={setApellido} placeholder="Ej: Gómez" maxLength={80} id="person-lastname-input" />
            </div>

            {/* Documento propio solo para adultos */}
            {!isChild && (
              <div className="space-y-1.5">
                <InputLabel htmlFor="person-doc-input" optional>Documento de identidad</InputLabel>
                <DocumentInput tipo={docTipo} numero={docNumero} onTipo={setDocTipo} onNumero={setDocNumero} accent="blue" numeroId="person-doc-input" />
              </div>
            )}
          </fieldset>

          {/* Sección: ubicación y contacto */}
          <fieldset className="space-y-4">
            <FieldsetLegend icon={MapPin}>Ubicación y contacto</FieldsetLegend>

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
              <InputLabel htmlFor="ubicacion-input" optional>Dónde se encontró</InputLabel>
              <LocationCombobox value={ubicacion} onChange={setUbicacion} options={locations} onForget={forget} accent="blue" id="ubicacion-input" />
            </div>

            <div className="space-y-1.5">
              <InputLabel htmlFor="contact-phone-input" required>Teléfono del responsable</InputLabel>
              <PhoneField
                prefijo={telPrefijo}
                numero={telNumero}
                onPrefijo={setTelPrefijo}
                onNumero={(v) => { setTelNumero(v); clearError('telefono'); }}
                error={!!errors.telefono}
                id="contact-phone-input"
              />
              <FieldError message={errors.telefono} />
            </div>

            {/* Identificación del responsable: obligatoria si es menor */}
            {isChild && (
              <div className="space-y-1.5">
                <InputLabel htmlFor="doc-responsable-input" required>Identificación del responsable</InputLabel>
                <DocumentInput
                  tipo={docRespTipo}
                  numero={docResponsable}
                  onTipo={setDocRespTipo}
                  onNumero={(v) => { setDocResponsable(v); clearError('docResponsable'); }}
                  accent="blue"
                  error={!!errors.docResponsable}
                  numeroId="doc-responsable-input"
                />
                {errors.docResponsable ? (
                  <FieldError message={errors.docResponsable} />
                ) : (
                  <p className="text-[11px] text-amber-600">Obligatorio para registrar a un menor.</p>
                )}
              </div>
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

          <Button type="submit" variant="primary" accent="blue" size="xl" fullWidth icon={PlusCircle} disabled={isSubmitting} id="btn-submit-report">
            {isSubmitting ? 'Registrando…' : 'Reportar Persona Encontrada'}
          </Button>
        </form>
      )}
    </Card>
  );
}
