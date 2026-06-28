# components/ — UI reutilizable

Componentes presentacionales, **sin lógica de negocio** (salvo modales que son
autocontenidos y llaman a `core/container`). Organizados por tipo:

## `ui/`
Librería de primitivas reutilizables (botón, card, modal, box, label, error…)
parametrizadas por **accent** (color). Úsalas en vez de repetir markup.
Detalle en `ui/README.md`. Importa por el barrel: `import { Button, Card } from '../ui'`.

## `layout/`
Estructura de la página:
- `FlagBar` — barra tricolor (bandera) de acento.
- `Header` — logo + botón "Reportar Error" (recibe `onReportError`).
- `Footer` — mensaje y canales de contacto.

## `modals/`
Diálogos superpuestos:
- `OnboardingModal` — bienvenida en la primera visita.
- `ErrorReportModal` — reporta una falla (autocontenido; usa `reportarFalla`).
- `HelpModal` — pasos de ayuda de cada vista (genérico, recibe `steps`).
- `CandidateDetailModal` — detalle de una coincidencia + contacto por WhatsApp.

## `form/`
Controles de formulario reutilizables entre las dos vistas:
- `Field` — input/textarea genérico (+ `inputClasses`, helper de estilos).
- `DocumentInput` — tipo de documento (V/E/J/…) + número.
- `PhoneField` — prefijo VE + 7 dígitos.
- `PhotoUploader` — carga/preview de fotos (drag, file, cámara).
- `LocationCombobox` — input con sugerencias de ubicaciones guardadas.
- `ChildToggle` — switch "¿Es menor de edad?".
- `useFormDraft` — hook que conserva el estado del form al cambiar de pestaña
  (en memoria; se reinicia al recargar).
