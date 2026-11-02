# LCP der Modulseiten – lokale Messung und Senkung (02.11.2026)

Anlass: Live-Prüfung `docs/pruefung/vercel-live-2026-11-02.md` (Branch `qa/vercel-live-11-02`): `mischungsberechnung`, `glas`, `oekobilanz_lca` mit LCP 3,9–4,2 s (Fast 3G, 4× CPU). Ziel AP 5.5: LCP < 2,5 s (`docs/performance.md`). Die Live-Werte stammen aus alten Hash-Links (`/#<id>`) **ohne** vorgerenderte Modulseite (damals B1/B2); hier gemessen ist die vorgerenderte Seite `/modul/<id>` (= `dist/modul/<id>.html`), wie sie Vercel mit `cleanUrls` ausliefert.

## Messverfahren

- Build wie Vercel (`BB_STATISCH=1 npm run build`, `server.cjs` entfernt, `404.html`), ausgeliefert mit `scripts/qa/vercel-vorschau.mjs` (statischer Dateiserver mit den Regeln aus `vercel.json`). Neu: die Vorschau komprimiert Text-Dateien wie Vercel (Brotli, sonst gzip) – ohne Kompression wären die Werte unter „Fast 3G“ unbrauchbar. HTTP/1.1 (Vercel: HTTP/2).
- Drosselung und Kennwerte wie `scripts/qa/perf-messung.mjs`: Mobil 390 × 844, 4× CPU, „Fast 3G“ (562,5 ms RTT, 1,44 Mbit/s), Cache aus.
- Auswahl: Durchlauf über alle 288 Modulseiten (1 Lauf je Seite, eigenes Skript im Arbeitsordner, Median 2,23 s, 39 Seiten ≥ 2,5 s). Die 10 langsamsten plus die drei Seiten der Live-Prüfung, `lebenszyklus_kosten` (größter Erstpfad) und `start` dann mit `perf-messung.mjs` (3 Läufe, Median), vorher und nachher je Seite abwechselnd auf zwei Servern.
- Die Maschine war durch parallele Prüfläufe anderer Arbeitspakete belastet (Last 5–9 auf 2 Kernen): TBT streut um ± 100–200 ms und ist hier nicht aussagekräftig; LCP/FCP streuen ± 0,1 s.

## Ursachen

1. **Der Erstpfad konkurriert mit dem CSS.** Das erste Bild der vorgerenderten Seite (= LCP, `bb-schale`) braucht nur HTML und CSS. Das Vorlade-Skript stand aber vor dem Stylesheet und forderte sofort 8–23 Modul-Chunks (90–235 kB gzip) an; unter der Drosselung teilen sich alle laufenden Abrufe die Bandbreite. Beispiel `lebenszyklus_kosten`: CSS (43 kB) fertig erst nach 2,05 s, FCP/LCP 2,29 s.
2. **Vorlade-Karte für alle Module in jeder Seite:** 30,8 kB roh bzw. ≈ 11 kB komprimiert – ein Drittel der HTML-Datei, gebraucht wird je Seite ein Eintrag.
3. **jsPDF im Erstpfad:** `src/modules/LCC.tsx` importierte `pdfExport` statisch → jsPDF + html-to-image (≈ 125 kB gzip) wurden auf `lebenszyklus_kosten` sofort vorgeladen, obwohl nur der PDF-Export sie braucht.
4. **Fehlende Vorlade-Listen:** Für `spannbeton_grundlagen`, `spannbeton_kennwerte`, `bodenmechanik`, `ttz_weiterbildung` und `admin` war die Liste leer (Modul ohne eigenen Fassaden-Chunk; `scripts/modulVorladen.ts` fand es nicht). Der Modul-Chunk kam erst nach dem Einstieg.
5. **Spätes LCP durch die Schrift:** Inter wird nach dem ersten Bild per `FontFace` eingesetzt. Ersetzt React die statische Seite erst danach, zeichnet es neue Knoten schon in Inter – minimal breiter als in der Ersatzschrift – und der Browser meldet sie als neues LCP-Element. `ttz_weiterbildung` (wegen 4. besonders spät): LCP 4,9 s statt 1,9 s; `mechanische_kenngroessen`, `daemmstoffe`, `bestand_info` gelegentlich (3,9–5,9 s im Durchlauf).
6. Nicht im Erstpfad (geprüft): KaTeX (lädt bei Bedarf), Chart.js (ebenso), three.js (`shapes`, nur 3D-Ansichten), recharts (Quiz-Dashboard), xlsx (Excel-Download). Bilder: keine im sichtbaren Bereich der gemessenen Seiten. Die Hydration (React ersetzt die Seite in einer Transition) bestimmt TBT, nicht LCP.

