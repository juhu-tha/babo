/**
 * Eisen-Kohlenstoff-Diagramm, metastabiles System Fe–Fe₃C bis 6,67 % C (Z24, Modul „Stahl“).
 *
 * Eckpunkte (Massen-% C / °C) als Lehrbuchwerte nach der deutschsprachigen Literatur, öffentlich z. B. im
 * chemie.de-Lexikon „Eisen-Kohlenstoff-Diagramm“ (Wiedergabe des Wikipedia-Artikels):
 *   A 0/1536, B 0,53/1493, H 0,10/1493, I 0,16/1493, N 0/1392, G 0/911, E 2,06/1147, C 4,3/1147,
 *   D 6,67/1320, F 6,67/1147, P 0,02/723, S 0,8/723, K 6,67/723, Q 0,002/20.
 * Linien: Liquidus ABCD, Solidus AHIECF, GOS (A3), GP, ES (A_cm), PQ, PSK (A1, eutektoid), ECF (eutektisch).
 * Die Linien werden zwischen den Eckpunkten geradlinig angenähert (Schema; reale Linien sind leicht gekrümmt).
 *
 * Gefügeanteile bei Raumtemperatur über das Hebelgesetz (ohne Tertiärzementit, langsame Abkühlung):
 *   C ≤ 0,8 %:  Perlit = (C − 0,02)/(0,8 − 0,02), Ferrit = Rest
 *   0,8 < C ≤ 2,06 %:  Sekundärzementit = (C − 0,8)/(6,67 − 0,8), Perlit = Rest
 * Datensatz „international“ nach Callister, Materials Science and Engineering (Fig. 9.24; öffentlich in den
 * Vorlesungsfolien MSE 170, University of Washington): P 0,022 %, S 0,76 %/727 °C, E 2,14 %, C 4,30 %/1148 °C, Fe₃C 6,70 %.
 * Kohlenstoffäquivalent CEV = C + Mn/6 + (Cr + Mo + V)/5 + (Ni + Cu)/15 (IIW; Grenzwerte nach DIN EN 10025-2).
 * Reiner Rechenkern – geprüft in tests/eisenKohlenstoff.test.ts.
 */
import { type Hinweis, istEndlich, muss, hatFehler } from './plausibilitaet';

export interface FeCPunkt { c: number; t: number }

/** Eckpunkte des metastabilen Diagramms (deutschsprachige Lehrbuchwerte, Diagrammgeometrie) */
export const FE_C_PUNKTE = {
  A: { c: 0, t: 1536 }, B: { c: 0.53, t: 1493 }, H: { c: 0.1, t: 1493 }, I: { c: 0.16, t: 1493 },
  N: { c: 0, t: 1392 }, G: { c: 0, t: 911 }, E: { c: 2.06, t: 1147 }, C: { c: 4.3, t: 1147 },
  D: { c: 6.67, t: 1320 }, F: { c: 6.67, t: 1147 }, P: { c: 0.02, t: 723 }, S: { c: 0.8, t: 723 },
  K: { c: 6.67, t: 723 }, Q: { c: 0.002, t: 20 },
} as const satisfies Record<string, FeCPunkt>;

export type FeCDatensatz = 'lehrbuch' | 'international';

/** Kennwerte für das Hebelgesetz je Datensatz [Massen-% C, °C] */
export const FE_C_KENNWERTE: Readonly<Record<FeCDatensatz, { cP: number; cS: number; tS: number; cE: number; cC: number; tC: number; cZ: number; quelle: string }>> = {
  lehrbuch: { cP: 0.02, cS: 0.8, tS: 723, cE: 2.06, cC: 4.3, tC: 1147, cZ: 6.67, quelle: 'Deutschsprachige Lehrbuchwerte (chemie.de-Lexikon „Eisen-Kohlenstoff-Diagramm“)' },
  international: { cP: 0.022, cS: 0.76, tS: 727, cE: 2.14, cC: 4.3, tC: 1148, cZ: 6.7, quelle: 'Callister, Materials Science and Engineering, Fig. 9.24 (MSE 170, University of Washington)' },
};

