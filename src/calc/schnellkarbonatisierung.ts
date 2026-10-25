/**
 * Rechenkern Schnellkarbonatisierung nach DIN EN 12390-12 (AP 6.2 b).
 *
 * 1. Karbonatisierungskoeffizient aus Messwerten (Wurzel-t-Gesetz):
 *      x_c = a + K_AC · √t      t in Tagen Lagerung bei erhöhter CO₂-Konzentration, x_c in mm
 *    K_AC (mm/√d) als Steigung der linearen Regression von x_c über √t.
 *    Variante „mit Achsenabschnitt“: a frei (berücksichtigt eine Anfangskarbonatisierung aus der Vorlagerung),
 *    Variante „durch den Ursprung“: a = 0.
 * 2. Umrechnung auf natürliche CO₂-Konzentration (Näherung aus dem 1. Fickschen Gesetz, K ∝ √c_CO₂):
 *      K_nat = K_AC · √(c_nat / c_acc) · √365      in mm/√a
 *    Feuchte, Temperatur, Beregnung und Nachbehandlung werden nicht erfasst – Größenordnung, kein Normwert.
 * 3. Prognose: x_c(t) = K_nat · √t (t in Jahren) und Zeitpunkt, zu dem die Front die Betondeckung c erreicht:
 *      t_c = (c / K_nat)²
 * Reiner Rechenkern – geprüft in tests/schnellkarbonatisierung.test.ts.
 */
import { type Hinweis, istEndlich, hatFehler } from './plausibilitaet';

export interface Messpunkt {
  /** Lagerungsdauer bei erhöhter CO₂-Konzentration in Tagen */
  tTage: number;
  /** mittlere Karbonatisierungstiefe in mm */
  xMm: number;
}

export interface Regression {
  /** Steigung K in mm/√d */
  k: number;
  /** Achsenabschnitt a in mm */
  a: number;
  /** Bestimmtheitsmaß R² */
  r2: number;
  n: number;
}

/**
 * Lineare Regression x = a + K·√t (mitAchsenabschnitt) bzw. x = K·√t.
 * R² bei Regression durch den Ursprung wie üblich auf den Mittelwert bezogen (kann dann < 0 werden).
 */
export function wurzelZeitRegression(punkte: readonly Messpunkt[], mitAchsenabschnitt: boolean): Regression {
  const n = punkte.length;
  const s = punkte.map(p => Math.sqrt(p.tTage));
  const x = punkte.map(p => p.xMm);
  let k: number, a: number;
  if (mitAchsenabschnitt) {
    const sm = s.reduce((u, v) => u + v, 0) / n;
    const xm = x.reduce((u, v) => u + v, 0) / n;
    const sxx = s.reduce((u, v) => u + (v - sm) ** 2, 0);
    const sxy = s.reduce((u, v, i) => u + (v - sm) * (x[i] - xm), 0);
    k = sxx > 0 ? sxy / sxx : NaN;
    a = xm - k * sm;
  } else {
    const ss = s.reduce((u, v) => u + v * v, 0);
    k = ss > 0 ? s.reduce((u, v, i) => u + v * x[i], 0) / ss : NaN;
    a = 0;
  }
  const xm = x.reduce((u, v) => u + v, 0) / n;
  const ssTot = x.reduce((u, v) => u + (v - xm) ** 2, 0);
  const ssRes = x.reduce((u, v, i) => u + (v - (a + k * s[i])) ** 2, 0);
  const r2 = ssTot > 0 ? 1 - ssRes / ssTot : (ssRes === 0 ? 1 : NaN);
  return { k, a, r2, n };
}

/** Umrechnungsfaktor von K_AC (mm/√d bei c_acc) auf K_nat (mm/√a bei c_nat); Konzentrationen in Vol.-% */
export const umrechnungsfaktor = (cAcc: number, cNat: number) => Math.sqrt(cNat / cAcc) * Math.sqrt(365);

