/**
 * Rechenkern Keramik und Ziegel (AP 3.13).
 *
 * 1. Wasseraufnahme, Rohdichte und Porosität aus drei Wägungen nach dem Prinzip der
 *    DIN EN ISO 10545-3:2018-06 (Kochverfahren E_b):
 *      m_t … Trockenmasse, m_n … Masse nach Wassersättigung (oberflächentrocken), m_a … Masse unter Wasser
 *      E_b = (m_n − m_t)/m_t · 100 %        V = (m_n − m_a)/ρ_w
 *      ρ_roh = m_t/V                         P_offen = (m_n − m_t)/(m_n − m_a) · 100 %
 *      P_ges = (1 − ρ_roh/ρ_rein) · 100 %   (nur mit Reindichte)
 * 2. Gruppe keramischer Fliesen nach DIN EN 14411:2016-12 aus E_b und Formgebung
 *    (A stranggepresst, B trockengepresst): Ia ≤ 0,5 %, Ib 0,5–3 %, IIa 3–6 %, IIb 6–10 %, III > 10 %.
 * 3. Schwindmaß und Formmaß (Trocken- und Brennschwindung, bezogen auf die Ausgangslänge).
 * Reiner Rechenkern – geprüft in tests/keramik.test.ts.
 */
import { type Hinweis, istEndlich, hatFehler, nurGueltig, KEINE_KLASSE, type KeineKlasse } from './plausibilitaet';

export type Formgebung = 'A' | 'B';
export type FliesenGruppe = 'AIa' | 'AIb' | 'AIIa' | 'AIIb' | 'AIII' | 'BIa' | 'BIb' | 'BIIa' | 'BIIb' | 'BIII' | KeineKlasse;

/** Gruppengrenzen der Wasseraufnahme E_b in % nach DIN EN 14411:2016-12 (Obergrenzen, jeweils einschließlich) */
export const EB_GRENZEN = [
  { teil: 'Ia', bis: 0.5 },
  { teil: 'Ib', bis: 3 },
  { teil: 'IIa', bis: 6 },
  { teil: 'IIb', bis: 10 },
] as const;

/** Toleranz gegen Rundungsfehler an den Klassengrenzen (z. B. 3,0000000001 %) */
const EPS = 1e-9;

/** Gruppe nach DIN EN 14411 aus der Wasseraufnahme E_b in %. */
export function fliesenGruppe(ebProzent: number, formgebung: Formgebung): FliesenGruppe {
  if (!Number.isFinite(ebProzent)) return KEINE_KLASSE; // F-1 (02.11.2026): keine Zahl → keine Klasse
  const teil = EB_GRENZEN.find(g => ebProzent <= g.bis + EPS)?.teil ?? 'III';
  return `${formgebung}${teil}` as FliesenGruppe;
}

/** Einordnung des Scherbens (Lehrschema dicht/porös); Bezeichnungen für trockengepresste Fliesen. */
export function scherbenTyp(ebProzent: number, formgebung: Formgebung): string {
  if (!Number.isFinite(ebProzent)) return KEINE_KLASSE; // F-1 (02.11.2026): keine Zahl → keine Klasse
  if (ebProzent <= 0.5 + EPS) return formgebung === 'B' ? 'dicht gesintert (Feinsteinzeug)' : 'dicht gesintert';
  if (ebProzent <= 3 + EPS) return formgebung === 'B' ? 'dicht (Steinzeug)' : 'dicht (Spaltplatte, Klinkerplatte)';
  if (ebProzent <= 10 + EPS) return 'halbdicht bis porös';
  return formgebung === 'B' ? 'porös (Steingut, glasierte Wandfliese)' : 'porös (Cottoplatte)';
}

export interface KeramikEingabe {
  /** Trockenmasse m_t in g */
  mt: number;
  /** Masse nach Wassersättigung m_n in g (oberflächentrocken abgetupft) */
  mn: number;
  /** Masse unter Wasser m_a in g (Unterwasserwägung); optional */
  ma?: number;
  /** Reindichte des Scherbens in g/cm³; optional */
  rhoRein?: number;
  formgebung: Formgebung;
  /** Dichte des Wassers in g/cm³ (Standard 1,0) */
  rhoW?: number;
}

export interface KeramikErgebnis {
  /** Wasseraufnahme E_b in % */
  eb: number;
  gruppe: FliesenGruppe | null;
  scherben: string;
  /** Volumen in cm³ (NaN ohne Unterwasserwägung) */
  volumen: number;
  /** Rohdichte in g/cm³ */
  rhoRoh: number;
  /** offene (wasserzugängliche) Porosität in % */
  pOffen: number;
  /** Gesamtporosität in % (NaN ohne Reindichte) */
  pGes: number;
  gueltig: boolean;
  hinweise: Hinweis[];
}

