/**
 * Rechenkerne der Versuchs-Handouts im Baustofflabor (AP 6.4).
 *
 * 1. Potentialmessung an Betonstahl in gesättigter Ca(OH)₂-Lösung mit schrittweiser NaCl-Zugabe:
 *      E_SHE = E_mess + E_Bezug,SHE,   E_CSE = E_SHE − E_CSE,SHE
 *    Bewertung nach den Potentialbereichen der ASTM C876 (in mV gegen CSE, nur Richtwerte):
 *      E > −200 mV geringe, −350 … −200 mV unsichere, E < −350 mV hohe Korrosionswahrscheinlichkeit.
 *    Chlorid- und Hydroxidionen: c_Cl = m_NaCl / (M_NaCl · V),  c_OH = 10^(pH − 14)  (Lehrvereinfachung, Aktivitäten = Konzentrationen).
 * 2. Auslagerungsversuch (Gravimetrie): Δm = m₀ − m₁ − m_Blind,  r = Δm / (A · t)  in g/(m²·d),
 *      v_korr = Δm / (ρ · A) · 10⁴ · 365 / t   in µm/a   (A in cm², t in Tagen; entspricht K = 8,76·10⁷ mit t in h).
 * 3. Frischbeton: Ausbreitmaß f = (d₁ + d₂)/2 auf 10 mm gerundet (DIN EN 12350-5), Rohdichte D = (m₂ − m₁)/V
 *    auf 10 kg/m³ gerundet (DIN EN 12350-6), Luftgehalt A_c = A₁ − G (Druckausgleichsverfahren, DIN EN 12350-7).
 * 4. Druckfestigkeit an Würfeln: f_c = F / A_c (DIN EN 12390-3), Umrechnung Trockenlagerung f_c,cube = 0,92 · f_c,dry
 *    (bis C50/60, darüber 0,95) und Lehrvereinfachung der Konformität (Erstherstellung, n = 3):
 *      f_cm ≥ f_ck,cube + 4 MPa  und  f_ci ≥ f_ck,cube − 4 MPa.
 * 5. Mörtelprismen 40 × 40 × 160 mm (DIN EN 196-1): R_f = 1,5 · F_f · l / b³ (l = 100 mm, b = 40 mm),
 *    R_c = F_c / 1600 mm²; Mittelwert der sechs Druckfestigkeiten mit ±10-%-Regel.
 * Reine Rechenkerne – geprüft in tests/laborversuche.test.ts.
 */
import { type Hinweis, hatFehler, nurGueltig, unvollstaendigeZeilen, KEINE_KLASSE, type KeineKlasse } from './plausibilitaet';

const mittel = (x: readonly number[]) => (x.length ? x.reduce((a, b) => a + b, 0) / x.length : NaN);
const stdabw = (x: readonly number[]) => {
  if (x.length < 2) return NaN;
  const m = mittel(x);
  return Math.sqrt(x.reduce((a, b) => a + (b - m) ** 2, 0) / (x.length - 1));
};
/** Rundung auf ein Vielfaches von schritt (kaufmännisch) */
export const rundeAuf = (v: number, schritt: number) => Math.round(v / schritt) * schritt;

// ─────────────────────────────────────────────────────────────────────────────
// 1. Potentialmessung
// ─────────────────────────────────────────────────────────────────────────────

/** Potentiale gebräuchlicher Bezugselektroden gegen die Standardwasserstoffelektrode bei 25 °C in mV (Literaturwerte, ±3 mV) */
export const BEZUGSELEKTRODEN = [
  { id: 'agcl_ges', name: 'Ag/AgCl, KCl gesättigt', eSHE: 197 },
  { id: 'agcl_3m', name: 'Ag/AgCl, KCl 3 mol/L', eSHE: 210 },
  { id: 'sce', name: 'Kalomel (SCE), KCl gesättigt', eSHE: 241 },
  { id: 'cse', name: 'Cu/CuSO₄ gesättigt (CSE)', eSHE: 316 },
] as const;
export type BezugselektrodeId = (typeof BEZUGSELEKTRODEN)[number]['id'];
/** Cu/CuSO₄-Elektrode gegen SHE in mV */
export const E_CSE_GEGEN_SHE = 316;
/** Molare Masse NaCl in g/mol */
export const M_NACL = 58.44;
/** Kritisches Verhältnis Cl⁻/OH⁻ nach Hausmann (1967) für Stahl in alkalischer Lösung – Richtwert */
export const CL_OH_KRITISCH = 0.6;

