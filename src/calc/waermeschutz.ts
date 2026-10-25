/**
 * Wärmeschutz: U-Wert nach DIN EN ISO 6946, Temperaturverlauf, Sättigungsdampfdruck nach DIN 4108-3 (Magnus).
 * Reiner Rechenkern – geprüft in tests/waermeschutz.test.ts. Enthält das (einzige) Glaser-Verfahren der Plattform
 * (glaser(), genutzt im Modul Feuchteschutz; AP 3.9 „Eine Quelle je Thema“).
 */
import { type Hinweis, istEndlich } from './plausibilitaet';

export interface Schicht { name?: string; d: number; lambda: number; mu?: number }
export type Bauteil = 'wall' | 'pitched_roof' | 'flat_roof' | 'basement';

/** Wärmeübergangswiderstände [m²K/W] nach DIN EN ISO 6946, Tab. 7; Kellerdecke: unbeheizter Raum → R_si auf beiden Seiten */
export function uebergang(bauteil: Bauteil): { Rsi: number; Rse: number } {
  if (bauteil === 'wall') return { Rsi: 0.13, Rse: 0.04 };
  if (bauteil === 'basement') return { Rsi: 0.17, Rse: 0.17 };
  return { Rsi: 0.10, Rse: 0.04 };
}

/** Höchstwerte U bei Änderung bestehender Wohngebäude nach GEG, Anlage 7 [W/(m²K)] */
export const GEG_U_MAX: Readonly<Record<Bauteil, number>> = { wall: 0.24, pitched_roof: 0.24, flat_roof: 0.20, basement: 0.30 };

/** Sättigungsdampfdruck [Pa] nach DIN 4108-3 (über Wasser für θ ≥ 0 °C, über Eis darunter) */
export function psat(theta: number): number {
  return theta < 0 ? 610.5 * Math.exp((21.875 * theta) / (265.5 + theta)) : 610.5 * Math.exp((17.269 * theta) / (237.3 + theta));
}

export function pruefeSchichten(schichten: readonly Schicht[]): Hinweis[] {
  const h: Hinweis[] = [];
  if (!schichten.length) h.push({ stufe: 'fehler', feld: 'schichten', text: 'Mindestens eine Schicht ist erforderlich.' });
  schichten.forEach((s, i) => {
    const n = s.name ?? `Schicht ${i + 1}`;
    if (!istEndlich(s.d, s.lambda)) h.push({ stufe: 'fehler', feld: `schicht${i}`, text: `${n}: Dicke und λ müssen Zahlen sein.` });
    else {
      if (s.d <= 0) h.push({ stufe: 'fehler', feld: `schicht${i}`, text: `${n}: Die Dicke muss größer als 0 sein.` });
      if (s.lambda <= 0) h.push({ stufe: 'fehler', feld: `schicht${i}`, text: `${n}: Die Wärmeleitfähigkeit λ muss größer als 0 sein.` });
      else if (s.lambda < 0.015 || s.lambda > 400) h.push({ stufe: 'warnung', feld: `schicht${i}`, text: `${n}: λ = ${s.lambda} W/(mK) liegt außerhalb des Bereichs üblicher Baustoffe (0,015–400).` });
      if (s.d > 2) h.push({ stufe: 'warnung', feld: `schicht${i}`, text: `${n}: Dicke über 2 m – Einheit (m) prüfen.` });
    }
    if (s.mu !== undefined && (!Number.isFinite(s.mu) || s.mu < 1)) h.push({ stufe: 'fehler', feld: `schicht${i}`, text: `${n}: Die Wasserdampf-Diffusionswiderstandszahl μ muss ≥ 1 sein.` });
  });
  return h;
}

export function uWert(schichten: readonly Schicht[], Rsi: number, Rse: number) {
  const hinweise = pruefeSchichten(schichten);
  if (hinweise.some(x => x.stufe === 'fehler')) return { R_T: NaN, U: NaN, gueltig: false, hinweise };
  const R_T = Rsi + Rse + schichten.reduce((a, s) => a + s.d / s.lambda, 0);
  return { R_T, U: 1 / R_T, gueltig: true, hinweise };
}

/** Temperaturen an Oberflächen und Schichtgrenzen (innen → außen) */
export function temperaturverlauf(schichten: readonly Schicht[], Rsi: number, Rse: number, thetaI: number, thetaE: number): number[] {
  const { U } = uWert(schichten, Rsi, Rse);
  const q = U * (thetaI - thetaE);
  const t = [thetaI - q * Rsi];
  for (const s of schichten) t.push(t[t.length - 1] - q * (s.d / s.lambda));
  return t;
}

