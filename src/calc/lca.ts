/**
 * Rechenkern Gebäude-Ökobilanz (AP 4.10) für den LCA-Rechner (src/modules/InteractiveLCACalc.tsx) und den
 * Einzelbaustoff-Rechner (src/modules/LCA.tsx). Lehr- und Vorbemessungswerkzeug, kein QNG-Nachweis.
 *
 * Bilanzrahmen nach QNG-Handbuch Anlage 3, Anhang 3.1.1 „LCA-Bilanzregeln Wohngebäude“, v1.4 (Stand 19.07.2024):
 *  - Bezugsfläche NRF(R) nach DIN 277:2021-08, Betrachtungszeitraum Δt = 50 a, Ergebnis je m² NRF(R) und Jahr
 *  - Anforderungswert: A1–A3 + B4 + C3/C4 + Sockelbetrag TGA (Tab. 6) + B6.1 (GEG-Endenergie) + B6.3 (Nutzerstrom
 *    pauschal 20 kWh je m² beheizte NRF und Jahr); Modul D wird getrennt ausgewiesen und nicht angerechnet;
 *    A4 (Transport) gehört nicht zum QNG-Bilanzrahmen und wird hier nur informativ ausgewiesen
 *  - B4: je Ersatz A1–A3 + C3/C4; Anzahl = ⌊Δt/ND⌋ ohne Ersatz im 50. Jahr, d. h. n = ⌈Δt/ND⌉ − 1
 *    (gleichwertig: Ersatzmaßnahmen bis einschließlich Jahr 49); Nutzungsdauern nach BNB-Tabelle Stand 24.02.2017
 *  - B6: Endenergie × Rechenwert des Energieträgers („Ökobilanzierung – Rechenwerte 2023“, Werte je kWh
 *    Endenergie einschließlich Vorkette); selbst genutzter PV-Strom mit Faktor 0
 * Einheiten: Massen t, Mengen je Baustoffeinheit (m³ oder t), GWP in kg CO₂-Äq., Energie in kWh.
 * Reiner Rechenkern – geprüft in tests/lca.test.ts (Regressionstest gegen einen öffentlichen QNG-Beispielbericht).
 */
import { type Hinweis, bereich, hatFehler, istEndlich, muss } from './plausibilitaet';

export type Verwertung = 'high_grade' | 'downcycling' | 'reuse' | 'thermal';
export type Gebaeudeart = 'wohnbau' | 'nichtwohnbau';

/** Betrachtungszeitraum nach QNG / DIN EN 15978 [a] */
export const BETRACHTUNGSZEITRAUM_QNG = 50;

/** Anzahl der Ersatzmaßnahmen im Betrachtungszeitraum: n = ⌈T/ND⌉ − 1 (kein Ersatz im letzten Jahr), ND ≥ T → 0 */
export function ersatzzyklen(nutzungsdauer: number, betrachtungszeitraum: number = BETRACHTUNGSZEITRAUM_QNG): number {
  if (!(nutzungsdauer > 0) || !(betrachtungszeitraum > 0)) return NaN;
  if (nutzungsdauer >= betrachtungszeitraum) return 0;
  return Math.ceil(betrachtungszeitraum / nutzungsdauer) - 1;
}

export interface NutzungsdauerAngabe {
  /** Nutzungsdauer [a]; 50 steht für „≥ 50“ (kein Ersatz im Betrachtungszeitraum) */
  nd: number;
  /** Kostengruppe/Code und Zeile der BNB-Tabelle */
  quelle: string;
  /** true: Baustoff nicht ausdrücklich gelistet, Zuordnung vorläufig (F-Freigabe) */
  vorlaeufig: boolean;
}

/**
 * Nutzungsdauern der Baustoffe des LCA-Rechners nach „Nutzungsdauern von Bauteilen für Lebenszyklusanalysen nach BNB“
 * (BBSR, Stand 24.02.2017 – die in QNG-Anhang 3.1.1 v1.4 genannte Fassung). Hinweis: Die Neufassungen ab 25.09.2025
 * setzen WDVS auf ≥ 50 a herauf; bis zur Übernahme in die QNG-Regeln gilt hier der Wert 2017 (Prüfpunkt F-Freigabe).
 * Abgleich 27.10.2026: Die Neuerhebung der BBSR-Tabelle ist öffentlich belegt (Lobbyregister, Stellungnahme
 * SG2505050004 des Bundesverbands der Deutschen Ziegelindustrie, 05.05.2025: „letzter Stand: 2017“); Inhalt und
 * Geltung der Neufassung für QNG sind öffentlich nicht bestätigt – Fassung 2017 bleibt, Zuordnungen mit
 * vorlaeufig = true sind Analogieschlüsse für nicht gelistete Baustoffe (F-Freigabe).
 */
