/**
 * Datenschema der Versuchs-Handouts (AP 6.4).
 *
 * Ein Handout beschreibt einen Laborversuch in festen Abschnitten: Ziel, Geräte/Material, Sicherheit,
 * Ablauf, Messprotokoll (interaktive Tabelle mit CSV- und Druck-/PDF-Export), Auswertung, Fehlerquellen
 * und Fragen zur Nachbereitung. Die Daten sind reine Werte (keine React-Elemente), damit Export und Tests
 * ohne Browser auskommen. Die Auswertung liefert das Modul selbst (siehe VersuchsHandout.tsx).
 *
 * Laborspezifische Angaben (Geräte, Probenzahl, Mengen) tragen `laborAnpassen: true` und werden
 * mit „an Laborausstattung anpassen“ gekennzeichnet.
 */

export interface HandoutPosten {
  name: string;
  hinweis?: string;
  /** laborspezifisch: an die Ausstattung des jeweiligen Labors anpassen */
  laborAnpassen?: boolean;
}

export interface SicherheitsPunkt {
  gefahr: string;
  massnahme: string;
}

export interface AblaufSchritt {
  titel: string;
  text: string;
  /** optionale Zeitangabe, z. B. „5 min“ */
  dauer?: string;
  laborAnpassen?: boolean;
}

export interface Fehlerquelle {
  quelle: string;
  wirkung: string;
  abhilfe: string;
}

export interface ProtokollSpalte {
  id: string;
  label: string;
  einheit?: string;
  typ: 'zahl' | 'text';
}

export interface ProtokollKopffeld {
  id: string;
  label: string;
  einheit?: string;
  typ: 'zahl' | 'text' | 'auswahl';
  optionen?: readonly { wert: string; label: string }[];
  /** Vorgabe beim leeren Protokoll */
  standard?: string;
  laborAnpassen?: boolean;
}

/** Stand eines ausgefüllten Protokolls: alle Werte als eingegebener Text (Dezimalkomma erlaubt) */
export interface ProtokollStand {
  kopf: Record<string, string>;
  zeilen: Record<string, string>[];
}

export interface VersuchsHandoutDaten {
  /** Modul-ID der Registry */
  id: string;
  titel: string;
  /** maßgebende Regelwerke (Kurzform, z. B. „DIN EN 12390-3“) */
  normen: readonly string[];
  /** Zeitbedarf im Labor */
  dauer: string;
  /** Gruppengröße bzw. Probenzahl */
  gruppe: string;
  ziel: readonly string[];
  geraete: readonly HandoutPosten[];
  material: readonly HandoutPosten[];
  sicherheit: readonly SicherheitsPunkt[];
  ablauf: readonly AblaufSchritt[];
  protokoll: {
    titel: string;
    kopf: readonly ProtokollKopffeld[];
    spalten: readonly ProtokollSpalte[];
    /** Anzahl Zeilen im leeren Protokoll */
    zeilen: number;
    /** Lehrwerte (fiktiv) zum Ausprobieren der Auswertung */
    beispiel: ProtokollStand;
    hinweis?: string;
  };
  fehlerquellen: readonly Fehlerquelle[];
  fragen: readonly string[];
}

/** Ergebniszeile für Export und Druck */
export interface HandoutErgebnis {
  label: string;
  wert: string;
}

export const LABOR_ANPASSEN = 'an Laborausstattung anpassen';
