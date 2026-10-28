/**
 * Bodenmechanik: Zustandsgrenzen und Klassifikation (DIN EN ISO 17892-12, DIN 18196), Mohr-Coulomb,
 * Erddruck nach Rankine (glatte, lotrechte Wand, waagerechtes Gelände, kohäsionslos), eindimensionale Konsolidierung (Terzaghi).
 * Reiner Rechenkern – geprüft in tests/boden.test.ts.
 */
import { type Hinweis, istEndlich, muss, bereich, hatFehler } from './plausibilitaet';
import { formatDeZahl } from '../utils/numberFormat';

/**
 * Zustandsform aus der Konsistenzzahl nach DIN EN ISO 14688-2 (T2-B-1, Entscheidung 28.10.2026):
 * I_C < 0,25 breiig (very soft) · 0,25–0,50 weich (soft) · 0,50–0,75 steif (firm) · 0,75–1,00 halbfest (stiff) ·
 * > 1,00 fest (very stiff); I_C < 0 zusätzlich „flüssig“ (oberhalb der Fließgrenze). Grenzen öffentlich: Geocentrix,
 * „ISO 14688-2: Consistency of silts and clays“. Deutsche Bezeichnungen nach den Feldmerkmalen (breiig: quillt beim
 * Pressen zwischen den Fingern; steif: schwer knetbar, zu 3-mm-Röllchen ausrollbar; halbfest: bröckelt beim Ausrollen;
 * fest: nicht mehr knetbar), öffentlich: BGR, BoreholeML-Codeliste „Consistency“ v2 – Zuordnung zu den Normbegriffen
 * vorläufig, F-Freigabe (Normtext DIN EN ISO 14688-2, Tabelle Konsistenz). Vorher Einteilung der früheren DIN 18122-1
 * (breiig 0–0,5, weich 0,5–0,75, steif 0,75–1,0, halbfest/fest > 1,0).
 */
export function zustandsformISO14688(iC: number): string {
  return iC < 0 ? 'flüssig' : iC < 0.25 ? 'breiig' : iC < 0.5 ? 'weich' : iC < 0.75 ? 'steif' : iC <= 1.0 ? 'halbfest' : 'fest';
}

export function zustandsgrenzen(w: number, wL: number, wP: number) {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(w, wL, wP), 'eingabe', 'Alle Wassergehalte müssen Zahlen sein.');
  if (!hatFehler(hinweise)) {
    muss(hinweise, w >= 0 && wL > 0 && wP > 0, 'w', 'Wassergehalte müssen positiv sein.');
    muss(hinweise, wP < wL, 'wP', 'Die Ausrollgrenze w_P muss kleiner als die Fließgrenze w_L sein (I_P > 0).');
  }
  if (hatFehler(hinweise)) return { iP: NaN, iC: NaN, zustand: '–', klasse: '–', hinweise };

  const iP = wL - wP;
  const iC = (wL - w) / iP;
  const zustand = zustandsformISO14688(iC);
  // Plastizitätsdiagramm DIN 18196: A-Linie I_P = 0,73·(w_L − 20); Zwischenbereich 4 ≤ I_P < 7 oberhalb der A-Linie
  const aLinie = 0.73 * (wL - 20);
  let klasse: string;
  if (iP >= aLinie && iP >= 7) klasse = wL < 35 ? 'TL (Ton, leicht plastisch)' : wL <= 50 ? 'TM (Ton, mittelplastisch)' : 'TA (Ton, ausgeprägt plastisch) bzw. OT bei organischen Beimengungen';
  else if (iP >= aLinie && iP >= 4) klasse = 'UL/TL (Zwischenbereich, 4 ≤ I_P < 7)';
  else klasse = wL < 35 ? 'UL (Schluff, leicht plastisch)' : wL <= 50 ? 'UM (Schluff, mittelplastisch) bzw. OU bei organischen Beimengungen' : 'UA (Schluff, ausgeprägt plastisch); bei organischen Beimengungen Gruppe nach DIN 18196 prüfen';
  if (wL > 120) hinweise.push({ stufe: 'warnung', feld: 'wL', text: 'w_L > 120 % liegt außerhalb des üblichen Plastizitätsdiagramms.' });
  return { iP, iC, zustand, klasse, hinweise };
}

