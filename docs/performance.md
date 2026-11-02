# Performance (Umsetzungsplan Phase 5, AP 5.4/5.5)

## Messverfahren

`scripts/qa/perf-messung.mjs` misst ohne Lighthouse direkt im Chromium (Playwright + Chrome DevTools Protocol):

| Einstellung | Wert |
|---|---|
| Gerät | Mobil-Emulation 390 × 844 px, DPR 2, Touch |
| CPU | 4× gedrosselt (`Emulation.setCPUThrottlingRate`) |
| Netz | „Fast 3G“: 562,5 ms RTT, 1,44 Mbit/s ↓, 675 kbit/s ↑ (`Network.emulateNetworkConditions`), Cache aus |
| Server | Produktions-Build (`npm run build`, `NODE_ENV=production node dist/server.cjs`, gzip aktiv) |
| Läufe | 3 je Seite in frischem Browserkontext, Median |

Kennwerte:

- **LCP** (Largest Contentful Paint) – Ziel < 2,5 s
- **CLS** (Cumulative Layout Shift, bis vor der ersten Interaktion) – Ziel < 0,1
- **TBT ≈** Näherung des Total Blocking Time: Summe der Long-Task-Anteile über 50 ms nach dem FCP bis Netzruhe + 1,5 s – Ziel < 200 ms
- **Klick-Latenz** statt INP (INP braucht echte Nutzerinteraktionen): ein Klick auf das erste sichtbare Bedienelement im Inhalt (Aufklapper bevorzugt), gemessen mit der Event Timing API (Eingabe bis nächstes Bild); unter 16 ms meldet die API nichts („< 16 ms“) – Ziel < 200 ms

Die Werte sind Laborwerte einer gedrosselten Emulation (strenger als typische Nutzung im Hochschul-WLAN) und dienen dem Vergleich zwischen Ständen, nicht als Felddaten.

Ausführen (Playwright ist keine Projektabhängigkeit und läuft nicht in der CI):

```sh
npm i -g playwright && npx playwright install chromium   # einmalig (oder: npm i --no-save playwright)
npm run build
NODE_ENV=production PORT=4206 node dist/server.cjs &
node scripts/qa/perf-messung.mjs                         # --laeufe 3 --routen start,glas --ohne-datei
```

Das Skript ersetzt den Abschnitt zwischen den Markierungen unten.

## Maßnahmen AP 5.4

- **Fragenpool aufgeteilt:** `src/data/quiz.json` (1,7 MB roh) war ein Chunk mit 382 kB gzip, den jeder Modul-Selbsttest lud. Jetzt stellt das Vite-Plugin `scripts/quizPool.ts` die Fragen je Modul (0,9–4,7 kB gzip) und für die globalen Ansichten (Quiz, Klausursimulator, Fragenfreigabe) in 4 Teilpaketen (je 94–99 kB gzip, parallel geladen) bereit. Kopfzeilen (Anzahl Fragen) kommen aus einem kleinen Index (5,5 kB gzip), daher kein Layoutsprung.
- **Schriften:** Inter Regular/Bold als WOFF2-Teilmenge statt TTF (je ~320 kB → ~42/44 kB), `font-display: swap`, Grundschrift per `<link rel="preload">`.

- **CLS:** Der Platzhalter beim Nachladen eines Moduls (`React.Suspense` in `App.tsx`) war nur 16 rem hoch; die Fußzeile stand dadurch im Bild und sprang beim Einblenden des Moduls weg (CLS 0,101 auf allen Seiten). Platzhalter jetzt mindestens bildschirmhoch.

## Maßnahmen AP 5.5 (Ladezeit)

Ausgangslage: Eine Modulseite lud nacheinander `index.html` → Einstieg → `ModulInhalt` → `ModulKopf` (87 kB, Kopfdaten aller Module) bzw. Modul-Chunk → dessen 20–30 Kleinst-Chunks (Icons, Bausteine) → KaTeX/Chart.js als statische Abhängigkeiten. Unter „Fast 3G“ (562 ms RTT, HTTP/1.1 mit 6 Verbindungen) kostete jede Stufe und jede Abrufrunde ≈ 0,6 s.

