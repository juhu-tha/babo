# Technik-Gesamtlauf 30.10.2026: Links, Barrierefreiheit, Konsole

**Stand:** origin/main bis #282 (Läufe), danach #283 eingemergt (Nachprüfung der geänderten Routen).
**Umfang:** alle Inhalte (`src/`, `content/`), alle 297 Routen der Modul-Registry (ohne `admin`), alle Reiter.
**Fachliche Werte:** unverändert. Nicht berührt: `src/data/gwpLehrwerte.ts`, `src/data/pruefvermerke.ts`, `docs/pruefung/durchsicht-*.md`.

## Zusammenfassung

| Prüfung | geprüft | Befunde | behoben | offen |
|---|---|---|---|---|
| Links (`scripts/qa/link-check.mjs`) | 920 URLs in 352 Dateien | 11 nicht erreichbar, 36 nicht automatisch prüfbar, 117 dauerhafte Weiterleitungen | 0 (kein Ersatz aus der Websuche eindeutig) | 11 + 36 (alle bekannt, siehe 1.) |
| Barrierefreiheit (`a11y-reiter.mjs --alle`, desk/mob/desk-dunkel) | 4107 Reiter-Prüfungen auf 297 Routen | **0 Verstöße** | – | 0 |
| Keine schwarzen Boxen im Hellmodus | 20 zuletzt geänderte Routen, hell + dunkel, alle Reiter | 0 dunkle Flächen im Hellmodus | – | 0 |
| Konsole, Produktions-Build | 298 Seiten (297 Routen + Start), alle Reiter | 4 echte Befundarten | 1 (U+202F in KaTeX, 45 Stellen) | 2 (‰-Metrik, THREE.Clock) |
| Konsole, Entwicklungsmodus (React-Warnungen) | 298 Seiten, alle Reiter | 0 React-key-Warnungen | – | 0 |
| QA aus dem Brief | tsc, npm test (167 Testdateien), check:formeln, check:zahlen, check-design, check-verwaist --strict, check-any, Build, check-bundle | alle grün | – | – |

## 1. Linkprüfung

Werkzeug unverändert, Regeln laut `docs/linkcheck/README.md` (robots.txt, HEAD vor GET, 2 s je Host, Wikipedia über die API). Ausgeführt über den Proxy (`NODE_USE_ENV_PROXY=1`), ohne Cache, Dauer 524 s.

| Ergebnis | Anzahl |
|---|---|
| externe URLs (verschieden) | 920 in 352 Dateien (Vortag: 919) |
| erreichbar | 726 |
| Weiterleitung (dauerhaft / vom Werkzeug als sicher ersetzbar eingestuft) | 147 (117 / 73) |
| nicht erreichbar | 11 |
| manuell prüfen (robots.txt, Bot-Schutz, Rate-Limit) | 36 |

### Nicht erreichbar (11) – kein neuer Defekt

Alle 11 sind aus dem Bericht vom 29.10. ([bericht-2026-10-29.md](../linkcheck/bericht-2026-10-29.md)) bekannt und kein echter Defekt der Quelle:

| URL | Befund | Bewertung |
|---|---|---|
| app.tha.de (2 Formen), www.dgnb-navigator.de (2), www.ift-rosenheim.de, feralpigroup.com (EPD-PDF) | Zertifikatskette unvollständig (UNABLE_TO_VERIFY_LEAF_SIGNATURE) | Server-Konfiguration der Quelle; im Browser erreichbar. Belassen. |
| baustoffboard.de, www.baustoffboard.de | Verbindung vom Proxy zurückgesetzt | eigene Website. Belassen. |
| github.com | HTTP 400 vom Proxy | Belassen. |
| github.com/juhu-tha/babo | HTTP 404 | privates Repository (nur Admin-Bereich). Belassen. |
| www.geoportal.de | HTTP 400 bei automatischen Abrufen | bekannt. Belassen. |

### Dauerhafte Weiterleitungen

