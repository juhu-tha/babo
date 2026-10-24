/**
 * Luftschalldämmung einschaliger, biegesteifer massiver Bauteile nach DIN 4109-32:2016-07, Gl. (2):
 * R_w = 30,9·lg(m'/m'₀) − 22,2 dB mit m'₀ = 1 kg/m², gültig für 65 ≤ m' ≤ 720 kg/m².
 * Reiner Rechenkern – geprüft in tests/schall.test.ts.
 */
import { type Hinweis, istEndlich } from './plausibilitaet';

export interface MasseSchicht { name?: string; d: number; density: number } // d [m], ρ [kg/m³]

export const rwMassiv = (mStrich: number) => 30.9 * Math.log10(mStrich) - 22.2;

export function schalldaemmung(schichten: readonly MasseSchicht[]) {
  const hinweise: Hinweis[] = [];
  if (!schichten.length) hinweise.push({ stufe: 'fehler', feld: 'schichten', text: 'Mindestens eine Schicht ist erforderlich.' });
  schichten.forEach((s, i) => {
    const n = s.name ?? `Schicht ${i + 1}`;
    if (!istEndlich(s.d, s.density) || s.d <= 0 || s.density <= 0) hinweise.push({ stufe: 'fehler', feld: `schicht${i}`, text: `${n}: Dicke und Rohdichte müssen größer als 0 sein.` });
  });
  if (hinweise.some(x => x.stufe === 'fehler')) return { mStrich: NaN, Rw: NaN, gueltig: false, hinweise };
  const mStrich = schichten.reduce((a, s) => a + s.d * s.density, 0);
  const Rw = rwMassiv(mStrich);
  if (mStrich < 65 || mStrich > 720) hinweise.push({ stufe: 'warnung', feld: 'm', text: `m' = ${Math.round(mStrich)} kg/m² liegt außerhalb des Gültigkeitsbereichs 65–720 kg/m² der Gleichung (DIN 4109-32).` });
  const weich = schichten.filter(s => s.density < 300 && s.d >= 0.02);
  if (weich.length) hinweise.push({ stufe: 'warnung', feld: 'aufbau', text: 'Der Aufbau enthält leichte Dämm- oder Holzschichten: Die Massekurve gilt nur für einschalige, biegesteife Bauteile. Vorsatzschalen, WDVS und Holzbau verändern R_w (Resonanz, Korrekturwerte ΔR_w nach DIN 4109-34) – Ergebnis nur als Orientierung.' });
  return { mStrich, Rw, gueltig: true, hinweise };
}
