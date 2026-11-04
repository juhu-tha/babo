# Freigabepaket: Brandschutz & Baustoffklassen (`brandschutz`)

Stand 04.11.2026 · Gruppe „Bauphysik“ · Typ `norm` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif** – Alle Befunde aus Tranche 3 sind erledigt; die im Prüfbogen genannten Normpunkte #247-7/-8 stehen nicht in diesem Modul, sondern nur in `rechnung_brandschutz`.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Grundlagen des Brandschutzes für die Bauphysik: Baustoffklassen nach DIN 4102-1 und Euroklassen nach DIN EN 13501-1 (A1 bis F, s/d), Feuerwiderstand R/E/I, Einheits-Temperaturzeitkurve (ETK) und Abbrand von Holz als Simulation.

Bedeutung für die Lehre: Pflichtlehre / zentrales Lehrmodul; Lernpfade: Zertifikat Ausbau und Bestand.

## Reiter und Bereiche

Reiter laut Komponente: Baustoffklassen (`baustoffklassen`) · Baulicher Brandschutz (`baulicher_brandschutz`) · Holzabbrand (Simulation) (`holzabbrand`).

Drei Reiter: Baustoffklassen, Baulicher Brandschutz (R/E/I, F- und REI-Bezeichnungen, ETK), Holzabbrand (Simulation mit β_n, ohne d₀ als Darstellung).

Komponente `src/modules/Brandschutz.tsx`; Inhalt `content/brandschutz/Brandschutz.json`.

## Rechenkerne und Testabdeckung

Kein Rechenkern in `src/calc/`; ETK und Abbrand werden in der Komponente gerechnet und sind in Tranche 3 (Nr. 9, Fälle BR1/BR2) nachgerechnet; Regression in `tests/modulpruefungTranche3.test.ts`.

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T3-BR-1 | Tabelle Stahlbeton-Mindestmaße kombinierte Spalten der Tab. 5.5 falsch → 120/40, 150/55, 200/65 mm | erledigt (behoben) (Tabelle liegt seit der Korrektur in `src/data/brandschutzBeton.ts` und wird nur von `rechnung_brandschutz` angezeigt) | T3 (`module-tranche-3.md`) (Nr. 9) |
| T3-BR-2 | Stützenspalte ohne μ_fi → μ_fi = 0,5 und 0,7 nach Tab. 5.2a | erledigt (umgesetzt, als vorläufig gekennzeichnet) | T3 (`module-tranche-3.md`); Normtext #247-7 (nur `rechnung_brandschutz`) |
| T3-BR-3 | PP-Fasern „zwingend“ → eine von vier Methoden, Silikastaub-Grenze 6 % | erledigt (umgesetzt, als vorläufig gekennzeichnet) | T3 (`module-tranche-3.md`); Normtext #247-8 (nur `rechnung_brandschutz`) |
| Hinweis | Abbrandsimulation ohne d₀ (Darstellung); Text verweist für die Bemessung auf DIN EN 1995-1-2 | kein Handlungsbedarf | T3 (`module-tranche-3.md`) |

**Neuer Befund dieses Pakets:** Der Prüfbogen ordnet #247-7 und #247-8 beiden Modulen zu. Im Fachmodul `brandschutz` stehen diese Stellen aber nicht: `src/modules/Brandschutz.tsx` importiert `src/data/brandschutzBeton.ts` nicht, und `content/brandschutz/Brandschutz.json` enthält weder die Stützentabelle noch den Abplatztext. Beide Stellen gibt es nur in `content/beispielrechnungen/RechnungBrandschutz.json` und `src/modules/beispielrechnungen/RechnungBrandschutz.tsx`.

## Offene Normpunkte

Keine.

## Quizfragen

8 Fragen, davon 2 nicht freigegeben: `qlz_brandschutz_1`, `qlz_brandschutz_2`.

## Quellen

DIN 4102-1, DIN EN 13501-1, DIN EN 1363-1 (ETK), DIN EN 1995-1-2 (Abbrandraten 0,8/0,7/0,55 mm/min). Befundliste Tranche 3, Nr. 9.

## Prüfschritte für die Freigabe (ca. 15 min)

1. ETK θ = 20 + 345·lg(8t + 1): 30/60/90 min → 842 / 945 / 1 006 °C (`content/brandschutz/Brandschutz.json:77`).
2. Abbrand BSH 200/400 mm, dreiseitig, β_n = 0,7 mm/min: nach 30 min 144 × 372 mm, nach 60 min 102 × 351 mm (W/W₀ = 0,62 / 0,39; in der Simulation ohne d₀).
3. Euroklassen: A1/A2 nichtbrennbar, B bis E brennbar, F ohne Leistung; Zusatz s1–s3 (Rauch) und d0–d2 (Abtropfen).
4. Hinweis zur nationalen Bezeichnung F90 ↔ REI 90 und „R90“ für Stützen ohne Raumabschluss (`content/brandschutz/Brandschutz.json:46`).
5. Quizfragen `qlz_brandschutz_1` und `_2` (nicht freigegeben) mit dem Reiter Baustoffklassen abgleichen.

## Empfehlung

**freigabereif.** Die Nachrechnungen BR1 und BR2 sind identisch, T3-BR-1 ist behoben. Die Normtextpunkte #247-7 (Stützen Tab. 5.2a) und #247-8 (Abplatzen) betreffen nur die Beispielrechnung Heißbemessung; sie blockieren daher nur `rechnung_brandschutz`. Vorschlag: die Blockliste des Prüfbogens entsprechend auf `rechnung_brandschutz` beschränken und `brandschutz` freigeben.
