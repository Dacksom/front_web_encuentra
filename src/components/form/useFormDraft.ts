/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Estado de formulario que sobrevive al cambiar de pestaña (sin recargar).
 * Vive en memoria (módulo), así conserva incluso los File de las fotos.
 * Se reinicia al recargar la página — intencional.
 */
import { useEffect, useState } from 'react';

const drafts: Record<string, unknown> = {};

export function useFormDraft<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => (key in drafts ? (drafts[key] as T) : initial));
  useEffect(() => {
    drafts[key] = state;
  }, [key, state]);
  return [state, setState] as const;
}
