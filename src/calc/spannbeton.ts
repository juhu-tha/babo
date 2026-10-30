/**
 * Spannbeton nach DIN EN 1992-1-1 + NA (DE). Die Rechenfunktionen (Festigkeitsentwicklung, Kriechen, Schwinden,
 * Relaxation, Reibung/Keilschlupf, elastische Verkürzung, Gl. 5.46) liegen in src/utils/ec2Spannbeton.ts und sind
 * hier für die einheitliche Rechenkern-Struktur gebündelt; dazu kommt die Plausibilitätsprüfung der Eingaben.
 * Geprüft in tests/ec2Spannbeton.test.ts und tests/spannbeton.test.ts.
 */
export * from '../utils/ec2Spannbeton';
import { type Hinweis, istEndlich, muss, hatFehler } from './plausibilitaet';
import { CONCRETE, fctmFl } from '../utils/ec2Spannbeton';

export interface SpannbetonEingabe {
  p0: number; b: number; h: number; ep: number;    // kN, mm
  mG1: number; mPerm: number; mChar: number;       // kNm
  concreteAge: number; spanLength: number;         // d, m
  frictionCoeff: number; wobbleCoeff: number; totalCurvature: number; anchorSlip: number; nTendons: number;
}

export function pruefeSpannbeton(e: SpannbetonEingabe): Hinweis[] {
  const h: Hinweis[] = [];
  muss(h, istEndlich(...Object.values(e)), 'eingabe', 'Alle Eingaben müssen Zahlen sein.');
  if (hatFehler(h)) return h;
  muss(h, e.p0 > 0, 'p0', 'Die Vorspannkraft P₀ muss größer als 0 sein.');
  muss(h, e.b > 0 && e.h > 0, 'b', 'Breite und Höhe müssen größer als 0 sein.');
  muss(h, Math.abs(e.ep) < e.h / 2, 'ep', 'Die Exzentrizität e_p muss innerhalb des Querschnitts liegen (|e_p| < h/2).');
  muss(h, e.concreteAge >= 1, 'concreteAge', 'Das Betonalter beim Spannen muss mindestens 1 Tag betragen.');
  muss(h, e.spanLength > 0, 'spanLength', 'Die Spannweite muss größer als 0 sein.');
  muss(h, [e.frictionCoeff, e.wobbleCoeff, e.totalCurvature, e.anchorSlip].every(x => x >= 0) && e.nTendons >= 1, 'reibung', 'Reibungsbeiwerte, Umlenkwinkel und Schlupf dürfen nicht negativ sein; mindestens ein Spannglied.');
  if (hatFehler(h)) return h;
  if (Math.abs(e.ep) > e.h / 2 - 50) h.push({ stufe: 'warnung', feld: 'ep', text: 'Weniger als 50 mm zwischen Spanngliedachse und Rand – Betondeckung und Hüllrohrdurchmesser prüfen.' });
  if (e.mPerm > e.mChar) h.push({ stufe: 'warnung', feld: 'mPerm', text: 'Das quasi-ständige Moment ist größer als das charakteristische – Einwirkungskombinationen prüfen.' });
  if (e.mG1 > e.mPerm) h.push({ stufe: 'warnung', feld: 'mG1', text: 'M_g1 ist größer als das quasi-ständige Moment – das Eigengewicht ist in M_perm enthalten.' });
  // Modulprüfung Tranche 2 (28.10.2026): Text an die Rechnung im Modul angeglichen (vorher „e_p + 25 mm“, offener Prüfpunkt AP 4.4)
  h.push({ stufe: 'warnung', feld: 'dekompression', text: 'Dekompression vereinfacht am ungerissenen Querschnitt (Zustand I): größte Betonspannung an den Grenzen e_p ± max(100 mm; h/10) nach NA DE; Hüllrohrdurchmesser und Lage einzelner Litzen sind nicht abgebildet.' });
  return h;
}

// ---------------------------------------------------------------------------------------------------
// Demonstratoren (AP 4.2, Runde 3): Freyssinet-Randspannungen, Dehnungsanimation, „Von 0 bis 100“.
// Verhalten 1:1 aus src/modules/spannbeton/SpannbetonDehnungsAnimation.tsx und SpannbetonNullBisHundert.tsx
// übernommen; geprüft in tests/spannbetonDemos.test.ts. Lehr- und Vorbemessungswerkzeug.
// Vorzeichen: Druck negativ, Zug positiv; e_p unterhalb der Schwerachse positiv; Feldmoment positiv.
// ---------------------------------------------------------------------------------------------------