1. **Modulkopf je Modul:** Vite-Plugin `scripts/modulKopf.ts` (`virtual:modul-kopf`) liefert Lernziele, Kurzfassung, Erkundungsauftrag und Rechner-Grenzen des aktuellen Moduls als eigenen Chunk (≈ 1–2 kB statt 87 kB). Quelle bleiben die Dateien in `src/data/`; `tests/ladezeit.test.ts` prüft die Gleichheit für alle Module. `ModulKopf` suspendiert bis zum Eintreffen (gemeinsam mit dem Modulinhalt, kein Layoutsprung).
2. **Vorladen anhand des URL-Hashes:** `scripts/modulVorladen.ts` schreibt beim Build eine Karte „Modul-ID → Chunks“ (aus `ModulInhalt.tsx` gelesen) in `dist/index.html`; das Inline-Skript `scripts/vorladen-boot.js` direkt hinter dem Einstiegs-`<script>` setzt sofort `modulepreload` für `ModulInhalt`, `ModulKopf`, Kopfdaten und Modul-Chunk samt statischer Importe – parallel zum Einstieg. `src/main.tsx` fordert dieselben Chunks vor dem ersten Rendern an (Aliase, Dev-Server). Die CSP (Report-Only) erlaubt das Inline-Skript per SHA-256, den `server.ts` aus `dist/index.html` berechnet.
3. **Weniger Abrufe:** `manualChunks` (`modulBasisChunks()`): gemeinsame Bausteine fast aller Modulseiten (Fußzeile, Selbsttest, Formel-/Rechenweg-Boxen, Modulkopf, Schieberegler …) in `modul-basis` (37 kB), alle Icons außerhalb des Einstiegs in `icons` (13 kB), statischer Einstiegsgraph in `app`. Eine Modulseite lädt jetzt 7–14 statt 20–35 Dateien.
4. **KaTeX und Chart.js bei Bedarf:** `scripts/bedarfsLaden.ts` lenkt `react-katex`, `react-chartjs-2` und `chart.js` (Importe aus `src/`) auf `src/lib/katexBedarf.tsx`, `chartBedarf.tsx`, `chartJsBedarf.ts` um – die 150 Module bleiben unverändert, Tests nutzen die echten Pakete. KaTeX (77 kB) lädt, sobald ein Chunk mit Formeln läuft, blockiert das erste Rendern aber nicht; bis dahin steht der TeX-Text als Platzhalter, danach rendern alle Formeln als (unterbrechbare) Transition. Chart.js (70 kB) lädt ebenso parallel; ein Diagramm wird erst gezeichnet, wenn es in die Nähe des Bildausschnitts kommt (eins je Task), der Platzhalter hat exakt die Diagrammgröße (Seitenverhältnis bzw. Behälter). Vor dem Drucken (`beforeprint`) und vor dem PDF-Export (`zeichneAlleDiagramme()`) werden alle Diagramme sofort ohne Animation gezeichnet. Das KaTeX-**CSS** bleibt bewusst im Haupt-CSS (7,7 kB): Ein später eingefügtes Stylesheet erzwang eine Stil-/Layout-Neuberechnung der ganzen Seite (≈ 80–100 ms lange Task, TBT Mischungsberechnung 220–290 → 120–150 ms).
5. **TBT der Rechnerseiten:** Die langen Tasks waren vor allem Layout/Stil der ganzen Seite beim Einblenden des Moduls. `src/components/ui/NachErstemBild.tsx` rendert Abschnitte, die beim Einhängen unterhalb des Bildausschnitts liegen, nach dem ersten Bild – je Abschnitt eine Task (Mischungsberechnung: Eingabe-/Ergebniskarten, Biegebemessung: Spalten und Beispiel, Feuchteschutz: Diagrammspalte, s_d-Sandbox, Glaser, Beispiele). Liegt ein Abschnitt im Bild (breite Ansicht), rendert er sofort vor dem Zeichnen; beim Drucken alles. Inhalt und Verhalten sind gleich (geprüft: identischer Seitentext vor/nach einer Reglerbewegung, alle Diagramme/Formeln vorhanden).
6. **Server:** unverändert korrekt – `/assets/*` (Dateien mit Hash) `Cache-Control: public, max-age=31536000, immutable`, `index.html` und SPA-Routen `no-cache`, gzip über `compression` (geprüft mit `curl -I -H 'Accept-Encoding: gzip'`).

