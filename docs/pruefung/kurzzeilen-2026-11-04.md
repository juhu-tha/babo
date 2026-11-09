# Kurzzeilen 04.11.2026 – Ergebnisansage für alle Rechner (WCAG 4.1.3)

Anlass: offener Befund aus `docs/pruefung/kleinpunkte-2026-11-04.md` (Abschnitt 3): 303 von 318 `ergebnisHinweis`-Angaben sind feste Texte aus `content/`; Rechner, deren Ergebnis nur in einer solchen Rechenweg-Box steht, wurden für Screenreader nicht angesagt (z. B. `statistik`, `sonderbetone`). Umgesetzt wurde die dort genannte Empfehlung: je Rechner eine **Kurzzeile** aus den Kernergebnissen, angebunden über die vorhandene `ErgebnisAnsage` und das gemeinsame Ansagebündel aus #326. Branch `a11y/kurzzeilen-11-04` ab `audit/kleinpunkte-11-04` (#326, enthält #323). Sichtbare Darstellung unverändert (eine Ausnahme: Anzeigefehler in `bp_verkehr_pruefung`, s. 4). Prüfvermerke und Quizfreigaben unverändert. Prüfungen: `tests/kurzzeilen1104.test.ts`.

## 1. Zentrale Bausteine

| Baustein | Datei | Inhalt |
|---|---|---|
| `kurzzeile`-Prop | `src/components/ui/FormulaDerivationBox.tsx` | optional; wird statt „Titel: Ergebnishinweis“ angesagt und **nicht angezeigt**. Ohne Prop bleibt das bisherige Verhalten (fester Hinweis → stumm, aus Rechenwerten gebildeter Hinweis → angesagt). |
| `ansageWert(name, wert, stellen \| 'frei', einheit)` | `src/components/ui/ErgebnisAnsage.tsx` | „Name Zahl Einheit“, Dezimalkomma, Tausender ab 5 Stellen mit U+202F, Minuszeichen „−“, gerundet null ohne Vorzeichen; NaN/±∞/null → „Name –“ ohne Einheit. `'frei'` = wie `formatDeWert` (bis 6 Nachkommastellen). |
| `kurzzeile(...teile)` | ebenda | Teile mit Komma verbunden, leere/`false` entfallen. |
| `AuswertungsAnsicht.kurzzeile` | `src/components/handout/VersuchsHandout.tsx` | Pflichtfeld der fünf Versuchs-Handouts; die Ansage hängt außerhalb der Reiter, Protokolländerungen werden auch im Reiter „Messprotokoll“ angesagt. |

Regeln der Kurzzeilen: nur Kernergebnisse aus dem Rechenkern bzw. der Rechnung des Moduls (Zahl, Einheit, ggf. Klasse/Nachweisstatus), keine festen Erläuterungstexte; höchstens 300 Zeichen (gekürzt von `ansageText`); Status- und Klassentexte aus den vorhandenen `content/`-Werten, damit Ansage und Anzeige gleich lauten.

Wo eine Rechenweg-Box im Gültigkeitsbereich der Ergebnisse liegt, trägt sie die Kurzzeile (`kurzzeile=`, 26 Stellen). Sonst steht `<ErgebnisAnsage text={…} />` unmittelbar bei der Ergebnisanzeige (in der Regel nach `<EingabeHinweise>`), insgesamt rund 150 Stellen in 130 Dateien. Ergebnisse, die erst beim Abschluss eingehängt werden (Prüfstand, Biegezug, Spaltzug, Bitumen, Statistik-Probengenerator, Ausbreit-/Setzmaß, Expositionsklassen, Trainer-Rückmeldung), haben eine dauerhaft eingehängte Ansage mit leerem Text bis zum Ergebnis – der Text beim Einhängen gilt im Bündel als Seitenaufbau und würde sonst nicht angesagt.

## 2. Ersetzte Live-Regionen (keine Doppelansage)

