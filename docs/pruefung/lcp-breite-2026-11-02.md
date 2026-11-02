# LCP in Standard- und Vollbreite – vorgerenderte Seite in jeder Seitenbreite (02.11.2026)

Anlass: Empfehlungen aus `docs/pruefung/lcp-dunkel-2026-11-02.md` (PR #310, „Nächste Schritte“): Bei Standard- (1152 px) und Vollbreite (100 %) rendert React andere Klassen als die vorgerenderte Seite (Zustand `screenWidth`), daher blendete `scripts/startschale-boot.js` die Schale dort aus und der LCP kam erst mit React. Dazu: Prüfungs-Trainer mit festem Startwert vorrendern; Englisch nicht umsetzen.

## Lösung (Muster des Darstellungsschalters aus #310)

| Nr. | Änderung | Datei |
|---|---|---|
| 1 | Seitenbreite als Klasse an `<html>`: `bb-breite-standard`, `bb-breite-wide`, `bb-breite-full` (ohne Klasse gilt „Breit“, die Voreinstellung). Leseregel, Wahl speichern und Klasse setzen an einer Stelle; App und Barrierefreiheits-Werkzeug nutzen sie (vorher doppelt). | `src/utils/seitenbreite.ts`, `src/components/a11y/AccessibilityToolbar.tsx` |
| 2 | Tailwind-Varianten `breite-standard:` und `breite-full:` (`@custom-variant`); die Breitenregeln für `#module-content` und `.container` hängen an der Klasse statt an `data-width`/`data-fluid` (Attribute entfallen). | `src/index.css` |
| 3 | Inhaltsbreite: `max-w-[1536px] breite-standard:max-w-6xl breite-full:max-w-none` statt Zustand. Breitenschalter in der Kopfzeile in drei Fassungen mit den bisherigen Klassen, je eine sichtbar über die Klasse an `<html>` (ausgeblendete Fassungen: `display: none`, nicht fokussierbar, nicht im Zugänglichkeitsbaum). Zuerst als ein Schalter mit Varianten-Klassen umgesetzt – das umging die klassenbasierten Dunkelmodus-Regeln in `src/index.css` (`[class*="bg-shiraz/10"]`, `.dark .bg-shiraz`), in der Sichtprüfung erkannt und so korrigiert. `title`/`aria-label` bleiben zustandsabhängig (unsichtbar, Schale ist `inert`). Die App hält die Klasse per `useLayoutEffect` aktuell (auch im Entwicklungsserver ohne Boot-Skript vor dem ersten Bild). | `src/App.tsx` |
| 4 | Boot-Skript setzt die Breitenklasse vor dem ersten Bild (auch bei gesperrtem Speicher: „Breit“) und zeigt die Schale in jeder Breite. Neue Ausnahme `data-nur-breit` am `<meta name="bb-vorgerendert">`: Schale nur in „Breit“. | `scripts/startschale-boot.js` |
| 5 | Vorrendern vergleicht je Modulseite drei Durchläufe mit der hellen Breit-Fassung: dunkel, Standardbreite, Vollbreite (Einstellung im Node-Speicher). Abweichung dunkel → `data-nur-hell`, Abweichung in einer Breite → `data-nur-breit`; Liste im Build-Protokoll. Ergebnis: **288 von 288 Modulseiten gleich, keine Kennung**. Dauer des Vorrenderns 33,6 s → 36–51 s (zwei Durchläufe mehr, Maschine geteilt). | `scripts/vorrendern.ts` |
| 6 | Prüfungs-Trainer: erste Aufgabe mit festem Startwert (`festerZufall`, mulberry32, Startwert 20261102), damit Schale und erstes Bild dieselbe Aufgabe zeigen (F = 152 kN); „Neue Werte würfeln“ und der Aufgabenwechsel würfeln weiter mit `Math.random`. Die `data-nur-hell`-Ausnahme für `aufgaben_trainer` entfällt damit (Nebenbefund aus #310 behoben: hell zeigte die Schale eine andere Zahl als React). | `src/components/trainer/DynamischerAufgabenGenerator.tsx` |
| 7 | Startseiten-Schale neu erzeugt; der Erzeuger liest die Startseite hell/Breit, dunkel, Standard- und Vollbreite und bricht bei abweichendem Markup ab. | `scripts/startschale.html`, `scripts/qa/startschale-erzeugen.mjs` |
| 8 | CSP-Hash des Boot-Skripts neu (`npx tsx scripts/vercelKonfig.ts --schreiben`), `tests/statikModus.test.ts` grün. | `vercel.json` |
| 9 | `perf-messung.mjs --breite standard|wide|full` (gespeicherte Seitenbreite, wie ein Wiederbesuch). | `scripts/qa/perf-messung.mjs` |

Tests: `tests/startSchale.test.ts` (Breitenklasse für alle Speicherstände einschließlich alter Einstellung `baustoffboard_fluid_width` und gesperrtem Speicher; Schale in Standard- und Vollbreite; `data-nur-breit` nur in „Breit“), `tests/pfadRouting.test.ts` (Kennung `data-nur-breit` im Kopf).

**Englisch (Empfehlung 3): nicht umgesetzt**, erst bei Bedarf. Begründung wie in #310: je Modul eine zweite vorgerenderte Datei (doppelte Build-Zeit und Dateimenge); Anteil englischer Nutzung unbekannt. Englisch bleibt ohne Schale (LCP mit React).

## LCP vorher/nachher

Verfahren wie `docs/pruefung/lcp-dunkel-2026-11-02.md`: `BB_STATISCH=1`-Build, `scripts/qa/vercel-vorschau.mjs` mit der jeweils passenden `vercel.json`, `perf-messung.mjs` (Mobil 390 × 844, 4× CPU, Fast 3G, Cache aus), 3 Läufe, Median. Vorher = Merge-Basis dieses Branches (`origin/main` + #310 + #300). Maschine durch parallele Arbeitspakete belastet; LCP/FCP ± 0,1 s, TBT streut stark.

**Standardbreite** (`--breite standard`):

| Seite | FCP | LCP (Ziel < 2,5 s) | CLS |
|---|---:|---:|---:|
| `start` | 2,73 → 2,02 s | 3,06 → **2,02 s** ✓ | 0,000 → 0,000 |
| `glas` | 2,35 → 1,93 s | 3,74 → **1,93 s** ✓ | 0,000 → 0,000 |
| `mischungsberechnung` | 2,46 → 1,85 s | 3,95 → **1,85 s** ✓ | 0,000 → 0,000 |
| `oekobilanz_lca` | 2,43 → 1,86 s | 4,22 → **1,86 s** ✓ | 0,000 → 0,000 |

**Vollbreite** (`--breite full`):

| Seite | FCP | LCP (Ziel < 2,5 s) | CLS |
|---|---:|---:|---:|
| `start` | 2,74 → 2,02 s | 3,09 → **2,02 s** ✓ | 0,000 → 0,000 |
| `glas` | 2,58 → 1,83 s | 3,95 → **1,83 s** ✓ | 0,000 → 0,000 |
| `mischungsberechnung` | 2,44 → 1,88 s | 3,84 → **1,88 s** ✓ | 0,000 → 0,000 |
| `oekobilanz_lca` | 2,31 → 1,91 s | 4,39 → **1,91 s** ✓ | 0,000 → 0,000 |

**Kontrolle hell und dunkel** (Breit, Voreinstellung; darf nicht schlechter werden):

| Seite | LCP hell | LCP dunkel |
|---|---:|---:|
| `start` | 2,07 → 2,04 s ✓ | 1,99 → 2,05 s ✓ |
| `glas` | 1,89 → 1,90 s ✓ | 1,96 → 1,95 s ✓ |
| `mischungsberechnung` | 1,96 → 1,87 s ✓ | 1,98 → 1,92 s ✓ |
| `oekobilanz_lca` | 1,93 → 1,92 s ✓ | 1,95 → 1,93 s ✓ |

Standard- und Vollbreite jetzt wie Breit (−0,7 bis −2,5 s); hell/dunkel unverändert im Rahmen der Streuung (± 0,06 s). Übertragen unverändert (366–686 kB). Die TBT-Näherung steigt in Standard-/Vollbreite (z. B. `glas` 139 → 366 ms), weil sie ab FCP zählt und FCP jetzt vor dem Start von React liegt – dieselben langen Tasks fallen in das Messfenster; in hell/dunkel (dort schon vorher mit Schale) bleibt sie gleich.

## Sichtprüfung, Barrierefreiheit, CSP

- **Playwright** (`start`, `glas`, `mischungsberechnung`, `oekobilanz_lca`, `aufgaben_trainer`; hell/dunkel; Standard/Breit/Voll; Desktop 2000 × 950 und Mobil 390 × 844 = 60 Fälle): Zustand vor React (Modul-JS gesperrt) gegen nach React, je als Bildschirmfoto. In allen 60 Fällen steht die Schale vor dem ersten Bild, Breitenklasse und `dark` gesetzt, und vor/nach React sind gleich: Inhaltsbreite (Desktop 1152 / 1536 / 1648 px), Lage der ersten Überschrift, Breitenschalter (Symbol, Text, Hintergrund, Schrift-, Randfarbe), Seitenhintergrund (dunkel `rgb(9, 13, 22)`, kein heller Blitz). Kein Layoutsprung durch die Schale: CLS bis Netzruhe 0 bis 0,012 (Desktop, Modulseiten) – genauso im Stand vorher (max. 0,0117 vorher und nachher, unabhängig von der Breite; nachgeladene Abschnitte), Mobil 0. React ersetzt die Schale überall, keine Seitenfehler.
- **Vergleich mit dem Stand vorher nach React** (30 Desktop-Fälle): Breitenschalter und Inhaltsbreite berechnet identisch – die Umstellung ändert das Aussehen nicht.
- **Kontrast der Schale** (axe `color-contrast` auf `[data-schale]`, `inert` dafür aufgehoben): 60 Fälle, 0 Verstöße.
- **a11y-reiter** (desk, mob, desk-dunkel) auf den 5 Routen: 99 Reiter-Prüfungen, 0 Verstöße. **a11y-dialog** (hell/dunkel × Kontrast × 3 Breiten): 12 Darstellungen ohne Verstöße.
- **CSP** (statische Vorschau mit neuer `vercel.json`, Konsole, `securitypolicyviolation`, /api-Aufrufe): alle 288 Modulseiten hell (Breit), dunkel (Breit), hell + Standardbreite, dunkel + Vollbreite je 0 Befunde. Rundgang hell/Breit und dunkel/Standard: 0 CSP-Verstöße; einziger Eintrag die erwartete 404-Antwort für `/modul/unbekannt_xyz`.
- `check-design` 0 neue dunkle Flächen ohne `dark:`; `check-bundle` OK (Erstpfad-Ratsche eingehalten, Median 101,1 kB).

## Nächste Schritte

- Live nachmessen, sobald #300, #310 und dieser Stand auf Vercel liegen: `node scripts/qa/perf-messung.mjs --basis https://babo-zeta.vercel.app/ --ohne-datei --breite standard --routen start,glas,mischungsberechnung,oekobilanz_lca`.
- Ohne Schale bleiben nur noch Englisch, Umfrage-Links (`?poll=`) und gesperrter Speicher.
