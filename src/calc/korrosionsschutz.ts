/**
 * Korrosionsschutz von Stahl durch Zinküberzüge und Duplex-Systeme (AP 3.13).
 * Schutzdauer einer Zinkschicht als lineares Lehrmodell t = d_Zn / r_corr,Zn mit der Spannweite
 * der Zinkabtragsraten je Korrosivitätskategorie (DIN EN ISO 9223:2012-05, Tabelle 2; gleiche
 * Werte in DIN EN ISO 12944-2:2018-04, Tabelle 1, Korrosionsbelastung im ersten Jahr).
 * Duplex-System: t_D = f · (t_Zn + t_B) mit Synergiefaktor f (Literaturwert, nicht normativ).
 * Reiner Rechenkern – geprüft in tests/korrosionsschutz.test.ts.
 */
import { type Hinweis, istEndlich, muss, hatFehler, bereich } from './plausibilitaet';

export type Kategorie = 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'CX';
export type Schutzdauerklasse = 'L' | 'M' | 'H' | 'VH';

export interface KategorieDaten {
  stufe: string;
  /** Dickenabnahme Zink im ersten Jahr [µm/a]: [untere, obere Grenze] */
  zink: readonly [number, number];
  /** Dickenabnahme unlegierter Stahl im ersten Jahr [µm/a] */
  stahl: readonly [number, number];
  aussen: string;
  innen: string;
}

/** Korrosivitätskategorien nach DIN EN ISO 12944-2:2018-04, Tabelle 1 (Abtragsraten wie DIN EN ISO 9223:2012-05) */
export const KORROSIVITAET: Readonly<Record<Kategorie, KategorieDaten>> = {
  C1: { stufe: 'unbedeutend', zink: [0, 0.1], stahl: [0, 1.3], aussen: '–', innen: 'Beheizte Gebäude mit neutraler Atmosphäre, z. B. Büros, Läden, Schulen, Hotels' },
  C2: { stufe: 'gering', zink: [0.1, 0.7], stahl: [1.3, 25], aussen: 'Atmosphäre mit geringer Verunreinigung, überwiegend ländliche Bereiche', innen: 'Unbeheizte Gebäude mit möglicher Kondensation, z. B. Lager, Sporthallen' },
  C3: { stufe: 'mäßig', zink: [0.7, 2.1], stahl: [25, 50], aussen: 'Stadt- und Industrieatmosphäre mit mäßiger SO₂-Belastung; Küste mit geringer Salzbelastung', innen: 'Produktionsräume mit hoher Feuchte und etwas Verunreinigung, z. B. Brauereien, Wäschereien, Molkereien' },
  C4: { stufe: 'stark', zink: [2.1, 4.2], stahl: [50, 80], aussen: 'Industrielle Bereiche und Küstenbereiche mit mäßiger Salzbelastung', innen: 'Chemieanlagen, Schwimmbäder, Bootsschuppen über Meerwasser' },
  C5: { stufe: 'sehr stark', zink: [4.2, 8.4], stahl: [80, 200], aussen: 'Industrie mit hoher Feuchte und aggressiver Atmosphäre; Küste mit hoher Salzbelastung', innen: 'Gebäude oder Bereiche mit nahezu ständiger Kondensation und starker Verunreinigung' },
  CX: { stufe: 'extrem', zink: [8.4, 25], stahl: [200, 700], aussen: 'Offshore mit hoher Salzbelastung; Industrie mit extremer Feuchte; subtropische und tropische Atmosphäre', innen: 'Industriebereiche mit extremer Feuchte und aggressiver Atmosphäre' },
};
export const KATEGORIEN = Object.keys(KORROSIVITAET) as Kategorie[];