/** Querschnittswerte eines Rechtecks b × h [mm]: A [mm²], I [mm⁴], W [mm³], Kernweite k = W/A = h/6 [mm] */
export function rechteckQuerschnitt(b: number, h: number) {
  const A = b * h;
  const I = (b * Math.pow(h, 3)) / 12.0;
  const W = (b * Math.pow(h, 2)) / 6.0;
  return { A, I, W, kern: h / 6.0 };
}

export interface FreyssinetSpannungen {
  /** zentrischer Anteil −P/A [MPa] */
  sigmaN: number;
  /** Anteil aus exzentrischer Vorspannung P·e_p/W_u [MPa] (Betrag; am Unterrand Druck) */
  sigmaP: number;
  /** Anteil aus Last M/W_u [MPa] (Betrag; am Unterrand Zug) */
  sigmaM: number;
  /** σ_o = −P/A + P·e_p/W_o − M/W_o [MPa] */
  sigmaOben: number;
  /** σ_u = −P/A − P·e_p/W_u + M/W_u [MPa] */
  sigmaUnten: number;
}

/**
 * Randspannungen nach Freyssinet (Spannungsüberlagerung am ungerissenen Querschnitt, Zustand I):
 *   σ_u = −P/A − P·e_p/W_u + M/W_u,   σ_o = −P/A + P·e_p/W_o − M/W_o
 * Einheiten: P [kN], A [mm²], W [mm³], e_p [mm], M [kNm] → σ [MPa]. Bei symmetrischem Querschnitt W_o = W_u.
 */
export function freyssinetSpannungen(P: number, A: number, Wu: number, ep: number, M: number, Wo: number = Wu): FreyssinetSpannungen {
  const sigmaN = -(P * 1000.0) / A;
  const sigmaPu = (P * 1000.0 * ep) / Wu, sigmaMu = (M * 1e6) / Wu;
  const sigmaPo = (P * 1000.0 * ep) / Wo, sigmaMo = (M * 1e6) / Wo;
  return { sigmaN, sigmaP: sigmaPu, sigmaM: sigmaMu, sigmaOben: sigmaN + sigmaPo - sigmaMo, sigmaUnten: sigmaN - sigmaPu + sigmaMu };
}

/** Vorspannkraft für Dekompression am Unterrand (σ_u = 0): P = M / (k + e_p) mit k = W/A [kN; M in kNm, k und e_p in mm] */
export const dekompressionsKraft = (M: number, kern: number, ep: number) => (M * 1000.0) / (kern + ep);

// --- Dehnungsanimation -----------------------------------------------------------------------------

export type Spanngliedlage = 'centric' | 'straight_bottom' | 'parabolic';
export type Schnittlage = 'midspan' | 'support';
/** Zustand des Querschnitts in der Animation */
export type DehnungsZustand = 'cracked' | 'limited' | 'full' | 'camber' | 'support_crack';

/**
 * Feste Lehrparameter: Einfeldträger L = 20 m, Rechteck 500 × 1000 mm, C40/50, Wichte 25 kN/m³.
 * Runde 5: E_cm und f_ctm aus DIN EN 1992-1-1, Tab. 3.1 (zentrale Tabelle CONCRETE: 35 000 bzw. 3,5 N/mm²); die
 * Biegerandzugspannung wird gegen f_ctm,fl = max((1,6 − h/1000)·f_ctm; f_ctm) nach 3.1.8 (Gl. 3.23) geprüft – für
 * h = 1000 mm ist f_ctm,fl = f_ctm.
 */
const C40 = CONCRETE['C40/50'];
export const DEHNUNG_TRAEGER = {
  L: 20.0, b: 500.0, h: 1000.0, Ecm: C40.Ecm, fctm: C40.fctm, fctmFl: fctmFl(C40.fctm, 1000.0), fck: C40.fck, wichte: 25.0,
} as const;

