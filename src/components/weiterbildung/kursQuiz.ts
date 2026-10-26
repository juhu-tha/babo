/**
 * Kursquiz des TTZ-Weiterbildungspfads (AP 6.3): Fragenauswahl und Bestehenslogik.
 * Reine Funktionen ohne React/Browser-Abhängigkeit (getestet in tests/ttzKurse.test.ts).
 */
import { BESTEHENSGRENZE, KURSQUIZ_FRAGEN } from '@/src/data/ttzKurse';

interface FrageKern { id: string; question: string }

/** Fragen ohne Wiederholung: gleiche ID oder gleicher Fragetext zählen nur einmal (erste gewinnt) */
export function eindeutigeFragen<T extends FrageKern>(pool: readonly T[]): T[] {
  const ids = new Set<string>();
  const texte = new Set<string>();
  const ergebnis: T[] = [];
  for (const f of pool) {
    const text = f.question.trim().toLowerCase();
    if (ids.has(f.id) || texte.has(text)) continue;
    ids.add(f.id);
    texte.add(text);
    ergebnis.push(f);
  }
  return ergebnis;
}

/** Zufällige Auswahl von `anzahl` verschiedenen Fragen (Fisher-Yates auf dem bereinigten Pool) */
export function waehleKursFragen<T extends FrageKern>(pool: readonly T[], anzahl = KURSQUIZ_FRAGEN, zufall: () => number = Math.random): T[] {
  const kandidaten = eindeutigeFragen(pool);
  for (let i = kandidaten.length - 1; i > 0; i--) {
    const j = Math.floor(zufall() * (i + 1));
    [kandidaten[i], kandidaten[j]] = [kandidaten[j], kandidaten[i]];
  }
  return kandidaten.slice(0, Math.max(0, anzahl));
}

/** Anteil richtiger Antworten (0…1); 0 bei leerem Quiz */
export function quote(richtig: number, gesamt: number): number {
  return gesamt > 0 ? richtig / gesamt : 0;
}

/** bestanden ab BESTEHENSGRENZE (80 %); ein Quiz mit weniger als KURSQUIZ_FRAGEN Fragen gilt nie als bestanden */
export function istBestanden(richtig: number, gesamt: number, mindestFragen = KURSQUIZ_FRAGEN): boolean {
  if (gesamt < mindestFragen || richtig < 0 || richtig > gesamt) return false;
  // ganzzahlig vergleichen, damit z. B. 8/10 trotz Gleitkomma sicher als 80 % gilt
  return richtig * 100 >= Math.round(BESTEHENSGRENZE * 100) * gesamt;
}

/** Prozentwert, ganzzahlig gerundet */
export function prozent(richtig: number, gesamt: number): number {
  return Math.round(quote(richtig, gesamt) * 100);
}