/* ────────────────────────────────────────────────────────────────────────────────────────────────
 * Atterberg-Grenzen (Z24): Auswertung des Fließgrenzenversuchs nach Casagrande und des Ausrollversuchs,
 * Plastizitätsdiagramm nach Casagrande mit A-Linie I_P = 0,73·(w_L − 20) und Bodengruppen nach DIN 18196.
 *  - Mehrpunktverfahren: Ausgleichsgerade w = a + b·lg N durch ≥ 4 Einzelversuche mit 15 ≤ N ≤ 40 Schlägen,
 *    w_L = Wassergehalt bei N = 25 (HAW Kiel, Laborblatt „Fließgrenzengerät nach Casagrande“, 2025, nach DIN EN ISO 17892-12)
 *  - Einpunktverfahren: w_L = w_N·(N/25)^0,121 (ASTM D4318, Verfahren B; Exponent für DIN EN ISO 17892-12 vorläufig, F-Freigabe)
 *  - Ausrollgrenze w_P: Mittelwert der Ausrollversuche (Walzen von 3 mm Durchmesser zerbröckeln)
 *  - I_P = w_L − w_P, I_C = (w_L − w)/I_P und Zustandsform wie zustandsgrenzen() (DIN EN ISO 14688-2, T2-B-1)
 *  - Bodengruppen: TL/UL w_L < 35 %, TM/UM 35 … 50 %, TA/UA > 50 %; oberhalb der A-Linie und I_P ≥ 7 % Ton,
 *    unterhalb oder I_P < 4 % Schluff, dazwischen (4 ≤ I_P < 7 % oberhalb der A-Linie) Zwischenbereich UL/TL;
 *    organogen: OU (unterhalb A-Linie, w_L 35 … 50 %), OT (oberhalb A-Linie, w_L > 50 %) – Organik selbst nicht bestimmbar.
 *    T2-B-2 (Entscheidung 28.10.2026): Organisch, w_L > 50 % und unterhalb der A-Linie liegt in keinem der Felder OU/OT;
 *    ausgegeben wird UA mit Hinweis „Zuordnung (OU/OH) nach DIN 18196 prüfen“ statt OU (vorläufig, F-Freigabe).
 * Wassergehalte in %.
 * ──────────────────────────────────────────────────────────────────────────────────────────────── */

/** Exponent des Einpunktverfahrens (ASTM D4318, Verfahren B: tan β = 0,121) – vorläufig, F-Freigabe */
export const EINPUNKT_EXPONENT = 0.121;

/** A-Linie des Plastizitätsdiagramms: I_P = 0,73·(w_L − 20) */
export const aLinie = (wL: number) => 0.73 * (wL - 20);

export interface FliessVersuch { schlaege: number; w: number }

/** Fließgrenze nach dem Einpunktverfahren: w_L = w_N·(N/25)^0,121 */
export const fliessgrenzeEinpunkt = (w: number, schlaege: number) => w * Math.pow(schlaege / 25, EINPUNKT_EXPONENT);

export interface FliessgrenzenErgebnis {
  wL: number;
  /** Ausgleichsgerade w = a + b·lg N (Einpunktverfahren: Gerade mit Neigung −0,121·w_L durch den Messpunkt, nur zur Darstellung) */
  a: number;
  b: number;
  /** Bestimmtheitsmaß der Ausgleichsgeraden (NaN bei weniger als 3 Punkten) */
  r2: number;
  verfahren: 'einpunkt' | 'mehrpunkt';
  hinweise: Hinweis[];
}