Die alten Adressen funktionieren weiter. Ersetzt wird nach Vorgabe nur durch einen Treffer aus der Websuche. Für die vier inhaltlich relevanten Umzüge ergab die Suche keine eindeutige Zieladresse. Daher wurde **nichts ersetzt**:

| URL (alt) | Weiterleitung auf | Websuche | Maßnahme |
|---|---|---|---|
| https://www.tha.de/TTZ-Aichach.html (`src/modules/WeiterTHA.tsx:253`) | /forschung/technologietransfer/technologietransferzentren/ttz-aichach/ | nur englische Seite (/en/research/…/ttz-aichach/) und Unterseiten | belassen; Weiterleitung führt auf die deutsche Seite |
| https://www.vdi.de/richtlinien/details/vdi-6200-… (`src/modules/materialschaedengross/daten.ts:168` u. a.) | /mitgliedschaft/vdi-richtlinien/details/vdi-6200-… | Treffer mit anderem Pfad (englischer Slug) | belassen |
| https://www.bmdv.bund.de/, https://bmdv.bund.de/ (3 Fundstellen) | https://www.bmv.de/ (Ministerium umbenannt) | kein Treffer auf bmv.de | belassen; bei der nächsten Linkprüfung erneut suchen |
| https://www.bauen-neu-denken.de/ (`content/carbonbeton/Carbonbeton.json:68`) | https://carbon-concrete.org/ (andere Domain) | kein Treffer auf carbon-concrete.org | belassen |

Die übrigen Weiterleitungen sind Wikipedia-Lemma-Umbenennungen (73, sicher ersetzbar) sowie `www.` → ohne `www.` oder Sprachpfade. Sie funktionieren und sind Teil der monatlichen Z16-Ersetzung (`--ersetzen`). Einzeln nachgesucht wurden sie wegen des knappen Suchkontingents nicht.

### Manuell prüfen (36)

Wie am 29.10.: eur-lex.europa.eu (7, robots.txt nicht abrufbar), github.com-Lizenzseiten (7, 403), baua.de (4, 403), iso.org (2), onlinelibrary.wiley.com (2), astm.org, sciencedirect.com, tandfonline.com, scite.ai, theresanaiforthat.com, echa.europa.eu, oekobaudat.de (Datenbestand), doi.org (429), bauen-wohnen.sachsen.de (Zeitüberschreitung bei robots.txt), infoguide.hs-augsburg.de, tib.eu, irb.fraunhofer.de, usgbc.org/leed (robots.txt), windows.lbl.gov/software/therm (Crawl-delay 90 s). Nicht umgangen.

## 2. Barrierefreiheit

- Lauf: `scripts/qa/a11y-reiter.mjs --alle` in 24 Teilen (`--teil k/24`), Modi `desk`, `mob`, `desk-dunkel`, gegen den Produktions-Build (`node dist/server.cjs`, Port 4498). Prüfregeln: WCAG 2.1 A/AA und WCAG 2.2 AA (`target-size`). Bewertet werden alle Schweregrade, ohne Baseline.
- Ergebnis: **4107 Reiter-Prüfungen auf 297 Routen, 0 Verstöße**. Die 8 Lernpfad-Routen (`lehrveranstaltungen`, `lv_*`) liefern derzeit absichtlich die Hinweisseite „Lernpfade derzeit nicht verfügbar“ (404). Diese Seite wurde mitgeprüft.
- Nach dem Merge von #283 (Kopfleiste) und der KaTeX-Änderung wurden die betroffenen Routen erneut geprüft (siehe 4.).

### Stichprobe „keine schwarzen Boxen im Hellmodus“

Für die 20 zuletzt geänderten Routen (nach letztem Commit an Komponente bzw. `content/`) wurde je ein Bildschirmfoto hell und dunkel (1440 × 900) erstellt. Geprüft wurden außerdem alle Reiter automatisch: Gesucht wurde jede Fläche ab 6000 px² in `main` mit deckendem Hintergrund und relativer Leuchtdichte ≤ 0,05.

