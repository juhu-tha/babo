/**
 * Rechenkern „Kennwerte und Bemessungswerte nach Eurocode“ (Modul ec_kennwerte, 02.11.2026).
 *
 * Vom Kennwert zum Bemessungswert, baustoffübergreifend und nur aus den zentralen Konstanten:
 *   Beton        f_cd = α_cc · f_ck / γ_C               (fcdBeton, ALPHA_CC, GAMMA_C – src/data/kennwerte.ts)
 *                f_ctd = α_ct · f_ctk;0{,}05 / γ_C        (α_ct = 0,85 nach NA, EC2_BETON_NA)
 *   Betonstahl   f_yd = f_yk / γ_S                     (BETONSTAHL, GAMMA_S)
 *   Baustahl     f_y / γ_M0, f_y / γ_M1, 0,9 · f_u / γ_M2  (BAUSTAHL_EC3, EC3_NA_DE)
 *   Holz         X_d = k_mod · X_k / γ_M               (HOLZ_EN338, BSH_EN14080, KMOD, bemessungswert – holzbau.ts)
 *   Mauerwerk    f_d = ζ · f_k / γ_M                   (FK_TAFEL_NA, fdAusFk, GAMMA_M_MW – mauerwerk.ts)
 *
 * Statistik: charakteristischer Wert als 5-%-Quantil aus einer Prüfserie nach DIN EN 1990, Anhang D (D7.2):
 *   Normalverteilung   X_k = m_x − k_n · s_x  (V_X unbekannt)   bzw.  X_k = m_x · (1 − k_n · V_X)  (V_X bekannt)
 *   Lognormalverteilung X_k = exp(m_y − k_n · s_y), y = ln x  (V_X bekannt: s_y = √(ln(1 + V_X²)))
 *   k_n nach Tab. D1 (KN_TAB in statistik.ts für V_X unbekannt, KN_TAB_BEKANNT hier für V_X bekannt).
 * Vorhaltemaß f_cm − f_ck = 8 N/mm² (EC2 Tab. 3.1) entspricht 1,645 · σ mit σ ≈ 4,9 N/mm².
 *
 * Ungültige Eingabe → kein Zahlenergebnis (nurGueltig, Anzeige „–“). Reiner Rechenkern – geprüft in tests/ecKennwerte.test.ts.
 */
import { type Hinweis, istEndlich, muss, hatFehler, nurGueltig } from './plausibilitaet';
import {
  betonNachKlasse, fcdBeton, ALPHA_CC, GAMMA_C, GAMMA_S, BETONSTAHL, BAUSTAHL_EC3, E_BETONSTAHL,
  HOLZ_EN338, BSH_EN14080, holzKennwerte, type BetonstahlSorte, type BaustahlGuete,
} from '../data/kennwerte';
import { EC2_BETON_NA } from './betonkennwerte';
import { EC3_NA_DE } from './stahlbau';
import { KMOD, GAMMA_M_HOLZ, GAMMA_M_HOLZ_AUSSERGEWOEHNLICH, bemessungswert, type Nutzungsklasse, type KLED } from './holzbau';
import { FK_TAFEL_NA, fkNA, fdAusFk, ZETA_MW, GAMMA_M_MW, GAMMA_M_MW_AUSSERGEWOEHNLICH } from './mauerwerk';
import { stichprobe, fraktilfaktorKn, normalCDF } from './statistik';
import { formatDeZahl } from '../utils/numberFormat';
import { K_FRAKTIL_5 } from './festbetonStatistik';

export type EcBaustoff = 'beton' | 'betonstahl' | 'baustahl' | 'holz' | 'mauerwerk';
export type Bemessungssituation = 'staendig' | 'aussergewoehnlich';

/** Auswahllisten des Rechners (nur Klassen, die in den zentralen Tabellen stehen) */
export const EC_KLASSEN: Readonly<Record<EcBaustoff, readonly string[]>> = {
  beton: ['C12/15', 'C16/20', 'C20/25', 'C25/30', 'C30/37', 'C35/45', 'C40/50', 'C45/55', 'C50/60'],
  betonstahl: Object.keys(BETONSTAHL),
  baustahl: Object.keys(BAUSTAHL_EC3),
  holz: [...Object.keys(HOLZ_EN338), ...Object.keys(BSH_EN14080)],
  mauerwerk: [...FK_TAFEL_NA.map(e => e.id), 'frei'],
};