export const BNB_NUTZUNGSDAUER: Readonly<Record<string, NutzungsdauerAngabe>> = {
  'beton-cem1': { nd: 50, quelle: 'BNB 2017, 331.211 Betonwand / 351.1 Betondecke: ≥ 50 a', vorlaeufig: false },
  'beton-cem3': { nd: 50, quelle: 'BNB 2017, 331.211 Betonwand / 351.1 Betondecke: ≥ 50 a', vorlaeufig: false },
  'beton-cem2-cm': { nd: 50, quelle: 'BNB 2017, 331.211 Betonwand / 351.1 Betondecke: ≥ 50 a', vorlaeufig: false },
  'rc-beton': { nd: 50, quelle: 'BNB 2017, 331.211 Betonwand / 351.1 Betondecke: ≥ 50 a', vorlaeufig: false },
  'geopolymer-beton': { nd: 50, quelle: 'BNB 2017, 331.211 Betonwand analog (alkalisch aktivierte Bindemittel nicht gelistet): ≥ 50 a', vorlaeufig: true },
  ziegel: { nd: 50, quelle: 'BNB 2017, 331.111 Mauerwerkswand: ≥ 50 a', vorlaeufig: false },
  baustahl: { nd: 50, quelle: 'BNB 2017, 331.411 Stahlbauwand / 333.411 Stahlstütze: ≥ 50 a', vorlaeufig: false },
  kvh: { nd: 50, quelle: 'BNB 2017, 331.311 Holzwand / 333.311 Holzstütze: ≥ 50 a', vorlaeufig: false },
  clt: { nd: 50, quelle: 'BNB 2017, 331.311 Holzwand / 351.411 Massivholzdecke: ≥ 50 a', vorlaeufig: false },
  'hbv-decke': { nd: 50, quelle: 'BNB 2017, 351.411 Holzdecken inkl. Holz-Beton-Verbunddecke: ≥ 50 a', vorlaeufig: false },
  'lehm-bauplatte': { nd: 50, quelle: 'BNB 2017, 331.511 Lehmbauwand (Lehmbauplatten nicht einzeln gelistet): ≥ 50 a', vorlaeufig: true },
  hanfkalk: { nd: 50, quelle: 'nicht in BNB 2017 gelistet; Annahme wie tragende Wand ≥ 50 a', vorlaeufig: true },
  'eps-daemmung': { nd: 40, quelle: 'BNB 2017, 335.641 Wärmedämmverbundsystem (Polystyrol): 40 a; Kerndämmung 335.611: ≥ 50 a', vorlaeufig: true },
  zellulose: { nd: 50, quelle: 'BNB 2017, 364.211 Zwischen-, Auf- und Untersparrendämmung (Zellulose): ≥ 50 a', vorlaeufig: false },
  'holzfaser-daemmung': { nd: 40, quelle: 'BNB 2017, 335.641 Wärmedämmverbundsystem (Holzfaserdämmplatten): 40 a; im Dach 363.531: ≥ 50 a', vorlaeufig: true },
  schaumglas: { nd: 50, quelle: 'BNB 2017, 335.151 Perimeterdämmung Schaumglas: ≥ 50 a', vorlaeufig: false },
  strohballen: { nd: 50, quelle: 'nicht in BNB 2017 gelistet; Annahme wie Dämmung zwischen Holzständern ≥ 50 a', vorlaeufig: true },
};

export type Energietraeger =
  | 'netzstrom'
  | 'fw_biogas_kwk' | 'fw_biomasse_kwk' | 'fw_braunkohle_kwk' | 'fw_erdgas_kwk' | 'fw_heizoel_kwk' | 'fw_steinkohle_kwk'
  | 'fw_biogas' | 'fw_biomasse' | 'fw_braunkohle' | 'fw_erdgas' | 'fw_heizoel' | 'fw_steinkohle';

export interface B6Faktor { name: string; gwp: number; quelle: string; vorlaeufig: boolean }

const QUELLE_FW = 'QNG Anhang 3.4 Sonderberechnungsvorschrift Fernwärme v1.0 (01.04.2024), nach Rechenwerte 2023 v1.3, Teil B Tab. 1.2';
/**
 * Rechenwerte B6 [kg CO₂-Äq. je kWh Endenergie]. Fernwärme: wörtlich aus QNG-Anhang 3.4. Netzstrom: 0,53203 nach
 * „Oekobilanzierung-Rechenwerte-2023-Version-1.3“ (qng.info), wiedergegeben in der öffentlichen Berichtsvorlage
 * „RL22 Beispiel-Bericht LCA-THG“ der Landeshauptstadt München (Förderprogramm Klimaneutrale Gebäude 2024,
 * Arbeitsblatt 3, „Netzstrommix“); bestätigt durch die Rückrechnung des QNG-Beispielberichts (EVEBI, 04.05.2023:
 * 677 017 kg / (25 450 kWh/a · 50 a) = 0,53204). Vorher 0,5320 (Rundung). Ob die Rechenwert-Tabelle v1.3 noch die
 * aktuell vorgeschriebene Fassung ist, prüft der Rechenkern nicht (Prüfpunkt).
 */