export interface DehnungsEingabe {
  /** Vorspannkraft P [kN] */
  P: number;
  /** Zusatzlast q [kN/m] (zusätzlich zum Eigengewicht) */
  q: number;
  /** Exzentrizität bzw. Parabelstich e_p [mm] */
  ep: number;
  lage: Spanngliedlage;
  schnitt: Schnittlage;
}

export interface DehnungsErgebnis {
  effectiveEpMid: number; effectiveEpSup: number; activeEp: number;
  /** Umlenkkraft [kN/m] und Verformung aus Vorspannung [m] */
  u_kN_m: number; w_u_m: number;
  /** Momente am betrachteten Schnitt [kNm] */
  Mq: number; Mp: number; Mnet: number;
  Mq_mid: number; Mp_mid: number; Mnet_mid: number;
  /** Spannungen [MPa] */
  sigma_N: number; sigma_M_top: number; sigma_M_bot: number; sigma_top: number; sigma_bot: number; sigma_top_support: number;
  hasSupportHeadCracks: boolean;
  /** Dehnungen [‰] */
  eps_top: number; eps_bot: number; eps_tendon: number; eps_N: number;
  eps_Mp_top: number; eps_Mp_bot: number; eps_Mq_top: number; eps_Mq_bot: number;
  /** Randspannungsanteile am Unterrand [MPa]: aus Vormoment −M_p/W und aus Last M_q/W */
  sigma_Mp: number; sigma_Mq: number;
  /** Nulllinie von der Oberkante [mm] */
  neutralAxisDepth: number;
  /** Grenzkräfte in Feldmitte [kN]: Dekompression, Rissbildung, Lastausgleich */
  P_dek: number; P_cr: number; P_bal: number;
  /** Durchbiegung in Feldmitte [mm], positiv nach unten */
  w_net_mm: number;
  zustand: DehnungsZustand;
  gueltig: boolean;
  hinweise: Hinweis[];
}

export function pruefeDehnung(e: DehnungsEingabe): Hinweis[] {
  const h: Hinweis[] = [];
  muss(h, istEndlich(e.P, e.q, e.ep), 'eingabe', 'Alle Eingaben müssen Zahlen sein.');
  if (hatFehler(h)) return h;
  muss(h, e.P >= 0, 'P', 'Die Vorspannkraft darf nicht negativ sein.');
  muss(h, e.q >= 0, 'q', 'Die Zusatzlast darf nicht negativ sein.');
  muss(h, e.ep >= 0 && e.ep < DEHNUNG_TRAEGER.h / 2, 'ep', 'Die Exzentrizität muss zwischen 0 und h/2 = 500 mm liegen.');
  return h;
}