/** Linien des Diagramms als Polygonzüge (für Zeichnung und Textalternative) */
export const FE_C_LINIEN: readonly { id: string; name: string; punkte: readonly (keyof typeof FE_C_PUNKTE)[] }[] = [
  { id: 'liquidus', name: 'Liquiduslinie ABCD', punkte: ['A', 'B', 'C', 'D'] },
  { id: 'solidus', name: 'Soliduslinie AHIECF', punkte: ['A', 'H', 'I', 'E', 'C', 'F'] },
  { id: 'peritektikale', name: 'Peritektikale HIB (1493 °C)', punkte: ['H', 'I', 'B'] },
  { id: 'hn', name: 'Linie HN (δ/δ+γ)', punkte: ['H', 'N'] },
  { id: 'in', name: 'Linie IN (γ/δ+γ)', punkte: ['I', 'N'] },
  { id: 'gos', name: 'Linie GOS (A3)', punkte: ['G', 'S'] },
  { id: 'gp', name: 'Linie GP (α/α+γ)', punkte: ['G', 'P'] },
  { id: 'es', name: 'Linie ES (A_cm, Sekundärzementit)', punkte: ['E', 'S'] },
  { id: 'pq', name: 'Linie PQ (Tertiärzementit)', punkte: ['P', 'Q'] },
  { id: 'psk', name: 'Linie PSK (A1, eutektoid 723 °C)', punkte: ['P', 'S', 'K'] },
  { id: 'ecf', name: 'Linie ECF (eutektisch 1147 °C)', punkte: ['E', 'C', 'F'] },
];

const P = FE_C_PUNKTE;
/** lineare Interpolation: c auf der Geraden p→q zur Temperatur t */
const cBei = (p: FeCPunkt, q: FeCPunkt, t: number) => p.c + ((q.c - p.c) * (t - p.t)) / (q.t - p.t);
/** lineare Interpolation: t auf der Geraden p→q zum Gehalt c */
const tBei = (p: FeCPunkt, q: FeCPunkt, c: number) => p.t + ((q.t - p.t) * (c - p.c)) / (q.c - p.c);

/** Liquidustemperatur [°C] zum C-Gehalt (ABCD) */
export function liquidus(c: number): number {
  if (c <= P.B.c) return tBei(P.A, P.B, c);
  if (c <= P.C.c) return tBei(P.B, P.C, c);
  return tBei(P.C, P.D, c);
}

/** Solidustemperatur [°C] zum C-Gehalt (AHIECF) */
export function solidus(c: number): number {
  if (c <= P.H.c) return tBei(P.A, P.H, c);
  if (c <= P.I.c) return P.H.t;
  if (c <= P.E.c) return tBei(P.I, P.E, c);
  return P.E.t;
}

export type Phase = 'Schmelze' | 'δ-Ferrit' | 'Austenit γ' | 'Ferrit α' | 'Zementit Fe₃C';

export interface FeCZustand {
  /** Phasen im Gleichgewicht (1 oder 2) */
  phasen: Phase[];
  /** Kurzbezeichnung des Phasenfelds, z. B. „α + γ“ */
  feld: string;
  /** Gefügebezeichnung (nach langsamer Abkühlung bis zu dieser Temperatur) */
  gefuege: string;
  /** Konode im Zweiphasenfeld: Zusammensetzung der beiden Phasen [% C] und Massenanteile [-] */
  konode?: { cLinks: number; cRechts: number; anteilLinks: number; anteilRechts: number };
  /** Stahl (≤ 2,06 % C) oder Gusseisen */
  werkstoff: 'Stahl' | 'Gusseisen';
  hinweise: Hinweis[];
}

const konode = (c: number, cl: number, cr: number) => {
  const rechts = cr > cl ? Math.min(1, Math.max(0, (c - cl) / (cr - cl))) : 0;
  return { cLinks: cl, cRechts: cr, anteilLinks: 1 - rechts, anteilRechts: rechts };
};

