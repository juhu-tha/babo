/**
 * Durchstanznachweis Flachdecke an Einzelstütze nach DIN EN 1992-1-1 + NA (DE), 6.4. Fundamente und Bodenplatten (NA DE, 6.4.4(2):
 * abweichender Beiwert C_Rd,c, iterativ ermittelter Rundschnitt, Abzug der Bodenpressung) sind nicht abgebildet.
 * Stützenlage innen/Rand/Ecke (Entscheidung P-2 vom 28.10.2026): kritischer Rundschnitt u₁ nach EC2 Bild 6.15 (endet am
 * freien Rand; der kürzere von vollem und randnahem Rundschnitt ist maßgebend, 6.4.2(4)), β nach NA DE 6.4.3(6).
 * Vereinfachungen: konstanter Lasterhöhungsfaktor β, kein Abzug von Bodenpressung/Gegenlast, keine Öffnungen,
 * Bewehrungsabschätzung je Reihe ohne die erhöhten Faktoren κ_sw für die ersten Reihen (offener Prüfpunkt AP 4.4).
 * Reiner Rechenkern – geprüft in tests/durchstanzen.test.ts.
 */
import { EC2_NA_DE } from '../data/normParams';
import { fcdBeton } from '../data/kennwerte';
import { type Hinweis, bereich, hatFehler, istEndlich, muss } from './plausibilitaet';

export interface DurchstanzEingabe {
  form: 'rund' | 'rechteckig';
  vEd: number; // [kN]
  d: number;   // mittlere statische Nutzhöhe [mm]
  c: number;   // Durchmesser (rund) [mm]
  cx: number; cy: number; // Seitenlängen (rechteckig) [mm]
  fck: number; // [MPa]
  rhoL: number; // mittlerer Längsbewehrungsgrad [–]
  /** Lasterhöhungsfaktor; ohne Angabe der konstante Wert nach NA DE 6.4.3(6) für die Stützenlage (1,10 / 1,40 / 1,50) */
  beta?: number;
  fyk?: number; // Biegebewehrung, für die Begrenzung ρ_l ≤ 0,5·f_cd/f_yd
  /** Stützenlage; die Abminderung von C_Rd,c bei u0/d < 4 gilt nach NA DE nur für Innenstützen (Standard: innen) */
  lage?: 'innen' | 'rand' | 'ecke';
  /** Abstand der Stützenaußenkante vom freien Plattenrand [mm] (Rand-/Eckstütze; Standard 0 = bündig).
   *  Randstütze: Rand parallel zu c_x; Eckstütze: gleicher Abstand zu beiden Rändern. */
  aRand?: number;
}

/** Konstante Lasterhöhungsfaktoren nach NA DE 6.4.3(6) */
export function betaNaDe(lage: 'innen' | 'rand' | 'ecke'): number {
  return lage === 'ecke' ? EC2_NA_DE.betaEcke : lage === 'rand' ? EC2_NA_DE.betaRand : EC2_NA_DE.betaInnen;
}

/** Rundschnitte u₀ und u₁ [mm] je Stützenlage. u₁ randnah nach EC2 Bild 6.15 (Schnitt endet senkrecht am freien Rand),
 *  maßgebend der kürzere Wert aus vollem und randnahem Rundschnitt (6.4.2(4)); u₀ nach 6.4.5(3). */
