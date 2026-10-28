/**
 * Rechenkern Lehm-Schätzmodell Stampflehm (Umsetzung 29.10.2026, T5-LE-1), Formeln unverändert aus src/modules/Lehm.tsx.
 * LEHRMODELL – keine Normwerte, keine Quelle für die Koeffizienten; es zeigt nur die Tendenzen
 * (mehr Ton → fester, schwindet stärker, puffert mehr Feuchte; mehr Sand → dichter). Mit p_T, p_S als Massenanteilen in %:
 *  - Trockenrohdichte ρ = 1700 + 5·p_S − 2·p_T in kg/m³
 *  - Druckfestigkeit f = 1,0 + 3,0·p_T/100 − 2,0·w/100 in N/mm²
 *  - lineares Schwindmaß s = 4,0·p_T/100 + 2,0·w/100 in %
 *  - Wärmeleitfähigkeit λ = 0,15 + 0,0004·ρ in W/(mK)
 *  - Feuchtepuffer-Kennzahl 0,8·p_T in g/m² (ohne Zeitbezug; die Sorptionsklassen nach DIN 18947 beziehen sich auf
 *    Zeitstufen bis 12 h und sind am Produkt zu prüfen)
 * Geändert: Die stillen Untergrenzen (ρ ≥ 1200, f ≥ 0,5, s ≥ 0,1) entfallen. Sie wirkten im Reglerbereich nie;
 * außerhalb des Kalibrierbereichs warnt der Kern stattdessen. Reiner Rechenkern – geprüft in tests/lehm.test.ts.
 */
import { type Hinweis, istEndlich, hatFehler, muss, bereich } from './plausibilitaet';

/** Bereich der Regler im Modul (Teile bzw. % Herstellfeuchte), in dem das Lehrmodell gezeigt wird */
export const LEHM_MODELLBEREICH = { tonProzent: [3, 60], sandProzent: [15, 85], wasserProzent: [5, 25] } as const;

export interface LehmEingabe { ton: number; schluff: number; sand: number; /** Herstellfeuchte in M.-% */ wasser: number }
export interface LehmErgebnis {
  tonProzent: number; schluffProzent: number; sandProzent: number;
  rohdichte: number; druckfestigkeit: number; schwinden: number; lambda: number; sorption: number;
  gueltig: boolean; hinweise: Hinweis[];
}

export function lehmSchaetzmodell(e: LehmEingabe): LehmErgebnis {
  const h: Hinweis[] = [];
  muss(h, istEndlich(e.ton, e.schluff, e.sand, e.wasser), 'eingabe', 'Alle Anteile müssen Zahlen sein.');
  muss(h, e.ton >= 0 && e.schluff >= 0 && e.sand >= 0 && e.ton + e.schluff + e.sand > 0, 'anteile', 'Die Anteile dürfen nicht negativ sein, ihre Summe muss größer als 0 sein.');
  muss(h, e.wasser >= 0 && e.wasser < 100, 'wasser', 'Die Herstellfeuchte muss zwischen 0 und 100 % liegen.');
  if (hatFehler(h)) {
    return { tonProzent: NaN, schluffProzent: NaN, sandProzent: NaN, rohdichte: NaN, druckfestigkeit: NaN, schwinden: NaN, lambda: NaN, sorption: NaN, gueltig: false, hinweise: h };
  }
  const summe = e.ton + e.schluff + e.sand;
  const pT = (e.ton / summe) * 100, pU = (e.schluff / summe) * 100, pS = (e.sand / summe) * 100;
  const rohdichte = 1700 + pS * 5 - pT * 2;
  const druckfestigkeit = 1.0 + (pT / 100) * 3.0 - (e.wasser / 100) * 2.0;
  const schwinden = (pT / 100) * 4.0 + (e.wasser / 100) * 2.0;
  const lambda = 0.15 + 0.0004 * rohdichte;
  const sorption = pT * 0.8;
  const B = LEHM_MODELLBEREICH;
  bereich(h, 'ton', pT, B.tonProzent[0], B.tonProzent[1], 'Tonanteil außerhalb des Bereichs, für den das Lehrmodell gedacht ist.');
  bereich(h, 'sand', pS, B.sandProzent[0], B.sandProzent[1], 'Sand-/Kiesanteil außerhalb des Bereichs, für den das Lehrmodell gedacht ist.');
  bereich(h, 'wasser', e.wasser, B.wasserProzent[0], B.wasserProzent[1], 'Herstellfeuchte außerhalb 5 … 25 %: Lehrmodell nicht anwendbar.');
  h.push({ stufe: 'warnung', feld: 'modell', text: 'Lehrmodell ohne Normbezug: Für Stampflehm nennt die Fachliteratur Druckfestigkeiten von etwa 2 bis 4 N/mm²; Bemessungswerte nur nach DIN 18940 und Prüfung am Baustoff.' });
  return { tonProzent: pT, schluffProzent: pU, sandProzent: pS, rohdichte, druckfestigkeit, schwinden, lambda, sorption, gueltig: true, hinweise: h };
}