export const B6_FAKTOREN: Readonly<Record<Energietraeger, B6Faktor>> = {
  netzstrom: { name: 'Nationaler Netzstrommix', gwp: 0.53203, quelle: 'QNG-Rechenwerte 2023 v1.3, Wiedergabe LH München, FKG-Berichtsvorlage 2024 (Arbeitsblatt 3)', vorlaeufig: false },
  fw_biogas_kwk: { name: 'Fernwärme aus Biogas mit KWK', gwp: 0.05629219, quelle: QUELLE_FW, vorlaeufig: false },
  fw_biomasse_kwk: { name: 'Fernwärme aus Biomasse (fest) mit KWK', gwp: 0.01152588, quelle: QUELLE_FW, vorlaeufig: false },
  fw_braunkohle_kwk: { name: 'Fernwärme aus Braunkohle mit KWK', gwp: 0.3062231, quelle: QUELLE_FW, vorlaeufig: false },
  fw_erdgas_kwk: { name: 'Fernwärme aus Erdgas mit KWK', gwp: 0.14776562, quelle: QUELLE_FW, vorlaeufig: false },
  fw_heizoel_kwk: { name: 'Fernwärme aus Heizöl (leicht) mit KWK', gwp: 0.1888197, quelle: QUELLE_FW, vorlaeufig: false },
  fw_steinkohle_kwk: { name: 'Fernwärme aus Steinkohle mit KWK', gwp: 0.28413023, quelle: QUELLE_FW, vorlaeufig: false },
  fw_biogas: { name: 'Fernwärme aus Biogas ohne KWK', gwp: 0.17557317, quelle: QUELLE_FW, vorlaeufig: false },
  fw_biomasse: { name: 'Fernwärme aus Biomasse (fest) ohne KWK', gwp: 0.02533312, quelle: QUELLE_FW, vorlaeufig: false },
  fw_braunkohle: { name: 'Fernwärme aus Braunkohle ohne KWK', gwp: 0.53044599, quelle: QUELLE_FW, vorlaeufig: false },
  fw_erdgas: { name: 'Fernwärme aus Erdgas ohne KWK', gwp: 0.2908654, quelle: QUELLE_FW, vorlaeufig: false },
  fw_heizoel: { name: 'Fernwärme aus Heizöl (leicht) ohne KWK', gwp: 0.41729154, quelle: QUELLE_FW, vorlaeufig: false },
  fw_steinkohle: { name: 'Fernwärme aus Steinkohle ohne KWK', gwp: 0.54720278, quelle: QUELLE_FW, vorlaeufig: false },
};

/** Nutzerstrom B6.3 pauschal [kWh je m² beheizte NRF und Jahr] (QNG-Anhang 3.1.1, Abschnitt 6) */
export const NUTZERSTROM_PAUSCHAL = 20;

export type TgaSockel = 'keiner' | 'ep_ueber40' | 'ep_bis40';
/** Sockelbetrag TGA für A1–A3, B4, C3, C4 bzw. für D1 [kg CO₂-Äq./(m² NRF(R)·a)], QNG-Anhang 3.1.1 v1.4, Tab. 6 und 7 (Q_P in % von Q_P,Ref) */
export const TGA_SOCKEL: Readonly<Record<TgaSockel, { gwp: number; gwpD: number }>> = {
  keiner: { gwp: 0, gwpD: 0 },
  ep_ueber40: { gwp: 1.20, gwpD: -0.52 },
  ep_bis40: { gwp: 1.30, gwpD: -0.61 },
};

/**
 * QNG-Anforderungswerte Wohngebäude QNG-WG23 [kg CO₂-Äq./(m² NRF·a)], QNG-Handbuch Anlage 3 v1.4; Nichtwohngebäude
 * projektspezifisch. Belegt: KfW, Anlage zum Merkblatt 296/498, Technische Mindestanforderungen, 09/2025, Tab. 1
 * (24 kg CO₂-Äq./(m²·a)); envisys-Infothek „QNG“, Stand 01/2026 (PLUS 24, PREMIUM 20). Laut envisys gelten „seit
 * 12/2025 vorübergehend geringere Anforderungen“; die Zahlenwerte sind öffentlich nicht beziffert gefunden und nicht
 * eingearbeitet (vorläufig, F-Freigabe: QNG-Handbuch Anlage 3 bzw. Infoblatt 12/2025 auf qng.info).
 */
