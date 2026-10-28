/** Gemeinsame Stabilitätsgrößen für Mechanik, Holz-, Stahl- und Massivbau. */

/**
 * Knicklängenbeiwert β der Euler-Fälle (Styleguide: arabische Nummerierung)
 * 1 Kragarm (β = 2,0), 2 beidseitig gelenkig (1,0), 3 eingespannt–gelenkig (0,7), 4 beidseitig eingespannt (0,5)
 */
export const EULER_BETA: Readonly<Record<1 | 2 | 3 | 4, number>> = { 1: 2.0, 2: 1.0, 3: 0.7, 4: 0.5 };

/** kℓ der ersten Eigenform von Euler-Fall 3 (eingespannt–gelenkig): kleinste positive Lösung von tan(kℓ) = kℓ */
export const KL_EULER_FALL_3 = 4.493409457909064;

/**
 * Erste Knickeigenform w(ξ) der Euler-Fälle, ξ = x/ℓ (x = 0 am unteren, eingespannten bzw. gelenkigen Ende), auf max |w| = 1 normiert.
 * 1 Kragarm: 1 − cos(πξ/2); 2 gelenkig: sin(πξ); 3 eingespannt–gelenkig: sin(kξ) − kξ + k·(1 − cos(kξ)) mit k = kℓ = 4,4934
 * (erfüllt w(0) = w′(0) = 0 und w(ℓ) = w″(ℓ) = 0, Größtwert bei ξ ≈ 0,60); 4 beidseitig eingespannt: (1 − cos(2πξ))/2.
 * Quelle: Gross/Hauger/Schröder/Wall, Technische Mechanik 2, Kap. 7 (Knickung).
 */
export function eulerEigenform(fall: 1 | 2 | 3 | 4, xi: number): number {
  const k = KL_EULER_FALL_3;
  switch (fall) {
    case 1: return 1 - Math.cos((Math.PI * xi) / 2);
    case 2: return Math.sin(Math.PI * xi);
    case 3: return (Math.sin(k * xi) - k * xi + k * (1 - Math.cos(k * xi))) / EIGENFORM_3_MAX;
    case 4: return (1 - Math.cos(2 * Math.PI * xi)) / 2;
    default: return NaN;
  }
}
/** Größtwert der unnormierten Eigenform von Fall 3 bei ξ₀ mit w′(ξ₀) = 0, d. h. cos(kξ₀) − 1 + k·sin(kξ₀) = 0 */
const EIGENFORM_3_MAX = (() => {
  const k = KL_EULER_FALL_3;
  const f = (x: number) => Math.sin(k * x) - k * x + k * (1 - Math.cos(k * x));
  const d = (x: number) => Math.cos(k * x) - 1 + k * Math.sin(k * x);
  let a = 0.5, b = 0.7; // Vorzeichenwechsel von w′ im Intervall
  for (let i = 0; i < 60; i++) { const m = (a + b) / 2; if (d(a) * d(m) <= 0) b = m; else a = m; }
  return f((a + b) / 2);
})();