/** Schutzdauerklassen nach DIN EN ISO 12944-1:2019-01 (bis zur ersten Teilerneuerung) */
export const SCHUTZDAUER: Readonly<Record<Schutzdauerklasse, { name: string; von: number; bis: number | null; text: string }>> = {
  L: { name: 'niedrig', von: 0, bis: 7, text: 'bis 7 Jahre' },
  M: { name: 'mittel', von: 7, bis: 15, text: '7 bis 15 Jahre' },
  H: { name: 'hoch', von: 15, bis: 25, text: '15 bis 25 Jahre' },
  VH: { name: 'sehr hoch', von: 25, bis: null, text: 'mehr als 25 Jahre' },
};
export const KLASSEN: Schutzdauerklasse[] = ['L', 'M', 'H', 'VH'];

/** Schutzdauerklasse, in die eine Dauer t [a] fällt (Grenzwerte gehören zur unteren Klasse) */
export function schutzdauerklasse(t: number): Schutzdauerklasse {
  if (t <= 7) return 'L';
  if (t <= 15) return 'M';
  if (t <= 25) return 'H';
  return 'VH';
}

/** Mindestwerte der Zinküberzugsdicke nach DIN EN ISO 1461:2022-12, Tabelle 3 (Stahlteile, nicht geschleudert) */
export const ZINK_1461 = [
  { bereich: 'Stahl > 6 mm', oertlich: 70, mittel: 85 },
  { bereich: 'Stahl > 3 mm bis ≤ 6 mm', oertlich: 55, mittel: 70 },
  { bereich: 'Stahl ≥ 1,5 mm bis ≤ 3 mm', oertlich: 45, mittel: 55 },
  { bereich: 'Stahl < 1,5 mm', oertlich: 35, mittel: 45 },
] as const;

export function zinkMindestschicht(stahlDickeMm: number) {
  if (stahlDickeMm > 6) return ZINK_1461[0];
  if (stahlDickeMm > 3) return ZINK_1461[1];
  if (stahlDickeMm >= 1.5) return ZINK_1461[2];
  return ZINK_1461[3];
}

/** Synergiefaktor von Duplex-Systemen: Literaturspanne (Institut Feuerverzinken 2023: 1,2 bis 2; Fachliteratur bis 2,5) */
export const SYNERGIE_SPANNE = [1.2, 2.5] as const;

export interface ZinkEingabe {
  /** Zinkschichtdicke [µm] */
  dZn: number;
  kategorie: Kategorie;
  /** Gewünschte Schutzdauerklasse */
  ziel: Schutzdauerklasse;
  duplex: boolean;
  /** Schutzdauer der Beschichtung allein [a] (nur Duplex) */
  tBeschichtung: number;
  /** Synergiefaktor f [–] (nur Duplex) */
  synergie: number;
  /** Stahldicke [mm] für den Vergleich mit DIN EN ISO 1461 (optional) */
  stahlDickeMm?: number;
}

export type Bewertung = 'erfuellt' | 'grenzwertig' | 'nicht_erfuellt';

export interface ZinkErgebnis {
  gueltig: boolean;
  rMin: number; rMax: number;
  /** Schutzdauer der Zinkschicht bei oberer Abtragsrate (ungünstig) [a] */
  tMin: number;
  /** … bei unterer Abtragsrate (günstig) [a]; null = nach oben offen (C1) */
  tMax: number | null;
  /** Duplex-Schutzdauer ungünstig / günstig [a] (ohne Duplex = Zinkwerte) */
  tDuplexMin: number;
  tDuplexMax: number | null;
  /** Maßgebende (ungünstige) Schutzdauer [a] */
  tMassgebend: number;
  klasseUnguenstig: Schutzdauerklasse;
  klasseGuenstig: Schutzdauerklasse;
  bewertung: Bewertung;
  mindest1461?: { bereich: string; oertlich: number; mittel: number };
  hinweise: Hinweis[];
}

const rang = (k: Schutzdauerklasse) => KLASSEN.indexOf(k);