/** Dehnungs- und Spannungszustand des Lehrträgers (Zustand I, linear-elastisch); Rechnung unverändert aus dem Modul */
export function dehnungsZustand(e: DehnungsEingabe): DehnungsErgebnis {
  const hinweise = pruefeDehnung(e);
  // Grenze der Biegerandzugspannung: f_ctm,fl (EC2 3.1.8); die zentrische Kopfzug-/Rissgrenze bleibt f_ctm,fl ebenso
  const { L, b, h, Ecm, fctmFl: fctm, wichte } = DEHNUNG_TRAEGER;
  const { A: Ac, I: Ic, W: Wc, kern: ku } = rechteckQuerschnitt(b, h);
  const prestressForce = e.P;

  // 1. Exzentrizitäten, Umlenkkraft und Verformung aus Vorspannung nach Spanngliedlage
  let effectiveEpMid = 0, effectiveEpSup = 0, u_kN_m = 0, w_u_m = 0;
  if (e.lage === 'straight_bottom') {
    effectiveEpMid = e.ep;
    effectiveEpSup = e.ep;
    // konstantes Vormoment M_p = P · e_p: w_u = M_p · L² / (8 · E · I); keine Umlenkkräfte im Feld
    const Mp_const = prestressForce * (e.ep / 1000.0);
    w_u_m = (Mp_const * 1000.0 * Math.pow(L, 2)) / (8.0 * Ecm * 1e6 * (Ic * 1e-12));
  } else if (e.lage === 'parabolic') {
    effectiveEpMid = e.ep;
    effectiveEpSup = 0;
    u_kN_m = (8.0 * prestressForce * (e.ep / 1000.0)) / Math.pow(L, 2);
    w_u_m = (5.0 * (u_kN_m * 1000.0) * Math.pow(L, 4)) / (384.0 * (Ecm * 1e6) * (Ic * 1e-12));
  }

  // Eigengewicht g = γ · b · h und Gesamtlast g + q
  const beamG = (wichte * b * h) / 1e6;
  const totalQ = beamG + e.q;

  // 2.–4. Lastmoment, Vormoment, Nettomoment
  const Mq_mid = (totalQ * Math.pow(L, 2)) / 8.0;
  const Mq_sup = 0;
  const Mp_mid = -(prestressForce * (effectiveEpMid / 1000.0));
  const Mp_sup = -(prestressForce * (effectiveEpSup / 1000.0));
  const Mnet_mid = Mq_mid + Mp_mid;
  const Mnet_sup = Mq_sup + Mp_sup;

  // 5. zentrischer Anteil −P/A
  const sigma_N = -(prestressForce * 1000.0) / Ac;

  // 6. betrachteter Schnitt
  const isMidspan = e.schnitt === 'midspan';
  const activeEp = isMidspan ? effectiveEpMid : effectiveEpSup;
  const activeMq = isMidspan ? Mq_mid : Mq_sup;
  const activeMp = isMidspan ? Mp_mid : Mp_sup;
  const activeMnet = isMidspan ? Mnet_mid : Mnet_sup;

  const sigma_M_top = -(activeMnet * 1e6) / Wc;
  const sigma_M_bot = +(activeMnet * 1e6) / Wc;
  const sigma_top = sigma_N + sigma_M_top;
  const sigma_bot = sigma_N + sigma_M_bot;
  const sigma_max = Math.max(sigma_top, sigma_bot);

  const eps_top = (sigma_top / Ecm) * 1000.0;
  const eps_bot = (sigma_bot / Ecm) * 1000.0;
  const sigma_tendon = sigma_N + ((activeMnet * 1e6) / Ic) * activeEp;
  const eps_tendon = (sigma_tendon / Ecm) * 1000.0;

  const eps_N = (sigma_N / Ecm) * 1000.0;
  const eps_Mp_top = -((activeMp * 1e6) / Wc / Ecm) * 1000.0;
  const eps_Mp_bot = +((activeMp * 1e6) / Wc / Ecm) * 1000.0;
  const eps_Mq_top = -((activeMq * 1e6) / Wc / Ecm) * 1000.0;
  const eps_Mq_bot = +((activeMq * 1e6) / Wc / Ecm) * 1000.0;

  // Nulldurchgang der Spannungsgeraden (von der Oberkante)
  const deltaSigma = sigma_bot - sigma_top;
  const neutralAxisDepth = Math.abs(deltaSigma) > 1e-4 ? (-sigma_top / deltaSigma) * h : h / 2;

  // Auflager bei gerader Spanngliedlage: σ_o = −P/A + P·e_p/W (Kopfzugrisse)
  const sigma_top_support = sigma_N - (Mp_sup * 1e6) / Wc;
  const hasSupportHeadCracks = e.lage === 'straight_bottom' && sigma_top_support > fctm;

  // Durchbiegung in Feldmitte, positiv nach unten
  const w_q_m = (5.0 * (totalQ * 1000.0) * Math.pow(L, 4)) / (384.0 * (Ecm * 1e6) * (Ic * 1e-12));
  const w_net_mm = (w_q_m - w_u_m) * 1000.0;

  // Grenzkräfte (Feldmitte)
  let P_dek: number, P_cr: number, P_bal: number;
  if (effectiveEpMid > 0) {
    P_dek = dekompressionsKraft(Mq_mid, ku, effectiveEpMid);
    P_cr = Math.max(0, (Mq_mid * 1000.0 - fctm * (Wc / 1000.0)) / (ku + effectiveEpMid));
    // Lastausgleich u = g + q: P_bal = (g + q)·L²/(8·e_p)
    P_bal = Math.round((totalQ * Math.pow(L, 2)) / (8.0 * (effectiveEpMid / 1000.0)));
  } else {
    // zentrisch: σ_u = −P/A + M/W ⇒ P_dek = M·A/W, P_cr = (M/W − f_ctm)·A
    P_dek = (Mq_mid * 1000.0 * Ac) / Wc;
    // Korrektur gegenüber dem Modul: M/W in N/mm² (M·10⁶/W) und Ergebnis in kN (/1000); vorher wurde M·10³/W
    // (kN/mm²) mit f_ctm (N/mm²) verrechnet, P_cr war dadurch praktisch immer 0.
    P_cr = Math.max(0, (((Mq_mid * 1e6) / Wc - fctm) * Ac) / 1000.0);
    P_bal = 0;
  }

  let zustand: DehnungsZustand;
  if (hasSupportHeadCracks) zustand = 'support_crack';
  else if (sigma_top <= 0 && sigma_bot <= 0) zustand = w_net_mm < -0.5 ? 'camber' : 'full';
  else if (sigma_max <= fctm) zustand = 'limited';
  else zustand = 'cracked';

  if (!hatFehler(hinweise) && (zustand === 'cracked' || zustand === 'support_crack')) {
    hinweise.push({ stufe: 'warnung', feld: 'P', text: 'Randzugspannung über f_ctm,fl (DIN EN 1992-1-1, 3.1.8): Die Spannungen gelten für den ungerissenen Querschnitt (Zustand I) und sind nach der Rissbildung nur noch qualitativ.' });
  }

  return {
    effectiveEpMid, effectiveEpSup, activeEp, u_kN_m, w_u_m,
    Mq: activeMq, Mp: activeMp, Mnet: activeMnet, Mq_mid, Mp_mid, Mnet_mid,
    sigma_N, sigma_M_top, sigma_M_bot, sigma_top, sigma_bot, sigma_top_support, hasSupportHeadCracks,
    eps_top, eps_bot, eps_tendon, eps_N, eps_Mp_top, eps_Mp_bot, eps_Mq_top, eps_Mq_bot,
    sigma_Mp: (-activeMp * 1e6) / Wc, sigma_Mq: (activeMq * 1e6) / Wc,
    neutralAxisDepth, P_dek, P_cr, P_bal, w_net_mm, zustand,
    gueltig: !hatFehler(hinweise), hinweise,
  };
}

