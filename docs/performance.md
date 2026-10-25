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
| start | 2,81 s | 4,22 s ✗ | 0,000 ✓ | 9 ms ✓ | 56 ms ✓ | 444 kB | `P.text-lg` | Version v4.3.0 (25.10.2026) |
| mischungsberechnung | 2,87 s | 7,89 s ✗ | 0,000 ✓ | 437 ms ✗ | 88 ms ✓ | 705 kB | `SPAN.font-medium` | LernzieleBachelor ca. 150 minSelbsttest: |
| biegebemessung | 2,79 s | 8,68 s ✗ | 0,000 ✓ | 394 ms ✗ | 56 ms ✓ | 725 kB | `P` | Ausprobieren3 Vorhersagen zum Rechner |
| bauphysik | 2,85 s | 7,75 s ✗ | 0,000 ✓ | 137 ms ✓ | 56 ms ✓ | 681 kB | `SPAN.font-medium` | LernzieleBachelor ca. 90 minSelbsttest:  |
| feuchteschutz | 2,82 s | 7,66 s ✗ | 0,000 ✓ | 359 ms ✗ | 72 ms ✓ | 676 kB | `P` | LernzieleBachelor ca. 90 minSelbsttest:  |
| oekobilanz_lca | 2,79 s | 8,50 s ✗ | 0,000 ✓ | 80 ms ✓ | 64 ms ✓ | 873 kB | `SPAN.font-medium` | LernzieleBachelor und Master ca. 75 minS |
| abfaelle | 2,77 s | 6,86 s ✗ | 0,000 ✓ | 74 ms ✓ | 40 ms ✓ | 622 kB | `LI` | Das Wichtigste in 5 Punkten |
| spannbeton | 2,73 s | 8,01 s ✗ | 0,000 ✓ | 162 ms ✓ | 96 ms ✓ | 783 kB | `LI` | LernzieleMaster ca. 180 minSelbsttest: 1 |
| glas | 2,80 s | 7,28 s ✗ | 0,000 ✓ | 125 ms ✓ | 56 ms ✓ | 712 kB | `P` | LernzieleBachelor ca. 75 minSelbsttest:  |
| aufgaben_trainer | 2,78 s | 7,62 s ✗ | 0,000 ✓ | 70 ms ✓ | 64 ms ✓ | 741 kB | `SPAN.font-medium` | Ausprobieren3 Vorhersagen zum Rechner |
<!-- perf-messung:ende -->

Vor der CLS-Korrektur lag der CLS auf allen Seiten bei 0,101 (Fußzeile, s. o.).

### Bewertung und offene Punkte

- **CLS** und **Klick-Latenz** erfüllen die Ziele auf allen Referenzseiten.
- **LCP** verfehlt das Ziel unter „Fast 3G“ deutlich (Start 4,2 s, Fachmodule 6,9–8,7 s). Ursache ist die Ladekette der SPA: `index.html` → Einstieg (139 kB gzip) + CSS (47 kB) → `ModulInhalt` → Modul-Chunk und seine Abhängigkeiten (KaTeX ~86 kB, Chart.js ~70 kB, `ModulKopf` ~87 kB mit Lernzielen/Kurzfassungen aller Module). Bei 1,44 Mbit/s und 562 ms RTT sind 620–870 kB allein ≈ 4–5 s Übertragung. Ansatzpunkte (nicht in AP 5.4/5.5 umgesetzt): `ModulKopf`-Daten je Modul aufteilen, KaTeX/Chart.js erst bei sichtbarer Formel bzw. Grafik laden, Modul-Chunk früh vorladen (`modulepreload` anhand des URL-Hashes), langfristig Vorrendern der Modulseiten.
- **TBT ≈** über 200 ms bei Mischungsberechnung, Biegebemessung und Feuchteschutz (Initialrechnung/Diagramme beim ersten Rendern, 4×-CPU).
