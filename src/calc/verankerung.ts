/**
 * Verankerungs- und Übergreifungslänge von Betonstahl nach DIN EN 1992-1-1 + NA (DE), 8.4 und 8.7.
 * Entscheidungen T2-S-1/T2-S-2 vom 28.10.2026:
 *  - α₆ nach NA DE Tab. 8.3DE (Stoßanteil ≤ 33 % / > 33 %, Ø < 16 / ≥ 16 mm, lichter Stoßabstand und Randabstand)
 *    statt der EC2-Empfehlung (vorläufig, F-Freigabe: Werte nach Lehrbuchstand, Normtext nicht öffentlich).
 *  - Verankerung wahlweise in der vereinfachten NA-Form l_bd = α₁·α₄·α₅·l_b,rqd·A_s,erf/A_s,vorh mit α₅ = 2/3 bei
 *    direkter Lagerung (sonst 1,0) und Mindestwerten ohne 100 mm (vorläufig, F-Freigabe).
 * Reiner Rechenkern – geprüft in tests/verankerung.test.ts.
 */
import { EC2_NA_DE } from '../data/normParams';
import { betonNachFck, fctmVonFck } from '../data/kennwerte';
import { type Hinweis, bereich, hatFehler, istEndlich, muss } from './plausibilitaet';

export type Stossanteil = 'bis33' | 'ueber33';

export interface VerankerungEingabe {
  fck: number; fyk: number; phi: number; // [MPa], [mm]
  verbund: 'gut' | 'maessig';
  beanspruchung: 'zug' | 'druck';
  art: 'verankerung' | 'uebergreifung';
  form: 'gerade' | 'haken' | 'winkel';
  alpha2: number; alpha3: number; alpha5: number;
  /** Anteil der ohne Längsversatz gestoßenen Stäbe am Querschnitt einer Lage (Übergreifung); Standard > 33 % */
  stossanteil?: Stossanteil;
  /** lichter Abstand der Stöße ≥ 8·Ø und Randabstand c₁ ≥ 4·Ø (Fußnoten Tab. 8.3DE) */
  stossAbstandGross?: boolean;
  /** angeschweißte Querstäbe (α₄ = 0,7, Tab. 8.2) */
  querstab?: boolean;
  /** Nachweisform der Verankerung: EN-Form mit Tab. 8.2 oder vereinfachte NA-Form */
  verfahren?: 'en' | 'naVereinfacht';
  /** Lagerung am Endauflager (nur vereinfachte NA-Form): direkt → α₅ = 2/3 */
  lagerung?: 'direkt' | 'sonst';
  asErf: number; asVorh: number; // [cm²]
}

export interface VerankerungErgebnis {
  fctk005: number; fctd: number; fbd: number; lbRqd: number;
  alphaProduct: number; totalAlpha: number; a4: number; a5: number; a6: number; asRatio: number;
  lbMin: number; lbd: number; currentAlpha1: number;
  hinweise: Hinweis[];
}

/** α₆ nach DIN EN 1992-1-1/NA Tab. 8.3DE (vorläufig, F-Freigabe): Zugstöße ≤ 33 %: 1,2 (Ø < 16) / 1,4 (Ø ≥ 16);
 *  > 33 %: 1,4 / 2,0. Bei lichtem Stoßabstand ≥ 8Ø und Randabstand ≥ 4Ø: 1,0 bzw. 1,4 statt 2,0. Druckstöße: 1,0. */
export function alpha6NaDe(phi: number, stossanteil: Stossanteil, abstandGross: boolean, beanspruchung: 'zug' | 'druck'): number {
  if (beanspruchung === 'druck') return 1.0;
  const gross = phi >= 16;
  if (stossanteil === 'bis33') return abstandGross ? 1.0 : gross ? 1.4 : 1.2;
  return gross ? (abstandGross ? 1.4 : 2.0) : abstandGross ? 1.0 : 1.4;
}

export function pruefeVerankerung(e: VerankerungEingabe): Hinweis[] {
  const h: Hinweis[] = [];
  muss(h, istEndlich(e.fck, e.fyk, e.phi, e.alpha2, e.alpha3, e.alpha5, e.asErf, e.asVorh), 'eingabe', 'Alle Eingaben müssen Zahlen sein.');
  if (hatFehler(h)) return h;
  muss(h, e.fck > 0 && e.fyk > 0, 'fck', 'Die Festigkeiten müssen größer als 0 sein.');
  muss(h, e.phi > 0, 'phi', 'Der Stabdurchmesser muss größer als 0 sein.');
  muss(h, e.asVorh > 0, 'asVorh', 'A_s,vorh muss größer als 0 sein.');
  muss(h, e.asErf >= 0, 'asErf', 'A_s,erf darf nicht negativ sein.');
  muss(h, [e.alpha2, e.alpha3, e.alpha5].every(a => a > 0), 'alpha', 'Die Beiwerte α müssen größer als 0 sein.');
  if (hatFehler(h)) return h;
  if (e.asErf > e.asVorh) h.push({ stufe: 'fehler', feld: 'asErf', text: 'A_s,erf ist größer als A_s,vorh – die Bewehrung reicht nicht aus. Erst die vorhandene Bewehrung erhöhen.' });
  const naForm = e.art === 'verankerung' && e.verfahren === 'naVereinfacht';
  if (!naForm) {
    bereich(h, 'alpha2', e.alpha2, 0.7, 1.0, 'α2 liegt nach Tabelle 8.2 zwischen 0,7 und 1,0.');
    bereich(h, 'alpha3', e.alpha3, 0.7, 1.0, 'α3 liegt nach Tabelle 8.2 zwischen 0,7 und 1,0.');
    bereich(h, 'alpha5', e.alpha5, 0.7, 1.0, 'α5 liegt nach Tabelle 8.2 zwischen 0,7 und 1,0.');
  } else {
    h.push({ stufe: 'warnung', feld: 'verfahren', text: 'Vereinfachte NA-Form mit α₅ = 2/3 bei direkter Lagerung und Mindestwerten ohne 100 mm: vorläufig, Bestätigung am Normtext (F-Freigabe) ausstehend.' });
  }
  if (e.art === 'uebergreifung') h.push({ stufe: 'warnung', feld: 'alpha6', text: 'α₆ nach NA DE Tab. 8.3DE: vorläufig, Bestätigung am Normtext (F-Freigabe) ausstehend.' });
  bereich(h, 'phi', e.phi, 6, 40, 'Stabdurchmesser außerhalb des üblichen Bereichs 6–40 mm.');
  if (e.fck > 60) h.push({ stufe: 'warnung', feld: 'fck', text: 'Oberhalb C60/75 wird f_ctd nach 8.4.2(2) auf den Wert für C60/75 begrenzt.' });
  return h;
}

