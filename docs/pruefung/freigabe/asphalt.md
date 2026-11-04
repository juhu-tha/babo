# Freigabepaket: Asphalt & Bitumen (`asphalt`)

Stand 04.11.2026 · Gruppe „Baustoffe“ · Typ `standard` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif nach Klärung der F-Stelle Mindest-Lufttemperaturen (ZTV Asphalt-StB 26)** – Fünf Nachrechnungen identisch, beide Korrekturen erledigt; offen ist nur der Abgleich der Einbautemperaturen mit der neuen ZTV Asphalt-StB 26.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Asphalt und Bitumen für Baustoffkunde (Termin 11): Bitumensorten und Kennwerte (Nadelpenetration, Erweichungspunkt RuK), Asphaltmischgut, Roh- und Raumdichte, Hohlraumgehalt, Marshall-Versuch, temperaturabgesenkter Asphalt (NTA) mit Lehrmodellen, Arbeitsschutz (AGW Dämpfe/Aerosole).

Bedeutung für die Lehre: Pflichtlehre / zentrales Lehrmodul; Lernpfade: Baustoffkunde.

## Reiter und Bereiche

Reiter laut Komponente: Baustoff-Steckbrief (`steckbrief`) · Grundlagen & Zusammensetzung (`grundlagen`) · Asphaltarten (`arten`) · Material- & Produkteigenschaften (`eigenschaften`) · Niedrigtemperaturasphalte (NTA) (`nta`).

Ein Modul mit Fachtext, Raumdichte-/Hohlraumrechner, Marshall-Lehrkurve und NTA-Simulator (Viskosität, Aerosol, Energie, CO₂, Zeitfenster als Lehrmodelle).

Komponente `src/modules/Asphalt.tsx`; Inhalt `content/asphalt/Asphalt.json`.

## Rechenkerne und Testabdeckung

| Kern | Tests (Zahl der Prüfungen) | Referenzwerte |
|---|---|---|
| `src/calc/asphalt.ts` | `tests/asphalt.test.ts` (27), `tests/modulpruefungTranche3.test.ts` (60) | B = 5 M.-%, V_m = 3 %, ρ_G = 2,65, ρ_B = 1,03 g/cm³: ρ_m = 2,4568, ρ_b = 2,3831 g/cm³; NTA 165 °C: Aerosol 5,39 mg/m³ (Lehrmodell) |

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T3-AS-1 | Übergangsfrist AGW 1,5 mg/m³ „endete Ende 2024“ überholt → ausgesetzt bis 31.12.2026, ab 01.01.2027 einzuhalten | erledigt (behoben) | T3 (`module-tranche-3.md`) (Nr. 8) |
| T3-AS-2 | ZTV Asphalt-StB 07/13 als geltend → ZTV Asphalt-StB 26 Teil 1 (ARS 08/2026), TL Asphalt-StB 26 | erledigt (behoben) | T3 (`module-tranche-3.md`) |
| F-Stelle T3/8 | Mindest-Lufttemperaturen beim Einbau nach ZTV Asphalt-StB 07/13, Tab. 6; Abgleich mit ZTV Asphalt-StB 26 Teil 1 ausstehend | offen (gekennzeichnet) | T3 (`module-tranche-3.md`); Freigabe 29.10.: „offen“ |
| Hinweis | NTA-Viskosität, Aerosol, Energie, CO₂, Abkühlung sind gekennzeichnete Lehrmodelle | kein Handlungsbedarf | T3 (`module-tranche-3.md`) |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Kennungen nach dem Prüfbogen Normtext (Stand 28.10.2026) bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens.

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| F-Stelle T3/8 | ZTV Asphalt-StB 26 Teil 1 (Tabelle Mindest-Lufttemperaturen; vorher ZTV Asphalt-StB 07/13, Tab. 6) | Deckschicht ≥ 3 cm +5 °C, < 3 cm +10 °C; Binder- und Tragdeckschicht 0 °C; Tragschicht −3 °C unverändert? | `content/asphalt/Asphalt.json:123` |

## Quizfragen

7 Fragen, davon 2 nicht freigegeben: `qn_asphalt_1`, `qlz_asphalt_1`.

## Quellen

DIN EN 12591, DIN EN 1426, DIN EN 1427, TL Asphalt-StB 26, ZTV Asphalt-StB 26 Teil 1 (ARS 08/2026; FGSV-Pressemitteilung 23.04.2026), TRGS 900 (AGW), Handwerksblatt zum AGW 2027. Die F-Stelle steht noch nicht im Prüfbogen (Ergänzung bei Nr. 14 vorgeschlagen). Befundliste Tranche 3, Nr. 8.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Raumdichte (Beispiel): B = 5 M.-%, V_m = 3 Vol.-%, ρ_G = 2,65, ρ_B = 1,03 g/cm³ → V_fest = 95/2,65 + 5/1,03 = 40,70 cm³, ρ_m = 2,4568, ρ_b = 2,4568·0,97 = 2,3831 g/cm³.
2. Zweiter Fall: B = 6 M.-%, V_m = 4 %, ρ_G = 2,70, ρ_B = 1,02 → ρ_m = 2,4572, ρ_b = 2,3589 g/cm³.
3. Marshall-Lehrkurve: 12 kN bei 5,5 M.-%, 9 kN bei 7,0 M.-% Bindemittel.
4. NTA organisch, 130 °C: η = 0,4·1,06³⁵·0,38 = 1,17 Pa·s (optimal), Einbaufenster 38·ln(115/70) = 19 min – Kennzeichnung „Lehrmodell“.
5. AGW Walzasphalt 1,5 mg/m³: ausgesetzt bis 31.12.2026, ab 01.01.2027 einzuhalten.
6. Mindest-Lufttemperaturen beim Einbau (`content/asphalt/Asphalt.json:123`) mit der ZTV Asphalt-StB 26 Teil 1 abgleichen.

## Empfehlung

**freigabereif nach Klärung der F-Stelle Mindest-Lufttemperaturen (ZTV Asphalt-StB 26).** Fünf Nachrechnungen identisch, beide Korrekturen erledigt; offen ist nur der Abgleich der Einbautemperaturen mit der neuen ZTV Asphalt-StB 26.

Nach der Regel der Freigabe vom 02.11.2026 (Tranche 16: im Modul gekennzeichnete Normtextpunkte gelten als erledigt) wäre das Modul schon jetzt freigabereif; nach der Regel vom 28.10.2026 (Normtextpunkte blockieren) erst nach dem Normtextabgleich. Siehe `README.md`, Abschnitt „Zu entscheiden“.
