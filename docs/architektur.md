# Architektur BaustoffBoard

Stand: Phase 5 (Oktober 2026). Kurzüberblick für Pflege und Weiterentwicklung.

## Aufbau

| Bereich | Ort | Aufgabe |
|---|---|---|
| Einstieg | `src/main.tsx` → `src/App.tsx` | Layout: Seitenleiste, Kopfzeile, Inhaltsrahmen, SEO-Metadaten, Druckkopf/-fuß |
| Registry | `src/registry/modules.ts`, `icons.ts` | **Einzige** Liste aller Modul-IDs mit Menügruppe, Icon, Meta-Beschreibung, Suchbegriffen und Baum-Angaben (Modulübersicht); Aliase in `TAB_ALIASES` |
| Routing | `src/routing/ModulInhalt.tsx` | Ordnet jeder Modul-ID die Komponente zu (`activeTab === '<id>' && <Modul />`), alle Module per `React.lazy` |
| | `src/routing/ModulKopf.tsx` | Lernziele, Kurzfassung, Erkundungsauftrag, Rechner-Haftungshinweis (lazy, mit den zugehörigen Daten) |
| | `src/routing/tabGroups.ts` | Menügruppen aus der Registry für die Navigation |
| Navigation | `src/components/navigation/ModulNavigation.tsx` | Menü der Seitenleiste (Start/Favoriten, Cluster, Gruppen, Volltexttreffer) |
| Zustand | `src/contexts/TabContext.tsx` | aktives Modul ↔ Pfad `/modul/<id>` (Startseite `/`, `pushState`/`popstate`; alte Links `/#<id>` werden per `replaceState` umgeschrieben, Regeln in `src/routing/pfad.ts`, Z52), Theme, Anzeigeoptionen |
| Module | `src/modules/*.tsx` | Fachmodule (Darstellung); große Teilansichten in Unterordnern (z. B. `modules/holz/HolzSchwinden3D.tsx`) |
| Fachtexte | `content/<modul>/<Datei>.json` | Fließtexte, Tabellen, Listen, Glossare der Module – ohne TSX bearbeitbar (siehe „Inhalte bearbeiten“) |
| Rechenkerne | `src/calc/*.ts` | reine, getestete Rechenfunktionen ohne React (Tests in `tests/`) |
| Daten | `src/data/*` | Inhalte und Kennwerte (Quiz `quiz.json`, Lernziele, Erkundung, Rechnergrenzen, Versionen …) |
| Fragenpool | `src/data/quiz.json` → `scripts/quizPool.ts` (Vite-Plugin) → `src/data/quizLader.ts` | Fragen im Browser je Modul bzw. in Teilpaketen nachladen (siehe unten); Typen/Kategorien in `quizModell.ts` |
| Server | `server.ts`, `server/` | Express: statische Auslieferung, Gemini-Proxy, Abstimmungen, Admin, Kurzfragebogen (`POST /api/feedback`, `GET /api/feedback/stats` nur Admin), `GET /api/health` |

Neues Modul: Eintrag in `src/registry/modules.ts` + Zeile in `src/routing/ModulInhalt.tsx` (lazy import und `activeTab === '<id>'`). `tests/registry.test.ts` prüft, dass jede ID dort verdrahtet ist, und dass `App.tsx` ≤ 800 Zeilen bleibt.

**Inaktive Seiten** (Schalter `INAKTIVE_GRUPPEN` in `src/registry/modules.ts`; seit 27.10.2026: „Lehrveranstaltungen“ = Lernpfade nach Lehrveranstaltung): Code, Daten (`src/data/lernpfade.ts`) und Tests bleiben, Menü, Modulübersicht, Suche, Sitemap, Vorrendern und Startseiten-Link blenden die Seiten aus; `/modul/<id>` und Aliase liefern eine 404-Hinweisseite (`server.ts`), die App fällt auf die Startseite zurück (`tests/lernpfadeInaktiv.test.ts`).
Wiedereinschalten: 1. `'Lehrveranstaltungen'` aus `INAKTIVE_GRUPPEN` entfernen. 2. `npm run gen:sitemap` und Suchindex neu erzeugen (`node scripts/gen-suchindex.mjs` gegen die gebaute App).
3. `npm test` und Build (Vorrendern) laufen lassen – Menü, Baum, Startseiten-Link, Cluster-Kurztext und Vorrendern folgen dem Schalter automatisch.

Admin-Bereich „Audit“ (Gutachten, Zulieferungen, Umsetzungsplan, Prüfpunkte F-Freigabe, Quiz-Prüflisten): statische Teile in `src/data/audit/*.ts` (per PR pflegen), Zählungen erzeugt das Vite-Plugin `scripts/auditDaten.ts` (`virtual:audit-daten`) beim Build und im Dev-Server aus dem Quelltext – alle „F-Freigabe“-Fundstellen in `src/calc`, `src/data`, `content`, Zähler je Cluster aus `quiz.json`, Kennzahlen „Tool-Umfang & Code“, Paketversionen; nach dem Build zusätzlich `dist/audit-bundle.json` (Einstieg gzip wie `check-bundle.mjs`). Der Bereich ist ein eigener, lazy geladener Chunk (`src/components/admin/audit/AuditBereich.tsx`); `tests/auditDaten.test.ts` prüft Vollständigkeit und Gleichstand. Kontrolle: `npx tsx scripts/auditDaten.ts`.

