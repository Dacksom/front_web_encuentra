# CONTEXTO DEL PROYECTO (archivo de contexto para IA / devs)

Manual técnico para que cualquier IA o desarrollador entienda la arquitectura de
**VzlaEncuentra** (frontend). Para arrancar, ver `README.md` y `ONBOARDING.md`.

---

## 1. Misión y UX
Interfaz humanitaria para registrar personas encontradas (hospitales/albergues de
Venezuela) y permitir que sus familiares las localicen por cotejo facial. Dos
flujos en una sola página con tabs:

1. **Buscar Familiar** (`views/search`) — sube foto + identidad → cotejo facial →
   coincidencias → detalle y contacto por WhatsApp.
2. **Reportar Persona Encontrada** (`views/report`) — registro nuevo, con switch
   de protección para menores de edad.

Más un **Reportar Error** global (header) y un **reportar como falso** en cada
coincidencia.

> El reconocimiento facial (DeepFace + ChromaDB) está en el **backend**. Este
> repo solo consume su API.

---

## 2. Arquitectura
Clean Architecture en `src/core/` (ver `src/core/README.md`). La UI importa SOLO
desde `core/container.ts`:

```
vista → core/container → use-case → repository → http-client → backend
```

- `domain/` — modelos (camelCase) + contratos de repositorio.
- `application/` — use-cases, DTOs (snake_case del back) y mappers.
- `infrastructure/` — cliente HTTP (axios), conversión HEIC, resolución de imágenes y
  repositorios HTTP reales.

---

## 3. Modelos de datos (`src/core/domain/`)

### `FoundPerson` (`found-person/found-person.model.ts`)
Persona hallada que consume la UI: `id`, `name`, `ci`, `hospitalName`,
`locationAddress`, `contactPhone`, `physicalDescription`, `imageUrl`,
`dateFound`, `status` (`refugiado | hospitalizado | desconocido | reunificado`).

### `MatchResult` (`search/match-result.model.ts`)
Coincidencia del cotejo: `foundPerson` (FoundPerson), `similarity` (0..1),
`distance` (coseno de ChromaDB), `isCertain` (confianza alta).

### `RegisterFoundPersonInput` / `SearchByImageInput`
Forma que capturan los formularios antes de salir a la API (incluye `files`).

---

## 4. Contrato real del backend (swagger en `src/back.json`)
Todas las peticiones que suben foto son **`multipart/form-data`** con el/los
archivo(s) en el campo `files`. Endpoints usados por el front:

| Flujo                | Método y ruta              | Implementado en |
|----------------------|----------------------------|-----------------|
| Buscar (familiar)    | `POST /buscados`           | `infrastructure/search/search.http.repository.ts` |
| Reportar (rescatista)| `POST /encontrados`        | `infrastructure/found-person/found-person.http.repository.ts` |
| Reportar falla       | `POST /reportes/falla`     | `infrastructure/report/report.http.repository.ts` |
| Reportar publicación | `POST /reportes/publicacion`| `infrastructure/report/report.http.repository.ts` |

- `/buscados` exige `limite` entre 30 y 50.
- `/encontrados` puede devolver una **alerta** si un familiar ya buscaba a la
  persona registrada.
- Las fotos HEIC/HEIF de iPhone se convierten a PNG antes de subir.

---

## 5. Reglas clave de UI

### Búsqueda (`SearchView`)
Valida (Zod, `views/search/search.schema.ts`) que haya foto y al menos
**nombre O cédula**. Loader pausado a ~10s mientras responde el back.

### Reporte (`ReportView`)
Valida (Zod, `views/report/report.schema.ts`) foto, refugio y teléfono (7
dígitos). Con el switch **menor de edad** activo, oculta el documento propio y
exige el del **responsable**. El front envía siempre nombre/apellido; el back
decide qué guarda.

---

## 6. Estilo
- Tipografías: **Inter** (UI) y **JetBrains Mono** (IDs/metadatos).
- Colores semánticos: Búsqueda/Familiar → **rose**; Reporte/Rescatista → **blue**;
  acentos → amber/emerald/slate.
