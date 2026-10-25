/**
 * Sommerlicher Wärmeschutz nach DIN 4108-2:2013-02, Abschnitt 8 (Sonneneintragskennwert-Verfahren),
 * auf die § 14 GModG (bis 28.07.2026 GEG) verweist. Reiner Rechenkern – geprüft in tests/sommerWaermeschutz.test.ts.
 *
 * Tabellenwerte (Tab. 6, 7 und 8) nach den Wiedergaben im KALKSANDSTEIN-Planungshandbuch, Kap. 11 (Stand 01/2018)
 * und in der TR Sonnenschutz des Bundesverbands Rollladen + Sonnenschutz (Ausg. April 2024); beide Quellen
 * stimmen bei S1 bis S6 und bei den außenliegenden F_C-Werten überein. Die Neuausgabe DIN 4108-2:2026-05
 * (Abschnitte neu nummeriert) ist nicht eingearbeitet.
 */
import { type Hinweis, istEndlich } from './plausibilitaet';

export type Nutzung = 'wohn' | 'nichtwohn';
export type Klimaregion = 'A' | 'B' | 'C';
export type Bauart = 'leicht' | 'mittel' | 'schwer';
export type Nachtlueftung = 'ohne' | 'erhoeht' | 'hoch';
export type Orientierung = 'N' | 'NO' | 'O' | 'SO' | 'S' | 'SW' | 'W' | 'NW';
/** Verglasung für die Spaltenwahl in Tab. 7: Sonnenschutzglas (g ≤ 0,40) oder Wärmeschutzglas zwei-/dreifach (g > 0,40) */
export type Scheiben = 2 | 3;

export const ORIENTIERUNGEN: readonly Orientierung[] = ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW'];
export const ORIENTIERUNG_NAME: Readonly<Record<Orientierung, string>> = {
  N: 'Nord', NO: 'Nordost', O: 'Ost', SO: 'Südost', S: 'Süd', SW: 'Südwest', W: 'West', NW: 'Nordwest',
};

/** Bezugswert der Innentemperatur je Sommerklimaregion [°C] (DIN 4108-2:2013-02, 8.1 / Tab. 9) */
export const BEZUGSTEMPERATUR: Readonly<Record<Klimaregion, number>> = { A: 25, B: 26, C: 27 };
/** Anforderungswert Übertemperaturgradstunden bei thermischer Simulation [Kh/a] (Tab. 9) */
export const UEBERTEMPERATURGRADSTUNDEN: Readonly<Record<Nutzung, number>> = { wohn: 1200, nichtwohn: 500 };
/** Mindest-Luftwechsel der Nachtlüftung [1/h] (Tab. 8, S1) */
export const NACHTLUEFTUNG_N: Readonly<Record<Nachtlueftung, number>> = { ohne: 0, erhoeht: 2, hoch: 5 };
/** Grenzen der wirksamen Wärmespeicherfähigkeit C_wirk/A_G [Wh/(m²K)]: leicht < 50, mittel 50–130, schwer > 130 */
export const BAUART_GRENZEN = { leichtBis: 50, schwerAb: 130 } as const;

/** S1 nach Tab. 8: [Nutzung][Klimaregion][Nachtlüftung][Bauart] */
export const S1_TABELLE: Readonly<Record<Nutzung, Record<Klimaregion, Record<Nachtlueftung, Record<Bauart, number>>>>> = {
  wohn: {
    A: { ohne: { leicht: 0.071, mittel: 0.080, schwer: 0.087 }, erhoeht: { leicht: 0.098, mittel: 0.114, schwer: 0.125 }, hoch: { leicht: 0.128, mittel: 0.160, schwer: 0.181 } },
    B: { ohne: { leicht: 0.056, mittel: 0.067, schwer: 0.074 }, erhoeht: { leicht: 0.088, mittel: 0.103, schwer: 0.113 }, hoch: { leicht: 0.117, mittel: 0.152, schwer: 0.171 } },
    C: { ohne: { leicht: 0.041, mittel: 0.054, schwer: 0.061 }, erhoeht: { leicht: 0.078, mittel: 0.092, schwer: 0.101 }, hoch: { leicht: 0.105, mittel: 0.143, schwer: 0.160 } },
  },
  nichtwohn: {
    A: { ohne: { leicht: 0.013, mittel: 0.020, schwer: 0.025 }, erhoeht: { leicht: 0.071, mittel: 0.089, schwer: 0.101 }, hoch: { leicht: 0.090, mittel: 0.135, schwer: 0.170 } },
    B: { ohne: { leicht: 0.007, mittel: 0.013, schwer: 0.018 }, erhoeht: { leicht: 0.060, mittel: 0.081, schwer: 0.092 }, hoch: { leicht: 0.082, mittel: 0.124, schwer: 0.158 } },
    C: { ohne: { leicht: 0.000, mittel: 0.006, schwer: 0.011 }, erhoeht: { leicht: 0.048, mittel: 0.072, schwer: 0.083 }, hoch: { leicht: 0.074, mittel: 0.113, schwer: 0.145 } },
  },
};
/** S2 = a − b · f_WG (Tab. 8) */
export const S2_KOEFF: Readonly<Record<Nutzung, { a: number; b: number }>> = { wohn: { a: 0.060, b: 0.231 }, nichtwohn: { a: 0.030, b: 0.115 } };
/** S3: Sonnenschutzglas mit g ≤ 0,40 */
export const S3_SONNENSCHUTZGLAS = 0.03;
/** S4 = −0,035 · f_neig (Fenster mit Neigung 0° bis 60° gegenüber der Horizontalen) */
export const S4_FAKTOR = -0.035;
/** S5 = +0,10 · f_nord (Nord-, Nordost-, Nordwestfenster mit Neigung > 60° sowie dauernd vom Gebäude verschattete Fenster) */
export const S5_FAKTOR = 0.10;
/** S6: passive Kühlung je Bauart */
export const S6_PASSIV: Readonly<Record<Bauart, number>> = { leicht: 0.02, mittel: 0.04, schwer: 0.06 };

