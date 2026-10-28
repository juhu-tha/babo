/**
 * Übergabe von Eingaben aus den Einzelrechnern an die Lebensdauerbemessung (/modul/lebensdauerbemessung).
 *
 * Die Einzelrechner (Schnellkarbonatisierung, Bewehrungskorrosion, Dauerhaftigkeit, Bauwerksuntersuchung,
 * Expositionsklassen) erzeugen mit `uebergabeSuche` eine Adresse mit URL-Parametern; die Lebensdauerbemessung liest sie
 * mit `leseUebergabe` ein. Jeder Wert wird geprüft (Plausibilitätsschicht src/calc/plausibilitaet.ts); ungültige Werte
 * werden nicht übernommen und als Warnung gemeldet. Aus den Werten folgt eine Vorgabe für die Eingabemaske
 * (`vorgabeAusUebergabe`), z. B. Mechanismus und Umgebung aus den Expositionsklassen oder das nächstliegende Bindemittel
 * aus dem Alterungsexponenten a.
 *
 * Reiner Rechenkern ohne React – geprüft in tests/lebensdauerUebergabe.test.ts.
 */
import { type Hinweis, istEndlich } from './plausibilitaet';
import { FIB_CHLORID, type Mechanismus } from './lebensdauer';
import { modulPfad } from '../routing/pfad';

/** Module, aus denen übernommen werden kann (Registry-IDs) */
export const UEBERGABE_QUELLEN = {
  schnellkarbonatisierung: 'Schnellkarbonatisierung (DIN EN 12390-12)',
  korrosion: 'Bewehrungskorrosion',
  dauerhaftigkeit: 'Dauerhaftigkeit – Lebensdauersimulator',
  // Prüfverfahren-Katalog seit der Aufteilung (28.10.2026) eigenes Teilmodul; „bauwerksuntersuchung“ bleibt für alte Links (?von=…)
  pruefverfahren_katalog: 'Bauwerksdiagnose – Karbonatisierungsmessung',
  bauwerksuntersuchung: 'Bauwerksdiagnose – Karbonatisierungsmessung',
  bauwerksunters_monitoring: 'Bauwerksdiagnose – Karbonatisierungsmessung',
  expositionsklassen: 'Expositionsklassen',
} as const;
export type UebergabeQuelle = keyof typeof UEBERGABE_QUELLEN;

export type Bindemittel = 'cemI' | 'flugasche' | 'huettensand';
export const BINDEMITTEL_NAME: Readonly<Record<Bindemittel, string>> = { cemI: 'CEM I', flugasche: 'CEM I + Flugasche', huettensand: 'CEM III/B' };

export interface LebensdauerUebergabe {
  quelle: UebergabeQuelle;
  mech?: Mechanismus;
  /** Nutzungsdauer in Jahren */
  tSL?: number;
  /** Betondeckung: Mittelwert und Standardabweichung in mm */
  deckM?: number;
  deckS?: number;
  /** K_AC in mm/√d aus der Schnellkarbonatisierung und CO₂-Konzentration der Prüfung in Vol.-% */
  kac?: number;
  cAcc?: number;
  /** Karbonatisierungstiefe im ACC-Test (2 Vol.-% CO₂, 28 d) in mm */
  xcAcc?: number;
  /** R⁻¹_ACC,0 in 10⁻¹¹ (m²/s)/(kg/m³) */
  rInv?: number;
  /** Karbonatisierungskoeffizient K nach dem Wurzel-t-Gesetz in mm/√a (nur Vergleichswert) */
  kNat?: number;
  /** D_RCM,0 bzw. D_app,0 bei 28 d in 10⁻¹² m²/s */
  drcm?: number;
  /** Oberflächenchloridgehalt C_S in M.-% bez. auf Bindemittel */
  cS?: number;
  /** Alterungsexponent a */
  a?: number;
  binder?: Bindemittel;
  /** gewählte Expositionsklassen */
  expo?: string[];
}

