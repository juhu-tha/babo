/**
 * Summenbewertung PFAS-20 und PFAS-4 gegen die Grenzwerte der Trinkwasserverordnung (AP 6.2 d, Modul „PFAS in Baustoffen“).
 *
 *   Σ PFAS-20 = Σ c_i über die 20 Perfluoralkylcarbon- und -sulfonsäuren C4–C13   Grenzwert 0,1 µg/l = 100 ng/l (ab 12.01.2026)
 *   Σ PFAS-4  = c_PFOA + c_PFNA + c_PFHxS + c_PFOS                                  Grenzwert 0,02 µg/l = 20 ng/l (ab 12.01.2028)
 *   Ausschöpfung η = Σ / Grenzwert
 *
 * Werte unter der Bestimmungsgrenze (BG) werden wahlweise mit 0 (untere Schranke), BG/2 oder BG (obere Schranke)
 * angesetzt. Der Rechner gibt zusätzlich beide Schranken aus; liegt der Grenzwert dazwischen, ist die Bewertung
 * nicht eindeutig. Maßgebend für die Bewertung einer Probe sind die Vorgaben der TrinkwV und des Labors.
 * Reiner Rechenkern – geprüft in tests/pfas.test.ts.
 */
import { type Hinweis, istEndlich, muss, hatFehler, nurGueltig } from './plausibilitaet';
import { pfasIstKurzkettig } from '../data/klassengrenzen';

/** Die 20 PFAS der Summe „PFAS-20“ (TrinkwV Anlage 2 Teil I, entspricht Richtlinie (EU) 2020/2184) */
export const PFAS20 = [
  { id: 'PFBA', name: 'Perfluorbutansäure', c: 4, gruppe: 'Carbonsäure' },
  { id: 'PFPeA', name: 'Perfluorpentansäure', c: 5, gruppe: 'Carbonsäure' },
  { id: 'PFHxA', name: 'Perfluorhexansäure', c: 6, gruppe: 'Carbonsäure' },
  { id: 'PFHpA', name: 'Perfluorheptansäure', c: 7, gruppe: 'Carbonsäure' },
  { id: 'PFOA', name: 'Perfluoroctansäure', c: 8, gruppe: 'Carbonsäure' },
  { id: 'PFNA', name: 'Perfluornonansäure', c: 9, gruppe: 'Carbonsäure' },
  { id: 'PFDA', name: 'Perfluordecansäure', c: 10, gruppe: 'Carbonsäure' },
  { id: 'PFUnDA', name: 'Perfluorundecansäure', c: 11, gruppe: 'Carbonsäure' },
  { id: 'PFDoDA', name: 'Perfluordodecansäure', c: 12, gruppe: 'Carbonsäure' },
  { id: 'PFTrDA', name: 'Perfluortridecansäure', c: 13, gruppe: 'Carbonsäure' },
  { id: 'PFBS', name: 'Perfluorbutansulfonsäure', c: 4, gruppe: 'Sulfonsäure' },
  { id: 'PFPeS', name: 'Perfluorpentansulfonsäure', c: 5, gruppe: 'Sulfonsäure' },
  { id: 'PFHxS', name: 'Perfluorhexansulfonsäure', c: 6, gruppe: 'Sulfonsäure' },
  { id: 'PFHpS', name: 'Perfluorheptansulfonsäure', c: 7, gruppe: 'Sulfonsäure' },
  { id: 'PFOS', name: 'Perfluoroctansulfonsäure', c: 8, gruppe: 'Sulfonsäure' },
  { id: 'PFNS', name: 'Perfluornonansulfonsäure', c: 9, gruppe: 'Sulfonsäure' },
  { id: 'PFDS', name: 'Perfluordecansulfonsäure', c: 10, gruppe: 'Sulfonsäure' },
  { id: 'PFUnDS', name: 'Perfluorundecansulfonsäure', c: 11, gruppe: 'Sulfonsäure' },
  { id: 'PFDoDS', name: 'Perfluordodecansulfonsäure', c: 12, gruppe: 'Sulfonsäure' },
  { id: 'PFTrDS', name: 'Perfluortridecansulfonsäure', c: 13, gruppe: 'Sulfonsäure' },
] as const;
export type PfasId = (typeof PFAS20)[number]['id'];

/** Die vier Stoffe der Summe „PFAS-4“ */
export const PFAS4: readonly PfasId[] = ['PFOA', 'PFNA', 'PFHxS', 'PFOS'];

/** Grenzwerte TrinkwV Anlage 2 Teil I [ng/l] */
export const PFAS_GRENZWERTE = {
  /** Summe PFAS-20: 0,1 µg/l, gilt ab 12.01.2026 */
  pfas20: 100,
  /** Summe PFAS-4: 0,02 µg/l, gilt ab 12.01.2028 */
  pfas4: 20,
} as const;

export type BgAnsatz = 'null' | 'halb' | 'voll';

export interface PfasEingabe {
  /** Messwerte [ng/l]; null = kleiner Bestimmungsgrenze */
  werte: Readonly<Partial<Record<PfasId, number | null>>>;
  /** Bestimmungsgrenze je Einzelstoff [ng/l] */
  bg: number;
  /** Ansatz der Werte < BG */
  ansatz: BgAnsatz;
}