/**
 * Teilsicherheitsbeiwerte der Widerstandsseite je Baustoff und Bemessungssituation (NA DE), aus den zentralen Konstanten.
 * Baustahl außergewöhnlich: hier wie ständig angesetzt (vorläufig, Normprüfung ausstehend: eigener Wert im NA zu
 * DIN EN 1993-1-1 nicht öffentlich belegt).
 */
export const GAMMA_WIDERSTAND = {
  beton: { staendig: GAMMA_C.staendig, aussergewoehnlich: GAMMA_C.aussergewoehnlich },
  betonstahl: { staendig: GAMMA_S.staendig, aussergewoehnlich: GAMMA_S.aussergewoehnlich },
  baustahl: { staendig: EC3_NA_DE.gammaM0, aussergewoehnlich: EC3_NA_DE.gammaM0 },
  holz: { staendig: GAMMA_M_HOLZ, aussergewoehnlich: GAMMA_M_HOLZ_AUSSERGEWOEHNLICH },
  mauerwerk: { staendig: GAMMA_M_MW, aussergewoehnlich: GAMMA_M_MW_AUSSERGEWOEHNLICH },
} as const satisfies Record<EcBaustoff, Record<Bemessungssituation, number>>;

export type ZeilenArt = 'mittel' | 'charakteristisch' | 'bemessung' | 'steifigkeit' | 'beiwert';

export interface EcZeile {
  /** Formelzeichen in TeX, z. B. f_{ck} */
  zeichen: string;
  /** Benennung */
  text: string;
  wert: number;
  einheit: string;
  art: ZeilenArt;
}

export interface EcKennwertEingabe {
  baustoff: EcBaustoff;
  /** Klasse bzw. Sorte, z. B. 'C30/37', 'B500B', 'S355', 'GL24h'; Mauerwerk: Tafel-ID aus FK_TAFEL_NA oder 'frei' */
  klasse: string;
  situation: Bemessungssituation;
  /** Beton: α_cc (Standard 0,85 nach NA DE) */
  alphaCc?: number;
  /** Holz: Nutzungsklasse und Klasse der Lasteinwirkungsdauer */
  nkl?: Nutzungsklasse;
  kled?: KLED;
  /** Mauerwerk 'frei': charakteristische Druckfestigkeit f_k [N/mm²] */
  fk?: number;
  /** Mauerwerk: Dauerstandsbeiwert ζ (Standard 0,85) */
  zeta?: number;
}

export interface EcKennwertErgebnis {
  baustoff: EcBaustoff;
  /** maßgebender charakteristischer Wert X_k und Bemessungswert X_d [N/mm²] */
  xk: number;
  xd: number;
  /** Teilsicherheitsbeiwert γ und Beiwert (α_cc, k_mod, ζ; sonst 1) */
  gamma: number;
  beiwert: number;
  /** X_d / X_k */
  verhaeltnis: number;
  zeilen: EcZeile[];
  /** true, wenn ein angesetzter Wert vorläufig ist (Normprüfung ausstehend) */
  vorlaeufig: boolean;
  gueltig: boolean;
  hinweise: Hinweis[];
}

const z = (zeichen: string, text: string, wert: number, einheit: string, art: ZeilenArt): EcZeile => ({ zeichen, text, wert, einheit, art });

function leer(e: EcKennwertEingabe, hinweise: Hinweis[]): EcKennwertErgebnis {
  return nurGueltig({ baustoff: e.baustoff, xk: NaN, xd: NaN, gamma: NaN, beiwert: NaN, verhaeltnis: NaN, zeilen: [], vorlaeufig: false, gueltig: false, hinweise });
}

