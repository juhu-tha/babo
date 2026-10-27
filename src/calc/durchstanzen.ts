/**
 * Durchstanznachweis Flachdecke an Einzelstütze nach DIN EN 1992-1-1 + NA (DE), 6.4. Fundamente und Bodenplatten (NA DE, 6.4.4(2):
 * abweichender Beiwert C_Rd,c, iterativ ermittelter Rundschnitt, Abzug der Bodenpressung) sind nicht abgebildet.
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
  beta: number;
  fyk?: number; // Biegebewehrung, für die Begrenzung ρ_l ≤ 0,5·f_cd/f_yd
  /** Stützenlage; die Abminderung von C_Rd,c bei u0/d < 4 gilt nach NA DE nur für Innenstützen (Standard: innen) */
  lage?: 'innen' | 'rand' | 'ecke';
}

export interface DurchstanzErgebnis {
  u0: number; u1: number; u0_d: number; CRdc: number; rhoL_eff: number;
  vEd_stress: number; vRdc: number; vRdMax: number;
  needsReinforcement: boolean; isOverloaded: boolean; asw_req_ring: number;
  hinweise: Hinweis[];
}

export function pruefeDurchstanzen(e: DurchstanzEingabe): Hinweis[] {
  const h: Hinweis[] = [];
  muss(h, istEndlich(e.vEd, e.d, e.c, e.cx, e.cy, e.fck, e.rhoL, e.beta), 'eingabe', 'Alle Eingaben müssen Zahlen sein.');
  if (hatFehler(h)) return h;
  muss(h, e.d > 0, 'd', 'Die statische Nutzhöhe d muss größer als 0 sein.');
  muss(h, e.form === 'rund' ? e.c > 0 : e.cx > 0 && e.cy > 0, 'c', 'Die Stützenabmessungen müssen größer als 0 sein.');
  muss(h, e.vEd >= 0, 'vEd', 'V_Ed muss ≥ 0 sein.');
  muss(h, e.fck > 0, 'fck', 'f_ck muss größer als 0 sein.');
  muss(h, e.rhoL >= 0, 'rhoL', 'Der Längsbewehrungsgrad darf nicht negativ sein.');
  muss(h, e.beta >= 1, 'beta', 'Der Lasterhöhungsfaktor β muss ≥ 1,0 sein.');
  if (hatFehler(h)) return h;
  bereich(h, 'fck', e.fck, 12, 50, 'Die Durchstanzformeln sind hier nur bis C50/60 hinterlegt.');
  if (e.form === 'rechteckig') bereich(h, 'c', Math.max(e.cx, e.cy) / Math.min(e.cx, e.cy), 1, 2, 'Seitenverhältnis > 2: Der Rundschnitt ist nach NA DE 6.4.2 zu reduzieren (hier nicht berücksichtigt).');
  if (e.lage && e.lage !== 'innen') h.push({ stufe: 'warnung', feld: 'lage', text: 'Rand- und Eckstützen: Der kritische Rundschnitt u₁ ist hier vereinfacht als voller Rundschnitt angesetzt (genauer: reduzierter Umfang nach 6.4.2); C_Rd,c = 0,18/γc ohne Abminderung für u₀/d < 4.' });
  bereich(h, 'd', e.d, 0, 600, 'Für d > 600 mm ist v_min nach NA DE abzumindern (hier mit 0,0525/γc gerechnet).');
  return h;
}

export function bemesseDurchstanzen(e: DurchstanzEingabe): DurchstanzErgebnis {
  const hinweise = pruefeDurchstanzen(e);
  const leer: DurchstanzErgebnis = {
    u0: 0, u1: 0, u0_d: 0, CRdc: 0, rhoL_eff: 0, vEd_stress: 0, vRdc: 0, vRdMax: 0,
    needsReinforcement: false, isOverloaded: false, asw_req_ring: 0, hinweise,
  };
  if (hatFehler(hinweise)) return leer;

  const u0 = e.form === 'rund' ? Math.PI * e.c : 2 * (e.cx + e.cy);
  const u1 = e.form === 'rund' ? Math.PI * (e.c + 4 * e.d) : 2 * (e.cx + e.cy) + 4 * Math.PI * e.d;
  const vEd_stress = (e.beta * e.vEd * 1000) / (u1 * e.d); // (6.38)

  // f_cd zentral (src/data/kennwerte.ts); geht nur in die Grenze ρ_l ≤ 0,5·f_cd/f_yd ein
  const fcd = fcdBeton(e.fck);
  const fyd = (e.fyk ?? 500) / EC2_NA_DE.gammaS;
  const k = Math.min(1 + Math.sqrt(200 / e.d), 2.0);
  const rhoL_eff = Math.min(e.rhoL, 0.02, (0.5 * fcd) / fyd); // NA DE 6.4.4(1)
  const u0_d = u0 / e.d;
  // NA DE 6.4.4(1): nur Innenstützen (Flachdecken) mit u0/d < 4 → C_Rd,c = 0,18/γc·(0,1·u0/d + 0,6)
  const istInnen = (e.lage ?? 'innen') === 'innen';
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

  return { u0, u1, u0_d, CRdc, rhoL_eff, vEd_stress, vRdc, vRdMax, needsReinforcement, isOverloaded, asw_req_ring, hinweise };
}