export const QNG_WG = { plus: 24, premium: 20 } as const;

/**
 * Transportfaktoren A4 des Gebäuderechners [kg CO₂-Äq. je t·km], nicht Teil des QNG-Bilanzrahmens. Quelle: Umweltbundesamt,
 * „Vergleich der durchschnittlichen Emissionen einzelner Verkehrsmittel im Güterverkehr in Deutschland 2024“ (TREMOD 6.71B,
 * 10/2025; Treibhausgase als CO₂-Äq. einschließlich Energiebereitstellung): Lkw gesamt 118 g/tkm, Güterbahnen 14 g/tkm.
 * Vorher (Lehrwerte ohne Quelle): Lkw 0,15, Bahn 0,03.
 */
export const A4_FAKTOR_GEBAEUDE = { lkw: 0.118, bahn: 0.014 } as const;

/**
 * Relative Substitutionsfaktoren der Verwertungswege für Modul D (Lehrmodell, Bezug hochwertiges Recycling = 1).
 *
 * Struktur nach DIN EN 15804+A2, Anhang D (Wiedergabe GreenDelta, „Module D in Environmental Product Declarations“, 02/2025):
 *   D1 (stofflich) = Σ (M_MR,out − M_MR,in) · (E_MR,nach EoW − E_VMSub · Q_R,out/Q_Sub)
 *   D3 (energetisch) = − M_INC,out · (LHV · X_INC,Wärme · E_SE,Wärme + LHV · X_INC,Strom · E_SE,Strom), Gutschrift nur bei
 *   Anlagenwirkungsgrad > 60 %.
 * Q_R,out/Q_Sub ≤ 1 („1 ist der günstigste Fall“) → hochwertiges Recycling 1,0; Downcycling verdrängt einen geringerwertigen
 * Primärstoff (Q-Verhältnis < 1) → 0,55; Wiederverwendung ersetzt das Produkt einschließlich Aufbereitung → 1,45.
 * Rangfolge nach Abfallhierarchie § 6 Abs. 1 KrWG (Vorbereitung zur Wiederverwendung vor Recycling vor sonstiger, insbesondere
 * energetischer Verwertung) und BNB 4.1.4 (hochwertige vor minderwertiger vor thermischer Verwertung):
 * reuse > high_grade > downcycling > thermal. Korrektur 27.10.2026: thermisch vorher 0,85 (> Downcycling 0,55, Verstoß gegen
 * die Rangfolge), jetzt 0,40. Die Rangfolge ist belegt, die Beträge 1,45 / 0,55 / 0,40 sind Lehrwerte (vorläufig, F-Freigabe).
 */
export const VERWERTUNGSFAKTOR: Readonly<Record<Verwertung, number>> = { reuse: 1.45, high_grade: 1.0, downcycling: 0.55, thermal: 0.4 };
/** Rangfolge der Verwertungswege nach § 6 Abs. 1 KrWG / BNB 4.1.4, höchste Stufe zuerst */
export const VERWERTUNG_RANGFOLGE: readonly Verwertung[] = ['reuse', 'high_grade', 'downcycling', 'thermal'];
export const QUELLE_VERWERTUNGSFAKTOR = 'Modul-D-Verwertungsfaktoren: Rangfolge nach § 6 KrWG und BNB 4.1.4 belegt, Beträge Lehrwerte (vorläufig, F-Freigabe)';
/** Bezugs-Sortenreinheit der Referenz-Gutschrift [%] */
export const SORTENREINHEIT_REFERENZ = 85;

export interface LcaBaustoff {
  id: string;
  einheit: 'm³' | 't';
  /** kg je m³ (nur für einheit m³) */
  rohdichte: number;
  /** kg CO₂-Äq. je Einheit, A1–A3 (GWP-total einschließlich biogenem Kohlenstoff) */
  gwpA1A3: number;
  /** kg CO₂-Äq. je Einheit, C3/C4 */
  gwpC: number;
  /** kg CO₂-Äq. je Einheit, Referenz-Gutschrift Modul D */
  gwpD: number;
  /** gespeicherter biogener Kohlenstoff als CO₂ je Einheit */
  biogen: number;
  /** MJ je Einheit */
  penrt: number;
  /** Referenz-Kreislaufquote der Gutschrift gwpD [%] */
  refKreislaufquote: number;
  /** Verwertungsweg, für den gwpD gilt (deklariertes Szenario, wie in einer EPD); fehlt er, gilt hochwertiges Recycling */
  refVerwertung?: Verwertung;
}