export interface SonnenschutzZeile {
  id: string;
  name: string;
  aussen: boolean;
  /** Nur zur Information, nicht für den Nachweis (Tab. 7, Fußnote: geschlossener Sonnenschutz) */
  nurInfo?: boolean;
  /** F_C für [Sonnenschutzglas zweifach g ≤ 0,40, dreifach g > 0,40, zweifach g > 0,40] */
  fc: readonly [number, number, number];
}

/**
 * Anhaltswerte F_C nach DIN 4108-2:2013-02, Tab. 7 (fest installierte Sonnenschutzvorrichtungen).
 * Spaltenzuordnung nach KALKSANDSTEIN-Planungshandbuch; bei innenliegendem Sonnenschutz geben Sekundärquellen
 * die Spalten „zweifach“ und „dreifach“ für g > 0,40 vertauscht wieder – Normtext prüfen.
 */
export const SONNENSCHUTZ: readonly SonnenschutzZeile[] = [
  { id: 'ohne', name: 'Ohne Sonnenschutzvorrichtung', aussen: false, fc: [1.0, 1.0, 1.0] },
  { id: 'innen_weiss', name: 'Innen/zwischen den Scheiben: weiß oder hoch reflektierend, geringe Transparenz', aussen: false, fc: [0.65, 0.70, 0.65] },
  { id: 'innen_hell', name: 'Innen/zwischen den Scheiben: helle Farben oder geringe Transparenz', aussen: false, fc: [0.75, 0.80, 0.75] },
  { id: 'innen_dunkel', name: 'Innen/zwischen den Scheiben: dunkle Farben oder höhere Transparenz', aussen: false, fc: [0.90, 0.90, 0.85] },
  { id: 'rollladen_34', name: 'Außen: Fensterläden, Rollläden, ¾ geschlossen', aussen: true, fc: [0.35, 0.30, 0.30] },
  { id: 'rollladen_zu', name: 'Außen: Fensterläden, Rollläden, geschlossen (nur Information)', aussen: true, nurInfo: true, fc: [0.15, 0.10, 0.10] },
  { id: 'raffstore_45', name: 'Außen: Jalousie/Raffstore, drehbare Lamellen 45°', aussen: true, fc: [0.30, 0.25, 0.25] },
  { id: 'raffstore_10', name: 'Außen: Jalousie/Raffstore, drehbare Lamellen 10° (nur Information)', aussen: true, nurInfo: true, fc: [0.20, 0.15, 0.15] },
  { id: 'markise_parallel', name: 'Außen: Markise parallel zur Verglasung', aussen: true, fc: [0.30, 0.25, 0.25] },
  { id: 'vordach', name: 'Außen: Vordächer, Markisen allgemein, freistehende Lamellen', aussen: true, fc: [0.55, 0.50, 0.50] },
];
export const SONNENSCHUTZ_BY_ID: ReadonlyMap<string, SonnenschutzZeile> = new Map(SONNENSCHUTZ.map(z => [z.id, z]));

/** F_C aus Tab. 7: Spalte nach g und Scheibenzahl */
export function fcAusTabelle(schutzId: string, g: number, scheiben: Scheiben): number {
  const z = SONNENSCHUTZ_BY_ID.get(schutzId);
  if (!z) return NaN;
  if (g <= 0.40) return z.fc[0];
  return scheiben === 3 ? z.fc[1] : z.fc[2];
}