export function rundschnitte(form: 'rund' | 'rechteckig', lage: 'innen' | 'rand' | 'ecke', d: number, c: number, cx: number, cy: number, aRand = 0): { u0: number; u1: number; u1Voll: number } {
  const rund = form === 'rund';
  const u0Voll = rund ? Math.PI * c : 2 * (cx + cy);
  const u1Voll = rund ? Math.PI * (c + 4 * d) : 2 * (cx + cy) + 4 * Math.PI * d;
  if (lage === 'innen') return { u0: u0Voll, u1: u1Voll, u1Voll };
  const c1 = rund ? c : cy; // senkrecht zum Rand
  const c2 = rund ? c : cx; // parallel zum Rand
  const R = c / 2 + 2 * d;
  let u1Rand: number, u0: number;
  if (lage === 'rand') {
    u1Rand = rund ? Math.PI * R + c + 2 * aRand : cx + 2 * (cy + aRand) + 2 * Math.PI * d;
    u0 = Math.min(c2 + 3 * d, c2 + 2 * c1);
  } else {
    u1Rand = rund ? (Math.PI * R) / 2 + c + 2 * aRand : cx + cy + 2 * aRand + Math.PI * d;
    u0 = Math.min(3 * d, c1 + c2);
  }
  return { u0: Math.min(u0, u0Voll), u1: Math.min(u1Rand, u1Voll), u1Voll };
}

export interface DurchstanzErgebnis {
  u0: number; u1: number; u1Voll: number; beta: number; u0_d: number; CRdc: number; rhoL_eff: number;
  vEd_stress: number; vRdc: number; vRdMax: number;
  needsReinforcement: boolean; isOverloaded: boolean; asw_req_ring: number;
  hinweise: Hinweis[];
}

export function pruefeDurchstanzen(e: DurchstanzEingabe): Hinweis[] {
  const h: Hinweis[] = [];
  muss(h, istEndlich(e.vEd, e.d, e.c, e.cx, e.cy, e.fck, e.rhoL, e.beta ?? 1.1, e.aRand ?? 0), 'eingabe', 'Alle Eingaben müssen Zahlen sein.');
  if (hatFehler(h)) return h;
  muss(h, e.d > 0, 'd', 'Die statische Nutzhöhe d muss größer als 0 sein.');
  muss(h, e.form === 'rund' ? e.c > 0 : e.cx > 0 && e.cy > 0, 'c', 'Die Stützenabmessungen müssen größer als 0 sein.');
  muss(h, e.vEd >= 0, 'vEd', 'V_Ed muss ≥ 0 sein.');
  muss(h, e.fck > 0, 'fck', 'f_ck muss größer als 0 sein.');
  muss(h, e.rhoL >= 0, 'rhoL', 'Der Längsbewehrungsgrad darf nicht negativ sein.');
  muss(h, (e.beta ?? 1.1) >= 1, 'beta', 'Der Lasterhöhungsfaktor β muss ≥ 1,0 sein.');
  muss(h, (e.aRand ?? 0) >= 0, 'aRand', 'Der Randabstand darf nicht negativ sein.');
  if (hatFehler(h)) return h;
  bereich(h, 'fck', e.fck, 12, 50, 'Die Durchstanzformeln sind hier nur bis C50/60 hinterlegt.');
  if (e.form === 'rechteckig') bereich(h, 'c', Math.max(e.cx, e.cy) / Math.min(e.cx, e.cy), 1, 2, 'Seitenverhältnis > 2: Der Rundschnitt ist nach NA DE 6.4.2 zu reduzieren (hier nicht berücksichtigt).');
  if (e.lage && e.lage !== 'innen') h.push({ stufe: 'warnung', feld: 'lage', text: 'Rand- und Eckstützen: u₁ endet nach EC2 Bild 6.15 am freien Rand; der konstante Faktor β nach NA DE gilt nur für unverschiebliche Systeme mit Stützweitenunterschieden benachbarter Felder ≤ 25 % (6.4.3(6)). Bei großer Lastausmitte ist β genauer zu ermitteln. C_Rd,c = 0,18/γc ohne Abminderung für u₀/d < 4.' });
  bereich(h, 'd', e.d, 0, 600, 'Für d > 600 mm ist v_min nach NA DE abzumindern (hier mit 0,0525/γc gerechnet).');
  return h;
}

