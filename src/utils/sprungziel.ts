/**
 * Einmaliges Sprungziel innerhalb eines Moduls (z. B. Lernpfad → bestimmte Übung in ki_uebungen, AP 6.1).
 * Der Aufrufer setzt das Ziel vor setActiveTab(modul); das Zielmodul liest es beim ersten Rendern genau einmal.
 */
const ziele = new Map<string, string>();

export function setzeSprungziel(modul: string, ziel: string): void {
  ziele.set(modul, ziel);
}

/** Ziel abholen und löschen; undefined, wenn keines gesetzt ist */
export function holeSprungziel(modul: string): string | undefined {
  const z = ziele.get(modul);
  ziele.delete(modul);
  return z;
}
