/**
 * Rechenkern „Bohrkernserie auswerten“ – charakteristische In-situ-Druckfestigkeit f_ck,is nach DIN EN 13791:2020-02
 * (Deutsche Fassung EN 13791:2019) für das Modul „Historische Kennwerte“ (Ergänzung 02.11.2026).
 *
 * Keine Doppelrechnung: Die Statistik für n ≥ 8 Kerne übernimmt insituDruckfestigkeit13791() aus bauwerksuntersuchung.ts
 * (k_n und M aus kn13791/margin13791 in src/utils/schadensKern.ts, Modulprüfung T12/Runde 5), die Klassenzuordnung
 * klasseAusInsitu13791(). Dieser Kern ergänzt nur Einzelwerte → Mittelwert/Standardabweichung, die Mindestanzahl,
 * die Mindeststandardabweichung, die Verfahren für kleine Prüfbereiche und die Umrechnung der Kernschlankheit.
 *
 * Belege (Sekundärquellen, Normtext nicht eingesehen; jeweils „vorläufig, Normprüfung ausstehend“):
 *  [BRMCA-G] BRMCA, Draft Guide BS EN 13791 Clause 8 (2020): f_ck,is = min(f_m(n),is − k_n·s; f_is,lowest + M),
 *            k_n = 2,00/1,92/1,87/1,81/1,76/1,73/1,64 für n = 8/10/12/16/20/30/∞; s nicht kleiner als V = 8 %;
 *            mindestens 8 Kerne Ø ≥ 75 mm (empfohlen ≥ 10); Kerne 2:1 oder 1:1, Kernlängenfaktor 1:1 → 2:1 = 0,82;
 *            kleine Prüfbereiche (≤ 10 m³ bzw. ≤ 30 m³): ≥ 3 Kerne, Spannweite ≤ 15 % des Mittelwerts.
 *            https://brmca.org.uk/documents/DRAFT_BRMCA_GUIDE_EN_13791_Clause_8_Estimation_of_compressive_strength_for_structural_assessment_v200123.pdf
 *  [BRMCA-A] BRMCA, Assessment of in-situ concrete strength – revised BS EN 13791 and BS EN 12504-1 (Concrete, April 2020):
 *            8 Kerne als 2:1-Äquivalent bzw. 12 bei Kernen Ø 50 mm; Ø ≥ 3·D_max, bevorzugt ≥ 75 mm, mindestens 50 mm;
 *            1:1 = 0,90 … 1,10, 2:1 = 1,95 … 2,05; 1:1-Kerne Ø 100 mm im Zweifelsfall üblich.
 *            https://brmca.org.uk/documents/Assessment_of_in-situ_concrete_strength-revised_BS_EN_13791_and_BS_EN_12504-1_Concrete_April2020.pdf
 *  [TFB]     TFB-Bulletin 1/2021 „Bewertung der Druckfestigkeit im Bauwerk – die neue SN EN 13791“: s mindestens V = 8 %,
 *            M nach Kleinstwert (4 bei ≥ 20 MPa … 1 bei < 12 MPa), CLF = (h/(2·d))^0,29 mit 0,82 bei h/d = 1, kleiner
 *            Prüfbereich 1–3 Bauteile ≤ 10 m³, ≥ 3 Kerne, Kleinstwert maßgebend, Streubreite ≤ 15 %.
 *            https://www.tfb.ch/Htdocs/Files/v/10943.pdf/Info/TFB-Bulletin-1.2021_d-Bewertung-der-Druckfestigkeit-im-Bauwerk--die-neue-SN-EN-13791.pdf
 *  [Sefrin]  Sefrin et al., Structural Concrete 2022 (EN 13791:2019 für kleine Stichproben): v_x,min = 0,08 für n ≥ 8;
 *            8.1(7): V ≤ 10 m³, 1–3 Bauteile, ≥ 3 Kerne, f_ck,is = Kleinstwert bei R ≤ 15 % von f_m; 8.3: V ≤ 30 m³,
 *            indirekte Prüfung, ≥ 3 Kerne an der Stelle geringster Festigkeit, f_ck,is = Mittelwert, gleiches 15-%-Kriterium.
 *            https://d-nb.info/1249177952/34
 *  [A20]     DIN Media, Produktseite DIN EN 13791/A20:2022-04 (nationale Ergänzung, u. a. NA.8.1 weniger als 8 Kerne
 *            Ø ≥ 75 mm bzw. 12 Kerne 50 ≤ d < 75 mm, NA.8.3 abweichend von 8.3): Inhalte hier NICHT abgebildet.
 *            https://www.dinmedia.de/en/standard/din-en-13791-a20/351305107
 * Offene Normpunkte (Prüfbogen Normtext): T15-BS-5/NS-BD-2 (Mindeststandardabweichung), NS-BD-3 (Bezug der Kerne 1:1/2:1).
 */