Fachmodule brauchen außerdem einen Prüfvermerk in `src/data/pruefvermerke.ts` (neu: `{ status: 'offen' }`; `tests/pruefvermerke.test.ts`). `ModulKopf` zeigt „Fachlich geprüft am … von …“ bzw. „Fachliche Prüfung ausstehend“; der Admin-Bereich („Meine Module“) listet alle Vermerke nach Cluster, Pate (`src/data/paten.ts`) und Status (Redaktionsmodell, AP 6.6).

## Ladeverhalten (Bundle-Budget)

- Einstiegs-Chunk enthält nur Layout, Navigation, Registry und React. Module, Modulkopf, Modul-Selbsttest, Abstimmungsansicht und SEO-Audit werden nachgeladen.
- three.js / @react-three nur in den 3D-Teilansichten von Holz und Mauerwerk (`React.lazy` innerhalb des Moduls).
- Große Teilansichten neuer Module ebenso per `React.lazy` + `<React.Suspense>` auslagern.
- `scripts/qa/check-bundle.mjs` prüft die gzip-Größen als Ratsche (Einstieg ≤ 108 kB, Stand 27.10.2026: 102,5 kB; jeder Chunk ≤ 300 kB, keine Ausnahmen); vorher die Vollständigkeit des Builds: fehlen `dist/server.cjs` oder `dist/modul/routen.json` (Build nach dem Client-Teil abgebrochen, z. B. rc 137), endet es mit Exit 1.
- Excel-Export (`xlsx`, ~140 kB gzip) nur per `import()`: `src/modules/lca/TransportbetonExcelExport.ts` wird von `LCA.tsx` und `TransportbetonLcaUebung.tsx` ausschließlich dynamisch geladen; die Emissionsfaktoren der Übung liegen getrennt in `src/modules/lca/transportbetonKennwerte.ts` (sonst hebt ein statischer Import das Code-Splitting auf – Vite-Warnung „dynamically imported … but also statically imported“).
- Schriften: Inter Regular/Bold als WOFF2-Teilmenge, **als Base64-Text** in `src/lib/schriftDaten.ts` (generiert, nicht von Hand ändern; Grund: AI Studio übernimmt neue/geänderte Binärdateien beim Pull nicht zuverlässig). `src/lib/schriften.ts` lädt sie nach dem ersten Bild als `FontFace` (eigener Chunk ≈ 112 kB roh, nicht im Einstieg; bis dahin Systemschrift wie bei `font-display: swap`). Neue Sonderzeichen außerhalb der Teilmenge erscheinen in der Ersatzschrift – dann Teilmenge neu erzeugen (Befehl in `docs/performance.md`) und `schriftDaten.ts` neu schreiben.
  Die TTF-Dateien in `public/fonts/` (`inter-regular.ttf`, `inter-bold.ttf`, `worksans-regular.ttf`) sind **ungenutzt** und wurden absichtlich byte-identisch wiederhergestellt (Commit `b7798995`), damit der AI-Studio-Pull keine Binäränderung sieht; `worksans-regular.ttf` ist inhaltlich eine HTML-Seite (Commit `cc1dd60c`). Entfernen nur nach Entscheidung Prof. Huber und Test des AI-Studio-Pulls.
- Messung (LCP, CLS, TBT-Näherung, Klick-Latenz): `scripts/qa/perf-messung.mjs`, Ergebnisse in `docs/performance.md`.

### Ladezeit (AP 5.5)