export interface LcaZeile {
  baustoff: LcaBaustoff;
  menge: number;
  /** kreislauffähiger Stoffanteil [%] */
  kreislaufquote: number;
  /** Sortenreinheit / Rückbautrennbarkeit [%] */
  sortenreinheit: number;
  verwertung: Verwertung;
  /** Nutzungsdauer [a]; fehlt sie, gilt BNB_NUTZUNGSDAUER bzw. ≥ 50 a */
  nutzungsdauer?: number;
}

export interface LcaEnergie {
  /** Endenergie Strom aus Netz für Heizung, Warmwasser, Lüftung, Hilfsenergie nach GEG [kWh/a] */
  stromGeg: number;
  /** selbst genutzter PV-Strom [kWh/a], Faktor 0 */
  pvEigennutzung: number;
  /** Wärme aus Fernwärme [kWh/a]; 0, wenn die Wärme über Strom (Wärmepumpe) bereitgestellt wird */
  waerme: number;
  waermeTraeger: Energietraeger;
  /** Nutzerstrom B6.3 pauschal ansetzen */
  nutzerstrom: boolean;
}

export interface LcaEingabe {
  zeilen: readonly LcaZeile[];
  /** Netto-Raumfläche NRF(R) nach DIN 277 [m²] */
  nrfR: number;
  /** beheizte NRF für den Nutzerstrom [m²]; fehlt sie, gilt NRF(R) */
  nrfBeheizt?: number;
  betrachtungszeitraum: number;
  transportDistanz: number;
  transportFaktor: number;
  /** Ersatz B4 berücksichtigen */
  mitB4: boolean;
  /** Betrieb B6; null = nicht bilanziert */
  energie: LcaEnergie | null;
  tgaSockel: TgaSockel;
  gebaeudeart: Gebaeudeart;
}

export interface LcaZeilenErgebnis {
  id: string;
  masse: number;
  nutzungsdauer: number;
  ersatz: number;
  a1a3: number;
  c: number;
  b4: number;
  d: number;
  kreislaufMasse: number;
  rueckgewonnen: number;
}

export type LcaAussage = 'premium' | 'plus' | 'ueberschritten' | 'neutral';

export interface LcaErgebnis {
  gueltig: boolean;
  hinweise: Hinweis[];
  zeilen: LcaZeilenErgebnis[];
  /** Summen über den Betrachtungszeitraum [kg CO₂-Äq.] */
  masse: number;
  a1a3: number; a4: number; b4: number; c3c4: number; sockelTga: number; b6_1: number; b6_3: number; b6: number; d: number; dSockel: number;
  biogenGespeichert: number;
  penrtMJ: number;
  /** je m² NRF(R) und Jahr [kg CO₂-Äq./(m²·a)] */
  spez: { a1a3: number; a4: number; b4: number; c3c4: number; sockelTga: number; b6: number; d: number; konstruktion: number; qng: number; netto: number };
  /** Endenergie, die in B6 eingeht [kWh/a] */
  strom: number; nutzerstromKWh: number;
  penrtKwhJeM2a: number;
  /** Kreislaufkennzahlen */
  rueckgewonnen: number; kreislaufquoteGebaeude: number; umi: number;
  enthaeltB4: boolean; enthaeltB6: boolean; vollstaendig: boolean;
  /** Ergebnisaussage: nur mit B4 und B6, Δt = 50 a und Wohngebäude ein Vergleich mit dem QNG-Anforderungswert */
  aussage: LcaAussage;
  /** verwendete Faktoren/Nutzungsdauern mit Vorbehalt (F-Freigabe) */
  vorlaeufig: string[];
}

const SPEZ_NULL = { a1a3: NaN, a4: NaN, b4: NaN, c3c4: NaN, sockelTga: NaN, b6: NaN, d: NaN, konstruktion: NaN, qng: NaN, netto: NaN };

export function nutzungsdauerVon(z: LcaZeile): number {
  return z.nutzungsdauer ?? BNB_NUTZUNGSDAUER[z.baustoff.id]?.nd ?? BETRACHTUNGSZEITRAUM_QNG;
}

