# views/ — Pantallas

Una carpeta por flujo. Cada vista contiene su componente principal, sus piezas
específicas y su **schema de validación** (Zod).

## `search/` — Buscar Familiar
- `SearchView.tsx` — la pantalla: sube foto + identidad → cotejo → resultados.
- `search.schema.ts` — valida foto obligatoria y "nombre O cédula".
- `MatchCard.tsx` — tarjeta de una coincidencia (+ reportar como falso).
- `AnalysisProgress.tsx` — barra de progreso del cotejo.

## `report/` — Reportar Persona Encontrada
- `ReportView.tsx` — la pantalla: captura foto + datos → registra.
- `report.schema.ts` — valida foto, refugio, teléfono (7 dígitos) y, si es menor,
  el documento del responsable.

## Convención de validación
Cada `*.schema.ts` exporta el schema y un `validate*()` que devuelve
`{ ok, errors }` con errores **por campo**. La vista llama a `validate*()` en el
submit y pinta los mensajes inline. La red se hace siempre vía `core/container`.
