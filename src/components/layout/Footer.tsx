/**
 * Pie de página: mensaje humanitario + canales de contacto (Instagram, TikTok, email).
 */
import React from 'react';
import { Heart, Instagram, Mail } from 'lucide-react';
import FlagBar from './FlagBar';

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <FlagBar />
      <div className="max-w-7xl mx-auto p-4 sm:px-6 lg:px-8 py-6 flex flex-col justify-center text-center space-y-2">
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
                <path d="M16.5 3c.3 2.3 1.6 3.9 3.9 4.1v2.7c-1.3.1-2.5-.3-3.9-1.1v5.9c0 3.4-2.5 5.4-5.3 5.4A5.4 5.4 0 0 1 6 14.6c0-3.2 3-5.5 6.1-4.7v2.8c-.5-.2-1-.2-1.5-.1-1.2.2-2 1-1.9 2.3.1 1.2 1 1.9 2.2 1.8 1.2-.1 1.9-1 1.9-2.3V3h2.7Z" />
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
  );
}