/** Gefügebezeichnung unterhalb von 723 °C (langsame Abkühlung, metastabil) */
export function gefuegeRaumtemperatur(c: number): string {
  if (c <= P.P.c) return 'Ferrit (ggf. mit Tertiärzementit)';
  if (c < P.S.c) return 'Ferrit + Perlit (untereutektoid)';
  if (c === P.S.c) return 'Perlit (eutektoid)';
  if (c <= P.E.c) return 'Perlit + Sekundärzementit (übereutektoid)';
  if (c < P.C.c) return 'Perlit + Sekundärzementit + Ledeburit II (untereutektisch)';
  if (c === P.C.c) return 'Ledeburit II (eutektisch)';
  return 'Ledeburit II + Primärzementit (übereutektisch)';
}

/** Phasenfeld, Gefüge und Konode zum Punkt (C-Gehalt [Massen-%], Temperatur [°C]) – Lehrbuchgeometrie */
export function feCZustand(c: number, t: number): FeCZustand {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(c, t), 'eingabe', 'Kohlenstoffgehalt und Temperatur müssen Zahlen sein.');
  if (!hatFehler(hinweise)) {
    muss(hinweise, c >= 0 && c <= P.K.c, 'c', 'Der Kohlenstoffgehalt muss zwischen 0 und 6,67 % liegen (metastabiles System bis Fe₃C).');
    muss(hinweise, t >= 0 && t <= 1700, 't', 'Die Temperatur muss zwischen 0 und 1 700 °C liegen.');
  }
  const werkstoff: FeCZustand['werkstoff'] = c <= P.E.c ? 'Stahl' : 'Gusseisen';
  if (hatFehler(hinweise)) return { phasen: [], feld: '–', gefuege: '–', werkstoff, hinweise };
  const z = (phasen: Phase[], feld: string, gefuege: string, k?: FeCZustand['konode']): FeCZustand => ({ phasen, feld, gefuege, konode: k, werkstoff, hinweise });

  const tL = liquidus(c);
  if (t >= tL) return z(['Schmelze'], 'S', 'Schmelze');
  // Bereich oberhalb der Peritektikalen
  if (t > P.H.t) {
    const cSol = cBei(P.A, P.H, t), cLiq = cBei(P.A, P.B, t);
    if (c <= cSol) return z(['δ-Ferrit'], 'δ', 'δ-Ferrit');
    return z(['Schmelze', 'δ-Ferrit'], 'S + δ', 'Schmelze + δ-Mischkristalle', konode(c, cSol, cLiq));
  }
  // Schmelze + Austenit bzw. Schmelze + Primärzementit (zwischen Solidus und Liquidus)
  if (t > solidus(c) && t > P.E.t) {
    if (c > P.C.c) return z(['Schmelze', 'Zementit Fe₃C'], 'S + Fe₃C', 'Schmelze + Primärzementit', konode(c, cBei(P.C, P.D, t), P.D.c));
    if (c >= P.I.c || t <= P.N.t) return z(['Schmelze', 'Austenit γ'], 'S + γ', 'Schmelze + Austenit', konode(c, t >= P.I.t ? P.I.c : cBei(P.I, P.E, t), cBei(P.B, P.C, t)));
  }
  if (t > P.E.t) {
    // δ-Bereich zwischen 1392 und 1493 °C bei geringen C-Gehalten
    if (t > P.N.t) {
      const cHN = cBei(P.N, P.H, t), cIN = cBei(P.N, P.I, t);
      if (c <= cHN) return z(['δ-Ferrit'], 'δ', 'δ-Ferrit');
      if (c < cIN) return z(['δ-Ferrit', 'Austenit γ'], 'δ + γ', 'δ-Ferrit + Austenit', konode(c, cHN, cIN));
    }
    if (c <= P.E.c) {
      if (c < cBei(P.S, P.E, t) || t >= P.E.t) return z(['Austenit γ'], 'γ', 'Austenit');
      return z(['Austenit γ', 'Zementit Fe₃C'], 'γ + Fe₃C', 'Austenit + Sekundärzementit', konode(c, cBei(P.S, P.E, t), P.K.c));
    }
    return z(['Austenit γ'], 'γ', 'Austenit');
  }
  // 723 °C < t ≤ 1147 °C
  if (t > P.S.t) {
    const cES = cBei(P.S, P.E, t);
    if (c > P.E.c) {
      const g = c < P.C.c ? 'Ledeburit I + Austenit (+ Sekundärzementit)' : c === P.C.c ? 'Ledeburit I' : 'Ledeburit I + Primärzementit';
      return z(['Austenit γ', 'Zementit Fe₃C'], 'γ + Fe₃C', g, konode(c, cES, P.K.c));
    }
    if (t < P.G.t) {
      const cGP = cBei(P.P, P.G, t), cGS = cBei(P.S, P.G, t);
      if (c <= cGP) return z(['Ferrit α'], 'α', 'Ferrit');
      if (c < cGS) return z(['Ferrit α', 'Austenit γ'], 'α + γ', 'Ferrit + Austenit', konode(c, cGP, cGS));
    }
    if (c <= cES) return z(['Austenit γ'], 'γ', 'Austenit');
    return z(['Austenit γ', 'Zementit Fe₃C'], 'γ + Fe₃C', 'Austenit + Sekundärzementit', konode(c, cES, P.K.c));
  }
  // t ≤ 723 °C: Ferrit + Zementit (bzw. Ferrit allein links von PQ)
  const cPQ = t <= P.Q.t ? P.Q.c : cBei(P.Q, P.P, t);
  if (c <= cPQ) return z(['Ferrit α'], 'α', 'Ferrit');
  return z(['Ferrit α', 'Zementit Fe₃C'], 'α + Fe₃C', gefuegeRaumtemperatur(c), konode(c, cPQ, P.K.c));
}