/** URL-Parameter (Kurzname → Feld) mit zulässigem Bereich [min, max] und Ausschluss der Untergrenze */
const ZAHLEN: readonly { p: string; feld: keyof LebensdauerUebergabe; name: string; min: number; max: number; minOffen: boolean; einheit: string }[] = [
  { p: 'tsl', feld: 'tSL', name: 'Nutzungsdauer', min: 0, max: 200, minOffen: true, einheit: 'a' },
  { p: 'deck', feld: 'deckM', name: 'Betondeckung', min: 0, max: 150, minOffen: true, einheit: 'mm' },
  { p: 'deck_s', feld: 'deckS', name: 'Standardabweichung der Betondeckung', min: 0, max: 30, minOffen: false, einheit: 'mm' },
  { p: 'kac', feld: 'kac', name: 'K_AC', min: 0, max: 30, minOffen: true, einheit: 'mm/√d' },
  { p: 'cacc', feld: 'cAcc', name: 'CO₂-Konzentration der Prüfung', min: 0.5, max: 10, minOffen: false, einheit: 'Vol.-%' },
  { p: 'xcacc', feld: 'xcAcc', name: 'x_c im ACC-Test', min: 0, max: 60, minOffen: true, einheit: 'mm' },
  { p: 'rinv', feld: 'rInv', name: 'R⁻¹_ACC,0', min: 0, max: 1000, minOffen: true, einheit: '· 10⁻¹¹ (m²/s)/(kg/m³)' },
  { p: 'knat', feld: 'kNat', name: 'Karbonatisierungskoeffizient K', min: 0, max: 30, minOffen: true, einheit: 'mm/√a' },
  { p: 'drcm', feld: 'drcm', name: 'D_RCM,0', min: 0, max: 100, minOffen: true, einheit: '· 10⁻¹² m²/s' },
  { p: 'cs', feld: 'cS', name: 'Oberflächenchloridgehalt C_S', min: 0, max: 10, minOffen: true, einheit: 'M.-%' },
  { p: 'a', feld: 'a', name: 'Alterungsexponent a', min: 0, max: 0.99, minOffen: false, einheit: '' },
];

/** alle URL-Parameter der Übergabe (zum Entfernen aus der Adresse nach dem Einlesen) */
export const UEBERGABE_SCHLUESSEL: readonly string[] = ['von', 'mech', 'bm', 'expo', ...ZAHLEN.map(z => z.p)];

const EXPO_MUSTER = /^X(0|C[1-4]|D[1-3]|S[1-3]|F[1-4]|A[1-3]|M[1-3])$/;

/** Zahl für die Adresse: Punkt als Dezimaltrenner, höchstens 6 signifikante Stellen */
const zahlText = (v: number) => String(Number(v.toPrecision(6)));

/** Suchteil der Adresse (?von=…&…) für die Lebensdauerbemessung; nicht endliche Werte entfallen */
export function uebergabeSuche(u: LebensdauerUebergabe): string {
  const p = new URLSearchParams();
  p.set('von', u.quelle);
  if (u.mech) p.set('mech', u.mech);
  for (const z of ZAHLEN) {
    const v = u[z.feld];
    if (typeof v === 'number' && Number.isFinite(v)) p.set(z.p, zahlText(v));
  }
  if (u.binder) p.set('bm', u.binder);
  if (u.expo && u.expo.length) p.set('expo', u.expo.join(','));
  return `?${p.toString()}`;
}

/** Pfad der Lebensdauerbemessung mit Übergabe */
export const uebergabeAdresse = (u: LebensdauerUebergabe) => `${modulPfad('lebensdauerbemessung')}${uebergabeSuche(u)}`;

export interface UebergabeLesen {
  /** null: keine (gültige) Übergabe in der Adresse */
  daten: LebensdauerUebergabe | null;
  hinweise: Hinweis[];
}

const deZahl = (v: number) => String(Number(v.toPrecision(4))).replace('.', ',');

/** Liest und prüft die Übergabe aus dem Suchteil der Adresse */
export function leseUebergabe(suche: string): UebergabeLesen {
  const hinweise: Hinweis[] = [];
  let p: URLSearchParams;
  try { p = new URLSearchParams(suche); } catch { return { daten: null, hinweise }; }
  const von = p.get('von');
  if (von === null) return { daten: null, hinweise };
  if (!(von in UEBERGABE_QUELLEN)) {
    hinweise.push({ stufe: 'warnung', feld: 'von', text: `Übergabe aus unbekanntem Modul „${von.slice(0, 40)}“ – keine Werte übernommen.` });
    return { daten: null, hinweise };
  }
  const d: LebensdauerUebergabe = { quelle: von as UebergabeQuelle };
  const mech = p.get('mech');
  if (mech !== null) {
    if (mech === 'karbonatisierung' || mech === 'chlorid') d.mech = mech;
    else hinweise.push({ stufe: 'warnung', feld: 'mech', text: 'Unbekannter Mechanismus in der Übergabe – nicht übernommen.' });
  }
  for (const z of ZAHLEN) {
    const roh = p.get(z.p);
    if (roh === null) continue;
    const v = roh.trim() === '' ? NaN : Number(roh.replace(',', '.'));
    const unten = z.minOffen ? v > z.min : v >= z.min;
    if (!istEndlich(v) || !unten || v > z.max) {
      const grenze = `${z.minOffen ? 'über' : 'ab'} ${deZahl(z.min)} bis ${deZahl(z.max)}${z.einheit ? ` ${z.einheit}` : ''}`;
      hinweise.push({ stufe: 'warnung', feld: z.feld, text: `${z.name}: Übergabewert „${roh.slice(0, 20)}“ ist ungültig (zulässig ${grenze}) – nicht übernommen.` });
      continue;
    }
    (d as unknown as Record<string, number>)[z.feld] = v;
  }
  const bm = p.get('bm');
  if (bm !== null) {
    if (bm === 'cemI' || bm === 'flugasche' || bm === 'huettensand') d.binder = bm;
    else hinweise.push({ stufe: 'warnung', feld: 'bm', text: 'Unbekanntes Bindemittel in der Übergabe – nicht übernommen.' });
  }
  const expo = p.get('expo');
  if (expo !== null) {
    const codes = expo.split(',').map(c => c.trim().toUpperCase()).filter(Boolean);
    const gut = codes.filter(c => EXPO_MUSTER.test(c)).slice(0, 12);
    if (gut.length < codes.length) hinweise.push({ stufe: 'warnung', feld: 'expo', text: 'Mindestens eine Expositionsklasse der Übergabe ist unbekannt und wurde nicht übernommen.' });
    if (gut.length) d.expo = gut;
  }
  if (d.cAcc !== undefined && d.kac === undefined) delete d.cAcc;
  return { daten: d, hinweise };
}

