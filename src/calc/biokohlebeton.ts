/**
 * Rechenkern Biokohlebeton – Pflanzenkohle im Beton (AP 6.2 a).
 *
 * CO₂-Bilanz je m³ Beton (Lehrmodell, nur Bindemittel- und Pflanzenkohleanteil):
 *   gespeichertes CO₂      C_PK  = m_PK · w_C · 44/12 · F_perm         [kg CO₂/m³]
 *   Herstellungsemission   E_PK  = m_PK · e_PK                          [kg CO₂e/m³]
 *   Zementeinsparung       E_Z   = Δz · GWP_Z                           [kg CO₂e/m³]
 *   Referenz (Zement)      GWP_ref = z_ref · GWP_Z
 *   Variante               GWP_neu = (z_ref − Δz) · GWP_Z + E_PK − C_PK
 *   Minderung              ΔGWP = GWP_ref − GWP_neu = E_Z + (C_PK − E_PK)
 * 44/12 ist das Verhältnis der molaren Massen von CO₂ (44 g/mol) und C (12 g/mol).
 * Zusätzlich: Dosierung bezogen auf den Zement, Vornässwasser aus der Wasseraufnahme der Kohle
 * und w/z-Wert bei unverändertem Wirkwasser.
 * Alle Standardwerte sind Richtwerte aus der öffentlichen Literatur, keine Produkt- oder Projektdaten.
 * Reiner Rechenkern – geprüft in tests/biokohlebeton.test.ts.
 */
import { type Hinweis, istEndlich, hatFehler } from './plausibilitaet';

/** Verhältnis der molaren Massen CO₂ / C */
export const CO2_JE_C = 44 / 12;

/**
 * Permanenzfaktoren F_perm (Anteil des Kohlenstoffs, der nach 100 Jahren noch gebunden ist) nach
 * IPCC 2019 Refinement, Vol. 4, Appendix 4 – abgeleitet für Böden; im Beton als Richtwert verwendet.
 */
export const F_PERM_IPCC = [
  { id: 'niedrig', label: 'Pyrolyse 350–450 °C', wert: 0.65 },
  { id: 'mittel', label: 'Pyrolyse 450–600 °C', wert: 0.80 },
  { id: 'hoch', label: 'Pyrolyse über 600 °C', wert: 0.89 },
] as const;

export interface BiokohleEingabe {
  /** Pflanzenkohle-Dosierung (Trockenmasse) in kg/m³ */
  mPK: number;
  /** Kohlenstoffgehalt der Pflanzenkohle in M.-% der Trockenmasse */
  cGehalt: number;
  /** Permanenzfaktor F_perm (0 bis 1) */
  fPerm: number;
  /** Emissionen aus Herstellung, Pyrolyse und Transport in kg CO₂e je kg Pflanzenkohle */
  ePK: number;
  /** Zementgehalt der Referenzmischung in kg/m³ */
  zRef: number;
  /** Zementreduktion gegenüber der Referenz in kg/m³ (0 = reine Zugabe) */
  deltaZ: number;
  /** Treibhauspotenzial des Zements in kg CO₂e/kg */
  gwpZ: number;
  /** Wirksamer Wassergehalt in kg/m³ (für den w/z-Wert) */
  w: number;
  /** Wasseraufnahme der Pflanzenkohle in M.-% (für das Vornässwasser) */
  wAufnahme: number;
}

export interface BiokohleErgebnis {
  /** im Kohlenstoff der Pflanzenkohle enthaltenes CO₂ ohne Permanenzabschlag in kg/m³ */
  co2Brutto: number;
  /** dauerhaft angerechnetes CO₂ C_PK in kg/m³ */
  co2Speicher: number;
  /** Herstellungsemission der Pflanzenkohle E_PK in kg CO₂e/m³ */
  ePK: number;
  /** Netto-Senke der Pflanzenkohle C_PK − E_PK in kg CO₂e/m³ */
  nettoPK: number;
  /** Einsparung aus der Zementreduktion E_Z in kg CO₂e/m³ */
  eZement: number;
  /** GWP des Zementanteils der Referenz in kg CO₂e/m³ */
  gwpRef: number;
  /** GWP der Variante (Zement + Pflanzenkohle) in kg CO₂e/m³ */
  gwpNeu: number;
  /** Minderung ΔGWP in kg CO₂e/m³ */
  minderung: number;
  /** Minderung bezogen auf die Referenz in % */
  minderungProzent: number;
  /** Zementgehalt der Variante in kg/m³ */
  zNeu: number;
  /** Dosierung bezogen auf den Zement der Variante in M.-% */
  dosierungZ: number;
  /** Vornässwasser in kg/m³ (wird nicht zum Wirkwasser gezählt) */
  wVornass: number;
  wzRef: number;
  wzNeu: number;
  gueltig: boolean;
  hinweise: Hinweis[];
}

