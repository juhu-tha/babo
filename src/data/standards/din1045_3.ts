/**
 * Zentrale Normen-Datenbank: DIN 1045-3:2023-08 & DIN EN 13670:2011-03
 * Single Source of Truth für Bauausführung und Nachbehandlung von Beton.
 * Regelt Nachbehandlungsklassen (NB 1 bis NB 4), Festigkeitsentwicklung (r-Wert)
 * und tabellarische Mindestnachbehandlungszeiten in Tagen.
 * 
 * Quelle: DIN 1045-3:2023-08 Tabelle NA.1 sowie DIN EN 13670:2011-03 Tabelle 4
 */

export interface NachbehandlungKlasseInfo {
  klasse: 'NB1' | 'NB2' | 'NB3' | 'NB4';
  zielFestigkeitProzent: number; // % von fck
  anwendungsbereich: string;
  expositionsklassen: string[];
  beschreibung: string;
}

export const NACHBEHANDLUNGSKLASSEN: Record<string, NachbehandlungKlasseInfo> = {
  'NB1': {
    klasse: 'NB1',
    zielFestigkeitProzent: 0,
    anwendungsbereich: 'Nur für X0 und XC1 in geschlossenen Räumen.',
    expositionsklassen: ['X0', 'XC1'],
    beschreibung: 'Mindestdauer 12 Stunden (0,5 Tage), sofern das Erstarren nicht länger als 5 h dauert und die Oberflächentemperatur >= 5 °C beträgt.'
  },
  'NB2': {
    klasse: 'NB2',
    zielFestigkeitProzent: 35, // bzw. 50 % nach DBV
    anwendungsbereich: 'Standard für XC2 bis XC4, XF1.',
    expositionsklassen: ['XC2', 'XC3', 'XC4', 'XF1'],
    beschreibung: 'Erreichen von mind. 35 % der charakteristischen Druckfestigkeit f_ck an der Betonoberfläche.'
  },
  'NB3': {
    klasse: 'NB3',
    zielFestigkeitProzent: 50,
    anwendungsbereich: 'Für XD, XS, XF2 bis XF4, XA, XM.',
    expositionsklassen: ['XD1', 'XD2', 'XD3', 'XS1', 'XS2', 'XS3', 'XF2', 'XF3', 'XF4', 'XA1', 'XA2', 'XA3', 'XM1'],
    beschreibung: 'Erreichen von mind. 50 % der charakteristischen Druckfestigkeit f_ck; schützt die Randzone vor chlorid- und frostinduzierten Schäden.'
  },
  'NB4': {
    klasse: 'NB4',
    zielFestigkeitProzent: 70,
    anwendungsbereich: 'Für schwere Verschleißbeanspruchung XM2, XM3 sowie hochbeanspruchte Schutzschichten.',
    expositionsklassen: ['XM2', 'XM3'],
    beschreibung: 'Erreichen von mind. 70 % der charakteristischen Druckfestigkeit f_ck für maximale Gefügedichte und Abriebfestigkeit.'
  }
};

export type FestigkeitsentwicklungsGeschwindigkeit = 'schnell' | 'mittel' | 'langsam' | 'sehr_langsam';

export interface FestigkeitsentwicklungsInfo {
  typ: FestigkeitsentwicklungsGeschwindigkeit;
  rMin: number; // r = fcm,2 / fcm,28
  rMax: number;
  typischeZemente: string;
  beschreibung: string;
}

export const FESTIGKEITSENTWICKLUNG: Record<FestigkeitsentwicklungsGeschwindigkeit, FestigkeitsentwicklungsInfo> = {
  'schnell': {
    typ: 'schnell',
    rMin: 0.50,
    rMax: Infinity,
    typischeZemente: 'CEM I 42,5 R, CEM I 52,5 R',
    beschreibung: 'Sehr rascher Festigkeitsanstieg in den ersten 48 Stunden. Kurze Ausschal- und Nachbehandlungszeiten möglich.'
  },
  'mittel': {
    typ: 'mittel',
    rMin: 0.30,
    rMax: 0.499,
    typischeZemente: 'CEM I 42,5 N, CEM II/A-LL 42,5 N, CEM II/B-S 42,5 N',
    beschreibung: 'Normale Hydratationsgeschwindigkeit. Standard im mitteleuropäischen Hochbau.'
  },
  'langsam': {
    typ: 'langsam',
    rMin: 0.15,
    rMax: 0.299,
    typischeZemente: 'CEM III/A 32,5 N, CEM II/B-M 32,5 R, Flugaschebeton',
    beschreibung: 'Verzögerte Wärme- und Festigkeitsentwicklung. Verlängerte Feuchthaltung zwingend erforderlich.'
  },
  'sehr_langsam': {
    typ: 'sehr_langsam',
    rMin: 0.0,
    rMax: 0.149,
    typischeZemente: 'CEM III/B 32,5 N-LH/SR, CEM III/C',
    beschreibung: 'Extrem langsame Nacherhärtung bei minimaler Hydratationswärme. Maximale Nachbehandlungsfristen.'
  }
};

/**
 * Tabellarische Mindestdauer der Nachbehandlung in Tagen nach DIN 1045-3:2023-08 Tab. NA.1
 * für Nachbehandlungsklasse NB 2 (Erreichen von 35 % fck).
 * 
 * Hinweis: Für NB 3 bzw. NB 4 gelten Verlängerungsfaktoren oder rechnerische Reifemodelle.
 */
export const MINDESTDAUER_TAGE_NB2: Record<'ge25' | '15_25' | '10_15' | '5_10', Record<FestigkeitsentwicklungsGeschwindigkeit, number>> = {
  ge25: {
    schnell: 1,
    mittel: 2,
    langsam: 2,
    sehr_langsam: 3
  },
  '15_25': {
    schnell: 1,
    mittel: 2,
    langsam: 4,
    sehr_langsam: 5
  },
  '10_15': {
    schnell: 2,
    mittel: 4,
    langsam: 7,
    sehr_langsam: 10
  },
  '5_10': {
    schnell: 3,
    mittel: 6,
    langsam: 10,
    sehr_langsam: 15
  }
};

/**
 * Ermittelt die maßgebende Nachbehandlungsklasse für eine Liste von Expositionsklassen.
 */
export function getMassgebendeNachbehandlungsklasse(klassen: string[]): 'NB1' | 'NB2' | 'NB3' | 'NB4' {
  if (klassen.some(k => ['XM2', 'XM3'].includes(k))) return 'NB4';
  if (klassen.some(k => k.startsWith('XD') || k.startsWith('XS') || ['XF2', 'XF3', 'XF4', 'XA1', 'XA2', 'XA3', 'XM1'].includes(k))) return 'NB3';
  if (klassen.some(k => ['XC2', 'XC3', 'XC4', 'XF1'].includes(k))) return 'NB2';
  return 'NB1';
}

/**
 * Ermittelt die Festigkeitsentwicklungsklasse aus dem r-Wert (fcm,2 / fcm,28).
 */
export function getFestigkeitsentwicklungsTyp(r: number): FestigkeitsentwicklungsGeschwindigkeit {
  if (r >= 0.50) return 'schnell';
  if (r >= 0.30) return 'mittel';
  if (r >= 0.15) return 'langsam';
  return 'sehr_langsam';
}
