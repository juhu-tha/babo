/**
 * Rechenkern Asphalt & Bitumen (AP 4.2), übernommen aus src/modules/Asphalt.tsx. Lehr- und Vorbemessungswerkzeug:
 *  - Rohdichte (hohlraumfrei) ρ_m = 100/((100 − B)/ρ_G + B/ρ_B) [g/cm³], Bezug 100 g Mischgut (vgl. DIN EN 12697-5)
 *  - Raumdichte ρ_b = ρ_m·(1 − V_m/100) [g/cm³] (Umkehrung von V_m = (ρ_m − ρ_b)/ρ_m·100, DIN EN 12697-8);
 *    die Gegenrichtung (V_m aus ρ_b) steht in src/calc/verkehrswegebau.ts (asphaltHohlraum) und nutzt dieselbe Rohdichte
 *  - Marshall-Stabilität als schematische Lehrkurve S = max(2; 12 − 2·|B − 5,5|) [kN] (keine Prüfwerte)
 *  - Niedrigtemperaturasphalt: Lehrmodelle für Bindemittelviskosität, Aerosolkonzentration gegenüber dem AGW
 *    der TRGS 900 (1,5 mg/m³), Energiebedarf, CO₂-Bilanz und Verdichtungszeitfenster (Newton-Abkühlung)
 * Reiner Rechenkern – geprüft in tests/asphalt.test.ts.
 */
import { type Hinweis, istEndlich, hatFehler, muss, nurGueltig, type KeineKlasse } from './plausibilitaet';

export interface Ergebnis { gueltig: boolean; hinweise: Hinweis[] }
const abschluss = (h: Hinweis[]): Ergebnis => nurGueltig(({ gueltig: !hatFehler(h), hinweise: h }));

// ---------------------------------------------------------------- Rohdichte / Raumdichte
/** Hohlraumfreie Rohdichte in g/cm³ aus Massenanteilen (M.-%) und Dichten (g/cm³) von Gestein und Bitumen */
export const asphaltRohdichte = (gesteinAnteil: number, bitumenAnteil: number, rhoGestein: number, rhoBitumen: number) =>
  100 / ((gesteinAnteil / rhoGestein) + (bitumenAnteil / rhoBitumen));

export interface RaumdichteEingabe {
  /** Bitumengehalt B in M.-% (Gestein = 100 − B) */
  bitumen: number;
  /** Hohlraumgehalt V_m in Vol.-% */
  hohlraum: number;
  /** Dichten in g/cm³ */
  rhoGestein: number;
  rhoBitumen: number;
}
export interface RaumdichteErgebnis extends Ergebnis {
  /** Feststoffvolumen je 100 g in cm³ */
  feststoffVolumen: number;
  /** Rohdichte ρ_m (hohlraumfrei) und Raumdichte ρ_b in g/cm³ */
  rohdichte: number;
  raumdichte: number;
}
export function asphaltRaumdichte(e: RaumdichteEingabe): RaumdichteErgebnis {
  const h: Hinweis[] = [];
  muss(h, istEndlich(e.bitumen, e.hohlraum, e.rhoGestein, e.rhoBitumen) && e.rhoGestein > 0 && e.rhoBitumen > 0, 'eingabe', 'Dichten müssen größer als 0 sein.');
  muss(h, e.bitumen >= 0 && e.bitumen <= 100, 'bitumen', 'Der Bitumengehalt muss zwischen 0 und 100 M.-% liegen.');
  muss(h, e.hohlraum >= 0 && e.hohlraum < 100, 'hohlraum', 'Der Hohlraumgehalt muss zwischen 0 und unter 100 Vol.-% liegen.');
  const feststoffVolumen = (100 - e.bitumen) / e.rhoGestein + e.bitumen / e.rhoBitumen;
  const rohdichte = asphaltRohdichte(100 - e.bitumen, e.bitumen, e.rhoGestein, e.rhoBitumen);
  // V_ges = V_fest/(1 − V_m/100) → ρ_b = 100/V_ges = ρ_m·(1 − V_m/100)
  const raumdichte = 100 / (feststoffVolumen / (1 - e.hohlraum / 100));
  return nurGueltig({ feststoffVolumen, rohdichte, raumdichte, ...abschluss(h) });
}