/** Fließgrenze aus einem (Einpunkt-) oder mehreren Versuchen (Mehrpunktverfahren) */
export function fliessgrenze(versuche: readonly FliessVersuch[]): FliessgrenzenErgebnis {
  const hinweise: Hinweis[] = [];
  const leer = (): FliessgrenzenErgebnis => ({ wL: NaN, a: NaN, b: NaN, r2: NaN, verfahren: versuche.length === 1 ? 'einpunkt' : 'mehrpunkt', hinweise });
  muss(hinweise, versuche.length >= 1, 'versuche', 'Mindestens ein Fließgrenzenversuch ist erforderlich.');
  versuche.forEach((v, i) => muss(hinweise, istEndlich(v.schlaege, v.w) && v.schlaege >= 1 && v.w > 0, `versuch${i}`, `Versuch ${i + 1}: Schlagzahl ≥ 1 und Wassergehalt > 0 % erforderlich.`));
  if (hatFehler(hinweise)) return leer();
  versuche.forEach((v, i) => { if (v.schlaege < 15 || v.schlaege > 40) hinweise.push({ stufe: 'warnung', feld: `versuch${i}`, text: `Versuch ${i + 1}: ${v.schlaege} Schläge liegen außerhalb des gültigen Bereichs 15–40.` }); });

  if (versuche.length === 1) {
    const { w, schlaege } = versuche[0];
    const wL = fliessgrenzeEinpunkt(w, schlaege);
    if (schlaege < 20 || schlaege > 30) hinweise.push({ stufe: 'warnung', feld: 'versuch0', text: 'Einpunktverfahren: Die Näherung ist nur für etwa 20–30 Schläge vorgesehen.' });
    hinweise.push({ stufe: 'warnung', feld: 'verfahren', text: 'Einpunktverfahren: Näherung mit fester Neigung der Fließkurve; für Nachweise das Mehrpunktverfahren mit mindestens 4 Versuchen verwenden.' });
    // Darstellungsgerade durch den Messpunkt mit der Neigung der Einpunktformel bei N = 25: dw/d(lg N) = −0,121·ln 10·w_L
    const b = -EINPUNKT_EXPONENT * Math.LN10 * wL;
    return { wL, a: wL - b * Math.log10(25), b, r2: NaN, verfahren: 'einpunkt', hinweise };
  }

  const x = versuche.map(v => Math.log10(v.schlaege)), y = versuche.map(v => v.w);
  const n = x.length;
  const mx = x.reduce((s, v) => s + v, 0) / n, my = y.reduce((s, v) => s + v, 0) / n;
  const sxx = x.reduce((s, v) => s + (v - mx) ** 2, 0);
  muss(hinweise, sxx > 1e-12, 'versuche', 'Die Versuche brauchen unterschiedliche Schlagzahlen, sonst ist keine Ausgleichsgerade bestimmbar.');
  if (hatFehler(hinweise)) return leer();
  const sxy = x.reduce((s, v, i) => s + (v - mx) * (y[i] - my), 0);
  const b = sxy / sxx, a = my - b * mx;
  const syy = y.reduce((s, v) => s + (v - my) ** 2, 0);
  const r2 = n >= 3 ? (syy > 0 ? (sxy * sxy) / (sxx * syy) : 1) : NaN;
  const wL = a + b * Math.log10(25);
  if (n < 4) hinweise.push({ stufe: 'warnung', feld: 'versuche', text: `Nur ${n} Versuche: Für das Mehrpunktverfahren sind mindestens 4 Einzelversuche vorgesehen.` });
  if (b >= 0) hinweise.push({ stufe: 'warnung', feld: 'versuche', text: 'Der Wassergehalt nimmt mit der Schlagzahl nicht ab – Versuche oder Zuordnung prüfen.' });
  if (n >= 3 && r2 < 0.9) hinweise.push({ stufe: 'warnung', feld: 'versuche', text: `Bestimmtheitsmaß R² = ${formatDeZahl(r2, 2)}: Die Punkte streuen stark um die Ausgleichsgerade.` });
  const nMin = Math.min(...versuche.map(v => v.schlaege)), nMax = Math.max(...versuche.map(v => v.schlaege));
  if (nMin > 25 || nMax < 25) hinweise.push({ stufe: 'warnung', feld: 'versuche', text: 'N = 25 liegt außerhalb der gemessenen Schlagzahlen: w_L wird extrapoliert – Versuche auf beiden Seiten von 25 Schlägen anordnen.' });
  return { wL, a, b, r2, verfahren: 'mehrpunkt', hinweise };
}

/** Ausrollgrenze w_P als Mittelwert der Einzelversuche */
export function ausrollgrenze(werte: readonly number[]) {
  const hinweise: Hinweis[] = [];
  muss(hinweise, werte.length >= 1, 'wP', 'Mindestens ein Ausrollversuch ist erforderlich.');
  muss(hinweise, werte.every(v => Number.isFinite(v) && v > 0), 'wP', 'Die Wassergehalte der Ausrollversuche müssen größer als 0 % sein.');
  if (hatFehler(hinweise)) return { wP: NaN, spanne: NaN, hinweise };
  const wP = werte.reduce((s, v) => s + v, 0) / werte.length;
  const spanne = Math.max(...werte) - Math.min(...werte);
  if (werte.length < 2) hinweise.push({ stufe: 'warnung', feld: 'wP', text: 'Nur ein Ausrollversuch: w_P als Mittelwert aus mindestens zwei Versuchen bestimmen.' });
  if (spanne > 2) hinweise.push({ stufe: 'warnung', feld: 'wP', text: `Die Einzelwerte liegen ${formatDeZahl(spanne, 1)} Prozentpunkte auseinander (Lehrannahme: höchstens 2): Versuch wiederholen.` });
  return { wP, spanne, hinweise };
}