import { type Hinweis, type KeineKlasse, KEINE_KLASSE, istEndlich, hatFehler, muss, bereich, nurGueltig } from './plausibilitaet';
import { insituDruckfestigkeit13791, klasseAusInsitu13791 } from './bauwerksuntersuchung';
import { C_CLASSES } from '../utils/bestandKern';

/** kerne: nur Bohrkerne, n ≥ 8 (Abschnitt 8.1); kleinerBereich: 8.1(7) (≤ 10 m³, 1–3 Bauteile); indirektKerne: 8.3 (≤ 30 m³) */
export type Ansatz13791 = 'kerne' | 'kleinerBereich' | 'indirektKerne';
/** zylinder: Kerne h/d = 2; wuerfel: Kerne h/d = 1 mit Würfelbezug (bisheriger App-Ansatz); kern11: h/d = 1, ×0,82 auf h/d = 2 */
export type Bezug13791 = 'zylinder' | 'wuerfel' | 'kern11';

/** Kernlängenfaktor 1:1 → 2:1 für Normalbeton [BRMCA-G], [BRMCA-A], [TFB] – vorläufig, Normprüfung ausstehend */
export const KERNLAENGENFAKTOR_11 = 0.82;
/** Mindestvariationskoeffizient für s bei n ≥ 8 [BRMCA-G], [TFB], [Sefrin] – vorläufig, Normprüfung ausstehend (T15-BS-5) */
export const V_MIN_13791 = 0.08;
/** Höchstzulässige Spannweite der Kernwerte in den Verfahren für kleine Prüfbereiche, bezogen auf den Mittelwert [Sefrin], [TFB] */
export const SPANNWEITE_MAX_KLEIN = 0.15;
/** Höchstvolumen des Prüfbereichs in m³ für 8.1(7) bzw. 8.3 [Sefrin], [BRMCA-G] */
export const VOLUMEN_MAX: Readonly<Record<Exclude<Ansatz13791, 'kerne'>, number>> = { kleinerBereich: 10, indirektKerne: 30 };

/** Mindestanzahl gültiger Kerne je Prüfbereich: 8 bei Ø ≥ 75 mm, 12 bei 50 ≤ Ø < 75 mm [BRMCA-A], [A20]; kleine Prüfbereiche 3 */
export function mindestanzahl13791(ansatz: Ansatz13791, durchmesserMm: number): number {
  if (!Number.isFinite(durchmesserMm) || durchmesserMm < 50) return NaN;
  if (ansatz !== 'kerne') return 3;
  return durchmesserMm >= 75 ? 8 : 12;
}

export interface BohrkernserieEingabe {
  /** Kerndruckfestigkeiten der gültigen Kerne in N/mm² (DIN EN 12504-1, Prüfung nach DIN EN 12390-3) */
  werte: number[];
  ansatz: Ansatz13791;
  bezug: Bezug13791;
  /** Kerndurchmesser in mm */
  durchmesserMm: number;
  /** Größtkorn D_max in mm */
  groesstkornMm: number;
  /** Betonvolumen des Prüfbereichs in m³ (für die Verfahren kleiner Prüfbereiche) */
  volumenM3: number;
  /** Mindeststandardabweichung s ≥ 0,08·f_m(n),is ansetzen (nur Ansatz „kerne“) */
  mindestStreuung: boolean;
}

