/**
 * Zentrale Liste der Fristen und Schwellenwerte aus Rechtsquellen, die in der App genannt werden
 * (Auftrag 02.11.2026, Folge der Rechtsstandsprüfung docs/pruefung/rechtsstand-2026-11.md).
 *
 * Je Eintrag: Wert, Einheit, Vorschrift mit Fundstelle (§/Art.), Quelle (nur aus Websuche abgerufene Seiten) und Stand.
 * Datumswerte stehen als ISO-Datum (JJJJ-MM-TT), Zahlen als Zahl in der Einheit des Eintrags.
 *
 * `erkennung` steuert den Abgleich mit content/ und src/data/quiz.json (scripts/qa/fristen-abgleich.mjs):
 *  - anker:  Vorschrift oder Gegenstand; muss in der Nähe der Angabe stehen (bis 220 Zeichen davor, 200 danach).
 *  - muster: Ausdrücke mit Platzhalter für den Wert – {D} Datum (TT.MM.JJJJ, „1. Januar 2028“, „August 2023“),
 *            {J} Datum oder Jahr, {Z} Zahl, {T} Zeichen ohne Satzende (Abkürzungen und Zahlpunkte zugelassen).
 *  - familie: Einträge derselben Familie konkurrieren um dieselbe Fundstelle; zugeordnet wird der Eintrag, dessen
 *            Anker am nächsten steht (z. B. „in Kraft seit …“ bei BauPVO, EBV, GModG, KI-VO).
 *  - zulaessig: weitere richtige Werte an derselben Stelle (mit Begründung im Kommentar).
 * Einträge ohne `erkennung` sind nur dokumentiert (in der App derzeit ohne erkennbare Wertangabe).
 *
 * Diese Datei ist Referenz für Prüfskript und Test, nicht für die Anzeige. Rechtsberatung ist sie nicht.
 */

export interface FristSchwelle {
  id: string;
  /** Kurzbezeichnung der Vorschrift */
  vorschrift: string;
  /** Fundstelle in der Vorschrift (§, Art., Anhang) */
  fundstelle: string;
  /** Was der Wert bedeutet */
  bezeichnung: string;
  /** ISO-Datum (JJJJ-MM-TT) oder Zahl */
  wert: string | number;
  /** 'Datum' oder Einheit der Zahl */
  einheit: string;
  /** Beleg (Seite aus Suchergebnissen, abgerufen am Stand-Datum) */
  quelle: string;
  /** Stand der Prüfung */
  stand: string;
  /** optional: Hinweis, z. B. Übergangsregel */
  hinweis?: string;
  erkennung?: {
    anker: string;
    muster: string[];
    familie?: string;
    zulaessig?: (string | number)[];
  };
}

const STAND = '2026-11-02';
/** Stand der zweiten Prüfrunde Rechtsquellen (docs/pruefung/rechtsquellen-2026-11-03.md) */
const STAND2 = '2026-11-03';

/** Anker der Vorschriften (gemeinsam genutzt) */
const A = {
  baupvo: String.raw`2024\/3110|BauPVO|Bauprodukte?n?verordnung|CPR 2024`,
  bbodschv: String.raw`BBodSchV|bodenkundliche[nr]? Baubegleitung|DIN 19639`,
  gewabfv: String.raw`GewAbfV|Gewerbeabfallverordnung|Gewerbeabfall`,
  gmodg: String.raw`GModG|Gebäudemodernisierungsgesetz`,
  kivo: String.raw`KI-VO|KI-Verordnung|AI[- ]Act|2024\/1689`,
  omnibus: String.raw`2026\/1744|Digital[- ]Omnibus`,
  kimig: String.raw`KI-MIG|KI-Marktüberwachungs`,
  ebv: String.raw`\bEBV\b|Ersatzbaustoff(?:verordnung|V)|Mantelverordnung`,
  gefstoffv: String.raw`GefStoffV|Gefahrstoffverordnung`,
  krwg: String.raw`KrWG|Kreislaufwirtschaftsgesetz`,
  epbd: String.raw`EPBD|2024\/1275|Gebäuderichtlinie|Gebäudeeffizienzrichtlinie`,
  reach77: String.raw`REACH|Anhang XVII|(?:Eintrag|Nr\.) 77|2023\/1464`,
  gebtyp: String.raw`Gebäudetyp[- ]E`,
} as const;

/** „in Kraft (getreten) seit/am/zum {D}“ bzw. „am {D} in Kraft“ */
const IN_KRAFT = [
  String.raw`in Kraft(?: getreten| gestaffelt)?(?: seit| am| zum| ab)?\s*{D}`,
  String.raw`(?:[Aa]m|[Ss]eit|[Zz]um)\s*{D}(?:(?!verkündet|veröffentlicht|ausgefertigt){T}){0,40}?in Kraft`,
];