export interface BodengruppeErgebnis { kuerzel: string; text: string; aLinie: number; oberhalbALinie: boolean }

/** Bodengruppe feinkörniger Böden aus dem Plastizitätsdiagramm (DIN 18196) */
export function bodengruppePlastizitaet(wL: number, iP: number, organisch = false): BodengruppeErgebnis {
  const a = aLinie(wL);
  const oberhalb = iP >= a;
  const stufe = wL < 35 ? 'L' : wL <= 50 ? 'M' : 'A';
  const PLAST = { L: 'leicht plastisch', M: 'mittelplastisch', A: 'ausgeprägt plastisch' } as const;
  if (oberhalb && iP >= 7) {
    if (organisch && stufe === 'A') return { kuerzel: 'OT', text: 'OT (Ton mit organischen Beimengungen)', aLinie: a, oberhalbALinie: true };
    return { kuerzel: `T${stufe}`, text: `T${stufe} (Ton, ${PLAST[stufe]})`, aLinie: a, oberhalbALinie: true };
  }
  if (oberhalb && iP >= 4) return { kuerzel: 'UL/TL', text: 'UL/TL (Zwischenbereich, 4 ≤ I_P < 7)', aLinie: a, oberhalbALinie: true };
  if (organisch && stufe === 'M') return { kuerzel: 'OU', text: 'OU (Schluff mit organischen Beimengungen)', aLinie: a, oberhalbALinie: oberhalb };
  if (organisch && stufe === 'A') return { kuerzel: 'UA', text: 'UA mit organischen Beimengungen – w_L > 50 % unterhalb der A-Linie: kein Feld OU/OT, Zuordnung (OU/OH) nach DIN 18196 prüfen', aLinie: a, oberhalbALinie: oberhalb };
  return { kuerzel: `U${stufe}`, text: `U${stufe} (Schluff, ${PLAST[stufe]})`, aLinie: a, oberhalbALinie: oberhalb };
}

export interface AtterbergEingabe {
  /** natürlicher Wassergehalt w [%] */
  w: number;
  /** Fließgrenzenversuche (1 Versuch → Einpunktverfahren) */
  versuche: readonly FliessVersuch[];
  /** Wassergehalte der Ausrollversuche [%] */
  ausroll: readonly number[];
  /** organische Beimengungen (z. B. Glühverlust, Geruch, Farbe) festgestellt */
  organisch: boolean;
}

/** Gesamtauswertung: w_L, w_P, I_P, I_C, Zustandsform und Bodengruppe */
export function atterberg(e: AtterbergEingabe) {
  const fl = fliessgrenze(e.versuche);
  const ar = ausrollgrenze(e.ausroll);
  const hinweise: Hinweis[] = [...fl.hinweise, ...ar.hinweise];
  muss(hinweise, Number.isFinite(e.w) && e.w >= 0, 'w', 'Der natürliche Wassergehalt muss eine Zahl ≥ 0 % sein.');
  const leer = { wL: fl.wL, wP: ar.wP, iP: NaN, iC: NaN, zustand: '–', gruppe: undefined as BodengruppeErgebnis | undefined, fliess: fl, gueltig: false, hinweise };
  if (hatFehler(hinweise)) return leer;
  muss(hinweise, ar.wP < fl.wL, 'wP', `Die Ausrollgrenze w_P = ${formatDeZahl(ar.wP, 1)} % muss kleiner als die Fließgrenze w_L = ${formatDeZahl(fl.wL, 1)} % sein (I_P > 0).`);
  if (hatFehler(hinweise)) return leer;
  const z = zustandsgrenzen(e.w, fl.wL, ar.wP);
  const iP = fl.wL - ar.wP;
  const gruppe = bodengruppePlastizitaet(fl.wL, iP, e.organisch);
  hinweise.push(...z.hinweise);
  if (e.organisch) hinweise.push({ stufe: 'warnung', feld: 'organisch', text: 'Organische Beimengungen: Die Zuordnung zu OU/OT setzt eine Bestimmung des Glühverlusts voraus (DIN 18196).' });
  if (iP < 4) hinweise.push({ stufe: 'warnung', feld: 'iP', text: 'I_P < 4 %: Der Boden ist kaum plastisch – Ausrollgrenze schwer bestimmbar, Einordnung über die Korngrößenverteilung prüfen.' });
  return { wL: fl.wL, wP: ar.wP, iP, iC: z.iC, zustand: z.zustand, gruppe, fliess: fl, gueltig: true, hinweise };
}