Ganze Ergebniskarten als Live-Region (lang, mit Diagrammtexten) bzw. Nachweiskästen mit `role="status"` sind durch die Kurzzeile ersetzt; die Anzeige ist unverändert:

| Datei | vorher | nachher |
|---|---|---|
| `statistik/TTestTab.tsx`, `schallschutz/TrittschallTab.tsx`, `bodenmechanik/AtterbergTab.tsx` | `<section aria-live="polite">` um die Ergebniskarte | Kurzzeile (t/p-Wert und Entscheidung; L′n,w und Nachweis; w_L, I_P, I_C, Bodengruppe) |
| `Lebensdauerbemessung.tsx` | Ergebniskarte samt Diagramm `aria-live` | Kurzzeile (p_f, β, erforderliche Deckung, Nachweis) |
| `historischematerialkennwerte/BohrkernserieTab.tsx` | Ergebnisspalte `aria-live` | Kurzzeile an der Rechenweg-Box (n, Mittelwert, f_ck,is, Klasse) |
| `EcKennwerte.tsx` | Kennwert-Kacheln `aria-live` | Kurzzeile an der Rechenweg-Box |
| `StahlbauEC3.tsx`, `SommerlicherWaermeschutz.tsx`, `KorrosionsschutzBeschichtungen.tsx` | Nachweiskasten `role="status"` | Kurzzeile an der Rechenweg-Box |

Unverändert gelassen: `role="status"` von `EingabeHinweise` (Eingabewarnungen), Hinweis „f_k gesperrt“ in `mauerwerk`, Übernahmehinweis in `lebensdauerbemessung`.

## 3. Statische Prüfung (Ratsche, `tests/kurzzeilen1104.test.ts`)

- Rechner = Registry `typ: 'calculator'` **oder** Komponentenbaum mit Rechenkern aus `src/calc/` (Baum über Importe aus `src/modules` und `src/components`, ohne `ui/`, Kontexte und Daten; Zuordnung Modul → Komponente aus `src/routing/ModulInhalt.tsx`, für Reiter gemeinsamer Komponenten über `TEILDATEIEN`, z. B. `rissbreite` → `Rissbreite.tsx`, `bp_verkehr_bahn` → `BahnbauTab.tsx`, `lca_ingenieurbau` → `IngenieurbauLCA.tsx`). Zusätzlich `sonderbetone` (im Befund genannt, ohne Rechenkern).
- Ansagequelle = `<ErgebnisAnsage …>`, `kurzzeile={…}` an einer Rechenweg-Box oder ein aus Rechenwerten gebildeter Ergebnishinweis (Vorlage mit `${…}`, z. B. `knicken`, `rissbreite`, `biegebemessung`).
- Ergebnis: **137 Rechner**, alle mit Ansagequelle bis auf 3 begründete Ausnahmen (`AUSNAHMEN`, höchstens 3, keine ungenutzte):
  - `dpp` – Scan-Simulation und Datenblatt, keine Eingabe mit Rechenergebnis
  - `ki_prompting` – Prompt-Übungen ohne Rechenergebnis
  - `px_bautagebuch` – Formular zum Ausfüllen und Drucken