export function keramikKennwerte(e: KeramikEingabe): KeramikErgebnis {
  const hinweise: Hinweis[] = [];
  const rhoW = e.rhoW ?? 1.0;
  const mitMa = e.ma !== undefined && e.ma !== null;
  const mitRein = e.rhoRein !== undefined && e.rhoRein !== null;
  const leer: KeramikErgebnis = { eb: NaN, gruppe: KEINE_KLASSE, scherben: KEINE_KLASSE, volumen: NaN, rhoRoh: NaN, pOffen: NaN, pGes: NaN, gueltig: false, hinweise };

  if (!istEndlich(e.mt, e.mn) || e.mt <= 0 || e.mn <= 0) hinweise.push({ stufe: 'fehler', feld: 'mt', text: 'Trocken- und Nassmasse müssen endliche Werte größer als 0 sein.' });
  else if (e.mn < e.mt) hinweise.push({ stufe: 'fehler', feld: 'mn', text: 'Die Masse nach Wassersättigung m_n kann nicht kleiner als die Trockenmasse m_t sein.' });
  if (mitMa && !istEndlich(e.ma as number)) hinweise.push({ stufe: 'fehler', feld: 'ma', text: 'Die Masse unter Wasser m_a muss ein endlicher Wert sein.' });
  if (!istEndlich(rhoW) || rhoW <= 0) hinweise.push({ stufe: 'fehler', feld: 'rhoW', text: 'Die Dichte des Wassers muss größer als 0 sein.' });
  if (mitRein && (!istEndlich(e.rhoRein as number) || (e.rhoRein as number) <= 0)) hinweise.push({ stufe: 'fehler', feld: 'rhoRein', text: 'Die Reindichte muss größer als 0 sein.' });
  if (hatFehler(hinweise)) return nurGueltig(leer);

  const eb = (e.mn - e.mt) / e.mt * 100;
  let volumen = NaN, rhoRoh = NaN, pOffen = NaN, pGes = NaN;

  if (mitMa) {
    const ma = e.ma as number;
    if (ma >= e.mn) hinweise.push({ stufe: 'fehler', feld: 'ma', text: 'Die Masse unter Wasser m_a muss kleiner als die Nassmasse m_n sein (Auftrieb).' });
    else if (ma >= e.mt) hinweise.push({ stufe: 'fehler', feld: 'ma', text: 'Mit m_a ≥ m_t wäre das offene Porenvolumen größer als das Gesamtvolumen – Wägungen prüfen.' });
    if (hatFehler(hinweise)) return nurGueltig(leer);
    volumen = (e.mn - ma) / rhoW;
    rhoRoh = e.mt / volumen;
    pOffen = (e.mn - e.mt) / (e.mn - ma) * 100;
    if (mitRein) {
      pGes = (1 - rhoRoh / (e.rhoRein as number)) * 100;
      if (pGes < 0) hinweise.push({ stufe: 'fehler', feld: 'rhoRein', text: 'Die Rohdichte übersteigt die Reindichte – Reindichte oder Wägungen prüfen.' });
      else if (pGes < pOffen - 0.5) hinweise.push({ stufe: 'warnung', feld: 'rhoRein', text: 'Die Gesamtporosität ist kleiner als die offene Porosität. Die angesetzte Reindichte ist vermutlich zu niedrig.' });
      if (hatFehler(hinweise)) return nurGueltig(leer);
      const r = e.rhoRein as number;
      if (r < 2.4 || r > 3.0) hinweise.push({ stufe: 'warnung', feld: 'rhoRein', text: 'Reindichten keramischer Scherben liegen üblicherweise bei etwa 2,5 bis 2,8 g/cm³.' });
    }
    if (rhoRoh < 1.2 || rhoRoh > 2.8) hinweise.push({ stufe: 'warnung', feld: 'rho', text: 'Die Rohdichte liegt außerhalb des für Ziegel- und Fliesenscherben üblichen Bereichs (etwa 1,2 bis 2,8 g/cm³).' });
  } else if (mitRein) {
    hinweise.push({ stufe: 'warnung', feld: 'ma', text: 'Ohne Unterwasserwägung m_a lassen sich Volumen, Rohdichte und Porositäten nicht bestimmen.' });
  }

  if (eb > 25) hinweise.push({ stufe: 'warnung', feld: 'mn', text: 'Wasseraufnahmen über 25 % sind für gebrannte Scherben ungewöhnlich hoch – Wägung und Sättigung prüfen.' });
  if (e.formgebung === 'B' && eb > 10 + EPS) hinweise.push({ stufe: 'warnung', feld: 'formgebung', text: 'Trockengepresste Fliesen der Gruppe BIII behandelt DIN EN 14411 nur in glasierter Ausführung (Wandfliesen).' });

  return nurGueltig({ eb, gruppe: fliesenGruppe(eb, e.formgebung), scherben: scherbenTyp(eb, e.formgebung), volumen, rhoRoh, pOffen, pGes, gueltig: true, hinweise }, ['gruppe', 'scherben']);
}

/** Lineares Schwindmaß s = (l_0 − l_1)/l_0 (dimensionslos). */
export const schwindmass = (l0: number, l1: number) => (l0 - l1) / l0;

/**
 * Formmaß des Rohlings für ein gewünschtes Fertigmaß:
 * l_0 = l_Brand / ((1 − s_T)·(1 − s_B)), s_T Trocken-, s_B Brennschwindung (jeweils auf die Länge vor dem Schritt bezogen).
 */
export function formmass(lFertig: number, sTrocken: number, sBrand: number): number {
  return lFertig / ((1 - sTrocken) * (1 - sBrand));
}
