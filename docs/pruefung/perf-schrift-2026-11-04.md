# Schrift Inter schon in der statischen Seite – Versuch (04./09.11.2026)

Anlass: `docs/pruefung/perf-cv-2026-11-04.md`. Die verbleibende TBT langer Seiten entsteht vor allem beim späten Einsetzen der Schrift Inter (Neu-Layout aller Elemente nach dem Austausch durch React). Versuch: die Schrift schon in der statischen Seite verwenden.

Bedingungen: LCP der Startseite nicht schlechter (lokal ≤ 0,9 s, live ≤ 2,2 s), CLS unverändert, pixelgleicher Endzustand, kein FOIT (`font-display: swap` bleibt), keine neuen Inline-Skripte oder CSP-Hashes.

**Ergebnis: nicht eingebaut.** Die TBT sinkt deutlich, aber das LCP wird auf allen Seiten mit Text im Bild um 1,5–4 s schlechter. Ein Ausweg innerhalb der Bedingungen ist nicht in Sicht.

## Umsetzung im Versuch

Lokaler Commit `b62b3ddd` auf `perf/schrift-statisch-11-04`, nicht gepusht:

- Ein Vite-Plugin (`scripts/schriftStatisch.ts`) schreibt beim Build die WOFF2-Teilmengen aus `src/lib/schriftDaten.ts` als Dateien nach `dist/assets/`. Im Repository liegt weiterhin keine Binärdatei.
- Dasselbe Plugin setzt `@font-face` (Inter 400–500 und 600–700, `font-display: swap`) als `<style data-bb-schrift>` in den Kopf von Start- und Modulseiten. Das ist ein Inline-Stil, kein Skript, also kein neuer CSP-Hash.
- `src/main.tsx` lädt die Schrift dann nicht mehr per FontFace nach.
- Es gibt kein Vorladen (`preload`), weil es auf den Modulseiten mit dem CSS um die Bandbreite konkurrieren würde.

## Messung

Lokale Vercel-Vorschau, mobil, Fast 3G, 4× CPU, vorher (#328) und nachher abwechselnd, 3 Runden, Median, ruhige Maschine (Last ≈ 1):

| Seite | LCP vorher → nachher | TBT vorher → nachher | CLS |
|---|---:|---:|---:|
| start | 0,85 → **3,45 s** ✗ | 162 → 152 ms | 0,000 → 0,000 |
| mischungsberechnung | 1,94 → 1,96 s | 362 → 76 ms | 0,000 → 0,000 |
| modulstruktur | 1,97 → 1,97 s | 239 → 121 ms | 0,000 → 0,000 |
| aufgaben | 1,90 → 1,90 s | 352 → 136 ms | 0,000 → 0,000 |
| betonkennwerte | 1,84 → 1,97 s | 591 → 378 ms | 0,001 → 0,001 |
| rechnung_mauerwerk | 1,89 → **6,04 s** ✗ | 475 → 360 ms | 0,019 → 0,019 |
| glas | 1,91 → **4,50 s** ✗ | 79 → 80 ms | 0,000 → 0,000 |

`perf-messung.mjs` nennt als LCP-Element nachher Textabsätze: auf der Startseite `P.text-lg`, die Begrüßung, bei `glas` ein `P`.

## Ursache

- Mit `font-display: swap` zeichnet der Browser den Text erst in der Ersatzschrift und nach dem Laden der Schrift (≈ 85 kB, nicht vorgeladen) erneut in Inter.
- Inter läuft etwas breiter. Der neu gezeichnete Absatz ist dadurch größer, und der Browser meldet ihn als neues, spätes LCP-Element. Das LCP rückt so auf den Zeitpunkt, an dem die Schrift eintrifft.
- Auf Seiten, deren größtes Element schon vor dem Schriftwechsel ein anderes, größeres ist, bleibt das LCP gleich (Mischungsberechnung, Modulübersicht, Aufgaben).
- Das ist derselbe Mechanismus wie am 02.11. (`docs/pruefung/lcp-module-2026-11-02.md`), nur jetzt schon an der statischen Seite.

## Warum kein Ausweg innerhalb der Bedingungen

- **Schrift vorladen:** Sie kommt früher, konkurriert aber mit CSS bzw. Einstieg. Auf der Startseite (LCP 0,85 s, die Schrift wäre frühestens ≈ 1,2–1,5 s da) bliebe das LCP über 0,9 s, und auf den Modulseiten würde der FCP später.
- **`font-display: optional`:** Damit gäbe es kein spätes Neu-Zeichnen. Beim ersten Besuch erschiene die Seite aber meist dauerhaft in der Ersatzschrift, die Darstellung änderte sich also. Außerdem schließt die Bedingung „font-display beibehalten“ das aus.
- **`font-display: block`:** Das wäre FOIT, ausgeschlossen.
- **Schrift als Daten-URL im kritischen CSS:** Das HTML würde um ≈ 115 kB größer, FCP und LCP der Startseite würden deutlich später.

## Bewertung und Empfehlung

- Der TBT-Gewinn ist echt: Ohne späten Schriftwechsel entfällt das Neu-Layout der ganzen Seite, und die Mischungsberechnung sinkt von 362 auf 76 ms.
- Er ist aber nur mit einem schlechteren LCP zu haben. Nach den Vorgaben bleibt es deshalb beim bisherigen Verfahren: Die Schrift wird nach dem Austausch eingesetzt (`src/lib/schriften.ts`).
- Der Versuchs-Commit bleibt nur lokal und wird nicht gepusht.
- Eine Grundsatzentscheidung bleibt offen: Systemschrift statt Inter auf allen Seiten (kein Schriftwechsel, TBT wie im Versuch, LCP unverändert). Das ändert das Erscheinungsbild und braucht deshalb die Entscheidung von Prof. Huber.

## Prüfungen

Nicht weiter geprüft (Pixelgleichheit, a11y), weil die LCP-Bedingung schon verletzt ist. Am Stand von #328 ändert dieser Bericht nichts am Code.