export type PotentialBereich = 'gering' | 'unsicher' | 'hoch' | KeineKlasse;

export function bezugselektrode(id: string) {
  return BEZUGSELEKTRODEN.find(b => b.id === id) ?? BEZUGSELEKTRODEN[0];
}

/** Umrechnung eines gegen die Bezugselektrode gemessenen Potentials (mV) auf SHE und CSE */
export function umrechnenPotential(eMess: number, eBezugSHE: number): { eSHE: number; eCSE: number } {
  const eSHE = eMess + eBezugSHE;
  return { eSHE, eCSE: eSHE - E_CSE_GEGEN_SHE };
}

/** Potentialbereich nach ASTM C876 (Richtwert, Potential in mV gegen CSE) */
export function bereichCSE(eCSE: number): PotentialBereich {
  if (!Number.isFinite(eCSE)) return KEINE_KLASSE; // F-1 (02.11.2026): keine Zahl → keine Klasse
  if (eCSE > -200) return 'gering';
  if (eCSE >= -350) return 'unsicher';
  return 'hoch';
}

export interface PotentialMessung {
  /** kumulierte NaCl-Zugabe in g */
  mNaCl: number;
  /** gemessenes Potential gegen die Bezugselektrode in mV */
  eMess: number;
}

export interface PotentialPunkt extends PotentialMessung {
  eSHE: number;
  eCSE: number;
  /** Chloridkonzentration in mol/L */
  cCl: number;
  /** Massenanteil NaCl in der Lösung in % (Dichte des Wassers 1 kg/L) */
  wNaCl: number;
  /** Verhältnis Cl⁻/OH⁻ */
  clOh: number;
  bereich: PotentialBereich;
  /** Potentialänderung gegenüber dem vorherigen Schritt in mV */
  delta: number;
}

export interface PotentialEingabe {
  messungen: readonly PotentialMessung[];
  /** Potential der Bezugselektrode gegen SHE in mV */
  eBezugSHE: number;
  /** Volumen der Lösung in L */
  volumen: number;
  /** pH-Wert der Lösung */
  pH: number;
  /** Potentialabfall zwischen zwei Schritten, ab dem eine Depassivierung vermutet wird, in mV */
  sprung: number;
}

export interface PotentialErgebnis {
  gueltig: boolean;
  punkte: PotentialPunkt[];
  cOH: number;
  /** Index des ersten Schritts mit Potentialabfall ≥ sprung; −1 = kein Sprung */
  sprungIndex: number;
  hinweise: Hinweis[];
}

