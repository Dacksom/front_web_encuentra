/**
 * Barra tricolor (bandera de Venezuela) usada como acento en header y footer.
 */
import React from 'react';

export default function FlagBar() {
  return (
    <div className="h-1.5 w-full flex">
      <div className="h-full w-1/3 bg-amber-400" />
      <div className="h-full w-1/3 bg-blue-600" />
      <div className="h-full w-1/3 bg-rose-600" />
    </div>
  );
}
