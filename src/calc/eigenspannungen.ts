/**
 * Rechenkern Eigenspannungen in massigen Betonbauteilen (Lehrmodell), übernommen aus src/modules/Eigenspannungen.tsx
 * (Modulprüfung Tranche 16, 02.11.2026).
 *
 * Parabolische Temperaturverteilung T(x) = a·x² + b·x + c über die Dicke d (x = −d/2 innen … +d/2 außen) mit
 * T(−d/2) = T_innen, T(0) = T_mitte, T(+d/2) = T_aussen. Zerlegung in den konstanten Anteil T_N (Mittelwert),
 * den linearen Anteil T_M = b·x und den nichtlinearen Rest T_V = T − T_N − T_M (Eigenspannungen, N = 0, M = 0).
 * Schwinden parabolisch: ε_frei(x) = −ε_cs·(2x/d)² (Rand ε_cs, Kern 0), Mittelwert −ε_cs/3.
 *   σ_V(x) = −E·α_T·T_V(x) + E·(ε̄ − ε_frei(x))
 * Zum Vergleich bei voller Behinderung (Bezugstemperatur 20 °C): σ_N = −E·α_T·(T_N − 20) − E·ε̄, σ_M = −E·α_T·T_M.
 *
 * Einheiten: Temperaturen in °C, d in m, E und Spannungen in N/mm² (Zug positiv), ε_cs in ‰.
 * Reiner Rechenkern – geprüft in tests/tranche16.test.ts.
 */
import { type Hinweis, istEndlich, istAnzahl, hatFehler, muss, nurGueltig, MAX_STUETZSTELLEN } from './plausibilitaet';
import { ALPHA_T_BETON } from './zwang';

/** spannungsfreie Bezugstemperatur der Zwangsanteile σ_N, σ_M (Herstelltemperatur, Lehrannahme) */
export const BEZUGSTEMPERATUR = 20;

export interface EigenspannungEingabe {
  tInnen: number; tMitte: number; tAussen: number;
  /** wirksamer E-Modul E_c,eff in N/mm² */
  eModul: number;
  /** Bauteildicke d in m */
  dicke: number;
  /** Schwinddehnung am Rand ε_cs in ‰ (Verkürzung positiv) */
  epsCsPromille: number;
  /** Anzahl Abschnitte über die Dicke (Diagramm) */
  punkte?: number;
}

export interface EigenspannungPunkt {
  /** Lage x in m (−d/2 … +d/2) */
  x: number;
  tV: number;
  sigmaV: number; sigmaN: number; sigmaM: number; sigmaGesamt: number;
}

export interface EigenspannungErgebnis {
  tMittel: number;
  /** Parabelanteil ΔT_par = T_mitte − (T_innen + T_aussen)/2 in K */
  deltaTPar: number;
  punkte: EigenspannungPunkt[];
  /** größte Zugeigenspannung (≥ 0) und kleinste (Druck, ≤ 0) in N/mm² */
  maxZug: number; maxDruck: number;
  /** Lage der größten Zugeigenspannung: an einem Rand oder im Kern */
  zugLage: 'rand' | 'kern' | 'keine';
  gueltig: boolean;
  hinweise: Hinweis[];
}

export function eigenspannungsVerlauf(e: EigenspannungEingabe): EigenspannungErgebnis {
  const hinweise: Hinweis[] = [];
  const { tInnen, tMitte, tAussen, eModul, dicke, epsCsPromille } = e;
  const n = e.punkte ?? 50;
  muss(hinweise, istEndlich(tInnen, tMitte, tAussen, eModul, dicke, epsCsPromille, n), 'eingabe', 'Alle Eingaben müssen endliche Zahlen sein.');
  muss(hinweise, dicke > 0, 'dicke', 'Die Bauteildicke muss größer als 0 sein.');
  muss(hinweise, eModul > 0, 'eModul', 'Der E-Modul muss größer als 0 sein.');
  muss(hinweise, n >= 2, 'punkte', 'Mindestens zwei Abschnitte über die Dicke.');
  // Grenzfallprüfung 02.11.2026: Abbruch vor der Schleife (vorher lief sie trotz Fehler; bei punkte = ∞ Endlosschleife)
  muss(hinweise, istAnzahl(n, 2), 'punkte', `Die Anzahl der Abschnitte muss eine ganze Zahl von 2 bis ${MAX_STUETZSTELLEN} sein.`);
  if (hatFehler(hinweise)) return nurGueltig({ tMittel: NaN, deltaTPar: NaN, punkte: [], maxZug: NaN, maxDruck: NaN, zugLage: 'keine', gueltig: false, hinweise });

  const d = dicke;
  const c = tMitte;
  const b = (tAussen - tInnen) / d;
  const a = (4 / (d * d)) * ((tAussen + tInnen) / 2 - tMitte);
  const tMittel = (a / 12) * d * d + c;
  const epsRand = epsCsPromille * 1e-3;
  const epsMittel = -epsRand / 3; // Mittelwert von −ε_cs·ξ² über ξ = −1 … 1

  const punkte: EigenspannungPunkt[] = [];
  let maxZug = 0, maxDruck = 0, xMaxZug = 0;
  for (let i = 0; i <= n; i++) {
    const xi = (i / n) * 2 - 1;
    const x = (xi * d) / 2;
    const tX = a * x * x + b * x + c;
    const tM = b * x;
    const tV = tX - tMittel - tM;
    const epsFrei = -epsRand * xi * xi;
    const sigmaV = -eModul * ALPHA_T_BETON * tV + eModul * (epsMittel - epsFrei);
    const sigmaN = -eModul * ALPHA_T_BETON * (tMittel - BEZUGSTEMPERATUR) - eModul * epsMittel;
    const sigmaM = -eModul * ALPHA_T_BETON * tM;
    const sigmaGesamt = -eModul * ALPHA_T_BETON * (tX - BEZUGSTEMPERATUR) - eModul * epsFrei;
    punkte.push({ x, tV, sigmaV, sigmaN, sigmaM, sigmaGesamt });
    if (sigmaV > maxZug) { maxZug = sigmaV; xMaxZug = xi; }
    if (sigmaV < maxDruck) maxDruck = sigmaV;
  }
  // Rand: äußeres Viertel der halben Dicke; die Parabel hat ihre Extremwerte am Rand oder in der Mitte
  const zugLage = maxZug <= 0 ? 'keine' : Math.abs(xMaxZug) >= 0.5 ? 'rand' : 'kern';
  if (zugLage === 'kern') hinweise.push({ stufe: 'warnung', feld: 'tMitte', text: 'Der Kern ist kühler als die Ränder (Abkühlphase): Die Zugeigenspannungen liegen im Kern, nicht an der Oberfläche.' });

  return nurGueltig({ tMittel, deltaTPar: tMitte - (tInnen + tAussen) / 2, punkte, maxZug, maxDruck, zugLage, gueltig: !hatFehler(hinweise), hinweise });
}
