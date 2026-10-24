/**
 * Biegebemessung Rechteckquerschnitt nach DIN EN 1992-1-1 + NA (DE),
 * Spannungsblock (λ = 0,8, η = 1,0 für ≤ C50/60), Dehnungsgrenze ξ_lim = 0,45 (NA DE 5.4.1).
 * Reiner Rechenkern ohne React – geprüft in tests/biegung.test.ts.
 */
import { EC2_NA_DE } from '../data/normParams';
import { fctmVonFck } from '../data/kennwerte';
import { formatDeWert, formatDeZahl } from '../utils/numberFormat';
import { type Hinweis, bereich, hatFehler, istEndlich, muss } from './plausibilitaet';

export type Bewehrung = 'Stahl' | 'Carbon' | 'GFK' | 'Basalt';

export interface BiegungEingabe {
  b: number;   // Breite [cm]
  h: number;   // Höhe [cm]
  d1: number;  // Achsabstand Zugbewehrung [cm]
  d2: number;  // Achsabstand Druckbewehrung [cm]
  med: number; // Bemessungsmoment [kNm]
  fck: number; // [MPa]
  bewehrung: Bewehrung;
  fyk: number; // Stahl [MPa]
  ftk: number; // nichtmetallisch [MPa]
  gammaFRP: number;
  /** E-Modul Betonstahl [MPa] */
  Es?: number;
  /** E-Modul der nichtmetallischen Bewehrung [MPa]; Standard: typische Werte, Zulassung maßgebend */
  Ef?: number;
}

export interface BiegungErgebnis {
  d: number; fcd: number; fyd: number; mu_Ed: number; omega: number;
  as1_req: number; as2_req: number; as_min: number; as_min_ec: number; mcr_kNm: number; as_final: number;
  x: number; sigma_s2: number;
  isPossible: boolean; message: string;
  hinweise: Hinweis[];
}

export const LAMBDA = 0.8;
export const XI_LIM = 0.45;
/** µ_Eds,lim für ξ_lim = 0,45 im Spannungsblock: ω_lim = λ·ξ_lim, µ = ω(1 − ω/2) */
export const MU_LIM_STAHL = LAMBDA * XI_LIM * (1 - (LAMBDA * XI_LIM) / 2);
export const MU_LIM_FRP = 0.25;
const EPS_CU3 = 3.5e-3;
/** Typische Zug-E-Moduln nichtmetallischer Stäbe [MPa]; maßgebend ist die bauaufsichtliche Zulassung. */
export const EF_TYPISCH: Readonly<Record<Exclude<Bewehrung, 'Stahl'>, number>> = { Carbon: 130000, GFK: 50000, Basalt: 55000 };

export function pruefeBiegung(e: BiegungEingabe): Hinweis[] {
  const h: Hinweis[] = [];
  muss(h, istEndlich(e.b, e.h, e.d1, e.d2, e.med, e.fck, e.fyk, e.ftk, e.gammaFRP), 'eingabe', 'Alle Eingaben müssen Zahlen sein.');
  if (hatFehler(h)) return h;
  muss(h, e.b > 0 && e.h > 0, 'b', 'Breite und Höhe müssen größer als 0 sein.');
  muss(h, e.d1 > 0 && e.d1 < e.h, 'd1', 'Der Achsabstand d₁ muss zwischen 0 und h liegen (statische Nutzhöhe d = h − d₁ > 0).');
  muss(h, e.d2 >= 0 && e.d2 < e.h - e.d1, 'd2', 'Der Achsabstand d₂ muss kleiner als die statische Nutzhöhe d sein, sonst liegt die Druckbewehrung nicht in der Druckzone.');
  muss(h, e.med >= 0, 'med', 'Das Bemessungsmoment muss ≥ 0 sein (Vorzeichen über die Lage der Zugseite abbilden).');
  muss(h, e.fck > 0, 'fck', 'f_ck muss größer als 0 sein.');
  muss(h, e.bewehrung === 'Stahl' ? e.fyk > 0 : e.ftk > 0 && e.gammaFRP > 0, 'fyk', 'Die Festigkeit der Bewehrung und γ müssen größer als 0 sein.');
  if (hatFehler(h)) return h;
  bereich(h, 'fck', e.fck, 12, 50, 'Der Spannungsblock mit λ = 0,8 und η = 1,0 gilt nur bis C50/60; für höhere Festigkeiten sind λ und η abzumindern.');
  bereich(h, 'd1', e.d1 / (e.h - e.d1), 0, 0.25, 'd₁ ist ungewöhnlich groß im Verhältnis zur Nutzhöhe – Bewehrungslage prüfen.');
  bereich(h, 'b', e.h / e.b, 0, 10, 'Sehr schlanker Querschnitt (h/b > 10): Kippen und Querschnittsform prüfen.');
  return h;
}