export function bemesseDurchstanzen(e: DurchstanzEingabe): DurchstanzErgebnis {
  const hinweise = pruefeDurchstanzen(e);
  const leer: DurchstanzErgebnis = {
    u0: 0, u1: 0, u1Voll: 0, beta: 0, u0_d: 0, CRdc: 0, rhoL_eff: 0, vEd_stress: 0, vRdc: 0, vRdMax: 0,
    needsReinforcement: false, isOverloaded: false, asw_req_ring: 0, hinweise,
  };
  if (hatFehler(hinweise)) return leer;

  const lage = e.lage ?? 'innen';
  const beta = e.beta ?? betaNaDe(lage);
  const { u0, u1, u1Voll } = rundschnitte(e.form, lage, e.d, e.c, e.cx, e.cy, e.aRand ?? 0);
  const vEd_stress = (beta * e.vEd * 1000) / (u1 * e.d); // (6.38)

  // f_cd zentral (src/data/kennwerte.ts); geht nur in die Grenze ρ_l ≤ 0,5·f_cd/f_yd ein
  const fcd = fcdBeton(e.fck);
  const fyd = (e.fyk ?? 500) / EC2_NA_DE.gammaS;
  const k = Math.min(1 + Math.sqrt(200 / e.d), 2.0);
  const rhoL_eff = Math.min(e.rhoL, 0.02, (0.5 * fcd) / fyd); // NA DE 6.4.4(1)
  const u0_d = u0 / e.d;
  // NA DE 6.4.4(1): nur Innenstützen (Flachdecken) mit u0/d < 4 → C_Rd,c = 0,18/γc·(0,1·u0/d + 0,6)
  const istInnen = lage === 'innen';
  const CRdc = istInnen && u0_d < 4 ? EC2_NA_DE.CRdc_Durchstanz * (0.1 * u0_d + 0.6) : EC2_NA_DE.CRdc_Durchstanz;
  const vMin = (0.0525 / EC2_NA_DE.gammaC) * Math.pow(k, 1.5) * Math.sqrt(e.fck);
  const vRdc = Math.max(CRdc * k * Math.cbrt(100 * rhoL_eff * e.fck), vMin);
  const vRdMax = EC2_NA_DE.vRdMaxFaktor_u1 * vRdc; // NA DE 6.4.5(3): v_Rd,max = 1,4·v_Rd,c

  const needsReinforcement = vEd_stress > vRdc;
  const isOverloaded = vEd_stress > vRdMax;
  let asw_req_ring = 0;
  if (needsReinforcement && !isOverloaded) {
    // (6.52) mit s_r = 0,75·d → 1,5·d/s_r = 2,0; f_ywd,ef = 250 + 0,25·d ≤ f_ywd
    const fywd_ef = Math.min(250 + 0.25 * e.d, fyd);
    asw_req_ring = ((vEd_stress - 0.75 * vRdc) * u1 * e.d) / (2.0 * fywd_ef);
    hinweise.push({ stufe: 'warnung', feld: 'asw', text: 'Die Abschätzung gilt je Bewehrungsreihe ohne die nach NA DE erhöhten Faktoren κ_sw für die ersten beiden Reihen. Für die Ausführung ist der vollständige Nachweis nach 6.4.5 mit NA DE zu führen.' });
  }
  if (isOverloaded) hinweise.push({ stufe: 'warnung', feld: 'vEd', text: 'v_Ed überschreitet v_Rd,max = 1,4·v_Rd,c. Deckenstärke, Stützenquerschnitt oder Betonfestigkeit erhöhen.' });
  if (rhoL_eff < e.rhoL) hinweise.push({ stufe: 'warnung', feld: 'rhoL', text: 'ρ_l ist auf min(0,02; 0,5·f_cd/f_yd) begrenzt (NA DE 6.4.4).' });

  return { u0, u1, u1Voll, beta, u0_d, CRdc, rhoL_eff, vEd_stress, vRdc, vRdMax, needsReinforcement, isOverloaded, asw_req_ring, hinweise };
}