export interface KarbonatisierungEingabe {
  punkte: readonly Messpunkt[];
  mitAchsenabschnitt: boolean;
  /** CO₂-Konzentration im Prüfschrank in Vol.-% (DIN EN 12390-12: 3,0 %) */
  cAcc: number;
  /** natürliche CO₂-Konzentration in Vol.-% (etwa 0,04 % ≈ 400 ppm) */
  cNat: number;
  /** Betondeckung c in mm (z. B. c_nom oder c_min,dur) */
  deckung: number;
  /** Nutzungsdauer in Jahren */
  nutzungsdauer: number;
}

export interface KarbonatisierungErgebnis {
  reg: Regression;
  /** K_AC in mm/√d */
  kAC: number;
  /** Umrechnungsfaktor */
  faktor: number;
  /** K_nat in mm/√a (Näherung) */
  kNat: number;
  /** prognostizierte Karbonatisierungstiefe nach der Nutzungsdauer in mm */
  xNutzung: number;
  /** Zeit bis zum Erreichen der Betondeckung in Jahren */
  tDeckung: number;
  /** Deckung reicht für die Nutzungsdauer */
  ausreichend: boolean;
  gueltig: boolean;
  hinweise: Hinweis[];
}

/** Prognose der Karbonatisierungstiefe x(t) = K_nat · √t (t in Jahren) */
export const tiefeNach = (kNat: number, tJahre: number) => kNat * Math.sqrt(Math.max(tJahre, 0));

