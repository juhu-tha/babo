/**
 * Mauerwerk nach Eurocode 6 (Umsetzungsplan Phase 4, AP 4.7). Reiner Rechenkern – geprüft in tests/mauerwerk.test.ts.
 *
 * 1. Vereinfachtes Verfahren nach DIN EN 1996-3/NA für zweiseitig gehaltene, vertikal belastete Wände:
 *      N_Rd = Φ · f_d · A,  f_d = ζ · f_k / γ_M  (ζ = 0,85; γ_M = 1,5),  Φ = min(Φ1; Φ2)
 *      Φ1 (Endauflager, Deckenverdrehung) = 1,6 − l_f/6 ≤ 0,9·a/t für f_k ≥ 1,8 N/mm²,
 *                                         = 1,6 − l_f/5 ≤ 0,9·a/t für f_k < 1,8 N/mm²,
 *                                         = 0,333 unter der Dachdecke (oberstes Geschoss),
 *                                         = 0,9 bei Innenwänden (Zwischenauflager)
 *      Φ2 (Knicken in Wandmitte)          = 0,85·a/t − 0,0011·(h_ef/t)²,  h_ef = ρ2 · h
 *    Öffentliche Quellen für die Formeln: mb AEC Software, mb-news 7/2013, S. 34–36 (Mauerwerksnachweis,
 *    Φ1/Φ2-Formeln mit Rechenbeispiel Pos. W4); KS-Merkblatt „Bemessung von Mauerwerkswänden –
 *    Tragfähigkeitstafeln“ (Bundesverband Kalksandsteinindustrie, Gl. (1)–(4) und Beispiele S. 3).
 *    ρ2 = 0,75/0,90/1,00 (t ≤ 175 / ≤ 250 / > 250 mm) bei voll aufliegender Decke (a = t), sonst 1,0:
 *    aus allen Zeilen der KS-Tragfähigkeitstafel zurückgerechnet (siehe Test) – vorläufig, F-Freigabe.
 *
 * 2. Charakteristische Druckfestigkeit f_k nach NA-Ansatz: In Deutschland gelten statt der
 *    EN-Empfehlungswerte K eigene Parameter bzw. Tabellenwerte (DIN EN 1996-1-1/NA, DIN EN 1996-3/NA).
 *    Hier: Tabellenwerte aus öffentlich zugänglichen Herstellerunterlagen (Quelle je Eintrag), alle
 *    als „vorläufig, F-Freigabe“ gekennzeichnet, bis sie am Normtext bestätigt sind.
 *    Die EN-Empfehlung f_k = K·f_b^α·f_m^β bleibt nur als Vergleichswert (fkEmpfehlungEN).
 *
 * Lehr- und Vorbemessungswerkzeug; ersetzt keinen bauaufsichtlichen Nachweis.
 */
import { type Hinweis, bereich, hatFehler, istEndlich, muss } from './plausibilitaet';
import { formatDeZahl } from '../utils/numberFormat';

/** Dauerstandsbeiwert ζ nach NA (DE) */
export const ZETA_MW = 0.85;
/** Teilsicherheitsbeiwert γ_M für Mauerwerk, ständige und vorübergehende Bemessungssituation */
export const GAMMA_M_MW = 1.5;
/** Grenzschlankheit h_ef/t nach DIN EN 1996-1-1, 5.5.1.4 */
export const SCHLANKHEIT_MAX = 27;
/** Größte Deckenstützweite, für die die hier abgebildeten Φ1-Ansätze und Herstellertafeln gelten [m] */
export const LF_MAX = 6.0;

// ---------------------------------------------------------------------------------------------------
// f_k nach NA-Ansatz (Tabellenwerte)
// ---------------------------------------------------------------------------------------------------

export type MoertelNA = 'NM II' | 'NM IIa' | 'NM III' | 'NM IIIa' | 'DM' | 'LM 36';

export interface FkTafelEintrag {
  id: string;
  stein: string;
  sfk: number;
  moertel: MoertelNA;
  /** charakteristische Mauerwerksdruckfestigkeit [N/mm²] */
  fk: number;
  quelle: string;
  /** true: Wert noch nicht am Normtext (NA DE) bzw. an der Zulassung bestätigt */
  vorlaeufig: boolean;
}

