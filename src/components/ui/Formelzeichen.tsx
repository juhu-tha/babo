import React from 'react';

/**
 * Formelzeichen in Beschriftungen mit CSS-Großschrift (`uppercase`): Formelzeichen dürfen nie großgeschrieben werden
 * (σ ≠ Σ, ε ≠ E, τ₀ ≠ Τ0). `<Fz>σ<sub>max</sub></Fz>` setzt `normal-case` und optional Indizes als <sub>.
 * tests/formelzeichenGrossschrift.test.ts prüft, dass in `uppercase`-Elementen keine griechischen Kleinbuchstaben
 * ohne diese Hülle stehen.
 */
export function Fz({ children, idx }: { children: React.ReactNode; idx?: React.ReactNode }) {
  return (
    <span className="normal-case tracking-normal">
      {children}
      {idx !== undefined && <sub>{idx}</sub>}
    </span>
  );
}