/** nächstliegendes Bindemittel zum Alterungsexponenten a (Mittelwerte nach fib 34: CEM I 0,30; CEM III/B 0,45; Flugasche 0,60) */
export function bindemittelAusAlterung(a: number): Bindemittel {
  const kand = Object.entries(FIB_CHLORID.alterung) as [Bindemittel, { m: number }][];
  let best: Bindemittel = 'cemI', abst = Infinity;
  for (const [id, v] of kand) { const d = Math.abs(v.m - a); if (d < abst - 1e-12) { abst = d; best = id; } }
  return best;
}

/** Umgebung des Karbonatisierungsmodells je XC-Klasse: RH_real Beta auf [40; 100] % nach Carević/Ignjatović 2022, Tab. 1 */
export const XC_UMGEBUNG: Readonly<Record<'XC2' | 'XC3' | 'XC4', { rhM: number; rhS: number; beregnet: boolean }>> = {
  XC2: { rhM: 79, rhS: 9, beregnet: false },
  XC3: { rhM: 65, rhS: 10, beregnet: false },
  XC4: { rhM: 75, rhS: 16, beregnet: true },
};
/** Schlagregen für beregnete Flächen (XC4) wie Vorgabe „XC4, beregnet“: p_SR = 1, ToW = 0,3 (Beispielwert, vorläufig) */
export const BEREGNET = { pSR: 1, tow: 0.3 } as const;

/** Werte für die Eingabemaske der Lebensdauerbemessung (Namen wie im Modul) */
export interface LebensdauerVorgabe {
  mech?: Mechanismus;
  tSL?: number;
  deckM?: number;
  deckS?: number;
  rArt?: 'acc' | 'direkt' | 'kac';
  kac?: number;
  kacC?: number;
  xcAcc?: number;
  rDirekt?: number;
  binder?: Bindemittel;
  drcm?: number;
  cS?: number;
  zone?: 'spritz' | 'nebel';
  rhM?: number;
  rhS?: number;
  pSR?: number;
  tow?: number;
}

export interface VorgabeErgebnis {
  vorgabe: LebensdauerVorgabe;
  /** lesbare Liste der übernommenen Größen */
  uebernommen: string[];
  /** Vergleichswert K nach dem Wurzel-t-Gesetz (mm/√a) oder null */
  kNat: number | null;
  hinweise: Hinweis[];
}