export function pruefeLca(e: LcaEingabe): Hinweis[] {
  const h: Hinweis[] = [];
  muss(h, istEndlich(e.nrfR) && e.nrfR > 0, 'nrfR', 'Die Netto-Raumfläche NRF(R) muss größer als 0 sein.');
  muss(h, istEndlich(e.betrachtungszeitraum) && e.betrachtungszeitraum > 0, 'betrachtungszeitraum', 'Der Betrachtungszeitraum muss größer als 0 sein.');
  muss(h, istEndlich(e.transportDistanz, e.transportFaktor) && e.transportDistanz >= 0 && e.transportFaktor >= 0, 'transport', 'Transportdistanz und Transportfaktor dürfen nicht negativ sein.');
  muss(h, e.zeilen.length > 0, 'zeilen', 'Mindestens ein Baustoff ist erforderlich.');
  e.zeilen.forEach((z, i) => {
    const n = `Zeile ${i + 1}`;
    muss(h, istEndlich(z.menge) && z.menge > 0, `menge${i}`, `${n}: Die Menge muss größer als 0 sein.`);
    muss(h, istEndlich(z.kreislaufquote) && z.kreislaufquote >= 0 && z.kreislaufquote <= 100, `kreislauf${i}`, `${n}: Der kreislauffähige Anteil muss zwischen 0 und 100 % liegen.`);
    muss(h, istEndlich(z.sortenreinheit) && z.sortenreinheit >= 0 && z.sortenreinheit <= 100, `sorten${i}`, `${n}: Die Sortenreinheit muss zwischen 0 und 100 % liegen.`);
    muss(h, z.baustoff.refKreislaufquote > 0, `kreislauf${i}`, `${n}: Die Referenz-Kreislaufquote des Baustoffs muss größer als 0 sein.`);
    const nd = nutzungsdauerVon(z);
    muss(h, istEndlich(nd) && nd > 0, `nd${i}`, `${n}: Die Nutzungsdauer muss größer als 0 sein.`);
    if (nd > 0 && nd < 5) h.push({ stufe: 'warnung', feld: `nd${i}`, text: `${n}: Nutzungsdauer unter 5 Jahren – Eingabe prüfen.` });
  });
  if (e.nrfBeheizt !== undefined) {
    muss(h, istEndlich(e.nrfBeheizt) && e.nrfBeheizt >= 0, 'nrfBeheizt', 'Die beheizte NRF darf nicht negativ sein.');
    if (e.nrfBeheizt > e.nrfR) h.push({ stufe: 'warnung', feld: 'nrfBeheizt', text: 'Die beheizte NRF ist größer als die NRF(R) – Flächenangaben prüfen.' });
  }
  if (e.energie) {
    const en = e.energie;
    muss(h, istEndlich(en.stromGeg, en.pvEigennutzung, en.waerme) && en.stromGeg >= 0 && en.pvEigennutzung >= 0 && en.waerme >= 0, 'energie', 'Endenergie und PV-Eigennutzung dürfen nicht negativ sein.');
    if (en.pvEigennutzung > en.stromGeg) h.push({ stufe: 'warnung', feld: 'pv', text: 'Die PV-Eigennutzung übersteigt den Strombedarf nach GEG; der Überschuss gilt als Export (Modul D2) und mindert B6 nicht.' });
    if (e.nrfR > 0) bereich(h, 'energie', (en.stromGeg + en.waerme) / e.nrfR, 0, 250, 'Endenergie über 250 kWh/(m²·a) – für einen Neubau unüblich, Eingabe (kWh/a) prüfen.');
  }
  if (istEndlich(e.betrachtungszeitraum) && e.betrachtungszeitraum !== BETRACHTUNGSZEITRAUM_QNG) {
    h.push({ stufe: 'warnung', feld: 'betrachtungszeitraum', text: 'QNG verlangt einen Betrachtungszeitraum von 50 Jahren; ein Vergleich mit dem Anforderungswert entfällt.' });
  }
  return h;
}

