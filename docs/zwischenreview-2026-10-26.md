# Zwischen-Review 26.10.2026: Stand und offene Arbeitspakete

Stand: `origin/main` @ `99b9152f` (nach #153, #154, #155). Ziel laut Umsetzungsplan „sehr gut“: Note 1,0–1,3 in den sechs Kategorien Recht, Bedienung/Barrierefreiheit, Rechner, Didaktik, Technik, Profil. Dieses Dokument trennt, was belegt erledigt ist, von dem, was noch fehlt, und schneidet den Rest in parallel bearbeitbare Pakete.

Hinweis zur Grundlage: Der Umsetzungsplan selbst (Gate-Definitionen G0–G6) liegt nicht im Repository. Die Zielwerte unten stammen aus `docs/performance.md`, den Ratschen in `tests/` und `scripts/qa/` sowie den Kommentaren im Code. Die Notenschätzung je Kategorie ist eine Einschätzung aus diesen Messwerten, keine Bewertung durch Prof. Huber.

## 1. Messwerte heute

Alle Prüfungen lokal auf `99b9152f` ausgeführt (Build mit `vite build`, Vorschau auf Port 4190). Die CI (`QA`) ist auf diesem Stand grün.

| Prüfung | Ergebnis | Ziel / Grenze | Status |
|---|---|---|---|
| `npm test` (63 Testdateien) | alle bestanden | 0 Fehler | ✓ |
| `check-any.mjs` | 0 explizite `any` | 0 | ✓ |
| `check-katex.mjs` | 4 133 Formeln, 0 fehlerhaft | 0 | ✓ |
| `check-quellen.mjs` | 613 Dateien, 0 Verstöße | 0 | ✓ |
| `check-normen.mjs` | 212 Normen in Fußzeilen, 51 in der Registry, 0 Abweichungen | 0 | ✓ |
| `check:zahlen` (4 Skripte) | 0 Verstöße | 0 | ✓ |
| `check-verwaist.mjs` | 0 verwaist; 6 Dateien nur von tests/scripts genutzt (u. a. `src/data/quizData.ts`, `src/lib/katexBedarf.tsx`) | 0 verwaist | ✓ |
| `check-bundle.mjs` | Einstieg 101,8 kB gzip, größter Chunk `shapes` 247,7 kB gzip | ≤ 108 kB / ≤ 300 kB | ✓ |
| `e2e-smoke.mjs` | 6/6 Cluster-Routen ok (h1, Lernziele, Selbsttest, keine Seitenfehler) | 6/6 | ✓ |
| `a11y.mjs --vergleich --teil 3/10` (Stichprobe) | 70 Prüfungen (desk 30, mob 30, desk-dunkel 10 Routen), 0 Verstöße | Baseline 0 Verstöße auf allen Routen (`docs/a11y-baseline.json`, 24.10.) | ✓ |
| Konsolenlauf (eigenes Skript, alle Registry-Routen, Desktop) | 295 Routen: 0 Seitenfehler, 0 echte Konsolenfehler (einziger Fehler je Route: `POST /api/analytics/visit` 404, weil `vite preview` keinen Express-Server hat); 4 KaTeX-Warnungen im Strict-Modus: `stahl` („²“), `nachbehandlung` („ä“ im Mathemodus), `mechanische_kenngroessen` („‰“), `ki_recht_ethik` („€“) | 0 Fehler | ✓ (4 Warnungen) |
| Mobil-Layout | Baseline 0 seitlich / 0 abgeschnitten / 0 kleine Ziele (`docs/layout-mobil.json`); lokal nicht neu gemessen, CI-Lauf `a11y.yml` | 0 | ✓ (Baseline) |
| Ladezeit (`docs/performance.md`, „Fast 3G“, 4× CPU) | Start LCP 2,06 s; Fachmodule LCP 3,36–3,75 s; CLS 0; Klick < 100 ms | LCP < 2,5 s, CLS < 0,1, TBT < 200 ms | Start ✓, Fachmodule ✗ |
| Quiz (`tests/quiz.test.ts`) | 1 240 Fragen, 203 Module, 2 Module < 5 Fragen; richtige Antwort am längsten 6,9 %; Längenverhältnis > 1,2: 26; Absolutwörter: 10 | Kommentar AP 3.3: ≤ 30 % / 0 / ≤ 5 | 1. Wert ✓, 2. und 3. ✗ |
| Quiz-Freigabe | 26 von 1 240 `verified: true`; 1 218 mit `vorpruefung` | alle freigegeben | ✗ (Prof. Huber) |
| Prüfvermerke (`src/data/pruefvermerke.ts`) | 1 `geprueft`, 191 `offen` | alle geprüft | ✗ (Prof. Huber) |
| Lernziele / Kurzfassungen (#155) | 189/189 Fachmodule; 29 Kurzfassungen (alle Module > 3 000 Wörter) | 100 % | ✓ |
| Rechner-Kerne `src/calc/` | 26 Kerne, 24 mit Test (`plausibilitaet`, `stabilitaet` nur indirekt) | Kern + Test je Rechner | teilweise |

### Abweichungen in `scripts/qa/metriken.mjs`

`docs/metriken.json` steht noch auf dem 23.10. Ein Neulauf zeigt drei Messfehler des Skripts, nicht der App:

- `einstieg_gzip_kB` = 3 516: zählt alle in `index.html` vorgeladenen Chunks; `check-bundle.mjs` misst richtig 101,8 kB.
- `mit_Lernzielen` = 1: sucht die Komponente in den Moduldateien, die Lernziele kommen seit AP 3.x aber aus `src/data/lernziele.ts` (Abdeckung 100 % laut `tests/lernziele.test.ts`).
- `quiz_absolutwoerter_distraktoren` = 76: anderer regulärer Ausdruck als `tests/quiz.test.ts` (dort 10; das Skript zählt auch „jede/alle“).

## 2. Befunde je Kategorie

### Recht
- **Barrierefreiheitserklärung veraltet** (`src/modules/Barrierefreiheit.tsx`, Stand 23.10.): Sie listet als Mängel u. a. den fehlenden Sprunglink (existiert, `App.tsx` „Zum Inhalt springen“), nicht mitgeteilte Menüzustände (`aria-expanded` in `ModulNavigation`), Abschneiden unter 400 px und Ziele < 24 px (Baseline jetzt 0) sowie „Suche findet nur Menüeinträge“ (Volltextsuche seit `tests/volltextsuche.test.ts`). Grundlage „13 repräsentative Seiten“ ist überholt: axe läuft auf allen Routen in drei Modi.
- **Datenschutzerklärung** (`src/modules/Datenschutz.tsx`) deckt alle Server-Endpunkte ab (Analytik/Besuchszähler, Gemini, Live-Abstimmungen `bb_voter`, Kurzfragebogen `bb_kurzfragebogen`, Feedback per E-Mail) und zieht die Speichertabelle aus `src/data/speicherRegister.ts` (Test hält sie vollständig). Offen bleibt nur die Abstimmung mit dem Datenschutzbeauftragten der THA (Kommentar Zeile 6).
- **Impressum/Lizenz**: Urheberrechtsabsatz verlangt noch „schriftliche Zustimmung des Autors“, solange `LIZENZ_AKTIV = false` (`src/data/lizenz.ts`). Die Klärung Rechteinhaber/ORCID (`docs/lizenz-ablauf.md`, Abschnitt A) liegt bei Prof. Huber.
- **Gemini-Modell-ID** `gemini-3.8-flash` in `server.ts:320` ist laut `docs/AUDIT_ABSCHLUSS_2026-10.md` weiterhin „prüfen“.
- Offene Normtext-Fragen aus `docs/fachklaerung-2026-10-26.md` (DIN 18533-1:2026-06, DIN 1045-2 Tabellennummer, GModG-Wortlautvergleich, DIN 4108-2:2026-05).

### Bedienung / Barrierefreiheit
- **AP 2.8 Reiter vereinheitlichen**: 52 von 239 Routen nutzen `ModuleTabs`/`GruppierteModuleTabs`. 100 Moduldateien bauen ihre Reiterleiste selbst (`activeTab` + `aria-pressed`, ohne `role="tablist"`, ohne Pfeiltastensteuerung, ohne Direktlink auf den Reiter). Liste in Anhang A.
- **Link als Schaltfläche**: `src/modules/LCA.tsx:1314` `<a href="#transportbeton-excel">` mit `preventDefault` löst einen Excel-Export aus; das Ziel ist keine Route. Sollte `<button>` sein.
- **Diagramme ohne Textalternative**: 24 Dateien mit Chart.js-Diagrammen (`<Line>`, `<Bar>` …) ohne `aria-label`, `figcaption` oder `sr-only`-Text (grobe Suche). Die Erklärung nennt das selbst als Mangel.
- **Konsolenausgaben in Produktion**: siehe Technik.

### Rechner
- 67 Routen vom Typ `calculator`; 28 Moduldateien mit Rechnerlogik importieren nichts aus `src/calc/`. Mit nennenswerter Rechenlogik im TSX (Anzahl `Math.*`/`useMemo`): Betonkennwerte (54), Bauwerksuntersuchung (34), Statistik (32), MechanischeKenngroessen (24), BpVerkehrswegebau (12), Modernisierung (8), EModul (7), Materialoptimierung, Expositionsklassen, Energieausweis (je 5), Festigkeitsberechnungen, FestbetonStatistik, Erdbau (je 4). Übrige (Einheiten, Frischbeton, Zustandsbewertung, OnlineTools …) sind überwiegend Tabellen/Auswahl.
- `src/calc/plausibilitaet.ts` und `src/calc/stabilitaet.ts` ohne eigenen Test.
- Rechenweg: Alle Routen mit mehr als drei Formeln haben `FormulaDerivationBox` oder eigene Rechenwege (Beispielrechnungen in `src/modules/beispielrechnungen/`). Ausnahme mit Formeln ohne Herleitung: `baustoffkenngroessen` (24 Formeln), `beton_a_z` (9), `bp_lehmbauprodukte` (6), `glossar` (6; dort angemessen).

### Didaktik
- Quiz-Ratschen: Längenverhältnis > 1,2 bei 26 und Absolutwörter bei 10 Fragen stammen laut Kommentar aus den 26 bereits freigegebenen Fragen; Korrektur heißt Freigabe neu einholen.
- 1 214 Fragen und 191 Modul-Prüfvermerke warten auf die fachliche Freigabe. Vorprüfungen liegen vor (`docs/quiz-vorpruefung-cluster-*.md`).
- Module ohne Selbsttest: nur Info-, Rechts- und Übersichtsseiten sowie `betonkennwerte`, `zwang`, `bauchemie`, `spannbeton` (Selbsttest ggf. über `MODULTEST_IN_APP`, e2e-Smoke prüft das), `instandhaltung`, `labor_sicherheit`, `beton_a_z`. Prüfen, welche davon Fachmodule sind.
- 7 Routen ohne `ModuleFooter`: `start`, `forschung_transfer`, `zwang`, `bauchemie`, `instandhaltung`, `ttz_weiterbildung`, `lehrveranstaltungen` (bei `zwang`, `bauchemie`, `instandhaltung` fachlich nötig; prüfen, ob die Fußzeile über eine Unterkomponente kommt).

### Technik
- **Toter Code in `src/App.tsx`**: `printMetadataConsoleTable` (ab Zeile 149) und `checkSEOStatus` (ab Zeile 257) werden nirgends aufgerufen (≈ 150 Zeilen, `console.log`/`console.table`). ESLint mit `unused-imports` liegt nur unter `docs/ci/` und läuft nicht.
- `console.log` in `src/modules/DppEpd.tsx:165` (Video-Fehler).
- `docs/metriken.json` und `scripts/qa/metriken.mjs` veraltet bzw. fehlerhaft (s. o.).
- Repository-Reste: `tmp/update_prinzipien.py`, `.aistudio/artifacts/…/implementation_plan.md` eingecheckt.
- Kein Lockfile für npm (`bun.lock` vorhanden), ESLint aus (Entscheidung E1/AI Studio, `docs/ci/README.md`).
- Dateien > 1 500 Zeilen: nur noch `src/data/lernziele.ts` (1 685) und `src/modules/Spannbeton.tsx` (1 511).

### Profil (Sichtbarkeit, SEO, Leistung)
- **Hash-Router**: Sitemap (`public/sitemap.xml`, 291 URLs, aktuell) listet `https://baustoffboard.de/#id`. Suchmaschinen werten das Fragment nicht als eigene Seite; damit ist faktisch nur die Startseite indexierbar. Gleiches Problem verhindert laut `docs/performance.md` das LCP-Ziel für Fachmodule.
- LCP Fachmodule 3,4–3,75 s statt < 2,5 s: nur mit vorgerenderten Modulseiten (Pfad-Routing + Prerender) erreichbar.
- Offene Lizenz (CC BY-SA/MIT, Zenodo-DOI, OER-Portale) wartet auf Abschnitt A in `docs/lizenz-ablauf.md`.

## 3. Arbeitspakete

Größe: S ≤ ½ Tag, M ≤ 2 Tage, L > 2 Tage. „Huber“: ja = braucht Entscheidung oder fachliche Freigabe von Prof. Huber. „nach 5.3“ = berührt Moduldateien unter `src/modules/`, die `phase5/content` (AP 5.3, 409 Moduldateien geändert) gerade nach `content/` auslagert; erst nach dem Merge von 5.3 beginnen bzw. dann in `content/` arbeiten.

### Priorität 1 – sofort parallel möglich (ohne Prof. Huber, kein Konflikt mit 5.3)

| # | Paket | Dateien | Größe | Huber | Konflikte | Kategorie |
|---|---|---|---|---|---|---|
| Z1 | Toten SEO-Diagnosecode aus `App.tsx` entfernen, `console.log` in DppEpd ersetzen | `src/App.tsx` (Z. 149–300), `src/modules/DppEpd.tsx:165` | S | nein | DppEpd: nach 5.3 (nur diese Zeile; App.tsx frei) | Technik |
| Z2 | `metriken.mjs` korrigieren (Einstieg wie `check-bundle`, Lernziele aus `src/data/lernziele.ts`, Absolutwörter wie `tests/quiz.test.ts`) und `docs/metriken.json` neu schreiben | `scripts/qa/metriken.mjs`, `docs/metriken.json` | S | nein | keiner | Technik |
| Z3 | Kerne für die rechenstarken Rechner nach `src/calc/` mit Tests (Betonkennwerte, Statistik/FestbetonStatistik, MechanischeKenngroessen, Bauwerksuntersuchung, EModul, BpVerkehrswegebau) – zunächst nur Kern + Test aus der vorhandenen Logik, Verdrahtung siehe Z11 | neu `src/calc/*.ts`, `tests/*.test.ts` | M (je Rechner S) | nein | keiner (Moduldateien unberührt) | Rechner |
| Z4 | Eigene Tests für `src/calc/plausibilitaet.ts` und `src/calc/stabilitaet.ts` | `tests/` | S | nein | keiner | Rechner, Technik |
| Z5 | Prerender-Konzept: Pfad-Routing mit Hash-Fallback, statisches HTML je Modul beim Build, Sitemap auf Pfade; als ADR/Prototyp für 2–3 Module | `docs/`, `scripts/`, `src/routing/`, `server.ts`, `vite.config.ts` | L | Entscheidung ja (Architektur, Hosting über AI Studio/Cloud Run) | `vite.config.ts` auch in 5.3 geändert → Prototyp auf Branch, Merge nach 5.3 | Profil, Technik |
| Z6 | Gemini-Modell-ID prüfen und ggf. auf aktuelles, stabiles Modell umstellen; Fehlerfall testen | `server.ts` | S | nein | keiner | Recht (Datenschutz-Abschnitt 3 bleibt gültig), Technik |
| Z7 | Repository-Reste entfernen (`tmp/update_prinzipien.py`, `.aistudio/artifacts/…`) – vorher klären, ob AI Studio `.aistudio/` braucht | Wurzel | S | nein | keiner | Technik |
| Z16 | Linkprüfung als eigener Workflow (wöchentlich, gedrosselt, Wikipedia über API; Bericht statt Abbruch), analog `normen-check.yml` | `scripts/qa/`, `.github/workflows/` | M | nein | keiner | Profil, Technik |
| Z8 | Diagramm-Textalternativen: gemeinsame Hülle (`aria-label` + Datentabelle/`figcaption`) als Komponente bauen und an Chart-Komponenten in `src/components/` anwenden | `src/components/…`, `src/lib/chartSetup` | M | nein | Anwendung in Moduldateien nach 5.3 | Bedienung |

### Priorität 2 – nach dem Merge von AP 5.3 (ohne Prof. Huber)

| # | Paket | Dateien | Größe | Huber | Konflikte | Kategorie |
|---|---|---|---|---|---|---|
| Z9 | Barrierefreiheitserklärung aktualisieren: behobene Mängel streichen, Prüfgrundlage (alle Routen, 3 Modi, Mobil-Layout, Dialog) nennen, Stand neu; Restmängel (Reiter ohne `tablist`, Diagramme) ehrlich aufführen | `src/modules/Barrierefreiheit.tsx` bzw. `content/barrierefreiheit/` | S | Freigabe des Texts empfohlen (Konformitätsaussage) | **nach 5.3** (Datei ausgelagert) | Recht, Bedienung |
| Z10 | AP 2.8: 100 eigene Reiterleisten auf `ModuleTabs` umstellen, in Clusterpaketen (Bauprodukte `Bp*` 20 Dateien; Baustoffe; Beton; Mechanik/Bauphysik; Bestand/Schäden; Nachhaltigkeit/Sonstiges), je Paket a11y-Lauf der betroffenen Routen | Anhang A | L (6 × M) | nein | **nach 5.3**; Pakete untereinander konfliktfrei, wenn nach Dateien getrennt | Bedienung |
| Z11 | Rechner aus Z3 in die Module verdrahten (Logik im TSX durch `src/calc`-Aufrufe ersetzen) | Moduldateien aus Z3 | M | nein | **nach 5.3**, setzt Z3 voraus; mit Z10 abstimmen (gleiche Dateien) | Rechner |
| Z12 | Herleitung (`FormulaDerivationBox`) für `baustoffkenngroessen`, `beton_a_z`, `bp_lehmbauprodukte` | 3 Moduldateien | S | nein | **nach 5.3** | Rechner, Didaktik |
| Z13 | `ModuleFooter` mit Quellen für `zwang`, `bauchemie`, `instandhaltung` prüfen/ergänzen; Selbsttest für Fachmodule ohne Test (`zwang`, `bauchemie`, `instandhaltung`, `labor_sicherheit`, `betonkennwerte`) prüfen | Moduldateien, `quiz.json` | S–M | Quizfragen: Freigabe ja | **nach 5.3** | Didaktik |
| Z14 | `LCA.tsx:1314` Link-als-Schaltfläche → `<button>` | `src/modules/LCA.tsx` | S | nein | **nach 5.3** | Bedienung |
| Z18 | KaTeX-Warnungen beheben (², ä, ‰, € als `\text{}`/Makro) und `check-katex.mjs` um `strict: 'error'` erweitern, damit sie in der CI auffallen | 4 Moduldateien, `scripts/qa/check-katex.mjs` | S | nein | **nach 5.3** (Module und `check-katex.mjs` in 5.3 geändert) | Rechner, Technik |
| Z17 | YouTube-Suchlinks (`youtube.com/results?search_query=…`, 5 Stück) in den KI-Modulen durch konkrete Videos/Kanäle ersetzen oder entfernen | `src/modules/ki/…` bzw. `content/ki/` | S | nein | **nach 5.3** | Didaktik, Profil |
| Z15 | Diagramm-Hülle aus Z8 in den 24 Moduldateien anwenden | Moduldateien | M | nein | **nach 5.3**, setzt Z8 voraus; mit Z10 gleiche Dateien | Bedienung |

### Priorität 3 – braucht Prof. Huber

| # | Paket | Dateien | Größe | Huber | Konflikte | Kategorie |
|---|---|---|---|---|---|---|
| H1 | Quiz-Freigabe von 1 214 vorgeprüften Fragen (Grundlage `docs/quiz-vorpruefung-cluster-*.md`); dabei die 26 freigegebenen Fragen mit Längenverhältnis > 1,2 und 10 Absolutwörtern überarbeiten → Ratschen auf 0 / ≤ 5 | `src/data/quiz.json`, `tests/quiz.test.ts` | L | ja | keiner (quiz.json nicht in 5.3) | Didaktik |
| H2 | Prüfvermerke: 191 Module von `offen` auf `geprueft` (fachliche Durchsicht je Modul) | `src/data/pruefvermerke.ts` | L | ja | keiner | Didaktik, Recht (Haftung) |
| H3 | Lizenz klären (Rechteinhaber Code/Inhalte, ORCID), danach `LIZENZ_AKTIV = true`, Impressum-Absatz, `CITATION.cff`, Zenodo | `src/data/lizenz.ts`, `docs/lizenz-ablauf.md` | M | ja | keiner | Recht, Profil |
| H4 | Datenschutzerklärung mit dem DSB der THA abstimmen | `src/modules/Datenschutz.tsx` | S | ja | keiner | Recht |
| H5 | Offene Normtext-Fragen (`docs/fachklaerung-2026-10-26.md`: DIN 18533-1:2026-06, DIN 1045-2 Tabelle Mehlkorn, GModG §§ 15/16/79–88, DIN 4108-2:2026-05) | betroffene Module | M | ja (Normtext) | Textänderungen **nach 5.3** | Recht, Didaktik |
| H6 | Architekturentscheidung Prerender/Pfad-Routing (Z5) und Hosting | – | S (Entscheidung) | ja | – | Profil |
| H7 | ESLint/Lockfile zurück in `package.json` (Entscheidung E1, AI-Studio-Import) | `package.json`, `docs/ci/` | S | ja (Entscheidung) | keiner | Technik |

## 4. Einschätzung je Kategorie

| Kategorie | heute (geschätzt) | Hebel zu 1,0–1,3 |
|---|---|---|
| Recht | 1,7 | Z9, H3, H4, H5 |
| Bedienung/Barrierefreiheit | 1,7 | Z10, Z8/Z15, Z9, Z14 |
| Rechner | 1,7 | Z3/Z11, Z4, Z12, Z18 |
| Didaktik | 2,0 | H1, H2 (alles Übrige ist erledigt: Lernziele, Kurzfassungen, ≥ 6 Fragen je Modul) |
| Technik | 1,3 | Z1, Z2, Z7, Z16, H7 |
| Profil | 2,0 | Z5/H6 (Indexierbarkeit, LCP), H3 (offene Lizenz) |

Ohne Prof. Huber erreichbar sind damit Technik vollständig, Rechner und Bedienung weitgehend; Didaktik und Recht hängen an H1–H5.

## Anhang A: Moduldateien mit eigener Reiterleiste (AP 2.8)

Admin, Analytik, Asphalt, Ausbau, Bauphysik, Baustatik, Baustoffkenngroessen, Baustoffkunde, Bautagebuch, Bauwerkserfassung, Bauwerksunters_Monitoring, Bauwerksuntersuchung, Bestand, Betonkennwerte, Bindemittel, BodenMaterialAufbereitung, Bodenmechanik, BpBaustoffindustrie, BpBefestigung, BpBeton, BpBetonfertigteile, BpBetonwaren, BpBetonzusatzmittel, BpDachFassade, BpDaemmung, BpFarbenLacke, BpGlaeser, BpInnovationen, BpKlebstoffe, BpKunststoffe, BpLehmbauprodukte, BpMauerwerk, BpMineralisch, BpPutzEstrich, BpTrockenbau, Brandschutz, Daemmstoffe, DppEpd, Eigenspannungen, Einheiten, Energieausweis, Erdbau, Expositionsklassen, Feedback, Festbeton, Formaenderungen, Frischbeton, Gesteine, Gips, Glas, Grundlagen, HistorischeBauprodukte, HistorischeBauweisen, HistorischeMaterialkennwerte, Holz, Holzkorrosion, Holzwerkstoffe, Informationsquellen, Innenausbau, InnovativeWerkstoffe, Kalk, Knicken, Korrosion, Kreislaufwirtschaft, KriechenSchwinden, Kunststoffe, LaborSicherheit, LebenszyklusKosten, Lehm, Materialoptimierung, Mauerwerk, MechanischeKenngroessen, MessenPruefen, Metalle, Metallkorrosion, Mischungsberechnung, Modernisierung, NachhaltigkeitDatenRegeln, Nawaro, Praxiswissen, Probenahme, PutzeMoertel, Qualitaetssicherung, Regularien, RessourcenUmwelt, Ressourceneffizienz, Rueckbau, SchadreaktionenBeton, SchutzGrundlagen, Sicherheitskonzept, Sichtbeton, Sonderbetone, Sonstiges, Spannbeton, Stahl, Statistik, WTA, WUBauwerke, ZertifizierungSiegel, Zustandsbewertung (alle unter `src/modules/`).

Ermittelt: Routen aus `src/routing/ModulInhalt.tsx`, Datei enthält `activeTab`/`aria-pressed`-Reiter, weder sie noch ihre direkten Importe nutzen `ModuleTabs`. Admin, Analytik und Feedback sind Werkzeugseiten und können zuletzt kommen.

## Anhang B: Externe Links (nicht abgerufen)

875 verschiedene URLs in `src/`, davon 446 `de.wikipedia.org`, 31 `beton.wiki`, 28 `gesetze-im-internet.de`, 26 `dinmedia.de`, 15 `tha.de`, 11 `youtube.com` (5 davon Suchergebnis-Links `youtube.com/results?search_query=…` in den KI-Modulen, die keine stabile Quelle sind). Eine Linkprüfung als CI-Schritt fehlt weiterhin (Roadmap Punkt 3 in `docs/AUDIT_ABSCHLUSS_2026-10.md`); der Normen-Check (`normen-check.yml`) deckt nur DIN Media und Gesetze ab.

Interne Sprungziele: alle `Querverweis`-Ziele sind über den Typ `TabId` geprüft (tsc); einziges `href="#…"` ohne Registry-ID ist `#transportbeton-excel` (Z14).
