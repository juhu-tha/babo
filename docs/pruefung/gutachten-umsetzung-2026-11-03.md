# Umsetzung Gesamtgutachten 03.11.2026 – Maßnahmen „ohne Prof. Huber umsetzbar“

**Grundlage:** `docs/review/gesamt-2026-11-03.md` (PR #314), Abschnitt 5.1. Branch `umsetzung/gutachten-11-03` ab `origin/main` (#313) mit #314 eingemergt.
**Nicht in diesem PR:** Version 4.5.0/Release, zweite Runde Rechtsquellen (eigener Auftrag), `aria-label` am Seitenleistenschalter (Branch `a11y/tastatur-sr-11-03`), Barrierefreiheitserklärung, ESLint. Prüfvermerke (`src/data/pruefvermerke.ts`) sind nicht geändert. In `src/data/quiz.json` ist nur der Abschnittsverweis der Lernhilfe von `qn_feuchteschutz_2` auf die neue Modulüberschrift nachgeführt („Feuchteschutz & Wasserdampf-Taupunkt“ → „Feuchteschutz & Tauwasser (Glaser-Verfahren)“, Ratsche `tests/umsetzungQuiztext_20261102.test.ts`); Frage, Antworten und Freigabe sind unverändert.

## Übersicht

| Nr. | Maßnahme (Gutachten 5.1) | Ergebnis | Test |
|---|---|---|---|
| 1 | Unbekannte Modul-ID: Hinweis statt Startseite | umgesetzt | `tests/seiteNichtGefunden.test.ts` |
| 2 | Klassengrenzen PFAS, LAGA M 20, EBV zentral mit Quelle | umgesetzt, 7 Textstellen berichtigt | `tests/klassengrenzen.test.ts` |
| 3 | Einheitliche Modultitel | Regel festgelegt, 26 Titel und 22 Überschriften angeglichen | `tests/modultitel.test.ts` |
| 4 | Suche mit Schreibvarianten und Synonymen | umgesetzt, 20 Anfragen unter den ersten 3 | `tests/sucheVarianten.test.ts` |

## 1. „Seite nicht gefunden“

**Vorher:** `/modul/gibtsnicht_xyz` lieferte Status 404, die App zeigte aber ohne Hinweis die Startseite und schrieb die Adresse auf `/` um.

**Jetzt:**
- `src/contexts/TabContext.tsx`: neuer Zustand `nichtGefunden` aus `unbekannteAdresse()` (unbekannte oder abgeschaltete Modul-ID, anderer Pfad als `/` und `/modul/<id>`). Die Adresse bleibt stehen, Zurück/Vor funktioniert, jeder Modulwechsel hebt den Hinweis auf. Groß geschriebene IDs, Aliase, `/modul/<id>.html` und alte Hash-Links gelten weiter als bekannt.
- `src/components/navigation/SeiteNichtGefunden.tsx` (nur bei Bedarf geladen): Überschrift „Seite nicht gefunden“, die aufgerufene Adresse, „Meinten Sie“ mit bis zu 5 ähnlichen Modulen (Buchstabenpaare über ID, Label, Titel; Teilwörter), eigene Modulsuche mit Schreibvarianten (Nr. 4), Links zur Startseite und zur Modulübersicht. h1 und Fenstertitel „Seite nicht gefunden“, `meta robots noindex` solange der Hinweis steht.
- Vercel: `scripts/seite404.mjs` erzeugt `dist/404.html` aus `dist/index.html` (Titel, `noindex`, `<noscript>`-Ersatz mit Links) statt `cp`; `vercel.json` `buildCommand` entsprechend. Die Inline-Skripte bleiben unverändert (CSP-Hashes gleich, Test vergleicht sie); die Startseiten-Schale wird auf der 404-Seite nie eingeblendet (`startschale-boot.js` zeigt sie nur unter `/`).
- Server (`server.ts`): übrige Pfade außer `/` antworten jetzt ebenfalls mit Status 404 (vorher 200 mit der App).
- Vorrendern hell/dunkel/breit unverändert (`startTab` setzt keinen Hinweis); `docs/betrieb-vercel.md` nachgeführt.

## 2. Klassengrenzen

Neue Datei `src/data/klassengrenzen.ts` (Aufbau wie `src/data/fristenSchwellen.ts`, je Grenze Wert, Einheit, Regelwerk, Fundstelle, Quelle, Stand):

| Block | Inhalt | Quelle |
|---|---|---|
| `PFAS_KETTENLAENGE` | kurzkettig: Carbonsäuren bis C7, Sulfonsäuren bis C5 | OECD 2013 / [UBA PFAS-Portal](https://www.umweltbundesamt.de/themen/chemikalien/chemikalien-reach/stoffe-ihre-eigenschaften/stoffgruppen/pfas-portal-start) (wie NS5C-PF-1) |
| `LAGA_M20` | Z 0 uneingeschränkt, Z 1.1/Z 1.2 eingeschränkt offen, Z 2 eingeschränkt mit technischen Sicherungsmaßnahmen, > Z 2 Deponie/Behandlung | LAGA M 20 (2003/2004); Wortlaut nicht frei zugänglich ([umwelt-online, Übersicht](https://umwelt-online.de/recht/abfall/laga/min_00.htm)), Einstufung wie NS5C-RB-1 |
| `EBV_MATERIALKLASSEN` | RC-1…3, BM-0…BM-F3, BG-…, GS-… | [EBV Anlage 1](https://www.gesetze-im-internet.de/ersatzbaustoffv/anlage_1.html) |
| `EBV_MATERIALWERTE` | 33 Materialwerte: RC-1/2/3 (Tab. 1) Leitfähigkeit, Sulfat, PAK15, PAK16, Cr, Cu, V; BM (Tab. 3) Sulfat, PAK16, BM-0* As/Pb/Cd | EBV Anlage 1, abgerufen 03.11.2026 |
| `KLASSEN_AUSSAGEN` | 4 Regeln gegen falsche Einstufungen (PFHxS/Sulfonsäuren kurzkettig, Z 2 = Deponie, Z 0 eingeschränkt, „Einbauklassen“ der EBV) | wie oben |

- Rechenkern: `src/calc/pfas.ts` `istKurzkettig` liest die zentrale Grenze (`pfasIstKurzkettig`).
- Abgleich: `scripts/qa/klassengrenzen-abgleich.mjs` prüft `content/`, `src/data/quiz.json` und Fachtexte in TS-Dateien (Erkennung von `scripts/qa/fristen-abgleich.mjs` wiederverwendet; dort neue Option `nachherFaktor`, Standard unverändert). Ergebnis: 15 Materialwertangaben erkannt, **alle richtig** (u. a. Sulfat 600/1000/3500 mg/l, Cu 110/250 µg/l, LF 2500 µS/cm, BM-0* As 8/Pb 23/Cd 2 µg/l). Ratsche `tests/klassengrenzen.test.ts`: 0 Abweichungen, 0 falsche Einstufungen.
- Kein Wert geändert. Abweichung zwischen Modulen gefunden und behoben (eindeutig): Die EBV kennt **Materialklassen** und Einbauweisen, „Einbauklassen“ ist LAGA-Begriff. Berichtigt in `content/bodenmaterialaufbereitung/BodenMaterialAufbereitung.json`, `content/rueckbau/BaustoffrecyclingTab.json`, `content/rueckbauchecklisten/RueckbauChecklisten.json`, `content/schadstoffe/Schadstoffe.json`, `src/data/tasks/rueckbauTasks.ts` (Titel und Lösung) und `src/components/ui/RechtsrahmenKompendium.tsx`. Dort stand zusätzlich „Rechtlich belastbares Ende der Abfalleigenschaft“ – das widerspricht `content/abfaelle/EbvMantelverordnung.json` („Die EBV regelt das Ende der Abfalleigenschaft nicht; … § 5 Abs. 1 KrWG“); neu: „Bundesweit einheitliche Materialklassen und Einbauweisen für mineralische Ersatzbaustoffe; das Ende der Abfalleigenschaft regelt die EBV nicht.“

**Hinweis für die Rechtsquellen-Runde (nicht geändert):** `RechtsrahmenKompendium.tsx` (EBV, `keyDuties`): „Einbaumengen ab 250 m³ müssen … dokumentiert werden“ – § 22 EBV gilt nur für bestimmte Materialklassen (so in `BaustoffrecyclingTab.json` seit NS5C-RB-2). `src/modules/Abfaelle.tsx` prüft die Anzeigepflicht für `hmva1`/`hmva2`, die Auswahlliste hat diese Werte nicht (toter Zweig).

## 3. Modultitel

**Regel** (`docs/architektur.md`, Abschnitt „Modultitel“; Prüfung `scripts/qa/modultitel.mjs`):
- `label` = Kurzform für Menü, Brotkrumen, Mobil-Kopfleiste, Kacheln, Reiter.
- `baum.titel` = Modultitel für h1, sichtbare Modulüberschrift, Fenstertitel, `<title>`/og:title der vorgerenderten Seite, Volltexttreffer, Lernziel-Querverweise, Modulnamen im Quiz, PDF-Kopf, Modulübersicht.
- Jedes Wort des Labels steht im Titel („Label“, „Label & Zusatz“, „Label (Zusatz)“); die erste h2 im Modul nennt das Modul ebenso. Ausnahmen (Bereichsüberschriften geteilter Komponenten, Modulinfos „Bereich: …“, 4 offene Fälle) stehen mit Grund in `AUSNAHMEN_UEBERSCHRIFT` (Ratsche, höchstens 62).

**Befund vorher:** 20 Titel enthielten das Label nicht, 27 Modulüberschriften nannten das Modul nicht (Build-Stand), dazu Fenstertitel und vorgerenderter `<title>` mit dem Label statt dem Titel, Quiz mit eigenen Modulnamen (143 Abweichungen).

**Geändert:**
- `feuchteschutz`: Menü „Feuchteschutz & Tauwasser“, Titel und Überschrift „Feuchteschutz & Tauwasser (Glaser-Verfahren)“ (vorher drei Namen).
- 26 Titel in `src/registry/modules.ts` (z. B. `abfaelle` „Abfälle & Altlasten (AVV-Katalog)“, `lca_regulatorik` „LCA: Rechtsrahmen, CRREM & Praxis“, `zfp` „Bauwerksdiagnose – ZfP-Simulatoren & DGZfP“, `aufgaben_rueckbau` „Klausurtraining Rückbau & Schadstoffe“, `vdi6200` „Zustandsbewertung (VDI 6200, DIN 1076)“).
- 22 sichtbare Modulüberschriften auf den Titel (Inhaltsdateien unter `content/`, `DynamischerAufgabenGenerator.tsx`, `SchadensforensikSimulator.tsx`).
- Fenstertitel (`App.tsx`), vorgerenderter `<title>`/og:title (`scripts/vorrendern.ts`), PDF-Kopf und SEO-Prüfung nutzen den Titel.
- Quiz: `mitZuordnung` (`src/data/quizModell.ts`) übernimmt Modulname und Sprungzielname aus der Registry, wenn die Frage zu einem Modul gehört; `quiz.json` bleibt unverändert.

**Offen (in der Ausnahmeliste, „offen:“):** `zfp`, `ausbau` (keine eigene Modulüberschrift, erste h2 ist ein Abschnitt), `nawaro`, `aufgaben_kennwerte` (zusammengesetzte Überschrift). Sieben Quiz-Ratschläge (`gapAnalysis.actionableAdvice`) nennen alte Namen im Freitext („im Modul Mineralische Bauprodukte“); nicht geändert, weil das die Quizfreigabe beträfe.

## 4. Suche

`src/utils/suchNormalisierung.ts`, genutzt von Menüsuche (`ModulNavigation.tsx`, jetzt auch über den Modultitel), Volltextsuche (`src/utils/volltextsuche.ts`) und dem 404-Hinweis:
- Umlaute ä/ae, ö/oe, ü/ue, ß/ss gleichwertig; Akzente entfernt.
- Trenn- und Formelzeichen: „w/z-Wert“, „W/Z“, „wz wert“, „f_ck“, „f ck“; Bindestrich- und Leerzeichenvarianten („Glaser Verfahren“ = „Glaserverfahren“ = „Glaser-Verfahren“).
- Plural/Beugung über einfache Endungen ab 6 Zeichen.
- Synonymliste mit 21 Gruppen zentraler Fachbegriffe (w/z, w/b, f_ck, f_cm, f_yk, E-Modul, U-Wert, Glaser/Tauwasser, λ, Karbonatisierung/Carbonatisierung, LCA, GWP, PFAS, EBV, Expositionsklassen, Sieblinie, Ausbreitmaß, Schalldämmmaß, Asbest, Hydratation, Kriechen/Schwinden), je mit Zielmodulen (+10 Punkte, gilt dort als gefunden). Kurzformen unter 4 Zeichen (wz, xc, rw) zählen nur als ganzes Wort.

Test `tests/sucheVarianten.test.ts` mit dem echten Index (`public/suchindex.json`): 20 Anfragen (w/z-Wert, W/Z, Wasserzementwert, wz wert, f_ck, fck, Glaser Verfahren, Glaserverfahren, Tauwasser, Expositionsklassen, Ausbreitmass, Waermeleitfaehigkeit, Carbonatisierung, Emodul, Uwert, Sieblinien, Schalldaemmmass, Ersatzbaustoffverordnung, Oekobilanz, Rueckprallhammer) – das erwartete Modul steht jeweils unter den ersten 3. „w/z-Wert“ findet jetzt `mischungsberechnung` auf Platz 2 (vorher nicht). Der Suchindex selbst ist nicht neu erzeugt.

## QA

| Prüfung | Ergebnis |
|---|---|
| `tsc --noEmit` | rc 0 |
| `npm test` | 192 Testdateien ok |
| `check:formeln` / `check:zahlen` / `check-design` / `check-verwaist --strict` / `check-any` | 4502 Formeln, 0 fehlerhaft / 0 / 0 neu / 0 / 0 |
| `fristen-abgleich` / `klassengrenzen-abgleich` | 140 von 140 / 15 von 15, 0 falsche Einstufungen |
| `BB_STATISCH=1 npm run build`, `node scripts/seite404.mjs`, `check-bundle.mjs --statisch` | rc 0, Bundle-Budget eingehalten |
| `modultitel.mjs` auf `dist` | 0 Label nicht im Titel, 264 Überschriften, 0 ohne Modulnamen (außer Ausnahmeliste) |
| statische Vorschau (Port 4528): `/modul/glaser`, `/foo` | Status 404, Hinweis mit Vorschlag „Feuchteschutz“, Suche „w/z-Wert“ → Mischungsberechnung, Klick öffnet `/modul/feuchteschutz`, Zurück zeigt den Hinweis wieder; kein Konsolenfehler, kein seitliches Scrollen (Desktop, Mobil 390 px, dunkel) |
| `a11y-reiter` (desk, mob, desk-dunkel) | 216 Reiterprüfungen auf 12 Routen (feuchteschutz, abfaelle, lca_regulatorik, dauerhaftigkeit, aufgaben_trainer, aufgaben_komplex, ki_ueberblick, boden_materialaufbereitung, rueckbau, schadstoffe, Startseite, unbekannte Adresse): 0 Verstöße |

Beim Prüfen gefunden und behoben: Die erste Fassung von `seite404.mjs` ersetzte das Wort „<noscript>“ im HTML-Kommentar vor dem Ersatzinhalt; der Kommentar blieb offen und `#root` fehlte. Der Test prüft das jetzt. Hinweis: `scripts/qa/vercel-vorschau.mjs` hält komprimierte Antworten je Datei im Speicher – nach einem neuen Build die Vorschau neu starten.
