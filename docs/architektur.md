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
| Zustand | `src/contexts/TabContext.tsx` | aktives Modul ↔ URL-Hash (`#modul_id`), Theme, Anzeigeoptionen |
| Module | `src/modules/*.tsx` | Fachmodule (Darstellung); große Teilansichten in Unterordnern (z. B. `modules/holz/HolzSchwinden3D.tsx`) |
| Fachtexte | `content/<modul>/<Datei>.json` | Fließtexte, Tabellen, Listen, Glossare der Module – ohne TSX bearbeitbar (siehe „Inhalte bearbeiten“) |
| Rechenkerne | `src/calc/*.ts` | reine, getestete Rechenfunktionen ohne React (Tests in `tests/`) |
| Daten | `src/data/*` | Inhalte und Kennwerte (Quiz `quiz.json`, Lernziele, Erkundung, Rechnergrenzen, Versionen …) |
| Fragenpool | `src/data/quiz.json` → `scripts/quizPool.ts` (Vite-Plugin) → `src/data/quizLader.ts` | Fragen im Browser je Modul bzw. in Teilpaketen nachladen (siehe unten); Typen/Kategorien in `quizModell.ts` |
| Server | `server.ts`, `server/` | Express: statische Auslieferung, Gemini-Proxy, Abstimmungen, Admin, Kurzfragebogen (`POST /api/feedback`, `GET /api/feedback/stats` nur Admin), `GET /api/health` |

Neues Modul: Eintrag in `src/registry/modules.ts` + Zeile in `src/routing/ModulInhalt.tsx` (lazy import und `activeTab === '<id>'`). `tests/registry.test.ts` prüft, dass jede ID dort verdrahtet ist, und dass `App.tsx` ≤ 800 Zeilen bleibt.

Fachmodule brauchen außerdem einen Prüfvermerk in `src/data/pruefvermerke.ts` (neu: `{ status: 'offen' }`; `tests/pruefvermerke.test.ts`). `ModulKopf` zeigt „Fachlich geprüft am … von …“ bzw. „Fachliche Prüfung ausstehend“; der Admin-Bereich („Meine Module“) listet alle Vermerke nach Cluster, Pate (`src/data/paten.ts`) und Status (Redaktionsmodell, AP 6.6).

## Ladeverhalten (Bundle-Budget)

- Einstiegs-Chunk enthält nur Layout, Navigation, Registry und React. Module, Modulkopf, Modul-Selbsttest, Abstimmungsansicht und SEO-Audit werden nachgeladen.
- three.js / @react-three nur in den 3D-Teilansichten von Holz und Mauerwerk (`React.lazy` innerhalb des Moduls).
- Große Teilansichten neuer Module ebenso per `React.lazy` + `<React.Suspense>` auslagern.
- `scripts/qa/check-bundle.mjs` prüft die gzip-Größen als Ratsche (Einstieg ≤ 140 kB, jeder Chunk ≤ 300 kB, keine Ausnahmen).
- Schriften: Inter Regular/Bold als WOFF2-Teilmenge in `public/fonts/` (`font-display: swap`, Regular per Preload). Neue Sonderzeichen außerhalb der Teilmenge erscheinen in der Fallback-Schrift – dann Teilmenge neu erzeugen (Befehl in `docs/performance.md`).
- Messung (LCP, CLS, TBT-Näherung, Klick-Latenz): `scripts/qa/perf-messung.mjs`, Ergebnisse in `docs/performance.md`.

### Ladezeit (AP 5.5)