export function biokohleBilanz(e: BiokohleEingabe): BiokohleErgebnis {
  const hinweise: Hinweis[] = [];
  const leer: BiokohleErgebnis = {
    co2Brutto: NaN, co2Speicher: NaN, ePK: NaN, nettoPK: NaN, eZement: NaN, gwpRef: NaN, gwpNeu: NaN,
    minderung: NaN, minderungProzent: NaN, zNeu: NaN, dosierungZ: NaN, wVornass: NaN, wzRef: NaN, wzNeu: NaN, gueltig: false, hinweise,
  };

  if (!istEndlich(e.mPK, e.cGehalt, e.fPerm, e.ePK, e.zRef, e.deltaZ, e.gwpZ, e.w, e.wAufnahme)) {
    hinweise.push({ stufe: 'fehler', text: 'Alle Eingaben müssen endliche Zahlen sein.' });
    return leer;
  }
  if (e.mPK < 0) hinweise.push({ stufe: 'fehler', feld: 'mPK', text: 'Die Dosierung der Pflanzenkohle darf nicht negativ sein.' });
  if (e.cGehalt < 0 || e.cGehalt > 100) hinweise.push({ stufe: 'fehler', feld: 'cGehalt', text: 'Der Kohlenstoffgehalt muss zwischen 0 und 100 M.-% liegen.' });
  if (e.fPerm < 0 || e.fPerm > 1) hinweise.push({ stufe: 'fehler', feld: 'fPerm', text: 'Der Permanenzfaktor muss zwischen 0 und 1 liegen.' });
  if (e.ePK < 0) hinweise.push({ stufe: 'fehler', feld: 'ePK', text: 'Die Herstellungsemission darf nicht negativ sein.' });
  if (e.zRef <= 0) hinweise.push({ stufe: 'fehler', feld: 'zRef', text: 'Der Zementgehalt der Referenz muss größer als 0 sein.' });
  if (e.deltaZ < 0) hinweise.push({ stufe: 'fehler', feld: 'deltaZ', text: 'Die Zementreduktion darf nicht negativ sein (Mehrzement als eigene Referenz rechnen).' });
  else if (e.deltaZ >= e.zRef) hinweise.push({ stufe: 'fehler', feld: 'deltaZ', text: 'Die Zementreduktion muss kleiner als der Zementgehalt der Referenz sein.' });
  if (e.gwpZ < 0) hinweise.push({ stufe: 'fehler', feld: 'gwpZ', text: 'Das Treibhauspotenzial des Zements darf nicht negativ sein.' });
  if (e.w <= 0) hinweise.push({ stufe: 'fehler', feld: 'w', text: 'Der wirksame Wassergehalt muss größer als 0 sein.' });
  if (e.wAufnahme < 0) hinweise.push({ stufe: 'fehler', feld: 'wAufnahme', text: 'Die Wasseraufnahme der Pflanzenkohle darf nicht negativ sein.' });
  if (hatFehler(hinweise)) return leer;

  const co2Brutto = e.mPK * e.cGehalt / 100 * CO2_JE_C;
  const co2Speicher = co2Brutto * e.fPerm;
  const ePK = e.mPK * e.ePK;
  const nettoPK = co2Speicher - ePK;
  const eZement = e.deltaZ * e.gwpZ;
  const zNeu = e.zRef - e.deltaZ;
  const gwpRef = e.zRef * e.gwpZ;
  const gwpNeu = zNeu * e.gwpZ + ePK - co2Speicher;
  const minderung = gwpRef - gwpNeu;
  const minderungProzent = gwpRef > 0 ? minderung / gwpRef * 100 : NaN;
  const dosierungZ = e.mPK / zNeu * 100;
  const wVornass = e.mPK * e.wAufnahme / 100;
  const wzRef = e.w / e.zRef;
  const wzNeu = e.w / zNeu;

  // Warnungen: Ergebnis rechnerisch gültig, aber außerhalb üblicher Bereiche
  if (e.mPK > 0 && e.cGehalt < 50) hinweise.push({ stufe: 'warnung', feld: 'cGehalt', text: 'Unter 50 M.-% Kohlenstoff gilt das Material nach den EBC-Richtlinien nicht mehr als Pflanzenkohle (Richtwert); die Speicherwirkung sinkt entsprechend.' });
  if (e.cGehalt > 95) hinweise.push({ stufe: 'warnung', feld: 'cGehalt', text: 'Kohlenstoffgehalte über 95 M.-% sind für Pflanzenkohle ungewöhnlich hoch – Analysewert prüfen.' });
  if (dosierungZ > 5) hinweise.push({ stufe: 'warnung', feld: 'mPK', text: 'Über etwa 5 M.-% Pflanzenkohle bezogen auf den Zement berichtet die Literatur häufig deutliche Festigkeitsverluste und höheren Wasseranspruch (Richtwert, eignungsprüfen).' });
  if (e.mPK > 0 && nettoPK < 0) hinweise.push({ stufe: 'warnung', feld: 'ePK', text: 'Die Herstellungsemission übersteigt das angerechnete CO₂: Die Pflanzenkohle wirkt in dieser Bilanz nicht als Senke.' });
  if (e.mPK > 0 && e.fPerm > 0.9) hinweise.push({ stufe: 'warnung', feld: 'fPerm', text: 'Permanenzfaktoren über 0,9 sind nicht durch die IPCC-Richtwerte gedeckt; eine höhere Beständigkeit im Beton ist bisher nicht allgemein belegt.' });
  if (e.gwpZ < 0.3 || e.gwpZ > 1.0) hinweise.push({ stufe: 'warnung', feld: 'gwpZ', text: 'Treibhauspotenziale von Zementen liegen üblicherweise etwa zwischen 0,3 und 1,0 kg CO₂e/kg (Richtwert, EPD verwenden).' });
  if (e.deltaZ > 0 && wzNeu > 0.6 + 1e-9) hinweise.push({ stufe: 'warnung', feld: 'deltaZ', text: 'Der w/z-Wert der Variante überschreitet 0,60 (Grenzwert z. B. für XC4 nach DIN 1045-2). Pflanzenkohle ist nicht als Zusatzstoff mit k-Wert anrechenbar.' });
  if (e.deltaZ > 0 && zNeu < 280) hinweise.push({ stufe: 'warnung', feld: 'deltaZ', text: 'Der Zementgehalt der Variante liegt unter 280 kg/m³ – Mindestzementgehalt der Expositionsklasse nach DIN 1045-2 prüfen.' });
  if (e.wAufnahme > 300) hinweise.push({ stufe: 'warnung', feld: 'wAufnahme', text: 'Wasseraufnahmen über 300 M.-% sind auch für sehr poröse Pflanzenkohle ungewöhnlich – Prüfwert kontrollieren.' });

  return { co2Brutto, co2Speicher, ePK, nettoPK, eZement, gwpRef, gwpNeu, minderung, minderungProzent, zNeu, dosierungZ, wVornass, wzRef, wzNeu, gueltig: true, hinweise };
}

/** CO₂ je kg Pflanzenkohle aus Kohlenstoffgehalt (M.-%) und Permanenzfaktor */
export const co2JeKgPK = (cGehalt: number, fPerm = 1) => cGehalt / 100 * CO2_JE_C * fPerm;

/**
 * Lehrwerte der Pflanzenkohle als gemeinsame Vorgabe (Modul Biokohlebeton; Erweiterte Nachprüfung 29.10.2026, NP2-MB-1):
 * 80 M.-% Kohlenstoff, F_perm = 0,80 (IPCC 2019, Pyrolyse 450–600 °C), Herstellung 0,3 kg CO₂e/kg.
 */
export const PK_LEHRWERT = { cGehalt: 80, fPerm: 0.8, ePK: 0.3 } as const;

/** Netto-Senke je kg Pflanzenkohle mit den Lehrwerten [kg CO₂e/kg] ≈ 2,05 – für Module ohne eigene Pflanzenkohle-Eingaben (Mischungsberechnung) */
export const PK_NETTO_SENKE_KG = co2JeKgPK(PK_LEHRWERT.cGehalt, PK_LEHRWERT.fPerm) - PK_LEHRWERT.ePK;