## Maßnahmen

| Nr. | Änderung | Datei |
|---|---|---|
| 1 | Vorlade-Karte und Vorlade-Skript in den vorgerenderten Modulseiten **hinter** das Stylesheet: Das Skript läuft erst nach dem CSS, HTML und CSS haben die Bandbreite (nur mit dem Einstieg geteilt). Inhalt der Inline-Skripte unverändert (CSP-Hashes gleich); `dist/index.html` (Startseite, 404) unverändert. | `scripts/vorrendern.ts` (`vorladenFuerSeite`) |
| 2 | Karte je Modulseite auf das eigene Modul gekürzt (gleicher Aufbau): HTML 29,9 → 19,8 kB komprimiert (`lebenszyklus_kosten`). | `scripts/vorrendern.ts` |
| 3 | PDF-Export per `import()` beim Klick | `src/modules/LCC.tsx` |
| 4 | Rückfall auf den Chunk, der das Modul enthält; Warnung im Build bei leerer Liste | `scripts/modulVorladen.ts` |
| 5 | Vorgerenderte Seite: Schrift wird weiter sofort geladen und dekodiert, aber erst eingesetzt, wenn React die statische Seite ersetzt hat (höchstens 15 s) | `src/main.tsx`, `src/lib/schriften.ts` |
| 6 | Ratsche in `check-bundle`: Erstpfad je Modulseite ≤ 225 kB gzip (vorher max. 235,2 kB, nachher 217,5 kB, KI-Module), jsPDF/html2canvas/xlsx/three.js/Quiz-Dashboard im Erstpfad verboten. Einstieg (102,8 kB) und größter Chunk unverändert. | `scripts/qa/check-bundle.mjs` |
| 7 | Kompression in der Vercel-Vorschau | `scripts/qa/vercel-vorschau.mjs` |

Tests: `tests/pfadRouting.test.ts` (Karte nur mit dem eigenen Modul, gleiche Vorlade-Dateien, Block hinter dem Stylesheet, Präfix-Module, Seite ohne Karte unverändert).

## Vorher/Nachher (Hellmodus, vorgerenderte Seite, 3 Läufe, Median)

