/**
 * Bemessung symmetrisch bewehrter Rechteckstützen für N + M (Theorie I. Ordnung)
 * nach DIN EN 1992-1-1 + NA (DE). Spannungsblock (λ = 0,8, η = 1,0), ε_c2 = 2 ‰, ε_cu2 = 3,5 ‰,
 * Betonstahl bilinear mit horizontalem Ast. Reiner Rechenkern – geprüft in tests/stuetze.test.ts.
 */
import { EC2_NA_DE } from '../data/normParams';
import { E_BETONSTAHL, fcdBeton, fcdHochfestHinweis } from '../data/kennwerte';
import { formatDeZahl } from '../utils/numberFormat';
import { type Hinweis, hatFehler, istEndlich, muss, bereich } from './plausibilitaet';

export interface StuetzeEingabe {
  b: number; h: number; d1: number; // [cm]
  l0: number;  // Ersatzlänge [m]
  nEd: number; // Druckkraft (Betrag) [kN]
  mEd: number; // Moment Theorie I. Ordnung [kNm]
  fck: number; fyk: number; // [MPa]
}

export interface Punkt { x: number; y: number }
export interface Kurve { omega: number; points: Punkt[]; nu_comp: number; isRequired?: boolean }

export interface StuetzeErgebnis {
  nu_Ed: number; mu_Ed: number; mEd_1: number; e0_mm: number; ei_mm: number;
  lambda: number; lambda_lim: number; isTheorie2Ordnung: boolean;
  req_omega: number; as_tot_req: number; as_min: number; as_max: number; as_final: number; isPossible: boolean;
  interactionCurves: Kurve[];
  hinweise: Hinweis[];
}

const ES = E_BETONSTAHL;

/** Interaktionskurve (µ, ν) für den bezogenen Gesamtbewehrungsgrad ω = A_s,tot·f_yd/(b·h·f_cd); Druck negativ. */
export function interaktionskurve(omega: number, b_m: number, h_m: number, d1_m: number, fcd: number, fyd: number): Kurve {
  const points: Punkt[] = [{ x: 0, y: omega }];
  const d = h_m - d1_m;
  const epsTop = (xi: number) => (xi <= 1.0 ? -3.5 : (-2.0 * xi) / (xi - 3 / 7));
  const As1 = 0.5 * omega * b_m * h_m * (fcd / fyd);
  for (let i = 0; i <= 100; i++) {
    const xi = 0.001 * Math.pow(100000, i / 100);
    const et = epsTop(xi);
    const es1 = et * ((xi - d / h_m) / xi);
    const es2 = et * ((xi - d1_m / h_m) / xi);
    const s1 = Math.max(-fyd, Math.min(fyd, (es1 / 1000) * ES));
    const s2 = Math.max(-fyd, Math.min(fyd, (es2 / 1000) * ES));
    const y = Math.min(0.8 * xi * h_m, h_m);
    const Fc = -y * b_m * fcd;
    const Mc = -Fc * (h_m / 2 - y / 2);
    const N = Fc + As1 * s1 + As1 * s2;
    const M = Mc + (As1 * s1 - As1 * s2) * (h_m / 2 - d1_m);
    points.push({ x: Math.abs(M / (b_m * h_m * h_m * fcd)), y: N / (b_m * h_m * fcd) });
  }
  const sig = Math.max(-fyd, Math.min(fyd, -2.0e-3 * ES));
  const nu_comp = (-b_m * h_m * fcd + omega * b_m * h_m * (fcd / fyd) * sig) / (b_m * h_m * fcd);
  points.push({ x: 0, y: nu_comp });
  return { omega, points, nu_comp };
}

/** Größtes aufnehmbares µ der Kurve bei gegebenem ν (lineare Interpolation), −1 wenn ν außerhalb */
export function muGrenze(k: Kurve, nu: number): number {
  if (nu > k.omega || nu < k.nu_comp) return -1;
  let mu = -1;
  for (let i = 0; i < k.points.length - 1; i++) {
    const p1 = k.points[i], p2 = k.points[i + 1];
    if ((nu <= p1.y && nu >= p2.y) || (nu >= p1.y && nu <= p2.y)) {
      mu = p1.y === p2.y ? Math.max(mu, p1.x, p2.x) : Math.max(mu, p2.x + ((nu - p2.y) / (p1.y - p2.y)) * (p1.x - p2.x));
    }
  }
  return mu;
}

export function pruefeStuetze(e: StuetzeEingabe): Hinweis[] {
  const h: Hinweis[] = [];
  muss(h, istEndlich(e.b, e.h, e.d1, e.l0, e.nEd, e.mEd, e.fck, e.fyk), 'eingabe', 'Alle Eingaben müssen Zahlen sein.');
  if (hatFehler(h)) return h;
  muss(h, e.b > 0 && e.h > 0, 'b', 'Breite und Höhe müssen größer als 0 sein.');
  muss(h, e.d1 > 0 && e.d1 < e.h / 2, 'd1', 'Der Randabstand d₁ muss zwischen 0 und h/2 liegen (symmetrische Bewehrung).');
  muss(h, e.l0 > 0, 'l0', 'Die Ersatzlänge l₀ muss größer als 0 sein.');
  muss(h, e.nEd >= 0, 'nEd', 'N_Ed ist hier der Betrag der Druckkraft und muss ≥ 0 sein. Zugglieder werden nicht abgedeckt.');
  muss(h, e.mEd >= 0, 'mEd', 'M_Ed ist als Betrag einzugeben (symmetrische Bewehrung).');
  muss(h, e.fck > 0 && e.fyk > 0, 'fck', 'Die Festigkeiten müssen größer als 0 sein.');
  if (hatFehler(h)) return h;
  bereich(h, 'fck', e.fck, 12, 50, 'Spannungsblock und ε_c2/ε_cu2 sind hier nur bis C50/60 hinterlegt.');
  bereich(h, 'b', Math.min(e.b, e.h), 20, Infinity, 'Die Mindestabmessung von Ortbetonstützen beträgt nach NA DE 9.5.1 20 cm (liegend hergestellte Fertigteile 12 cm).');
  return h;
}