export function schnellkarbonatisierung(e: KarbonatisierungEingabe): KarbonatisierungErgebnis {
  const hinweise: Hinweis[] = [];
  const reg0: Regression = { k: NaN, a: NaN, r2: NaN, n: e.punkte.length };
  const leer: KarbonatisierungErgebnis = { reg: reg0, kAC: NaN, faktor: NaN, kNat: NaN, xNutzung: NaN, tDeckung: NaN, ausreichend: false, gueltig: false, hinweise };

  const punkte = e.punkte.filter(p => Number.isFinite(p.tTage) && Number.isFinite(p.xMm));
  if (punkte.length < e.punkte.length) hinweise.push({ stufe: 'warnung', feld: 'punkte', text: 'Unvollständige Messpunkte wurden nicht berücksichtigt.' });
  if (punkte.length < 2) hinweise.push({ stufe: 'fehler', feld: 'punkte', text: 'Für die Regression werden mindestens zwei vollständige Messpunkte benötigt.' });
  if (punkte.some(p => p.tTage < 0)) hinweise.push({ stufe: 'fehler', feld: 'punkte', text: 'Die Lagerungsdauer darf nicht negativ sein.' });
  if (punkte.some(p => p.xMm < 0)) hinweise.push({ stufe: 'fehler', feld: 'punkte', text: 'Karbonatisierungstiefen dürfen nicht negativ sein.' });
  if (punkte.length >= 2 && new Set(punkte.map(p => p.tTage)).size < 2) hinweise.push({ stufe: 'fehler', feld: 'punkte', text: 'Mindestens zwei verschiedene Messzeitpunkte sind nötig.' });
  if (!e.mitAchsenabschnitt && punkte.length >= 1 && punkte.every(p => p.tTage === 0)) hinweise.push({ stufe: 'fehler', feld: 'punkte', text: 'Ohne Messpunkt mit t > 0 ist keine Steigung bestimmbar.' });
  if (!istEndlich(e.cAcc, e.cNat) || e.cAcc <= 0 || e.cNat <= 0) hinweise.push({ stufe: 'fehler', feld: 'cAcc', text: 'Die CO₂-Konzentrationen müssen größer als 0 sein.' });
  else if (e.cNat >= e.cAcc) hinweise.push({ stufe: 'fehler', feld: 'cNat', text: 'Die natürliche CO₂-Konzentration muss kleiner als die Prüfkonzentration sein.' });
  if (!istEndlich(e.deckung) || e.deckung <= 0) hinweise.push({ stufe: 'fehler', feld: 'deckung', text: 'Die Betondeckung muss größer als 0 sein.' });
  if (!istEndlich(e.nutzungsdauer) || e.nutzungsdauer <= 0) hinweise.push({ stufe: 'fehler', feld: 'nutzungsdauer', text: 'Die Nutzungsdauer muss größer als 0 sein.' });
  if (hatFehler(hinweise)) return leer;

  const reg = wurzelZeitRegression(punkte, e.mitAchsenabschnitt);
  if (!Number.isFinite(reg.k)) {
    hinweise.push({ stufe: 'fehler', feld: 'punkte', text: 'Aus den Messpunkten lässt sich keine Steigung bestimmen.' });
    return { ...leer, reg };
  }
  if (reg.k <= 0) {
    hinweise.push({ stufe: 'fehler', feld: 'punkte', text: 'Die Regression ergibt keinen positiven Karbonatisierungskoeffizienten – Messwerte prüfen (Tiefe muss mit der Zeit zunehmen).' });
    return { ...leer, reg };
  }

  const faktor = umrechnungsfaktor(e.cAcc, e.cNat);
  const kNat = reg.k * faktor;
  const xNutzung = tiefeNach(kNat, e.nutzungsdauer);
  const tDeckung = (e.deckung / kNat) ** 2;
  const ausreichend = xNutzung <= e.deckung;

  // Warnungen zur Prüfdurchführung und zur Aussagekraft
  const tMax = Math.max(...punkte.map(p => p.tTage));
  if (punkte.filter(p => p.tTage > 0).length < 3) hinweise.push({ stufe: 'warnung', feld: 'punkte', text: 'DIN EN 12390-12 sieht mehrere Messzeitpunkte während der Lagerung vor (z. B. 7, 28 und 70 Tage); mit weniger als drei Zeitpunkten ist die Regression wenig belastbar.' });
  if (tMax < 70) hinweise.push({ stufe: 'warnung', feld: 'punkte', text: 'Die letzte Messung liegt vor 70 Tagen Lagerung – die Norm wertet über die volle Lagerungsdauer aus.' });
  if (Number.isFinite(reg.r2) && reg.r2 < 0.9) hinweise.push({ stufe: 'warnung', feld: 'punkte', text: 'Das Bestimmtheitsmaß R² liegt unter 0,90 – die Messwerte folgen dem Wurzel-t-Gesetz nur eingeschränkt (Ausreißer, Feuchteeinfluss?).' });
  if (e.mitAchsenabschnitt && reg.a < -1) hinweise.push({ stufe: 'warnung', feld: 'punkte', text: 'Der Achsenabschnitt ist deutlich negativ – physikalisch nicht sinnvoll; die Regression durch den Ursprung prüfen.' });
  if (e.mitAchsenabschnitt && reg.a > 5) hinweise.push({ stufe: 'warnung', feld: 'punkte', text: 'Großer Achsenabschnitt: Die Proben waren vor der Lagerung bereits merklich karbonatisiert (Vorlagerung prüfen).' });
  if (Math.abs(e.cAcc - 3) > 0.5) hinweise.push({ stufe: 'warnung', feld: 'cAcc', text: 'DIN EN 12390-12 prüft bei (3,0 ± 0,5) Vol.-% CO₂; bei anderen Konzentrationen ändern sich Reaktionsprodukte und Übertragbarkeit.' });
  if (e.cNat < 0.03 || e.cNat > 0.1) hinweise.push({ stufe: 'warnung', feld: 'cNat', text: 'Die Außenluft enthält derzeit etwa 0,042 Vol.-% CO₂; Innenräume und Tunnel liegen teils höher.' });
  if (kNat > 10) hinweise.push({ stufe: 'warnung', feld: 'punkte', text: 'K_nat über 10 mm/√a entspricht einem sehr karbonatisierungsanfälligen Beton – Messwerte und Einheiten (Tage, mm) prüfen.' });

  return { reg, kAC: reg.k, faktor, kNat, xNutzung, tDeckung, ausreichend, gueltig: true, hinweise };
}
