# CONTEXTO DEL PROYECTO (AI-Readable Context File)

Este documento sirve como un manual técnico de contexto y diseño para que cualquier Inteligencia Artificial o desarrollador comprenda la arquitectura actual de la aplicación **Reencuentro S.O.S**, su lógica interna, y cómo expandir el sistema a un backend real.

---

## 1. Misión del Proyecto y UX
- **Objetivo**: Proveer una interfaz humanitaria ágil, simplificada y confiable en contingencias para registrar personas encontradas (en hospitales/albergues de Venezuela) y permitir que sus familiares las localicen mediante cotejo visual o facial.
- **Enfoque de Navegación**: Diseño de vista única/tabulada limpia y directa sin barras laterales sobrecargadas. Se divide en dos flujos principales y uno secundario para integradores de TI:
  1. **Buscar un Familiar (Search)**: Cotejo de imagen cargada por el usuario contra la base de datos de rostros.
  2. **Reportar Persona Encontrada (Report)**: Registros nuevos, con soporte integrado de captura de cámara web y switch especializado para menores de edad.
  3. **Guía de Integración API (Developer Hub)**: Panel interactivo que expone código y arquitectura para programadores.

---

## 2. Definiciones de Datos y Tipos (`src/types.ts`)
Cualquier modificación o adición de base de datos o API debe ajustarse a las interfaces de datos declaradas en `src/types.ts`. Sus campos clave son:

### `FoundPerson`
Representa una persona registrada que ha sido hallada por rescatistas:
- `id` (string): Identificador único (formato `usr_[rand_id]_[timestamp]`).
- `name` (string): Nombre completo o "Desconocido" / "Niño/a Desconocido (Protegido)".
- `ci` (string): Cédula de Identidad, "Desconocido" o "No Aplica (Menor de edad)".
- `hospitalName` (string): Nombre del refugio, hospital o CDI.
- `locationAddress` (string): Dirección de la persona, o "No revelada por protección al menor" si aplica el protocolo de resguardo.
- `contactPhone` (string): Teléfono de enlace directo con el centro.
- `physicalDescription` (string): Descripción física (ropa, tatuajes, cicatrices, edad estimada).
- `imageUrl` (string): URI de imagen de alta resolución (p.ej. base64 o URL estática).
- `status` ('refugiado' | 'hospitalizado' | 'reunificado'): Estado operativo de la persona.

### `MatchResult`
Resultado devuelto por el motor de comparación facial:
- `person` (`FoundPerson`): Datos de la persona coincidente.
- `confidence` (number): Puntuación de similitud calculada (0.00 a 100.00%).

---

## 3. Lógica Clave de Componentes

### A. Componente `SearchMissingForm.tsx` (Búsqueda Facial)
- **Carga de Imágenes**: El usuario arrastra, selecciona o usa la cámara para cargar una foto de referencia.
- **Simulación del Cotejo**: En modo demostrativo, calcula un porcentaje de semejanza aleatorio o simulado para cada persona en el catálogo (usando un delay con loader interactivo) y selecciona los mejores matches (> 70% de confianza).
- **Proceso de Reencuentro**: Al oprimir el botón "Es mi familiar", se activa el callback `onTriggerReunion` que cambia el estado global de la persona a `reunificado`.

### B. Componente `ReportFoundForm.tsx` (Registro)
- **Captura con Cámara**: Usa la API nativa de `navigator.mediaDevices.getUserMedia` para proyectar el stream de video de frente de manera segura y capturar una imagen mediante un `<canvas>`.
- **Protección de Menores (`isChild`)**:
  - Al activarse el switch de menor de edad, el formulario automáticamente **limita la recolección de datos sensibles**.
  - Oculta los campos de **Nombre Completo**, **Cédula de Identidad** y **Dirección Física**.
  - Al guardar, almacena valores genéricos y seguros en la base de datos para prevenir el rastreo no autorizado de menores en áreas críticas de desastre.

### C. Componente `ApiIntegrationGuide.tsx` (Guía de TI)
- Provee un puente conceptual detallado entre el frontend y un backend de Python que ejecute DeepFace con base de datos vectorial ChromaDB.

---

## 4. Guía de Conexión a Backend Real (Plan de Implementación para IA)

Si una IA futura es requerida para implementar la API real en Node.js y Python, debe seguir el siguiente pipeline:

```
                  [ FRONTEND REACT ]
                    /            \
          Carga imagen           Reporta rostro
          para búsqueda          encontrado
                  /                \
                 v                  v
         POST /api/search     POST /api/report
                 \                  /
                  v                v
            [ SERVIDOR EXPRESS (Node.js) ]
                    |            |
         Invoca adapter         Inserta datos y guarda
         Python con exec        imagen en disco
                    |            |
                    v            v
            [ SCRIPT PYTHON (DeepFace + ChromaDB) ]
                    |
          Genera embeddings y compara
          distancia coseno en BD
```

### Script Python Recomendado para Búsqueda (Cotejo)
```python
# adapter_search.py
import sys
import json
from deepface import DeepFace
import chromadb

def search_face(image_path):
    # 1. Extraer embedding facial con DeepFace (usando Facenet)
    embedding = DeepFace.represent(img_path=image_path, model_name="Facenet")[0]["embedding"]
    
    # 2. Conectar a colección local de ChromaDB
    chroma_client = chromadb.PersistentClient(path="./chroma_db")
    collection = chroma_client.get_or_create_collection(name="humanitarian_faces")
    
    # 3. Consultar los vecinos más cercanos usando distancia coseno
    results = collection.query(
        query_embeddings=[embedding],
        n_results=3
    )
    
    # 4. Retornar IDs de matches con sus metadatos
    print(json.dumps(results))

if __name__ == "__main__":
    search_face(sys.argv[1])
```

---

## 5. Decisiones de Estilo y Visuales
- **Tipografía**:
  - `sans-serif` principal: **Inter** para UI legible, limpia y neutral.
  - `monospace` de soporte: **JetBrains Mono** para metadatos, IDs, timestamps y consolas de código.
- **Colores Semánticos**:
  - Búsqueda / Familiar: Rose (`rose-600`, `rose-500`) para evocar el corazón y reencuentro de afectos.
  - Reporte / Rescatista: Emerald/Green (`emerald-600`, `emerald-500`) para evocar seguridad, registro y calma.
  - Albergues / API: Slate, Indigo y Amber.