| Baustein | Wirkung |
|---|---|
| `scripts/modulKopf.ts` (Vite-Plugin, `virtual:modul-kopf`) → `src/routing/modulKopfDaten.ts` | Lernziele, Kurzfassung, Erkundung, Rechner-Grenzen je Modul als eigener Chunk (≈ 1–2 kB) statt eines 87-kB-Chunks; Quelle bleiben `src/data/{lernziele,kurzfassung,erkundung,rechnerGrenzen}.ts` (Tests lesen sie direkt, `tests/ladezeit.test.ts` vergleicht) |
| `scripts/modulVorladen.ts` + `scripts/vorladen-boot.js` | Karte „Modul-ID → Chunks“ als JSON in `dist/index.html`, Inline-Skript setzt anhand der Adresse (`/modul/<id>`, alt `#<id>`) sofort `modulepreload` (ModulInhalt, Modulkopf, Kopfdaten, Modul-Chunk samt Importen). Zuordnung aus `ModulInhalt.tsx` gelesen; CSP-Hash berechnet `server.ts` aus `dist/index.html` |
| `scripts/vorrendernPlugin.ts` + `scripts/vorrendern.ts` | Nach dem Client-Build (closeBundle): Vite-SSR-Build von `scripts/vorrendern-eintrag.tsx`, je Modul `react-dom/server` → `dist/modul/<id>.html` (Rahmen, Modulkopf, erster Abschnitt; `inert`, sichtbar nur bei passender Adresse/Einstellung über `scripts/startschale-boot.js`), `dist/modul/routen.json` für `server.ts`. `src/main.tsx` lädt die Chunks vor (`lazySofort`, `src/routing/sofortLaden.ts`) und ersetzt die Seite ohne Spinner. Das Kind startet erst im `beforeExit` des Vite-Prozesses (Build-Speicher siehe unten). Abschalten: `BB_OHNE_VORRENDERN=1` (Z52) |
| `modulBasisChunks()` (manualChunks) | gemeinsame Modulbausteine → `modul-basis`, Icons außerhalb des Einstiegs → `icons`, statischer Einstiegsgraph → `app`; eine Modulseite lädt ~7–14 statt 20–35 Dateien |
| `scripts/bedarfsLaden.ts` | lenkt `react-katex`, `react-chartjs-2`, `chart.js` aus `src/` auf `src/lib/katexBedarf.tsx`, `chartBedarf.tsx`, `chartJsBedarf.ts` um: KaTeX/Chart.js laden erst, wenn ein Chunk mit Formeln/Diagrammen läuft; Diagramme werden erst bei Sichtbarkeit gezeichnet (eins je Task, vor Druck/PDF-Export alle). Module bleiben unverändert; Tests (tsx) nutzen die echten Pakete. KaTeX-CSS bleibt im Haupt-CSS |
| `src/lib/diagrammAlternative.tsx`, `diagrammDaten.ts` | Textalternative für jedes Chart.js-Diagramm (Paket Z8, WCAG 1.1.1/1.3.1), eingebunden in `chartBedarf.tsx`: `aria-label` mit Kurzbeschreibung (Art, Titel, Reihen, Wertebereiche) aus `data`/`options`, Schaltfläche „Daten als Tabelle anzeigen“ (Tabelle mit `caption`/`th scope`, lange Reihen ausgedünnt), im Druck die Kurzbeschreibung. Modulspezifisch: `aria-label` am Diagramm oder `<DiagrammAngaben zusammenfassung einheiten titel tabelle>` um das Diagramm |
| `src/components/ui/NachErstemBild.tsx` | rendert Abschnitte unterhalb des Bildausschnitts nach dem ersten Bild, je Abschnitt eine Task (Mischungsberechnung, Biegebemessung, Feuchteschutz); im Bild sofort, beim Drucken alles |

**Build-Speicher (Vorrendern, Gutachten 27.10.2026 abends Nr. 4):** `npm run build` wurde in der gemeinsam genutzten 8-GB-Umgebung mehrfach vom Kernel beendet (rc 137). Ursache: Das Vorrender-Kind lief in `closeBundle`, während der Vite-Prozess den ganzen Build noch erreichbar im Speicher hielt. Gemessen (RSS-Summe aller Prozesse, Abtastung 0,5 s, 27.10.2026): Vite 2,7 GB (nach `gc()` noch 1,8 GB Heap belegt) + esbuild-Dienst von Vite 0,4–0,5 GB + Kind 1,7 GB → Spitze ≈ 4,7 GB. Seit dieser Änderung (ohne package.json-Änderung, alles in `scripts/vorrendernPlugin.ts`):

1. `closeBundle` merkt das Vorrendern nur vor; es läuft im `beforeExit` des Vite-Prozesses, wenn `vite build` fertig ist (die Vite-CLI beendet sich bei Erfolg ohne `process.exit`). Schlägt es fehl, setzt das Plugin `process.exitCode = 1`, der esbuild-Schritt hinter `&&` läuft dann nicht. `BB_VORRENDERN_SOFORT=1` stellt das alte Verhalten her.
2. Davor beendet es den esbuild-Dienst von Vite und ruft eine verdichtende Vollbereinigung auf (`gc({ flavor: 'last-resort' })`, `--expose-gc` zur Laufzeit über `v8.setFlagsFromString`). Gemessen: Vite-Prozess 2,35 GB → 0,41 GB RSS (Heap 47 MB).
3. Das Kind bekommt eine eigene Heap-Grenze `--max-old-space-size=2048` (statt der geerbten `NODE_OPTIONS`-Grenze; einstellbar mit `BB_VORRENDERN_HEAP_MB`). Gemessener Bedarf: 1,6–1,8 GB RSS; mit 1 536 MB lief es ebenfalls durch. Reicht die Grenze nicht, endet das Kind mit „heap out of memory“ statt eines SIGKILL für den ganzen Build.

