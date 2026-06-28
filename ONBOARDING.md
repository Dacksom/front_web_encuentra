# Onboarding — VzlaEncuentra (frontend)

Guía rápida para empezar a trabajar en este repo en ~15 minutos.

## 1. Qué es

Frontend de una plataforma humanitaria de reconocimiento facial. Dos flujos:

- **Buscar Familiar** (`views/search`) — un familiar sube una foto → el backend
  coteja rostros → se muestran coincidencias → detalle + contacto por WhatsApp.
- **Reportar Persona Encontrada** (`views/report`) — un rescatista registra a
  alguien hallado → queda indexado para futuras búsquedas. Si un familiar ya la
  buscaba, el back responde con una **alerta**.

El reconocimiento facial (DeepFace + ChromaDB) está en el **backend**. Aquí solo
se consume su API.

## 2. Correr el proyecto

```bash
npm install
cp .env.example .env          # ajusta VITE_API_PROXY a tu backend
npm run dev                   # http://localhost:3000
```

Antes de subir cambios:

```bash
npm run lint                  # tipos (tsc --noEmit) — debe dar 0 errores
npm run build                 # debe compilar
```

## 3. Cómo está organizado (mapa mental)

```
App.tsx            → arma el layout y decide qué vista mostrar (tabs).
views/<flujo>/     → cada pantalla, con su lógica de UI, sus sub-componentes
                     y su <flujo>.schema.ts (validación con Zod).
components/         → UI reutilizable, SIN lógica de negocio:
   layout/  modals/  form/
core/              → toda la lógica de negocio y la API. La UI SOLO importa
                     desde core/container.ts (nunca llama a la red directo).
```

**Regla de oro:** un componente nunca habla con la red. Llama a una función de
`core/container.ts`. El dato viaja así:

```
vista → core/container → use-case → repository → http-client → backend
```

### Las capas de `core/` (Clean Architecture)

- **domain/** — modelos (`FoundPerson`, `MatchResult`, …) y *contratos* de
  repositorio (interfaces). El QUÉ, sin saber de HTTP.
- **application/** — casos de uso (orquestan), DTOs (forma snake_case del back) y
  mappers (DTO ⇄ modelo de dominio).
- **infrastructure/** — implementación real: cliente HTTP (axios), conversión HEIC,
  resolución de URLs de imágenes, y los repositorios HTTP que pegan a los
  endpoints `/buscados`, `/encontrados`, `/reportes/*`.
- **container.ts** — el único punto que la UI importa. Cablea repos + use-cases y
  exporta `buscarPersona`, `reportarEncontrado`, `reportarFalla`,
  `reportarPublicacion`, `hasValidCi`.

## 4. Reglas importantes del dominio

- **Protección de menores:** en *Reportar*, el switch "¿Es menor?" oculta el
  documento propio y exige el del **responsable** (validado en
  `views/report/report.schema.ts`). El front envía siempre nombre/apellido; el
  backend decide qué persiste.
- **Fotos de iPhone (HEIC):** se convierten a PNG automáticamente antes de subir
  (`core/infrastructure/http/heic.ts`). No hace falta tocar nada.
- **Validación:** cada formulario tiene su schema Zod en
  `views/<flujo>/<flujo>.schema.ts`, con un helper `validate*()` que devuelve
  errores por campo. La vista mapea esos errores a sus mensajes inline.

## 5. Recetas comunes

### Agregar un campo a un formulario
1. Agrega el estado en la vista (`useFormDraft` si debe sobrevivir al cambio de
   pestaña).
2. Si es obligatorio/validable, súmalo al schema en `views/<flujo>/*.schema.ts`.
3. Si viaja al backend, agrégalo al input del dominio
   (`RegisterFoundPersonInput` o `SearchByImageInput`) y al `FormData` del
   repositorio correspondiente en `core/infrastructure/`.

### Conectar un endpoint nuevo
1. Define el modelo/resultado en `core/domain/<feature>/`.
2. Agrega el método al contrato (`*.repository.ts`).
3. Impleméntalo en `core/infrastructure/<feature>/*.http.repository.ts`
   (usa `postForm`/`postJson` de `infrastructure/http/http-client.ts`).
4. Crea el caso de uso en `core/application/<feature>/use-cases/`.
5. Cablea y expórtalo en `core/container.ts`. La UI ya puede usarlo.

### Agregar una vista nueva
1. Crea `views/<nombre>/<Nombre>View.tsx` (+ su `*.schema.ts` si tiene form).
2. Importa y rutéala en `App.tsx` (añade el tab).

## 6. Convenciones

- Comentarios y nombres de UI en **español**.
- La UI no importa de `core/infrastructure` ni `core/application` directamente:
  siempre vía `core/container.ts`.
- `key` sobre componentes propios rompe el chequeo de tipos (el repo no usa
  `@types/react`): pon el `key` en un `<div className="contents">` envolvente.