// --- „Spannbeton von 0 bis 100“ ---------------------------------------------------------------------

/** Lehrwerte Station 2: B500 (f_yd = 435 N/mm², E_s = 200 000 N/mm²) und Y1860 (σ_pm0 = min(0,75·f_pk; 0,85·f_p0,1k) = 1 360 N/mm², E_p = 195 000 N/mm²) */
export const DILEMMA_STAHL = {
  b500: { E: 200000, sigma0: 435 },
  y1860: { E: 195000, sigma0: 1360 },
} as const;

export interface StahlVerlust {
  /** Spannungsverlust Δσ = E · Δε [N/mm²] */
  deltaSigma: number;
  /** auf ganze Prozent gerundeter Verlust, höchstens 100 % */
  verlustProzent: number;
  /** verbleibende Spannung, nicht negativ [N/mm²] */
  rest: number;
}

const stahlVerlust = (E: number, sigma0: number, deltaEps: number): StahlVerlust => {
  const deltaSigma = E * deltaEps;
  return { deltaSigma, verlustProzent: Math.min(100, Math.round((deltaSigma / sigma0) * 100)), rest: Math.max(0, sigma0 - deltaSigma) };
};

/** Spannungsverlust von B500 und Y1860 durch eine Betonstauchung (Kriechen + Schwinden) Δε [‰] */
export function stauchungsVerlust(stauchungPromille: number) {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(stauchungPromille) && stauchungPromille >= 0, 'stauchung', 'Die Betonstauchung muss eine nicht negative Zahl sein.');
  const deltaEps = stauchungPromille / 1000;
  const b500 = stahlVerlust(DILEMMA_STAHL.b500.E, DILEMMA_STAHL.b500.sigma0, deltaEps);
  const y1860 = stahlVerlust(DILEMMA_STAHL.y1860.E, DILEMMA_STAHL.y1860.sigma0, deltaEps);
  if (!hatFehler(hinweise) && b500.deltaSigma >= DILEMMA_STAHL.b500.sigma0) {
    hinweise.push({ stufe: 'warnung', feld: 'stauchung', text: 'Die Stauchung zehrt die Vordehnung des B500 vollständig auf – angezeigt sind 100 % Verlust.' });
  }
  return { b500, y1860, gueltig: !hatFehler(hinweise), hinweise };
}

