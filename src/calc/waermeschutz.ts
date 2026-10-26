/**
 * Wärmeschutz: U-Wert nach DIN EN ISO 6946, Temperaturverlauf, Sättigungsdampfdruck nach DIN 4108-3 (Magnus).
 * Reiner Rechenkern – geprüft in tests/waermeschutz.test.ts. Das Glaser-Verfahren liegt in src/calc/glaser.ts
 * (AP 4.9, einzige Implementierung der Plattform) und nutzt psat() von hier.
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

// ---------------------------------------------------------------------------------------------------------------
// Thermische Stoffkennwerte und erforderliche Dämmdicke (AP 4.2, Runde 3 – Modul Waermeeigenschaften)
// ---------------------------------------------------------------------------------------------------------------

/** Wärmeeindringkoeffizient der Haut [J/(m²K√s)] und Hauttemperatur [°C] für die Kontakttemperatur (Lehrwerte) */
export const HAUT = { b: 1100, theta: 33 } as const;

/** Volumenbezogene Wärmespeicherfähigkeit ρ·c [J/(m³K)] */
export function waermespeicherVolumen(rho: number, c: number): number {
  return rho * c;
}

/** Temperaturleitfähigkeit a = λ/(ρ·c) [m²/s] */
export function temperaturleitfaehigkeit(lambda: number, rho: number, c: number): number {
  return lambda / (rho * c);
}

/** Wärmeeindringkoeffizient b = √(λ·ρ·c) [J/(m²K√s)] */
export function waermeeindringkoeffizient(lambda: number, rho: number, c: number): number {
  return Math.sqrt(lambda * rho * c);
}

/** Kontakttemperatur zweier halbunendlicher Körper: θ_K = (b₁θ₁ + b₂θ₂)/(b₁ + b₂) */
export function kontakttemperatur(b1: number, theta1: number, b2: number, theta2: number): number {
  return (b1 * theta1 + b2 * theta2) / (b1 + b2);
}

/** Thermische Kennwerte eines Stoffs; Kontakttemperatur der Haut (33 °C) auf dem Stoff mit θ_Stoff (Standard 20 °C) */
export function thermischeKennwerte(lambda: number, rho: number, c: number, thetaStoff = 20) {
  const hinweise: Hinweis[] = [];
  if (!istEndlich(lambda, rho, c, thetaStoff)) hinweise.push({ stufe: 'fehler', feld: 'eingabe', text: 'λ, ρ und c müssen Zahlen sein.' });
  else if (!(lambda > 0 && rho > 0 && c > 0)) hinweise.push({ stufe: 'fehler', feld: 'lambda', text: 'λ, ρ und c müssen größer als 0 sein.' });
  if (hinweise.length) return { C: 0, C_MJ: 0, a: 0, a_mm2s: 0, b: 0, thetaKontakt: 0, hinweise };
  const C = waermespeicherVolumen(rho, c);
  const a = temperaturleitfaehigkeit(lambda, rho, c);
  const b = waermeeindringkoeffizient(lambda, rho, c);
  return { C, C_MJ: C / 1e6, a, a_mm2s: a * 1e6, b, thetaKontakt: kontakttemperatur(HAUT.b, HAUT.theta, b, thetaStoff), hinweise };
}

/**
 * Erforderliche Dämmdicke [cm] je Dämmstoff, damit eine Bestandswand (eine Schicht d, λ) den Ziel-U-Wert erreicht:
 * R_D,erf = 1/U_Ziel − (R_si + R_se) − d/λ; d_D = R_D,erf · λ_D. R_si + R_se für Außenwände nach DIN EN ISO 6946.
 */
export function erforderlicheDaemmdicke(uZiel: number, dBestandM: number, lambdaBestand: number, lambdaDaemm: readonly number[]) {
  const hinweise: Hinweis[] = [];
  const { Rsi, Rse } = uebergang('wall');
  if (!istEndlich(uZiel, dBestandM, lambdaBestand, ...lambdaDaemm)) hinweise.push({ stufe: 'fehler', feld: 'eingabe', text: 'Alle Eingaben müssen Zahlen sein.' });
  else {
    if (!(uZiel > 0)) hinweise.push({ stufe: 'fehler', feld: 'uZiel', text: 'Der Ziel-U-Wert muss größer als 0 sein.' });
    if (!(dBestandM >= 0 && lambdaBestand > 0)) hinweise.push({ stufe: 'fehler', feld: 'lambdaBestand', text: 'Dicke ≥ 0 und λ > 0 der Bestandswand erforderlich.' });
    if (lambdaDaemm.some(l => !(l > 0))) hinweise.push({ stufe: 'fehler', feld: 'lambdaDaemm', text: 'Die Wärmeleitfähigkeit der Dämmstoffe muss größer als 0 sein.' });
  }
  if (hinweise.length) return { RsiRse: Rsi + Rse, rBestand: 0, rGesamtErf: 0, rDaemmErf: 0, erreicht: false, dickenCm: lambdaDaemm.map(() => 0), hinweise };
  const rBestand = dBestandM / lambdaBestand;
  const rGesamtErf = 1 / uZiel;
  const rDaemmErf = rGesamtErf - (Rsi + Rse) - rBestand;
  const erreicht = rDaemmErf <= 0;
  return { RsiRse: Rsi + Rse, rBestand, rGesamtErf, rDaemmErf, erreicht, dickenCm: lambdaDaemm.map(l => (erreicht ? 0 : rDaemmErf * l * 100)), hinweise };
}