vorher = `origin/main` (#297), nachher = dieser Branch; gleiche Maschine, je Seite abwechselnd gemessen.

| Seite | FCP | LCP (Ziel < 2,5 s) | CLS | TBT ≈ | Übertragen |
|---|---:|---:|---:|---:|---:|
| `bestand_info` | 2,32 → 1,83 s | 2,32 → **1,83 s** ✓ | 0,000 → 0,000 | 172 → 124 ms | 595 → 585 kB |
| `ttz_weiterbildung` | 1,94 → 1,87 s | 4,92 → **1,87 s** ✓ | 0,000 → 0,000 | 103 → 176 ms | 538 → 528 kB |
| `daemmstoffe` | 2,01 → 1,88 s | 2,01 → **1,88 s** ✓ | 0,000 → 0,000 | 317 → 227 ms | 620 → 610 kB |
| `mechanische_kenngroessen` | 2,16 → 1,90 s | 2,16 → **1,90 s** ✓ | 0,028 → 0,028 | 444 → 409 ms | 599 → 589 kB |
| `aufgaben_rueckbau` | 2,28 → 1,92 s | 2,28 → **1,92 s** ✓ | 0,000 → 0,000 | 169 → 180 ms | 557 → 547 kB |
| `korrosionsschutz_beschichtungen` | 2,15 → 1,94 s | 2,15 → **1,94 s** ✓ | 0,000 → 0,000 | 181 → 260 ms | 518 → 508 kB |
| `weiter_tha` | 2,13 → 1,93 s | 2,13 → **1,93 s** ✓ | 0,000 → 0,000 | 243 → 256 ms | 498 → 488 kB |
| `aufgaben_quiz` | 2,42 → 1,87 s | 2,42 → **1,87 s** ✓ | 0,000 → 0,000 | 160 → 132 ms | 1048 → 1038 kB |
| `aufgaben_mechanik` | 2,28 → 1,99 s | 2,28 → **1,99 s** ✓ | 0,000 → 0,000 | 175 → 223 ms | 556 → 546 kB |
| `ki_onlinekurse` | 2,36 → 1,90 s | 2,36 → **1,90 s** ✓ | 0,000 → 0,000 | 315 → 509 ms | 691 → 681 kB |
| `mischungsberechnung` | 2,22 → 1,92 s | 2,22 → **1,92 s** ✓ | 0,000 → 0,000 | 320 → 407 ms | 611 → 601 kB |
| `glas` | 2,07 → 1,93 s | 2,07 → **1,93 s** ✓ | 0,000 → 0,000 | 261 → 316 ms | 612 → 603 kB |
| `oekobilanz_lca` | 2,28 → 1,91 s | 2,28 → **1,91 s** ✓ | 0,000 → 0,000 | 386 → 263 ms | 694 → 684 kB |
| `lebenszyklus_kosten` | 2,26 → 1,87 s | 2,26 → **1,87 s** ✓ | 0,000 → 0,000 | 328 → 367 ms | 706 → 568 kB |
| `start` (unverändert) | 2,02 → 2,04 s | 2,02 → 2,04 s ✓ | 0,000 → 0,000 | 213 → 242 ms | 365 → 365 kB |

Die zehn langsamsten des Durchlaufs sind die ersten zehn Zeilen (im Durchlauf mit 1 Lauf 2,9–5,9 s; ein Teil davon war Streuung unter Last, mit 3 Läufen lagen die meisten schon knapp unter 2,5 s). Alle gemessenen Modulseiten jetzt 1,83–1,99 s (−0,13 bis −0,55 s, `ttz_weiterbildung` −3,05 s), Reserve zum Ziel ≈ 0,5 s für die reale Netzlaufzeit zum Rechenzentrum (live +0,3–0,5 s gegenüber lokal).

**Ohne statische Seite** (Dunkelmodus der Systemeinstellung, Englisch, breite Ansicht – dort blendet `scripts/startschale-boot.js` die Schale aus und der LCP kommt erst mit React): 3 Läufe, Median, `glas`/`mischungsberechnung`/`oekobilanz_lca`/`lebenszyklus_kosten`: FCP 2,9–3,0 → 2,3–2,4 s, LCP 3,58/3,66/4,04/3,82 → 3,74/3,98/4,28/3,76 s, also +0,1–0,3 s, weil die Modul-Chunks erst nach dem CSS angefordert werden. Diese Fälle lagen schon vorher über dem Ziel.

## Verhaltensprüfung

Playwright, Desktop 1280 × 900 hell und dunkel, vorher gegen nachher (`lebenszyklus_kosten`, `ttz_weiterbildung`, `spannbeton_grundlagen`, `glas`, `mischungsberechnung`): gleicher `h1`, gleiche Textlänge im Hauptbereich, statische Seite ersetzt, Inter eingesetzt (2 Schnitte geladen), keine Seitenfehler; PDF-Export der Kopfleiste lädt `pdfExport`/jsPDF beim Klick nach und liefert die Datei; der LCC-Export ruft dieselbe Funktion jetzt ebenfalls per `import()` auf (Bedienung nicht einzeln geklickt). `a11y-reiter` (desk, mob, desk-dunkel) auf `lebenszyklus_kosten`, `ttz_weiterbildung`, `spannbeton_grundlagen`, `bodenmechanik`, `glas`: 72 Reiter-Prüfungen, 0 Verstöße.

## Offen

- **Statische Seite auch im Dunkelmodus** (größter verbleibender Hebel für diese Nutzer, LCP dort 3,7–4,3 s): verlangt eine Änderung an `scripts/startschale-boot.js` (Bedingung `!dunkel`) und damit neue CSP-Hashes in `vercel.json` (Branch/PR #294) sowie eine Prüfung der vorgerenderten Seite im Dunkelmodus. Nicht umgesetzt, weil die Inline-Skripte in diesem Auftrag nicht geändert werden sollten.
- Live nachmessen, sobald dieser Stand auf Vercel liegt: `node scripts/qa/perf-messung.mjs --basis https://babo-zeta.vercel.app/ --ohne-datei --routen glas,mischungsberechnung,oekobilanz_lca` (jetzt mit `/modul/<id>`).
- TBT der Rechnerseiten (Mischungsberechnung, KI) auf einer ruhigen Maschine nachmessen; die Übernahme durch React bleibt die längste Aufgabe (unverändert).