/** Gebäude-Ökobilanz je m² NRF(R) und Jahr mit A1–A3, B4, B6, C3/C4 und getrennt ausgewiesenem D */
export function lcaBilanz(e: LcaEingabe): LcaErgebnis {
  const hinweise = pruefeLca(e);
  const vorlaeufig: string[] = [];
  const leer: LcaErgebnis = {
    gueltig: false, hinweise, zeilen: [], masse: NaN, a1a3: NaN, a4: NaN, b4: NaN, c3c4: NaN, sockelTga: NaN, b6_1: NaN, b6_3: NaN, b6: NaN, d: NaN, dSockel: NaN,
    biogenGespeichert: NaN, penrtMJ: NaN, spez: SPEZ_NULL, strom: NaN, nutzerstromKWh: NaN, penrtKwhJeM2a: NaN, rueckgewonnen: NaN, kreislaufquoteGebaeude: NaN, umi: NaN,
    enthaeltB4: e.mitB4, enthaeltB6: e.energie !== null, vollstaendig: false, aussage: 'neutral', vorlaeufig,
  };
  if (hatFehler(hinweise)) return leer;

  const T = e.betrachtungszeitraum;
  const zeilen: LcaZeilenErgebnis[] = [];
  let masse = 0, a1a3 = 0, c3c4 = 0, b4 = 0, d = 0, biogen = 0, penrt = 0, rueck = 0, umiSumme = 0;
  for (const z of e.zeilen) {
    const s = z.baustoff;
    const m = s.einheit === 'm³' ? (z.menge * s.rohdichte) / 1000 : z.menge;
    const nd = nutzungsdauerVon(z);
    const n = e.mitB4 ? ersatzzyklen(nd, T) : 0;
    const zA = z.menge * s.gwpA1A3;
    const zC = z.menge * s.gwpC;
    const zB4 = n * (zA + zC);
    const kreislaufMasse = m * (z.kreislaufquote / 100);
    const rueckgewonnen = kreislaufMasse * (z.sortenreinheit / 100);
    // gwpD gilt für den Referenzweg; ein anderer Weg skaliert mit dem Verhältnis der Substitutionsfaktoren (Rangfolge § 6 KrWG)
    const wegFaktor = VERWERTUNGSFAKTOR[z.verwertung] / VERWERTUNGSFAKTOR[s.refVerwertung ?? 'high_grade'];
    const zD = z.menge * s.gwpD * (z.kreislaufquote / s.refKreislaufquote) * (z.sortenreinheit / SORTENREINHEIT_REFERENZ) * wegFaktor;
    masse += m; a1a3 += zA; c3c4 += zC; b4 += zB4; d += zD; rueck += rueckgewonnen;
    if (s.biogen > 0) biogen += z.menge * s.biogen;
    penrt += z.menge * s.penrt;
    umiSumme += m * Math.min(100, Math.round(z.kreislaufquote * 0.7 + z.sortenreinheit * 0.3));
    zeilen.push({ id: s.id, masse: m, nutzungsdauer: nd, ersatz: n, a1a3: zA, c: zC, b4: zB4, d: zD, kreislaufMasse, rueckgewonnen });
    if (s.gwpD !== 0 && !vorlaeufig.includes(QUELLE_VERWERTUNGSFAKTOR) && (z.verwertung !== (s.refVerwertung ?? 'high_grade'))) vorlaeufig.push(QUELLE_VERWERTUNGSFAKTOR);
    const nda = BNB_NUTZUNGSDAUER[s.id];
    if (e.mitB4 && z.nutzungsdauer === undefined && nda?.vorlaeufig && !vorlaeufig.includes(nda.quelle)) vorlaeufig.push(nda.quelle);
  }

  const flaecheJahre = e.nrfR * T;
  const a4 = masse * e.transportDistanz * e.transportFaktor;
  const sockel = TGA_SOCKEL[e.tgaSockel];
  const sockelTga = sockel.gwp * flaecheJahre;
  const dSockel = sockel.gwpD * flaecheJahre;

  let strom = 0, nutzerstromKWh = 0, b6_1 = 0, b6_3 = 0;
  if (e.energie) {
    const en = e.energie;
    const fs = B6_FAKTOREN.netzstrom;
    const fw = B6_FAKTOREN[en.waermeTraeger];
    strom = Math.max(0, en.stromGeg - en.pvEigennutzung);
    nutzerstromKWh = en.nutzerstrom ? NUTZERSTROM_PAUSCHAL * (e.nrfBeheizt ?? e.nrfR) : 0;
    b6_1 = (strom * fs.gwp + en.waerme * fw.gwp) * T;
    b6_3 = nutzerstromKWh * fs.gwp * T;
    if (fs.vorlaeufig) vorlaeufig.push(`${fs.name}: ${fs.quelle}`);
    if (en.waerme > 0 && fw.vorlaeufig) vorlaeufig.push(`${fw.name}: ${fw.quelle}`);
  }
  const b6 = b6_1 + b6_3;

  const konstruktion = a1a3 + b4 + c3c4 + sockelTga;
  const qngSumme = konstruktion + b6;
  const spez = {
    a1a3: a1a3 / flaecheJahre, a4: a4 / flaecheJahre, b4: b4 / flaecheJahre, c3c4: c3c4 / flaecheJahre, sockelTga: sockel.gwp,
    b6: b6 / flaecheJahre, d: (d + dSockel) / flaecheJahre, konstruktion: konstruktion / flaecheJahre, qng: qngSumme / flaecheJahre,
    netto: (qngSumme + d + dSockel) / flaecheJahre,
  };

  const enthaeltB4 = e.mitB4, enthaeltB6 = e.energie !== null;
  const vollstaendig = enthaeltB4 && enthaeltB6 && T === BETRACHTUNGSZEITRAUM_QNG;
  let aussage: LcaAussage = 'neutral';
  if (vollstaendig && e.gebaeudeart === 'wohnbau') {
    aussage = spez.qng <= QNG_WG.premium ? 'premium' : spez.qng <= QNG_WG.plus ? 'plus' : 'ueberschritten';
  }
  if (!enthaeltB4 || !enthaeltB6) {
    hinweise.push({ stufe: 'warnung', feld: 'umfang', text: `Bilanz ohne ${[!enthaeltB4 && 'Ersatz (B4)', !enthaeltB6 && 'Betrieb (B6)'].filter(Boolean).join(' und ')} – kein Vergleich mit dem QNG-Anforderungswert.` });
  }
  if (e.gebaeudeart === 'nichtwohnbau') {
    hinweise.push({ stufe: 'warnung', feld: 'gebaeudeart', text: 'Für Nichtwohngebäude wird der QNG-Anforderungswert projektspezifisch ermittelt (Anhang 3.2.1.2); der Rechner zeigt nur einen Lehrwert.' });
  }

  return {
    gueltig: true, hinweise, zeilen, masse, a1a3, a4, b4, c3c4, sockelTga, b6_1, b6_3, b6, d, dSockel,
    biogenGespeichert: biogen, penrtMJ: penrt, spez, strom, nutzerstromKWh,
    penrtKwhJeM2a: penrt / flaecheJahre / 3.6,
    rueckgewonnen: rueck, kreislaufquoteGebaeude: masse > 0 ? (rueck / masse) * 100 : 0, umi: masse > 0 ? Math.round(umiSumme / masse) : 0,
    enthaeltB4, enthaeltB6, vollstaendig, aussage, vorlaeufig,
  };
}