/** Vom Kennwert zum Bemessungswert für einen Baustoff, eine Klasse und eine Bemessungssituation */
export function ecKennwerte(e: EcKennwertEingabe): EcKennwertErgebnis {
  const hinweise: Hinweis[] = [];
  muss(hinweise, e.baustoff in GAMMA_WIDERSTAND, 'baustoff', 'Baustoff wählen.');
  muss(hinweise, e.situation === 'staendig' || e.situation === 'aussergewoehnlich', 'situation', 'Bemessungssituation wählen.');
  if (hatFehler(hinweise)) return leer(e, hinweise);
  const gamma: number = GAMMA_WIDERSTAND[e.baustoff][e.situation];
  const zeilen: EcZeile[] = [];
  let xk = NaN, xd = NaN, beiwert = 1, vorlaeufig = false;

  if (e.baustoff === 'beton') {
    const c = betonNachKlasse(e.klasse);
    muss(hinweise, !!c, 'klasse', 'Betonfestigkeitsklasse aus DIN EN 1992-1-1, Tab. 3.1 wählen.');
    const alphaCc = e.alphaCc ?? ALPHA_CC;
    muss(hinweise, istEndlich(alphaCc) && alphaCc > 0 && alphaCc <= 1, 'alphaCc', 'α_cc muss größer als 0 und höchstens 1,0 sein.');
    if (!c || hatFehler(hinweise)) return leer(e, hinweise);
    beiwert = alphaCc;
    xk = c.fck;
    xd = fcdBeton(c.fck, { alphaCc, gammaC: gamma });
    const fctd = (EC2_BETON_NA.alphaCt * c.fctk_005) / gamma;
    zeilen.push(
      z('f_{ck}', 'charakteristische Zylinderdruckfestigkeit (5-%-Quantil)', c.fck, 'N/mm²', 'charakteristisch'),
      z('f_{ck,cube}', 'charakteristische Würfeldruckfestigkeit', c.fck_cube, 'N/mm²', 'charakteristisch'),
      z('f_{cm}', 'Mittelwert der Zylinderdruckfestigkeit', c.fcm, 'N/mm²', 'mittel'),
      z('f_{ctm}', 'Mittelwert der zentrischen Zugfestigkeit', c.fctm, 'N/mm²', 'mittel'),
      z('f_{ctk;0{,}05}', 'Zugfestigkeit, 5-%-Quantil', c.fctk_005, 'N/mm²', 'charakteristisch'),
      z('f_{ctk;0{,}95}', 'Zugfestigkeit, 95-%-Quantil', c.fctk_095, 'N/mm²', 'charakteristisch'),
      z('E_{cm}', 'Elastizitätsmodul (Sekante, Quarzit)', c.Ecm, 'N/mm²', 'steifigkeit'),
      z('\\varepsilon_{c2}', 'Dehnung bei Erreichen der Festigkeit (Parabel-Rechteck)', c.eps_c2, '‰', 'beiwert'),
      z('\\varepsilon_{cu2}', 'Bruchdehnung (Parabel-Rechteck)', c.eps_cu2, '‰', 'beiwert'),
      z('f_{cd}', 'Bemessungswert der Druckfestigkeit', xd, 'N/mm²', 'bemessung'),
      z('f_{ctd}', 'Bemessungswert der Zugfestigkeit', fctd, 'N/mm²', 'bemessung'),
    );
    if (alphaCc !== ALPHA_CC) hinweise.push({ stufe: 'warnung', feld: 'alphaCc', text: 'In Deutschland gilt α_cc = 0,85 (DIN EN 1992-1-1/NA); 1,0 ist der Empfehlungswert der EN ohne Nationalen Anhang.' });
  } else if (e.baustoff === 'betonstahl') {
    const b = (BETONSTAHL as Record<string, typeof BETONSTAHL[BetonstahlSorte]>)[e.klasse];
    muss(hinweise, !!b, 'klasse', 'Betonstahlsorte B500A oder B500B wählen.');
    if (!b) return leer(e, hinweise);
    xk = b.fyk;
    xd = b.fyk / gamma;
    zeilen.push(
      z('f_{yk}', 'charakteristische Streckgrenze', b.fyk, 'N/mm²', 'charakteristisch'),
      z('f_{tk}', 'charakteristische Zugfestigkeit (k · f_yk)', b.ftk, 'N/mm²', 'charakteristisch'),
      z('k', 'Verhältnis (f_t/f_y)_k, Mindestwert', b.k, '–', 'beiwert'),
      z('\\varepsilon_{uk}', 'Dehnung bei Höchstlast, Mindestwert', b.euk, '‰', 'beiwert'),
      z('E_s', 'Elastizitätsmodul', E_BETONSTAHL, 'N/mm²', 'steifigkeit'),
      z('f_{yd}', 'Bemessungswert der Streckgrenze', xd, 'N/mm²', 'bemessung'),
      z('\\varepsilon_{yd}', 'Dehnung bei Erreichen von f_yd', (xd / E_BETONSTAHL) * 1000, '‰', 'beiwert'),
    );
  } else if (e.baustoff === 'baustahl') {
    const s = (BAUSTAHL_EC3 as Record<string, typeof BAUSTAHL_EC3[BaustahlGuete]>)[e.klasse];
    muss(hinweise, !!s, 'klasse', 'Stahlsorte S235, S355 oder S460 wählen.');
    if (!s) return leer(e, hinweise);
    xk = s.fy;
    xd = s.fy / gamma;
    zeilen.push(
      z('f_y', 'Streckgrenze, Nennwert (t ≤ 40 mm)', s.fy, 'N/mm²', 'charakteristisch'),
      z('f_u', 'Zugfestigkeit, Nennwert (t ≤ 40 mm)', s.fu, 'N/mm²', 'charakteristisch'),
      z('E', 'Elastizitätsmodul', EC3_NA_DE.E, 'N/mm²', 'steifigkeit'),
      z('f_y/\\gamma_{M0}', 'Querschnittswiderstand je Flächeneinheit', s.fy / EC3_NA_DE.gammaM0, 'N/mm²', 'bemessung'),
      z('f_y/\\gamma_{M1}', 'Stabilitätsnachweis (vor χ) je Flächeneinheit', s.fy / EC3_NA_DE.gammaM1, 'N/mm²', 'bemessung'),
      z('0{,}9\\,f_u/\\gamma_{M2}', 'Nettoquerschnitt (Bruch) je Flächeneinheit', (0.9 * s.fu) / EC3_NA_DE.gammaM2, 'N/mm²', 'bemessung'),
    );
    if (e.situation === 'aussergewoehnlich') {
      vorlaeufig = true;
      hinweise.push({ stufe: 'warnung', feld: 'situation', text: 'Baustahl, außergewöhnliche Bemessungssituation: γ_M0, γ_M1 und γ_M2 wie in der ständigen Situation angesetzt (vorläufig, Normprüfung ausstehend).' });
    }
  } else if (e.baustoff === 'holz') {
    const h = holzKennwerte(e.klasse);
    muss(hinweise, !!h, 'klasse', 'Festigkeitsklasse nach DIN EN 338 oder DIN EN 14080 wählen.');
    const nkl = e.nkl ?? 1;
    const kled: KLED = e.kled ?? (e.situation === 'aussergewoehnlich' ? 'sfs' : 'mtl');
    const kmod = KMOD[nkl]?.[kled];
    muss(hinweise, kmod !== undefined, 'nkl', 'Nutzungsklasse 1 bis 3 und eine Klasse der Lasteinwirkungsdauer wählen.');
    if (!h || kmod === undefined) return leer(e, hinweise);
    beiwert = kmod;
    const d = (x: number) => bemessungswert(x, kmod, gamma);
    xk = h.fmk;
    xd = d(h.fmk);
    zeilen.push(
      z('f_{m,k}', 'Biegefestigkeit', h.fmk, 'N/mm²', 'charakteristisch'),
      z('f_{t,0,k}', 'Zugfestigkeit parallel zur Faser', h.ft0k, 'N/mm²', 'charakteristisch'),
      z('f_{c,0,k}', 'Druckfestigkeit parallel zur Faser', h.fc0k, 'N/mm²', 'charakteristisch'),
      z('f_{v,k}', 'Schubfestigkeit', h.fvk, 'N/mm²', 'charakteristisch'),
      z('E_{0,mean}', 'Elastizitätsmodul, Mittelwert', h.E0mean, 'N/mm²', 'steifigkeit'),
      z('E_{0{,}05}', 'Elastizitätsmodul, 5-%-Quantil', h.E005, 'N/mm²', 'steifigkeit'),
      z('\\rho_k', 'Rohdichte, 5-%-Quantil', h.rhok, 'kg/m³', 'charakteristisch'),
      z('k_{mod}', 'Modifikationsbeiwert (Nutzungsklasse, Lasteinwirkungsdauer)', kmod, '–', 'beiwert'),
      z('f_{m,d}', 'Bemessungswert der Biegefestigkeit', xd, 'N/mm²', 'bemessung'),
      z('f_{t,0,d}', 'Bemessungswert der Zugfestigkeit', d(h.ft0k), 'N/mm²', 'bemessung'),
      z('f_{c,0,d}', 'Bemessungswert der Druckfestigkeit', d(h.fc0k), 'N/mm²', 'bemessung'),
      z('f_{v,d}', 'Bemessungswert der Schubfestigkeit', d(h.fvk), 'N/mm²', 'bemessung'),
    );
    if (e.situation === 'aussergewoehnlich') {
      vorlaeufig = true;
      hinweise.push({ stufe: 'warnung', feld: 'situation', text: 'Holz, außergewöhnliche Bemessungssituation: γ_M = 1,0 nach NA; Ausgabe am Normtext prüfen (vorläufig, Normprüfung ausstehend).' });
    }
  } else {
    const tafel = e.klasse === 'frei' ? null : fkNA(e.klasse);
    muss(hinweise, e.klasse === 'frei' || !!tafel, 'klasse', 'Stein-Mörtel-Kombination aus der Tafel oder „frei“ wählen.');
    const fk = tafel ? tafel.fk : (e.fk ?? NaN);
    muss(hinweise, istEndlich(fk) && fk > 0, 'fk', 'f_k muss größer als 0 sein.');
    const zeta = e.zeta ?? ZETA_MW;
    muss(hinweise, istEndlich(zeta) && zeta > 0 && zeta <= 1, 'zeta', 'ζ muss größer als 0 und höchstens 1,0 sein.');
    if (hatFehler(hinweise)) return leer(e, hinweise);
    beiwert = zeta;
    xk = fk;
    xd = fdAusFk(fk, zeta, gamma);
    vorlaeufig = !!tafel?.vorlaeufig;
    zeilen.push(
      z('f_k', 'charakteristische Mauerwerksdruckfestigkeit', fk, 'N/mm²', 'charakteristisch'),
      z('\\zeta', 'Dauerstandsbeiwert', zeta, '–', 'beiwert'),
      z('f_d', 'Bemessungswert der Druckfestigkeit', xd, 'N/mm²', 'bemessung'),
    );
    if (fk > 20) hinweise.push({ stufe: 'warnung', feld: 'fk', text: 'f_k über 20 N/mm² ist für Mauerwerk ungewöhnlich hoch.' });
    if (tafel?.vorlaeufig) hinweise.push({ stufe: 'warnung', feld: 'klasse', text: 'Tafelwert vorläufig (Spaltenzuordnung der Herstellertafel; vorläufig, Normprüfung ausstehend).' });
  }

  return nurGueltig({ baustoff: e.baustoff, xk, xd, gamma, beiwert, verhaeltnis: xd / xk, zeilen, vorlaeufig, gueltig: !hatFehler(hinweise), hinweise });
}

