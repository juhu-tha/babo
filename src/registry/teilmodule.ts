/**
 * Aufgeteilte lange Module (Z53-Folge, 28.10.2026: „Module über 10 000 Wörter in eigenständige Teilmodule aufteilen“).
 *
 * Ein Stammmodul wird nach seinen Reitern in Teilmodule mit eigener Route aufgeteilt. Die Teilmodule teilen sich
 * die Kurzfassung (src/data/kurzfassung.ts); die alte Modul-ID bleibt als Alias in TAB_ALIASES (./modules.ts)
 * erhalten und leitet auf Teil 1 weiter. Die Komponente des Stammmoduls bedient alle Teile über die Eigenschaft
 * `bereiche` (src/routing/ModulInhalt.tsx), Texte wurden nicht verändert, nur verteilt.
 *
 * Die Datei hat keine Importe, damit der Modulkopf (src/routing/ModulKopf.tsx) sie ohne Registry laden kann.
 * tests/teilmodule.test.ts prüft Registry, Alias, Routen und Reiterzuordnung; Muster und Vorschläge für weitere
 * Module: docs/entwuerfe/lange-module-aufteilung.md.
 */
export interface Teilmodulfamilie {
  /** alte Modul-ID (jetzt Alias auf den ersten Teil) */
  stamm: string;
  /** Teilmodul-IDs in Lesereihenfolge */
  teile: readonly string[];
}

export const TEILMODULE: readonly Teilmodulfamilie[] = [
  { stamm: 'spannbeton', teile: ['spannbeton_grundlagen', 'spannbeton_kennwerte'] },
  { stamm: 'bauwerksuntersuchung', teile: ['bauwerksdiagnose', 'pruefverfahren_katalog', 'zfp'] },
];

/** Familie eines Teilmoduls (undefined, wenn die ID kein Teilmodul ist) */
export function teilmodulFamilie(id: string): Teilmodulfamilie | undefined {
  return TEILMODULE.find(f => f.teile.includes(id));
}
