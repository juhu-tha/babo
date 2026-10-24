/**
 * Lernziele je Fachmodul (Umsetzungsplan Phase 3, AP 3.6).
 * Die Kopfzeile jedes Fachmoduls zeigt Niveau, Bearbeitungszeit, Vorwissen (mit Links) und 3–5 operationalisierte Ziele.
 * tests/lernziele.test.ts prüft Aufbau, Verweise und die Abdeckung (Ratsche).
 */
export type BloomStufe = 'Erinnern' | 'Verstehen' | 'Anwenden' | 'Analysieren' | 'Bewerten' | 'Erschaffen';

export interface Lernziel { stufe: BloomStufe; text: string }
export interface ModulLernziele {
  /** Studienniveau: B = Bachelor, M = Master, B/M = beides */
  niveau: 'B' | 'M' | 'B/M';
  /** Bearbeitungszeit in Minuten */
  minuten: number;
  /** Module, die vorher bearbeitet sein sollten (IDs aus der Registry) */
  vorwissen: string[];
  /** 3–5 operationalisierte Lernziele: „Sie können …“ + beobachtbares Verb */
  ziele: Lernziel[];
}

export const LERNZIELE: Readonly<Record<string, ModulLernziele>> = {
  stahlbeton_bemessung: {
    niveau: 'B', minuten: 120, vorwissen: ['beton_info', 'stahlbeton_info', 'mechanische_kenngroessen'],
    ziele: [
      { stufe: 'Verstehen', text: 'die Spannungs-Dehnungs-Linien von Beton und Betonstahl nach DIN EN 1992-1-1 erläutern und den Spannungsblock begründen.' },
      { stufe: 'Anwenden', text: 'die erforderliche Biegezug- und Querkraftbewehrung eines Rechteckquerschnitts mit dem ω- bzw. Fachwerkmodell berechnen.' },
      { stufe: 'Anwenden', text: 'Stützen nach Theorie I. Ordnung mit Interaktionsdiagramm bemessen und die Grenzschlankheit prüfen.' },
      { stufe: 'Analysieren', text: 'erkennen, welcher Nachweis (Biegung, Querkraft, Durchstanzen, Rissbreite) ein Bauteil maßgebend bestimmt.' },
    ],
  },
  bauphysik: {
    niveau: 'B', minuten: 90, vorwissen: ['baustoffkenngroessen'],
    ziele: [
      { stufe: 'Anwenden', text: 'den U-Wert eines mehrschichtigen Bauteils nach DIN EN ISO 6946 berechnen und mit dem GEG-Höchstwert vergleichen.' },
      { stufe: 'Anwenden', text: 'Temperatur- und Dampfdruckverlauf in einem Bauteil ermitteln und eine Tauwasserebene bestimmen.' },
      { stufe: 'Analysieren', text: 'die Wirkung von Dämmlage und Dampfbremse auf das Tauwasserrisiko vergleichen.' },
    ],
  },
  bodenmechanik: {
    niveau: 'B', minuten: 75, vorwissen: ['erdbau'],
    ziele: [
      { stufe: 'Anwenden', text: 'aus Wassergehalt, Fließ- und Ausrollgrenze die Konsistenzzahl berechnen und einen feinkörnigen Boden nach DIN 18196 einordnen.' },
      { stufe: 'Anwenden', text: 'mit dem Mohr-Coulomb-Kriterium prüfen, ob ein Spannungszustand zum Bruch führt.' },
      { stufe: 'Anwenden', text: 'aktiven, passiven und Ruhedruck auf eine Wand nach Rankine berechnen.' },
      { stufe: 'Verstehen', text: 'den zeitlichen Verlauf der Konsolidierungssetzung mit dem Konsolidierungsbeiwert erklären.' },
    ],
  },
};
