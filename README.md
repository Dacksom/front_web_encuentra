# VzlaEncuentra — Plataforma Humanitaria de Reconocimiento Facial (Venezuela)

App web para reunir familias tras emergencias o desastres en Venezuela. Tiene
**dos flujos** y un reporte de fallas:

1. **Buscar Familiar** — un familiar sube una foto y el backend devuelve
   coincidencias por reconocimiento facial.
2. **Reportar Persona Encontrada** — un rescatista registra a una persona hallada
   (con protección especial para menores) para que su familia pueda dar con ella.

El reconocimiento facial (DeepFace + ChromaDB) vive en el **backend**; este repo
es solo el frontend que lo consume.

> ¿Eres dev nuevo? Empieza por **[ONBOARDING.md](./ONBOARDING.md)**.

## 🛠️ Stack

- **React 19** + **TypeScript** + **Vite 6**
- **Tailwind CSS v4** (estilos), **lucide-react** (iconos)
- **axios** (cliente HTTP hacia el backend)
- **Zod** (validación de formularios)
- **heic2any** (convierte fotos HEIC de iPhone a PNG antes de subirlas)

## 📦 Estructura

```
src/
  App.tsx              # Shell: layout + navegación entre vistas + modales
  main.tsx             # Entry point
  index.css            # Estilos globales / tema tipográfico

  core/                # Lógica de negocio y acceso a la API (Clean Architecture)
    domain/            #   modelos + contratos de repositorio (el QUÉ)
    application/       #   casos de uso, DTOs y mappers
    infrastructure/    #   implementación HTTP real (el CÓMO)
    container.ts       #   composition root: lo que importa la UI
  ↳ ver src/core/README.md

  components/          # UI reutilizable (sin lógica de negocio)
    layout/            #   FlagBar, Header, Footer
    modals/            #   Onboarding, ErrorReport, Help, CandidateDetail
    form/              #   inputs y controles de formulario reutilizables
  ↳ ver src/components/README.md

  views/               # Una carpeta por pantalla (vista + sus piezas + su schema)
    search/            #   Buscar Familiar
    report/            #   Reportar Persona Encontrada
  ↳ ver src/views/README.md
```

**Flujo de datos:** `vista → core/container → use-case → repository → http-client → backend`

## ⚙️ Desarrollo

```bash
npm install        # dependencias
npm run dev        # servidor de desarrollo en http://localhost:3000
npm run lint       # tsc --noEmit (chequeo de tipos)
npm run build      # build de producción a dist/
npm run preview    # sirve el build
```

## 🔌 Variables de entorno

Copia `.env.example` a `.env` y ajusta:

| Variable          | Para qué sirve                                                        | Default              |
|-------------------|----------------------------------------------------------------------|----------------------|
| `VITE_API_PROXY`  | Backend al que el dev-server reenvía `/api/*` (solo en `npm run dev`) | `http://localhost:8000` |
| `VITE_API_URL`    | Base de la API que usa el cliente HTTP                               | `/api`               |
| `VITE_MEDIA_URL`  | Origen de las fotos cuando el back devuelve rutas relativas          | (vacío → relativo)   |

En desarrollo basta con `VITE_API_PROXY` apuntando a tu backend; el front llama a
`/api/*` y Vite lo proxea (ver `vite.config.ts`).

---

*Desarrollado con fines humanitarios para agilizar la reunificación familiar.*
