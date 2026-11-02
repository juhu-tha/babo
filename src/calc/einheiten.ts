/**
 * Rechenkern Einheitenumrechnung (AP 4.2), übernommen aus src/modules/Einheiten.tsx.
 * Jede Einheit hat einen Faktor (und bei Temperaturen eine Nullpunktverschiebung) zur Basiseinheit ihrer Größenart:
 *   x_Basis = x·f_von + o_von,   x_Ziel = (x_Basis − o_nach)/f_nach
 * Angloamerikanische Einheiten über ihre exakten Definitionen (NIST SP 811, Anhang B):
 *   1 in = 0,0254 m, 1 ft = 0,3048 m, 1 lb = 0,453 592 37 kg, 1 lbf = 1 lb·g_n (g_n = 9,806 65 m/s²),
 *   1 psi = 1 lbf/in², 1 kcal (IT) = 4 186,8 J, T[K] = (T[°F] + 459,67)·5/9.
 * Reiner Rechenkern – geprüft in tests/einheiten.test.ts (inkl. Rundreise jeder Umrechnung).
 */
import { type Hinweis, hatFehler, muss, nurGueltig } from './plausibilitaet';

export type Groessenart = 'Länge' | 'Fläche' | 'Volumen' | 'Kraft' | 'Spannung/Druck' | 'Masse' | 'Dichte' | 'Moment' | 'Energie' | 'Temperatur';

export interface Einheit {
  /** Anzeigename und Schlüssel innerhalb der Größenart */
  name: string;
  /** Faktor zur Basiseinheit */
  faktor: number;
  /** additive Verschiebung zur Basiseinheit (nur Temperatur: Basis = Kelvin) */
  offset?: number;
}

/** Normfallbeschleunigung in m/s² und exakte Definitionen (NIST SP 811) */
export const G_N = 9.80665;
export const ZOLL = 0.0254;
export const FUSS = 0.3048;
export const PFUND = 0.45359237;
export const PFUND_KRAFT = PFUND * G_N;
export const PSI = PFUND_KRAFT / (ZOLL * ZOLL);
export const KCAL_IT = 4186.8;

/** Schlüssel für Liter; der Anzeigename steht in content/einheiten/Einheiten.json (werte.dmLiterL) */
export const LITER = 'dm³';

export const EINHEITEN: Readonly<Record<Groessenart, readonly Einheit[]>> = {
  'Länge': [
    { name: 'm', faktor: 1 },
    { name: 'mm', faktor: 0.001 },
    { name: 'cm', faktor: 0.01 },
    { name: 'km', faktor: 1000 },
    { name: 'in (Zoll)', faktor: ZOLL },
    { name: 'ft (Fuß)', faktor: FUSS },
  ],
  'Fläche': [
    { name: 'm²', faktor: 1 },
    { name: 'mm²', faktor: 0.000001 },
    { name: 'cm²', faktor: 0.0001 },
    { name: 'a (Ar)', faktor: 100 },
    { name: 'ha (Hektar)', faktor: 10000 },
    { name: 'km²', faktor: 1000000 },
  ],
  'Volumen': [
    { name: 'm³', faktor: 1 },
    { name: 'mm³', faktor: 0.000000001 },
    { name: 'cm³', faktor: 0.000001 },
    { name: LITER, faktor: 0.001 },
  ],
  'Kraft': [
    { name: 'N', faktor: 1 },
    { name: 'kN', faktor: 1000 },
    { name: 'MN', faktor: 1000000 },
    { name: 'lbf', faktor: PFUND_KRAFT },
  ],
  'Spannung/Druck': [
    { name: 'Pa (N/m²)', faktor: 1 },
    { name: 'kPa', faktor: 1000 },
    { name: 'MPa (N/mm²)', faktor: 1000000 },
    { name: 'bar', faktor: 100000 },
    { name: 'psi', faktor: PSI },
  ],
  'Masse': [
    { name: 'kg', faktor: 1 },
    { name: 'g', faktor: 0.001 },
    { name: 't', faktor: 1000 },
    { name: 'lb (Pfund)', faktor: PFUND },
  ],
  'Dichte': [
    { name: 'kg/m³', faktor: 1 },
    { name: 'g/cm³', faktor: 1000 },
    { name: 't/m³', faktor: 1000 },
    { name: 'kg/dm³', faktor: 1000 },
  ],
  'Moment': [
    { name: 'kNm', faktor: 1000 },
    { name: 'Nm', faktor: 1 },
    { name: 'Nmm', faktor: 0.001 },
    { name: 'kNcm', faktor: 10 },
    { name: 'MNm', faktor: 1000000 },
  ],
  'Energie': [
    { name: 'kWh', faktor: 3600000 },
    { name: 'J (Ws)', faktor: 1 },
    { name: 'kJ', faktor: 1000 },
    { name: 'MJ', faktor: 1000000 },
    { name: 'kcal', faktor: KCAL_IT },
  ],
  'Temperatur': [
    { name: '°C', faktor: 1, offset: 273.15 },
    { name: 'K', faktor: 1, offset: 0 },
    { name: '°F', faktor: 5 / 9, offset: 273.15 - 32 * 5 / 9 },
  ],
};

export const GROESSENARTEN = Object.keys(EINHEITEN) as Groessenart[];

/** Größenarten, bei denen negative Werte physikalisch nicht vorkommen (Hinweis, kein Fehler) */
const NICHT_NEGATIV: ReadonlySet<Groessenart> = new Set(['Länge', 'Fläche', 'Volumen', 'Masse', 'Dichte']);

export const einheitVon = (art: Groessenart, name: string): Einheit | undefined => EINHEITEN[art].find(u => u.name === name);

/** Reine Umrechnung ohne Prüfung; unbekannte Einheiten ergeben NaN */
export function umrechnen(wert: number, art: Groessenart, von: string, nach: string): number {
  const a = einheitVon(art, von), b = einheitVon(art, nach);
  if (!a || !b) return NaN;
  const basis = wert * a.faktor + (a.offset ?? 0);
  return (basis - (b.offset ?? 0)) / b.faktor;
}

export interface UmrechnungErgebnis {
  wert: number;
  /** Wert in der Basiseinheit der Größenart */
  basis: number;
  gueltig: boolean;
  hinweise: Hinweis[];
}
/** Umrechnung mit Plausibilitätsprüfung (Einheit vorhanden, endliche Zahl, T ≥ 0 K) */
export function umrechnung(wert: number, art: Groessenart, von: string, nach: string): UmrechnungErgebnis {
  const h: Hinweis[] = [];
  const a = einheitVon(art, von), b = einheitVon(art, nach);
  muss(h, !!a && !!b, 'einheit', 'Die Einheit gehört nicht zur gewählten Größenart.');
  muss(h, Number.isFinite(wert), 'wert', 'Bitte eine Zahl eingeben.');
  const basis = a ? wert * a.faktor + (a.offset ?? 0) : NaN;
  if (art === 'Temperatur' && basis < -1e-9) h.push({ stufe: 'fehler', feld: 'wert', text: 'Temperaturen unter dem absoluten Nullpunkt (0 K = −273,15 °C) gibt es nicht.' });
  if (NICHT_NEGATIV.has(art) && wert < 0) h.push({ stufe: 'warnung', feld: 'wert', text: `Negative Werte sind für die Größenart ${art} physikalisch nicht sinnvoll.` });
  return nurGueltig({ wert: umrechnen(wert, art, von, nach), basis, gueltig: !hatFehler(h), hinweise: h });
}