Ergebnis: Spitze ≈ 3,1 GB (jetzt im Client-Build selbst: Vite 2,7 GB + esbuild), während des Vorrenderns ≈ 2,6 GB. Das Build-Log zeigt die Werte („vorrendern: Vite-Prozess RSS … → …“). `node scripts/qa/check-bundle.mjs` erkennt einen abgebrochenen Build (fehlende `dist/server.cjs`/`dist/modul/routen.json`).

Neue große Rechnerseite: Abschnitte unterhalb der ersten Bildschirmhöhe in `<NachErstemBild minHoehe="…">` fassen, wenn `perf-messung.mjs` TBT > 200 ms meldet. Neue Diagramm-/Formelbibliotheken nicht direkt in den Einstieg ziehen.

### Fragenpool (AP 5.4)

`src/data/quiz.json` ist die **einzige Quelle** der Quizfragen; Tests (`tests/quiz.test.ts`, `tests/begriffe.test.ts`) und Skripte (`scripts/quiz-freigabe.mjs`, `scripts/qa/metriken.mjs`) lesen sie direkt. Für den Browser teilt das Vite-Plugin `scripts/quizPool.ts` (eingebunden in `vite.config.ts`) die Datei beim Build und im Dev-Server in virtuelle Module – es entstehen keine generierten Dateien im Repository, also auch nichts, das veralten kann:

| Virtuelles Modul | Inhalt | gzip | genutzt von |
|---|---|---|---|
| `virtual:quiz-pool` | Anzahl Fragen je `moduleId` + Lader | 5,5 kB (mit `quizLader`) | `ModulTest`-Kopfzeile, Lernziele-Kopfzeile, Cluster-Angabe in Aufgaben |
| `virtual:quiz-pool/quiz-modul-<id>` | Fragen eines Moduls | 0,9–4,7 kB | `ModulTest` |
| `virtual:quiz-pool/quiz-teil-1…4` | zusammenhängende Viertel des Pools | je 120–126 kB (Stand 27.10.2026, 1 282 Fragen; Messung `check-bundle.mjs`) | Quiz, Klausursimulator, Quiz-Dashboard, Fragenfreigabe (parallel) |

Zugriff im Frontend nur über `src/data/quizLader.ts`: `useModulFragen(id)`, `useAlleFragen()` (liefern `null`, solange geladen wird), `anzahlFragenModul/-Route`, `clusterDerGruppen`. `src/data/quizData.ts` (`QUIZ_QUESTIONS`, synchron, ganzer Pool) ist Tests und Node-Skripten vorbehalten; `tests/quiz.test.ts` schlägt fehl, wenn Code unter `src/` `quizData` oder `quiz.json` importiert, und prüft, dass die Teilpakete zusammen genau `quiz.json` ergeben.

Verworfene Alternativen: per Skript erzeugte `src/data/quiz/<cluster>.json` (doppelter Datenbestand im Repository, Aktualitätstest nötig) und ein dynamischer Import der ganzen JSON (bliebe ein 382-kB-Chunk). Teilpakete je Cluster bräuchten im Plugin die Modul-Registry (React-Icons); die Aufteilung nach Modul (Selbsttest) bzw. nach Größe (Gesamtpool) kommt ohne aus.

## Inhalte bearbeiten (AP 5.3)

Die Fachtexte der Module liegen nicht mehr im TSX, sondern in `content/` – **eine Datei je Quelldatei**, ein Ordner je Modul:
`src/modules/Bauchemie.tsx` → `content/bauchemie/Bauchemie.json`, `src/modules/spannbeton/SpannbetonPrinzipien.tsx` → `content/spannbeton/SpannbetonPrinzipien.json`. Das TSX enthält nur noch Aufbau, Klassen, Logik und Verweise. Jede Datei hat bis zu drei Gruppen:

| Gruppe | Inhalt | im TSX | Format |
|---|---|---|---|
| `texte` | Fließtext aus JSX (Absätze, Listenpunkte, Überschriften, Zellen) | `<p className="…"><MdText text={inhalt.texte.einleitung} /></p>` | Inline-Markdown (unten) |
| `werte` | einzelne Zeichenketten: Props (`title`, `label`, `beschreibung` …), Meldungen im Code, Kinder eigener Komponenten | `title={inhalt.werte.beispiel1}` | reiner Text, wird unverändert eingesetzt |
| `daten` | ganze Tabellen, Listen, Glossare, Fußzeilen (`regelwerke`, `literatur`) als JSON-Arrays/-Objekte | `const DATEN = inhalt.daten.SCHADSTOFFE_DATA;` | JSON wie im Code; Schlüssel = Pfad (`Komponente.prop`, `KONSTANTE.id.feld`) |