export interface BohrkernserieErgebnis {
  gueltig: boolean; hinweise: Hinweis[];
  n: number; nMin: number;
  /** Werte auf den Bezugskörper umgerechnet (Bezug kern11: ×0,82) */
  werteBezug: number[];
  mittel: number; s: number; sMin: number; sEff: number; vx: number;
  kleinster: number; groesster: number; spannweite: number; spannweiteRel: number;
  /** nur Ansatz „kerne“ (sonst NaN) */
  kn: number; M: number; ausStreuung: number; ausKleinstwert: number; fckIsOhneMindest: number;
  fckIs: number;
  massgebend: 'streuung' | 'kleinstwert' | 'kleinstwertBereich' | 'mittelBereich' | KeineKlasse;
  /** zugeordnete Klasse; null = unter C8/10 */
  klasse: string | null | KeineKlasse;
  /** f_ck der Klasse im Vergleichsmaß (Zylinder bei h/d = 2 bzw. umgerechnet, Würfel bei Würfelbezug) */
  fckVergleich: number; fck: number; fckCube: number;
  /** f_ck,is / f_ck,Vergleich der zugeordneten Klasse (≥ 0,85) */
  verhaeltnis: number;
  naechsteKlasse: string | null | KeineKlasse;
  /** f_ck,is, ab dem die nächsthöhere Klasse erreicht wäre (0,85·f_ck) */
  naechsteGrenze: number;
}

const mittelwert = (x: readonly number[]) => x.reduce((a, b) => a + b, 0) / x.length;
const stdabw = (x: readonly number[], m: number) => (x.length > 1 ? Math.sqrt(x.reduce((a, b) => a + (b - m) ** 2, 0) / (x.length - 1)) : NaN);

