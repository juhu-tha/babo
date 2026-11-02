# Normen- und Fristen-Folge 02.11.2026

**Stand:** 02.11.2026 · Branch `normen/folge-11-02` (Basis origin/main mit #302, #299, #301)
**Grundlage:** `docs/pruefung/normausgaben-2026-11.md` (Abschnitt 3), `docs/pruefung/rechtsstand-2026-11.md`
**Regel:** Empfehlungen ohne Rückfrage umgesetzt; Normtext und Fachwerte ohne Beleg als „vorläufig, Normprüfung ausstehend“ gekennzeichnet. Quellen nur aus Suchergebnissen abgerufen (02.11.2026). Prüfvermerke und Quiz unverändert.

## 1. Fest verdrahtete Normausgaben

Die Ausgaben stehen jetzt in der Registry (`src/data/centralNormenRegistry.ts`); die Fußzeilen der Module verweisen per ID darauf, statt die Ausgabe erneut fest zu verdrahten. `scripts/qa/check-normen.mjs` gleicht übrige Titelangaben weiter gegen die Registry ab (0 Abweichungen).

| Norm | bisher | neu | Fundstellen | Quelle |
|---|---|---|---|---|
| DIN EN 12390-10 | 2019-02 (fest im Text) | Registry `DIN_EN_12390_10`: 2019-08 | Fußzeilen Korrosion, Schnellkarbonatisierung | [DIN Media 12390-10:2019-08](https://www.dinmedia.de/de/norm/din-en-12390-10/307154009) |
| DIN EN 12390-18 | 2021-09 (Fußzeile und Einleitung) | Registry `DIN_EN_12390_18`: 2025-02 (EN 12390-18:2021+A1:2024) | Fußzeile Lebensdauerbemessung (ID), Einleitung `cEinleitung` (Text) | [DIN Media 12390-18:2025-02](https://www.dinmedia.de/de/norm/din-en-12390-18/384233984) |
| DIN 4226-101/-102 | 2017-08 | Registry `DIN_4226_101`, `DIN_4226_102`: 2025-11 | Fußzeile Sonderbetone (IDs `DIN_EN_12620`, `DIN_4226_101`, `DIN_4226_102`), Gesteine (ID) | [DIN Media 4226-102:2025-11](https://www.dinmedia.de/de/norm/din-4226-102/391976582) |
| DIN EN 12390-12 | 2020-04 | bleibt 2020-04; Registry `DIN_EN_12390_12` mit Hinweis „Entwurf DIN EN 12390-12:2025-11 liegt vor“ | Fußzeilen Korrosion, Schnellkarbonatisierung, Lebensdauerbemessung, Biokohlebeton, Normenausblick (IDs); Hinweis im Text Schnellkarbonatisierung (vorläufig gekennzeichnet) | [DIN Media Entwurf 12390-12](https://www.dinmedia.de/en/draft-standard/din-en-12390-12/395558732) |

**Gleichung (5) DIN EN 12390-18 (A1:2024):** Laut Änderungsvermerk wurde in 9.2 Gleichung (5) angepasst und erläutert. Gleichung (5) ist die Auswertung des Migrationsversuchs (Migrationskoeffizient aus Eindringtiefe, Spannung und Dauer). Der Rechner Lebensdauerbemessung (`src/calc/lebensdauer.ts`) übernimmt $D_{RCM,0}$ als Eingabewert und wertet Gleichung (5) nicht aus; der Rechenkern ist nicht betroffen. Hinweis in der Einleitung des Chloridmodells und in der Registry-Beschreibung ergänzt.

## 2. Modul Normenausblick – Stand November 2026

- Hinweiskasten, Tabellenüberschrift und Inhaltsstand auf „November 2026“ (Schlüssel umbenannt: `standNovember2026Für`, `normenstandNovember2026Deutschland`, `november2026Aktualisiert`).
- DIN 1045-2/A1: Normungsprojekt seit 13.07.2026, noch kein Entwurf (Tabelle „Was gilt wann?“ und Reiter DIN EN 206). Quelle: [DIN-Projekt](https://www.din.de/en/wdc-proj:din21:404330876).
- EC2: Entwurf DIN EN 1992-1-1/NA1:2025-08 und Entwurf DIN EN 1992-1-1/A1:2026-05 in Tabelle und Fußzeile. Quellen: [NA1](https://www.din.de/en/wdc-beuth:din21:392741740), [A1](https://www.din.de/en/getting-involved/standards-committees/nabau/drafts/wdc-beuth:din21:403144094).
- MVV TB 2026/1: notifiziert (TRIS 2026/0349/DE, Stillhaltefrist bis 12.10.2026), Veröffentlichung ausstehend; ob die 2. Eurocode-Generation aufgenommen wird, ist „vorläufig, Normprüfung ausstehend“. Neuer offener Punkt. Quelle: [TRIS](https://technical-regulation-information-system.ec.europa.eu/en/notification/28201).
- Neue Tabelle „Entwürfe und Normungsprojekte (Stand November 2026)“ im Reiter „Was gilt wann?“ mit den weiteren Entwürfen aus dem Bericht: DIN EN 1995-1-1/A1:2026-10, DIN EN 1996-1-1/A1:2026-05 (deutsche Ausgabe der 2. Generation vorläufig), DIN EN 197-1:2026-08, DIN EN 196-1:2026-08, DIN EN 12390-12:2025-11, DIN 4109-1:2026-09. Daten in `content/normenausblick/NormenAusblick.json` (`daten.ENTWUERFE`).
- Quizfragen des Moduls geprüft: keine falsch geworden (Szenarien „Oktober 2026“ bleiben richtig).

## 3. Status DIN 4109-1 / DIN EN 197-1

Unverändert `gueltig` (Empfehlung „nein“ übernommen): Entwürfe ändern die Gültigkeit nicht; `in_ueberarbeitung` würde in Regularien „Übergang neue Fassung“ anzeigen. Als Ratsche in `tests/normenFolge1102.test.ts`.

## 4. Fristen- und Schwellenliste

- **Liste:** `src/data/fristenSchwellen.ts` – 42 Einträge (BauPVO-Inkrafttreten, -Geltung und EAD/ETA-Übergänge, BBodSchV § 4 Abs. 5 > 3000 m², GewAbfV § 8 Abs. 3 (10 m³), § 8 Abs. 1 (zehn Fraktionen), § 6 Abs. 3 (85 %), § 4 Abs. 3 (90 %), GModG-Inkrafttreten, Verkündung und Stufen 2027/2028/2030, EPBD Art. 7 und Umsetzungsfrist, EU-Taxonomie > 5000 m², KI-VO-Termine einschließlich Digital Omnibus und KI-MIG, EBV-Inkrafttreten und Referentenentwurf, GefStoffV-Novelle 2024, Änderung 2025 und § 5a Abs. 2 (Baujahr 1993 bis 1996), KrWG § 14 Abs. 2 (70 %) und Referentenentwurf, REACH Anhang XVII Nr. 77 (06.08.2026; 0,062 bzw. 0,08 mg/m³), Gebäudetyp E Referentenentwurf). Je Eintrag Wert, Einheit, Vorschrift mit Fundstelle, Quelle (URL aus Websuche) und Stand.
- **Abgleich:** `node scripts/qa/fristen-abgleich.mjs [--alle] [--json <datei>]` – durchsucht alle Texte in `content/` und in `src/data/quiz.json` (Frage, richtige Antwort, Erklärung, Distraktor-Rückmeldungen, Lernhilfe ohne `misconception`, normRef). Erkennung über Anker (Vorschrift in der Nähe) und Muster je Eintrag; konkurrierende Einträge (z. B. „in Kraft seit …“ bei BauPVO, EBV, GModG, KI-VO) entscheidet der nächste Anker.
- **Ergebnis:** 135 Angaben erkannt, **0 Abweichungen**, keine Ausnahmen nötig. Eine Breitensuche (alle Datumsangaben bis 120 Zeichen nach einem Vorschriftennamen, die zu keinem Sollwert passen) ergab nur stimmige Nebenangaben (z. B. „bis 28.07.2026 GEG“, „bis 04.12.2024 Anhang II“, Mantelverordnung vom 09.07.2021); keine Korrektur nötig, Quiz unverändert.
- **Ratsche:** `tests/fristenSchwellen.test.ts` – Datenprüfung, Erkennung an Beispielsätzen (richtige und falsche Werte, Monats-/Jahresangaben, Familie „nächster Anker“, Verkündung ≠ Inkrafttreten), 0 Abweichungen, jede Erkennung mit mindestens einer Fundstelle (Ausnahme `KRWG_REFERENTENENTWURF`, in der App ohne Datum) und mindestens 120 erkannte Angaben.

**Grenzen:** Die Erkennung ist heuristisch und deckt nur die Formulierungen ab, die heute in der App stehen; neue Formulierungen können unerkannt bleiben (der Test meldet dann allenfalls einen Eintrag ohne Fundstelle). Modul-TSX (`src/modules`, `src/components`) ist nicht Teil des Abgleichs. Offene Rechtspunkte aus `rechtsstand-2026-11.md` (GewAbfV-Novelle O-1, TRGS 519 O-2, MVV TB 2026/1 O-3) bleiben offen; die GewAbfV-Schwelle 10 m³ ist laut gesetze-im-internet.de unverändert.

## 5. Quellen (abgerufen 02.11.2026, aus Suchergebnissen)

- DIN EN 12390-18:2025-02 (Änderungsvermerk, Gleichung (5)): https://www.dinmedia.de/de/norm/din-en-12390-18/384233984
- DIN 4226-102:2025-11: https://www.dinmedia.de/de/norm/din-4226-102/391976582
- BauPVO, EAD/ETA-Übergang, Inkrafttreten, Geltung: https://www.dibt.de/en/service/faqs/transitional-rules-for-the-eta-route
- BBodSchV § 4 Abs. 5: https://www.gesetze-im-internet.de/bbodschv_2023/__4.html
- GewAbfV (10 m³, 85 %, 90 %, Fraktionen): https://www.ihk.de/karlsruhe/fachthemen/umwelt/abfall/aktuelle-informationen/vorgaben-der-gewerbeabfallverordnung-fuer-abfallerzeuger-5820492
- KrWG § 14: https://www.gesetze-im-internet.de/krwg/__14.html
- EBV-Inkrafttreten: https://www.ihk.de/hannover/hauptnavigation/innovation/umwelt/abfallentsorgung/mantelverordnung-5900314
- EPBD Art. 7: https://gesetze.legal/eu/rl_2024_1275_eu/7 · Umsetzungsfrist: https://www.baunetzwissen.de/heizung/fachwissen/verordnungen-gesetze/eu-gebaeuderichtlinie-epbd-2024-10024986
- EU-Taxonomie 7.1 (> 5000 m²): https://oneclicklca.com/en/resources/articles/eu-taxonomy-for-buildings-construction
- REACH Nr. 77 Grenzwerte: https://www.ihk.de/karlsruhe/fachthemen/umwelt/chemikalien/reach/eu-verschaerft-emissionsgrenzwerte-fuer-formaldehyd-5871244
- GefStoffV § 5a: https://www.gesetze-im-internet.de/gefstoffv_2010/__5a.html
- übrige (GModG, KI-VO, KI-MIG, GefStoffV-Änderung, EBV-/KrWG-Referentenentwürfe, Gebäudetyp E, UBA Formaldehyd): wie `docs/pruefung/rechtsstand-2026-11.md`, Abschnitt 5