export function zinkSchutzdauer(e: ZinkEingabe): ZinkErgebnis {
  const hinweise: Hinweis[] = [];
  const kat = KORROSIVITAET[e.kategorie];
  muss(hinweise, !!kat && !!SCHUTZDAUER[e.ziel], 'kategorie', 'Unbekannte Korrosivitätskategorie oder Schutzdauerklasse.');
  muss(hinweise, istEndlich(e.dZn, e.tBeschichtung, e.synergie, e.stahlDickeMm ?? 0), 'eingabe', 'Alle Eingaben müssen Zahlen sein.');
  if (!hatFehler(hinweise)) {
    muss(hinweise, e.dZn > 0, 'dZn', 'Die Zinkschichtdicke muss größer als 0 µm sein.');
    if (e.duplex) {
      muss(hinweise, e.tBeschichtung >= 0, 'tBeschichtung', 'Die Schutzdauer der Beschichtung darf nicht negativ sein.');
      muss(hinweise, e.synergie > 0, 'synergie', 'Der Synergiefaktor muss größer als 0 sein.');
    }
    if (e.stahlDickeMm !== undefined) muss(hinweise, e.stahlDickeMm > 0, 'stahlDickeMm', 'Die Stahldicke muss größer als 0 mm sein.');
  }
  if (hatFehler(hinweise)) {
    return { gueltig: false, rMin: 0, rMax: 0, tMin: 0, tMax: null, tDuplexMin: 0, tDuplexMax: null, tMassgebend: 0, klasseUnguenstig: 'L', klasseGuenstig: 'L', bewertung: 'nicht_erfuellt', hinweise };
  }

  const [rMin, rMax] = kat.zink;
  const tMin = e.dZn / rMax;
  const tMax = rMin > 0 ? e.dZn / rMin : null;
  const f = e.duplex ? e.synergie : 1;
  const tB = e.duplex ? e.tBeschichtung : 0;
  const tDuplexMin = f * (tMin + tB);
  const tDuplexMax = tMax === null ? null : f * (tMax + tB);
  const tMassgebend = tDuplexMin;
  const klasseUnguenstig = schutzdauerklasse(tDuplexMin);
  const klasseGuenstig = tDuplexMax === null ? 'VH' : schutzdauerklasse(tDuplexMax);
  const bewertung: Bewertung = rang(klasseUnguenstig) >= rang(e.ziel) ? 'erfuellt'
    : rang(klasseGuenstig) >= rang(e.ziel) ? 'grenzwertig' : 'nicht_erfuellt';

  bereich(hinweise, 'dZn', e.dZn, 35, 250, 'Zinkschichtdicke außerhalb des für Stückverzinken üblichen Bereichs (etwa 35 bis 250 µm).');
  let mindest1461: ZinkErgebnis['mindest1461'];
  if (e.stahlDickeMm !== undefined) {
    mindest1461 = zinkMindestschicht(e.stahlDickeMm);
    if (e.dZn < mindest1461.mittel) hinweise.push({ stufe: 'warnung', feld: 'dZn', text: `Die Schichtdicke unterschreitet den Mindest-Durchschnittswert ${mindest1461.mittel} µm nach DIN EN ISO 1461 für ${mindest1461.bereich}.` });
  }
  if (e.duplex) {
    bereich(hinweise, 'synergie', e.synergie, SYNERGIE_SPANNE[0], SYNERGIE_SPANNE[1], 'Synergiefaktor außerhalb der Literaturspanne 1,2 bis 2,5; Werte unter 1 widersprechen dem Synergieeffekt.');
    bereich(hinweise, 'tBeschichtung', e.tBeschichtung, 0, 40, 'Schutzdauer der Beschichtung allein über 40 Jahre ist unüblich; Angabe prüfen.');
  }
  if (e.kategorie === 'CX') hinweise.push({ stufe: 'warnung', feld: 'kategorie', text: 'In CX streut der Zinkabtrag sehr stark (8,4 bis 25 µm/a); Zink allein reicht hier kaum, Systeme nach DIN EN ISO 12944-9 bzw. Einzelfallbetrachtung.' });

  return { gueltig: true, rMin, rMax, tMin, tMax, tDuplexMin, tDuplexMax, tMassgebend, klasseUnguenstig, klasseGuenstig, bewertung, mindest1461, hinweise };
}