// ---------------------------------------------------------------------------------------------------------------
// Statistik: charakteristischer Wert aus einer Prüfserie (DIN EN 1990, Anhang D)
// ---------------------------------------------------------------------------------------------------------------

/**
 * Fraktilfaktor k_n für das 5-%-Quantil bei BEKANNTEM Variationskoeffizienten V_X, DIN EN 1990, Tab. D1 (obere Zeile).
 * Die Werte folgen k_n = u · √(1 + 1/n) mit u = 1,64 (tests/ecKennwerte.test.ts rechnet nach).
 */
export const KN_TAB_BEKANNT: readonly (readonly [number, number])[] = [[1, 2.31], [2, 2.01], [3, 1.89], [4, 1.83], [5, 1.80], [6, 1.77], [8, 1.74], [10, 1.72], [20, 1.68], [30, 1.67], [Infinity, 1.64]];

/** k_n für V_X bekannt, Zwischenwerte linear in 1/n (wie fraktilfaktorKn); n < 1 → NaN */
export function fraktilfaktorKnBekannt(n: number): number {
  if (!(n >= 1)) return NaN;
  const inv = (x: number) => (Number.isFinite(x) ? 1 / x : 0);
  const t = KN_TAB_BEKANNT;
  for (let i = 0; i < t.length - 1; i++) {
    const [n0, k0] = t[i], [n1, k1] = t[i + 1];
    if (n >= n0 && n <= n1) return k0 + (k1 - k0) * (inv(n0) - inv(n)) / (inv(n0) - inv(n1));
  }
  return NaN;
}