/** Leitet aus der Übergabe die Vorgabe für die Eingabemaske ab */
export function vorgabeAusUebergabe(u: LebensdauerUebergabe): VorgabeErgebnis {
  const v: LebensdauerVorgabe = {};
  const liste: string[] = [];
  const hinweise: Hinweis[] = [];
  const expo = u.expo ?? [];
  const chloridKlasse = expo.filter(c => /^X[DS]/.test(c));
  const xc = expo.filter(c => /^XC/.test(c)).sort();
  let mech = u.mech;
  if (!mech && chloridKlasse.length) mech = 'chlorid';
  if (!mech && (xc.length || u.kac !== undefined || u.xcAcc !== undefined || u.rInv !== undefined || u.kNat !== undefined)) mech = 'karbonatisierung';
  if (!mech && (u.drcm !== undefined || u.cS !== undefined || u.a !== undefined)) mech = 'chlorid';
  if (mech) { v.mech = mech; liste.push(`Mechanismus ${mech === 'chlorid' ? 'Chlorid' : 'Karbonatisierung'}`); }
  if (expo.length) liste.push(`Expositionsklassen ${expo.join(', ')}`);
  if (u.tSL !== undefined) { v.tSL = u.tSL; liste.push(`Nutzungsdauer ${deZahl(u.tSL)} a`); }
  if (u.deckM !== undefined) { v.deckM = u.deckM; liste.push(`Betondeckung ${deZahl(u.deckM)} mm`); }
  if (u.deckS !== undefined) { v.deckS = u.deckS; liste.push(`Standardabweichung ${deZahl(u.deckS)} mm`); }

  if (mech === 'karbonatisierung') {
    if (u.kac !== undefined) {
      v.rArt = 'kac'; v.kac = u.kac; v.kacC = u.cAcc ?? 3;
      liste.push(`K_AC = ${deZahl(u.kac)} mm/√d bei ${deZahl(v.kacC)} Vol.-% CO₂`);
    } else if (u.xcAcc !== undefined) {
      v.rArt = 'acc'; v.xcAcc = u.xcAcc; liste.push(`x_c (ACC) = ${deZahl(u.xcAcc)} mm`);
    } else if (u.rInv !== undefined) {
      v.rArt = 'direkt'; v.rDirekt = u.rInv; liste.push(`R⁻¹_ACC,0 = ${deZahl(u.rInv)} · 10⁻¹¹`);
    } else if (u.kNat !== undefined) {
      hinweise.push({ stufe: 'warnung', feld: 'kNat', text: 'Ein Karbonatisierungskoeffizient K nach dem Wurzel-t-Gesetz ist keine Eingangsgröße des fib-Modells. Er wird nur als Vergleich angezeigt; den Betonwiderstand R⁻¹_ACC,0 bitte aus einer Prüfung eingeben.' });
    }
    if (u.kNat !== undefined) liste.push(`Vergleich K = ${deZahl(u.kNat)} mm/√a`);
    const massgebend = xc[xc.length - 1] as 'XC1' | 'XC2' | 'XC3' | 'XC4' | undefined;
    if (massgebend && massgebend !== 'XC1') {
      const umg = XC_UMGEBUNG[massgebend];
      v.rhM = umg.rhM; v.rhS = umg.rhS;
      if (umg.beregnet) { v.pSR = BEREGNET.pSR; v.tow = BEREGNET.tow; } else { v.pSR = 0; v.tow = 0; }
      liste.push(`Umgebung ${massgebend}: RH ${deZahl(umg.rhM)} ± ${deZahl(umg.rhS)} %${umg.beregnet ? `, p_SR = 1, ToW = ${deZahl(BEREGNET.tow)}` : ', vor Regen geschützt'}`);
    } else if (massgebend === 'XC1') {
      hinweise.push({ stufe: 'warnung', feld: 'expo', text: 'XC1 umfasst trockene und ständig nasse Bauteile – die relative Luftfeuchte bitte objektbezogen eingeben.' });
    }
  } else if (mech === 'chlorid') {
    if (u.drcm !== undefined) { v.drcm = u.drcm; liste.push(`D_RCM,0 = ${deZahl(u.drcm)} · 10⁻¹² m²/s`); }
    if (u.cS !== undefined) { v.cS = u.cS; liste.push(`C_S = ${deZahl(u.cS)} M.-%`); }
    if (u.binder) { v.binder = u.binder; liste.push(`Bindemittel ${BINDEMITTEL_NAME[u.binder]}`); }
    else if (u.a !== undefined) {
      v.binder = bindemittelAusAlterung(u.a);
      const am = FIB_CHLORID.alterung[v.binder].m;
      liste.push(`Bindemittel ${BINDEMITTEL_NAME[v.binder]} (a = ${deZahl(am)})`);
      if (Math.abs(am - u.a) > 0.05) hinweise.push({ stufe: 'warnung', feld: 'a', text: `Alterungsexponent a = ${deZahl(u.a)} übergeben; das Modell verwendet die fib-Verteilung des nächstliegenden Bindemittels (${BINDEMITTEL_NAME[v.binder]}, a = ${deZahl(am)}).` });
    }
    const zone = chloridKlasse.some(c => c === 'XD3' || c === 'XS3') ? 'spritz' : chloridKlasse.length ? 'nebel' : undefined;
    if (zone) { v.zone = zone; liste.push(zone === 'spritz' ? 'Spritzwasser (Konvektionszone Δx)' : 'ohne Konvektionszone (Δx = 0)'); }
  }
  return { vorgabe: v, uebernommen: liste, kNat: u.kNat ?? null, hinweise };
}