Verhaltensprüfung (Playwright, Desktop 1280 × 900 und mobil 390 × 844, alter gegen neuen Build): 20 Routen (10 Referenzseiten, Rechner mit Live-Rechenweg, Quiz, Klausursimulator, formelreiche Seiten) plus 8 Diagrammseiten – keine Seitenfehler, keine `.katex-error`, keine verbliebenen Platzhalter, KaTeX sichtbar (KaTeX-Schrift), gleiche Anzahl Formeln und Diagramme (`canvas`) und gleiche Textlänge wie vorher; Rechner-Interaktion (Schieberegler) ergibt denselben Seitentext wie im alten Build.

## Maßnahmen AP 5.5 Nachtrag (LCP-Ziel)

Diagnose (Zeitleiste der Abrufe unter „Fast 3G“): Bis zum ersten Bild brauchte schon die Startseite `index.html` (0,7 s) + Einstieg, CSS und Schrift im Wettbewerb um 1,44 Mbit/s (bis ≈ 2,7 s) + Ausführen des Einstiegs (0,3 s, CPU 4× gedrosselt). Zusätzlich blockierten zwei synchrone Boot-Skripte im `<head>` den Parser je eine Abrufrunde, sodass das Vorladen der Modul-Chunks erst bei ≈ 1,25 s statt 0,65 s begann.

1. **Einstieg 135,0 → 101,8 kB gzip (−25 %):** Die Modul-Registry (`src/registry/modules.ts`, 135 kB roh) lag vollständig im Einstieg, gebraucht werden beim ersten Rendern nur id, label, icon, gruppe sowie Titel und Typ aus `baum`. `src/registry/kern.ts` liefert diesen Auszug (`MODUL_KERN`, `TAB_ALIASES`, `NAV_TAB_GRUPPEN`); die Daten stehen in `kernDaten.ts`, das das Vite-Plugin `scripts/registryKern.ts` beim Build durch die ausgewerteten Daten (JSON) ersetzt – Quelle bleibt allein `modules.ts`. Meta-Beschreibungen (`metaDaten.ts`, nach dem `load`-Ereignis) und Suchbegriffe (`suchDaten.ts`, beim Fokus auf das Suchfeld bzw. bei der ersten Suche) kommen als eigene kleine Auszüge; `modules.ts` selbst laden nur noch Modulübersicht, Admin, Lernpfade und Forschung & Transfer. `tests/registryKern.test.ts` prüft Gleichheit der Auszüge mit der Registry und dass weder der Einstieg noch `ModulKopf` die Registry statisch importieren (`src/data/pruefvermerke.ts` nutzt deshalb den Auszug; die Cluster-Zuordnung für „Meine Module“ liegt in `src/data/modulCluster.ts`). Die englischen Texte lädt seit #138 `LanguageContext` bei Bedarf.
2. **Boot-Skripte `async`:** `vite-ws-filter.js` und `jsonld-check.js` blockieren weder den Parser noch – anders als `defer`, das den Einstieg in Dokumentreihenfolge hinter das niedrig priorisierte Skript zwang (gemessen +0,5 s) – die Ausführung des Einstiegs.
3. **Startseiten-Schale:** `scripts/startSchale.ts` setzt beim Build den sichtbaren Anfang der Startseite (Rahmen ohne Menüeinträge, Kopfzeile, Begrüßungskarte bis zur Versionszeile; `scripts/startschale.html`, Version aus `versionData.ts`) als statisches HTML in `<div id="root">`. Sie erscheint, sobald HTML und CSS da sind; React ersetzt sie beim ersten Rendern vollständig (`createRoot`, neue Knoten → kein CLS). Sichtbar ist sie nur, wenn das Inline-Skript `scripts/startschale-boot.js` am Anfang von `<head>` (vor jedem Stylesheet, damit es vor dem ersten Bild läuft) `html.bb-schale` setzt: kein Modul-Direktlink, keine Umfrage (`?poll=`), Deutsch; seit 02.11.2026 auch im Dunkelmodus (Markup hell = dunkel, Farben über `dark:`-Klassen, `html.dark` vor dem ersten Bild; Modulseiten mit abweichendem Dunkel-Markup tragen `data-nur-hell`, s. `docs/pruefung/lcp-dunkel-2026-11-02.md`) und in jeder Seitenbreite (Klasse `bb-breite-<standard|wide|full>` an `<html>` vor dem ersten Bild, Varianten `breite-standard:`/`breite-full:` statt React-Zustand; abweichende Modulseiten tragen `data-nur-breit`, s. `docs/pruefung/lcp-breite-2026-11-02.md`). Die Schale ist `inert`. Neu erzeugen nach Änderungen an Rahmen oder Begrüßung: `node scripts/qa/startschale-erzeugen.mjs`; `tests/startSchale.test.ts` prüft Texte und Klassen gegen den Quelltext und die Entscheidung des Boot-Skripts.
4. **Große Modul-Chunks aufgeteilt:** Ökobilanz 207 → 113 kB (xlsx, 140 kB, erst beim Excel-Download), Aufgaben 204 → 59 kB (Klausur, Quiz, Trainer, Forensik je Modus als Chunk, der Modus des Direktaufrufs wird sofort angefordert; Quiz-Dashboard mit recharts, 116 kB, erst beim Öffnen), Spannbeton 111 → 30 kB (Reiter Grundprinzipien, Kennwerte, Dauerhaftigkeit beim Zeigen auf die Reiterleiste bzw. Wechsel). Bauphysik: Ergebnisspalte und Beispiele, Spannbeton: Querverweise und Fußzeile über `NachErstemBild`.

