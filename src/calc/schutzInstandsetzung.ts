// Rechenkerne der Bereiche „Mängel & Schäden“ und „Schutz & Instandsetzung“ (Modulprüfung Tranche 13, 29.10.2026).
// Unverändert aus den Modulen ausgelagert (bisher inline): Stahlbetoninstandhaltung (Chloriddiffusion, Rissinjektion),
// WTA-Merkblätter (Bohrrechner, Kombi-Planer), WU-Bauwerke (Nachweis), Zustandsbewertung (Zustandsnote),
// Schutz-Grundlagen (Fünferregel) und Tragwerksmonitoring (Belegreife-Richtwerte). Prüfung: tests/modulpruefungTranche13.test.ts.

/** Gaußsche Fehlerfunktion, Näherung nach Abramowitz/Stegun 7.1.26 (|Fehler| < 1,5 · 10⁻⁷). */
export function erf(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);
  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);
  return sign * y;
}

// ---------- Stahlbetoninstandhaltung: Chloriddiffusion (2. Ficksches Gesetz, C₀ = 0) ----------

/** Korrosionsauslösender Chloridgehalt (Anhaltswert, kein Normwert) in M.-% bezogen auf den Zement. */
export const CHLORID_KRITISCH = 0.5;
/** Warnschwelle des Rechners in M.-% bezogen auf den Zement. */
export const CHLORID_WARNUNG = 0.4;

/** Chloridgehalt C(x, t) = C_s · [1 − erf(x / (2·√(D·t)))]; C_s in M.-%/z, D in 10⁻¹² m²/s, t in Jahren, x in mm. */
export function chloridGehalt(cs: number, d12: number, tJahre: number, xMm: number): number {
  const tSek = tJahre * 365.25 * 86400;
  const nenner = 2 * Math.sqrt(d12 * 1e-12 * tSek);
  return Math.max(0, cs * (1 - erf((xMm * 1e-3) / nenner)));
}

export interface ChloridAuswertung {
  points: { x: number; c: number }[];
  cAtRebar: number;
  rebarStatus: 'ok' | 'warning' | 'critical';
  /** größte Tiefe des 2,5-mm-Rasters (0 bis 65 mm) mit C ≥ C_krit */
  depassivatedDepth: number;
  /** Abtragstiefe für Prinzip R: depassivierte Tiefe + 15 mm (Lehransatz) */
  erfAbtrag: number;
  critLimit: number;
}

export function chloridAuswertung(cs: number, d12: number, tJahre: number, deckungMm: number): ChloridAuswertung {
  const points: { x: number; c: number }[] = [];
  let depassivatedDepth = 0;
  for (let x = 0; x <= 65; x += 2.5) {
    const c = chloridGehalt(cs, d12, tJahre, x);
    points.push({ x, c });
    if (c >= CHLORID_KRITISCH) depassivatedDepth = x;
  }
  const cAtRebar = chloridGehalt(cs, d12, tJahre, deckungMm);
  const rebarStatus = cAtRebar >= CHLORID_KRITISCH ? 'critical' : cAtRebar >= CHLORID_WARNUNG ? 'warning' : 'ok';
  return { points, cAtRebar, rebarStatus, depassivatedDepth, erfAbtrag: depassivatedDepth > 0 ? depassivatedDepth + 15 : 0, critLimit: CHLORID_KRITISCH };
}

// ---------- Stahlbetoninstandhaltung: Rissinjektion (Lehrwerte) ----------

/** Packerabstand ≈ halbe Bauteildicke; Verpressdruck 0,08 bar je mm Bauteildicke, begrenzt auf 12 bis 35 bar (Lehrwert, keine Regelwerksgröße). */
export function rissinjektionPlan(bauteildickeMm: number): { packerSpacingMm: number; maxPressureBar: number } {
  return {
    packerSpacingMm: Math.round(bauteildickeMm / 2),
    maxPressureBar: Math.min(35, Math.max(12, Math.round(bauteildickeMm * 0.08))),
  };
}

// ---------- WTA 4-10: Bohrrechner für die Horizontalsperre (Lehrmodell) ----------

export type Mauergefuege = 'brick' | 'mixed' | 'hollow';