export function bohrkernserie13791(e: BohrkernserieEingabe): BohrkernserieErgebnis {
  const h: Hinweis[] = [];
  const werte = Array.isArray(e.werte) ? e.werte : [];
  muss(h, werte.length > 0 && werte.every(v => Number.isFinite(v) && v > 0), 'werte', 'Alle Kernwerte müssen Zahlen größer als 0 sein.');
  muss(h, istEndlich(e.durchmesserMm) && e.durchmesserMm >= 50, 'durchmesserMm', 'Kerne unter 50 mm Durchmesser liegen außerhalb von DIN EN 13791.');
  muss(h, istEndlich(e.groesstkornMm) && e.groesstkornMm > 0, 'groesstkornMm', 'Das Größtkorn muss größer als 0 sein.');
  muss(h, istEndlich(e.volumenM3) && e.volumenM3 > 0, 'volumenM3', 'Das Volumen des Prüfbereichs muss größer als 0 sein.');
  if (istEndlich(e.durchmesserMm, e.groesstkornMm) && e.groesstkornMm > 0 && e.durchmesserMm < 3 * e.groesstkornMm) {
    h.push({ stufe: 'warnung', feld: 'durchmesserMm', text: 'Kerndurchmesser kleiner als das Dreifache des Größtkorns (DIN EN 12504-1; vorläufig, Normprüfung ausstehend).' });
  }
  bereich(h, 'werte', Math.max(...werte.filter(Number.isFinite), 0), 0, 120, 'Kernwerte über 120 N/mm² liegen außerhalb des Lehrbereichs (hochfeste Betone gesondert).');

  const n = werte.length;
  const nMin = mindestanzahl13791(e.ansatz, e.durchmesserMm);
  const faktor = e.bezug === 'kern11' ? KERNLAENGENFAKTOR_11 : 1;
  const werteBezug = werte.map(v => v * faktor);
  const bezugKlasse: 'wuerfel' | 'zylinder' = e.bezug === 'wuerfel' ? 'wuerfel' : 'zylinder';
  const mittel = mittelwert(werteBezug);
  const s = stdabw(werteBezug, mittel);
  const sMin = V_MIN_13791 * mittel;
  const kleinster = Math.min(...werteBezug);
  const groesster = Math.max(...werteBezug);
  const spannweite = groesster - kleinster;
  const spannweiteRel = spannweite / mittel;

  let kn = NaN, M = NaN, ausStreuung = NaN, ausKleinstwert = NaN, fckIsOhneMindest = NaN, fckIs = NaN, sEff = NaN;
  let massgebend: BohrkernserieErgebnis['massgebend'] = KEINE_KLASSE;

  if (e.ansatz === 'kerne') {
    muss(h, n >= 8, 'n', `Für die Auswertung nur mit Bohrkernen sind mindestens 8 Kerne nötig (vorhanden: ${n}). Für weniger Kerne gelten die Verfahren für kleine Prüfbereiche bzw. in Deutschland DIN EN 13791/A20, NA.8.1 (nicht abgebildet).`);
    if (Number.isFinite(nMin) && n >= 8 && n < nMin) h.push({ stufe: 'warnung', feld: 'n', text: `Unter der Mindestanzahl: Bei Kernen mit 50 ≤ Ø < 75 mm sind mindestens ${nMin} Kerne nötig (vorhanden: ${n}).` });
    if (Number.isFinite(nMin) && n >= nMin && n < nMin + 2) h.push({ stufe: 'warnung', feld: 'n', text: `Empfehlung: mindestens ${nMin + 2} Kerne entnehmen, damit nach einem Ausreißer noch die Mindestanzahl bleibt.` });
    sEff = e.mindestStreuung ? Math.max(s, sMin) : s;
    if (!hatFehler(h)) {
      const basis = { n, mittel, kleinster, bezug: bezugKlasse };
      const mit = insituDruckfestigkeit13791({ ...basis, s: sEff });
      const ohne = insituDruckfestigkeit13791({ ...basis, s });
      h.push(...mit.hinweise.filter(x => x.stufe === 'fehler'));
      kn = mit.kn; M = mit.M; ausStreuung = mit.ausStreuung; ausKleinstwert = mit.ausKleinstwert; fckIs = mit.fckIs; fckIsOhneMindest = ohne.fckIs;
      massgebend = ausStreuung <= ausKleinstwert ? 'streuung' : 'kleinstwert';
      if (e.mindestStreuung && s < sMin) h.push({ stufe: 'warnung', feld: 'mindestStreuung', text: 'Die gemessene Standardabweichung liegt unter 8 % des Mittelwerts; gerechnet wird mit s = 0,08 · f_m(n),is (vorläufig, Normprüfung ausstehend).' });
    }
  } else {
    const vMax = VOLUMEN_MAX[e.ansatz];
    muss(h, n >= 3, 'n', `Für kleine Prüfbereiche sind mindestens 3 Kerne nötig (vorhanden: ${n}).`);
    muss(h, !istEndlich(e.volumenM3) || e.volumenM3 <= vMax, 'volumenM3', `Das Verfahren gilt nur für Prüfbereiche bis ${vMax} m³.`);
    if (n >= 3 && Number.isFinite(spannweiteRel)) {
      muss(h, spannweiteRel <= SPANNWEITE_MAX_KLEIN + 1e-9, 'werte', `Spannweite der Kernwerte größer als 15 % des Mittelwerts – Verfahren nicht anwendbar (mehr Kerne entnehmen oder Prüfbereich teilen).`);
    }
    if (istEndlich(e.durchmesserMm) && e.durchmesserMm < 75) h.push({ stufe: 'warnung', feld: 'durchmesserMm', text: 'Für kleine Prüfbereiche werden Kerne mit Ø ≥ 75 mm vorausgesetzt (vorläufig, Normprüfung ausstehend).' });
    h.push({ stufe: 'warnung', feld: 'ansatz', text: 'In Deutschland ergänzt DIN EN 13791/A20:2022-04 (NA.8.1, NA.8.3) diese Verfahren; die nationalen Regeln sind hier nicht abgebildet (vorläufig, Normprüfung ausstehend).' });
    if (e.ansatz === 'indirektKerne') h.push({ stufe: 'warnung', feld: 'ansatz', text: 'Die Kerne sind an den Stellen mit den geringsten Werten der indirekten Prüfung (Rückprall, Ultraschall) zu entnehmen; die indirekten Werte selbst gehen nicht in die Rechnung ein.' });
    if (!hatFehler(h)) {
      fckIs = e.ansatz === 'kleinerBereich' ? kleinster : mittel;
      massgebend = e.ansatz === 'kleinerBereich' ? 'kleinstwertBereich' : 'mittelBereich';
    }
  }

  const k = klasseAusInsitu13791(fckIs, bezugKlasse);
  const fckVergleich = bezugKlasse === 'wuerfel' ? k.fckCube : k.fck;
  const verhaeltnis = k.klasse ? fckIs / fckVergleich : NaN;
  const idx = C_CLASSES.findIndex(([zyl, wue]) => `C${zyl}/${wue}` === k.klasse);
  const naechste = k.klasse ? C_CLASSES[idx + 1] : C_CLASSES[0];
  const naechsteKlasse = Number.isFinite(fckIs) && naechste ? `C${naechste[0]}/${naechste[1]}` : null;
  const naechsteGrenze = naechste && Number.isFinite(fckIs) ? 0.85 * (bezugKlasse === 'wuerfel' ? naechste[1] : naechste[0]) : NaN;
  if (!hatFehler(h) && k.klasse === null) h.push({ stufe: 'warnung', feld: 'klasse', text: 'f_ck,is liegt unter 0,85 · 8 N/mm² – keine Druckfestigkeitsklasse nach DIN EN 206 zuzuordnen.' });

  return nurGueltig({
    n, nMin, werteBezug, mittel, s, sMin, sEff, vx: s / mittel, kleinster, groesster, spannweite, spannweiteRel,
    kn, M, ausStreuung, ausKleinstwert, fckIsOhneMindest, fckIs, massgebend,
    klasse: k.klasse, fckVergleich, fck: k.fck, fckCube: k.fckCube, verhaeltnis, naechsteKlasse, naechsteGrenze,
    gueltig: !hatFehler(h), hinweise: h,
  }, ['klasse', 'naechsteKlasse', 'massgebend']);
}

/** Lehrbeispiele (02.11.2026) – Werte erfunden für die Lehre, Rechnung in tests/hist13791.test.ts nachgerechnet */
export const LEHRBEISPIELE_13791: readonly { id: string; titel: string; eingabe: BohrkernserieEingabe }[] = [
  {
    id: 'b225_decke',
    titel: 'Decke 1963, Plan „B 225“: 10 Kerne Ø 100 mm, h/d = 2',
    eingabe: { werte: [16.4, 18.9, 20.3, 17.6, 21.8, 19.4, 15.9, 18.2, 20.9, 17.1], ansatz: 'kerne', bezug: 'zylinder', durchmesserMm: 100, groesstkornMm: 32, volumenM3: 120, mindestStreuung: true },
  },
  {
    id: 'b300_unterzug',
    titel: 'Unterzüge 1968, Plan „B 300“: 8 Kerne Ø 100 mm, h/d = 1',
    eingabe: { werte: [27.9, 29.1, 28.4, 30.2, 28.8, 29.6, 27.5, 29.0], ansatz: 'kerne', bezug: 'wuerfel', durchmesserMm: 100, groesstkornMm: 32, volumenM3: 45, mindestStreuung: true },
  },
];