Verhaltensprüfung (Playwright, Desktop und mobil, Basis gegen Branch, 22 Routen): keine Seitenfehler, keine `.katex-error`, keine Platzhalter, gleiche Anzahl Formeln/Diagramme/`h1`, gleiche Textlänge, gleicher Seitentext nach Reglerbewegung, Druck mit allen Diagrammen. Zusätzlich: Schale ohne JavaScript nur auf `/` und `#start` sichtbar (nicht auf `#glas`, `#bauphysik`, `?poll=`), nach React genau ein Rahmen; Englisch; Menüsuche über Suchbegriffe; Meta-Beschreibung je Modul; Spannbeton-Reiter; alle Aufgaben-Modi und Quiz-Dashboard; Excel-Download (`.xlsx`).

### Schrift-Teilmenge neu erzeugen

Quelle sind die bis Commit `cc1dd60c` im Repository liegenden TTF-Dateien (`git show cc1dd60c:public/fonts/inter-regular.ttf > inter-regular.ttf`) bzw. Inter 4 von rsms.me/inter. Benötigt `pip install fonttools brotli`:

```sh
U="U+0020-007E,U+00A0-00FF,U+0100-017F,U+0192,U+02C6,U+02C7,U+02D8-02DD,U+0300-036F,U+0370-03FF,U+1D62,U+2000-206F,U+2070-209F,U+20AC,U+2100-214F,U+2190-21FF,U+2200-22FF,U+2460-2473,U+25A0-25FF,U+2600-26FF,U+2713,U+2717"
for f in regular bold; do
  pyftsubset inter-$f.ttf --unicodes="$U" --layout-features+=tnum,case,frac,sups,subs \
    --flavor=woff2 --output-file=public/fonts/inter-$f.woff2
done
```

Abdeckung geprüft gegen alle Nicht-ASCII-Zeichen in `src/` (268 verschiedene): alle 131, die Inter überhaupt enthält, sind in der Teilmenge (u. a. α–ω, Δ Σ Φ Ψ Ω, ≤ ≥ ≈ ≠ √ ∞ ∑ ∫ ∂ −, · × ÷ ± ‰ ° ² ³ ⁰–⁹ ₀–₆ ₓ, ← → ⇒, ①–⑥, ✓ ✗). Die übrigen (Emoji, Kastenlinien ─ ├ └, ∝ ≙ ⌀ …) liefert auch die TTF nicht – sie kamen schon vorher aus System-Schriften.

## Vorgerenderte Modulseiten (LCP 02.11.2026)