/**
 * Standardlitze Y1860S7 mit A_p = 150 mm² (0,62″), σ_pm0 = min(0,75·f_pk; 0,85·f_p0,1k) = 1 360 N/mm² (wie Station 2).
 * Runde 5: Die Litzenzahl folgt aus der Kraft je Litze nach Verlusten statt aus pauschal 150 kN:
 *   P_m0 je Litze = A_p·σ_pm0 = 204 kN; P_m∞ je Litze = (1 − Verluste)·P_m0 mit 15 % zeitabhängigen Verlusten (Lehrannahme)
 *   = 173,4 kN. Für den Lastausgleich ist die Kraft nach Verlusten maßgebend; n = ⌈P/P_m∞⌉ (aufgerundet).
 */
export const LITZE = { Ap: 150, sigmaPm0: 1360, verlust: 0.15 } as const;
/** Kraft je Litze zum Spannzeitpunkt P_m0 [kN] */
export const KRAFT_JE_LITZE_PM0_KN = (LITZE.Ap * LITZE.sigmaPm0) / 1000;
/** Kraft je Litze nach Verlusten P_m∞ [kN] (für die Überschlagsanzahl) */
export const KRAFT_JE_LITZE_KN = KRAFT_JE_LITZE_PM0_KN * (1 - LITZE.verlust);
/** Überschlägige Litzenzahl n = ⌈P / P_m∞,Litze⌉ (P als wirksame Kraft nach Verlusten in kN) */
export const litzenAnzahl = (P: number) => Math.ceil(P / KRAFT_JE_LITZE_KN - 1e-9);

/**
 * Lastausgleich nach T. Y. Lin (Parabelspannglied, Einfeldträger): u = 8·P·f/L² ⇒ P_bal = g·L²/(8·f).
 * P_bal wird auf ganze kN gerundet; u (auf 0,1 kN/m gerundet) und das Restmoment (g − u)·L²/8 (ganze kNm)
 * folgen aus der gerundeten Kraft – wie im Modul. L [m], g [kN/m], f [m].
 */
export function lastausgleich(L: number, g: number, f: number) {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(L, g, f), 'eingabe', 'Alle Eingaben müssen Zahlen sein.');
  if (!hatFehler(hinweise)) {
    muss(hinweise, L > 0, 'L', 'Die Spannweite muss größer als 0 sein.');
    muss(hinweise, g >= 0, 'g', 'Die Last darf nicht negativ sein.');
    muss(hinweise, f > 0, 'f', 'Der Parabelstich muss größer als 0 sein.');
  }
  if (hatFehler(hinweise)) return { P: NaN, u: NaN, mNetto: NaN, litzen: NaN, gueltig: false, hinweise };
  const P = Math.round((g * Math.pow(L, 2)) / (8 * f));
  const u = Math.round(((8 * P * f) / Math.pow(L, 2)) * 10) / 10;
  const mNetto = Math.round(((g - u) * Math.pow(L, 2)) / 8);
  return { P, u, mNetto, litzen: litzenAnzahl(P), gueltig: true, hinweise };
}

// --- Betondeckung von Spanngliedern (Reiter Dauerhaftigkeit; Durchsicht A 29.10.2026, DSA-SB-2) ---------------

/**
 * c_min,dur für Betonstahl nach DIN EN 1992-1-1/NA:2013-04, Tab. 4.4DE – dieselben Werte wie die zentralen
 * Expositionsklassen-Daten (src/modules/expositionsklassen/daten.ts, minCoverDurMm) und DECKUNG in
 * src/calc/bauwerksuntersuchung.ts (Gleichheit geprüft in tests/durchsichtA.test.ts).
 * Vorher im Modul: Werte der EN-Empfehlung Tab. 4.4N für Klasse S4 (15/25/30/35/40/45 mm).
 */
export const C_MIN_DUR_BETONSTAHL_NA = { XC1: 10, XC2: 20, XC3: 20, XC4: 25, XD1: 40, XD2: 40, XD3: 40 } as const;
export type DeckungKarbonatisierung = 'XC1' | 'XC2' | 'XC3' | 'XC4';
export type DeckungChlorid = 'XD0' | 'XD1' | 'XD2' | 'XD3';
export type Spannverfahren = 'post_tensioned' | 'pre_tensioned' | 'unbonded';

