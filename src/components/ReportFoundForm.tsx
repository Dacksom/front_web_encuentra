/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { PlusCircle, Camera, Upload, AlertCircle, FileText, MapPin, Phone, Building, Check, Heart, User, HelpCircle } from 'lucide-react';
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
  
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  // HTML5 Real Camera activation
  const startCamera = async () => {
    setIsCameraActive(true);
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.warn("webcam not available or permission denied", err);
      setCameraError("No se pudo iniciar la cámara (asegúrate de otorgar permisos o usa la subida de archivos).");
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setSelectedImage(dataUrl);
        
        // Stop camera streams
        const stream = video.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        setIsCameraActive(false);
        setError(null);
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
    setIsCameraActive(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!hospitalName.trim()) {
      setError("Por favor, ingresa el nombre del hospital, refugio o centro de rescate.");
      return;
    }
    if (!isChild && !locationAddress.trim()) {
      setError("Por favor, ingresa la dirección física detallada de la persona.");
      return;
    }
    if (!contactPhone.trim()) {
      setError("Por favor, proporciona un número telefónico de contacto.");
      return;
    }
    if (!physicalDescription.trim()) {
      setError("Por favor, describe el estado físico y características particulares.");
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
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <PlusCircle size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Reportar Persona Encontrada</h2>
            <p className="text-sm text-slate-500">Agrega registros para indexar en la base de datos de reconocimiento facial.</p>
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
              <Camera size={14} className="text-slate-400" />
              Fotografía del Rostro (Requerido para DeepFace)
            </label>

            {isCameraActive ? (
              <div className="relative border border-slate-200 rounded-xl bg-slate-950 overflow-hidden text-center p-2" id="webcam-capture-area">
                <video ref={videoRef} className="w-full max-w-sm h-64 mx-auto object-cover rounded-lg" playsInline muted></video>
                <div className="flex gap-2 justify-center mt-3">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg text-xs transition-all shadow-sm"
                    id="btn-capture-snapshot"
                  >
                    Tomar Foto
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold rounded-lg text-xs transition-all"
                    id="btn-cancel-camera"
                  >
                    Cancelar
                  </button>
                </div>
                <canvas ref={canvasRef} className="hidden"></canvas>
              </div>
            ) : selectedImage ? (
              <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                <img
                  src={selectedImage}
                  alt="Previsualización"
                  className="w-20 h-20 object-cover rounded-lg border border-slate-200"
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
                      className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-md text-[10px] font-semibold transition-all"
                      id="btn-change-uploaded-img"
                    >
                      Subir otro
                    </button>
                    <button
                      type="button"
                      onClick={startCamera}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-md text-[10px] font-semibold transition-all flex items-center gap-1"
                      id="btn-retake-cam"
                    >
                      <Camera size={10} />
                      Usar Cámara
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="image-upload-selectors">
                {/* File Upload choice */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/5 rounded-xl p-5 text-center cursor-pointer transition-all"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center mx-auto mb-2.5">
                    <Upload size={18} />
                  </div>
                  <p className="text-xs font-bold text-slate-700">Subir Archivo de Imagen</p>
                  <p className="text-[10px] text-slate-400 mt-1">Soporta JPG, PNG desde la galería</p>
                </div>

                {/* Camera Capture choice */}
                <div
                  onClick={startCamera}
                  className="border-2 border-dashed border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/5 rounded-xl p-5 text-center cursor-pointer transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center mx-auto mb-2.5">
                    <Camera size={18} />
                  </div>
                  <p className="text-xs font-bold text-slate-700">Tomar Foto con Cámara</p>
                  <p className="text-[10px] text-slate-400 mt-1">Captura directa desde laptop o celular</p>
                </div>
              </div>
            )}
            {cameraError && <p className="text-[11px] text-red-500">{cameraError}</p>}
          </div>

          {/* Form inputs section */}
          <div className="space-y-4">
            {/* Child Toggle Switch */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3" id="child-toggle-container">
              <div>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">¿Es un niño, niña o adolescente menor de edad?</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">La protección de identidad se activará automáticamente de ser afirmativo.</span>
              </div>
              <button
                type="button"
                onClick={() => setIsChild(!isChild)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isChild
                    ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
                id="btn-toggle-child"
              >
                {isChild ? 'SÍ, ES MENOR DE EDAD' : 'NO, ES MAYOR DE EDAD'}
              </button>
            </div>

            {isChild && (
              <div className="bg-rose-50/40 border border-rose-100 rounded-xl p-3.5 flex gap-3 items-start" id="child-protection-banner">
                <span className="text-xl">🧒</span>
                <div className="text-[11px] text-rose-800 leading-normal">
                  <strong className="block font-bold">Protección del menor activada:</strong>
                  De acuerdo con los lineamientos de resguardo humanitario, el nombre y la cédula no se registrarán para proteger la identidad del menor. Solo se registrará el teléfono de contacto y la descripción física para que sus padres puedan reconocerle a través de cotejo facial seguro.
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Optional Name */}
              {!isChild && (
                <div className="space-y-1.5" id="name-input-wrapper">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                    <User size={13} className="text-slate-400" />
                    Nombre Completo (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Dejar vacío si no habla / desconoce"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-slate-800 text-xs placeholder-slate-400 outline-none transition-all font-medium"
                    id="person-name-input"
                  />
                </div>
              )}

              {/* Optional CI */}
              {!isChild && (
                <div className="space-y-1.5" id="ci-input-wrapper">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                    <FileText size={13} className="text-slate-400" />
                    Cédula de Identidad (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: V-23.900.512 o desconocido"
                    value={ci}
                    onChange={(e) => setCi(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-slate-800 text-xs placeholder-slate-400 outline-none transition-all font-medium"
                    id="person-ci-input"
                  />
                </div>
              )}

            {/* Hospital/Shelter Center Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Building size={13} className="text-slate-400" />
                Refugio, Hospital o Ente Receptivo
              </label>
              <input
                type="text"
                placeholder="Ej: Refugio Polideportivo de Catia"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-slate-800 text-xs placeholder-slate-400 outline-none transition-all font-medium"
                id="hospital-name-input"
              />
            </div>

            {/* Contact Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Phone size={13} className="text-slate-400" />
                Teléfono de Contacto Directo
              </label>
              <input
                type="text"
                placeholder="Ej: +58 412-1234567"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-slate-800 text-xs placeholder-slate-400 outline-none transition-all font-medium"
                id="contact-phone-input"
              />
            </div>

            {/* Status Class */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Estado Operativo / Clasificación inicial
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStatus('refugiado')}
                  className={`py-2 px-3 border rounded-xl text-xs font-bold transition-all ${
                    status === 'refugiado'
                      ? 'border-emerald-500 bg-emerald-50/25 text-emerald-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                  id="btn-status-refugiado"
                >
                  En Refugio / Albergue
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('hospitalizado')}
                  className={`py-2 px-3 border rounded-xl text-xs font-bold transition-all ${
                    status === 'hospitalizado'
                      ? 'border-emerald-500 bg-emerald-50/25 text-emerald-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                  id="btn-status-hospitalizado"
                >
                  Internado en Hospital / Clínica
                </button>
              </div>
            </div>

            {/* Address Details */}
            {!isChild && (
              <div className="sm:col-span-2 space-y-1.5" id="location-address-wrapper">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <MapPin size={13} className="text-slate-400" />
                  Dirección Física Actual (Ubicación de la Persona)
                </label>
                <textarea
                  placeholder="Especificar piso, número de sala, colchoneta, cuadra o detalles que faciliten encontrarlo"
                  rows={2}
                  value={locationAddress}
                  onChange={(e) => setLocationAddress(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-slate-800 text-xs placeholder-slate-400 outline-none transition-all font-medium resize-none"
                  id="location-address-input"
                />
              </div>
            )}

            {/* Physical Description */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <FileText size={13} className="text-slate-400" />
                Descripción Física Completa y Vestimenta
              </label>
              <textarea
                placeholder="Ej: Hombre, estatura aprox 1.70, tez morena, cicatriz pequeña en la frente. Vestía camisa azul polo, short de jean. No posee calzado. Se encuentra un poco asustado pero bien de salud general."
                rows={3}
                value={physicalDescription}
                onChange={(e) => setPhysicalDescription(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-slate-800 text-xs placeholder-slate-400 outline-none transition-all font-medium resize-none"
                id="physical-desc-input"
              />
            </div>
          </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
            id="btn-submit-report"
          >
            <PlusCircle size={16} />
            Indexar Persona en la Red Humanitaria
          </button>
        </form>
      )}
    </div>
  );
}