Messung der vorgerenderten Seiten `/modul/<id>` über die statische Vercel-Vorschau, Ursachen und Maßnahmen (Vorlade-Karte je Seite hinter dem CSS, fehlende Vorlade-Listen, jsPDF bei Bedarf, Schrift erst nach dem Austausch durch React, Erstpfad-Ratsche in `check-bundle`): `docs/pruefung/lcp-module-2026-11-02.md`. Alle gemessenen Modulseiten im Hellmodus jetzt LCP 1,83–1,99 s.

## Ergebnisse

<!-- perf-messung:start -->
Stand 2026-10-26 · 3 Läufe je Seite (Median) · http://localhost:4182/

| Seite | FCP | LCP (Ziel < 2,5 s) | CLS (Ziel < 0,1) | TBT ≈ (Ziel < 200 ms) | Klick-Latenz (Ziel < 200 ms) | Übertragen | LCP-Element | geklickt |
|---|---:|---:|---:|---:|---:|---:|---|---|
| start | 2,06 s | 2,06 s ✓ | 0,000 ✓ | 168 ms ✓ | 72 ms ✓ | 381 kB | `P.text-lg` | Version v4.3.0 (25.10.2026) |
| mischungsberechnung | 3,05 s | 3,60 s ✗ | 0,000 ✓ | 322 ms ✗ | 72 ms ✓ | 619 kB | `SPAN.font-medium` | LernzieleBachelor ca. 150 minSelbsttest: |
| biegebemessung | 2,79 s | 3,54 s ✗ | 0,000 ✓ | 152 ms ✓ | 72 ms ✓ | 634 kB | `P` | Ausprobieren3 Vorhersagen zum Rechner |
| bauphysik | 2,96 s | 3,48 s ✗ | 0,000 ✓ | 304 ms ✗ | 64 ms ✓ | 594 kB | `SPAN.font-medium` | LernzieleBachelor ca. 90 minSelbsttest:  |
| feuchteschutz | 2,92 s | 3,36 s ✗ | 0,000 ✓ | 371 ms ✗ | 56 ms ✓ | 587 kB | `P` | LernzieleBachelor ca. 90 minSelbsttest:  |
| oekobilanz_lca | 3,33 s | 3,69 s ✗ | 0,000 ✓ | 178 ms ✓ | 72 ms ✓ | 675 kB | `SPAN.font-medium` | LernzieleBachelor und Master ca. 75 minS |
| abfaelle | 2,98 s | 3,42 s ✗ | 0,000 ✓ | 197 ms ✓ | 56 ms ✓ | 605 kB | `LI` | Das Wichtigste in 5 Punkten |
| spannbeton | 3,07 s | 3,75 s ✗ | 0,000 ✓ | 297 ms ✗ | 56 ms ✓ | 607 kB | `LI` | LernzieleMaster ca. 180 minSelbsttest: 1 |
| glas | 3,08 s | 3,48 s ✗ | 0,000 ✓ | 119 ms ✓ | 64 ms ✓ | 624 kB | `P` | LernzieleBachelor ca. 75 minSelbsttest:  |
| aufgaben_trainer | 3,15 s | 3,49 s ✗ | 0,000 ✓ | 25 ms ✓ | 64 ms ✓ | 585 kB | `SPAN.font-medium` | Ausprobieren3 Vorhersagen zum Rechner |
<!-- perf-messung:ende -->

Vor der CLS-Korrektur lag der CLS auf allen Seiten bei 0,101 (Fußzeile, s. o.).

### Vorher/Nachher AP 5.5

Gleiche Umgebung und gleiches Skript (3 Läufe, Median), vorher = Stand `origin/phase5/rest` (Commit `c8481c46`), nachher = AP 5.5.