export function potentialReihe(e: PotentialEingabe): PotentialErgebnis {
  const hinweise: Hinweis[] = [];
  if (!(Number.isFinite(e.volumen) && e.volumen > 0)) hinweise.push({ stufe: 'fehler', feld: 'volumen', text: 'Das Lösungsvolumen muss größer als 0 sein.' });
  if (!(e.pH >= 7 && e.pH <= 14)) hinweise.push({ stufe: 'fehler', feld: 'pH', text: 'Der pH-Wert muss zwischen 7 und 14 liegen.' });
  if (!(e.sprung > 0)) hinweise.push({ stufe: 'fehler', feld: 'sprung', text: 'Die Sprungschwelle muss größer als 0 mV sein.' });
  if (!Number.isFinite(e.eBezugSHE)) hinweise.push({ stufe: 'fehler', feld: 'bezug', text: 'Bezugselektrode wählen.' });
  const ms = e.messungen.filter(m => Number.isFinite(m.mNaCl) && Number.isFinite(m.eMess));
  unvollstaendigeZeilen(hinweise, e.messungen.map(m => [m.mNaCl, m.eMess]), 'messungen');
  if (ms.length < 2) hinweise.push({ stufe: 'fehler', feld: 'messungen', text: 'Mindestens zwei vollständige Messzeilen (NaCl-Zugabe und Potential) eintragen.' });
  if (ms.some(m => m.mNaCl < 0)) hinweise.push({ stufe: 'fehler', feld: 'mNaCl', text: 'Die NaCl-Zugabe kann nicht negativ sein.' });
  if (ms.some((m, i) => i > 0 && m.mNaCl < ms[i - 1].mNaCl)) hinweise.push({ stufe: 'warnung', feld: 'mNaCl', text: 'Die NaCl-Menge ist kumuliert einzutragen und sollte von Zeile zu Zeile zunehmen.' });
  if (ms.some(m => Math.abs(m.eMess) > 1500)) hinweise.push({ stufe: 'warnung', feld: 'eMess', text: 'Potentiale über ±1500 mV sind unplausibel – Anschluss, Messbereich und Vorzeichen prüfen.' });
  if (hatFehler(hinweise)) return nurGueltig({ gueltig: false, punkte: [], cOH: NaN, sprungIndex: -1, hinweise });

  const cOH = 10 ** (e.pH - 14);
  const punkte: PotentialPunkt[] = ms.map((m, i) => {
    const { eSHE, eCSE } = umrechnenPotential(m.eMess, e.eBezugSHE);
    const cCl = m.mNaCl / (M_NACL * e.volumen);
    const wNaCl = m.mNaCl / (m.mNaCl + 1000 * e.volumen) * 100;
    return { ...m, eSHE, eCSE, cCl, wNaCl, clOh: cCl / cOH, bereich: bereichCSE(eCSE), delta: i === 0 ? 0 : m.eMess - ms[i - 1].eMess };
  });
  const sprungIndex = punkte.findIndex((p, i) => i > 0 && p.delta <= -e.sprung);
  if (ms[0].mNaCl > 0) hinweise.push({ stufe: 'warnung', feld: 'mNaCl', text: 'Die erste Zeile sollte die Nullmessung ohne NaCl sein (Ruhepotential des passiven Stahls).' });
  return nurGueltig({ gueltig: true, punkte, cOH, sprungIndex, hinweise });
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Auslagerungsversuch (Gravimetrie)
// ─────────────────────────────────────────────────────────────────────────────

export interface AuslagerungsProbe {
  /** Stabdurchmesser in mm */
  d: number;
  /** Stablänge in mm */
  l: number;
  /** Masse vor der Auslagerung in g */
  m0: number;
  /** Masse nach Auslagerung und Beizen in g */
  m1: number;
}

export interface AuslagerungsEingabe {
  proben: readonly AuslagerungsProbe[];
  /** Auslagerungsdauer in Tagen */
  tage: number;
  /** Dichte des Stahls in g/cm³ */
  rho: number;
  /** Massenverlust der Blindprobe beim Beizen in g */
  blind: number;
}

export interface AuslagerungsWert {
  /** Oberfläche in cm² */
  flaeche: number;
  /** korrigierter Massenverlust in g */
  dm: number;
  /** Massenverlustrate in g/(m²·d) */
  rate: number;
  /** gleichmäßige Abtragsrate in µm/a */
  vKorr: number;
  /** Abtrag während der Auslagerung in µm */
  abtrag: number;
}

export interface AuslagerungsErgebnis {
  gueltig: boolean;
  werte: AuslagerungsWert[];
  mittelVKorr: number;
  sVKorr: number;
  mittelRate: number;
  hinweise: Hinweis[];
}

/** Oberfläche eines zylindrischen Stabs (Mantel + zwei Stirnflächen) in cm² aus d und l in mm */
export const stabflaeche = (d: number, l: number) => (Math.PI * d * l + 2 * Math.PI * d * d / 4) / 100;

/** Abtragsrate in µm/a aus Massenverlust (g), Fläche (cm²), Dichte (g/cm³) und Dauer (d) */
export const abtragsrate = (dm: number, flaeche: number, rho: number, tage: number) => dm / (rho * flaeche) * 1e4 * 365 / tage;

export function auslagerung(e: AuslagerungsEingabe): AuslagerungsErgebnis {
  const hinweise: Hinweis[] = [];
  if (!(Number.isFinite(e.tage) && e.tage > 0)) hinweise.push({ stufe: 'fehler', feld: 'tage', text: 'Die Auslagerungsdauer muss größer als 0 Tage sein.' });
  if (!(Number.isFinite(e.rho) && e.rho > 0)) hinweise.push({ stufe: 'fehler', feld: 'rho', text: 'Die Dichte muss größer als 0 sein.' });
  if (!(Number.isFinite(e.blind) && e.blind >= 0)) hinweise.push({ stufe: 'fehler', feld: 'blind', text: 'Der Blindwert kann nicht negativ sein (0 eintragen, wenn keine Blindprobe gebeizt wurde).' });
  const ps = e.proben.filter(p => [p.d, p.l, p.m0, p.m1].every(Number.isFinite));
  unvollstaendigeZeilen(hinweise, e.proben.map(p => [p.d, p.l, p.m0, p.m1]), 'proben');
  if (ps.length < 1) hinweise.push({ stufe: 'fehler', feld: 'proben', text: 'Mindestens eine vollständige Probenzeile eintragen.' });
  if (ps.some(p => !(p.d > 0 && p.l > 0))) hinweise.push({ stufe: 'fehler', feld: 'geometrie', text: 'Durchmesser und Länge müssen größer als 0 sein.' });
  if (ps.some(p => !(p.m0 > 0 && p.m1 > 0))) hinweise.push({ stufe: 'fehler', feld: 'masse', text: 'Die Massen müssen größer als 0 sein.' });
  if (hatFehler(hinweise)) return nurGueltig({ gueltig: false, werte: [], mittelVKorr: NaN, sVKorr: NaN, mittelRate: NaN, hinweise });

  const werte = ps.map(p => {
    const flaeche = stabflaeche(p.d, p.l);
    const dm = p.m0 - p.m1 - e.blind;
    const vKorr = abtragsrate(dm, flaeche, e.rho, e.tage);
    return { flaeche, dm, rate: dm / (flaeche / 1e4) / e.tage, vKorr, abtrag: vKorr * e.tage / 365 };
  });
  if (ps.some(p => p.m1 > p.m0)) hinweise.push({ stufe: 'warnung', feld: 'masse', text: 'Masse nach dem Beizen größer als vorher – Reste von Korrosionsprodukten, Feuchte oder Wägefehler?' });
  if (werte.some(w => w.dm < 0)) hinweise.push({ stufe: 'warnung', feld: 'blind', text: 'Korrigierter Massenverlust negativ – Blindwert größer als der Massenverlust der Probe.' });
  if (ps.length < 3) hinweise.push({ stufe: 'warnung', feld: 'proben', text: 'Für eine Streuungsangabe mindestens drei Parallelproben auslagern.' });
  if (e.tage < 14) hinweise.push({ stufe: 'warnung', feld: 'tage', text: 'Bei kurzer Dauer überschätzt die Hochrechnung auf ein Jahr meist die Rate (anfänglich höhere Korrosion).' });
  const v = werte.map(w => w.vKorr);
  return nurGueltig({ gueltig: true, werte, mittelVKorr: mittel(v), sVKorr: stdabw(v), mittelRate: mittel(werte.map(w => w.rate)), hinweise });
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Frischbeton
// ─────────────────────────────────────────────────────────────────────────────

/** Ausbreitmaßklassen nach DIN EN 206 (Untergrenze in mm) */
export const AUSBREITKLASSEN = [
  { id: 'F1', min: 0, max: 340 },
  { id: 'F2', min: 350, max: 410 },
  { id: 'F3', min: 420, max: 480 },
  { id: 'F4', min: 490, max: 550 },
  { id: 'F5', min: 560, max: 620 },
  { id: 'F6', min: 630, max: Infinity },
] as const;

export function ausbreitklasse(f: number): string {
  if (!Number.isFinite(f)) return '–';
  return [...AUSBREITKLASSEN].reverse().find(k => f >= k.min)?.id ?? 'F1';
}

export interface FrischbetonProbe {
  /** Ausbreitdurchmesser d₁, d₂ in mm */
  d1: number;
  d2: number;
  /** Masse Behälter leer / gefüllt in kg */
  mLeer: number;
  mVoll: number;
  /** Behältervolumen in L */
  vol: number;
  /** abgelesener Luftgehalt A₁ in % */
  a1: number;
  /** Korrekturfaktor der Gesteinskörnung G in % */
  g: number;
}

export interface FrischbetonWert {
  f: number;
  klasse: string;
  rohdichte: number;
  luft: number;
  /** Luftgehalt aus Soll- und Ist-Rohdichte in % (Gegenprobe) */
  luftAusDichte: number;
}

export interface FrischbetonErgebnis {
  gueltig: boolean;
  werte: FrischbetonWert[];
  mittelF: number;
  mittelRohdichte: number;
  mittelLuft: number;
  hinweise: Hinweis[];
}

/** Ausbreitmaß auf 10 mm gerundet */
export const ausbreitmass = (d1: number, d2: number) => rundeAuf((d1 + d2) / 2, 10);
/** Frischbetonrohdichte in kg/m³ (auf 10 kg/m³ gerundet) aus Massen in kg und Volumen in L */
export const frischRohdichte = (mLeer: number, mVoll: number, vol: number) => rundeAuf((mVoll - mLeer) / vol * 1000, 10);

export function frischbeton(proben: readonly FrischbetonProbe[], sollRohdichte: number): FrischbetonErgebnis {
  const hinweise: Hinweis[] = [];
  const ps = proben.filter(p => [p.d1, p.d2, p.mLeer, p.mVoll, p.vol, p.a1, p.g].every(Number.isFinite));
  unvollstaendigeZeilen(hinweise, proben.map(p => [p.d1, p.d2, p.mLeer, p.mVoll, p.vol, p.a1, p.g]), 'proben');
  if (ps.length < 1) hinweise.push({ stufe: 'fehler', feld: 'proben', text: 'Mindestens eine vollständige Zeile eintragen (Ausbreitmaß, Wägung, Luftgehalt).' });
  if (ps.some(p => !(p.d1 > 0 && p.d2 > 0))) hinweise.push({ stufe: 'fehler', feld: 'd', text: 'Die Ausbreitdurchmesser müssen größer als 0 sein.' });
  if (ps.some(p => !(p.vol > 0))) hinweise.push({ stufe: 'fehler', feld: 'vol', text: 'Das Behältervolumen muss größer als 0 sein.' });
  if (ps.some(p => !(p.mVoll > p.mLeer))) hinweise.push({ stufe: 'fehler', feld: 'masse', text: 'Der gefüllte Behälter muss schwerer sein als der leere.' });
  if (ps.some(p => p.a1 < 0 || p.g < 0)) hinweise.push({ stufe: 'fehler', feld: 'luft', text: 'Luftgehalt und Korrekturfaktor können nicht negativ sein.' });
  if (hatFehler(hinweise)) return nurGueltig({ gueltig: false, werte: [], mittelF: NaN, mittelRohdichte: NaN, mittelLuft: NaN, hinweise });

  const werte = ps.map(p => {
    const f = ausbreitmass(p.d1, p.d2);
    const rohdichte = frischRohdichte(p.mLeer, p.mVoll, p.vol);
    return {
      f, klasse: ausbreitklasse(f), rohdichte,
      luft: p.a1 - p.g,
      luftAusDichte: sollRohdichte > 0 ? (1 - rohdichte / sollRohdichte) * 100 : NaN,
    };
  });
  // Grenzfallprüfung 02.11.2026: fehlende Soll-Rohdichte vorher ohne Hinweis
  if (!(Number.isFinite(sollRohdichte) && sollRohdichte > 0)) hinweise.push({ stufe: 'warnung', feld: 'soll', text: 'Ohne Soll-Rohdichte > 0 entfällt die Gegenprobe des Luftgehalts.' });
  if (ps.some(p => Math.abs(p.d1 - p.d2) > 50)) hinweise.push({ stufe: 'warnung', feld: 'd', text: 'd₁ und d₂ weichen um mehr als 50 mm ab – Ausbreittisch waagerecht? Kuchen einseitig verlaufen? Versuch ggf. wiederholen.' });
  if (werte.some(w => w.f < 340 || w.f > 620)) hinweise.push({ stufe: 'warnung', feld: 'd', text: 'Ausbreitmaß außerhalb von 340 bis 620 mm – dafür ist der Ausbreitversuch nur eingeschränkt geeignet (Setzmaß bzw. Setzfließmaß wählen).' });
  if (werte.some(w => w.rohdichte < 2000 || w.rohdichte > 2600)) hinweise.push({ stufe: 'warnung', feld: 'masse', text: 'Rohdichte außerhalb 2000 bis 2600 kg/m³ – für Normalbeton unplausibel (Wägung, Volumen, Verdichtung prüfen).' });
  if (werte.some(w => w.luft < 0)) hinweise.push({ stufe: 'warnung', feld: 'luft', text: 'Korrigierter Luftgehalt negativ – Korrekturfaktor G größer als der Ablesewert.' });
  return nurGueltig({
    gueltig: true, werte,
    mittelF: mittel(werte.map(w => w.f)),
    mittelRohdichte: mittel(werte.map(w => w.rohdichte)),
    mittelLuft: mittel(werte.map(w => w.luft)),
    hinweise,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Druckfestigkeit an Würfeln
// ─────────────────────────────────────────────────────────────────────────────

/** Druckfestigkeitsklassen für Normal- und Schwerbeton nach DIN EN 206: f_ck,cyl / f_ck,cube in MPa */
export const FESTIGKEITSKLASSEN = [
  [8, 10], [12, 15], [16, 20], [20, 25], [25, 30], [30, 37], [35, 45], [40, 50], [45, 55],
  [50, 60], [55, 67], [60, 75], [70, 85], [80, 95], [90, 105], [100, 115],
].map(([cyl, cube]) => ({ name: `C${cyl}/${cube}`, cyl, cube }));

export interface Wuerfel {
  /** Kantenlängen der Druckflächen in mm */
  a: number;
  b: number;
  /** Höhe in mm (für die Rohdichte) */
  h: number;
  /** Masse in kg */
  m: number;
  /** Höchstkraft in kN */
  F: number;
}

export interface WuerfelWert { flaeche: number; fc: number; fcCube: number; rohdichte: number }

export interface DruckEingabe {
  wuerfel: readonly Wuerfel[];
  /** true: Trockenlagerung (nach DIN EN 12390-2, Anhang NA) → Umrechnung auf Wasserlagerung */
  trocken: boolean;
  /** Zielklasse (Name, z. B. „C30/37“) für die Konformitätsprüfung */
  zielklasse: string;
}

export interface DruckErgebnis {
  gueltig: boolean;
  werte: WuerfelWert[];
  /** Umrechnungsfaktor (1 bei Wasserlagerung) */
  faktor: number;
  fcm: number;
  fmin: number;
  s: number;
  /** höchste Klasse, deren Kriterien erfüllt sind (Lehrvereinfachung) */
  erreicht: string;
  ziel?: { name: string; cube: number; krit1: boolean; krit2: boolean };
  hinweise: Hinweis[];
}

/** Druckfestigkeit in MPa aus Kraft in kN und Kantenlängen in mm, auf 0,1 MPa gerundet */
export const druckfestigkeit = (F: number, a: number, b: number) => Math.round(F * 1000 / (a * b) * 10) / 10;

/** Faktor für trocken gelagerte Würfel: 0,92 bis C50/60, 0,95 für hochfesten Beton */
/** Trocknungsfaktor 0,92/0,95; keine Zahl → NaN (F-1) */
export const trockenFaktor = (fcDry: number) => (!Number.isFinite(fcDry) ? NaN : fcDry > 60 / 0.92 ? 0.95 : 0.92);

export function druckpruefung(e: DruckEingabe): DruckErgebnis {
  const hinweise: Hinweis[] = [];
  const ws = e.wuerfel.filter(w => Number.isFinite(w.a) && Number.isFinite(w.b) && Number.isFinite(w.F));
  unvollstaendigeZeilen(hinweise, e.wuerfel.map(w => [w.a, w.b, w.F]), 'wuerfel');
  if (ws.length < 1) hinweise.push({ stufe: 'fehler', feld: 'wuerfel', text: 'Mindestens einen Würfel mit Kantenlängen und Höchstkraft eintragen.' });
  if (ws.some(w => !(w.a > 0 && w.b > 0))) hinweise.push({ stufe: 'fehler', feld: 'geometrie', text: 'Die Kantenlängen müssen größer als 0 sein.' });
  if (ws.some(w => !(w.F > 0))) hinweise.push({ stufe: 'fehler', feld: 'F', text: 'Die Höchstkraft muss größer als 0 sein.' });
  if (hatFehler(hinweise)) return nurGueltig({ gueltig: false, werte: [], faktor: 1, fcm: NaN, fmin: NaN, s: NaN, erreicht: '–', hinweise });

  const roh = ws.map(w => druckfestigkeit(w.F, w.a, w.b));
  const faktor = e.trocken ? trockenFaktor(mittel(roh)) : 1;
  const werte = ws.map((w, i) => ({
    flaeche: w.a * w.b,
    fc: roh[i],
    fcCube: Math.round(roh[i] * faktor * 10) / 10,
    rohdichte: Number.isFinite(w.h) && Number.isFinite(w.m) && w.h > 0 ? rundeAuf(w.m / (w.a * w.b * w.h) * 1e9, 10) : NaN,
  }));
  const f = werte.map(w => w.fcCube);
  const fcm = mittel(f), fmin = Math.min(...f);
  const erfuellt = (cube: number) => fcm >= cube + 4 - 1e-9 && fmin >= cube - 4 - 1e-9;
  const erreicht = [...FESTIGKEITSKLASSEN].reverse().find(k => erfuellt(k.cube))?.name ?? 'unter C8/10';
  const zk = FESTIGKEITSKLASSEN.find(k => k.name === e.zielklasse);
  const ziel = zk ? { name: zk.name, cube: zk.cube, krit1: fcm >= zk.cube + 4 - 1e-9, krit2: fmin >= zk.cube - 4 - 1e-9 } : undefined;

  if (ws.some(w => Math.abs(w.a - w.b) > 0.01 * Math.max(w.a, w.b))) hinweise.push({ stufe: 'warnung', feld: 'geometrie', text: 'Die Kantenlängen der Druckfläche weichen um mehr als 1 % voneinander ab – Maßtoleranzen nach DIN EN 12390-1 prüfen.' });
  if (ws.length < 3) hinweise.push({ stufe: 'warnung', feld: 'wuerfel', text: 'Die vereinfachte Konformitätsbewertung setzt mindestens drei Würfel voraus.' });
  if (werte.some(w => Number.isFinite(w.rohdichte) && (w.rohdichte < 2000 || w.rohdichte > 2600))) hinweise.push({ stufe: 'warnung', feld: 'm', text: 'Rohdichte außerhalb 2000 bis 2600 kg/m³ – Masse und Maße prüfen.' });
  if (ws.length >= 2 && (Math.max(...f) - fmin) > 0.15 * fcm) hinweise.push({ stufe: 'warnung', feld: 'F', text: 'Spannweite der Einzelwerte über 15 % des Mittelwerts – Bruchbilder, Herstellung und Lagerung prüfen.' });
  return nurGueltig({ gueltig: true, werte, faktor, fcm, fmin, s: stdabw(f), erreicht, ziel, hinweise });
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Mörtelprismen nach DIN EN 196-1
// ─────────────────────────────────────────────────────────────────────────────

/** Stützweite und Prismenbreite in mm */
export const PRISMA = { l: 100, b: 40 } as const;

/** Biegezugfestigkeit in MPa aus F in kN (Dreipunktbiegung, l = 100 mm, b = 40 mm) */
export const biegezugPrisma = (Ff: number) => 1.5 * Ff * 1000 * PRISMA.l / PRISMA.b ** 3;
/** Druckfestigkeit in MPa aus F in kN (Druckfläche 40 mm × 40 mm) */
export const druckPrisma = (Fc: number) => Fc * 1000 / (PRISMA.b * PRISMA.b);

/** Zementfestigkeitsklassen nach DIN EN 197-1: Normfestigkeit nach 28 Tagen (Unter- und Obergrenze in MPa) */
export const ZEMENTKLASSEN = [
  { name: '32,5', min: 32.5, max: 52.5 },
  { name: '42,5', min: 42.5, max: 62.5 },
  { name: '52,5', min: 52.5, max: Infinity },
] as const;

export interface Prisma {
  /** Bruchkraft Biegezug in kN */
  Ff: number;
  /** Bruchkräfte der beiden Hälften in kN */
  Fc1: number;
  Fc2: number;
}

export interface DruckMittel {
  mittel: number;
  /** Index (0–5) des verworfenen Einzelwerts; −1 = keiner */
  verworfen: number;
  /** false: Serie zu verwerfen */
  gueltig: boolean;
}

/** Mittelwert der Druckfestigkeiten mit ±10-%-Regel nach DIN EN 196-1 */
export function druckMittel196(werte: readonly number[]): DruckMittel {
  // Grenzfallprüfung 02.11.2026: nicht endliche Einzelwerte vorher als gültiges NaN-Mittel
  if (!werte.length || !werte.every(Number.isFinite)) return { mittel: NaN, verworfen: NaN, gueltig: false };
  const m6 = mittel(werte);
  const abw = werte.map(v => Math.abs(v - m6) / m6);
  const ausreisser = abw.filter(a => a > 0.1).length;
  if (ausreisser === 0) return nurGueltig({ mittel: m6, verworfen: -1, gueltig: true });
  const iMax = abw.indexOf(Math.max(...abw));
  const rest = werte.filter((_, i) => i !== iMax);
  const m5 = mittel(rest);
  const ok = rest.every(v => Math.abs(v - m5) / m5 <= 0.1);
  return nurGueltig({ mittel: m5, verworfen: iMax, gueltig: ok });
}

export interface MoertelErgebnis {
  gueltig: boolean;
  /** Biegezugfestigkeiten je Prisma in MPa */
  rf: number[];
  /** Druckfestigkeiten je Prismenhälfte in MPa */
  rc: number[];
  rfMittel: number;
  druck: DruckMittel;
  /** höchste Zementfestigkeitsklasse, deren Untergrenze nach 28 Tagen erreicht ist */
  klasse: string;
  hinweise: Hinweis[];
}

export function moertelprismen(prismen: readonly Prisma[], alterTage: number): MoertelErgebnis {
  const hinweise: Hinweis[] = [];
  const ps = prismen.filter(p => [p.Ff, p.Fc1, p.Fc2].every(Number.isFinite));
  unvollstaendigeZeilen(hinweise, prismen.map(p => [p.Ff, p.Fc1, p.Fc2]), 'prismen');
  if (ps.length < 1) hinweise.push({ stufe: 'fehler', feld: 'prismen', text: 'Mindestens ein Prisma mit Biegezug- und zwei Druckbruchkräften eintragen.' });
  if (ps.some(p => !(p.Ff > 0 && p.Fc1 > 0 && p.Fc2 > 0))) hinweise.push({ stufe: 'fehler', feld: 'F', text: 'Die Bruchkräfte müssen größer als 0 sein.' });
  const leer: MoertelErgebnis = { gueltig: false, rf: [], rc: [], rfMittel: NaN, druck: { mittel: NaN, verworfen: -1, gueltig: false }, klasse: '–', hinweise };
  if (hatFehler(hinweise)) return nurGueltig(leer);

  const rf = ps.map(p => biegezugPrisma(p.Ff));
  const rc = ps.flatMap(p => [druckPrisma(p.Fc1), druckPrisma(p.Fc2)]);
  const druck = druckMittel196(rc);
  if (ps.length !== 3) hinweise.push({ stufe: 'warnung', feld: 'prismen', text: 'DIN EN 196-1 wertet je Prüfalter drei Prismen aus (drei Biegezug-, sechs Druckwerte).' });
  if (!druck.gueltig) hinweise.push({ stufe: 'warnung', feld: 'F', text: 'Auch nach Verwerfen eines Einzelwerts weicht ein Druckwert um mehr als 10 % vom Mittel ab – die Serie ist zu verwerfen.' });
  if (ps.some(p => p.Ff > 10)) hinweise.push({ stufe: 'warnung', feld: 'Ff', text: 'Biegezugbruchkraft über 10 kN ist für Normmörtel unplausibel – Einheit (kN) prüfen.' });
  let klasse = '–';
  if (alterTage === 28 && druck.gueltig) {
    klasse = [...ZEMENTKLASSEN].reverse().find(z => druck.mittel >= z.min)?.name ?? 'unter 32,5';
  } else if (alterTage !== 28) {
    hinweise.push({ stufe: 'warnung', feld: 'alter', text: 'Die Normfestigkeit der Zementfestigkeitsklasse bezieht sich auf 28 Tage; bei anderem Prüfalter wird keine Klasse angegeben.' });
  }
  return nurGueltig({ gueltig: true, rf, rc, rfMittel: mittel(rf), druck, klasse, hinweise });
}