| Baustein | Wirkung |
|---|---|
| `scripts/modulKopf.ts` (Vite-Plugin, `virtual:modul-kopf`) → `src/routing/modulKopfDaten.ts` | Lernziele, Kurzfassung, Erkundung, Rechner-Grenzen je Modul als eigener Chunk (≈ 1–2 kB) statt eines 87-kB-Chunks; Quelle bleiben `src/data/{lernziele,kurzfassung,erkundung,rechnerGrenzen}.ts` (Tests lesen sie direkt, `tests/ladezeit.test.ts` vergleicht) |
| `scripts/modulVorladen.ts` + `scripts/vorladen-boot.js` | Karte „Modul-ID → Chunks“ als JSON in `dist/index.html`, Inline-Skript setzt anhand des URL-Hashes sofort `modulepreload` (ModulInhalt, Modulkopf, Kopfdaten, Modul-Chunk samt Importen). Zuordnung aus `ModulInhalt.tsx` gelesen; CSP-Hash berechnet `server.ts` aus `dist/index.html` |
| `modulBasisChunks()` (manualChunks) | gemeinsame Modulbausteine → `modul-basis`, Icons außerhalb des Einstiegs → `icons`, statischer Einstiegsgraph → `app`; eine Modulseite lädt ~7–14 statt 20–35 Dateien |
| `scripts/bedarfsLaden.ts` | lenkt `react-katex`, `react-chartjs-2`, `chart.js` aus `src/` auf `src/lib/katexBedarf.tsx`, `chartBedarf.tsx`, `chartJsBedarf.ts` um: KaTeX/Chart.js laden erst, wenn ein Chunk mit Formeln/Diagrammen läuft; Diagramme werden erst bei Sichtbarkeit gezeichnet (eins je Task, vor Druck/PDF-Export alle). Module bleiben unverändert; Tests (tsx) nutzen die echten Pakete. KaTeX-CSS bleibt im Haupt-CSS |
| `src/lib/diagrammAlternative.tsx`, `diagrammDaten.ts` | Textalternative für jedes Chart.js-Diagramm (Paket Z8, WCAG 1.1.1/1.3.1), eingebunden in `chartBedarf.tsx`: `aria-label` mit Kurzbeschreibung (Art, Titel, Reihen, Wertebereiche) aus `data`/`options`, Schaltfläche „Daten als Tabelle anzeigen“ (Tabelle mit `caption`/`th scope`, lange Reihen ausgedünnt), im Druck die Kurzbeschreibung. Modulspezifisch: `aria-label` am Diagramm oder `<DiagrammAngaben zusammenfassung einheiten titel tabelle>` um das Diagramm |
| `src/components/ui/NachErstemBild.tsx` | rendert Abschnitte unterhalb des Bildausschnitts nach dem ersten Bild, je Abschnitt eine Task (Mischungsberechnung, Biegebemessung, Feuchteschutz); im Bild sofort, beim Drucken alles |

Neue große Rechnerseite: Abschnitte unterhalb der ersten Bildschirmhöhe in `<NachErstemBild minHoehe="…">` fassen, wenn `perf-messung.mjs` TBT > 200 ms meldet. Neue Diagramm-/Formelbibliotheken nicht direkt in den Einstieg ziehen.

### Fragenpool (AP 5.4)

`src/data/quiz.json` ist die **einzige Quelle** der Quizfragen; Tests (`tests/quiz.test.ts`, `tests/begriffe.test.ts`) und Skripte (`scripts/quiz-freigabe.mjs`, `scripts/qa/metriken.mjs`) lesen sie direkt. Für den Browser teilt das Vite-Plugin `scripts/quizPool.ts` (eingebunden in `vite.config.ts`) die Datei beim Build und im Dev-Server in virtuelle Module – es entstehen keine generierten Dateien im Repository, also auch nichts, das veralten kann:

| Virtuelles Modul | Inhalt | gzip | genutzt von |
|---|---|---|---|
| `virtual:quiz-pool` | Anzahl Fragen je `moduleId` + Lader | 5,5 kB (mit `quizLader`) | `ModulTest`-Kopfzeile, Lernziele-Kopfzeile, Cluster-Angabe in Aufgaben |
| `virtual:quiz-pool/quiz-modul-<id>` | Fragen eines Moduls | 0,9–4,7 kB | `ModulTest` |
| `virtual:quiz-pool/quiz-teil-1…4` | zusammenhängende Viertel des Pools | je 94–99 kB | Quiz, Klausursimulator, Quiz-Dashboard, Fragenfreigabe (parallel) |

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
- **Google AI Studio nur zum Pull** von `main` und zum Veröffentlichen (Cloud Run) – dort keine Änderungen am Code.
- Abhängigkeiten: `renovate.json` (wöchentlich, Minor/Patch gebündelt, Label `dependencies`, kein Automerge); wirksam, sobald die Renovate-App für das Repository aktiviert ist.
- Laufzeitdaten: Besuchszähler `analytics.json` und Kurzfragebogen `laufzeitdaten/kurzfragebogen.json` (änderbar per `FEEDBACK_DATEI`) liegen als Dateien im Container und sind per `.gitignore` vom Repository ausgeschlossen. Auf Cloud Run sind sie flüchtig (Neustart/neue Revision) und gelten je Instanz; für dauerhafte Auswertung wäre ein externer Speicher nötig. Der Kurzfragebogen speichert nur Zählwerte je Semester und Aussage sowie Freitexte ohne Metadaten (`server/kurzfragebogen.ts`, Definitionen und Prüfung in `src/data/kurzfragebogen.ts`).
- Betrieb: `GET /api/health` liefert `{ status, version, uptime }` ohne personenbezogene Daten. Client-IPs werden nur im Arbeitsspeicher der Anfragebegrenzung gehalten (abgelaufene Einträge werden regelmäßig entfernt), nicht geloggt oder gespeichert.