// ---------------------------------------------------------------- Marshall (Lehrkurve)
/** Bitumengehalt der Lehrkurve mit der größten Stabilität in M.-% */
export const MARSHALL_OPTIMUM = 5.5;
/** Schematische Marshall-Stabilität in kN (Lehrmodell, keine Prüfwerte) */
export const marshallLehrmodell = (bitumen: number) => Math.max(2, 12 - Math.abs(bitumen - MARSHALL_OPTIMUM) * 2);

export interface MarshallPunkt { bitumen: number; stabilitaet: number; aktuell: boolean }
/** Lehrkurve von 2 bis 10 M.-% in Schritten von 0,5 M.-%; „aktuell“ markiert den Punkt nächst dem gewählten Gehalt */
export function marshallKurve(bitumen: number): MarshallPunkt[] {
  return Array.from({ length: 17 }, (_, i) => {
    const b = 2 + i * 0.5;
    return { bitumen: b, stabilitaet: marshallLehrmodell(b), aktuell: Math.abs(b - bitumen) < 0.25 };
  });
}

// ---------------------------------------------------------------- Niedrigtemperaturasphalt (Lehrmodell)
export type NtaVerfahren = 'standard' | 'organic' | 'zeolite' | 'foamed';

/** Lehrannahmen des NTA-Modells */
export const NTA = {
  /** Bezugstemperatur Heißasphalt in °C */
  tReferenz: 165,
  /** Viskosität bei 165 °C in Pa·s und Faktor je K Absenkung */
  viskositaet0: 0.4,
  viskositaetFaktorJeK: 1.06,
  /** Viskositätsminderung durch Zusatzmittel und Mindesttemperatur der Wirkung in °C */
  minderung: { standard: 1, organic: 0.38, zeolite: 0.52, foamed: 0.48 } as Readonly<Record<NtaVerfahren, number>>,
  wirkAb: { standard: Infinity, organic: 110, zeolite: 105, foamed: 105 } as Readonly<Record<NtaVerfahren, number>>,
  /** Bewertungsgrenzen der Viskosität in Pa·s */
  viskositaetErschwert: 1.8,
  viskositaetBlockiert: 4.5,
  /** Aerosol c = a·e^(b·T) in mg/m³ und Arbeitsplatzgrenzwert TRGS 900 in mg/m³ */
  aerosolA: 0.045,
  aerosolB: 0.029,
  agw: 1.5,
  /** Energiebedarf bei 165 °C in kWh/t, Änderung je K und Heizwert Heizöl in kWh/l */
  energie0: 88,
  energieJeK: 0.0102,
  heizwertKwhJeL: 10,
  /** CO₂-Äquivalente bei 165 °C in kg/t, Gutschrift je % Asphaltgranulat in kg/t, Untergrenze in kg/t */
  co20: 22.0,
  co2JeProzentRc: 0.13,
  co2Min: 3.5,
  /** Grenztemperatur der Verdichtung in °C, Lufttemperatur in °C, Abkühlkonstante (4 cm Schicht) in min */
  grenzTemperatur: { standard: 130, organic: 85, zeolite: 95, foamed: 90 } as Readonly<Record<NtaVerfahren, number>>,
  tLuft: 15,
  abkuehlMin: 38,
} as const;

export type NtaBewertung = 'optimal' | 'erschwert' | 'blockiert' | KeineKlasse;