| Seite | LCP vorher | LCP nachher | TBT ≈ vorher | TBT ≈ nachher | CLS vorher → nachher | FCP vorher → nachher | Übertragen vorher → nachher |
|---|---:|---:|---:|---:|---:|---:|---:|
| start | 4,20 s | **3,35 s** | 0 ms | 17 ms | 0,000 → 0,000 | 2,78 → 3,02 s | 444 → 384 kB |
| mischungsberechnung | 7,91 s | **3,80 s** | 408 ms ✗ | **149 ms** ✓ | 0,000 → 0,000 | 2,84 → 3,38 s | 705 → 621 kB |
| biegebemessung | 8,59 s | **3,90 s** | 250 ms ✗ | **23 ms** ✓ | 0,000 → 0,000 | 2,82 → 3,19 s | 725 → 636 kB |
| bauphysik | 7,61 s | **3,70 s** | 130 ms | 165 ms | 0,000 → 0,000 | 2,75 → 3,14 s | 681 → 594 kB |
| feuchteschutz | 7,64 s | **3,55 s** | 372 ms ✗ | **113 ms** ✓ | 0,000 → 0,000 | 2,82 → 3,16 s | 676 → 589 kB |
| oekobilanz_lca | 8,47 s | **4,18 s** | 79 ms | 76 ms | 0,000 → 0,000 | 2,79 → 3,68 s | 873 → 771 kB |
| abfaelle | 6,87 s | **3,72 s** | 90 ms | 48 ms | 0,000 → 0,000 | 2,81 → 3,33 s | 622 → 607 kB |
| spannbeton | 8,06 s | **4,10 s** | 169 ms | 182 ms | 0,000 → 0,000 | 2,77 → 3,61 s | 783 → 685 kB |
| glas | 7,18 s | **3,48 s** | 64 ms | 45 ms | 0,000 → 0,000 | 2,76 → 3,13 s | 712 → 626 kB |
| aufgaben_trainer | 7,63 s | **4,30 s** | 81 ms | 49 ms | 0,000 → 0,000 | 2,82 → 3,74 s | 741 → 723 kB |

„Übertragen“ zählt alles bis Netzruhe + 1,5 s, also auch KaTeX/Chart.js, die jetzt parallel nach dem ersten Rendern nachkommen.

### Bewertung und offene Punkte

- **LCP** halbiert (Fachmodule 6,9–8,7 s → 3,5–4,3 s, Start 4,2 → 3,35 s), Ziel < 2,5 s unter „Fast 3G“ aber weiter verfehlt. Untergrenze ist der Einstieg selbst: `index.html` (18 kB) + Einstieg (139 kB) + CSS (47 kB) + Schrift (42 kB) brauchen bei 562 ms RTT und 1,44 Mbit/s schon ≈ 2,8–3,0 s bis zum ersten Bild. Weitere Schritte: Einstieg verkleinern (Navigation/Registry 155 kB roh, Übersetzungen, Barrierefreiheits-Werkzeugleiste nachladen), HTTP/2 im Betrieb prüfen (die Messung läuft über HTTP/1.1 mit 6 Verbindungen; Cloud Run/Google Frontend liefert HTTP/2, dort fallen die vielen Abrufe weniger ins Gewicht), langfristig Vorrendern der Modulseiten.
- **FCP** stieg um 0,2–0,9 s: Das Vorladen der Modul-Chunks teilt sich die Bandbreite mit dem Einstieg (am stärksten bei großen Modul-Chunks: Ökobilanz 207 kB, Aufgaben 204 kB, Spannbeton 111 kB). Das erste Bild zeigt nur Kopfzeile/Navigation; maßgebend ist der LCP (Modulinhalt), der deutlich früher kommt. Die großen Modul-Chunks wären die nächsten Kandidaten zum Aufteilen.
- **TBT ≈** auf allen Referenzseiten < 200 ms (Mischungsberechnung 408 → 149 ms, Feuchteschutz 372 → 113 ms, Biegebemessung 250 → 23 ms); Spannbeton (182 ms) und Bauphysik (165 ms) liegen am nächsten an der Grenze – bei Bedarf dort ebenfalls `NachErstemBild` einsetzen.
- **CLS** bleibt 0 (Diagramm-Platzhalter in Diagrammgröße, verzögerte Abschnitte nur unterhalb des Bildausschnitts), **Klick-Latenz** unverändert < 100 ms.
- Die Werte schwanken je Lauf (TBT ± 50–100 ms, daher Median aus 3 Läufen).

### Vorher/Nachher AP 5.5 Nachtrag

