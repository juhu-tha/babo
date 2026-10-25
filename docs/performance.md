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

## Ergebnisse

<!-- perf-messung:start -->
Stand 2026-10-25 · 3 Läufe je Seite (Median) · http://localhost:4206/

| Seite | FCP | LCP (Ziel < 2,5 s) | CLS (Ziel < 0,1) | TBT ≈ (Ziel < 200 ms) | Klick-Latenz (Ziel < 200 ms) | Übertragen | LCP-Element | geklickt |
|---|---:|---:|---:|---:|---:|---:|---|---|
| start | 3,02 s | 3,35 s ✗ | 0,000 ✓ | 17 ms ✓ | 48 ms ✓ | 384 kB | `P.text-lg` | Version v4.3.0 (25.10.2026) |
| mischungsberechnung | 3,38 s | 3,80 s ✗ | 0,000 ✓ | 149 ms ✓ | 48 ms ✓ | 621 kB | `SPAN.font-medium` | LernzieleBachelor ca. 150 minSelbsttest: |
| biegebemessung | 3,19 s | 3,90 s ✗ | 0,000 ✓ | 23 ms ✓ | 56 ms ✓ | 636 kB | `P` | Ausprobieren3 Vorhersagen zum Rechner |
| bauphysik | 3,14 s | 3,70 s ✗ | 0,000 ✓ | 165 ms ✓ | 48 ms ✓ | 594 kB | `SPAN.font-medium` | LernzieleBachelor ca. 90 minSelbsttest:  |
| feuchteschutz | 3,16 s | 3,55 s ✗ | 0,000 ✓ | 113 ms ✓ | 64 ms ✓ | 589 kB | `P` | LernzieleBachelor ca. 90 minSelbsttest:  |
| oekobilanz_lca | 3,68 s | 4,18 s ✗ | 0,000 ✓ | 76 ms ✓ | 56 ms ✓ | 771 kB | `SPAN.font-medium` | LernzieleBachelor und Master ca. 75 minS |
| abfaelle | 3,33 s | 3,72 s ✗ | 0,000 ✓ | 48 ms ✓ | 48 ms ✓ | 607 kB | `LI` | Das Wichtigste in 5 Punkten |
| spannbeton | 3,61 s | 4,10 s ✗ | 0,000 ✓ | 182 ms ✓ | 40 ms ✓ | 685 kB | `LI` | LernzieleMaster ca. 180 minSelbsttest: 1 |
| glas | 3,13 s | 3,48 s ✗ | 0,000 ✓ | 45 ms ✓ | 56 ms ✓ | 626 kB | `P` | LernzieleBachelor ca. 75 minSelbsttest:  |
| aufgaben_trainer | 3,74 s | 4,30 s ✗ | 0,000 ✓ | 49 ms ✓ | 40 ms ✓ | 723 kB | `SPAN.font-medium` | Ausprobieren3 Vorhersagen zum Rechner |
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
