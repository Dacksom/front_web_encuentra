# ui/ — Librería de primitivas reutilizables

Componentes "tontos" (sin lógica de negocio) con la misma forma en toda la app;
solo cambian de **color (accent)** y tamaño. Úsalos en vez de repetir markup.

Importa por el barrel: `import { Button, Card, Modal } from '../ui'`.

## Accents (`accents.ts`)
Fuente única de color. `Accent = 'rose' | 'blue' | 'emerald' | 'amber' | 'slate' | 'red'`.
Mapas de clases LITERALES (Tailwind v4 no soporta clases dinámicas):
- `SOLID` — botón relleno · `SOFT` — botón/etiqueta suave · `CHIP` — chip de icono
- `BOX` — caja/callout · `RING` — foco de inputs · `inputClasses()` — estilo de inputs

Convención de color: Buscar=`rose`, Reportar=`blue`, éxito/WhatsApp=`emerald`,
avisos=`amber`, neutro=`slate`, error=`red`.

## Componentes
| Componente | Para qué |
|---|---|
| `Button` | Botón. `variant` (primary/secondary/soft/ghost) · `accent` · `size` (sm/md/lg) · `fullWidth` · `icon`/`iconRight` |
| `Card` | Tarjeta blanca contenedora |
| `Modal` | Shell de modal (overlay + panel + cierre). `maxWidth`, `zIndex`, `panelClassName`, `showClose` |
| `IconChip` | Chip cuadrado con icono en color accent |
| `ViewHeader` | Header de vista: IconChip + título + subtítulo + slot de acción |
| `InputLabel` | Label en mayúsculas con marca requerido/opcional |
| `FieldError` | Línea de error roja con icono (null si no hay mensaje) |
| `Box` | Caja/callout de color accent |
| `FieldsetLegend` | Leyenda de sección (icono + texto) |

## Ejemplo
```tsx
<Button variant="primary" accent="rose" size="lg" fullWidth icon={Search}>
  Iniciar Búsqueda
</Button>
```
