/**
 * Zentrale Klassengrenzen aus Fachkonventionen und Regelwerken (Gesamtgutachten 03.11.2026, Abschnitt 5.1;
 * Vorschlag der Nachstichprobe 5c, docs/pruefung/nachstichprobe5c-2026-11-02.md, NS5C-PF-1 und NS5C-RB-1).
 *
 * Geführt werden die Einstufungen, an denen die Nachstichproben Fehler gefunden haben und die keine Rechtsfrist sind
 * (Fristen und Schwellen stehen in ./fristenSchwellen.ts):
 *  - PFAS: Grenze kurz-/langkettig je Säuregruppe (OECD 2013, UBA PFAS-Portal),
 *  - LAGA M 20: Bedeutung der Einbauklassen Z 0 bis Z 2 und „> Z 2“,
 *  - EBV: Materialklassen (Anlage 1) und die in der App genannten Materialwerte (Anlage 1 Tabellen 1 und 3).
 *
 * Je Grenze: Wert, Einheit, Regelwerk mit Fundstelle, Quelle (nur aus Websuche abgerufene Seiten) und Stand.
 * Rechenkerne lesen die Grenzen von hier (src/calc/pfas.ts). Fachtexte in content/ und src/data/quiz.json werden mit
 * scripts/qa/klassengrenzen-abgleich.mjs dagegen geprüft (Ratsche tests/klassengrenzen.test.ts): Zahlenwerte über
 * `erkennung` (gleiches Verfahren wie scripts/qa/fristen-abgleich.mjs), Einstufungen über KLASSEN_AUSSAGEN.
 * Werte nur mit Beleg ändern. Rechtsberatung ist diese Datei nicht.
 */

const STAND = '2026-11-03';

// Quellen (aus Websuche abgerufen am Stand-Datum bzw. in der Nachstichprobe 5c)
const Q = {
  ebvAnlage1: 'https://www.gesetze-im-internet.de/ersatzbaustoffv/anlage_1.html',
  ubaPfas: 'https://www.umweltbundesamt.de/themen/chemikalien/chemikalien-reach/stoffe-ihre-eigenschaften/stoffgruppen/pfas-portal-start',
  lagaM20: 'https://umwelt-online.de/recht/abfall/laga/min_00.htm',
} as const;

/* ------------------------------------------------------------------------------------------------------------------ */
/* PFAS: kurz- und langkettig                                                                                          */
/* ------------------------------------------------------------------------------------------------------------------ */

/**
 * Kurzkettig nach OECD (2013) bzw. UBA (PFAS-Portal): Perfluorcarbonsäuren mit weniger als sieben perfluorierten
 * C-Atomen (PFBA bis PFHpA, Gesamtkette C4–C7), Perfluorsulfonsäuren mit weniger als sechs (PFBS, PFPeS, C4–C5).
 * Angegeben ist die größte Kettenlänge (Zahl der C-Atome des Moleküls), die noch als kurzkettig gilt.
 */
export const PFAS_KETTENLAENGE = {
  carbonsaeureKurzBis: 7,
  sulfonsaeureKurzBis: 5,
  regelwerk: 'OECD (2013), Synthesis Paper on Per- and Polyfluorinated Chemicals; UBA PFAS-Portal',
  quelle: Q.ubaPfas,
  stand: '2026-11-02',
} as const;

/** Kurzkettig nach PFAS_KETTENLAENGE (Säuregruppe 'Sulfonsäure' oder 'Carbonsäure', c = Zahl der C-Atome) */
export function pfasIstKurzkettig(s: { c: number; gruppe: string }): boolean {
  return s.gruppe === 'Sulfonsäure' ? s.c <= PFAS_KETTENLAENGE.sulfonsaeureKurzBis : s.c <= PFAS_KETTENLAENGE.carbonsaeureKurzBis;
}

/* ------------------------------------------------------------------------------------------------------------------ */
/* LAGA M 20: Einbauklassen                                                                                            */
/* ------------------------------------------------------------------------------------------------------------------ */

export interface LagaKlasse {
  klasse: string;
  /** Einbau nach LAGA M 20 */
  einbau: string;
}