export const FRISTEN_SCHWELLEN: readonly FristSchwelle[] = [
  // ---------------------------------------------------------------- Bauprodukteverordnung (EU) 2024/3110
  {
    id: 'BAUPVO_INKRAFT', vorschrift: 'Verordnung (EU) 2024/3110 (BauPVO)', fundstelle: 'Art. 96 (Inkrafttreten und Geltungsbeginn)',
    bezeichnung: 'Inkrafttreten', wert: '2025-01-07', einheit: 'Datum',
    quelle: 'https://www.dibt.de/en/service/faqs/transitional-rules-for-the-eta-route', stand: STAND2,
    hinweis: 'Artikelzuordnung (Art. 94 Aufhebung, Art. 95 Übergang, Art. 96 Inkrafttreten und Geltung) nach https://eurlexa.com/act/en/32024R3110/present/info; vor dem 03.11.2026 hier als Art. 95 Abs. 1 geführt.',
    erkennung: { anker: A.baupvo, muster: IN_KRAFT, familie: 'inkraft' },
  },
  {
    id: 'BAUPVO_GELTUNG', vorschrift: 'Verordnung (EU) 2024/3110 (BauPVO)', fundstelle: 'Art. 96 (Inkrafttreten und Geltungsbeginn; vor dem 03.11.2026 hier als Art. 95 Abs. 2 geführt)',
    bezeichnung: 'Geltungsbeginn (anwendbar ab)', wert: '2026-01-08', einheit: 'Datum',
    quelle: 'https://www.dibt.de/en/service/faqs/transitional-rules-for-the-eta-route', stand: STAND,
    hinweis: 'Für Produkte unter bereits zitierten harmonisierten Normen gilt übergangsweise VO (EU) Nr. 305/2011.',
    erkennung: {
      anker: A.baupvo, familie: 'geltung',
      muster: [
        String.raw`(?:anwendbar|gilt(?: grundsätzlich)?|Geltung|gültig)\s*(?:seit|ab)(?: dem)?\s*{D}`,
        String.raw`(?:[Ss]eit|[Aa]b)(?: dem)?\s*{D}\s*(?:\([^)]*\)\s*)?(?:unmittelbar )?(?:anwendbar|gilt)`,
      ],
    },
  },
  {
    id: 'BAUPVO_EAD_UEBERGANG', vorschrift: 'Verordnung (EU) 2024/3110 (BauPVO)', fundstelle: 'Art. 95 Abs. 4 (Übergangsbestimmungen)',
    bezeichnung: 'nach VO (EU) Nr. 305/2011 zitierte EAD: Ausstellung von ETA bis', wert: '2031-01-09', einheit: 'Datum',
    quelle: 'https://www.dibt.de/en/service/faqs/transitional-rules-for-the-eta-route', stand: STAND,
    erkennung: { anker: String.raw`EAD|Bewertungsdokument`, muster: [String.raw`(?:EAD|Bewertungsdokumente?)\b{T}{0,40}?bis(?: zum)?\s*{D}`] },
  },
  {
    id: 'BAUPVO_ETA_UEBERGANG', vorschrift: 'Verordnung (EU) 2024/3110 (BauPVO)', fundstelle: 'Art. 95 (Übergangsbestimmungen)',
    bezeichnung: 'auf diese EAD gestützte ETA: Leistungserklärung und CE-Kennzeichnung bis', wert: '2036-01-09', einheit: 'Datum',
    quelle: 'https://www.dibt.de/en/service/faqs/transitional-rules-for-the-eta-route', stand: STAND,
    erkennung: { anker: String.raw`ETA|Technische[n]? Bewertung`, muster: [String.raw`\bETA\b{T}{0,40}?bis(?: zum)?\s*{D}`] },
  },

  // ---------------------------------------------------------------- BBodSchV
  {
    id: 'BBODSCHV_BBB_FLAECHE', vorschrift: 'BBodSchV (2023)', fundstelle: '§ 4 Abs. 5',
    bezeichnung: 'Flächenschwelle, ab der die Behörde eine bodenkundliche Baubegleitung nach DIN 19639 verlangen kann (mehr als)',
    wert: 3000, einheit: 'm²',
    quelle: 'https://www.gesetze-im-internet.de/bbodschv_2023/__4.html', stand: STAND,
    erkennung: { anker: A.bbodschv, muster: [String.raw`(?:mehr als|über|>|ab)\s*{Z}\s*m²`] },
  },

  // ---------------------------------------------------------------- GewAbfV
  {
    id: 'GEWABFV_DOKU_10M3', vorschrift: 'GewAbfV', fundstelle: '§ 8 Abs. 3',
    bezeichnung: 'Bau- und Abbruchabfälle: keine Dokumentation der Getrennthaltung bei Maßnahmen bis', wert: 10, einheit: 'm³',
    quelle: 'https://www.ihk.de/karlsruhe/fachthemen/umwelt/abfall/aktuelle-informationen/vorgaben-der-gewerbeabfallverordnung-fuer-abfallerzeuger-5820492', stand: STAND,
    hinweis: 'Stand der GewAbfV-Novelle ungeklärt (docs/pruefung/rechtsstand-2026-11.md, O-1); die Schwelle in § 8 ist laut gesetze-im-internet.de unverändert.',
    erkennung: {
      anker: String.raw`${A.gewabfv}|Getrennthaltung|Getrenntsammlung|§ 8`,
      muster: [
        String.raw`[Dd]okumentation\w*{T}{0,80}?(?:bis|ab|über|mehr als|unter|max\.?|höchstens)\s*{Z}\s*m³`,
        String.raw`(?:bis|ab|über|mehr als|unter|max\.?|höchstens)\s*{Z}\s*m³{T}{0,60}?[Dd]okument`,
      ],
    },
  },
  {
    id: 'GEWABFV_SORTIERQUOTE', vorschrift: 'GewAbfV', fundstelle: '§ 6 Abs. 3',
    bezeichnung: 'Sortierquote der Vorbehandlungsanlage (mindestens)', wert: 85, einheit: '%',
    quelle: 'https://www.ihk.de/karlsruhe/fachthemen/umwelt/abfall/aktuelle-informationen/vorgaben-der-gewerbeabfallverordnung-fuer-abfallerzeuger-5820492', stand: STAND,
    erkennung: { anker: String.raw`${A.gewabfv}|Vorbehandlungsanlage`, muster: [String.raw`Sortierquote{T}{0,40}?{Z}\s*%`] },
  },
  {
    id: 'GEWABFV_GETRENNTSAMMELQUOTE', vorschrift: 'GewAbfV', fundstelle: '§ 4 Abs. 3',
    bezeichnung: 'Getrenntsammlungsquote für gewerbliche Siedlungsabfälle (gilt nicht für Bau- und Abbruchabfälle)', wert: 90, einheit: '%',
    quelle: 'https://www.ihk.de/karlsruhe/fachthemen/umwelt/abfall/aktuelle-informationen/vorgaben-der-gewerbeabfallverordnung-fuer-abfallerzeuger-5820492', stand: STAND,
    erkennung: {
      anker: A.gewabfv,
      muster: [String.raw`{Z}\s*(?:-\s*)?%(?:-\s*)?-?Getrenntsammlungsquote`, String.raw`Getrenntsammlungsquote{T}{0,30}?{Z}\s*%`],
    },
  },
  {
    id: 'GEWABFV_FRAKTIONEN', vorschrift: 'GewAbfV', fundstelle: '§ 8 Abs. 1',
    bezeichnung: 'Zahl der getrennt zu haltenden Fraktionen bei Bau- und Abbruchabfällen', wert: 10, einheit: 'Fraktionen',
    quelle: 'https://www.ihk.de/karlsruhe/fachthemen/umwelt/abfall/aktuelle-informationen/vorgaben-der-gewerbeabfallverordnung-fuer-abfallerzeuger-5820492', stand: STAND,
    hinweis: 'Glas, Kunststoff, Metalle, Holz, Dämmmaterial, Bitumengemische, Baustoffe auf Gipsbasis, Beton, Ziegel, Fliesen und Keramik.',
    erkennung: { anker: String.raw`${A.gewabfv}|§ 8`, muster: [String.raw`(?<w>\d+|acht|neun|zehn|elf|zwölf)\s+(?:Abfall)?[Ff]raktionen`] },
  },

  // ---------------------------------------------------------------- GModG (vormals GEG)
  {
    id: 'GMODG_INKRAFT', vorschrift: 'Gebäudemodernisierungsgesetz (GModG, vormals GEG)', fundstelle: 'Inkrafttreten (BGBl. 2026 I Nr. 226)',
    bezeichnung: 'Inkrafttreten (Art. 1, Umbenennung des GEG)', wert: '2026-07-29', einheit: 'Datum',
    quelle: 'https://www.buzer.de/gesetz/14072/l.htm', stand: STAND,
    erkennung: {
      anker: A.gmodg, familie: 'inkraft',
      muster: [...IN_KRAFT, String.raw`(?:GModG|Gebäudemodernisierungsgesetz)\)?,?\s*(?:seit|ab)\s*{D}`, String.raw`heißt seit\s*{D}`],
    },
  },
  {
    id: 'GMODG_VERKUENDUNG', vorschrift: 'Gebäudemodernisierungsgesetz (GModG, vormals GEG)', fundstelle: 'BGBl. 2026 I Nr. 226',
    bezeichnung: 'Verkündung (bis zu diesem Tag hieß das Gesetz GEG)', wert: '2026-07-28', einheit: 'Datum',
    quelle: 'https://www.buzer.de/gesetz/14072/l.htm', stand: STAND,
    erkennung: {
      anker: A.gmodg,
      muster: [String.raw`verkündet(?: am)?\s*{D}`, String.raw`am\s*{D}\s*verkündet`, String.raw`BGBl\. vom\s*{D}`, String.raw`bis\s*{D}\s*(?:Gebäudeenergiegesetz|GEG)`],
    },
  },
  {
    id: 'GMODG_STUFE_2027', vorschrift: 'Gebäudemodernisierungsgesetz (GModG)', fundstelle: 'Inkrafttreten weiterer Teile (EPBD-Umsetzung)',
    bezeichnung: 'zweite Stufe (u. a. neue Primärenergiefaktoren, DIN/TS 18599, Referenzgebäude)', wert: '2027-01-01', einheit: 'Datum',
    quelle: 'https://www.buzer.de/gesetz/14072/l.htm', stand: STAND,
    erkennung: {
      anker: A.gmodg,
      muster: [String.raw`(?:weitere Teile|EPBD-bezogenen Teile|Teile|Inhalte ändern sich)\s*(?:gelten )?ab\s*{D}`],
    },
  },
  {
    id: 'GMODG_STUFE_2028', vorschrift: 'Gebäudemodernisierungsgesetz (GModG)', fundstelle: 'Art. 3 des Änderungsgesetzes',
    bezeichnung: 'Inkrafttreten Art. 3', wert: '2028-01-01', einheit: 'Datum',
    quelle: 'https://www.buzer.de/gesetz/14072/l.htm', stand: STAND,
  },
  {
    id: 'GMODG_STUFE_2030', vorschrift: 'Gebäudemodernisierungsgesetz (GModG)', fundstelle: 'Art. 4 des Änderungsgesetzes',
    bezeichnung: 'Inkrafttreten Art. 4', wert: '2030-01-01', einheit: 'Datum',
    quelle: 'https://www.buzer.de/gesetz/14072/l.htm', stand: STAND,
  },

  // ---------------------------------------------------------------- EPBD (EU) 2024/1275
  {
    id: 'EPBD_UMSETZUNG', vorschrift: 'Richtlinie (EU) 2024/1275 (EPBD)', fundstelle: 'Art. 35',
    bezeichnung: 'Umsetzungsfrist', wert: '2026-05-29', einheit: 'Datum',
    quelle: 'https://www.baunetzwissen.de/heizung/fachwissen/verordnungen-gesetze/eu-gebaeuderichtlinie-epbd-2024-10024986', stand: STAND,
    erkennung: { anker: A.epbd, muster: [String.raw`(?:Umsetzungsfrist|umzusetzen|Umsetzung)\s*(?:bis(?: zum)?\s*)?{D}`] },
  },
  {
    id: 'EPBD_ZEB_OEFFENTLICH', vorschrift: 'Richtlinie (EU) 2024/1275 (EPBD)', fundstelle: 'Art. 7 Abs. 1 Buchst. a',
    bezeichnung: 'Nullemissionsgebäude: neue Gebäude im Eigentum öffentlicher Einrichtungen ab', wert: '2028-01-01', einheit: 'Datum',
    quelle: 'https://gesetze.legal/eu/rl_2024_1275_eu/7', stand: STAND,
    erkennung: { anker: String.raw`${A.epbd}|Nullemission|ZEB`, muster: [String.raw`öffentliche?n?(?: Gebäude| Einrichtungen| Neubauten)?\)?\s*(?:ab|bis)\s*{J}`] },
  },
  {
    id: 'EPBD_ZEB_ALLE', vorschrift: 'Richtlinie (EU) 2024/1275 (EPBD)', fundstelle: 'Art. 7 Abs. 1 Buchst. b',
    bezeichnung: 'Nullemissionsgebäude: alle neuen Gebäude ab', wert: '2030-01-01', einheit: 'Datum',
    quelle: 'https://gesetze.legal/eu/rl_2024_1275_eu/7', stand: STAND,
    erkennung: { anker: String.raw`Nullemission|ZEB`, familie: 'epbd_alle', muster: [String.raw`alle(?:n)? (?:neuen Gebäude|Neubauten)\s*(?:ab|bis)\s*{J}`, String.raw`(?:ab|bis)\s*{J}\s*\(?(?:für )?alle(?:n)? (?:neuen Gebäude|Neubauten)`] },
  },
  {
    id: 'EPBD_GWP_1000', vorschrift: 'Richtlinie (EU) 2024/1275 (EPBD)', fundstelle: 'Art. 7 Abs. 2 Buchst. a',
    bezeichnung: 'Lebenszyklus-GWP: neue Gebäude mit mehr als 1000 m² Nutzfläche ab', wert: '2028-01-01', einheit: 'Datum',
    quelle: 'https://gesetze.legal/eu/rl_2024_1275_eu/7', stand: STAND,
    erkennung: {
      anker: String.raw`${A.epbd}|Lebenszyklus-GWP|Treibhauspotenzial`,
      muster: [String.raw`(?:ab|seit)\s*{J}{T}{0,30}?(?:>|über|mehr als)\s*1\s?000\s*m²`, String.raw`(?:>|über|mehr als)\s*1\s?000\s*m²(?: Nutzfläche)?\)?\s*(?:ab|seit)\s*{J}`],
    },
  },
  {
    id: 'EPBD_GWP_SCHWELLE', vorschrift: 'Richtlinie (EU) 2024/1275 (EPBD)', fundstelle: 'Art. 7 Abs. 2 Buchst. a',
    bezeichnung: 'Lebenszyklus-GWP bis 2029: Nutzfläche mehr als', wert: 1000, einheit: 'm²',
    quelle: 'https://gesetze.legal/eu/rl_2024_1275_eu/7', stand: STAND,
    erkennung: {
      anker: String.raw`Lebenszyklus-GWP|Lebenszyklus-Treibhaus|GWP|EPBD`,
      muster: [String.raw`(?:Nutzfläche\s*|Neubauten\s*|\()(?:>|über|mehr als)\s*{Z}\s*m²`, String.raw`(?:mehr als|über)\s*{Z}\s*m²\s*Nutzfläche`],
    },
  },
  {
    id: 'EPBD_GWP_ALLE', vorschrift: 'Richtlinie (EU) 2024/1275 (EPBD)', fundstelle: 'Art. 7 Abs. 2 Buchst. b',
    bezeichnung: 'Lebenszyklus-GWP: alle neuen Gebäude ab', wert: '2030-01-01', einheit: 'Datum',
    quelle: 'https://gesetze.legal/eu/rl_2024_1275_eu/7', stand: STAND,
    erkennung: {
      anker: String.raw`Lebenszyklus-GWP|Lebenszyklus-Treibhaus|GWP-Offenlegung`, familie: 'epbd_alle',
      muster: [String.raw`alle(?:n)? (?:neuen Gebäude|Neubauten)\s*(?:ab|bis)\s*{J}`, String.raw`(?:ab|bis)\s*{J}\s*\(?(?:für )?alle(?:n)? (?:neuen Gebäude|Neubauten)`, String.raw`(?:ab|bis)?\s*{J}\s*\(alle(?: Neubauten)?\)`],
    },
  },
  {
    id: 'TAXONOMIE_GWP_5000', vorschrift: 'EU-Taxonomie, Delegierte Verordnung (EU) 2021/2139', fundstelle: 'Anhang I Nr. 7.1 (Neubau, Klimaschutz)',
    bezeichnung: 'Lebenszyklus-GWP zu berechnen und offenzulegen für Gebäude mit mehr als', wert: 5000, einheit: 'm²',
    quelle: 'https://oneclicklca.com/en/resources/articles/eu-taxonomy-for-buildings-construction', stand: STAND,
    erkennung: { anker: String.raw`Taxonomie|2021\/2139|NZEB|Lebenszyklus-GWP|GWP`, muster: [String.raw`Gebäude(?:n)?\s*(?:über|>|mit mehr als)\s*{Z}\s*m²`] },
  },

  // ---------------------------------------------------------------- KI-Verordnung (EU) 2024/1689
  {
    id: 'KIVO_INKRAFT', vorschrift: 'Verordnung (EU) 2024/1689 (KI-VO)', fundstelle: 'Art. 113',
    bezeichnung: 'Inkrafttreten', wert: '2024-08-01', einheit: 'Datum',
    quelle: 'https://www.fgs.de/news-and-insights/blog/detail/eu-ai-act-was-ab-dem-2-august-2026-gilt-und-was-verschoben-wurde', stand: STAND,
    erkennung: { anker: A.kivo, muster: IN_KRAFT, familie: 'inkraft' },
  },
  {
    id: 'KIVO_VERBOTE_KOMPETENZ', vorschrift: 'Verordnung (EU) 2024/1689 (KI-VO)', fundstelle: 'Art. 113 Buchst. a (Kapitel I und II: Art. 4, Art. 5)',
    bezeichnung: 'Verbote und KI-Kompetenz gelten ab', wert: '2025-02-02', einheit: 'Datum',
    quelle: 'https://www.fgs.de/news-and-insights/blog/detail/eu-ai-act-was-ab-dem-2-august-2026-gilt-und-was-verschoben-wurde', stand: STAND,
    erkennung: { anker: A.kivo, familie: 'kivo', muster: [String.raw`(?:Verbote|KI-Kompetenz)(?:\s*\([^)]*\))?{T}{0,40}?(?:seit|ab)\s*{D}`] },
  },
  {
    id: 'KIVO_GPAI', vorschrift: 'Verordnung (EU) 2024/1689 (KI-VO)', fundstelle: 'Art. 113 Buchst. b (Kapitel V)',
    bezeichnung: 'Pflichten für KI-Modelle mit allgemeinem Verwendungszweck ab', wert: '2025-08-02', einheit: 'Datum',
    quelle: 'https://www.fgs.de/news-and-insights/blog/detail/eu-ai-act-was-ab-dem-2-august-2026-gilt-und-was-verschoben-wurde', stand: STAND,
    erkennung: { anker: A.kivo, familie: 'kivo', muster: [String.raw`(?:allgemeinem Verwendungszweck|GPAI)(?:\s*\([^)]*\))?{T}{0,30}?(?:seit|ab)\s*{D}`] },
  },
  {
    id: 'KIVO_ART50', vorschrift: 'Verordnung (EU) 2024/1689 (KI-VO)', fundstelle: 'Art. 50, Art. 113',
    bezeichnung: 'Transparenzpflichten (Art. 50) gelten ab', wert: '2026-08-02', einheit: 'Datum',
    quelle: 'https://www.fgs.de/news-and-insights/blog/detail/eu-ai-act-was-ab-dem-2-august-2026-gilt-und-was-verschoben-wurde', stand: STAND,
    erkennung: {
      anker: String.raw`${A.kivo}|Art\. 50|KI-generiert`, familie: 'kivo',
      muster: [String.raw`Art\.\s*50(?:\s*\([^)]*\))?\s*(?:gilt\s*)?(?:seit|ab)\s*{D}`, String.raw`(?:[Aa]b|[Ss]eit)\s*{D}:\s*Anbieter müssen KI-generierte`],
    },
  },
  {
    id: 'KIVO_ART50_UEBERGANG', vorschrift: 'Verordnung (EU) 2024/1689 (KI-VO), geändert durch VO (EU) 2026/1744', fundstelle: 'Art. 50 Abs. 2 (Übergang)',
    bezeichnung: 'Kennzeichnung KI-generierter Inhalte: Übergangsfrist für vor dem 02.08.2026 in Verkehr gebrachte Systeme bis', wert: '2026-12-02', einheit: 'Datum',
    quelle: 'https://www.ihk.de/ihklw/produkte/beratung-und-service/ecommerce-und-internet/digital-omnibus-verordnung-zur-ki-tritt-in-kraft-7142858', stand: STAND,
    erkennung: { anker: String.raw`${A.kivo}|${A.omnibus}|Art\. 50`, muster: [String.raw`Übergangsfrist bis\s*{D}`] },
  },
  {
    id: 'KIVO_ANHANG_III', vorschrift: 'Verordnung (EU) 2024/1689 (KI-VO), geändert durch VO (EU) 2026/1744', fundstelle: 'Art. 113 (Hochrisiko-Systeme nach Anhang III)',
    bezeichnung: 'Hochrisiko-Pflichten Anhang III ab', wert: '2027-12-02', einheit: 'Datum',
    quelle: 'https://www.ihk.de/ihklw/produkte/beratung-und-service/ecommerce-und-internet/digital-omnibus-verordnung-zur-ki-tritt-in-kraft-7142858', stand: STAND,
    erkennung: { anker: String.raw`${A.kivo}|${A.omnibus}`, familie: 'kivo', muster: [String.raw`Anhang III\s*(?:gelten\s*)?(?:seit|ab)\s*{D}`] },
  },
  {
    id: 'KIVO_ANHANG_I', vorschrift: 'Verordnung (EU) 2024/1689 (KI-VO), geändert durch VO (EU) 2026/1744', fundstelle: 'Art. 113 (Hochrisiko-Systeme nach Anhang I)',
    bezeichnung: 'Hochrisiko-Pflichten Anhang I ab', wert: '2028-08-02', einheit: 'Datum',
    quelle: 'https://www.ihk.de/ihklw/produkte/beratung-und-service/ecommerce-und-internet/digital-omnibus-verordnung-zur-ki-tritt-in-kraft-7142858', stand: STAND,
    erkennung: { anker: String.raw`${A.kivo}|${A.omnibus}`, familie: 'kivo', muster: [String.raw`Anhang I(?![IVX])\s*(?:gelten\s*)?(?:seit|ab)\s*{D}`] },
  },
  {
    id: 'KIVO_OMNIBUS_INKRAFT', vorschrift: 'Verordnung (EU) 2026/1744 (Digital Omnibus zur KI-VO)', fundstelle: 'Inkrafttreten',
    bezeichnung: 'Inkrafttreten', wert: '2026-07-27', einheit: 'Datum',
    quelle: 'https://www.ihk.de/ihklw/produkte/beratung-und-service/ecommerce-und-internet/digital-omnibus-verordnung-zur-ki-tritt-in-kraft-7142858', stand: STAND,
    erkennung: { anker: A.omnibus, muster: IN_KRAFT, familie: 'inkraft' },
  },
  {
    id: 'KIMIG_INKRAFT', vorschrift: 'KI-Marktüberwachungs- und Innovationsförderungsgesetz (KI-MIG)', fundstelle: 'Inkrafttreten',
    bezeichnung: 'Inkrafttreten', wert: '2026-07-29', einheit: 'Datum',
    quelle: 'https://www.ihk.de/ihklw/produkte/beratung-und-service/ecommerce-und-internet/ki-mig-veroeffentlicht-7142702', stand: STAND,
    erkennung: { anker: A.kimig, muster: IN_KRAFT, familie: 'inkraft' },
  },

  // ---------------------------------------------------------------- Ersatzbaustoffverordnung
  {
    id: 'EBV_INKRAFT', vorschrift: 'Ersatzbaustoffverordnung (EBV, Art. 1 der Mantelverordnung)', fundstelle: 'Art. 5 der Mantelverordnung',
    bezeichnung: 'Inkrafttreten', wert: '2023-08-01', einheit: 'Datum',
    quelle: 'https://www.ihk.de/hannover/hauptnavigation/innovation/umwelt/abfallentsorgung/mantelverordnung-5900314', stand: STAND,
    erkennung: {
      anker: A.ebv, familie: 'inkraft',
      muster: [...IN_KRAFT, String.raw`(?:EBV|ErsatzbaustoffV|Ersatzbaustoffverordnung)\)?,?\s*seit\s*{D}`, String.raw`(?:Zustand|bundeseinheitlich)\s*seit\s*{D}`],
    },
  },
  {
    id: 'EBV_REFERENTENENTWURF', vorschrift: 'Ersatzbaustoffverordnung (EBV), Novelle', fundstelle: 'Referentenentwurf BMUKN',
    bezeichnung: 'Datum des Referentenentwurfs', wert: '2026-07-15', einheit: 'Datum',
    quelle: 'https://www.bdew.de/service/novellierung-der-ersatzbaustoff-vo/', stand: STAND,
    erkennung: { anker: A.ebv, familie: 'refe', muster: [String.raw`Referentenentwurf\w*\s*(?:des BMUKN\s*)?(?:vom|seit)\s*{D}`, String.raw`seit\s*{D}\s*als Referentenentwurf`] },
  },

  // ---------------------------------------------------------------- GefStoffV
  {
    id: 'GEFSTOFFV_NOVELLE_2024', vorschrift: 'GefStoffV', fundstelle: 'Novelle 2024 (Änderungsverordnung, Inkrafttreten 05.12.2024)',
    bezeichnung: 'Inkrafttreten der Novelle (u. a. § 5a Veranlasser, § 11a Asbest)', wert: '2024-12-05', einheit: 'Datum',
    quelle: 'https://www.ihk.de/karlsruhe/fachthemen/umwelt/chemikalien/aktuelle-informationen/gefahrstoffe-neugefasste-trgs-521-7062602', stand: STAND,
    // 20.12.2025: Inkrafttreten der Änderungsverordnung (eigener Eintrag GEFSTOFFV_AENDERUNG_2025)
    erkennung: { anker: A.gefstoffv, familie: 'inkraft', muster: [...IN_KRAFT, String.raw`(?:Novelle|GefStoffV)\s*seit\s*{D}`], zulaessig: ['2025-12-20'] },
  },
  {
    id: 'GEFSTOFFV_AENDERUNG_2025', vorschrift: 'GefStoffV', fundstelle: 'Änderungsverordnung vom 17.12.2025 (BGBl. 2025 I Nr. 337), u. a. § 11a Abs. 4a',
    bezeichnung: 'Inkrafttreten der Änderung (Genehmigung für Asbest-Abbrucharbeiten nach § 11a Abs. 4a)', wert: '2025-12-20', einheit: 'Datum',
    quelle: 'https://dserver.bundestag.de/brd/2025/0566-25.pdf', stand: STAND,
    erkennung: { anker: String.raw`§ 11a Abs\. 4a`, muster: [String.raw`§ 11a Abs\. 4a GefStoffV,\s*seit\s*{D}`] },
  },

  {
    id: 'GEFSTOFFV_5A_BAUJAHR_VON', vorschrift: 'GefStoffV', fundstelle: '§ 5a Abs. 2',
    bezeichnung: 'Veranlasser: bei Baujahr 1993 bis 1996 Baubeginn mitteilen (Beginn der Spanne)', wert: 1993, einheit: 'Baujahr',
    quelle: 'https://www.gesetze-im-internet.de/gefstoffv_2010/__5a.html', stand: STAND,
    erkennung: { anker: String.raw`§ 5a|GefStoffV|Veranlasser`, muster: [String.raw`(?:Baujahr|Baubeginn)(?: bzw\. Baubeginn)?\s*{Z}\s*(?:bis|–)\s*\d{4}`] },
  },
  {
    id: 'GEFSTOFFV_5A_BAUJAHR_BIS', vorschrift: 'GefStoffV', fundstelle: '§ 5a Abs. 2',
    bezeichnung: 'Veranlasser: bei Baujahr 1993 bis 1996 Baubeginn mitteilen (Ende der Spanne)', wert: 1996, einheit: 'Baujahr',
    quelle: 'https://www.gesetze-im-internet.de/gefstoffv_2010/__5a.html', stand: STAND,
    erkennung: { anker: String.raw`§ 5a|GefStoffV|Veranlasser`, muster: [String.raw`(?:Baujahr|Baubeginn)(?: bzw\. Baubeginn)?\s*\d{4}\s*(?:bis|–)\s*{Z}`, String.raw`vor 1993 oder nach\s*{Z}`] },
  },

  // ---------------------------------------------------------------- KrWG
  {
    id: 'KRWG_14_BAUABFALL', vorschrift: 'KrWG', fundstelle: '§ 14 Abs. 2',
    bezeichnung: 'Quote Vorbereitung zur Wiederverwendung, Recycling und sonstige stoffliche Verwertung nicht gefährlicher Bau- und Abbruchabfälle (ab 01.01.2020, mindestens)',
    wert: 70, einheit: '%',
    quelle: 'https://www.gesetze-im-internet.de/krwg/__14.html', stand: STAND,
    erkennung: {
      anker: String.raw`${A.krwg}|§ 14`,
      muster: [String.raw`(?:§ 14(?: Abs\. 2)?|KrWG)\s*(?:\(|:)?\s*(?:Ziel\s*)?{Z}\s*%`, String.raw`(?:Ziel|Quote|Verwertungsquote)\s*(?:von\s*)?{Z}\s*%\s*(?:für\s*)?(?:Verwertung von )?Bau- und Abbruch`],
    },
  },
  {
    id: 'KRWG_REFERENTENENTWURF', vorschrift: 'KrWG, Novelle', fundstelle: 'Referentenentwurf BMUKN',
    bezeichnung: 'Datum des Referentenentwurfs', wert: '2026-06-26', einheit: 'Datum',
    quelle: 'https://www.gleisslutz.com/de/know-how/referentenentwurf-zur-novelle-des-kreislaufwirtschaftsgesetzes-neue-recyclingoptionen-schaerfere-vollzugsinstrumente', stand: STAND,
    erkennung: { anker: A.krwg, familie: 'refe', muster: [String.raw`Referentenentwurf\w*\s*(?:des BMUKN\s*)?vom\s*{D}`] },
  },

  // ---------------------------------------------------------------- REACH Anhang XVII Nr. 77 (Formaldehyd)
  {
    id: 'REACH77_GELTUNG', vorschrift: 'REACH, Anhang XVII Eintrag 77 (VO (EU) 2023/1464)', fundstelle: 'Anhang XVII Eintrag 77',
    bezeichnung: 'Formaldehyd-Emissionsgrenzwert gilt ab', wert: '2026-08-06', einheit: 'Datum',
    quelle: 'https://www.umweltbundesamt.de/themen/wirtschaft-konsum/produkte/bauprodukte/studien-zur-messung-vermeidung-bewertung-von/formaldehydemissionen-pruefbedingungen-fuer/faq-zu-regelungen-von-formaldehyd-in', stand: STAND,
    hinweis: 'Für Fahrzeuginnenräume gilt der Grenzwert erst ab 06.08.2027 (48 Monate).',
    erkennung: {
      anker: A.reach77,
      muster: [String.raw`(?:REACH|Eintrag 77|Nr\. 77)(?:\s*\([^)]*\))?\s*(?:begrenzt\s*)?(?:seit|ab)\s*(?:dem\s*)?{D}`, String.raw`(?:[Ss]eit|[Aa]b)\s*(?:dem\s*)?{D}\s*(?:gilt\s*)?EU-weit`],
    },
  },
  {
    id: 'REACH77_HOLZ_MOEBEL', vorschrift: 'REACH, Anhang XVII Eintrag 77 (VO (EU) 2023/1464)', fundstelle: 'Anhang XVII Eintrag 77',
    bezeichnung: 'Grenzwert Formaldehyd in der Prüfkammer für Holzwerkstoffe und Möbel (Fahrzeuginnenräume ab 2027)', wert: 0.062, einheit: 'mg/m³',
    quelle: 'https://www.ihk.de/karlsruhe/fachthemen/umwelt/chemikalien/reach/eu-verschaerft-emissionsgrenzwerte-fuer-formaldehyd-5871244', stand: STAND,
    erkennung: { anker: String.raw`${A.reach77}|Formaldehyd`, muster: [String.raw`{Z}\s*mg\/m³\s*(?:\(?\s*)?für Holzwerkstoffe`, String.raw`Holzwerkstoffe(?: und Möbel)?{T}{0,30}?(?:auf|von|mit)\s*{Z}\s*mg\/m³`] },
  },
  {
    id: 'REACH77_ANDERE', vorschrift: 'REACH, Anhang XVII Eintrag 77 (VO (EU) 2023/1464)', fundstelle: 'Anhang XVII Eintrag 77',
    bezeichnung: 'Grenzwert Formaldehyd in der Prüfkammer für andere Erzeugnisse', wert: 0.08, einheit: 'mg/m³',
    quelle: 'https://www.ihk.de/karlsruhe/fachthemen/umwelt/chemikalien/reach/eu-verschaerft-emissionsgrenzwerte-fuer-formaldehyd-5871244', stand: STAND,
    erkennung: { anker: String.raw`${A.reach77}|Formaldehyd`, muster: [String.raw`{Z}\s*mg\/m³\s*für andere Erzeugnisse`] },
  },

  // ---------------------------------------------------------------- Gebäudetyp E (Vorhaben)
  {
    id: 'GEBTYP_E_REFERENTENENTWURF', vorschrift: 'Gebäudetyp E (Entwurf eines Gesetzes zur Regelung des gesetzlichen Basisstandards im BGB)', fundstelle: 'Referentenentwurf BMJV/BMWSB',
    bezeichnung: 'Datum des Referentenentwurfs (Stellungnahmen bis 09.11.2026)', wert: '2026-10-26', einheit: 'Datum',
    quelle: 'https://www.mtrlegal.com/gebaeudetyp-e-referentenentwurf-zum-basisstandard/', stand: STAND,
    erkennung: { anker: String.raw`${A.gebtyp}|BGB-Bauvertragsrecht|Basisstandard`, familie: 'refe', muster: [String.raw`Referentenentwurf\w*\s*vom\s*{D}`, String.raw`seit\s*{D}\s*in der Anhörung`] },
  },

  // ---------------------------------------------------------------- Zweite Prüfrunde Rechtsquellen 03.11.2026
  {
    id: 'BAUPVO_NB_2030', vorschrift: 'Verordnung (EU) 2024/3110 (BauPVO)', fundstelle: 'Art. 95 Abs. 2',
    bezeichnung: 'Neubewertung und Neubenennung der notifizierten Stellen spätestens bis', wert: '2030-01-08', einheit: 'Datum',
    quelle: 'https://mpgi.gov.hr/UserDocsImages/19641', stand: STAND2,
    hinweis: 'Artikel nach https://eurlexa.com/act/en/32024R3110/present/info (Art. 95 Abs. 2: 08.01.2030).',
    erkennung: { anker: String.raw`${A.baupvo}|Art\. 95`, muster: [String.raw`notifizierte Stellen{T}{0,40}?bis\s*{D}`] },
  },
  {
    id: 'BAUPVO_305_2040', vorschrift: 'Verordnung (EU) 2024/3110 (BauPVO)', fundstelle: 'Art. 94 (Aufhebung der VO (EU) Nr. 305/2011)',
    bezeichnung: 'Aufhebung der für alte harmonisierte Normen fortgeltenden Teile der VO (EU) Nr. 305/2011 spätestens mit Wirkung vom', wert: '2040-01-08', einheit: 'Datum',
    quelle: 'https://mpgi.gov.hr/UserDocsImages/19641', stand: STAND2,
    erkennung: { anker: String.raw`${A.baupvo}|305\/2011|Art\. 94`, muster: [String.raw`305\/2011\s*spätestens bis\s*{D}`, String.raw`gelten noch bis spätestens\s*{D}`] },
  },
  {
    id: 'EBV_ANZEIGE_250', vorschrift: 'Ersatzbaustoffverordnung (EBV)', fundstelle: '§ 22 Abs. 1',
    bezeichnung: 'Voranzeige für RC-3, BM-F3, BG-F3 u. a. ab einem Gesamtvolumen von mindestens', wert: 250, einheit: 'm³',
    quelle: 'https://www.gesetze-im-internet.de/ersatzbaustoffv/__22.html', stand: STAND2,
    hinweis: 'In Wasser- und Heilquellenschutzgebieten mengenunabhängig (§ 22 Abs. 2), außer für die in § 19 Abs. 6 Nr. 1 bis 5 genannten Stoffe.',
    erkennung: {
      anker: String.raw`§ 22|${A.ebv}|Voranzeige|anzeigepflichtig|Anzeigepflicht`,
      muster: [
        String.raw`(?:[Aa]b|≥|mindestens)\s*{Z}\s*m³{T}{0,60}?(?:Voranzeige|anzuzeigen|[Aa]nzeige|vier Wochen|4 Wochen|anzeigepflichtig)`,
        String.raw`(?:Anzeigepflicht\w*|ANZEIGEPFLICHTIG|Voranzeige\w*)\s*(?:nach § 22 EBV\s*)?(?:\(Gesamtvolumen\s*|\(|bei Einbaumengen\s*)?(?:ab|≥)\s*{Z}\s*m³`,
        String.raw`[Dd]ie\s*{Z}\s*m³\s*Bagatellgrenze`,
      ],
    },
  },
  {
    id: 'EBV_VORANZEIGE_FRIST', vorschrift: 'Ersatzbaustoffverordnung (EBV)', fundstelle: '§ 22 Abs. 1 und 2',
    bezeichnung: 'Voranzeige vor Beginn des Einbaus (Wochen)', wert: 4, einheit: 'Wochen',
    quelle: 'https://www.gesetze-im-internet.de/ersatzbaustoffv/__22.html', stand: STAND2,
    hinweis: 'Abschlussanzeige: Ermittlung der eingebauten Mengen innerhalb von zwei Wochen nach Abschluss, Übermittlung unverzüglich (§ 22 Abs. 4).',
    erkennung: {
      anker: String.raw`§ 22|${A.ebv}|Voranzeige`,
      muster: [
        String.raw`Voranzeige\w*\s*(?:mindestens\s*|spätestens\s*)?(?<w>\d+|ein(?:e|er)?|zwei|drei|vier|fünf|sechs|sieben|acht)\s+Wochen\s+vor`,
        String.raw`(?:ab|≥)\s*250\s*m³\s*(?:Voranzeige\s*)?(?<w>\d+|ein(?:e|er)?|zwei|drei|vier|fünf|sechs|sieben|acht)\s+Wochen`,
        String.raw`[Ss]pätestens\s+(?<w>\d+|ein(?:e|er)?|zwei|drei|vier|fünf|sechs|sieben|acht)\s+Wochen\s+vor\s+(?:Bau|Einbau)beginn`,
      ],
    },
  },
  {
    id: 'EBV_SICHERHEITSABSTAND', vorschrift: 'Ersatzbaustoffverordnung (EBV)', fundstelle: '§ 19 Abs. 8',
    bezeichnung: 'Sicherheitsabstand zusätzlich zur grundwasserfreien Sickerstrecke', wert: 0.5, einheit: 'm',
    quelle: 'https://www.gesetze-im-internet.de/ersatzbaustoffv/__19.html', stand: STAND2,
    erkennung: {
      anker: String.raw`§ 19|${A.ebv}|Grundwasserdeckschicht|Sickerstrecke`,
      muster: [String.raw`(?:zuzüglich|\+)\s*{Z}\s*m\s*Sicherheitsabstand`, String.raw`Sicherheitsabstand\s*{Z}\s*m\s*zusätzlich`],
    },
  },
  {
    id: 'EBV_SICKERSTRECKE_GUENSTIG', vorschrift: 'Ersatzbaustoffverordnung (EBV)', fundstelle: '§ 19 Abs. 8',
    bezeichnung: 'günstige Grundwasserdeckschicht: grundwasserfreie Sickerstrecke mehr als', wert: 1, einheit: 'm',
    quelle: 'https://www.gesetze-im-internet.de/ersatzbaustoffv/__19.html', stand: STAND2,
    hinweis: 'Ungünstig: 0,1 bis 1 m (RC-1, BM-0* u. a.) bzw. 0,5 bis 1 m (übrige), jeweils zuzüglich 0,5 m Sicherheitsabstand.',
    erkennung: {
      anker: String.raw`§ 19|${A.ebv}|Grundwasserdeckschicht`,
      muster: [String.raw`Sickerstrecke{T}{0,70}?(?:>|mehr als)\s*{Z}\s*m`, String.raw`günstig\w*\s*(?:bei\s*)?(?:>|mehr als)\s*{Z}\s*m`],
    },
  },
  {
    id: 'EBV_LIEFERSCHEIN_5J', vorschrift: 'Ersatzbaustoffverordnung (EBV)', fundstelle: '§ 25 Abs. 4 Satz 1',
    bezeichnung: 'Aufbewahrung der Lieferscheinkopie durch den Inverkehrbringer (Jahre)', wert: 5, einheit: 'Jahre',
    quelle: 'https://www.gesetze-im-internet.de/ersatzbaustoffv/__25.html', stand: STAND2,
    hinweis: 'Der Grundstückseigentümer bewahrt Deckblatt und Lieferscheine auf, solange der Ersatzbaustoff eingebaut ist (§ 25 Abs. 4 Satz 2).',
    erkennung: { anker: String.raw`§ 25|${A.ebv}|Inverkehrbringer`, muster: [String.raw`Lieferschein\w*\s*(?<w>\d+|ein(?:e|er)?|zwei|drei|vier|fünf|sechs|sieben|acht)\s+Jahre`] },
  },
  {
    id: 'EBV_RC1_SULFAT', vorschrift: 'Ersatzbaustoffverordnung (EBV)', fundstelle: 'Anlage 1 Tabelle 1',
    bezeichnung: 'Materialwert Sulfat im Eluat für RC-1', wert: 600, einheit: 'mg/l',
    quelle: 'https://www.buzer.de/Anlage_1_ErsatzbaustoffV.htm', stand: STAND2,
    erkennung: { anker: String.raw`${A.ebv}|Anlage 1`, muster: [String.raw`RC-1:?\s*≤\s*{Z}\s*mg\/l`] },
  },
  {
    id: 'EBV_RC2_SULFAT', vorschrift: 'Ersatzbaustoffverordnung (EBV)', fundstelle: 'Anlage 1 Tabelle 1',
    bezeichnung: 'Materialwert Sulfat im Eluat für RC-2', wert: 1000, einheit: 'mg/l',
    quelle: 'https://www.buzer.de/Anlage_1_ErsatzbaustoffV.htm', stand: STAND2,
    erkennung: { anker: String.raw`${A.ebv}|Anlage 1`, muster: [String.raw`RC-2:?\s*≤\s*{Z}\s*mg\/l`] },
  },
  {
    id: 'EBV_RC3_SULFAT', vorschrift: 'Ersatzbaustoffverordnung (EBV)', fundstelle: 'Anlage 1 Tabelle 1',
    bezeichnung: 'Materialwert Sulfat im Eluat für RC-3', wert: 3500, einheit: 'mg/l',
    quelle: 'https://www.buzer.de/Anlage_1_ErsatzbaustoffV.htm', stand: STAND2,
    erkennung: { anker: String.raw`${A.ebv}|Anlage 1`, muster: [String.raw`RC-3:?\s*≤\s*{Z}\s*mg\/l`] },
  },
  {
    id: 'EBV_RC1_KUPFER', vorschrift: 'Ersatzbaustoffverordnung (EBV)', fundstelle: 'Anlage 1 Tabelle 1',
    bezeichnung: 'Materialwert Kupfer im Eluat für RC-1', wert: 110, einheit: 'µg/l',
    quelle: 'https://www.buzer.de/Anlage_1_ErsatzbaustoffV.htm', stand: STAND2,
    hinweis: 'RC-2: 250 µg/l, RC-3: 500 µg/l.',
    erkennung: { anker: String.raw`${A.ebv}|Anlage 1|RC-1`, muster: [String.raw`Kupfer\s*\(RC-1:?\s*≤\s*{Z}\s*µg\/l`, String.raw`Cu\s*≤\s*{Z}\s*µg\/l`] },
  },
  {
    id: 'GEFSTOFFV_ASBEST_ANZEIGE', vorschrift: 'GefStoffV', fundstelle: '§ 11a Abs. 4',
    bezeichnung: 'Anzeige von Tätigkeiten mit Asbest spätestens vor Beginn (Wochen)', wert: 1, einheit: 'Wochen',
    quelle: 'https://www.gesetze-im-internet.de/gefstoffv_2010/__11a.html', stand: STAND2,
    erkennung: { anker: String.raw`§ 11a|${A.gefstoffv}|Asbest|TRGS 519`, muster: [String.raw`(?:mindestens|spätestens)\s+(?<w>\d+|ein(?:e|er)?|zwei|drei|vier|fünf|sechs|sieben|acht)\s+Wochen?\s+vor`] },
  },
  {
    id: 'GEFSTOFFV_ASBEST_ZULASSUNG', vorschrift: 'GefStoffV', fundstelle: '§ 11a Abs. 3',
    bezeichnung: 'Zulassung für Tätigkeiten mit Asbest im Bereich hohen Risikos höchstens (Jahre)', wert: 6, einheit: 'Jahre',
    quelle: 'https://www.gesetze-im-internet.de/gefstoffv_2010/__11a.html', stand: STAND2,
    erkennung: { anker: String.raw`§ 11a|${A.gefstoffv}`, muster: [String.raw`Zulassung{T}{0,40}?(?:max\.|maximal|höchstens)\s*(?<w>\d+|ein(?:e|er)?|zwei|drei|vier|fünf|sechs|sieben|acht)\s+Jahre`] },
  },
  {
    id: 'NACHWV_REGISTER_3J', vorschrift: 'Nachweisverordnung (NachwV)', fundstelle: '§ 25 Abs. 1',
    bezeichnung: 'Aufbewahrung der Registerbelege ab Einstellung in das Register (Jahre)', wert: 3, einheit: 'Jahre',
    quelle: 'https://www.gesetze-im-internet.de/nachwv_2007/BJNR229810006.html', stand: STAND2,
    hinweis: 'Der Zulassungsbescheid einer Entsorgungsanlage kann längere Fristen festlegen.',
    erkennung: { anker: String.raw`NachwV|Nachweisverordnung|Registerbelege|Registerpflicht|in das Register`, muster: [String.raw`(?:mindestens|Aufbewahrung von)\s+(?<w>\d+|ein(?:e|er)?|zwei|drei|vier|fünf|sechs|sieben|acht)\s+Jahre`] },
  },
  {
    id: 'NACHWV_KLEINMENGE_2T', vorschrift: 'Nachweisverordnung (NachwV)', fundstelle: '§ 2 Abs. 2',
    bezeichnung: 'Kleinmengen: keine Nachweispflicht für Erzeuger mit jährlich nicht mehr als (t gefährliche Abfälle)', wert: 2, einheit: 't',
    quelle: 'https://www.gesetze-im-internet.de/nachwv_2007/BJNR229810006.html', stand: STAND2,
    hinweis: 'Pflichten zu Übernahmescheinen (§§ 12, 16) bleiben unberührt.',
    erkennung: { anker: String.raw`NachwV|Nachweisverordnung|Entsorgungsnachweis`, muster: [String.raw`Kleinmengen\s*(?:bis|unter|≤)\s*{Z}\s*t`] },
  },
  {
    id: 'TRINKWV_BLEI_FRIST', vorschrift: 'Trinkwasserverordnung (TrinkwV 2023)', fundstelle: '§ 17 Abs. 1',
    bezeichnung: 'Entfernung oder Stilllegung von Trinkwasserleitungen aus Blei bis zum Ablauf des', wert: '2026-01-12', einheit: 'Datum',
    quelle: 'https://www.gesetze-im-internet.de/trinkwv_2023/__17.html', stand: STAND2,
    hinweis: 'Fristverlängerung nach Abs. 2 (Kapazität) und Abs. 3 (höchstens bis 12.01.2036; bei Eigentümerwechsel ein Jahr nach Übergang).',
    erkennung: { anker: String.raw`TrinkwV|Trinkwasserverordnung|Bleileitung|§ 17`, muster: [String.raw`Bleileitungen{T}{0,40}?bis\s*{D}`, String.raw`bis\s*{D}\s*zu entfernen`] },
  },
  {
    id: 'TRINKWV_BLEI_2028', vorschrift: 'Trinkwasserverordnung (TrinkwV 2023)', fundstelle: 'Anlage 2 Teil II (Blei)',
    bezeichnung: 'Absenkung des Grenzwerts für Blei von 10 auf 5 µg/l ab', wert: '2028-01-12', einheit: 'Datum',
    quelle: 'https://www.gesetze-im-internet.de/trinkwv_2023/anlage_2.html', stand: STAND2,
    erkennung: { anker: String.raw`TrinkwV|Trinkwasserverordnung|Blei`, muster: [String.raw`(?:[Aa]b|seit)\s*{D}\s*sinkt der Grenzwert`, String.raw`Grenzwert für Blei sinkt ab\s*{D}`] },
  },
  {
    id: 'TRINKWV_PFAS20_AB', vorschrift: 'Trinkwasserverordnung (TrinkwV 2023)', fundstelle: 'Anlage 2 Teil I (Summe PFAS-20)',
    bezeichnung: 'Grenzwert Summe PFAS-20 (0,1 µg/l) gilt ab', wert: '2026-01-12', einheit: 'Datum',
    quelle: 'https://www.gesetze-im-internet.de/trinkwv_2023/anlage_2.html', stand: STAND2,
    hinweis: 'Werte unterhalb der Bestimmungsgrenze bleiben bei der Summenbildung unberücksichtigt (Bemerkung zu PFAS-20 und PFAS-4).',
    erkennung: { anker: String.raw`TrinkwV|PFAS-20`, muster: [String.raw`PFAS-20{T}{0,40}?ab\s*{D}`] },
  },
  {
    id: 'TRINKWV_PFAS4_AB', vorschrift: 'Trinkwasserverordnung (TrinkwV 2023)', fundstelle: 'Anlage 2 Teil I (Summe PFAS-4)',
    bezeichnung: 'Grenzwert Summe PFAS-4 (0,02 µg/l) gilt ab', wert: '2028-01-12', einheit: 'Datum',
    quelle: 'https://www.gesetze-im-internet.de/trinkwv_2023/anlage_2.html', stand: STAND2,
    erkennung: { anker: String.raw`TrinkwV|PFAS-4`, muster: [String.raw`PFAS-4\s*(?:\([^)]*\)\s*)?{T}{0,40}?ab\s*{D}`] },
  },
];