const Q_KS = 'BV Kalksandsteinindustrie, KS-Themenheft 9 „Bemessung“, S. 14, Tafeln 14–16 (Werte nach DIN EN 1996-3/NA)';
const Q_LUECKING = 'Lücking, Produkthandbuch 2024, Datenblatt HLz B 12-0,90 (Herstellerangabe)';

const ks = (stein: string, kurz: string, sfk: number, moertel: MoertelNA, fk: number): FkTafelEintrag =>
  ({ id: `${kurz}-${sfk}-${moertel.replace(/\s/g, '')}`, stein, sfk, moertel, fk, quelle: Q_KS, vorlaeufig: true });

/** f_k-Tabellenwerte (NA-Ansatz) aus öffentlich zugänglichen Herstellerunterlagen */
export const FK_TAFEL_NA: readonly FkTafelEintrag[] = [
  // Kalksand-Vollsteine und -Blocksteine (KS, KS-R), Normalmauermörtel – Tafel 15
  ...([[12, [5.4, 6.0, 6.7, 7.5]], [16, [6.4, 7.1, 8.0, 8.9]], [20, [7.2, 8.1, 9.1, 10.1]], [28, [8.8, 9.9, 11.0, 12.4]]] as const)
    .flatMap(([sfk, w]) => (['NM II', 'NM IIa', 'NM III', 'NM IIIa'] as const).map((m, i) => ks('Kalksand-Vollstein/-Blockstein (KS)', 'KS', sfk, m, w[i]))),
  // Kalksand-Loch- und -Hohlblocksteine (KS L, KS L-R), Normalmauermörtel – Tafel 14
  ...([[10, [3.5, 4.5, 5.0, 5.6]], [12, [3.9, 5.0, 5.6, 6.3]], [16, [4.6, 5.9, 6.6, 7.4]]] as const)
    .flatMap(([sfk, w]) => (['NM II', 'NM IIa', 'NM III', 'NM IIIa'] as const).map((m, i) => ks('Kalksand-Lochstein (KS L)', 'KSL', sfk, m, w[i]))),
  // Kalksand-Planelemente (KS XL), Dünnbettmörtel – Tafel 16
  ...([[12, 9.4], [16, 11.2], [20, 12.9], [28, 16.0]] as const).map(([sfk, fk]) => ks('Kalksand-Planelement (KS XL)', 'KSXL', sfk, 'DM', fk)),
  // Kalksand-Plansteine (KS P, Lochanteil ≤ 15 %), Dünnbettmörtel – Tafel 16 (Spaltenzuordnung F-Freigabe)
  ...([[12, 7.0], [16, 8.8], [20, 10.5]] as const).map(([sfk, fk]) => ks('Kalksand-Planstein (KS P)', 'KSP', sfk, 'DM', fk)),
  // Kalksand-Plansteine mit Lochanteil > 15 % (KS L-P), Dünnbettmörtel – Tafel 16 (Spaltenzuordnung F-Freigabe)
  ...([[10, 5.0], [12, 5.6], [16, 6.6]] as const).map(([sfk, fk]) => ks('Kalksand-Planstein gelocht (KS L-P)', 'KSLP', sfk, 'DM', fk)),
  // Hochlochziegel HLz B 12-0,90 (Herstellerangabe)
  ...([['NM II', 3.8], ['NM IIa', 5.0], ['NM III', 5.7], ['LM 36', 3.5]] as const).map(([m, fk]): FkTafelEintrag =>
    ({ id: `HLZB-12-${m.replace(/\s/g, '')}`, stein: 'Hochlochziegel HLz B (Rohdichte 0,9)', sfk: 12, moertel: m, fk, quelle: Q_LUECKING, vorlaeufig: true })),
];

/** Sucht den f_k-Tabellenwert (NA-Ansatz); null, wenn die Kombination hier nicht hinterlegt ist. */
export function fkNA(id: string): FkTafelEintrag | null {
  return FK_TAFEL_NA.find(e => e.id === id) ?? null;
}

export type MoertelEN = 'NM' | 'LM' | 'DM';

/**
 * EN-Empfehlung (nur Vergleich, nicht für Deutschland): f_k = K · f_b^α · f_m^β nach EN 1996-1-1, Gl. (3.1)–(3.4)
 * NM: α = 0,7, β = 0,3; LM: α = 0,7 ohne f_m; DM: α = 0,85 (Gruppe 1) bzw. 0,7 (Gruppe 2, Hochlochziegel).
 */