/**
 * LAGA M 20 „Anforderungen an die stoffliche Verwertung von mineralischen Reststoffen/Abfällen – Technische Regeln“
 * (Allgemeiner Teil Stand 06.11.2003, Teil II TR Boden Stand 05.11.2004). Mit der EBV (seit 01.08.2023) für
 * Ersatzbaustoffe in technischen Bauwerken abgelöst, in Ausschreibungen und Deponiepraxis weiter gebräuchlich.
 * Der Wortlaut ist nicht frei zugänglich (umwelt-online nur Übersicht, Stand 11/2003); die Einstufung folgt der
 * Nachstichprobe 5c (NS5C-RB-1): Z 2 ist noch Einbau, erst oberhalb von Z 2 wird deponiert oder behandelt.
 */
export const LAGA_M20 = {
  regelwerk: 'LAGA M 20, Allgemeiner Teil (Stand 06.11.2003), Teil II TR Boden (Stand 05.11.2004)',
  quelle: Q.lagaM20,
  stand: STAND,
  klassen: [
    { klasse: 'Z 0', einbau: 'uneingeschränkter Einbau' },
    { klasse: 'Z 1.1', einbau: 'eingeschränkter offener Einbau (hydrogeologisch ungünstige Standorte)' },
    { klasse: 'Z 1.2', einbau: 'eingeschränkter offener Einbau (hydrogeologisch günstige Standorte)' },
    { klasse: 'Z 2', einbau: 'eingeschränkter Einbau mit definierten technischen Sicherungsmaßnahmen' },
    { klasse: '> Z 2', einbau: 'kein Einbau; Deponierung oder Behandlung' },
  ] as readonly LagaKlasse[],
} as const;

/* ------------------------------------------------------------------------------------------------------------------ */
/* EBV: Materialklassen und Materialwerte                                                                              */
/* ------------------------------------------------------------------------------------------------------------------ */

/**
 * Materialklassen der Ersatzbaustoffverordnung (Anlage 1), soweit in der App genannt. Die EBV kennt Materialklassen
 * und Einbauweisen (Anlage 2/3); „Einbauklassen“ ist die Bezeichnung der LAGA M 20.
 */
export const EBV_MATERIALKLASSEN = {
  regelwerk: 'Ersatzbaustoffverordnung (EBV), Anlage 1',
  quelle: Q.ebvAnlage1,
  stand: STAND,
  recycling: ['RC-1', 'RC-2', 'RC-3'],
  boden: ['BM-0', 'BM-0*', 'BM-F0*', 'BM-F1', 'BM-F2', 'BM-F3'],
  baggergut: ['BG-0', 'BG-0*', 'BG-F0*', 'BG-F1', 'BG-F2', 'BG-F3'],
  gleisschotter: ['GS-0', 'GS-1', 'GS-2', 'GS-3'],
} as const;

export interface Klassengrenze {
  id: string;
  /** Regelwerk (für den Abgleich wie ./fristenSchwellen.ts „vorschrift“) */
  vorschrift: string;
  fundstelle: string;
  /** Materialklasse */
  klasse: string;
  bezeichnung: string;
  wert: number;
  einheit: string;
  quelle: string;
  stand: string;
  hinweis?: string;
  erkennung?: { anker: string; muster: string[]; familie?: string; zulaessig?: number[] };
}

/** Klassenname als Regex (RC-1 → „RC-1“, „RC 1“; BM-0* mit Stern) */
const kl = (k: string) => k.replace('-', '[- ]?').replace('*', String.raw`\*`);
/** Parameteranker */
const P = {
  sulfat: String.raw`Sulfat|SO4|SO₄`,
  leitf: String.raw`Leitfähigkeit|elektr\. LF`,
  pak16: String.raw`PAK ?16`,
  pak15: String.raw`PAK ?15`,
  chrom: String.raw`Chrom|\bCr\b`,
  kupfer: String.raw`Kupfer|\bCu\b`,
  vanadium: String.raw`Vanadium|\bV\b`,
  arsen: String.raw`Arsen|\bAs\b`,
  blei: String.raw`Blei|\bPb\b`,
  cadmium: String.raw`Cadmium|\bCd\b`,
};

/**
 * Ein Materialwert: Muster „<Klasse>[:] ≤ <Zahl> <Einheit>“ in der Nähe des Parameters (Familie = Klasse + Einheit:
 * bei mehreren Parametern derselben Einheit gilt der nächste Anker) und „<Parameter> ≤ <Zahl> <Einheit>“ in der Nähe
 * der Klasse (Familie = Parameter + Einheit).
 */