Routen: analytik, mechanische_pruefungen, messen_pruefen, statistik, labor_potentialmessung, innovative_werkstoffe, korrosion, schnellkarbonatisierung, wu-bauwerke, metallkorrosion, weitere_organik, rechnung_u_wert, rechnung_beton, rechnung_stahlbeton, rechnung_holzbau, rechnung_mauerwerk, rechnung_nachhaltigkeit, rechnung_bestand, rechnung_schallschutz, rechnung_brandschutz.

Ergebnis: **0 dunkle Flächen im Hellmodus.** Die Sichtprüfung der 40 Bilder bestätigt das. Einzige kräftige Fläche ist die Ergebnisbox „Nachweisergebnis“ in `wu-bauwerke`: Bordeaux-Verlauf in der Hausfarbe, nicht schwarz. `check-design` lässt sie zu (65 begründete Ausnahmen, 0 neue).

## 3. Konsole

Eigenes Playwright-Skript (scratchpad `pw/gl30-konsole.mjs`). Es lädt jede Route, klickt alle Reiter (eine Ebene verschachtelt) und sammelt `console.error`/`console.warn`, `pageerror`, fehlgeschlagene Anfragen und HTTP-Status ≥ 400 der eigenen Seite.

### Produktions-Build (298 Seiten)

| Befund | Seiten | Bewertung | Maßnahme |
|---|---|---|---|
| KaTeX: `Unrecognized Unicode character " " (8239)` und `No character metrics for ' '` | holzbau_bemessung | Echter Fehler. Seit der Tausendertrennung mit U+202F (PR „zahlformat“) erzeugt `formatDeZahl` ab 5 Stellen U+202F. Das Zeichen landete über KaTeX-Vorlagen in Formeln. | **behoben:** 45 Stellen in 5 Dateien auf `formatDeTeX`/`formatDeTeXWert` umgestellt (Tausender `\,`, Komma `{,}`). Betroffen: `Bestand.tsx`, `Betonpraxis.tsx`, `Zementchemie.tsx` (Modul bindemittel), `betonkennwerte/RechnerTab.tsx`, `holzbaubeta/HolzbauBemessung.tsx`. Werte unverändert. |
| KaTeX: `No character metrics for '‰'` (Mathe- und Textmodus) | 12 Routen, u. a. stahlbeton_bemessung, betonkennwerte, mechanische_kenngroessen, baustoffkenngroessen, hydratation_folgen | Die KaTeX-Schriften enthalten kein ‰. 34 Formeln nutzen nach Projektkonvention (Commit b496ea7b) `\char8240`. Das Zeichen wird korrekt aus der Systemschrift gesetzt. Nur die Höhe wird geschätzt, die Warnung bleibt. | **offen** (Entscheidung nötig, siehe 5.) |
| `THREE.Clock: This module has been deprecated` | mauerwerk (Reiter „Festigkeit & Bemessung“, 3D-Ansicht) | Kommt aus `@react-three/fiber` 9.8 (intern), nicht aus eigenem Code | **offen**: verschwindet mit einem Update von `@react-three/fiber`. package.json wurde in diesem Lauf nicht geändert. |
| `/api/analytics/visit` 429 | Lauf mit schnell aufeinanderfolgenden Aufrufen | Ratenbegrenzung des Servers greift wie vorgesehen | kein Fehler |
| `/modul/lv_*`, `/modul/lehrveranstaltungen` 404 | 8 | Lernpfade absichtlich abgeschaltet (server.ts, 27.10.2026) | kein Fehler |
| `quiz-modul-px_produktion-….js` ERR_ABORTED | px_bauleitung | Ladevorgang durch Seitenwechsel des Skripts abgebrochen | kein Fehler |

Laufzeitfehler (`pageerror`) im Produktions-Build: **0**.

### Entwicklungsmodus (React-Warnungen)