export function bemesseStuetze(e: StuetzeEingabe): StuetzeErgebnis {
  const hinweise = pruefeStuetze(e);
  const leer: StuetzeErgebnis = {
    nu_Ed: 0, mu_Ed: 0, mEd_1: 0, e0_mm: 0, ei_mm: 0, lambda: 0, lambda_lim: 0, isTheorie2Ordnung: false,
    req_omega: 0, as_tot_req: 0, as_min: 0, as_max: 0, as_final: 0, isPossible: false, interactionCurves: [], hinweise,
  };
  if (hatFehler(hinweise)) return leer;

  const b_m = e.b / 100, h_m = e.h / 100, d1_m = e.d1 / 100;
  // f_cd zentral (src/data/kennwerte.ts): α_cc·f_ck/γ_c, ab C55/67 · (1,1 − f_ck/500) (vorläufig, F-Freigabe)
  const fcd = fcdBeton(e.fck);
  const hfHinweis = fcdHochfestHinweis(e.fck);
  if (hfHinweis) hinweise.push({ stufe: 'warnung', feld: 'fck', text: hfHinweis });
  const fyd = e.fyk / EC2_NA_DE.gammaS;
  const e0_m = EC2_NA_DE.e0Min_mm(e.h * 10) / 1000; // 6.1(4): e0 = max(h/30; 20 mm)
  const ei_m = e.l0 / 400;                         // 5.2(9): e_i = l0/400 (Einzelbauteil)
  // M_Ed = max(M_0Ed + N·e_i ; N·e_0): Imperfektion und Mindestausmitte werden nicht addiert (5.2(7), 6.1(4))
  const mEd_1 = Math.max(e.mEd + e.nEd * ei_m, e.nEd * e0_m);
  const lambda = e.l0 / (h_m / Math.sqrt(12));
  const nu_Ed = -e.nEd / 1000 / (b_m * h_m * fcd);
  const mu_Ed = mEd_1 / 1000 / (b_m * h_m * h_m * fcd);
  const n = Math.abs(nu_Ed);
  const lambda_lim = n >= 0.41 ? 25 : n > 0 ? 16 / Math.sqrt(n) : Infinity; // NA DE 5.8.3.1
  const isTheorie2Ordnung = lambda > lambda_lim;
  if (isTheorie2Ordnung) {
    hinweise.push({ stufe: 'warnung', feld: 'theorie2', text: `λ = ${formatDeZahl(lambda, 1)} > λ_lim = ${formatDeZahl(lambda_lim, 1)}: Das Ergebnis nach Theorie I. Ordnung liegt auf der unsicheren Seite.` });
  }

  const omegaValues = [0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.5, 2.0];
  const interactionCurves: Kurve[] = omegaValues.map(o => interaktionskurve(o, b_m, h_m, d1_m, fcd, fyd));

  let req_omega = 0, isPossible = false;
  for (let i = 0; i <= 250; i++) {
    const o = i / 100;
    if (mu_Ed <= muGrenze(interaktionskurve(o, b_m, h_m, d1_m, fcd, fyd), nu_Ed) + 0.002) { req_omega = o; isPossible = true; break; }
  }
  if (isPossible && !omegaValues.includes(req_omega)) {
    interactionCurves.push({ ...interaktionskurve(req_omega, b_m, h_m, d1_m, fcd, fyd), isRequired: true });
    interactionCurves.sort((a, c) => a.omega - c.omega);
  }

  const as_tot_req = req_omega * b_m * h_m * (fcd / fyd) * 10000;
  const as_min = EC2_NA_DE.AsMinStuetze(e.nEd * 1000, fyd) / 100; // NA DE 9.5.2(2): 0,15·|N_Ed|/f_yd
  const as_max = 0.09 * e.b * e.h;                              // NA DE 9.5.2(3): 0,09·A_c auch im Stoßbereich
  const as_final = isPossible ? Math.max(as_tot_req, as_min) : 0;
  if (!isPossible) {
    hinweise.push({ stufe: 'fehler', feld: 'nEd', text: 'Auch mit ω = 2,5 ist die Einwirkung nicht aufnehmbar. Querschnitt oder Betonfestigkeit erhöhen.' });
  } else if (as_final > as_max) {
    hinweise.push({ stufe: 'warnung', feld: 'nEd', text: `A_s,tot = ${formatDeZahl(as_final, 1)} cm² überschreitet A_s,max = 0,09·A_c = ${formatDeZahl(as_max, 1)} cm² (NA DE 9.5.2(3)).` });
  }
  return {
    nu_Ed, mu_Ed, mEd_1, e0_mm: e0_m * 1000, ei_mm: ei_m * 1000, lambda, lambda_lim, isTheorie2Ordnung,
    req_omega, as_tot_req, as_min, as_max, as_final, isPossible, interactionCurves, hinweise,
  };
}