function mw(tab: '1' | '3', klasse: string, param: keyof typeof P, name: string, wert: number, einheit: string, hinweis?: string): Klassengrenze[] {
  const e = einheit.replace('/', String.raw`\/`);
  const klRe = String.raw`(?<![\w-])${kl(klasse)}(?![\w*])`;
  const basis = {
    vorschrift: 'Ersatzbaustoffverordnung (EBV)', fundstelle: `Anlage 1 Tabelle ${tab}`, klasse,
    bezeichnung: `Materialwert ${name} ${klasse}`, wert, einheit, quelle: Q.ebvAnlage1, stand: STAND, ...(hinweis ? { hinweis } : {}),
  };
  const id = `EBV_${klasse.replace(/[-*]/g, m => (m === '*' ? 'S' : ''))}_${param.toUpperCase()}`;
  return [
    // „Sulfat (RC-1: ≤ 600 mg/l, RC-2: ≤ 1000 mg/l)“
    { id, ...basis, erkennung: { anker: P[param], muster: [String.raw`${klRe}\s*:?\s*(?:≤|<=)\s*{Z}\s*${e}`], familie: `${klasse}|${einheit}` } },
    // „BM-0*: Arsen ≤ 8 µg/l“
    { id: `${id}_P`, ...basis, erkennung: { anker: klRe, muster: [String.raw`(?:${P[param]})\s*(?:ges\.|gesamt)?\s*:?\s*(?:≤|<=)\s*{Z}\s*${e}`], familie: `${param}|${einheit}` } },
  ];
}

/** Materialwerte, wie sie in der App genannt werden (EBV Anlage 1, abgerufen am Stand-Datum) */
export const EBV_MATERIALWERTE: readonly Klassengrenze[] = ([
  // Tabelle 1: Recycling-Baustoffe (Eluat, PAK16 im Feststoff)
  mw('1', 'RC-1', 'leitf', 'elektrische Leitfähigkeit', 2500, 'µS/cm', 'stoffspezifischer Orientierungswert'),
  mw('1', 'RC-2', 'leitf', 'elektrische Leitfähigkeit', 3200, 'µS/cm', 'stoffspezifischer Orientierungswert'),
  mw('1', 'RC-3', 'leitf', 'elektrische Leitfähigkeit', 10000, 'µS/cm', 'stoffspezifischer Orientierungswert'),
  mw('1', 'RC-1', 'sulfat', 'Sulfat', 600, 'mg/l'),
  mw('1', 'RC-2', 'sulfat', 'Sulfat', 1000, 'mg/l'),
  mw('1', 'RC-3', 'sulfat', 'Sulfat', 3500, 'mg/l'),
  mw('1', 'RC-1', 'pak15', 'PAK15', 4, 'µg/l'),
  mw('1', 'RC-2', 'pak15', 'PAK15', 8, 'µg/l'),
  mw('1', 'RC-3', 'pak15', 'PAK15', 25, 'µg/l'),
  mw('1', 'RC-1', 'pak16', 'PAK16 (Feststoff)', 10, 'mg/kg'),
  mw('1', 'RC-2', 'pak16', 'PAK16 (Feststoff)', 15, 'mg/kg'),
  mw('1', 'RC-3', 'pak16', 'PAK16 (Feststoff)', 20, 'mg/kg'),
  mw('1', 'RC-1', 'chrom', 'Chrom, gesamt', 150, 'µg/l'),
  mw('1', 'RC-2', 'chrom', 'Chrom, gesamt', 440, 'µg/l'),
  mw('1', 'RC-3', 'chrom', 'Chrom, gesamt', 900, 'µg/l'),
  mw('1', 'RC-1', 'kupfer', 'Kupfer', 110, 'µg/l'),
  mw('1', 'RC-2', 'kupfer', 'Kupfer', 250, 'µg/l'),
  mw('1', 'RC-3', 'kupfer', 'Kupfer', 500, 'µg/l'),
  mw('1', 'RC-1', 'vanadium', 'Vanadium', 120, 'µg/l'),
  mw('1', 'RC-2', 'vanadium', 'Vanadium', 700, 'µg/l'),
  mw('1', 'RC-3', 'vanadium', 'Vanadium', 1350, 'µg/l'),
  // Tabelle 3: Bodenmaterial (Auswahl)
  mw('3', 'BM-0', 'sulfat', 'Sulfat', 250, 'mg/l', 'Überschreitung: Ursache prüfen (Fußnote 5)'),
  mw('3', 'BM-0*', 'sulfat', 'Sulfat', 250, 'mg/l', 'Überschreitung: Ursache prüfen (Fußnote 5)'),
  mw('3', 'BM-F0*', 'sulfat', 'Sulfat', 250, 'mg/l'),
  mw('3', 'BM-F1', 'sulfat', 'Sulfat', 450, 'mg/l'),
  mw('3', 'BM-F2', 'sulfat', 'Sulfat', 450, 'mg/l'),
  mw('3', 'BM-F3', 'sulfat', 'Sulfat', 1000, 'mg/l'),
  mw('3', 'BM-0', 'pak16', 'PAK16 (Feststoff)', 3, 'mg/kg'),
  mw('3', 'BM-0*', 'pak16', 'PAK16 (Feststoff)', 6, 'mg/kg'),
  mw('3', 'BM-F3', 'pak16', 'PAK16 (Feststoff)', 30, 'mg/kg'),
  mw('3', 'BM-0*', 'arsen', 'Arsen (Eluat)', 8, 'µg/l', 'bei TOC ≥ 0,5 %: 13 µg/l'),
  mw('3', 'BM-0*', 'blei', 'Blei (Eluat)', 23, 'µg/l', 'bei TOC ≥ 0,5 %: 43 µg/l'),
  mw('3', 'BM-0*', 'cadmium', 'Cadmium (Eluat)', 2, 'µg/l', 'bei TOC ≥ 0,5 %: 4 µg/l'),
] as Klassengrenze[][]).flat();