export function fkEmpfehlungEN(K: number, fb: number, fm: number, moertel: MoertelEN, gruppe2DM: boolean): number {
  if (moertel === 'DM') return K * Math.pow(fb, gruppe2DM ? 0.7 : 0.85);
  if (moertel === 'LM') return K * Math.pow(fb, 0.7);
  return K * Math.pow(fb, 0.7) * Math.pow(fm, 0.3);
}

/** Bemessungswert der Druckfestigkeit f_d = ζ · f_k / γ_M */
export const fdAusFk = (fk: number, zeta = ZETA_MW, gammaM = GAMMA_M_MW) => (zeta * fk) / gammaM;

/**
 * Abminderung am Wandkopf/-fuß aus Lastausmitte (DIN EN 1996-1-1, 6.1.2.2): Φ_i = 1 − 2·e/t.
 * Für e ≥ t/2 liegt die Resultierende außerhalb des Querschnitts – dann ist Φ_i = 0 (keine Drucktragfähigkeit).
 */
export function phiAusmitte(e: number, t: number): number {
  if (!(t > 0) || 2 * e >= t) return 0;
  return 1 - (2 * e) / t;
}

// ---------------------------------------------------------------------------------------------------
// Vereinfachtes Verfahren DIN EN 1996-3/NA
// ---------------------------------------------------------------------------------------------------

/** zwischen: Endauflager einer Zwischendecke; dach: Endauflager unter der Dachdecke (oberstes Geschoss); innen: Innenwand */
export type WandLage = 'zwischen' | 'dach' | 'innen';

/** Knicklängenbeiwert ρ2 für zweiseitig gehaltene Wände (vorläufig, F-Freigabe) */
export function rho2(t_mm: number, aDurchT: number): number {
  if (aDurchT < 1) return 1.0;
  if (t_mm <= 175) return 0.75;
  if (t_mm <= 250) return 0.9;
  return 1.0;
}

/** Φ1 – Endauflager / Deckenverdrehung */
export function phi1(lage: WandLage, lf: number, fk: number, aDurchT: number): number {
  if (lage === 'dach') return 0.333;
  if (lage === 'innen') return 0.9;
  const roh = fk >= 1.8 ? 1.6 - lf / 6 : 1.6 - lf / 5;
  return Math.min(roh, 0.9 * aDurchT);
}

/** Φ2 – Knicken in Wandhöhenmitte */
export function phi2(hEf: number, t: number, aDurchT: number): number {
  return 0.85 * aDurchT - 0.0011 * (hEf / t) ** 2;
}

export interface WandEingabe {
  lage: WandLage;
  /** lichte Wandhöhe [m] */
  h: number;
  /** Wanddicke [mm] */
  t: number;
  /** Deckenauflagertiefe [mm] (a ≤ t) */
  a: number;
  /** Deckenstützweite [m] (bei zweiachsig gespannten Decken die kürzere) */
  lf: number;
  /** charakteristische Mauerwerksdruckfestigkeit [N/mm²] */
  fk: number;
  /** Bemessungswert der Normalkraft je m Wandlänge [kN/m] */
  nEd: number;
}

export interface WandErgebnis {
  aDurchT: number;
  rho2: number;
  /** Knicklänge [m] */
  hEf: number;
  schlankheit: number;
  phi1: number;
  phi2: number;
  phi: number;
  massgebend: 'phi1' | 'phi2';
  /** [N/mm²] */
  fd: number;
  /** Tafelwert T = Φ · t · ζ / γ_M [kN/m je N/mm² f_k], wie in Herstellertafeln */
  tafelwert: number;
  /** Bemessungswert der aufnehmbaren Normalkraft je m [kN/m] */
  nRd: number;
  /** Ausnutzung N_Ed / N_Rd [–] */
  eta: number;
  nachgewiesen: boolean;
  hinweise: Hinweis[];
}