export interface WtaBohrplan {
  drillDepth: number; // cm
  drillSpacing: number; // cm
  drillDiameter: number; // cm
  holesPerMeter: number;
  singleHoleVolume: number; // cm³
  creamConsumption: number; // l/m
}

/** Bohrtiefe = Wanddicke − 5 cm; Abstand 12/10/8 cm; Ø 12 mm; Bedarf = Bohrlochvolumen · n · 1,15 (Lehrmodell). */
export function wtaBohrplan(wanddickeCm: number, gefuege: Mauergefuege): WtaBohrplan {
  const drillDepth = Math.max(1, wanddickeCm - 5);
  const drillSpacing = gefuege === 'mixed' ? 10 : gefuege === 'hollow' ? 8 : 12;
  const drillDiameter = 1.2;
  const holesPerMeter = Math.ceil(100 / drillSpacing);
  const singleHoleVolume = (Math.PI * drillDiameter ** 2 / 4) * drillDepth;
  const creamConsumption = (singleHoleVolume * holesPerMeter) / 1000 * 1.15;
  return { drillDepth, drillSpacing, drillDiameter, holesPerMeter, singleHoleVolume, creamConsumption };
}

// ---------- WTA-Kombi-Planer (eigenes Lehrmodell, keine Bewertung der WTA) ----------

export type Daemmstoff = 'calciumsilicat' | 'holzfaser' | 'mineralschaum' | 'pur_foelie';
export type SperreStatus = 'ok' | 'critical' | 'none';
export type Salzklasse = 'low' | 'medium' | 'high';
export type Regengruppe = 'group1' | 'group2' | 'group3';
export type KombiAlarm = 'sperreFehlt' | 'sperreKritisch' | 'salzHoch' | 'schlagregen' | 'purFolie' | 'holzfaserFeucht';
export type KombiEmpfehlung = 'sperreZuerst' | 'trocknung' | 'porengrundputz' | 'ausgleichsputz' | 'hydrophobierung' | 'putzrisse' | 'kapillaraktiv' | 'calciumsilicat' | 'holzfaserTrocken';

export interface KombiBewertung {
  score: number;
  stufe: 'gruen' | 'orange' | 'rot';
  alarme: KombiAlarm[];
  empfehlungen: KombiEmpfehlung[];
}

/** Punkteschema 0 bis 100 (Start 100; Abzüge −50/−20 Sperre, −30/−10 Salz, −25 Schlagregen, −40 PUR/Folie, −15 Holzfaser bei Restfeuchte; +15 Calciumsilicat). */
export function wtaKombiBewertung(daemm: Daemmstoff, sperre: SperreStatus, salz: Salzklasse, regen: Regengruppe): KombiBewertung {
  let score = 100;
  const alarme: KombiAlarm[] = [];
  const empfehlungen: KombiEmpfehlung[] = [];
  if (sperre === 'none') { score -= 50; alarme.push('sperreFehlt'); empfehlungen.push('sperreZuerst'); }
  else if (sperre === 'critical') { score -= 20; alarme.push('sperreKritisch'); empfehlungen.push('trocknung'); }
  if (salz === 'high') { score -= 30; alarme.push('salzHoch'); empfehlungen.push('porengrundputz'); }
  else if (salz === 'medium' && daemm !== 'calciumsilicat') { score -= 10; empfehlungen.push('ausgleichsputz'); }
  if (regen === 'group3') { score -= 25; alarme.push('schlagregen'); empfehlungen.push('hydrophobierung'); }
  else if (regen === 'group2') empfehlungen.push('putzrisse');
  if (daemm === 'pur_foelie') { score -= 40; alarme.push('purFolie'); empfehlungen.push('kapillaraktiv'); }
  else if (daemm === 'calciumsilicat') { score += 15; empfehlungen.push('calciumsilicat'); }
  else if (daemm === 'holzfaser') {
    if (sperre !== 'ok') { score -= 15; alarme.push('holzfaserFeucht'); }
    empfehlungen.push('holzfaserTrocken');
  }
  score = Math.max(0, Math.min(100, score));
  return { score, stufe: score < 40 ? 'rot' : score < 75 ? 'orange' : 'gruen', alarme, empfehlungen };
}