/* ------------------------------------------------------------------------------------------------------------------ */
/* Einstufungen im Text                                                                                                */
/* ------------------------------------------------------------------------------------------------------------------ */

export interface KlassenAussage {
  id: string;
  /** falsche Einstufung (Regex, Groß-/Kleinschreibung egal) */
  falsch: string;
  /** richtige Einstufung nach der zentralen Grenze */
  richtig: string;
  quelle: string;
}

/**
 * Falsche Einstufungen, die im Text nicht (wieder) vorkommen dürfen (Abgleich scripts/qa/klassengrenzen-abgleich.mjs).
 * Die Muster sind eng gefasst und an den Befunden der Nachstichproben ausgerichtet.
 */
export const KLASSEN_AUSSAGEN: readonly KlassenAussage[] = [
  {
    id: 'PFAS_SULFON_KURZ',
    falsch: String.raw`kurzkettig[^.;]{0,80}?(?:Sulfonsäuren?|PFSA)[^.;]{0,20}?C ?4 ?[–-] ?C ?[67]\b|kurzkettig[^.;()]{0,40}?\(C ?4 ?[–-] ?C ?7\)|(?:PFHxS|PFHpS)[^.;]{0,40}?\bkurzkettig`,
    richtig: `kurzkettig: Carbonsäuren C4–C${PFAS_KETTENLAENGE.carbonsaeureKurzBis}, Sulfonsäuren C4–C${PFAS_KETTENLAENGE.sulfonsaeureKurzBis}; PFHxS und PFHpS sind langkettig`,
    quelle: Q.ubaPfas,
  },
  {
    id: 'LAGA_Z2_DEPONIE',
    falsch: String.raw`(?<![>≥]\s?|oberhalb (?:von )?|über |ab )\bZ ?2\b\s*(?:=|:|\()?\s*(?:deponie|deponierungs|Deponierung)`,
    richtig: 'Z 2 = eingeschränkter Einbau mit definierten technischen Sicherungsmaßnahmen; deponiert oder behandelt wird erst oberhalb von Z 2',
    quelle: Q.lagaM20,
  },
  {
    id: 'LAGA_Z0_EINGESCHRAENKT',
    falsch: String.raw`\bZ ?0\b(?!\*)\s*(?:=|:|\()?\s*eingeschränkt`,
    richtig: 'Z 0 = uneingeschränkter Einbau',
    quelle: Q.lagaM20,
  },
  {
    id: 'EBV_EINBAUKLASSEN',
    falsch: String.raw`\bEinbauklassen?\b[^.;]{0,40}?(?:\bEBV\b|Ersatzbaustoff(?:V|verordnung))|(?:\bEBV\b|Ersatzbaustoff(?:V|verordnung))[^.;]{0,40}?\bEinbauklassen?\b|\bEinbauklassen?\b[^.;]{0,30}?(?:RC-[123]|BM-[0F])`,
    richtig: 'Die EBV ordnet Ersatzbaustoffe Materialklassen zu (Anlage 1); zulässig sind die Einbauweisen nach Anlage 2/3. „Einbauklassen“ (Z 0 bis Z 2) ist LAGA M 20',
    quelle: Q.ebvAnlage1,
  },
];