- Weitere Prüfungen: `ansageWert`/`kurzzeile` (Format, „–“, kein „NaN“), FormulaDerivationBox (genau eine Ansageregion, Kurzzeile nicht sichtbar, Vorrang vor dem Hinweis), keine `toFixed`/`toExponential`/`String(x)` in Ansagetexten, die ersetzten Live-Regionen aus Abschnitt 2 bleiben entfernt.
- Offen (Folgeauftrag, zweite Ratsche `REGLER_OFFEN`, darf nur kürzer werden): 25 Module **ohne** Rechenkern und nicht `calculator`, deren Baum Regler/Zahlenfelder ohne Ansage enthält – `analytik`, `bp_klebstoffe`, `bindemittel`, `innovative_werkstoffe`, `innenausbau`, `bruchmechanik`, `brandschutz`, `zertifizierung_siegel`, `kreislauf_dpp`, `bestand`, `schadstoffe`, `holzkorrosion`, `metallkorrosion`, `weitere_organik`, `bim_baustoffe`, `materialdatenbanken` sowie die neun KI-Seiten (gemeinsamer `MarkdownTab` mit einem Schalter). Diese liegen außerhalb der Auftragsdefinition („Registry calculator + Module mit Rechenkern“); neue Module dieser Art meldet der Test.
- `tests/hilfen/fliesstext.ts`: `<ErgebnisAnsage …>` und `kurzzeile=` zählen nicht als Fließtext (sonst überschritt `pruefverfahren_katalog` die Wortgrenze von `tests/teilmodule.test.ts` um 31 Wörter, die nur vorgelesen werden).

## 4. Beim Umsetzen gefunden und behoben

- `bp_verkehr_pruefung` (Asphalt-Hohlraumgehalt): Anzeige rechnete `formatDeZahl(Number("4,50"))` → `NaN` → sichtbar „– Vol.-%“; die Einstufung „zu dicht“ las `parseFloat("1,23") = 1`. Jetzt numerischer Wert `hohlraum` aus dem Rechenkern für Anzeige, Bewertung und Ansage (`BpVerkehrswegebau.tsx`, `bpverkehrswegebau/PrueftechnikTab.tsx`). Einzige sichtbare Änderung.
- `scripts/qa/a11y-tastatur.mjs`: Ohne Regler wird das erste Zahlenfeld per Pfeiltaste geändert (vorher blieben Rechner mit Zahlenfeldern ungeprüft); Befund bei „NaN“/„undefined“/„Infinity“ in einer Ansage; `--ansagen` listet die Ergebnisansage je Route (auch im `--json`-Ergebnis).

## 5. Stichprobe im Browser (`a11y-tastatur.mjs --nur modul`, 15 Rechner, desk und mob)

Vorgabe: genau eine Ergebnisansage je Eingabe, kein „NaN“. Geprüft per Pfeiltaste am ersten Regler bzw. (neu) am ersten Zahlenfeld der Startansicht, 1,3 s Ruhe, dann Zahl der Ergebnis-Regionen mit Text (`--ansagen`). Die Ausgangsliste enthielt fünf Rechner ohne Eingabe in der Startansicht (`einheiten`, `erdbau`, `glas`, `kunststoffe`, `stahlbau_ec3` – Eingaben erst in einem Reiter); sie wurden durch Rechner mit Eingabe in der Startansicht ersetzt. Ergebnis: **16 Rechner × desk/mob, jeweils genau 1 Ergebnisansage, 0 × „NaN“/„undefined“.**