export interface GefuegeAnteile {
  ferrit: number;
  perlit: number;
  sekundaerzementit: number;
  ledeburit: number;
  primaerzementit: number;
  /** Phasenanteil Zementit (gesamt, Ferrit + Fe₃C bei 723 °C) [-] */
  zementitGesamt: number;
  hinweise: Hinweis[];
}

/** Gefügeanteile bei Raumtemperatur (Hebelgesetz) für C [Massen-%] und Datensatz */
export function gefuegeAnteile(c: number, datensatz: FeCDatensatz = 'lehrbuch'): GefuegeAnteile {
  const hinweise: Hinweis[] = [];
  const k = FE_C_KENNWERTE[datensatz];
  muss(hinweise, istEndlich(c) && c >= 0 && c <= k.cZ, 'c', `Der Kohlenstoffgehalt muss zwischen 0 und ${datensatz === 'lehrbuch' ? '6,67' : '6,70'} % liegen.`);
  const null_ = { ferrit: NaN, perlit: NaN, sekundaerzementit: NaN, ledeburit: NaN, primaerzementit: NaN, zementitGesamt: NaN, hinweise };
  if (hatFehler(hinweise)) return null_;
  const zementitGesamt = c <= k.cP ? 0 : (c - k.cP) / (k.cZ - k.cP);
  const a = { ferrit: 0, perlit: 0, sekundaerzementit: 0, ledeburit: 0, primaerzementit: 0, zementitGesamt, hinweise };
  if (c <= k.cP) {
    a.ferrit = 1;
  } else if (c <= k.cS) {
    a.perlit = (c - k.cP) / (k.cS - k.cP);
    a.ferrit = 1 - a.perlit;
  } else if (c <= k.cE) {
    a.sekundaerzementit = (c - k.cS) / (k.cZ - k.cS);
    a.perlit = 1 - a.sekundaerzementit;
  } else if (c <= k.cC) {
    // Primärer Austenit (c_E) und Ledeburit (c_C) bei der eutektischen Temperatur; der Austenit zerfällt in Perlit + Sekundärzementit
    a.ledeburit = (c - k.cE) / (k.cC - k.cE);
    const austenit = 1 - a.ledeburit;
    a.sekundaerzementit = austenit * (k.cE - k.cS) / (k.cZ - k.cS);
    a.perlit = austenit - a.sekundaerzementit;
  } else {
    a.primaerzementit = (c - k.cC) / (k.cZ - k.cC);
    a.ledeburit = 1 - a.primaerzementit;
  }
  if (c > k.cE) hinweise.push({ stufe: 'warnung', feld: 'c', text: 'Über 2,06 % C: Gusseisen; im metastabilen System als weißes Gusseisen mit Ledeburit. Graues Gusseisen erstarrt nach dem stabilen System Fe–C (Grafit).' });
  if (c > 0 && c < 0.05) hinweise.push({ stufe: 'warnung', feld: 'c', text: 'Sehr geringer C-Gehalt: Der Tertiärzementit aus der Löslichkeitsabnahme (Linie PQ) ist im Hebelgesetz nicht berücksichtigt.' });
  return a;
}

