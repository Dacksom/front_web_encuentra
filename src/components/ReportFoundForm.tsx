/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { PlusCircle, Camera, Upload, AlertCircle, FileText, MapPin, Phone, Building, Check, Heart, User, HelpCircle, Baby } from 'lucide-react';
import { FoundPerson } from '../types';

interface ReportFoundFormProps {
  onAddPerson: (person: FoundPerson) => void;
}

export default function ReportFoundForm({ onAddPerson }: ReportFoundFormProps) {
  const [showHelp, setShowHelp] = useState(false);
  const [name, setName] = useState('');
  const [ci, setCi] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [physicalDescription, setPhysicalDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [status, setStatus] = useState<'refugiado' | 'hospitalizado'>('refugiado');
  const [isChild, setIsChild] = useState(false);
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle local file load
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!hospitalName.trim()) {
      setError("Por favor, ingresa el nombre del hospital, refugio o centro de rescate.");
      return;
    }
    if (!contactPhone.trim()) {
      setError("Por favor, proporciona un número telefónico de contacto.");
      return;
    }
    if (!physicalDescription.trim()) {
      setError("Por favor, escribe una observación o descripción detallada.");
      return;
    }
    if (!selectedImage) {
      setError("Es obligatorio adjuntar o tomar una fotografía clara del rostro para indexar.");
      return;
    }

    setError(null);

    // Create person object
    const newPerson: FoundPerson = {
      id: `usr_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`,
      name: isChild ? 'Niño/a Desconocido (Protegido)' : (name.trim() || 'Desconocido'),
      ci: isChild ? 'No Aplica (Menor de edad)' : (ci.trim() || 'Desconocido'),
      hospitalName: hospitalName.trim(),
      locationAddress: isChild ? 'No revelada por protección al menor' : locationAddress.trim(),
      contactPhone: contactPhone.trim(),
      physicalDescription: physicalDescription.trim(),
      imageUrl: selectedImage,
      dateFound: new Date().toISOString(),
      status: status
    };

    onAddPerson(newPerson);
    setIsSuccess(true);
  };

  const handleResetForm = () => {
    setName('');
    setCi('');
    setHospitalName('');
    setLocationAddress('');
    setContactPhone('');
    setPhysicalDescription('');
    setSelectedImage(null);
    setStatus('refugiado');
    setIsChild(false);
    setIsSuccess(false);
    setError(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6" id="report-found-view">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 mb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <PlusCircle size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Reportar Persona Encontrada</h2>
            <p className="text-sm text-slate-500">Agrega el registro de una persona encontrada a la base de datos.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowHelp(!showHelp)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
            showHelp 
              ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm' 
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
          id="btn-toggle-report-help"
        >
          <HelpCircle size={15} />
          {showHelp ? 'CERRAR PROCEDIMIENTO' : '¿CÓMO FUNCIONA?'}
        </button>
      </div>

      {showHelp && (
        <div className="mb-6 bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 space-y-4 text-slate-700 transition-all" id="report-help-container">
          <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-wide flex items-center gap-2">
            <HelpCircle size={16} className="text-emerald-600" />
            Procedimiento Oficial para Reportar Personas Encontradas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
            <div className="bg-white p-3.5 rounded-xl border border-emerald-100/40 shadow-sm space-y-1.5">
              <span className="inline-flex w-5 h-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black">1</span>
              <h4 className="text-xs font-bold text-slate-800">Capturar Foto</h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                Usa la cámara web de tu dispositivo o carga un archivo. Asegúrate de que el rostro de la persona esté bien iluminado y de frente.
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-emerald-100/40 shadow-sm space-y-1.5">
              <span className="inline-flex w-5 h-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black">2</span>
              <h4 className="text-xs font-bold text-slate-800">Definir Tipo / Edad</h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                Indica si es un adulto o menor de edad. Para menores, la protección de identidad resguarda nombre, cédula y dirección de forma automática.
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-emerald-100/40 shadow-sm space-y-1.5">
              <span className="inline-flex w-5 h-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black">3</span>
              <h4 className="text-xs font-bold text-slate-800">Ubicación y Enlace</h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                Ingresa el nombre del hospital, refugio o centro de rescate. Incluye un número telefónico de contacto activo para coordinaciones.
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-emerald-100/40 shadow-sm space-y-1.5">
              <span className="inline-flex w-5 h-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black">4</span>
              <h4 className="text-xs font-bold text-slate-800">Indexación Facial</h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                Envía el formulario. El sistema procesará el rostro, guardará la descripción física y lo habilitará de inmediato para búsquedas.
              </p>
            </div>
          </div>
        </div>
      )}

      {isSuccess ? (
        <div className="text-center py-10 px-4 max-w-md mx-auto" id="report-success-screen">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-sm">
            <Check size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">¡Registro Exitoso!</h3>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            La persona se ha indexado localmente. Su rostro ya puede coincidir con las búsquedas que realicen sus seres queridos.
          </p>
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-2.5 text-sm" id="report-error">
              <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Facial image camera vs file section */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Camera size={14} className="text-blue-600" />
              Fotografía de la Persona
            </label>

            {selectedImage ? (
              <div className="flex items-center gap-4 bg-slate-50 border border-blue-600 rounded-xl p-3.5">
                <img
                  src={selectedImage}
                  alt="Previsualización"
                  className="w-20 h-20 object-cover rounded-lg border border-blue-600"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <Check size={14} /> Rostro cargado con éxito
                  </p>
                  <p className="text-[11px] text-slate-400">Listo para codificación de vectores.</p>
                  <div className="flex gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 bg-white hover:bg-blue-50 border border-blue-600 text-slate-700 rounded-md text-[10px] font-semibold transition-all"
                      id="btn-change-uploaded-img"
                    >
                      Subir otra imagen
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-blue-600 hover:border-blue-700 hover:bg-blue-50/30 rounded-xl p-6 text-center cursor-pointer transition-all"
                id="file-upload-only"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div className="space-y-1 py-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-2">
                    <Upload size={18} />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">Haz clic para subir la foto</p>
                  <p className="text-xs text-slate-400">Formatos JPG o PNG (rostro frontal claro)</p>
                </div>
              </div>
            )}
          </div>

          {/* Form inputs section */}
          <div className="space-y-5 bg-slate-200 p-5 sm:p-6 rounded-2xl border border-slate-300/50 mt-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
            {/* Child Toggle Switch */}
            <div className="bg-white border-2 border-amber-200/60 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm" id="child-toggle-container">
              <div>
                <span className="text-sm font-black text-slate-800 uppercase tracking-wider block flex items-center gap-2">
                  <Baby size={20} className="text-amber-500" />
                  ¿Es menor de edad?
                </span>
                <p className="text-xs text-slate-500 mt-1">Activa esta opción para aplicar protección de identidad.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsChild(!isChild)}
                className={`px-6 py-3 rounded-xl text-sm font-extrabold transition-all duration-300 shrink-0 flex items-center justify-center gap-2 shadow-sm border-2 ${
                  isChild
                    ? 'bg-amber-500 border-amber-500 hover:bg-amber-600 text-white shadow-[0_4px_20px_rgba(245,158,11,0.4)] scale-105'
                    : 'bg-amber-50 border-amber-400 text-amber-700 hover:bg-amber-100 hover:border-amber-500 hover:shadow-md'
                }`}
                id="btn-toggle-child"
              >
                {isChild ? <Check size={18} /> : <Baby size={18} />}
                {isChild ? 'MENOR PROTEGIDO' : 'SÍ, ES MENOR'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Optional Name */}
              {!isChild && (
                <div className="space-y-1.5" id="name-input-wrapper">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                    Nombre Completo (Opcional)
                  </label>
                  <div className="relative">
                    {!name && (
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <User size={16} className="text-slate-400" />
                      </div>
                    )}
                    <input
                      type="text"
                      placeholder="Nombre o desconocido"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full pr-4 py-2.5 bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-slate-800 text-sm placeholder-slate-400 outline-none transition-all font-medium shadow-sm ${name ? 'pl-4' : 'pl-10'}`}
                      id="person-name-input"
                    />
                  </div>
                </div>
              )}

              {/* Optional CI */}
              {!isChild && (
                <div className="space-y-1.5" id="ci-input-wrapper">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                    Cédula de Identidad (Opcional)
                  </label>
                  <div className="relative">
                    {!ci && (
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <FileText size={16} className="text-slate-400" />
                      </div>
                    )}
                    <input
                      type="text"
                      placeholder="Ej: V-23.900.512 o desconocido"
                      value={ci}
                      onChange={(e) => setCi(e.target.value)}
                      className={`w-full pr-4 py-2.5 bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-slate-800 text-sm placeholder-slate-400 outline-none transition-all font-medium shadow-sm ${ci ? 'pl-4' : 'pl-10'}`}
                      id="person-ci-input"
                    />
                  </div>
                </div>
              )}

            {/* Hospital/Shelter Center Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Refugio, Hospital o Ente Receptivo
              </label>
              <div className="relative">
                {!hospitalName && (
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Building size={16} className="text-slate-400" />
                  </div>
                )}
                <input
                  type="text"
                  placeholder="Ej: Refugio Polideportivo de Catia"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  className={`w-full pr-4 py-2.5 bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-slate-800 text-sm placeholder-slate-400 outline-none transition-all font-medium shadow-sm ${hospitalName ? 'pl-4' : 'pl-10'}`}
                  id="hospital-name-input"
                />
              </div>
            </div>

            {/* Contact Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Teléfono de Contacto Directo
              </label>
              <div className="relative">
                {!contactPhone && (
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Phone size={16} className="text-slate-400" />
                  </div>
                )}
                <input
                  type="text"
                  placeholder="Ej: +58 412-1234567"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className={`w-full pr-4 py-2.5 bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-slate-800 text-sm placeholder-slate-400 outline-none transition-all font-medium shadow-sm ${contactPhone ? 'pl-4' : 'pl-10'}`}
                  id="contact-phone-input"
                />
              </div>
            </div>

            {/* Observation Field */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Observación
              </label>
              <div className="relative">
                {!physicalDescription && (
                  <div className="absolute top-3 left-0 pl-3.5 flex items-start pointer-events-none">
                    <FileText size={16} className="text-slate-400" />
                  </div>
                )}
                <textarea
                  placeholder="Describe toda la información posible..."
                  rows={4}
                  value={physicalDescription}
                  onChange={(e) => setPhysicalDescription(e.target.value)}
                  className={`w-full pr-4 py-2.5 bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-slate-800 text-sm placeholder-slate-400 outline-none transition-all font-medium shadow-sm resize-none ${physicalDescription ? 'pl-4' : 'pl-10'}`}
                  id="observation-input"
                />
              </div>
            </div>
          </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            id="btn-submit-report"
          >
            <PlusCircle size={18} />
            Reportar Persona Encontrada
          </button>
        </form>
      )}
    </div>
  );
}