export interface Fenster {
  name?: string;
  /** Fensterfläche A_W [m²] (lichtes Rohbaumaß) */
  A: number;
  /** Gesamtenergiedurchlassgrad der Verglasung g [–] */
  g: number;
  scheiben: Scheiben;
  orientierung: Orientierung;
  /** Neigung gegenüber der Horizontalen [°]: 90 = senkrechtes Fenster, 0 = waagerecht */
  neigung: number;
  /** Sonnenschutz nach Tab. 7 (ID) */
  schutz: string;
  /** Produktspezifischer Abminderungsfaktor; ersetzt den Tabellenwert */
  fcEigen?: number;
  /** Fenster dauernd vom Gebäude selbst verschattet (zählt zu f_nord) */
  verschattet?: boolean;
}

export interface Raum {
  nutzung: Nutzung;
  region: Klimaregion;
  bauart: Bauart;
  nachtlueftung: Nachtlueftung;
  passiveKuehlung: boolean;
  /** Nettogrundfläche A_G [m²] */
  AG: number;
  fenster: readonly Fenster[];
}

export interface FensterErgebnis { name: string; A: number; g: number; fc: number; gtot: number; beitrag: number; geneigt: boolean; nord: boolean; ssg: boolean; aussen: boolean }

export function pruefeRaum(r: Raum): Hinweis[] {
  const h: Hinweis[] = [];
  if (!istEndlich(r.AG) || r.AG <= 0) h.push({ stufe: 'fehler', feld: 'AG', text: 'Die Nettogrundfläche A_G muss größer als 0 sein.' });
  else if (r.AG > 200) h.push({ stufe: 'warnung', feld: 'AG', text: 'A_G über 200 m²: Das Verfahren gilt für einzelne kritische Räume; sehr tiefe Räume nur bis zur dreifachen lichten Raumhöhe ansetzen.' });
  if (!r.fenster.length) h.push({ stufe: 'fehler', feld: 'fenster', text: 'Mindestens ein Fenster ist erforderlich.' });
  r.fenster.forEach((f, i) => {
    const n = f.name || `Fenster ${i + 1}`;
    if (!istEndlich(f.A, f.g, f.neigung)) { h.push({ stufe: 'fehler', feld: `fenster${i}`, text: `${n}: Fläche, g-Wert und Neigung müssen Zahlen sein.` }); return; }
    if (f.A < 0) h.push({ stufe: 'fehler', feld: `fenster${i}`, text: `${n}: Die Fensterfläche darf nicht negativ sein.` });
    if (!(f.g > 0 && f.g <= 1)) h.push({ stufe: 'fehler', feld: `fenster${i}`, text: `${n}: Der g-Wert muss zwischen 0 und 1 liegen.` });
    else if (f.g > 0.87) h.push({ stufe: 'warnung', feld: `fenster${i}`, text: `${n}: g > 0,87 liegt über dem Wert von Einfachglas – Eingabe prüfen.` });
    if (f.neigung < 0 || f.neigung > 90) h.push({ stufe: 'fehler', feld: `fenster${i}`, text: `${n}: Die Neigung muss zwischen 0° und 90° liegen.` });
    if (f.fcEigen !== undefined) {
      if (!(Number.isFinite(f.fcEigen) && f.fcEigen > 0 && f.fcEigen <= 1)) h.push({ stufe: 'fehler', feld: `fenster${i}`, text: `${n}: Der Abminderungsfaktor F_C muss zwischen 0 und 1 liegen.` });
    } else {
      const z = SONNENSCHUTZ_BY_ID.get(f.schutz);
      if (!z) h.push({ stufe: 'fehler', feld: `fenster${i}`, text: `${n}: Unbekannte Sonnenschutzvorrichtung.` });
      else if (z.nurInfo) h.push({ stufe: 'warnung', feld: `fenster${i}`, text: `${n}: F_C für geschlossenen Sonnenschutz dient nach Tab. 7 nur der Information und soll für den Nachweis nicht verwendet werden.` });
      if (f.g <= 0.40 && f.scheiben === 3) h.push({ stufe: 'warnung', feld: `fenster${i}`, text: `${n}: Tab. 7 nennt für Sonnenschutzglas (g ≤ 0,40) nur Werte für Zweifachverglasung; der Rechner verwendet diese Spalte.` });
    }
  });
  return h;
}