**Text ändern:** in der JSON-Datei den Wert ändern – Schlüssel nicht umbenennen (sie sind die Verweise aus dem TSX; der Schlüsselname ist nur eine Lesehilfe aus den ersten Wörtern und muss nach einer Textänderung nicht passen). Neue Absätze, Listenpunkte oder Tabellenzeilen: bei `daten` einfach Einträge im Array ergänzen (gleiche Felder wie die Nachbarn); bei `texte` entsteht ein neuer Absatz im TSX (neuer Schlüssel + `<MdText text={inhalt.texte.neu} />`). Reihenfolge der Einträge in `daten`-Arrays = Anzeigereihenfolge.

**Inline-Markdown in `texte`** (`src/lib/inhaltMd.ts`, gerendert von `src/components/inhalt/MdText.tsx`, ohne eigenes Hüllelement):

| Schreibweise | Ergebnis |
|---|---|
| `**fett**`, `*kursiv*` | `<strong>`, `<em>` |
| `$CaSO_4$` | KaTeX-Formel (InlineMath); TeX wie in `math="…"`, in JSON Backslash doppelt: `"$\\frac{a}{b}$"` |
| `CO<sub>2</sub>`, `m<sup>3</sup>`, `<br>` | Index, Exponent, Zeilenumbruch |
| `` `code` `` | `<code>` |
| `[Text](https://…)` | Link (neues Fenster, `text-shiraz hover:underline`) |
| `\*`, `\$`, `` \` ``, `\[`, `\<`, `\\` | Zeichen ohne Sonderbedeutung (in JSON: `\\*` usw.) |

Ein `*` mit Leerzeichen dahinter (z. B. AVV `17 06 05* (…)`) bleibt ohne Maskierung ein Sternchen. Blockstruktur (Absätze, Listen, Tabellen, Tailwind-Klassen) bleibt bewusst im TSX: So bleibt die Darstellung zeichengleich, und Listen/Tabellen mit Daten liegen strukturiert unter `daten`. `werte` und `daten` sind reiner Text – dort wirkt kein Markdown.

**Laden:** Die Werte werden beim Build vom Vite-Plugin `scripts/inhaltEinbetten.ts` direkt an den Verweisstellen eingesetzt (sonst kämen Schlüssel und Verweise zusätzlich in jeden Chunk: +15 % gzip im Median). Die Texte bleiben damit im lazy geladenen Modul-Chunk (nie im Einstieg); `tsc` und die Tests lesen die JSON-Dateien direkt. Verweise nur in der Form `inhalt.<gruppe>.<schlüssel>` bzw. `inhalt.<gruppe>["schlüssel"]` schreiben (andere Zugriffe funktionieren, laden dann aber die ganze JSON). Unbekannte Schlüssel brechen den Build ab.

**Prüfungen:** `tests/inhalt.test.ts` (gültige Dateien, nur die drei Gruppen, jeder Verweis vorhanden, jede Datei genau einmal importiert, keine verwaisten Einträge, Markdown eindeutig); `check:formeln` prüft `$…$` in `texte` und Formel-Felder (`formel`, `math`, `latex` …) in `daten`; `check:zahlen` (Dezimalkomma), `check:quellen` (Normlinks, Du-Imperative, Normenstand der `regelwerke`) und `tests/begriffe.test.ts` lesen `content/` mit (`scripts/qa/inhaltDateien.mjs`). Literaltypen (`kategorie: 'Mineralisch' | …`) bleiben im TSX, damit `tsc` sie weiter prüft.

**Weitere Module auslagern:** `npx tsx scripts/inhalt-auslagern.ts src/modules/<Datei>.tsx` (Codemod; ersetzt nur Literale durch Verweise auf denselben Wert, JSX-Leerraum und Entities wie esbuild). Danach `npx tsc --noEmit`; Stellen mit Literaltypen per `--ausschluss` im Code lassen. Zeichengleichheit belegen mit `scripts/qa/inhalt-vergleich.mjs` (Playwright: innerText und `.katex`-Anzahl je Route und Reiter, Desktop + Mobil, alter gegen neuen Build). Anteil: `node scripts/qa/inhalt-anteil.mjs`. Nicht ausgelagert (Rechtstexte/Verwaltung bzw. von Tests im TSX gelesen): `Admin`, `Datenschutz`, `Impressum`, `Festbeton` (Lehrtabelle) und `Startseite` (`tests/startSchale.test.ts` vergleicht die statische Schale mit dem Quelltext).

## Zahlformat

Zahlen werden ausschließlich über `src/utils/numberFormat.ts` formatiert (Entscheidung Prof. Huber, 28.10.2026, nach DIN 5008 und DIN 1333):

- **Dezimalzeichen:** Komma (`0,40`; in KaTeX `0{,}40`).
- **Tausendertrennung:** schmales geschütztes Leerzeichen **U+202F** (`TAUSENDER_TRENNER`), gegliedert erst **ab 5 Stellen** vor dem Komma (`10 000`, `210 000`, `1 234 567`); **vierstellige Zahlen bleiben ungegliedert** (`2400`, Jahreszahlen `2024`). Gilt einheitlich in Fließtext (`content/**/*.json`, `src/data/*.ts`, Quiz), Rechnerausgaben, Tabellen, Diagrammachsen und Tooltips (`src/lib/chartBedarf.tsx`, `umgruppiereDe`), Textalternativen der Diagramme, PDF-Export und auch bei **Geldbeträgen** (`100 000 €`).
- **KaTeX:** `formatDeTeX`/`formatDeTeXWert` gliedern mit `\,` (U+202F hat im Mathe-Modus keine Schriftmetrik); handgeschriebene Formeln in `content/` ebenso (`210\,000`, aber `2400`).
- **Kein `toLocaleString` auf Zahlen:** Intl liefert für de-DE den Punkt. Statt `x.toLocaleString('de-DE', opt)` → `formatDeIntl(x, opt)` (gleiche Rundungsoptionen, Gliederung nach Projektregel; `useGrouping: false` bleibt ungegliedert). Datumsangaben (`Date#toLocaleString`) sind nicht betroffen.
- **Eingaben:** `parseDeZahl` akzeptiert U+202F, Leerzeichen und Punkt als Tausendertrenner.
- **CSV-/Excel-Export:** echte Zahlen ohne Gliederung (Tabellenkalkulation formatiert selbst).
- **Nicht umgestellt:** Normnummern (DIN EN 1992-1-1), Datumsangaben, Versionsnummern, Paragrafen, URLs, Code, BNB-Bauteilnummern.

Prüfung (Ratsche, Grenze 0): `node scripts/qa/zahlformat-tausender.mjs --check` meldet Tausenderpunkt oder normales Leerzeichen als Trenner, vierstellige Gliederung (U+202F oder `\,`) und direkte `toLocaleString`-Aufrufe in Anzeigetexten; `--show` listet die Fundstellen. Der Test `tests/zahlformatTausender.test.ts` (in `npm test`) prüft Erkennung und Bestand. Neue Fachtexte bitte gleich mit U+202F schreiben (Eingabe z. B. über die Zeichentabelle oder `\u202f` in JSON).

Vorher (bis 27.10.2026) galt die Projektkonvention Tausenderpunkt ab 4 Stellen; die Umstellung (PR „Zahlformat: Tausendertrennung mit schmalem Leerzeichen (DIN 5008)“) ist eine reine Formatänderung.

## Design

**Grundsatz „keine schwarzen Boxen“ (Prof. Huber, 28.10.2026):** Im Hellmodus erhalten Inhaltsboxen, Kopfboxen, Hinweisboxen, Mess-/Ergebnisanzeigen in Simulatoren, Code-/Prompt-Blöcke, Schaltflächen und Badges **keinen schwarzen oder sehr dunklen Hintergrund** (`bg-slate|gray|zinc|neutral|stone-800…950`, `bg-black`, `bg-text-main`, dunkle Verläufe). Achtung: `@theme` in `src/index.css` bildet blue/emerald/green/teal/cyan/sky/indigo/violet/purple/amber/yellow/orange auf die Slate-Stufen ab – `bg-orange-800` oder `bg-emerald-900` sind im Ergebnis ebenfalls schwarzgraue Flächen und fallen unter den Grundsatz. Einheitliche helle Muster:

| Element | Klassen |
|---|---|
| Kopf-/Hero-Box, Info-Box | `bg-shiraz/5 border border-shiraz/20 text-text-main` (Nebentext `text-slate-700`) |
| Mess-/Ergebnisanzeige | `bg-off-white border border-home-grau/30 text-text-main`, Bezeichnung `text-slate-600`, Ziffern fett in `text-text-main` bzw. `text-…-700` |
| Code-/Prompt-/Terminal-Block | `bg-off-white border border-home-grau/30 font-mono text-text-main` (in `bg-slate-50`-Karten `bg-white`) |
| Aktive Auswahl, Hauptschaltfläche | `bg-shiraz text-white border-shiraz` bzw. `bg-shiraz hover:bg-shiraz/90 text-white` |
| „Richtig“-Markierung (Quiz) | `bg-slate-200 text-text-main border-text-main` |
| Badge/Chip | `bg-shiraz/10 text-shiraz` oder `bg-white border border-home-grau/30 text-text-main` |

Der Dunkelmodus braucht dafür keine eigenen `dark:`-Klassen: die globalen `.dark`-Regeln in `src/index.css` bilden `bg-white`, `bg-off-white`, `bg-shiraz/5|10`, `text-text-main`, `text-slate-600|700`, farbige Textstufen und `border-home-grau/*` auf dunkle Flächen mit ≥ 4,5:1 ab; `bg-shiraz` wird dort `#be185d` (weiß 6:1).

Ausnahmen (bleiben dunkel, Liste mit Begründung in `scripts/qa/check-design.mjs`, `AUSNAHMEN`): Overlays/Backdrops hinter Dialogen (`bg-black/50` o. ä.), Tooltips, das REM-Sichtfeld der Zementchemie, Diagramm-Interna (Marker, Zeiger, Balken), Material- und Gerätedarstellungen (Stahlplatten der Prüfmaschine, Bitumen, Smartphone-Attrappe) sowie die Nachtvorschau der Lichtsimulation. Transparente Tönungen unter 50 % (`bg-black/10`) gelten nicht als dunkel. SVG-Bühnen (Schadensforensik, Bewehrungskorrosion, Kriechen/Schwinden, AKR-Gefüge, Youden-Plot) sind seit 28.10.2026 hell: Container-Klasse `svg-buehne` (src/index.css) setzt Grund und Farbvariablen `--bu-*` für hell/dunkel; Grafik nutzt `fill`/`stroke="var(--bu-…)"` (Text ≥ 4,5:1, Grafik ≥ 3:1 gegen den Bühnengrund).

Ratsche: `node scripts/qa/check-design.mjs [--liste]` und `tests/designDunkleBoxen.test.ts` (Grenze 0) melden jeden neuen dunklen Hintergrund ohne `dark:`-Variante außerhalb der Ausnahmeliste.

## Modultitel

**Regel (Gesamtgutachten 03.11.2026):** Jedes Modul hat genau zwei Namen aus der Registry (`src/registry/modules.ts`):

| Name | Feld | Wo |
|---|---|---|
| Kurzform | `label` | Menü, Brotkrumen, Mobil-Kopfleiste, Startseiten-Kacheln, Teilmodul-Reiter (dort steht der Gruppen- bzw. Bereichskontext daneben) |
| Modultitel | `baum.titel` | Hauptüberschrift (h1), sichtbare Modulüberschrift, Fenstertitel und `<title>`/og:title der vorgerenderten Seite, Volltexttreffer, Lernziel-Querverweise, Modulnamen im Quiz (aus der Registry, `src/data/quizModell.ts`), PDF-Kopf, Modulübersicht |

Der Titel ist das Label oder das Label mit Zusatz („Feuchteschutz & Tauwasser (Glaser-Verfahren)“, „Klausurtraining Rückbau & Schadstoffe“): Jedes Wort des Labels (ohne Klammerzusatz) steht im Titel. Die sichtbare Modulüberschrift (erste h2 im Modulinhalt) nennt das Modul ebenso; ausgenommen sind Bereichsüberschriften geteilter Komponenten (mehrere Module als Reiter einer Seite) und die „Bereich: …“-Überschriften der Modulinfos (`AUSNAHMEN_UEBERSCHRIFT` in `scripts/qa/modultitel.mjs`, darf nur schrumpfen). Prüfung: `node scripts/qa/modultitel.mjs` (nach dem Build auch die Überschriften) und `tests/modultitel.test.ts`.

## QA-Skripte

| Befehl | Prüfung |
|---|---|
| `npx tsc --noEmit` (`npm run lint`) | Typen |
| `npm test` | alle `tests/*.test.ts` (Registry, Rechenkerne, Daten, Sitemap, Komponenten …) |
| `npm run check:formeln` | KaTeX-Formeln |
| `npm run check:zahlen` | deutsches Zahlenformat |
| `npm run check:quellen` | Quellenangaben |
| `npm run build` + `node scripts/qa/check-bundle.mjs` | Build und Bundle-Budget |
| `node scripts/qa/inhalt-anteil.mjs` | Anteil der Fachtexte in `content/` (AP 5.3) |
| `node scripts/qa/check-verwaist.mjs [--strict]` | Dateien unter `src/`, die von `src/main.tsx` aus nicht erreichbar sind |
| `node scripts/qa/klassengrenzen-abgleich.mjs [--alle]` | Klassengrenzen PFAS/LAGA M 20/EBV in Fachtexten und Quiz gegen `src/data/klassengrenzen.ts` (Ratsche `tests/klassengrenzen.test.ts`) |
| `node scripts/qa/modultitel.mjs [--dist dist]` | Regel Modultitel (Abschnitt Modultitel) |
| `node scripts/qa/check-design.mjs [--liste]` | Designgrundsatz „keine schwarzen Boxen“: neue dunkle Hintergründe im Hellmodus außerhalb der Ausnahmeliste (Abschnitt Design) |
| `scripts/qa/a11y.mjs`, `layout-mobil.mjs` | Barrierefreiheit / Mobil-Layout (Playwright, eigener Workflow `a11y.yml`; in PRs Desktop auf allen Routen, Mobil auf Stichprobe + betroffenen Routen aus `a11y-routen.mjs`) |
| `node scripts/qa/a11y-diagramme.mjs [--basis URL] [--routen a,b]` | Diagramm-Textalternativen (Z8) auf 3 Diagrammrouten hell/dunkel/mobil: `role="img"` + `aria-label` je Leinwand, alle Datentabellen geöffnet (caption, `th scope`), axe auf die Diagrammhüllen, Druckansicht (Job `a11y` in `a11y.yml`) |
| `node scripts/qa/e2e-pdf.mjs [--basis URL]` | PDF-Export (Kopfleiste, LCC-Gutachten), Druckknöpfe der Module, Labor-Prüfbericht und Druckansicht: gültige PDF-Datei, alle Diagramme gezeichnet, keine Formel-/Diagramm-/Abschnittsplatzhalter (Playwright, Job `pdf-druck` in `a11y.yml`) |
| `scripts/qa/inhalt-vergleich.mjs` | Zeichengleichheit zweier Builds (innerText, Formeln, Seitenfehler je Route/Reiter; Playwright) |
| `node scripts/qa/e2e-smoke.mjs [--basis URL]` | E2E-Smoke: je Meta-Cluster I–VI eine Route – eine h1 mit Modultitel, keine Seitenfehler, Lernziele und Selbsttest vorhanden (Playwright, siehe unten) |

| `scripts/qa/perf-messung.mjs` | LCP/CLS/TBT/Klick-Latenz mobil gedrosselt → `docs/performance.md` (Playwright, nicht in der CI) |

### Komponententests

`tests/komponenten-*.test.ts` rendern zentrale Bausteine (Modulkopf, Selbsttest, Reiter, Formeln, Hinweise, Suche) mit `react-dom/server` (`renderToStaticMarkup`) und prüfen das HTML – ohne Testing Library/Vitest und ohne DOM. `tests/hilfen/komponenten.ts` stellt `rendere()` (mit `LanguageProvider` › `TabProvider` wie in der App), einen kleinen Testläufer und einen Lade-Hook bereit – für `react-katex` (UMD-Bundle ohne ESM-Exporte) und für `virtual:quiz-pool…` (Quelltexte erzeugt das Vite-Plugin `scripts/quizPool.ts` aus `quiz.json`); Komponenten werden deshalb erst danach per `await import(...)` geladen. Interaktionslogik, die sich ohne DOM nicht auslösen lässt, liegt als reine Funktion neben der Komponente (z. B. `reiterZiel` in `ModuleTabs`, `zielBeiGruppenwechsel` in `GruppierteModuleTabs`).

### E2E-Smoke (Playwright, nicht in package.json)

```bash
npm i -g playwright            # einmalig, oder: npm i --no-save playwright
npx vite build                 # Frontend nach dist/
npx vite preview --port 4207 --strictPort &
node scripts/qa/e2e-smoke.mjs  # Chromium: $CHROMIUM_PATH, sonst /opt/pw-browsers/chromium, sonst Playwright-Browser
```

Das Skript nutzt ein lokales, sonst das globale Playwright (`npm root -g`). `/api/*`-Antworten werden ignoriert, weil `vite preview` kein Express-Backend hat. Exit-Code 1 bei einer fehlgeschlagenen Route.

Alle Prüfungen außer den Playwright-Skripten laufen in `.github/workflows/qa.yml` bei Push auf `main` und bei Pull Requests; `a11y.mjs`, `layout-mobil.mjs` und `e2e-pdf.mjs` laufen in `.github/workflows/a11y.yml` (ebenfalls bei Pull Requests, dort mit eingeschränkter Mobil-Auswahl).

## Arbeitsablauf

- **GitHub ist die einzige Quelle** (single source of truth). Änderungen nur über Branches/Pull Requests mit grüner QA.
- **Google AI Studio nur zum Pull** von `main` und zum Veröffentlichen (Cloud Run) – dort keine Änderungen am Code. Künftig (Weg B): Cloud Run baut per Cloud Build direkt aus `main` mit dem `Dockerfile`; Anleitung `docs/betrieb-cloud-run.md`.
- Abhängigkeiten: `renovate.json` (wöchentlich, Minor/Patch gebündelt, Label `dependencies`, kein Automerge); wirksam, sobald die Renovate-App für das Repository aktiviert ist.
- Laufzeitdaten: Besuchszähler `analytics.json` und Kurzfragebogen `laufzeitdaten/kurzfragebogen.json` (änderbar per `FEEDBACK_DATEI`) liegen als Dateien im Container und sind per `.gitignore` vom Repository ausgeschlossen. Auf Cloud Run sind sie flüchtig (Neustart/neue Revision) und gelten je Instanz – außer der Kurzfragebogen, wenn wie in `docs/betrieb-cloud-run.md` beschrieben ein Cloud-Storage-Volume unter `/app/laufzeitdaten` eingehängt ist (höchstens eine Instanz, da FUSE keine Dateisperren kennt). Der Kurzfragebogen speichert nur Zählwerte je Semester und Aussage sowie Freitexte ohne Metadaten (`server/kurzfragebogen.ts`, Definitionen und Prüfung in `src/data/kurzfragebogen.ts`).
- Betrieb: `GET /api/health` liefert `{ status, version, uptime }` ohne personenbezogene Daten. Client-IPs werden nur im Arbeitsspeicher der Anfragebegrenzung gehalten (abgelaufene Einträge werden regelmäßig entfernt), nicht geloggt oder gespeichert.
