# Freigabepaket: Tragwerksmonitoring (SHM) (`bauwerksunters_monitoring`)

Stand 04.11.2026 · Gruppe „Mängel & Schäden“ · Typ `standard` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif** – Fünf Befunde behoben, vier Nachrechnungen identisch; das Modul hängt nur über den eingebetteten Prüfkatalog an der Rückprall-Verwerfungsregel. Die Normpunkte sind in der App gekennzeichnet und gelten nach der Regel vom 02.11.2026 als erledigt.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Bauwerksdiagnostik und Tragwerksmonitoring bei Mängeln und Schäden: Sensorik und SHM (LVDT-Rissaufnehmer, DMS, Temperaturgang), minimalinvasive Verfahren (Bohrwiderstand, Endoskopie), Feuchtebewertung (CM, Darr, TDR), Wenner-Widerstand, Rückprall und Karbonatisierung; eingebettet der Prüfverfahren-Katalog.

Bedeutung für die Lehre: Ergänzung und Nachschlagen; in keinem Lernpfad zugeordnet.

## Reiter und Bereiche

Reiter laut Komponente: Tragwerks-Monitoring & Sensorik (SHM) (`monitoring`) · Holzdiagnostik & Resistographie (`grundlagen`) · Schadens- & Feuchterechner (`rechner`) · ZfP-Prüfkatalog (Konsolidiert) (`katalog`).

Komponente `src/modules/Bauwerksunters_Monitoring.tsx`; Inhalt `content/bauwerksunters_monitoring/Bauwerksunters_Monitoring.json`, `content/bauwerksuntersuchung/PruefverfahrenKatalog.json`, `content/bauwerksuntersuchung/PruefverfahrenSimulatoren.json`, `content/bauwerksuntersuchung/diagnoseData.json`, `content/bauwerksuntersuchung/pruefverfahrenData.json`.

## Rechenkerne und Testabdeckung

| Kern | Tests (Zahl der Prüfungen) | Referenzwerte |
|---|---|---|
| `src/calc/bauwerksuntersuchung.ts` | `tests/bauwerksuntersuchung.test.ts` (38), `tests/durchsichtA.test.ts` (49), `tests/hist13791.test.ts` (51), `tests/karsten.test.ts` (10), `tests/keinErgebnisAnzeige.test.ts` (1), `tests/lebensdauerUebergabe.test.ts` (35) und 6 weitere | Ultraschall 0,300 m in 71,4 µs, ρ = 2400, ν = 0,2: v_L = 4202 m/s, E_dyn = 38,1 GPa; Karbonatisierung x_c = 15 mm nach 40 a: k_c = 2,37 mm/√a |
| `src/calc/schutzInstandsetzung.ts` | `tests/keinErgebnisAnzeige.test.ts` (1), `tests/modulpruefungTranche13.test.ts` (19), `tests/nachstichprobe4.test.ts` (60) | CM-Belegreife CT 2,0 / beheizt 1,8, CA 0,5 / beheizt 0,3 CM-% (`belegreifeGrenzeCM`) |

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T13-SHM-1 | Wenner-Einordnung nach RILEM TC 154-EMC (< 100 hoch, 100–500 mäßig, 500–1000 gering, > 1000 Ωm vernachlässigbar) | erledigt (behoben) | T13 (`module-tranche-13.md`) (Nr. 3) |
| T13-SHM-2 | TDR misst volumetrischen Wassergehalt über die Dielektrizitätszahl | erledigt (behoben) | T13 (`module-tranche-13.md`) |
| T13-SHM-3 | Calciumsulfatestrich nicht belegreif: Erweichung, Haftungsverlust statt „Nadelbildung“ | erledigt (behoben) | T13 (`module-tranche-13.md`) |
| T13-SHM-4 | Verweis auf Prüfverfahren-Katalog, Begriffe, Splintholzkäfer nur Laubholz | erledigt (behoben) | T13 (`module-tranche-13.md`) |
| T13-SHM-5 | Holzquerschnitt im Simulator als dunkler Balken, Kontraste hell/dunkel | erledigt (behoben) | T13 (`module-tranche-13.md`) |
| T12-BU-7 | Eingebetteter Prüfkatalog enthält die Rückprall-Verwerfungsregel | offen (Normtext) | T13 (`module-tranche-13.md`), Hinweis |
| Hinweis | HF-Grenzen 40/80 Digits gerätespezifisch (im Text als Näherung); Grenzen-Eintrag am 29.10. ergänzt | erledigt (behoben) | T13 (`module-tranche-13.md`), Umsetzung 29.10. |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Für die Freigabe gelten sie als erledigt (Regel vom 02.11.2026, Entscheidung vom 04.11.2026); sie bleiben im Prüfbogen Normtext, Reiter „Nach Normen (04.11.)“, offen. Kennungen nach dem Prüfbogen bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens (28.10.2026).

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| T12-BU-7 (Nr. 1) | DIN EN 12504-2:2021-10, Auswertung | Verwerfungsregel des Rückprall-Messsatzes (6 Einheiten oder 25 % des Medians) | eingebetteter Prüfkatalog (`content/bauwerksuntersuchung/pruefverfahrenData.json`), Kern `rueckprallMesssatz` |

## Quizfragen

7 Fragen, davon 1 nicht freigegeben: `qlz_bauwerksunters_monitoring_1`.

## Quellen

VDI 6200:2010-02 und Blatt 1.1:2026-06, DIN 1076:2026-01, VDI/VDE 2635 Blatt 1, RILEM TC 154-EMC (Polder 2000, Tab. 2), DIN EN 12504-2. Befundliste Tranche 13, Nr. 3.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Beispiel 1 Ultraschall: 0,300 m in 71,4 µs → v_L = 4202 m/s; Faktor (1+ν)(1−2ν)/(1−ν) = 0,90 → E_dyn = 2400·4202²·0,90 = 38,1 GPa.
2. Beispiel 2 Wenner: a = 50 mm, 0,40 V bei 1,0 mA → ρ = 2π·0,05·400 = 125,7 Ωm → Korrosionsgefahr mäßig (100–500 Ωm).
3. Karbonatisierung: x_c = 15 mm nach 40 a → k_c = 15/√40 = 2,37 mm/√a.
4. CM-Belegreife: CT 2,0 / beheizt 1,8, CA 0,5 / beheizt 0,3 CM-%.
5. Eingebetteter Prüfkatalog: Rückprall-Verwerfungsregel wie bei `pruefverfahren_katalog` (T12-BU-7) – mit dem Normtextabgleich dort erledigt.

## Empfehlung

**freigabereif.** Fünf Befunde behoben, vier Nachrechnungen identisch; das Modul hängt nur über den eingebetteten Prüfkatalog an der Rückprall-Verwerfungsregel. Die Normpunkte sind in der App gekennzeichnet und gelten nach der Regel vom 02.11.2026 als erledigt.

Bisher „freigabereif nach Klärung von T12-BU-7“. Die offenen Normpunkte (von T12-BU-7) sind in der App als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und gelten nach der Regel vom 02.11.2026 (Entscheidung vom 04.11.2026) für die Freigabe als erledigt. Sie bleiben im Prüfbogen Normtext offen; nach der Normprüfung wird der Wert angepasst.
