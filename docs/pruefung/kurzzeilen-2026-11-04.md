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

ERGEBNIS_STICHPROBE

## QA

QA_TABELLE

Vorschau: `PORT=4533 node scripts/qa/vercel-vorschau.mjs dist`.