export function mohrCoulomb(c: number, phiGrad: number, sigma1: number, sigma3: number) {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(c, phiGrad, sigma1, sigma3), 'eingabe', 'Alle Eingaben müssen Zahlen sein.');
  if (!hatFehler(hinweise)) {
    muss(hinweise, c >= 0, 'c', 'Die Kohäsion darf nicht negativ sein.');
    muss(hinweise, phiGrad >= 0 && phiGrad < 90, 'phi', 'Der Reibungswinkel muss zwischen 0° und 90° liegen.');
    muss(hinweise, sigma3 >= 0, 'sigma3', 'σ₃ darf nicht negativ sein (Zug wird nicht betrachtet).');
    muss(hinweise, sigma1 >= sigma3, 'sigma1', 'σ₁ ist die größte Hauptspannung und muss ≥ σ₃ sein.');
  }
  if (hatFehler(hinweise)) return { center: 0, radius: 0, isFailing: false, sigma1_f: NaN, ausnutzung: NaN, hinweise };
  bereich(hinweise, 'phi', phiGrad, 0, 50, 'Reibungswinkel über 50° sind für Böden unrealistisch.');
  const p = (phiGrad * Math.PI) / 180;
  const center = (sigma1 + sigma3) / 2;
  const radius = (sigma1 - sigma3) / 2;
  const grenzRadius = center * Math.sin(p) + c * Math.cos(p);
  const t = Math.tan(Math.PI / 4 + p / 2);
  return { center, radius, isFailing: radius > grenzRadius * (1 + 1e-9), sigma1_f: sigma3 * t * t + 2 * c * t, ausnutzung: grenzRadius > 0 ? radius / grenzRadius : Infinity, hinweise };
}

export function erddruckRankine(phiGrad: number, gamma: number, h: number) {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(phiGrad, gamma, h) && phiGrad >= 0 && phiGrad < 90 && gamma > 0 && h > 0, 'eingabe', 'φ muss zwischen 0° und 90° liegen, γ und h müssen größer als 0 sein.');
  if (hatFehler(hinweise)) return { k_a: NaN, k_p: NaN, k_0: NaN, E_a: NaN, E_p: NaN, E_0: NaN, hinweise };
  const p = (phiGrad * Math.PI) / 180;
  const k_a = Math.tan(Math.PI / 4 - p / 2) ** 2;
  const k_p = Math.tan(Math.PI / 4 + p / 2) ** 2;
  const k_0 = 1 - Math.sin(p); // Jáky, normalkonsolidiert
  const f = 0.5 * gamma * h * h;
  return { k_a, k_p, k_0, E_a: k_a * f, E_p: k_p * f, E_0: k_0 * f, hinweise };
}

/** Konsolidierungsgrad U(T_v) – Näherung nach Terzaghi/Casagrande (U ≤ 60 %: √(4T_v/π), darüber log-Näherung) */
export function konsolidierungsgrad(Tv: number): number {
  if (!(Tv > 0)) return 0;
  return Tv <= 0.283 ? Math.sqrt((4 * Tv) / Math.PI) : 1 - Math.pow(10, -(Tv + 0.085) / 0.933);
}

export function konsolidierung(hSchicht: number, deltaSigma: number, Es: number, cv: number, drainage: 'einseitig' | 'zweiseitig') {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(hSchicht, deltaSigma, Es, cv) && hSchicht > 0 && Es > 0 && cv > 0 && deltaSigma >= 0, 'eingabe', 'Schichtdicke, E_s und c_v müssen größer als 0 sein, Δσ ≥ 0.');
  if (hatFehler(hinweise)) return { s_end: NaN, t_50: NaN, t_90: NaN, kurve: [] as { x: number; y: number }[], hinweise };
  const s_end = (deltaSigma / (Es * 1000)) * hSchicht * 1000; // mm
  const d = drainage === 'zweiseitig' ? hSchicht / 2 : hSchicht;
  const t_50 = (0.197 * d * d) / cv, t_90 = (0.848 * d * d) / cv;
  const maxT = t_90 * 1.5;
  const kurve = Array.from({ length: 51 }, (_, i) => { const t = (maxT * i) / 50; return { x: t, y: s_end * konsolidierungsgrad((cv * t) / (d * d)) }; });
  return { s_end, t_50, t_90, kurve, hinweise };
}