export function bemesseVerankerung(e: VerankerungEingabe): VerankerungErgebnis {
  const hinweise = pruefeVerankerung(e);
  const leer: VerankerungErgebnis = {
    fctk005: 0, fctd: 0, fbd: 0, lbRqd: 0, alphaProduct: 0, totalAlpha: 0, a4: 0, a5: 0, a6: 0, asRatio: 0, lbMin: 0, lbd: 0, currentAlpha1: 0, hinweise,
  };
  if (hatFehler(hinweise)) return leer;

  // f_bd = 2,25·η1·η2·f_ctd (8.2); f_ctd = α_ct·f_ctk;0,05/γc mit α_ct = 1,0 (NA DE), f_ck ≤ 60 (8.4.2(2))
  const fckB = Math.min(e.fck, 60);
  const fctk005 = betonNachFck(fckB)?.fctk_005 ?? 0.7 * fctmVonFck(fckB); // Tab. 3.1, sonst 0,7·f_ctm
  const fctd = fctk005 / EC2_NA_DE.gammaC;
  const eta1 = e.verbund === 'gut' ? 1.0 : 0.7;
  const eta2 = e.phi <= 32 ? 1.0 : (132 - e.phi) / 100;
  const fbd = 2.25 * eta1 * eta2 * fctd;

  // l_b,rqd = (φ/4)·(σ_sd/f_bd) mit σ_sd = f_yd (8.3)
  const fyd = e.fyk / EC2_NA_DE.gammaS;
  const lbRqd = (e.phi / 4) * (fyd / fbd);

  const zug = e.beanspruchung === 'zug';
  const a1 = zug && e.form !== 'gerade' ? 0.7 : 1.0;
  const a4 = e.querstab && e.art === 'verankerung' ? 0.7 : 1.0; // Tab. 8.2: angeschweißte Querstäbe (Zug und Druck); in (8.10) kein α₄
  const naForm = e.art === 'verankerung' && e.verfahren === 'naVereinfacht';
  const direkt = naForm && e.lagerung === 'direkt';
  let a5: number, alphaProduct: number;
  if (naForm) {
    // vereinfachte NA-Form (vorläufig, F-Freigabe): α₂ = α₃ = 1; α₅ = 2/3 bei direkter Lagerung (nur Zug), sonst 1,0
    a5 = zug && direkt ? 2 / 3 : 1.0;
    alphaProduct = a1 * a4 * a5;
  } else {
    a5 = zug ? e.alpha5 : 1.0;
    const a235 = zug ? Math.max(0.7, e.alpha2 * e.alpha3 * e.alpha5) : 1.0; // (8.5): α2·α3·α5 ≥ 0,7
    alphaProduct = a1 * a4 * a235;
  }
  const a6 = e.art === 'uebergreifung' ? alpha6NaDe(e.phi, e.stossanteil ?? 'ueber33', e.stossAbstandGross ?? false, e.beanspruchung) : 1.0;
  const totalAlpha = alphaProduct * a6;
  const asRatio = e.asErf / e.asVorh;

  let lbMin: number;
  if (e.art === 'uebergreifung') {
    lbMin = Math.max(0.3 * a6 * lbRqd, 15 * e.phi, 200); // (8.11)
  } else if (naForm) {
    // NA-Form (vorläufig, F-Freigabe): Zug max(0,3·α₁·α₄·l_b,rqd; 10Ø), direkte Lagerung 6,7Ø statt 10Ø; Druck max(0,6·l_b,rqd; 10Ø)
    lbMin = zug ? Math.max(0.3 * a1 * a4 * lbRqd, (direkt ? 6.7 : 10) * e.phi) : Math.max(0.6 * lbRqd, 10 * e.phi);
  } else {
    lbMin = Math.max((zug ? 0.3 : 0.6) * lbRqd, 10 * e.phi, 100); // (8.6)/(8.7)
  }
  const lbd = Math.max(totalAlpha * lbRqd * asRatio, lbMin);

  return { fctk005, fctd, fbd, lbRqd, alphaProduct, totalAlpha, a4, a5, a6, asRatio, lbMin, lbd, currentAlpha1: a1, hinweise };
}