| Route | Eingabe | angesagt (Auszug) |
|---|---|---|
| `statistik` | Regler | 6 Messwerte, Mittelwert 41,83 MPa, Median 40,00 MPa, Standardabweichung 14,68 MPa, Variationskoeffizient 35,1 % |
| `sonderbetone` | Regler | Rohdichte 1,50 kg/dm³, geschätzte Festigkeit etwa 24,5 MPa, Wärmeleitfähigkeit etwa 0,44 W/(m·K) |
| `frischbeton` | Zahlenfeld | Konform: Innerhalb der zulässigen Normtoleranz, Abweichung −15 mm, zulässig 425 bis 485 mm |
| `festbeton` | Zahlenfeld | C25/30, f_cd 15,00 N/mm², f_ctd 1,02 N/mm² |
| `schallschutz` | Zahlenfeld | flächenbezogene Masse 247,2 kg/m², Schalldämmmaß R_w 51,7 dB |
| `feuchteschutz` | Regler | Taupunkt 9,7 °C, Schimmelgrenze 13,1 °C, Oberflächenfeuchte 71 %, unkritisch |
| `wu-bauwerke` | Regler | Druckgefälle 11,67, Mindestdicke 240 mm, Dicke eingehalten, zulässige Rissbreite 0,15 mm, Rissbreite eingehalten |
| `korrosion` | Regler | Chloridgehalt in 35 mm Tiefe 1,79 %, kritischer Gehalt überschritten |
| `lebenszyklus_kosten` | Regler | Betrachtungszeitraum 55 Jahre: 6 Bauteile ohne Erneuerung, 22 mit einer, 6 mit mehreren Erneuerungen |
| `bp_holzprodukte` | Regler | Ausnutzung Biegung 63 %, Schub 33 %, Durchbiegung 85 %, Nachweis erfüllt |
| `knicken` | Regler | Euler-Knicklast …: F_K = 1438,1 kN, w ≈ 34,3 mm (Ergebnishinweis aus Rechenwerten, bestand) |
| `festigkeit` | Regler | Beton C20/25: höchstens 7722 Würfel, Stapelhöhe 849 m, Gesamtstauchung 283,2 mm |
| `bp_verkehr_pruefung` | Regler | Hohlraumfreie Dichte 2,456 g/cm³, Hohlraumgehalt 1,88 Vol.-%, konform |
| `zwang` | Regler | Zwangspannung 15,30 MPa, gerissen |
| `eigenspannungen` | Regler | größte Zugeigenspannung am Rand 2,7 MPa, größte Druckeigenspannung −1,4 MPa, Rissgefahr |
| `spannung` | Regler | f_cd 17,6 MPa, f_cm 39,0 MPa, E_cm 33,1 GPa, ε_c2 2,00 ‰ |

Im ersten Lauf fehlten Ansagen in `frischbeton` (Reiter Konsistenz: Zielwert-/Messwertvergleich ohne Rechenkern) und `lebenszyklus_kosten` (Reiter Lebensdauern); beide ergänzt, dazu `Preisentwicklung`. Übrige Befunde desselben Skripts bestanden vorher und sind nicht Gegenstand dieses Auftrags (Folgeauftrag vorgeschlagen): SVG ohne Textalternative (`statistik`, `schallschutz`, `wu-bauwerke`, `korrosion`, `lebenszyklus_kosten`, `zwang`), Überschriftensprünge (`kunststoffe`, `feuchteschutz`, `korrosion`, `bp_trockenbau`, `bp_verkehr_pruefung`), `aria-valuetext` des Reglers „Alterungsexponent (a)“ in `korrosion`.

## QA

| Prüfung | Ergebnis |
|---|---|
| `npx tsc --noEmit` | 0 Fehler |
| `npm test` | 201/201 Testdateien ok (neu: `tests/kurzzeilen1104.test.ts`) |
| `check:formeln` / `check:zahlen` | 0 fehlerhaft / 0 Befunde |
| `check-design`, `check-verwaist --strict`, `check-any` | 0 neu / 0 verwaist / 0 `any` |
| Build `BB_STATISCH=1`, `check-bundle --statisch` | ok, Einstieg 107,9 kB gzip (Grenze 108 kB), Erstpfad max. 220,7 kB (Grenze 225 kB) |
| `a11y-tastatur.mjs --nur modul --ansagen` (16 Rechner, desk, mob) | je Eingabe genau 1 Ergebnisansage, 0 × „NaN“; vorbestehende Befunde s. 5 |
| `a11y-reiter.mjs` (statistik, sonderbetone, frischbeton, lebenszyklus_kosten, bp_verkehr_pruefung, labor_druckfestigkeit, stahlbau_ec3, lebensdauerbemessung, schallschutz, historisch, pruefverfahren_katalog, labor; desk, mob, desk-dunkel) | 219 Reiter-Prüfungen, 0 Verstöße |

Vorschau: `PORT=4533 node scripts/qa/vercel-vorschau.mjs dist`.