/**
 * Transportfaktoren des Einzelbaustoff-Rechners (LCA-Grundlagen) [kg CO₂-Äq. je t·km]. Diesel-Lkw und Bahn nach UBA,
 * Güterverkehr 2024 (TREMOD 6.71B, wie A4_FAKTOR_GEBAEUDE): Last- und Sattelzüge 101 g/tkm („Diesel-Lkw 40 t“),
 * Lkw 3,5–7,5 t 561 g/tkm („Diesel-Lkw 7,5 t“), Güterbahnen 14 g/tkm. Vorher: 0,020 / 0,080 / 0,005 (Lehrwerte, um den
 * Faktor 3–7 zu niedrig). Elektro-Lkw (Ökostrom) 0,004 und H₂-Lkw 0,003 bleiben Lehrwerte ohne öffentliche Quelle
 * (vorläufig, F-Freigabe).
 */
export const A4_FAKTOR_EINZEL = { 'lkw-heavy': 0.101, 'lkw-light': 0.561, 'strom-lkw': 0.004, 'h2-lkw': 0.003, zug: 0.014 } as const;
export type TransportEinzel = keyof typeof A4_FAKTOR_EINZEL;

export interface EinzelbaustoffEingabe {
  menge: number;
  volumenbezogen: boolean;
  /** kg/m³ (nur volumenbezogen) */
  rohdichte: number;
  /** kg CO₂-Äq. je Einheit */
  gwpA1A3: number;
  /** MJ je Einheit */
  penrt: number;
  distanz: number;
  transport: TransportEinzel;
}

/** A1–A3 und A4 eines Einzelbaustoffs; Anteile über Beträge (negativer biogener A1–A3-Wert ergibt keine Anteile > 100 %) */
export function einzelbaustoffA1A4(e: EinzelbaustoffEingabe) {
  const hinweise: Hinweis[] = [];
  muss(hinweise, istEndlich(e.menge) && e.menge > 0, 'menge', 'Die Menge muss größer als 0 sein.');
  muss(hinweise, istEndlich(e.distanz) && e.distanz >= 0, 'distanz', 'Die Transportdistanz darf nicht negativ sein.');
  if (hatFehler(hinweise)) return { gueltig: false, hinweise, masse: NaN, gwpA1A3: NaN, gwpA4: NaN, gesamt: NaN, anteilA1A3: NaN, anteilA4: NaN, penrt: NaN, faktor: NaN };
  const masse = e.volumenbezogen ? (e.menge * e.rohdichte) / 1000 : e.menge;
  const faktor = A4_FAKTOR_EINZEL[e.transport];
  const gwpA1A3 = e.gwpA1A3 * e.menge;
  const gwpA4 = masse * e.distanz * faktor;
  const betrag = Math.abs(gwpA1A3) + Math.abs(gwpA4);
  return {
    gueltig: true, hinweise, masse, gwpA1A3, gwpA4, gesamt: gwpA1A3 + gwpA4,
    anteilA1A3: betrag > 0 ? (Math.abs(gwpA1A3) / betrag) * 100 : 0,
    anteilA4: betrag > 0 ? (Math.abs(gwpA4) / betrag) * 100 : 0,
    penrt: e.penrt * e.menge, faktor,
  };
}