/** Sonneneintragskennwert-Verfahren nach DIN 4108-2:2013-02, 8.3, mit Prüfung der Verzichtsregeln nach 8.2.2 */
export function sonneneintrag(r: Raum) {
  const hinweise = pruefeRaum(r);
  const leer = {
    gueltig: false as const, hinweise, fenster: [] as FensterErgebnis[], AW: NaN, fWG: NaN, fNeig: NaN, fNord: NaN, fSSG: NaN,
    Svorh: NaN, S1: NaN, S2: NaN, S3: NaN, S4: NaN, S5: NaN, S6: NaN, Szul: NaN, erfuellt: false,
    verzicht: { grenzeTab6: NaN, tab6: false, wohn35: false, entbehrlich: false },
  };
  if (hinweise.some(x => x.stufe === 'fehler')) return leer;

  const fenster: FensterErgebnis[] = r.fenster.map((f, i) => {
    const fc = f.fcEigen ?? fcAusTabelle(f.schutz, f.g, f.scheiben);
    const gtot = f.g * fc;
    const geneigt = f.neigung <= 60;
    const nord = (!geneigt && (f.orientierung === 'N' || f.orientierung === 'NO' || f.orientierung === 'NW')) || !!f.verschattet;
    const aussen = f.fcEigen === undefined ? !!SONNENSCHUTZ_BY_ID.get(f.schutz)?.aussen : false;
    return { name: f.name || `Fenster ${i + 1}`, A: f.A, g: f.g, fc, gtot, beitrag: f.A * gtot, geneigt, nord, ssg: f.g <= 0.40, aussen };
  });
  const AW = fenster.reduce((s, f) => s + f.A, 0);
  const anteil = (p: (f: FensterErgebnis) => boolean) => (AW > 0 ? fenster.filter(p).reduce((s, f) => s + f.A, 0) / AW : 0);

  const Svorh = fenster.reduce((s, f) => s + f.beitrag, 0) / r.AG;
  const fWG = AW / r.AG;
  const fNeig = anteil(f => f.geneigt);
  const fNord = anteil(f => f.nord);
  const fSSG = anteil(f => f.ssg);

  const S1 = S1_TABELLE[r.nutzung][r.region][r.nachtlueftung][r.bauart];
  const { a, b } = S2_KOEFF[r.nutzung];
  const S2 = a - b * fWG;
  const S3 = S3_SONNENSCHUTZGLAS * fSSG; // flächenanteilig bei unterschiedlichen Verglasungen
  const S4 = fNeig > 0 ? S4_FAKTOR * fNeig : 0; // kein −0 in der Anzeige
  const S5 = S5_FAKTOR * fNord;
  const S6 = r.passiveKuehlung ? S6_PASSIV[r.bauart] : 0;
  const Szul = S1 + S2 + S3 + S4 + S5 + S6;

  // 8.2.2 / Tab. 6: Grenzwert des grundflächenbezogenen Fensterflächenanteils; bei mehreren Orientierungen gilt der kleinere
  const mitFlaeche = r.fenster.map((roh, i) => ({ roh, f: fenster[i] })).filter(p => p.roh.A > 0);
  let grenzeTab6 = 0.15;
  for (const { f, roh } of mitFlaeche) grenzeTab6 = Math.min(grenzeTab6, f.geneigt ? 0.07 : roh.orientierung === 'N' ? 0.15 : 0.10);
  const tab6 = fWG <= grenzeTab6 + 1e-12;
  // 8.2.2: Wohnnutzung, f_WG ≤ 35 %, Ost-, Süd- und Westfenster mit außenliegendem Sonnenschutz F_C ≤ 0,30 (g > 0,40) bzw. ≤ 0,35 (g ≤ 0,40)
  const osw = mitFlaeche.filter(({ roh }) => ['O', 'SO', 'S', 'SW', 'W'].includes(roh.orientierung));
  const wohn35 = r.nutzung === 'wohn' && fWG <= 0.35 + 1e-12 && osw.every(({ f }) => f.aussen && f.fc <= (f.g > 0.40 ? 0.30 : 0.35) + 1e-12);

  if (Szul < 0) hinweise.push({ stufe: 'warnung', feld: 'fenster', text: 'S_zul ist negativ: Der Fensterflächenanteil ist für diese Randbedingungen zu groß; das Verfahren ist hier nicht mehr aussagekräftig.' });
  if (fWG > 0.7) hinweise.push({ stufe: 'warnung', feld: 'fenster', text: 'Fensterflächenanteil über 70 % der Grundfläche: Eine thermische Gebäudesimulation nach 8.4 ist zu empfehlen.' });

  return {
    gueltig: true as const, hinweise, fenster, AW, fWG, fNeig, fNord, fSSG,
    Svorh, S1, S2, S3, S4, S5, S6, Szul, erfuellt: Svorh <= Szul + 1e-12,
    verzicht: { grenzeTab6, tab6, wohn35, entbehrlich: tab6 || wohn35 },
  };
}

/** Einstufung der Bauart aus der wirksamen Wärmespeicherfähigkeit C_wirk/A_G [Wh/(m²K)] */
export function bauartAusCwirk(cwirkProAG: number): Bauart {
  if (cwirkProAG < BAUART_GRENZEN.leichtBis) return 'leicht';
  return cwirkProAG > BAUART_GRENZEN.schwerAb ? 'schwer' : 'mittel';
}