export function bemesseWandVereinfacht(e: WandEingabe): WandErgebnis {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(e.h, e.t, e.a, e.lf, e.fk, e.nEd), 'eingabe', 'Alle Eingaben müssen Zahlen sein.');
  if (!hatFehler(hinweise)) {
    muss(hinweise, e.h > 0, 'h', 'Die lichte Wandhöhe muss größer als 0 sein.');
    muss(hinweise, e.t > 0, 't', 'Die Wanddicke muss größer als 0 sein.');
    muss(hinweise, e.a > 0 && e.a <= e.t, 'a', 'Die Auflagertiefe a muss größer als 0 und höchstens gleich der Wanddicke t sein.');
    muss(hinweise, e.lf > 0 || e.lage !== 'zwischen', 'lf', 'Die Deckenstützweite muss größer als 0 sein.');
    muss(hinweise, e.fk > 0, 'fk', 'Die Mauerwerksdruckfestigkeit f_k muss größer als 0 sein.');
    muss(hinweise, e.nEd >= 0, 'nEd', 'N_Ed ist der Betrag der Druckkraft und muss ≥ 0 sein.');
  }
  const leer: WandErgebnis = {
    aDurchT: 0, rho2: 0, hEf: 0, schlankheit: 0, phi1: 0, phi2: 0, phi: 0, massgebend: 'phi2', fd: 0, tafelwert: 0, nRd: 0, eta: 0,
    nachgewiesen: false, hinweise,
  };
  if (hatFehler(hinweise)) return leer;

  const aDurchT = e.a / e.t;
  const r2 = rho2(e.t, aDurchT);
  const hEf = r2 * e.h;
  const schlankheit = (hEf * 1000) / e.t;
  const p1 = phi1(e.lage, e.lf, e.fk, aDurchT);
  const p2 = phi2(hEf * 1000, e.t, aDurchT);
  if (p2 <= 0 || p1 <= 0) {
    hinweise.push({ stufe: 'fehler', feld: 'h', text: `Φ = min(Φ1; Φ2) ≤ 0 (h_ef/t = ${formatDeZahl(schlankheit, 1)}): Die Wand ist im vereinfachten Verfahren nicht tragfähig – Wanddicke erhöhen oder Wandhöhe verringern.` });
    return { ...leer, aDurchT, rho2: r2, hEf, schlankheit, phi1: p1, phi2: p2 };
  }
  const phi = Math.min(p1, p2);
  const fd = fdAusFk(e.fk);
  const nRd = phi * e.t * fd; // [mm · N/mm² = N/mm = kN/m]
  const tafelwert = (phi * e.t * ZETA_MW) / GAMMA_M_MW;
  const eta = e.nEd / nRd;

  bereich(hinweise, 'h', schlankheit, 0, SCHLANKHEIT_MAX, `Schlankheit h_ef/t > ${SCHLANKHEIT_MAX}: unzulässig nach DIN EN 1996-1-1, 5.5.1.4.`);
  if (e.lage === 'zwischen') bereich(hinweise, 'lf', e.lf, 0, LF_MAX, `Deckenstützweite l_f > ${formatDeZahl(LF_MAX, 1)} m: außerhalb der hier abgebildeten Anwendungsgrenzen des vereinfachten Verfahrens.`);
  if (e.h > 2.75) hinweise.push({ stufe: 'warnung', feld: 'h', text: 'Lichte Wandhöhe > 2,75 m: im vereinfachten Verfahren nur unter den erweiterten Bedingungen von DIN EN 1996-3/NA:2019-12, Tab. NA.2 (Wanddicke, Windzone, Steinfestigkeit) – gesondert prüfen.' });
  if (e.t < 115) hinweise.push({ stufe: 'warnung', feld: 't', text: 'Wanddicke < 115 mm: für tragende Wände im vereinfachten Verfahren nicht vorgesehen.' });
  if (aDurchT < 2 / 3 - 1e-9) hinweise.push({ stufe: 'warnung', feld: 'a', text: 'Auflagertiefe a < 2/3·t: außerhalb der hier abgebildeten Fälle (Herstellertafeln für a/t = 1 und 2/3).' });
  if (eta > 1) hinweise.push({ stufe: 'warnung', feld: 'nEd', text: 'N_Ed > N_Rd: Der Nachweis ist nicht erfüllt.' });

  return { aDurchT, rho2: r2, hEf, schlankheit, phi1: p1, phi2: p2, phi, massgebend: p1 <= p2 ? 'phi1' : 'phi2', fd, tafelwert, nRd, eta,
    nachgewiesen: eta <= 1 && schlankheit <= SCHLANKHEIT_MAX, hinweise };
}