export type Verteilung = 'normal' | 'lognormal';

export interface SerieEingabe {
  werte: readonly number[];
  verteilung: Verteilung;
  /** bekannter Variationskoeffizient V_X (z. B. 0,10 aus Vorwissen); ohne Angabe: V_X unbekannt, aus der Serie geschätzt */
  vxBekannt?: number;
  /** Teilsicherheitsbeiwert für X_d = beiwert · X_k / γ_M */
  gammaM: number;
  /** Beiwert (α_cc, k_mod, ζ), Standard 1 */
  beiwert?: number;
}

export interface SerieErgebnis {
  n: number;
  mittelwert: number;
  stdAbw: number;
  /** Variationskoeffizient V_x = s/m (der Serie) */
  vx: number;
  kn: number;
  /** charakteristischer Wert (5-%-Quantil) und Bemessungswert */
  xk: number;
  xd: number;
  /** Abstand Mittelwert − charakteristischer Wert („Vorhaltemaß“) */
  vorhalt: number;
  gueltig: boolean;
  hinweise: Hinweis[];
}

/** Charakteristischer Wert X_k (5-%-Quantil) und Bemessungswert X_d aus einer Prüfserie nach DIN EN 1990, D7.2 */
export function charakteristischAusSerie(e: SerieEingabe): SerieErgebnis {
  const hinweise: Hinweis[] = [];
  const beiwert = e.beiwert ?? 1;
  const bekannt = e.vxBekannt !== undefined;
  muss(hinweise, e.werte.length > 0 && e.werte.every(Number.isFinite), 'werte', 'Messwerte als Zahlen eingeben.');
  muss(hinweise, e.werte.every(v => v > 0) || e.verteilung === 'normal', 'werte', 'Bei Lognormalverteilung müssen alle Werte größer als 0 sein.');
  muss(hinweise, istEndlich(e.gammaM, beiwert) && e.gammaM > 0 && beiwert > 0, 'gammaM', 'γ_M und Beiwert müssen größer als 0 sein.');
  if (bekannt) muss(hinweise, istEndlich(e.vxBekannt as number) && (e.vxBekannt as number) >= 0 && (e.vxBekannt as number) < 1, 'vx', 'V_X muss zwischen 0 und 1 liegen.');
  const n = e.werte.length;
  muss(hinweise, bekannt ? n >= 1 : n >= 3, 'werte', bekannt ? 'Mindestens 1 Wert eingeben.' : 'Mindestens 3 Werte: k_n nach DIN EN 1990, Tab. D1 ist für V_X unbekannt erst ab n = 3 angegeben.');
  const leerErg = { n, mittelwert: NaN, stdAbw: NaN, vx: NaN, kn: NaN, xk: NaN, xd: NaN, vorhalt: NaN, gueltig: false, hinweise };
  if (hatFehler(hinweise)) return nurGueltig(leerErg);

  const st = stichprobe(e.werte);
  const kn = bekannt ? fraktilfaktorKnBekannt(n) : fraktilfaktorKn(n);
  let xk: number;
  if (e.verteilung === 'normal') {
    xk = bekannt ? st.mittelwert * (1 - kn * (e.vxBekannt as number)) : st.mittelwert - kn * st.stdAbw;
  } else {
    const ln = stichprobe(e.werte.map(Math.log));
    const sy = bekannt ? Math.sqrt(Math.log(1 + (e.vxBekannt as number) ** 2)) : ln.stdAbw;
    xk = Math.exp(ln.mittelwert - kn * sy);
  }
  const vx = st.mittelwert !== 0 ? st.stdAbw / st.mittelwert : NaN;
  if (xk <= 0) hinweise.push({ stufe: 'warnung', feld: 'werte', text: 'X_k ≤ 0: Die Streuung ist für eine Normalverteilung zu groß; Lognormalverteilung prüfen.' });
  if (!bekannt && n < 6) hinweise.push({ stufe: 'warnung', feld: 'werte', text: `Nur ${n} Werte: k_n = ${formatDeZahl(kn, 2)} – der Abschlag für die unsichere Streuung ist groß.` });
  return nurGueltig({ n, mittelwert: st.mittelwert, stdAbw: st.stdAbw, vx, kn, xk, xd: (beiwert * xk) / e.gammaM, vorhalt: st.mittelwert - xk, gueltig: true, hinweise });
}

/** Vorhaltemaß Δf = u_0,95 · σ einer Normalverteilung (Abstand Mittelwert → 5-%-Quantil bei bekannter Streuung) */
export function vorhaltemass(sigma: number): number {
  return Number.isFinite(sigma) && sigma >= 0 ? K_FRAKTIL_5 * sigma : NaN;
}

/** Standardabweichung, die zum Vorhaltemaß Δf passt: σ = Δf / 1,645 (f_cm − f_ck = 8 N/mm² → σ ≈ 4,9 N/mm²) */
export function sigmaAusVorhalt(deltaF: number): number {
  return Number.isFinite(deltaF) && deltaF >= 0 ? deltaF / K_FRAKTIL_5 : NaN;
}

/** Wahrscheinlichkeit, dass ein Einzelwert unter X_k = m − k·σ liegt (Normalverteilung): Φ(−k) – zur Erläuterung des Quantils */
export function unterschreitung(k: number): number {
  return Number.isFinite(k) ? normalCDF(-k, 0, 1) : NaN;
}