export interface PfasSumme {
  /** Summe mit gewähltem Ansatz [ng/l] */
  summe: number;
  /** untere Schranke (< BG = 0) [ng/l] */
  unten: number;
  /** obere Schranke (< BG = BG) [ng/l] */
  oben: number;
  grenzwert: number;
  /** Ausschöpfung Summe / Grenzwert [-] */
  eta: number;
  ok: boolean;
  /** Grenzwert liegt zwischen unterer und oberer Schranke */
  uneindeutig: boolean;
  /** Anzahl Stoffe < BG */
  nKleinerBg: number;
}

export interface PfasErgebnis {
  pfas20: PfasSumme;
  pfas4: PfasSumme;
  /** Anteil kurzkettiger PFAS (Carbonsäuren C4–C7, Sulfonsäuren C4–C5) an der Summe PFAS-20 [-] */
  anteilKurzkettig: number;
  hinweise: Hinweis[];
}

const LEERE_SUMME = (grenzwert: number): PfasSumme => ({ summe: NaN, unten: NaN, oben: NaN, grenzwert, eta: NaN, ok: false, uneindeutig: false, nKleinerBg: 0 });
const LEER = (hinweise: Hinweis[]): PfasErgebnis => nurGueltig(({ pfas20: LEERE_SUMME(PFAS_GRENZWERTE.pfas20), pfas4: LEERE_SUMME(PFAS_GRENZWERTE.pfas4), anteilKurzkettig: NaN, hinweise }));

/**
 * Kurzkettig nach OECD (2013) bzw. UBA (PFAS-Portal): Perfluorcarbonsäuren bis C7 (PFBA–PFHpA, weniger als sieben
 * perfluorierte C-Atome), Perfluorsulfonsäuren nur bis C5 (PFBS, PFPeS; weniger als sechs C-Atome). PFHxS und PFHpS
 * sind langkettige Sulfonsäuren (PFHxS ist POP und Teil von PFAS-4). Nachstichprobe 5c 02.11.2026, NS5C-PF-1;
 * vorher wurden die Sulfonsäuren bis C7 als kurzkettig gezählt.
 */
export function istKurzkettig(s: { c: number; gruppe: string }): boolean {
  // Grenze zentral in src/data/klassengrenzen.ts (PFAS_KETTENLAENGE, Gesamtgutachten 03.11.2026)
  return pfasIstKurzkettig(s);
}

/** Ersatzwert für „< BG“ */
export function ersatzwert(bg: number, ansatz: BgAnsatz): number {
  return ansatz === 'null' ? 0 : ansatz === 'halb' ? bg / 2 : bg;
}

function summiere(ids: readonly PfasId[], e: PfasEingabe, grenzwert: number): PfasSumme {
  let summe = 0, unten = 0, oben = 0, nKleinerBg = 0;
  for (const id of ids) {
    const w = e.werte[id];
    if (w === null || w === undefined) {
      nKleinerBg++;
      summe += ersatzwert(e.bg, e.ansatz);
      oben += e.bg;
    } else {
      summe += w; unten += w; oben += w;
    }
  }
  return { summe, unten, oben, grenzwert, eta: summe / grenzwert, ok: summe <= grenzwert, uneindeutig: unten <= grenzwert && oben > grenzwert, nKleinerBg };
}

export function pfasSummenbewertung(e: PfasEingabe): PfasErgebnis {
  const hinweise: Hinweis[] = [];
  const gemessen = PFAS20.map(s => e.werte[s.id]).filter((w): w is number => w !== null && w !== undefined);
  muss(hinweise, istEndlich(e.bg, ...gemessen), 'werte', 'Messwerte und Bestimmungsgrenze müssen Zahlen sein.');
  if (hatFehler(hinweise)) return LEER(hinweise);
  muss(hinweise, gemessen.every(w => w >= 0), 'werte', 'Konzentrationen dürfen nicht negativ sein.');
  muss(hinweise, e.bg > 0, 'bg', 'Die Bestimmungsgrenze muss größer als 0 sein.');
  if (hatFehler(hinweise)) return LEER(hinweise);

  const alle = PFAS20.map(s => s.id);
  const pfas20 = summiere(alle, e, PFAS_GRENZWERTE.pfas20);
  const pfas4 = summiere(PFAS4, e, PFAS_GRENZWERTE.pfas4);
  const kurz = summiere(PFAS20.filter(istKurzkettig).map(s => s.id), e, PFAS_GRENZWERTE.pfas20).summe;

  if (gemessen.some(w => w > 0 && w < e.bg)) warnung(hinweise, 'werte', 'Ein Messwert liegt unter der Bestimmungsgrenze – solche Werte als „< BG“ eintragen.');
  if (e.bg > 10) warnung(hinweise, 'bg', 'Bestimmungsgrenze über 10 ng/l (Lehrannahme): Für die Bewertung gegen 20 ng/l (PFAS-4) ist die Analytik zu unempfindlich.');
  if (pfas20.uneindeutig || pfas4.uneindeutig) warnung(hinweise, 'ansatz', 'Die Bewertung hängt vom Ansatz der Werte unter der Bestimmungsgrenze ab – empfindlichere Analytik oder Wiederholungsmessung.');
  if (gemessen.some(w => w > 10000)) warnung(hinweise, 'werte', 'Einzelwert über 10 µg/l: typisch für Sickerwasser oder Grundwasser an Löschschaum-Altlasten, nicht für Trinkwasser.');

  return nurGueltig({ pfas20, pfas4, anteilKurzkettig: pfas20.summe > 0 ? kurz / pfas20.summe : 0, hinweise });
}

function warnung(h: Hinweis[], feld: string, text: string) {
  h.push({ stufe: 'warnung', feld, text });
}
