# Barrierefreiheit über axe hinaus – Tastatur, Screenreader-Semantik, Zoom, Bewegung, Kontrastmodus (03.11.2026)

Rahmen: WCAG 2.1 AA / BITV 2.0, Prüfpunkte, die automatische Regelprüfungen (axe, `scripts/qa/a11y*.mjs`) nicht oder nur teilweise finden. Gebaute App lokal (Produktionsbuild, `node dist/server.cjs`), Chromium über Playwright. Vergleich: `origin/main` (#313) gegen diesen Branch.

Werkzeug (neu, im Repo): `scripts/qa/a11y-tastatur.mjs` – Tastaturabläufe, Fokusanzeige (inkl. Kontrast und Deckkraft), Tastaturfallen, Dialoge, Live-Regionen, Struktur (Überschriften, Landmarken, Namen, Tabellen, Formeln, Grafiken), Reflow 200 %/400 %, Textabstände nach 1.4.12, `prefers-reduced-motion`, `forced-colors`. Bricht bei jedem Befund ab (Exit 1).

```
node scripts/qa/a11y-tastatur.mjs --basis http://localhost:4526/ [--routen a,b] [--modi desk,mob] [--nur global,modul,zoom,bewegung,kontrast]
```

**Stichprobe:** Startseite (Navigation/Menü desktop und mobil, Suche, A11y-Dialog, PDF-Export, Haftungshinweis), 10 Rechner aus der Registry (`typ: 'calculator'`, Startwert 20261103, mulberry32): `bp_glaeser`, `energieausweis`, `korrosionsschutz_beschichtungen`, `bodenmechanik`, `knicken`, `rechnung_u_wert`, `festbeton_statistik`, `pfas_baustoffe`, `emodul`, `bauphysik`; dazu Quiz (`aufgaben_quiz`), Diagramme mit Alternativen (`kriechen`; Tabellen über `a11y-diagramme.mjs`), 3D-Modul (`mauerwerk`). Darstellungen: Desktop 1440 px, Mobil 390 px; Zoom 720 px (200 %) und 320 px (400 %); hell, `reducedMotion: reduce`, `forcedColors: active`.

## Ergebnis

| Lauf | vorher (main) | nachher (Branch) |
|---|---:|---:|
| `a11y-tastatur.mjs` (Stichprobe, alle Teile) | **114 Befunde** | **0 Befunde** |
| `a11y-reiter.mjs` (axe, 15 Routen × desk/mob/desk-dunkel, 174 Prüfungen) | 0 Verstöße | 0 Verstöße |
| `a11y-dialog.mjs`, `a11y-struktur.mjs`, `a11y-diagramme.mjs` | – | 0 (s. PR) |

Die 114 Befunde vorher zeigen, dass die axe-Läufe (0 Verstöße) diese Klasse von Fehlern nicht sehen.

## Befunde (Kriterium, Fundstelle, vorher, nachher)

| Nr. | Kriterium | Fundstelle | vorher | nachher |
|---|---|---|---|---|
| T1 | 2.1.1, 2.4.3 | A11y-Dialog (`AccessibilityToolbar.tsx`, `A11yPanel.tsx`) | Fokus blieb nach dem Öffnen auf dem Auslöser; Escape schloss nicht; nach dem Schließen keine Rückführung | Fokus ins erste Bedienelement, Escape schließt, Fokus zurück zum Auslöser (neuer Hook `useDialogFokus`), `aria-controls` |
| T2 | 2.1.1, 2.4.3 | Mobiles Menü (Seitenleiste, `App.tsx`) | Fokus blieb auf „Menü öffnen“, Tab lief hinter die Abdeckung, Escape ohne Wirkung | Fokus in die Seitenleiste, Tab bleibt darin (modal), Escape schließt, Fokus zurück; `aria-controls="seitenleiste"` |
| T3 | 2.4.3 | Mobile Werkzeuge „⋯“ (`App.tsx`) | Fokus blieb außerhalb des Menüs | Fokus hinein, Escape/Schließen → Fokus zurück |
| T4 | 4.1.2, 2.1.2, 2.4.3 | Haftungshinweis in der Modulfußzeile (`ModuleFooter.tsx`) | Overlay ohne `role="dialog"`/`aria-modal`/Namen, Schließen-Knopf ohne Namen, Tab lief in die Seite dahinter, Escape ohne Wirkung | modaler Dialog mit Überschrift als Name, Fokusfalle nur im Dialog, Escape und Klick auf die Abdeckung schließen, Fokus zurück; Knopf „Hinweis schließen“; „Engineering Disclaimer“ mit `lang="en"` |
| T5 | 2.4.3, 4.1.3 | PDF-Export (`App.tsx`) | Knopf während des Exports `disabled` → Tastaturfokus fiel auf `body`; Fortschritt nicht angesagt | `aria-disabled` (Fokus bleibt), Statusmeldung „PDF wird erstellt … / PDF erstellt.“, Fehler abgefangen |
| T6 | 2.4.7 | Favoritenstern in der Navigation (`ModulNavigation.tsx`, 3 Stellen) | fokussierbar, aber unsichtbar (`opacity-0`, nur beim Überfahren sichtbar) | zentral in `index.css`: `.opacity-0:focus-visible` / `:has(:focus-visible)` sichtbar |
| T7 | 1.4.13, 2.1.1 | Erläuterungen `InfoTooltip` (144 Stellen) und Regler-Info (`Slider.tsx`), Expositionsklassen (`MischungEingaben.tsx`) | nur per Maus (Überfahren) erreichbar, Symbol nicht fokussierbar, nicht per Escape ausblendbar, nicht mit dem Feld verknüpft | Schaltfläche „Erläuterung“ mit `aria-describedby` auf `role="tooltip"`, Einblenden auch bei Fokus, Escape blendet aus; Slider nutzt `InfoTooltip`; Expositionsklassen mit `aria-pressed` und Beschreibung |
| T8 | 4.1.2 | Regler: `Slider.tsx` (109 Dateien) und rohe `input type=range` (110 Dateien) | kein `aria-valuetext` – Screenreader sagten die rohe Zahl (mit Dezimalpunkt, ohne Einheit) | `Slider`: deutsch formatierter Wert mit Einheit (oder Klartext aus der Anzeige, Prop `valueText`); rohe Regler: Sicherheitsnetz in `useAutoFormLabels` (Anzeige daneben, sonst Wert mit Einheit aus der Beschriftung), sofort nach jeder Eingabe nachgeführt; A11y-Schriftgröße „100 Prozent“ |
| T9 | 4.1.3 | Rechenergebnisse (`FormulaDerivationBox`, 178 Dateien; dazu `bodenmechanik`, `rechnung_u_wert`, `festbeton_statistik`, `emodul`, `bauphysik`, `kriechen`) | Ergebnisse änderten sich ohne Ansage | neue Komponente `ErgebnisAnsage` (`role="status"`, polite, atomar, höchstens 300 Zeichen, erst nach 0,7 s Ruhe, nicht beim Seitenaufbau); zentral in `FormulaDerivationBox` (Titel + Ergebnishinweis), in den sechs Modulen ohne veränderlichen Hinweis eine Kurzzeile |
| T10 | 4.1.3 | Suche (`ModulNavigation.tsx`, `VolltextTreffer.tsx`) | Trefferzahl nicht angesagt | Statusmeldung „N Module gefunden, M Treffer im Inhalt“ (verzögert, nicht je Taste) |
| T11 | 4.1.2, 4.1.3, 2.4.3 | Quiz (`InteractiveQuizSystem.tsx`) | Antwortknöpfe nach dem Antworten `disabled` → Fokus verloren; gewählte Antwort nur farbig; Rückmeldung nicht angesagt; Sprungmarken „1, 2, 3“ ohne Zustand; Lückenfilter nur farbig | `aria-pressed` + `aria-disabled` (Fokus bleibt), Statuszeile „Frage n von N“ bzw. „Antwort richtig/falsch. Richtig ist …“, Sprungmarken mit `aria-current="step"` und „beantwortet/markiert“, Filter als Optionsgruppe |
| T12 | 1.1.1, 2.1.1 | 3D-Ansicht Mauerwerksverband (`Mauerwerk.tsx`, `MauerwerkVerband3D.tsx`) | Zeichenfläche ohne Textalternative, Drehen nur mit der Maus | `role="img"` mit Verband, Steinmaßen, Wanddicke, Überbindemaß und Drehwinkel; Schaltflächen „Nach links/rechts drehen (15°)“ (auch Pfeiltasten in der Gruppe), „Ansicht zurücksetzen“ |
| T13 | 1.3.1, 4.1.2 | Steckbrief-Auswahl Mauerwerk; Voreinstellungen im A11y-Dialog | gewählter Eintrag nur über Farbe | Optionsgruppen (`AuswahlGruppe`/`alsOption`, Pfeiltasten) |
| T14 | 1.1.1 | SVG-Schemata `knicken`, `bodenmechanik`, `festbeton_statistik` (2), `kriechen` (3), `emodul` (4) | ohne Textalternative, Beschriftungsfetzen („w_P“, „t = ∞“) einzeln vorgelesen | informative Grafiken `role="img"` mit (teils dynamischer) Beschreibung; rein dekorative bzw. daneben beschriebene `aria-hidden` |
| T15 | 1.3.1 | Navigation | zwei `nav` (Module, Brotkrumen), Modulnavigation ohne Namen; gewähltes Modul nur farbig | `nav aria-label="Module"`; `aria-current="page"` am gewählten Modul |
| T16 | 4.1.2 | Seitenleistenschalter (Desktop, „X“ in der Seitenleiste; Hinweis Gesamtgutachten #314) | nur `title` | `aria-label` „Navigation ausblenden“, `aria-expanded`, `aria-controls`; Kopfzeilenschalter und „Menü öffnen“ mit `aria-controls` |
| T17 | 1.3.1 | Tabellen ohne Beschriftung (`bp_glaeser`, `korrosionsschutz_beschichtungen`, `bauphysik`) | kein `caption`/`aria-label` | Sicherheitsnetz in `useAutoFormLabels`: Name aus der Überschrift davor (nicht über eine andere Tabelle hinweg) |
| T18 | 1.3.1 | A11y-Dialog | Überschrift `h4` direkt nach `h1` (Sprung) | `h2` (gleiche Optik) |
| T19 | 1.4.10 | Formeln im Fließtext bei 320 px (`emodul`, `kriechen`) | lange Inline-Formeln ragten bis 54 px über den Rand | bis 480 px scrollen Inline-Formeln für sich (`index.css`), per Tastatur fokussierbar (Hook) |
| T20 | 2.3.3 | Systemeinstellung „Bewegung reduzieren“ (alle 14 Seiten) | Übergänge der Seitenleiste (0,3 s), Einblenden der Module (0,5 s) und Fortschrittsbalken liefen weiter; wirkte nur der eigene Schalter | `@media (prefers-reduced-motion: reduce)` wie der Schalter: keine Animationen/Übergänge, kein sanftes Scrollen |
| T21 | 1.4.1, 1.4.11 | Erzwungene Farben (Windows-Kontrastdesigns), alle Reiterleisten, Optionsgruppen, Schalter, aktuelles Modul | gewählter Reiter/gedrückte Option nicht von den anderen unterscheidbar (nur Hintergrundfarbe); Schalterknopf unsichtbar | `@media (forced-colors: active)`: Innenrahmen in `Highlight` und Unterstreichung; Schalter mit Rahmen und sichtbarem Knopf |
| T22 | 1.4.11 | Fokusumriss auf farbigen Flächen (z. B. Ergebniskarte Bodenmechanik, grün/gelb) | Umriss Shiraz auf Farbe ≈ 1,9 : 1 (erst sichtbar, seit die Erläuterungen fokussierbar sind) | zweifarbiger Fokus im Modulinhalt: heller (dunkel: dunkler) Saum zwischen Element und Umriss, Umriss ≥ 7,5 : 1 zum Saum; Formularfelder ausgenommen (eigener Ring) |

### Ohne Befund (in der Stichprobe)

- **Sprunglink** (2.4.1): erster Tabstopp, bei Fokus sichtbar, führt in den Hauptbereich; nächster Tabstopp liegt im Hauptbereich.
- **Keine Tastaturfalle** (2.1.2): 90 (desktop) bzw. 60 (mobil) Tabstopps je Startseite, 40 je Modul.
- **Fokus sichtbar** (2.4.7) an allen übrigen Tabstopps; Kontrast ≥ 3 : 1. Hinweis: Messung nach Ablauf der Übergänge (`transition-colors` blendet auch die Umrissfarbe in 150 ms ein).
- **Kopfleiste** (Lernziele/Das Wichtigste/Ausprobieren/Annahmen): Enter öffnet, Leertaste schließt, `aria-expanded`/`aria-controls` korrekt.
- **Reiter** (`ModuleTabs`, `ReiterLeiste`): Pfeiltasten, Pos1/Ende, „roving tabindex“, gültiges `aria-controls`.
- **Überschriften**: genau ein `h1` je Seite, keine Sprünge im Inhalt; **Landmarken**: ein `main`, `banner`, Navigation.
- **Formeln**: alle KaTeX-Ausgaben mit MathML; **Bilder**: keine `img` ohne `alt`; **Sprache**: `lang="de"`.
- **Zoom 200 %** (720 px): kein waagerechtes Scrollen; **Textabstände** (1.4.12): kein zusätzlich abgeschnittener Text.
- **Diagramme**: Datentabellen-Alternative per Tastatur (bestehende Prüfung `a11y-diagramme.mjs`).

## Grenzen und Empfehlungen

- Stichprobe, kein vollständiger BITV-Test; ein Test mit echtem Screenreader (NVDA/JAWS, VoiceOver) steht aus (Ausschreibung Bachelorarbeit mit BITV-Stichprobe).
- `ErgebnisAnsage` ist in `FormulaDerivationBox` zentral; Rechner ohne Rechenweg-Box und mit sich änderndem Ergebnis brauchen eine eigene Kurzzeile – bei neuen Rechnern mitführen. Mehrere Rechenweg-Boxen eines Moduls werden nacheinander angesagt, wenn eine Eingabe alle betrifft.
- Tabellen- und Regler-Namen aus `useAutoFormLabels` sind ein Sicherheitsnetz; neue Module sollen `caption` bzw. `Slider` mit `unit`/`valueText` direkt setzen.
- Regressionstests: `tests/a11yTastaturSr.test.ts` (Komponenten und Quelltextregeln), Browser: `scripts/qa/a11y-tastatur.mjs` (0 Befunde Pflicht bei Änderungen an Navigation, Dialogen, Reitern, Reglern).
