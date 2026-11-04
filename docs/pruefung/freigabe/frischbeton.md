# Freigabepaket: Frischbetonprüfungen (`frischbeton`)

Stand 04.11.2026 · Gruppe „Betontechnologie“ · Typ `calculator` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif** – LP-Kern neu, nachgerechnet und korrigiert (T3-FB-1); offen sind die Konsistenz-Grenzabweichungen am Normtext DIN EN 206. Die Normpunkte sind in der App gekennzeichnet und gelten nach der Regel vom 02.11.2026 als erledigt.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Frischbetonprüfungen für Baustoffkunde (Termin 7) und Betontechnologie: Konsistenz (Setz-, Ausbreit-, Verdichtungsmaß) mit Klassen und Grenzabweichungen, Luftgehalt nach dem Druckausgleichsverfahren mit Grenzen nach DIN EN 206, Frischbetonrohdichte; Unterreiter Ausbreitversuch, Frischbetondruck und Frischbetontemperatur.

Bedeutung für die Lehre: Pflichtlehre / zentrales Lehrmodul; Lernpfade: Baustoffkunde.

## Reiter und Bereiche

Reiter Konsistenz & Toleranzen (Toleranzprüfer), Luftgehalt & Rohdichte (LP-Prüfung je Expositionsklasse und Größtkorn); eingebettete Unterreiter Ausbreitversuch, Frischbetondruck, Frischbetontemperatur.

Komponente `src/modules/Frischbeton.tsx`; Inhalt `content/ausbreitversuch/Ausbreitversuch.json`, `content/frischbeton/Frischbeton.json`, `content/frischbetondruck/Frischbetondruck.json`, `content/frischbetontemperatur/Frischbetontemperatur.json`.

## Rechenkerne und Testabdeckung

| Kern | Tests (Zahl der Prüfungen) | Referenzwerte |
|---|---|---|
| `src/calc/frischbeton.ts` | `tests/frischbeton.test.ts` (13), `tests/modulpruefungTranche3.test.ts` (60) | XF4, D_max 32 mm, Ablesung 4,8 %, G = 0,2 %: L = 4,6 % ≥ 4,0 %, obere Grenze 8,0 % → erfüllt; XF4, D_max 16 mm, L = 9,0 % > 8,5 % → überschritten |

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T3-FB-1 | Obere LP-Grenze „Richtwert ~4 % über Sollwert“ war Normgröße (DIN EN 206, 5.4.3: Mindestwert + 4 %); falsche Meldung „Mindestluftporengehalt unterschritten“ bei zu hohem Luftgehalt; Einzelwert-Grenzen | erledigt (behoben) | T3 (`module-tranche-3.md`) (Nr. 4) |
| T3-FB-2 | Grenzabweichungen der Konsistenz: Setzmaß ±10/±20/±30/±40 mm (> 150 mm), Ausbreitmaß ±20/±30/±40 mm – nur die Dreistufung öffentlich belegt | offen (Normtext) | T3 (`module-tranche-3.md`) (Nr. 4); Freigabe 29.10.: „nicht entschieden“ |
| F-Stelle T3/4 | Tabellennummer der Grenzabweichung −0,5/+1,0 % in DIN EN 206:2021-06 (in DIN EN 206-1:2001 Tab. 17) | offen (Zitat) | T3 (`module-tranche-3.md`) |
| Hinweis | XF3 auch als LP-Beton zulässig → in den Grenzen ergänzt | erledigt (behoben) | T3 (`module-tranche-3.md`) |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Für die Freigabe gelten sie als erledigt (Regel vom 02.11.2026, Entscheidung vom 04.11.2026); sie bleiben im Prüfbogen Normtext, Reiter „Nach Normen (04.11.)“, offen. Kennungen nach dem Prüfbogen bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens (28.10.2026).

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| T3-FB-2 | DIN EN 206:2021-06, Grenzabweichungen für Zielwerte der Konsistenz (Abschnitt prüfen) | Staffel Setzmaß (±40 mm über 150 mm?) und Ausbreitmaß (±20 bis 400 / ±30 bis 540 / ±40 mm) | Toleranzprüfer in `src/modules/Frischbeton.tsx` (Kern `src/calc/frischbeton.ts`) |
| F-Stelle T3/4 | DIN EN 206:2021-06 | Tabellennummer der Grenzabweichung des Luftgehalts −0,5/+1,0 % | `content/frischbeton/Frischbeton.json` |

## Quizfragen

7 Fragen, davon 1 nicht freigegeben: `qn_frischbeton_4`.

## Quellen

DIN EN 206:2021-06, 5.4.3 (obere LP-Grenze, öffentlich wiedergegeben bei Glinicki, BTA 2/2004), DIN EN 12350-2/-5/-6/-7. T3-FB-2 steht noch nicht im Prüfbogen Normtext (Ergänzung vorgeschlagen: neue Norm DIN EN 206). Befundliste Tranche 3, Nr. 4.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Rechenbeispiel LP: XF4, D_max = 32 mm, Ablesung 4,8 %, Gesteinskorrektur G = 0,2 % → L = 4,6 %; Mindestwert 4,0 %, Einzelwert ≥ 3,5 %, obere Grenze 8,0 %, oberer Einzelwert 9,0 % → erfüllt.
2. Quizfall `qn_frischbeton_4` (nicht freigegeben): XF4, D_max = 16 mm, L = 9,0 % → obere Grenze 8,5 % überschritten, als Einzelwert bis 9,5 % zulässig.
3. XF2, D_max = 8 mm: Mindestwert 5,5 %, Einzelwert ≥ 5,0 % → L = 5,2 / 5,0 / 4,9 % ergibt Grenzbereich / Grenzbereich / unterschritten.
4. Frischbetonrohdichte: m₁ = 10,2 kg, m₂ = 29,1 kg, V = 8 l → D = 2362,5 kg/m³.
5. Toleranzprüfer Konsistenz: Staffeln Setzmaß ±10/±20/±30/±40 mm und Ausbreitmaß ±20/±30/±40 mm am Normtext DIN EN 206 bestätigen (T3-FB-2).

## Empfehlung

**freigabereif.** Der LP-Kern ist in Tranche 3 neu entstanden und in vier Fällen nachgerechnet; T3-FB-1 ist behoben. Offen ist T3-FB-2 (vierte Stufe Setzmaß, Staffel Ausbreitmaß). Der Punkt steht noch nicht im Prüfbogen Normtext; Vorschlag: DIN EN 206 dort als eigene Norm aufnehmen. Die Unterreiter Ausbreitversuch, Frischbetondruck und Frischbetontemperatur wurden in Tranche 3 nicht im Detail geprüft (eigene Module); vor der Freigabe kurz ansehen.

Bisher „freigabereif nach Klärung von T3-FB-2“. Die offenen Normpunkte (von T3-FB-2) sind in der App als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und gelten nach der Regel vom 02.11.2026 (Entscheidung vom 04.11.2026) für die Freigabe als erledigt. Sie bleiben im Prüfbogen Normtext offen; nach der Normprüfung wird der Wert angepasst. Die drei eingebetteten Unterreiter sind Teil der Prüfschritte.