export interface SpanngliedDeckungEingabe {
  bauwerk: 'hochbau' | 'bruecke';
  verfahren: Spannverfahren;
  huellrohrMm: number;      // Hüllrohrdurchmesser (nachträglicher Verbund)
  litzeMm: number;          // Litzen-/Drahtdurchmesser (sofortiger Verbund, ohne Verbund)
  xc: DeckungKarbonatisierung;
  xd: DeckungChlorid;
  betonklasse: string;
}

/**
 * Mindest- und Nennmaß der Betondeckung für Spannglieder (Lehrwerkzeug):
 *  - c_min,b: Hüllrohr rund = Durchmesser, höchstens 80 mm; sofortiger Verbund 2,0·Ø (Litzen, glatte Drähte)
 *    nach DIN EN 1992-1-1, 4.4.1.2(3); ohne Verbund 1,5·Ø (Lehrannahme, vorläufig – maßgebend ist die ETA)
 *  - c_min,dur = Tab. 4.4DE (Betonstahl) + Δc_dur,γ = +10 mm für Spannstahl im Verbund (wie bisher im Modul);
 *    +5 mm für 100 Jahre Nutzungsdauer bei Brücken und −5 mm für C45/55 und C50/60 (vorläufig, Normprüfung
 *    ausstehend: DIN EN 1992-2/NA bzw. DIN EN 1992-1-1/NA, 4.4.1.2)
 *  - c_min = max(c_min,b; c_min,dur; 10 mm), c_nom = c_min + Δc_dev, Δc_dev nach NA DE 10 mm (XC1, Hochbau), sonst 15 mm
 */
export function spanngliedDeckung(e: SpanngliedDeckungEingabe) {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(e.huellrohrMm, e.litzeMm) && e.huellrohrMm > 0 && e.litzeMm > 0, 'durchmesser', 'Hüllrohr- und Litzendurchmesser müssen größer als 0 sein.');
  // Ungültige Eingabe: kein Ergebnis (vorher c_nom aus c_min,dur trotz gueltig = false; Gegenprüfung 30.10.2026)
  if (hatFehler(hinweise)) {
    return { c_min_b: NaN, baseDur: NaN, delta_dur_gamma: NaN, delta_dur_100: NaN, delta_dur_fck: NaN, c_min_dur: NaN, c_min: NaN, delta_c_dev: NaN, c_nom: NaN, gueltig: false, hinweise };
  }
  let c_min_b: number;
  if (e.verfahren === 'post_tensioned') c_min_b = Math.min(80, e.huellrohrMm);
  else if (e.verfahren === 'pre_tensioned') c_min_b = Math.round(2.0 * e.litzeMm); // 4.4.1.2(3): 2,0·Ø
  else c_min_b = Math.round(1.5 * e.litzeMm); // Lehrannahme (vorläufig), Monolitze nach ETA
  let baseDur: number = C_MIN_DUR_BETONSTAHL_NA[e.xc];
  if (e.xd !== 'XD0') baseDur = Math.max(baseDur, C_MIN_DUR_BETONSTAHL_NA[e.xd]);
  const delta_dur_100 = e.bauwerk === 'bruecke' ? 5 : 0; // vorläufig, Normprüfung ausstehend
  const delta_dur_gamma = e.verfahren === 'unbonded' ? 0 : 10; // Spannstahl im Verbund (+10 mm)
  const delta_dur_fck = e.betonklasse === 'C45/55' || e.betonklasse === 'C50/60' ? 5 : 0; // vorläufig, Normprüfung ausstehend
  const c_min_dur = Math.max(10, baseDur + delta_dur_100 + delta_dur_gamma - delta_dur_fck);
  const c_min = Math.max(c_min_b, c_min_dur, 10);
  const delta_c_dev = e.bauwerk === 'bruecke' ? 15 : (e.xc === 'XC1' ? 10 : 15);
  const c_nom = c_min + delta_c_dev;
  return { c_min_b, baseDur, delta_dur_gamma, delta_dur_100, delta_dur_fck, c_min_dur, c_min, delta_c_dev, c_nom, gueltig: !hatFehler(hinweise), hinweise };
}