Die Warnung zu fehlenden `key`-Props gibt React nur im Entwicklungsmodus aus. Deshalb gab es einen zweiten Lauf gegen `tsx server.ts` (Vite-Dev, Port 4499, StrictMode), wieder mit allen Reitern.

- **React-key-Warnungen: 0.** Weitere React-Warnungen: 0.
- Nur in diesem Lauf und durch die Umgebung bedingt, nicht reproduzierbar bzw. ohne Bezug zur App:
  - 403 auf KaTeX-Schriften. Ursache: `node_modules` liegt als Symlink außerhalb des Arbeitsverzeichnisses (Vite `fs.allow`).
  - 500 auf `/api/analytics/visit`, weil der Dev-Server ohne Datenbank läuft.
  - Einmalig nach „Re-optimizing dependencies“ (Vite lud chart.js neu):
    - `"radialLinear" is not a registered scale` und `Canvas is already in use` (materialkennwerte)
    - 11 × `use()`-Fehler

  Ein erneuter Einzelaufruf von holz und materialkennwerte nach der Optimierung zeigte keinen dieser Fehler. Im Produktions-Build traten sie nie auf.

## 4. Nachprüfung nach Merge #283 und KaTeX-Änderung

Neuer Build mit main bis #283 und den geänderten Modulen.

- Geprüfte Routen: die 5 geänderten (`bestand`, `betonkennwerte`, `betonpraxis`, `holzbau_bemessung`, `bindemittel`) und 4 Kontrollrouten für die Kopfleiste aus #283 (`start`, `stahlbeton_bemessung`, `wu-bauwerke`, `analytik`).
- a11y-reiter (desk, mob, desk-dunkel): **159 Reiter-Prüfungen, 0 Verstöße.**
- Konsole: in `holzbau_bemessung` **keine U+202F-Warnung mehr**. Übrig sind nur die offenen ‰-Metrik-Hinweise (betonkennwerte, stahlbeton_bemessung).
- QA (Brief): `tsc --noEmit` ok, `npm test` 167/167 ok (vor dem Merge von #283; #283 ändert nur Kopfleiste und Test `komponenten-modulkopf`), `check:formeln` 4498 Formeln / 0 fehlerhaft / 0 strict, `check:zahlen` 0 Funde (Tausender-Ratsche 0), `check-design` 0 neu, `check-verwaist --strict` 0, `check-any` 0, Build ok (288 vorgerenderte Modulseiten), `check-bundle` Budget eingehalten.

## 5. Offen / Entscheidung nötig

| Nr. | Punkt | Vorschlag |
|---|---|---|
| O-1 | ‰ in 34 KaTeX-Formeln (`\char8240`) erzeugt die Konsolenwarnung „No character metrics“. Die Darstellung ist korrekt (Systemschrift). | a) belassen (rein kosmetische Warnung) oder b) in Formeln „· 10⁻³“ bzw. „mm/m“ schreiben und ‰ nur im Fließtext verwenden. Für b) ist eine didaktische Entscheidung nötig: ‰ ist im Stahlbeton üblich. |
| O-2 | `THREE.Clock`-Hinweis aus `@react-three/fiber` | beim nächsten Abhängigkeits-Update (Renovate) mitnehmen |
| O-3 | 11 nicht erreichbare und 36 nicht automatisch prüfbare Links (siehe 1.) | im Browser stichprobenartig öffnen. Für bmdv.bund.de → bmv.de und tha.de/TTZ-Aichach bei der nächsten Linkprüfung erneut nach der neuen Adresse suchen. |

## Werkzeuge und Rohdaten

- Linkbericht des Laufs: maschinenlesbar im Scratchpad, nicht eingecheckt. `docs/linkcheck/2026-10.md` bleibt der Monatsbericht des Workflows.
- a11y: 24 Teil-Logs, je „0 Verstöße“.
- Konsole: `konsole-prod.json` (89 Einträge), `konsole-dev.json` (5431 Einträge, davon 1695 Schrift-403 aus der Umgebung).
