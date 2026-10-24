/** Gemeinsame Stabilitätsgrößen für Mechanik, Holz-, Stahl- und Massivbau. */

/**
 * Knicklängenbeiwert β der Euler-Fälle (Styleguide: arabische Nummerierung)
 * 1 Kragarm (β = 2,0), 2 beidseitig gelenkig (1,0), 3 eingespannt–gelenkig (0,7), 4 beidseitig eingespannt (0,5)
 */
export const EULER_BETA: Readonly<Record<1 | 2 | 3 | 4, number>> = { 1: 2.0, 2: 1.0, 3: 0.7, 4: 0.5 };