/** Umkehrung von psat: Temperatur [°C], bei der der Dampfdruck p [Pa] Sättigung erreicht (Taupunkt) */
export function temperaturBeiPsat(p: number): number {
  if (!(p > 0)) return NaN;
  const [a, b] = p < 610.5 ? [21.875, 265.5] : [17.269, 237.3];
  const l = Math.log(p / 610.5);
  return (b * l) / (a - l);
}

/** Taupunkttemperatur [°C] der Luft mit θ [°C] und relativer Feuchte φ [%] */
export function taupunkt(theta: number, phi: number): number {
  return temperaturBeiPsat(psat(theta) * (phi / 100));
}

export interface GlaserSchicht extends Schicht { mu: number }
export interface GlaserKlima {
  thetaI: number; phiI: number; thetaE: number; phiE: number;
  Rsi: number; Rse: number;
  /** Dauer der Tauperiode [d], DIN 4108-3 klassisch 90 d */
  tauperiodeTage?: number;
}

/** Wasserdampf-Diffusionsleitkoeffizient ruhender Luft δ_0 = 2,0 · 10⁻¹⁰ kg/(m·s·Pa) = 7,2 · 10⁻⁷ kg/(m·h·Pa) */
export const DELTA_0_KG_MHPA = 7.2e-7;

/**
 * Glaser-Verfahren (Periodenbilanz, vereinfacht) für einen Schichtaufbau innen → außen.
 * Tauperiode mit dem gewählten Klima; Verdunstungsperiode vereinfacht mit 12 °C / 70 % r. F. innen und außen
 * und gesättigter Tauwasserebene bei 12 °C über 90 d (klassisches Glaser-Klima; die Randbedingungen der
 * DIN 4108-3:2024-03 weichen ab). Eine Tauwasserebene (maßgebende Grenzfläche mit größter Übersättigung).
 * Massen in g/m², Ströme in g/(m²·h).
 */
export function glaser(schichten: readonly GlaserSchicht[], k: GlaserKlima) {
  const uErg = uWert(schichten, k.Rsi, k.Rse);
  const U = uErg.U;
  const tauStunden = (k.tauperiodeTage ?? 90) * 24;
  const T = [k.thetaI - U * (k.thetaI - k.thetaE) * k.Rsi];
  for (const s of schichten) T.push(T[T.length - 1] - U * (k.thetaI - k.thetaE) * (s.d / s.lambda));
  const ps = T.map(psat);
  const pi = psat(k.thetaI) * (k.phiI / 100);
  const pe = psat(k.thetaE) * (k.phiE / 100);
  const sd = [0];
  for (const s of schichten) sd.push(sd[sd.length - 1] + s.d * s.mu);
  const sdGes = sd[sd.length - 1];
  const pRoh = sd.map(x => (sdGes > 0 ? pi - (pi - pe) * (x / sdGes) : pe));

  let maxUeber = 0, ebene = -1;
  pRoh.forEach((p, i) => { if (p - ps[i] > maxUeber) { maxUeber = p - ps[i]; ebene = i; } });
  const tauwasser = maxUeber > 0.05 && ebene > 0 && ebene < pRoh.length - 1;

  let p = [...pRoh], gc = 0, gev = 0;
  if (tauwasser) {
    const sdC = sd[ebene], psC = ps[ebene];
    const sdA = sdGes - sdC;
    p = sd.map((x, i) => (i <= ebene ? pi - (pi - psC) * (sdC > 0 ? x / sdC : 0) : psC - (psC - pe) * (sdA > 0 ? (x - sdC) / sdA : 0)));
    const ein = (pi - psC) / (sdC > 0 ? sdC : 0.01);
    const aus = (psC - pe) / (sdA > 0 ? sdA : 0.01);
    gc = Math.max(0, DELTA_0_KG_MHPA * (ein - aus) * 1000);
    const pS = psat(12), pU = pS * 0.7;
    gev = DELTA_0_KG_MHPA * ((pS - pU) / (sdC > 0 ? sdC : 0.01) + (pS - pU) / (sdA > 0 ? sdA : 0.01)) * 1000;
  }
  const mc = gc * tauStunden;
  const mev = gev * 2160;
  return {
    U, R_T: uErg.R_T, hinweise: uErg.hinweise,
    T, psat: ps, p, sd, sdGes, pi, pe,
    tauwasser, ebene, gc, gev, mc, mev,
    /** Grundkriterien DIN 4108-3: m_c ≤ 1 000 g/m² und m_ev > m_c (Zusatzgrenzen 500 g/m² und Holzfeuchte separat prüfen) */
    bestanden: !tauwasser || (mev > mc && mc <= 1000),
  };
}
