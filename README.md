# Reencuentro S.O.S - Plataforma Humanitaria de Reconocimiento Facial (Venezuela)

Esta plataforma web interactiva y moderna está diseñada para ayudar a identificar y reunir a personas desaparecidas o encontradas tras situaciones de emergencia o desastres naturales en Venezuela. Integra una experiencia de usuario altamente pulida en React, diseñada para conectarse directamente con servicios de reconocimiento facial basados en **DeepFace** y bases de datos vectoriales con **ChromaDB**.

## 🚀 Características Clave

- **Cotejo Facial de Alta Precisión**: Interfaz de búsqueda de familiares cargando una imagen frontal clara, simulando el pipeline matemático de distancia coseno de embeddings faciales de ChromaDB.
- **Registro Seguro de Personas Encontradas**: Formulario optimizado para rescatistas y administradores de albergues para indexar nuevos rostros en tiempo real.
- **Protección de Menores de Edad**: Switch inteligente que oculta automáticamente campos confidenciales como nombres, cédulas de identidad o ubicaciones exactas (dirección física) cuando se reporta a un niño/a, permitiendo el reencuentro seguro únicamente por parentesco validado y cotejo facial.
- **Guía de Integración API Completa**: Consola interactiva para desarrolladores que contiene plantillas de adaptadores listos para producción en Express (Node.js) y Python, mapeados directamente a tus clases `LoadImage` y `SearchImage`.
- **Procedimientos de Ayuda Integrados**: Cada vista cuenta con un botón interactivo de ayuda detallada sobre el protocolo y flujo de rescate humanitario.

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 19 (TypeScript), Vite, Tailwind CSS v4, Lucide React (Iconografía).
- **IA y Procesamiento Vectorial (Backend de Referencia)**: DeepFace (Facenet), ChromaDB.

## 📦 Estructura del Proyecto

```bash
├── src/
│   ├── App.tsx                    # Componente principal y gestor de estados locales
│   ├── types.ts                   # Definición de interfaces TypeScript (FoundPerson, MatchResult)
│   ├── data.ts                    # Registros semilla para demostración inmediata
│   ├── components/
│   │   ├── SearchMissingForm.tsx  # Formulario de búsqueda con simulación de pipeline Facenet
│   │   ├── ReportFoundForm.tsx    # Formulario para rescatistas con soporte de cámara HTML5 y switch de menores
│   │   └── ApiIntegrationGuide.tsx# Guía para desarrolladores con fragmentos de código listos
│   ├── index.css                  # Estilos globales y configuración del tema tipográfico (Inter, JetBrains Mono)
│   └── main.tsx                   # Punto de entrada de la aplicación
├── package.json                   # Dependencias del sistema
└── README.md                      # Este archivo informativo
```

## ⚙️ Instrucciones de Inicialización y Desarrollo

1. **Instalar Dependencias**:
   ```bash
   npm install
   ```

2. **Iniciar Servidor de Desarrollo**:
   ```bash
   npm run dev
   ```

3. **Compilar para Producción**:
   ```bash
   npm run build
   ```

---

*Desarrollado con fines humanitarios para agilizar la unificación familiar y el soporte civil.*
