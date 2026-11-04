# Freigabepaket: Brandschutz: Heißbemessung (`rechnung_brandschutz`)

Stand 04.11.2026 · Gruppe „Beispielrechnungen“ · Typ `calculator` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif nach Klärung von #247-7 und #247-8** – Holzteil und Balken-/Plattentabellen nachgerechnet und richtig; offen sind die Stützenwerte der Tab. 5.2a mit NA DE und die zulässigen Abplatzmethoden in Deutschland.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Durchgerechnetes Beispiel zur Heißbemessung: Holzbalken nach dem Verfahren mit reduziertem Querschnitt (DIN EN 1995-1-2: d_ef = β_n·t + 7 mm, k_fi, η_fi) und Stahlbeton nach dem Tabellenverfahren (DIN EN 1992-1-2: Balken Tab. 5.5, Platten Tab. 5.8, Stützen Tab. 5.2a) mit Hinweis zum Abplatzen hochfester Betone.

Bedeutung für die Lehre: Ergänzung und Nachschlagen; in keinem Lernpfad zugeordnet.

## Reiter und Bereiche

Ein Reiter der Komponente Beispielrechnungen mit zwei Unterreitern: Holz (Eingaben Querschnitt, Holzart, Brandbeanspruchung, Dauer, M_Ed) und Beton (Tabelle R30–R120 aus `src/data/brandschutzBeton.ts`).

Komponente `src/modules/Beispielrechnungen.tsx`; Inhalt `content/beispielrechnungen/Beispielrechnungen.json`, `content/beispielrechnungen/RechnungBestand.json`, `content/beispielrechnungen/RechnungBeton.json`, `content/beispielrechnungen/RechnungBrandschutz.json`, `content/beispielrechnungen/RechnungHolzbau.json`, `content/beispielrechnungen/RechnungMauerwerk.json`, `content/beispielrechnungen/RechnungNachhaltigkeit.json`, `content/beispielrechnungen/RechnungSchallschutz.json`, `content/beispielrechnungen/RechnungStahlbeton.json`, `content/beispielrechnungen/RechnungUWert.json`, `content/beispielrechnungen/daten.json`.

## Rechenkerne und Testabdeckung

Kein Rechenkern in `src/calc/`: die Holzrechnung steht inline in {{src/modules/Beispielrechnungen.tsx|const d_ef = d_char_n + 7.0}}, die Betontabelle in `src/data/brandschutzBeton.ts`. Beide sind in Tranche 3 (Nr. 9, Fälle BR3–BR5) Zeile für Zeile abgeglichen; Regression in `tests/modulpruefungTranche3.test.ts` und `tests/tranche3Entscheidungen.test.ts`.

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T3-BR-1 | Mindestmaße Balken: Breite und Achsabstand verschiedener Spalten der Tab. 5.5 → 80/25, 120/40, 150/55, 200/65 mm | erledigt (behoben) | T3 (`module-tranche-3.md`) (Nr. 9) |
| T3-BR-2 | Stützen ohne μ_fi → Spalten μ_fi = 0,5 und 0,7 (Methode A, Tab. 5.2a) | erledigt (umgesetzt, als vorläufig gekennzeichnet) | T3 (`module-tranche-3.md`), Umsetzung 28.10.; Normtext #247-7 |
| T3-BR-3 | PP-Fasern „zwingend“ → eine von vier Methoden A–D, Silikastaub-Grenze 6 % | erledigt (umgesetzt, als vorläufig gekennzeichnet) | T3 (`module-tranche-3.md`), Umsetzung 28.10.; Normtext #247-8 |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Kennungen nach dem Prüfbogen Normtext (Stand 28.10.2026) bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens.

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| #247-7 | DIN EN 1992-1-2 mit NA (Ausgabe in der App nicht angegeben), Tab. 5.2a (Stützen, Methode A, mehrseitig) | b_min/a in mm für μ_fi = 0,5 und 0,7 | R30: 200/25; 200/32 (300/27) – R60: 200/36 (300/31); 250/46 (350/40) – R90: 300/45 (400/38); 350/53 (450/40) – R120: 350/45 (450/40); 350/57 (450/51); je „μ_fi 0,5; μ_fi 0,7 (Alternative)“ – `src/data/brandschutzBeton.ts:28–31` |
| #247-8 | DIN EN 1992-1-2 mit NA (Ausgabe in der App nicht angegeben), 6.2 mit NDP (Abplatzen hochfester Beton) | Silikastaub-Grenze 6 M.-% und zulässige Methoden in Deutschland | „C55/67 bis C80/95 … Regeln für Normalbeton, solange der Silikastaubgehalt unter 6 M.-% … darüber mindestens eine Maßnahme: Bewehrungsnetz (A), Betonzusammensetzung (B), Schutzschicht (C), PP-Fasern ≥ 2 kg/m³ (D)“ – `content/beispielrechnungen/RechnungBrandschutz.json:29` |

## Quizfragen

6 Fragen, alle freigegeben.

## Quellen

DIN EN 1995-1-2:2010-12 (β_n, d₀ = 7 mm, k_fi 1,25/1,15, η_fi = 0,6), DIN EN 1992-1-2 mit NA (Normtext für #247-7/-8 nicht öffentlich; Wiedergaben Structville, Table 10, und The Concrete Centre, Lecture 8). Befundliste Tranche 3, Nr. 9.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Holz GL28h 18/36 cm, R60, dreiseitig, M_Ed = 45 kNm: d_ef = 0,7·60 + 7 = 49 mm, Restquerschnitt 82 × 311 mm, f_m,fi,d = 1,15·28 = 32,2 N/mm², M_fi,Rd = 42,56 kNm ≥ η_fi·M_Ed = 27 kNm (Ausnutzung 63 %).
2. Holz C24 12/24 cm, R30, vierseitig: d_ef = 31 mm, 58 × 178 mm, M_fi,Rd = 9,19 kNm (k_fi = 1,25).
3. Beton Balken Tab. 5.5 (erste Spalte): R30 80/25, R60 120/40, R90 150/55, R120 200/65 mm; Platten h_s 60/80/100/120 mm.
4. Stützen Tab. 5.2a, μ_fi = 0,5: R30 200/25, R60 200/36 (300/31), R90 300/45 (400/38), R120 350/45 (450/40); μ_fi = 0,7: 200/32, 250/46, 350/53, 350/57 mm (`src/data/brandschutzBeton.ts:29`; #247-7).
5. Abplatzen hochfester Beton: Silikastaub < 6 M.-% → Regeln für Normalbeton, sonst eine der Methoden A–D; Auswahl nach NA DE (`content/beispielrechnungen/RechnungBrandschutz.json:29`; #247-8).

## Empfehlung

**freigabereif nach Klärung von #247-7 und #247-8.** Holzteil und Balken-/Plattentabellen nachgerechnet und richtig; offen sind die Stützenwerte der Tab. 5.2a mit NA DE und die zulässigen Abplatzmethoden in Deutschland.

Nach der Regel der Freigabe vom 02.11.2026 (Tranche 16: im Modul gekennzeichnete Normtextpunkte gelten als erledigt) wäre das Modul schon jetzt freigabereif; nach der Regel vom 28.10.2026 (Normtextpunkte blockieren) erst nach dem Normtextabgleich. Siehe `README.md`, Abschnitt „Zu entscheiden“.
