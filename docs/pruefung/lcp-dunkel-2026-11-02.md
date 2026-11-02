# LCP im Dunkelmodus – vorgerenderte Seite auch dunkel (02.11.2026)

Anlass: Empfehlung aus `docs/pruefung/lcp-module-2026-11-02.md` (PR #306, Abschnitt „Offen“): Im Dunkelmodus blendete `scripts/startschale-boot.js` die vorgerenderte Seite aus (Bedingung `!dunkel`), der LCP kam erst mit React (Modulseiten 3,6–4,3 s, Ziel AP 5.5 < 2,5 s).

## Warum die Bedingung bestand

- Eingeführt mit der Startseiten-Schale (`4272fa18`, 25.10.2026, AP 5.5 Nachtrag) als `localStorage.theme !== 'dark'`; begründet in `scripts/startSchale.ts`: Die Schale wird nur gezeigt, wo sie dem ersten Bild von React entspricht. Mit dem Systemdunkelmodus (`6f156950`, 29.10.2026) auf `!dunkel` erweitert.
- Die Schale selbst war schon weitgehend dunkeltauglich: Farben kommen über Tailwind-`dark:`-Klassen und `src/index.css` (`.dark …`), die Klasse `dark` setzt das Boot-Skript vor dem ersten Bild. Abweichend war nur Markup, das nach dem Zustand `theme` statt per Klasse umschaltet:
  - **Darstellungsschalter** in der Kopfzeile (Desktop und Mobilmenü): hell Mond + „Dunkel“, dunkel Sonne + „Hell“. Im Dunkelmodus hätte die Schale den falschen Schalter gezeigt.
  - Grafiken einzelner Module (`laborGrafik.tsx`, `SchmidtHammerSimulator.tsx`, `Lebensdauerbemessung.tsx`) – liegen in keiner vorgerenderten Seite im sichtbaren Ausschnitt (s. Durchlauf unten).

## Lösung

| Nr. | Änderung | Datei |
|---|---|---|
| 1 | Darstellungsschalter rendert beide Symbole und Texte; sichtbar ist je eines über `dark:hidden` / `hidden dark:block|inline`. Ausgabe hell und dunkel gleich, Bedienung unverändert (`title` bleibt zustandsabhängig, unsichtbar). | `src/App.tsx` |
| 2 | Boot-Skript: Schale auch im Dunkelmodus; `html.dark` wird in einem eigenen Schritt vor der Schalen-Entscheidung gesetzt (greift jetzt auch bei gesperrtem `localStorage` nach der Systemeinstellung). Ausnahme: Modulseiten mit `data-nur-hell` am `<meta name="bb-vorgerendert">` bleiben dunkel ohne Schale. | `scripts/startschale-boot.js` |
| 3 | Vorrendern rendert jede Modulseite ein zweites Mal im Dunkelmodus (`localStorage.theme = 'dark'` im Node-Speicher, TabContext liest ihn) und vergleicht die Schale (`gleicheSchale`, ohne `title`/`aria-label`). Abweichung → `data-nur-hell`, Liste im Build-Protokoll. Build-Zeit des Vorrenderns ≈ 30 → 33–42 s. | `scripts/vorrendern.ts` |
| 4 | Startseiten-Schale neu erzeugt (Schalter-Markup); der Erzeuger liest die Startseite jetzt hell **und** dunkel und bricht bei abweichendem Markup ab. | `scripts/startschale.html`, `scripts/qa/startschale-erzeugen.mjs` |
| 5 | CSP-Hash des Boot-Skripts neu (`npx tsx scripts/vercelKonfig.ts --schreiben`); `server.ts` berechnet die Hashes zur Laufzeit aus `dist/index.html` und braucht keine Änderung. Geprüft: Die Hashes aller Inline-Skripte in `dist/index.html` und den 288 `dist/modul/*.html` stehen in `vercel.json`. | `vercel.json` |
| 6 | `check-bundle` verlangt `server.cjs` im Statik-Modus nicht mehr (`BB_STATISCH=1`, `--statisch` oder `dist/404.html` vorhanden – nur der Vercel-`buildCommand` legt sie an, nach dem vollständigen Build); `modul/routen.json` bleibt Pflicht. Keine Platzhalterdatei. | `scripts/qa/check-bundle.mjs`, `docs/betrieb-vercel.md` |
| 7 | `perf-messung.mjs --dunkel` (Systemeinstellung dunkel, ohne eigene Wahl). | `scripts/qa/perf-messung.mjs` |

Tests: `tests/startSchale.test.ts` (Dunkelmodus und System dunkel: Schale steht und `dark` gesetzt; `data-nur-hell` dunkel aus, hell an; gesperrter Speicher: keine Schale, `dark` nach Systemeinstellung), `tests/pfadRouting.test.ts` (Kennung im Kopf, `gleicheSchale` ignoriert `title`/`aria-label`, erkennt Markup-Abweichungen), `tests/statikModus.test.ts` (vercel.json aktuell).

### Ergebnis des Dunkel-Vergleichs im Build

287 von 288 Modulseiten haben hell und dunkel dasselbe Markup. Einzige Ausnahme: **`aufgaben_trainer`** – nicht wegen des Dunkelmodus, sondern weil der Prüfungs-Trainer seine Aufgabe zufällig erzeugt (zwei Durchläufe: F = 180 kN bzw. 260 kN). Die Seite bleibt dunkel ohne Schale (Verhalten wie bisher). Nebenbefund: Auch hell zeigt die Schale dort eine andere Zahl als die Aufgabe, die React danach erzeugt (bisher schon so; s. „Nächste Schritte“).

## LCP vorher/nachher

Verfahren wie `docs/pruefung/lcp-module-2026-11-02.md`: `BB_STATISCH=1`-Build, `scripts/qa/vercel-vorschau.mjs` (Kompression wie Vercel) mit der jeweils passenden `vercel.json`, `perf-messung.mjs` (Mobil 390 × 844, 4× CPU, Fast 3G, Cache aus), 3 Läufe, Median, je Seite abwechselnd vorher/nachher. Vorher = `origin/main` + #306 (Merge-Basis dieses Branches). Die Maschine war durch parallele Builds anderer Arbeitspakete belastet; TBT streut stark und ist nicht aussagekräftig, LCP/FCP ± 0,1 s.

**Dunkelmodus** (Systemeinstellung dunkel):

| Seite | FCP | LCP (Ziel < 2,5 s) | CLS | Übertragen |
|---|---:|---:|---:|---:|
| `start` | 2,66 → 2,14 s | 2,95 → **2,14 s** ✓ | 0,000 → 0,000 | 365 → 366 kB |
| `glas` | 2,37 → 1,90 s | 3,67 → **1,90 s** ✓ | 0,000 → 0,000 | 603 → 603 kB |
| `mischungsberechnung` | 2,43 → 1,90 s | 3,90 → **1,90 s** ✓ | 0,000 → 0,000 | 601 → 601 kB |
| `oekobilanz_lca` | 2,33 → 1,93 s | 4,27 → **1,93 s** ✓ | 0,000 → 0,000 | 684 → 684 kB |

**Hellmodus** (Kontrolle, darf nicht schlechter werden):

| Seite | FCP | LCP | CLS |
|---|---:|---:|---:|
| `start` | 2,04 → 2,02 s | 2,04 → 2,02 s ✓ | 0,000 → 0,000 |
| `glas` | 1,96 → 1,90 s | 1,96 → 1,90 s ✓ | 0,000 → 0,000 |
| `mischungsberechnung` | 1,89 → 1,85 s | 1,89 → 1,85 s ✓ | 0,000 → 0,000 |
| `oekobilanz_lca` | 2,07 → 1,94 s | 2,07 → 1,94 s ✓ | 0,000 → 0,000 |

Dunkel jetzt wie hell (−0,8 bis −2,3 s); hell unverändert im Rahmen der Streuung. Übertragene Menge +1 kB (Startseite: zweites Symbol im Schalter, längeres Boot-Skript).

## Sichtprüfung, Barrierefreiheit, CSP

- **Playwright** (`start`, `glas`, `mischungsberechnung`, `oekobilanz_lca`, `aufgaben_trainer`; hell/dunkel; Desktop 1280 × 900 und Mobil 390 × 844): Zustand vor React (Modul-JS gesperrt) und nach React je als Bildschirmfoto. Dunkel: `html.dark` und Schale vor dem ersten Bild, Hintergrund `rgb(9, 13, 22)` (kein heller Blitz), Rahmen und Inhalt wie nach React (Schalter „Hell“ mit Sonne); `aufgaben_trainer` dunkel ohne Schale wie vorgesehen. Hell: unverändert, keine dunklen Flächen. React ersetzt die Schale in allen 20 Fällen, keine Seitenfehler.
- **Kontrast der Schale** (axe `color-contrast` auf `[data-schale]` vor React, `inert` dafür aufgehoben): 20 Fälle, 0 Verstöße.
- **a11y-reiter** (desk, mob, desk-dunkel) auf `start`, `glas`, `mischungsberechnung`, `oekobilanz_lca`, `aufgaben_trainer`: 99 Reiter-Prüfungen, 0 Verstöße.
- **CSP** (statische Vorschau mit der neuen `vercel.json`, Konsole und `securitypolicyviolation`): alle 288 Modulseiten hell und dunkel je 0 Befunde (keine CSP-Verstöße, keine Konsolenfehler, keine /api-Aufrufe). Rundgang dunkel (Startseite, Reiter, 3D-Mauerwerk, Quiz, Umfrage, Admin, unbekannte Seite): 0 CSP-Verstöße; einziger Eintrag ist die erwartete 404-Antwort für `/modul/unbekannt_xyz`.
- `check-design` 0 neue dunkle Flächen ohne `dark:`; `check-bundle` im Statik-Modus ohne `server.cjs`: OK (Einstieg 102,9 kB, Erstpfad-Ratsche aus #306 eingehalten).

## Nächste Schritte

- **Englisch und breite Ansicht** (Optional 3, nicht trivial, daher nicht umgesetzt): Die Schale ist deutscher Text; für Englisch bräuchte es je Modul eine zweite vorgerenderte Datei (`/en/…` oder Sprachweiche) – doppelte Build-Zeit und Dateimenge. Bei Standard- (1152 px) und Vollbreite rendert React andere Breiten- und Schalterklassen (`screenWidth` im Zustand); lösbar, indem das Boot-Skript eine Breitenklasse an `<html>` setzt und Rahmen/Schalter wie hier der Darstellungsschalter per CSS umschalten. Empfehlung: Breite zuerst (ein Umbau in `src/App.tsx`, betrifft alle Seiten), Englisch erst bei Bedarf (Anteil englischer Nutzung unbekannt).
- `aufgaben_trainer`: zufällige Aufgabe in der vorgerenderten Seite – entweder den Aufgabenbereich aus der Schale nehmen oder im Vorrendern mit festem Startwert erzeugen und in React denselben Startwert für die erste Aufgabe nutzen.
- Live nachmessen, sobald #306 und dieser Stand auf Vercel liegen: `node scripts/qa/perf-messung.mjs --basis https://babo-zeta.vercel.app/ --ohne-datei --dunkel --routen start,glas,mischungsberechnung,oekobilanz_lca`.
