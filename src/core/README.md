# core/ — Lógica de negocio y acceso a la API

Clean Architecture en 3 capas + un composition root. La UI **solo** importa desde
`container.ts`; nunca llama a la red ni importa repositorios directamente.

```
vista → container.ts → use-case → repository → http-client → backend
```

## Capas

### `domain/`  (el QUÉ)
Modelos de negocio en camelCase (`FoundPerson`, `MatchResult`, `RegisterFoundPersonInput`…)
y **contratos** de repositorio (interfaces). No sabe de HTTP ni de Vite. Una
carpeta por feature: `found-person/`, `search/`, `report/`.

### `application/`  (orquestación)
- **use-cases/** — funciones que reciben un repo y devuelven la operación lista
  (`makeSearchByImage`, `makeRegisterFoundPerson`, …). aquí irían
  reglas que no dependan de infraestructura.
- **dto/** — formas snake_case tal como las manda/devuelve el backend
  (`CandidatoDto`, `ResultadoBusquedaDto`). NO se usan en la UI.
- **mappers/** — convierten DTO ⇄ modelo de dominio (`mapBusqueda`).

### `infrastructure/`  (el CÓMO)
- **http/** — `http-client` (`postForm`/`postJson` sobre axios, con manejo del
  error 422 de FastAPI), `media-url` (resolver URLs de imágenes), `heic`
  (HEIC→PNG), `form-data` (helper `appendIf`).
- **found-person/ · search/ · report/** — repositorios HTTP que arman el
  `FormData`/JSON y pegan a los endpoints reales:
  `POST /encontrados`, `POST /buscados`, `POST /reportes/falla|publicacion`.

### `container.ts`  (composition root)
Único lugar donde se cablean repos + use-cases. Exporta a la UI:
`buscarPersona`, `reportarEncontrado`, `reportarFalla`, `reportarPublicacion`,
`hasValidCi` y los tipos que la UI necesita.

## Para tests / mock
Reemplaza las fábricas `create*HttpRepository` por dobles que cumplan el mismo
contrato de dominio e inyéctalos en los use-cases.