// ---------- WU-Bauwerke: Nachweis nach DAfStb-WU-Richtlinie 2017-12 ----------

export interface WuNachweis {
  druckgefaelle: number;
  mindestDicke: number;
  dickeOk: boolean;
  zulRissbreite: number;
  rissbreiteOk: boolean;
  selbstheilungMoeglich: boolean;
}

/**
 * Druckgefälle I = h_w / h; Mindestdicken nach Tab. 1 (BK 1: Wand 240, Bodenplatte 250 mm; BK 2: Wand 200 mm Ortbeton,
 * 240 mm Elementwand, Bodenplatte 150 mm); Rechenwert der Trennrissbreite für Selbstheilung (Entwurfsgrundsatz b):
 * I ≤ 10 → 0,20 mm, ≤ 15 → 0,15 mm, ≤ 25 → 0,10 mm; BK 2 Orientierungswert 0,30 mm.
 */
export function wuNachweis(hwM: number, hMm: number, rissbreiteMm: number, bk: '1' | '2', bauteil: 'Wand' | 'Bodenplatte', bauart: 'ortbeton' | 'elementwand'): WuNachweis {
  const druckgefaelle = hMm > 0 ? hwM / (hMm / 1000) : 0;
  const mindestDicke = bk === '1' ? (bauteil === 'Wand' ? 240 : 250) : (bauteil === 'Wand' ? (bauart === 'ortbeton' ? 200 : 240) : 150);
  let zulRissbreite = 0.30;
  let selbstheilungMoeglich = true;
  if (bk === '1') {
    if (druckgefaelle <= 10) zulRissbreite = 0.20;
    else if (druckgefaelle <= 15) zulRissbreite = 0.15;
    else if (druckgefaelle <= 25) zulRissbreite = 0.10;
    else { zulRissbreite = 0.10; selbstheilungMoeglich = false; }
  }
  return { druckgefaelle, mindestDicke, dickeOk: hMm >= mindestDicke, zulRissbreite, rissbreiteOk: rissbreiteMm <= zulRissbreite + 0.001, selbstheilungMoeglich };
}

// ---------- Zustandsbewertung (in Anlehnung an RI-EBW-PRÜF, didaktisch vereinfacht) ----------

/** Z = max(S, V, D) + 0,1 · n, begrenzt auf 1,0 bis 4,0 und auf eine Nachkommastelle gerundet (kein Algorithmus von SIB-Bauwerke). */
export function zustandsnote(s: number, v: number, d: number, weitereSchaeden: number): number {
  const z = Math.min(4.0, Math.max(1.0, Math.max(s, v, d) + weitereSchaeden * 0.1));
  return Math.round(z * 10) / 10;
}

/** Kategoriale Zuordnung der sechs RI-EBW-Notenbereiche zu Schulnoten (didaktisch, keine Regelwerksgröße). */
export function schulnoteAusZustandsnote(z: number): 1 | 2 | 3 | 4 | 5 | 6 {
  return z < 1.5 ? 1 : z < 2.0 ? 2 : z < 2.5 ? 3 : z < 3.0 ? 4 : z < 3.5 ? 5 : 6;
}

// ---------- Schutz-Grundlagen: Fünferregel nach de Sitter (1984) ----------

/** K_n = K_0 · 5ⁿ (n = 0 Entwurf, 1 vor Schadensbeginn, 2 lokaler Schaden, 3 umfassende Instandsetzung). */
export const deSitterKosten = (k0: number, n: number) => k0 * 5 ** n;

// ---------- Tragwerksmonitoring: Belegreife (CM-Richtwerte der Schnittstellenkoordination, belagsabhängig) ----------

/** CM-Richtwert in CM-%: Zementestrich 2,0 (beheizt 1,8), Calciumsulfatestrich 0,5 (beheizt 0,3); Mauerwerk ohne Grenzwert (NaN). */
export function belegreifeGrenzeCM(untergrund: 'cement' | 'anhydrite' | 'brick', beheizt: boolean): number {
  if (untergrund === 'cement') return beheizt ? 1.8 : 2.0;
  if (untergrund === 'anhydrite') return beheizt ? 0.3 : 0.5;
  return NaN;
}
