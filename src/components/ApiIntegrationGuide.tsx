/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Terminal, Copy, Check, Server, Database, Code, Cpu, ExternalLink, HelpCircle } from 'lucide-react';

export default function ApiIntegrationGuide() {
  const [showHelp, setShowHelp] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const expressCode = `// server.ts - Configuración sugerida para conectar con tus scripts de Python
import express from "express";
import multer from "multer";
import { exec } from "child_process";
import path from "path";
import fs from "fs";

const app = express();
app.use(express.json({ limit: "50mb" }));

// Configurar multer para almacenar imágenes temporales recibidas
const upload = multer({ dest: "uploads/" });

/**
 * 1. API para registrar una persona encontrada (Sube imagen e indexa en ChromaDB)
 * Mapea directamente a tu clase 'LoadImage' en Python
 */
app.post("/api/found-persons", upload.single("image"), async (req, res) => {
  try {
    const { name, ci, hospitalName, locationAddress, contactPhone, physicalDescription } = req.body;
    const imgPath = req.file?.path;

    if (!imgPath) {
      return res.status(400).json({ error: "La foto del rostro es obligatoria." });
    }

    // Guardar metadata en tu Base de Datos relacional (PostgreSQL, SQLite, etc.)
    // const person = await db.insertFoundPerson({ name, ci, hospitalName, locationAddress, contactPhone, physicalDescription });

    // Llamar a tu script Python 'load_image.py' para extraer el embedding e indexarlo en ChromaDB
    const pythonScript = path.join(__dirname, "load_image_adapter.py");
    const cmd = \`python3 "\${pythonScript}" "\${imgPath}" "\${hospitalName}" "\${name || 'Desconocido'}" "\${ci || 'Desconocido'}"\`;

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error("Error al indexar rostro:", error);
        return res.status(500).json({ error: "Error en el reconocimiento facial." });
      }
      
      // Retornar éxito
      res.json({
        success: true,
        message: "Persona registrada e indexada correctamente en la base de datos vectorial.",
        id: "usr_" + Math.random().toString(36).substr(2, 9)
      });
    });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 2. API para buscar coincidencias (Sube imagen de búsqueda y compara en ChromaDB)
 * Mapea directamente a tu clase 'SearchImage' en Python
 */
app.post("/api/search-missing", upload.single("image"), async (req, res) => {
  try {
    const requesterCi = req.body.requesterCi;
    const imgPath = req.file?.path;

    if (!imgPath) {
      return res.status(400).json({ error: "La imagen de búsqueda es requerida." });
    }

    // Llamar a tu script Python 'search_image.py'
    const pythonScript = path.join(__dirname, "search_image_adapter.py");
    const cmd = \`python3 "\${pythonScript}" "\${imgPath}"\`;

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error("Error de búsqueda facial:", error);
        return res.status(500).json({ error: "Fallo durante el procesamiento de la imagen." });
      }

      // Procesar la salida JSON del script de Python (busqueda['distances'] y metadatas)
      try {
        const matches = JSON.parse(stdout); 
        // matches debe estructurarse como: [{ id, nombre, rol, distancia, certeza }]
        res.json({ success: true, matches });
      } catch (parseErr) {
        res.json({ 
          success: true, 
          rawOutput: stdout,
          message: "Asegúrate de que tu script Python imprima en formato JSON los resultados de ChromaDB."
        });
      }
    });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});`;

  const pythonAdapterCode = `# load_image_adapter.py - Adaptador para recibir parámetros desde Node.js
import sys
import os
from load_image import LoadImage

if __name__ == "__main__":
    # Recibir argumentos pasados por Node.js child_process
    img_path = sys.argv[1]
    hospital_name = sys.argv[2]
    name = sys.argv[3]
    ci = sys.argv[4]

    # Instanciar y ejecutar tu clase
    loader = LoadImage(
        img_path=img_path,
        hospital_name=hospital_name,
        name=name,
        ci=ci
    )
    loader.loadData()
    print("SUCCESS")
`;

  return (
    <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 shadow-2xl border border-slate-800" id="api-integration-guide">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-amber-500 font-mono text-xs uppercase tracking-wider mb-1">
            <Terminal size={14} className="animate-pulse" />
            Consola para Desarrolladores
          </div>
          <h2 className="text-xl font-bold font-sans tracking-tight text-white">Guía de Conexión de API & Base de Datos</h2>
          <p className="text-sm text-slate-400 mt-1">
            Instrucciones y adaptadores para integrar tus scripts de <span className="text-blue-400 font-semibold">DeepFace</span> y <span className="text-blue-400 font-semibold">ChromaDB</span> con esta interfaz.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start md:self-center">
          <button
            type="button"
            onClick={() => setShowHelp(!showHelp)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              showHelp 
                ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm' 
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-750'
            }`}
            id="btn-toggle-api-help"
          >
            <HelpCircle size={15} />
            {showHelp ? 'CERRAR PROCEDIMIENTO' : '¿CÓMO CONFIGURAR?'}
          </button>
          <span className="hidden sm:inline-flex items-center px-2.5 py-1.5 rounded-xl text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
            Práctico para Producción
          </span>
        </div>
      </div>

      {showHelp && (
        <div className="mt-6 bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 text-slate-300 transition-all" id="api-help-container">
          <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wide flex items-center gap-2">
            <HelpCircle size={16} className="text-amber-500" />
            Procedimiento Oficial para Integrar la API y Scripts de Python
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 shadow-sm space-y-1.5">
              <span className="inline-flex w-5 h-5 items-center justify-center rounded-full bg-slate-800 text-amber-400 text-[10px] font-black">1</span>
              <h4 className="text-xs font-bold text-white">Configurar Servidor Express</h4>
              <p className="text-[11px] text-slate-400 leading-normal">
                Monta un servidor en Node.js que escuche peticiones multipart/form-data usando multer para recibir imágenes y metadatos.
              </p>
            </div>
            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 shadow-sm space-y-1.5">
              <span className="inline-flex w-5 h-5 items-center justify-center rounded-full bg-slate-800 text-amber-400 text-[10px] font-black">2</span>
              <h4 className="text-xs font-bold text-white">Crear Scripts Adaptadores</h4>
              <p className="text-[11px] text-slate-400 leading-normal">
                Implementa adaptadores Python ligeros que reciban los argumentos por consola (sys.argv) y llamen a tus clases de DeepFace y ChromaDB.
              </p>
            </div>
            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 shadow-sm space-y-1.5">
              <span className="inline-flex w-5 h-5 items-center justify-center rounded-full bg-slate-800 text-amber-400 text-[10px] font-black">3</span>
              <h4 className="text-xs font-bold text-white">Conectar con ChromaDB</h4>
              <p className="text-[11px] text-slate-400 leading-normal">
                Asegúrate de que el script de carga guarde la imagen codificada en una carpeta accesible y asocie su embedding con la ID en ChromaDB.
              </p>
            </div>
            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 shadow-sm space-y-1.5">
              <span className="inline-flex w-5 h-5 items-center justify-center rounded-full bg-slate-800 text-amber-400 text-[10px] font-black">4</span>
              <h4 className="text-xs font-bold text-white">Formatear Salidas JSON</h4>
              <p className="text-[11px] text-slate-400 leading-normal">
                El script de búsqueda debe imprimir en salida estándar (stdout) un JSON formateado para que Node.js lo parsee y envíe los matches a la UI.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Architecture overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-2 text-slate-300 font-semibold mb-2">
            <div className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <Code size={16} />
            </div>
            1. Vista Frontend (React)
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Formularios listos para capturar datos de refugiados y fotos de búsqueda, enviando peticiones multiparte (<code className="text-slate-200">multipart/form-data</code>) al servidor.
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-2 text-slate-300 font-semibold mb-2">
            <div className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg">
              <Server size={16} />
            </div>
            2. Servidor Express (Node)
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Recibe el archivo, almacena la información relacional (Cédula, contacto, ubicación) y ejecuta el puente en segundo plano llamando al subproceso Python.
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-2 text-slate-300 font-semibold mb-2">
            <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <Database size={16} />
            </div>
            3. Motor IA (Python + Chroma)
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Tus clases <code className="text-amber-500">LoadImage</code> y <code className="text-amber-500">SearchImage</code> procesan las imágenes usando <span className="font-semibold text-slate-300">DeepFace Facenet</span> y buscan la cara más cercana.
          </p>
        </div>
      </div>

      {/* Code sections */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Cpu size={14} className="text-indigo-400" />
              Adaptador Python (<code className="text-amber-400">load_image_adapter.py</code>)
            </span>
            <button
              onClick={() => copyToClipboard(pythonAdapterCode, 'python')}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-md transition-colors text-xs flex items-center gap-1"
              id="btn-copy-python"
            >
              {copiedSection === 'python' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              {copiedSection === 'python' ? 'Copiado' : 'Copiar'}
            </button>
          </div>
          <div className="relative">
            <pre className="bg-slate-950 text-slate-300 font-mono text-[11px] md:text-xs p-4 rounded-xl overflow-x-auto max-h-[250px] border border-slate-800/80 scrollbar-thin">
              <code>{pythonAdapterCode}</code>
            </pre>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Server size={14} className="text-amber-400" />
              Rutero de Backend sugerido (<code className="text-amber-400">server.ts / api.ts</code>)
            </span>
            <button
              onClick={() => copyToClipboard(expressCode, 'express')}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-md transition-colors text-xs flex items-center gap-1"
              id="btn-copy-express"
            >
              {copiedSection === 'express' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              {copiedSection === 'express' ? 'Copiado' : 'Copiar'}
            </button>
          </div>
          <div className="relative">
            <pre className="bg-slate-950 text-slate-300 font-mono text-[11px] md:text-xs p-4 rounded-xl overflow-x-auto max-h-[300px] border border-slate-800/80 scrollbar-thin">
              <code>{expressCode}</code>
            </pre>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3 items-start">
        <span className="text-xl mt-0.5">💡</span>
        <div className="text-xs text-amber-400 leading-relaxed">
          <span className="font-bold block mb-1">Nota sobre Reconocimiento Facial:</span>
          Hemos creado un servicio simulado en el frontend que emula el comportamiento de DeepFace. Permite agregar personas en tiempo real (las almacena en tu sesión de navegador vía <code className="text-white">localStorage</code>) para que puedas probar el flujo completo de búsqueda inmediatamente con fotos reales desde la cámara o subiendo archivos.
        </div>
      </div>
    </div>
  );
}