// ---------------------------------------------------------------------------------------------
// Schweißeignung: Kohlenstoffäquivalent
// ---------------------------------------------------------------------------------------------

export interface Legierung { C: number; Mn: number; Cr?: number; Mo?: number; V?: number; Ni?: number; Cu?: number }

/** Kohlenstoffäquivalent CEV = C + Mn/6 + (Cr + Mo + V)/5 + (Ni + Cu)/15 [Massen-%] (IIW, DIN EN 10025-2) */
export function cev(l: Legierung): number {
  return l.C + l.Mn / 6 + ((l.Cr ?? 0) + (l.Mo ?? 0) + (l.V ?? 0)) / 5 + ((l.Ni ?? 0) + (l.Cu ?? 0)) / 15;
}

/**
 * Höchstwerte CEV (Schmelzanalyse) und C nach EN 10025-2:2004, Tab. 2, für Nenndicken ≤ 30 mm bzw. > 30–40 mm
 * (öffentliche Wiedergabe: CERN, „Steel Grades 2“). Abgleich mit DIN EN 10025-2:2019-10 vorläufig, F-Freigabe.
 */
export const CEV_GRENZEN = {
  S235JR: { cevBis30: 0.35, cevBis40: 0.35, cMax: 0.17 },
  S355J2: { cevBis30: 0.45, cevBis40: 0.47, cMax: 0.2 },
} as const;

export type Schweisseignung = 'ausgezeichnet' | 'sehr gut' | 'gut' | 'mäßig' | 'schlecht';

/** Einstufung nach üblicher Lehrbuchskala (IIW-Formel): ≤ 0,35 ausgezeichnet … > 0,50 schlecht */
export function schweisseignung(cevWert: number): { stufe: Schweisseignung; vorwaermen: string } {
  const stufe: Schweisseignung = cevWert <= 0.35 ? 'ausgezeichnet' : cevWert <= 0.4 ? 'sehr gut' : cevWert <= 0.45 ? 'gut' : cevWert <= 0.5 ? 'mäßig' : 'schlecht';
  const vorwaermen = cevWert <= 0.4 ? 'in der Regel ohne Vorwärmen schweißbar' : cevWert <= 0.6 ? 'Vorwärmen kann erforderlich sein (Blechdicke, Wasserstoff, Wärmeeinbringung)' : 'Vorwärmen erforderlich, ggf. Wärmenachbehandlung';
  return { stufe, vorwaermen };
}

export interface CevErgebnis { cev: number; stufe: Schweisseignung; vorwaermen: string; hinweise: Hinweis[] }

/** CEV mit Plausibilitätsprüfung (Massen-% je Element) */
export function cevBewertung(l: Legierung): CevErgebnis {
  const hinweise: Hinweis[] = [];
  const werte = [l.C, l.Mn, l.Cr ?? 0, l.Mo ?? 0, l.V ?? 0, l.Ni ?? 0, l.Cu ?? 0];
  muss(hinweise, istEndlich(...werte), 'eingabe', 'Alle Gehalte müssen Zahlen sein.');
  if (!hatFehler(hinweise)) muss(hinweise, werte.every(w => w >= 0), 'eingabe', 'Gehalte können nicht negativ sein.');
  if (hatFehler(hinweise)) return { cev: NaN, stufe: 'schlecht', vorwaermen: '–', hinweise };
  const w = cev(l);
  if (l.C > 0.25) hinweise.push({ stufe: 'warnung', feld: 'C', text: 'Über 0,25 % C liegt der Gehalt oberhalb der Höchstwerte unlegierter Baustähle nach DIN EN 10025-2 (0,17–0,24 %).' });
  if (l.Mn > 1.7) hinweise.push({ stufe: 'warnung', feld: 'Mn', text: 'Mangan über 1,7 % ist für unlegierte Baustähle unüblich – Eingabe prüfen.' });
  return { cev: w, ...schweisseignung(w), hinweise };
}