Gleiche Umgebung und gleiches Skript (3 Läufe, Median); vorher = `origin/main` mit #145 (Schriften per FontFace), nachher = dieser Stand. Einstieg 135,0 → 101,8 kB gzip.

| Seite | LCP vorher | LCP nachher | FCP vorher → nachher | TBT ≈ vorher → nachher | Übertragen vorher → nachher |
|---|---:|---:|---:|---:|---:|
| start | 3,29 s | **2,06 s** ✓ | 2,93 → 2,06 s | 97 → 168 ms | 392 → 381 kB |
| mischungsberechnung | 3,95 s | **3,60 s** | 3,40 → 3,05 s | 374 → 322 ms | 629 → 619 kB |
| biegebemessung | 3,98 s | **3,54 s** | 3,13 → 2,79 s | 129 → 152 ms | 644 → 634 kB |
| bauphysik | 3,49 s | **3,48 s** | 2,88 → 2,96 s | 362 → 304 ms | 602 → 594 kB |
| feuchteschutz | 3,56 s | **3,36 s** | 3,06 → 2,92 s | 273 → 371 ms | 597 → 587 kB |
| oekobilanz_lca | 4,24 s | **3,69 s** | 3,49 → 3,33 s | 273 → 178 ms | 779 → 675 kB |
| abfaelle | 3,96 s | **3,42 s** | 3,25 → 2,98 s | 298 → 197 ms | 615 → 605 kB |
| spannbeton | 3,82 s | **3,75 s** | 3,34 → 3,07 s | 224 → 297 ms | 693 → 607 kB |
| glas | 3,43 s | **3,48 s** | 3,00 → 3,08 s | 130 → 119 ms | 634 → 624 kB |
| aufgaben_trainer | 4,00 s | **3,49 s** | 3,37 → 3,15 s | 91 → 25 ms | 734 → 585 kB |

### Bewertung Nachtrag

- **Startseite erreicht das Ziel** (LCP 2,06 s): Das LCP-Element (Begrüßungstext) steht in der Schale und erscheint mit dem CSS, ohne auf den Einstieg zu warten.
- **Fachmodule: Ziel 2,5 s unter „Fast 3G“ mit dieser Architektur nicht erreichbar.** Bis zum LCP müssen `index.html` (23 kB), CSS (48 kB), Einstieg (102 kB), `ModulInhalt` (10 kB), `modul-basis` (38 kB), Icons (14 kB), Kopfdaten (3 kB) und der Modul-Chunk (30–113 kB) übertragen werden, zusammen 270–350 kB. Bei 1,44 Mbit/s (≈ 184 kB/s) sind das 1,5–1,9 s reine Übertragung, dazu zwei Abrufrunden (HTML, dann die Chunks) mit je 0,56 s RTT und 0,4–0,6 s Ausführen/Rendern bei 4× gedrosselter CPU: 3,0–3,6 s, gemessen 3,4–3,75 s. Für 2,5 s dürften es höchstens ≈ 140 kB sein – React 19 (react-dom ≈ 57 kB) und das Haupt-CSS (48 kB) lassen dafür keinen Platz für Modulinhalt. Erreichbar wäre das Ziel nur mit vorgerenderten Modulseiten (statisches HTML je Modul, z. B. per Pfad statt Hash und SSR/Prerender beim Build) – ein Architekturwechsel, kein Feinschliff. Der Hash-Router macht das zusätzlich schwer: Der Server sieht den Modulnamen nicht.
- **TBT ≈** ist in dieser Messreihe in Basis und Branch gleichermaßen erhöht (bis 370 ms, in AP 5.5 ≤ 185 ms) und streut stark (± 100 ms zwischen Läufen gleicher Builds): Während der Messung liefen Playwright-Jobs anderer Arbeitspakete auf derselben Maschine; schon `main` vor #145 lag hier bei 200–280 ms. Ob das Einsetzen der Schriften per `FontFace` nach dem ersten Bild (#145) zusätzlich beiträgt, ist auf einer ruhigen Maschine nachzumessen. Auf der Startseite zählt das Rendern von React jetzt nach dem (früheren) FCP, daher 97 → 168 ms bei gleicher Arbeit.
- **CLS** 0 auf allen Seiten, **Klick-Latenz** < 100 ms.

