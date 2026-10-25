// Vor dem Drucken und vor dem PDF-Export alles Zurückgestellte sofort darstellen (Phase 5, AP 5.5).
// NachErstemBild (Abschnitte), katexBedarf (Formeln) und chartBedarf (Diagramme) melden hier je einen
// Schritt an. Die Reihenfolge zählt: Erst erscheinende Abschnitte können Formeln und Diagramme enthalten,
// deshalb laufen die Schritte nach Stufe – unabhängig davon, in welcher Reihenfolge die Chunks geladen wurden.
// Ein gemeinsamer beforeprint-Listener statt dreier eigener: Deren Reihenfolge hinge sonst von der Ladereihenfolge ab.

export const STUFE = { abschnitte: 0, formeln: 1, diagramme: 2 } as const;

type Schritt = {
  stufe: number;
  /** synchron (beforeprint): Der Browser druckt unmittelbar nach den Listenern den Ist-Zustand */
  sofort: () => void;
  /** asynchron (PDF-Export): darf nachladen; Standard ist `sofort` */
  vorbereiten?: () => Promise<void>;
};
const schritte: Schritt[] = [];

export function beimDrucken(stufe: number, sofort: () => void, vorbereiten?: () => Promise<void>): void {
  schritte.push({ stufe, sofort, vorbereiten });
  schritte.sort((a, b) => a.stufe - b.stufe);
}

if (typeof window !== 'undefined') window.addEventListener('beforeprint', () => {
  for (const s of schritte) {
    try { s.sofort(); } catch (e) { console.error('Druckvorbereitung', e); }
  }
});

/** Für den PDF-Export: alle Schritte der Reihe nach, mit Nachladen; danach zwei Bilder Zeit für das Layout */
export async function allesDarstellen(): Promise<void> {
  for (const s of [...schritte]) {
    try { await (s.vorbereiten ?? (async () => s.sofort()))(); } catch (e) { console.error('Druckvorbereitung', e); }
  }
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
}