export function bemesseBiegung(e: BiegungEingabe): BiegungErgebnis {
  const hinweise = pruefeBiegung(e);
  const leer: BiegungErgebnis = {
    d: e.h - e.d1, fcd: 0, fyd: 0, mu_Ed: 0, omega: 0, as1_req: 0, as2_req: 0, as_min: 0, as_min_ec: 0,
    mcr_kNm: 0, as_final: 0, x: 0, sigma_s2: 0, isPossible: false, message: 'Eingaben unzulässig', hinweise,
  };
  if (hatFehler(hinweise)) return leer;

  const isStahl = e.bewehrung === 'Stahl';
  const Es = e.Es ?? 200000;
  const fcd = (EC2_NA_DE.alphaCC * e.fck) / EC2_NA_DE.gammaC;
  const fyd = isStahl ? e.fyk / EC2_NA_DE.gammaS : e.ftk / e.gammaFRP;
  const d = e.h - e.d1;
  const b_m = e.b / 100, d_m = d / 100, d2_m = e.d2 / 100;
  const fcd_kNm2 = fcd * 1000;
  const mu_Ed = e.med / (b_m * d_m * d_m * fcd_kNm2);
  const maxMu = isStahl ? MU_LIM_STAHL : MU_LIM_FRP;

  let omega = 0, as1_req = 0, as2_req = 0, x = 0, sigma_s2 = 0;
  let isPossible = true;
  let message = 'Bemessung erfolgreich';

  if (mu_Ed > maxMu) {
    if (isStahl) {
      omega = 1 - Math.sqrt(1 - 2 * maxMu);
      x = (omega * d) / LAMBDA;
      // Dehnung der Druckbewehrung aus ebenem Dehnungszustand: ε_s2 = ε_cu3 · (x − d2) / x
      const eps_s2 = (EPS_CU3 * (x - e.d2)) / x;
      sigma_s2 = Math.min(fyd, Es * eps_s2);
      if (sigma_s2 <= 0) {
        isPossible = false;
        message = 'Druckbewehrung liegt außerhalb der Druckzone – Querschnitt vergrößern';
        hinweise.push({ stufe: 'fehler', feld: 'd2', text: 'Mit d₂ ≥ x wirkt die Druckbewehrung nicht. Querschnitt vergrößern oder d₂ verkleinern.' });
      } else {
        message = 'Druckbewehrung erforderlich!';
        const m_max = maxMu * b_m * d_m * d_m * fcd_kNm2;
        const delta_m = e.med - m_max;
        as2_req = (delta_m / ((d_m - d2_m) * sigma_s2)) * 10;
        as1_req = omega * b_m * d_m * (fcd / fyd) * 10000 + as2_req * (sigma_s2 / fyd);
        if (sigma_s2 < fyd) {
          hinweise.push({ stufe: 'warnung', feld: 'd2', text: `Die Druckbewehrung fließt nicht (σ_s2 = ${formatDeWert(Math.round(sigma_s2))} N/mm² < f_yd); A_s2 ist entsprechend erhöht.` });
        }
        if (mu_Ed > 2 * maxMu) {
          hinweise.push({ stufe: 'warnung', feld: 'med', text: 'Mehr als das Doppelte des Grenzmoments über Druckbewehrung – ein größerer Querschnitt ist wirtschaftlicher.' });
        }
      }
    } else {
      isPossible = false;
      message = 'Druckzone versagt (Querschnittsvergrößerung erforderlich)';
    }
  } else if (isStahl) {
    omega = 1 - Math.sqrt(1 - 2 * mu_Ed);
    as1_req = omega * b_m * d_m * (fcd / fyd) * 10000;
    x = (omega * d) / LAMBDA;
  } else {
    // Nichtmetallische Bewehrung: linear-elastisch bis zum Bruch, kein Fließplateau.
    // Druckzonenhöhe aus dem Momentengleichgewicht (Spannungsblock), Bewehrungsspannung aus
    // dem ebenen Dehnungszustand: σ_f = min(E_f · ε_cu3 · (d − x)/x ; f_fd).
    omega = 1 - Math.sqrt(1 - 2 * mu_Ed);
    x = (omega * d) / LAMBDA;
    const Ef = e.Ef ?? EF_TYPISCH[e.bewehrung as Exclude<Bewehrung, 'Stahl'>];
    const sigma_f = Math.min(Ef * EPS_CU3 * (d - x) / x, fyd);
    as1_req = omega * b_m * d_m * (fcd / sigma_f) * 10000;
    if (sigma_f >= fyd) {
      hinweise.push({ stufe: 'warnung', feld: 'bewehrung', text: 'Die Bewehrung erreicht ihre Bemessungsfestigkeit, bevor der Beton versagt (sprödes Zugversagen ohne Ankündigung). Mehr Bewehrung oder ein größerer Querschnitt ist vorzuziehen.' });
    }
    hinweise.push({ stufe: 'warnung', feld: 'bewehrung', text: `Vereinfachter linear-elastischer Ansatz mit E_f = ${formatDeWert(Ef)} N/mm². Für die Ausführung gelten die allgemeine bauaufsichtliche Zulassung bzw. die DAfStb-Richtlinie für nichtmetallische Bewehrung.` });
  }

  // Mindestbewehrung NA DE (Robustheit): A_s,min = M_cr / (f_yk · z), M_cr = f_ctm · b · h² / 6, z = 0,9 d
  const fctm = fctmVonFck(e.fck);
  const mcr_Nmm = (fctm * e.b * 10 * Math.pow(e.h * 10, 2)) / 6;
  const fBew = isStahl ? e.fyk : e.ftk;
  const as_min = mcr_Nmm / (fBew * 0.9 * d * 10) / 100;
  const as_min_ec = 0.26 * (fctm / fBew) * e.b * d;
  const as_final = isPossible ? Math.max(as1_req, as_min) : 0;
  const as_max = 0.04 * e.b * e.h; // NA DE 9.2.1.1(3): A_s,max = 0,04 · A_c (außerhalb von Stößen)
  if (isPossible && as_final + as2_req > as_max) {
    hinweise.push({ stufe: 'warnung', feld: 'med', text: `Die Gesamtbewehrung ${formatDeZahl(as_final + as2_req, 1)} cm² überschreitet A_s,max = 0,04 · A_c = ${formatDeZahl(as_max, 1)} cm². Querschnitt vergrößern.` });
  }

  const ergebnis: BiegungErgebnis = {
    d, fcd, fyd, mu_Ed, omega, as1_req, as2_req, as_min, as_min_ec, mcr_kNm: mcr_Nmm / 1e6,
    as_final, x, sigma_s2, isPossible, message, hinweise,
  };
  if (isPossible && !istEndlich(as_final, x, mu_Ed)) {
    hinweise.push({ stufe: 'fehler', feld: 'eingabe', text: 'Die Berechnung liefert keinen endlichen Wert – Eingaben prüfen.' });
    return { ...leer, hinweise };
  }
  return ergebnis;
}
