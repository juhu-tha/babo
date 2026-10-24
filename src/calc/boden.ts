/**
 * Bodenmechanik: Zustandsgrenzen und Klassifikation (DIN EN ISO 17892-12, DIN 18196), Mohr-Coulomb,
 * Erddruck nach Rankine (glatte, lotrechte Wand, waagerechtes Gelände, kohäsionslos), eindimensionale Konsolidierung (Terzaghi).
 * Reiner Rechenkern – geprüft in tests/boden.test.ts.
 */
import { type Hinweis, istEndlich, muss, bereich, hatFehler } from './plausibilitaet';

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
  // Konsistenzbereiche nach DIN EN ISO 14688-2 / DIN 18122
  const zustand = iC < 0 ? 'flüssig' : iC < 0.5 ? 'breiig' : iC < 0.75 ? 'weich' : iC < 1.0 ? 'steif' : 'halbfest / fest';
  // Plastizitätsdiagramm DIN 18196: A-Linie I_P = 0,73·(w_L − 20); Zwischenbereich 4 ≤ I_P < 7 oberhalb der A-Linie
  const aLinie = 0.73 * (wL - 20);
  let klasse: string;
  if (iP >= aLinie && iP >= 7) klasse = wL < 35 ? 'TL (Ton, leicht plastisch)' : wL <= 50 ? 'TM (Ton, mittelplastisch)' : 'TA (Ton, ausgeprägt plastisch) bzw. OT bei organischen Beimengungen';
  else if (iP >= aLinie && iP >= 4) klasse = 'UL/TL (Zwischenbereich, 4 ≤ I_P < 7)';
  else klasse = wL < 35 ? 'UL (Schluff, leicht plastisch)' : wL <= 50 ? 'UM (Schluff, mittelplastisch) bzw. OU bei organischen Beimengungen' : 'UA (Schluff, ausgeprägt plastisch)';
  if (wL > 120) hinweise.push({ stufe: 'warnung', feld: 'wL', text: 'w_L > 120 % liegt außerhalb des üblichen Plastizitätsdiagramms.' });
  return { iP, iC, zustand, klasse, hinweise };
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