export interface NtaEingabe {
  verfahren: NtaVerfahren;
  /** Mischguttemperatur in °C */
  temperatur: number;
  /** Anteil Asphaltgranulat in M.-% */
  rcAnteil: number;
}
export interface NtaErgebnis extends Ergebnis {
  /** Bindemittelviskosität in Pa·s und Bewertung der Verarbeitbarkeit */
  viskositaet: number;
  bewertung: NtaBewertung;
  /** Aerosolkonzentration in mg/m³, Anteil am AGW in % (gerundet), Minderung gegenüber 165 °C in % (gerundet) */
  aerosol: number;
  aerosolAnteilAgw: number;
  aerosolMinderung: number;
  /** Energiebedarf in kWh/t und Einsparung in % (gerundet, ≥ 0) */
  energie: number;
  energieEinsparung: number;
  /** eingespartes Heizöl in l/t und in l je 1 000 t */
  heizoelJeT: number;
  heizoelJe1000t: number;
  /** CO₂-Äquivalente in kg/t, Einsparung in % (gerundet, ≥ 0) und vermiedene kg je 1 000 t */
  co2: number;
  co2Einsparung: number;
  co2VermiedenJe1000t: number;
  /** Grenztemperatur in °C und Verdichtungszeitfenster in min (gerundet) */
  grenzTemperatur: number;
  verdichtungsfenster: number;
}
export function ntaModell(e: NtaEingabe): NtaErgebnis {
  const h: Hinweis[] = [];
  muss(h, istEndlich(e.temperatur, e.rcAnteil), 'eingabe', 'Temperatur und Recyclinganteil müssen Zahlen sein.');
  muss(h, e.rcAnteil >= 0 && e.rcAnteil <= 100, 'rcAnteil', 'Der Recyclinganteil muss zwischen 0 und 100 % liegen.');
  const T = e.temperatur;
  let viskositaet = NTA.viskositaet0 * Math.pow(NTA.viskositaetFaktorJeK, NTA.tReferenz - T);
  if (T >= NTA.wirkAb[e.verfahren]) viskositaet *= NTA.minderung[e.verfahren];
  const bewertung: NtaBewertung = viskositaet > NTA.viskositaetBlockiert ? 'blockiert' : viskositaet > NTA.viskositaetErschwert ? 'erschwert' : 'optimal';

  const aerosolBei = (t: number) => NTA.aerosolA * Math.exp(NTA.aerosolB * t);
  const aerosol = aerosolBei(T);
  const aerosolAnteilAgw = Math.round((aerosol / NTA.agw) * 100);
  const aerosolMinderung = T >= NTA.tReferenz ? 0 : Math.round((1 - aerosol / aerosolBei(NTA.tReferenz)) * 100);

  const energie = NTA.energie0 * (1 + (T - NTA.tReferenz) * NTA.energieJeK);
  const energieEinsparung = Math.max(0, Math.round(((NTA.energie0 - energie) / NTA.energie0) * 100));
  const heizoelJeT = Math.max(0, (NTA.energie0 - energie) / NTA.heizwertKwhJeL);

  const co2Energie = NTA.co20 * (energie / NTA.energie0);
  const co2 = Math.max(NTA.co2Min, co2Energie - e.rcAnteil * NTA.co2JeProzentRc);
  const co2Einsparung = Math.max(0, Math.round(((NTA.co20 - co2) / NTA.co20) * 100));

  const grenzTemperatur = NTA.grenzTemperatur[e.verfahren];
  const verdichtungsfenster = T > grenzTemperatur
    ? Math.round(NTA.abkuehlMin * Math.log((T - NTA.tLuft) / (grenzTemperatur - NTA.tLuft)))
    : 0;

  if (T < 100 || T > 180) h.push({ stufe: 'warnung', feld: 'temperatur', text: 'Das Lehrmodell ist für Mischguttemperaturen von 100 bis 180 °C angelegt.' });
  if (co2Energie - e.rcAnteil * NTA.co2JeProzentRc < NTA.co2Min) h.push({ stufe: 'warnung', feld: 'rcAnteil', text: 'Die CO₂-Bilanz erreicht die Modelluntergrenze von 3,5 kg/t.' });
  return nurGueltig({
    viskositaet, bewertung, aerosol, aerosolAnteilAgw, aerosolMinderung,
    energie, energieEinsparung, heizoelJeT, heizoelJe1000t: heizoelJeT * 1000,
    co2, co2Einsparung, co2VermiedenJe1000t: (NTA.co20 - co2) * 1000,
    grenzTemperatur, verdichtungsfenster, ...abschluss(h),
  }, ['bewertung']);
}
