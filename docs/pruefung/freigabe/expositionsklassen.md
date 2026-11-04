# Freigabepaket: Expositionsklassen (DIN EN 206 / DIN 1045-2) (`expositionsklassen`)

Stand 04.11.2026 · Gruppe „Betontechnologie“ · Typ `calculator` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif** – Hüllwerte, k-Wert-Ansatz und Klassendaten nachgerechnet und richtig; offen ist nur der Wortlaut der AKR-Maßnahmen bei WF/WA am Richtlinientext. Die Normpunkte sind in der App gekennzeichnet und gelten nach der Regel vom 02.11.2026 als erledigt.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Expositionsklassen nach DIN EN 206 und DIN 1045-2 für Betontechnologie und Massivbau: 21 Klassen (XC, XD, XS, XF, XA, XM) mit Grenzwerten (w/z)_eq, Mindestfestigkeitsklasse, Mindestzementgehalt, Luftporen und c_min,dur nach Tab. 4.4DE; Hüllwertrechner für Klassenkombinationen, k-Wert-Ansatz für Zusatzstoffe, XA-Grenzwerte und Feuchtigkeitsklassen (Alkali-Richtlinie).

Bedeutung für die Lehre: Pflichtlehre / zentrales Lehrmodul; in keinem Lernpfad zugeordnet.

## Reiter und Bereiche

Klassenübersicht mit Bauteilskizze, Hüllwertrechner (Kombination, Größtkorn, Δc_dev, Schalter „XF2/XF3 ohne LP“), k-Wert-Rechner, Tabellen XA und Feuchtigkeitsklassen WO/WF/WA/WS; Übergabe der Deckung an `lebensdauerbemessung`.

Komponente `src/modules/Expositionsklassen.tsx`; Inhalt `content/expositionsklassen/Expositionsklassen.json`, `content/expositionsklassen/ExpositionsklassenSkizze.json`, `content/expositionsklassen/daten.json`.

## Rechenkerne und Testabdeckung

| Kern | Tests (Zahl der Prüfungen) | Referenzwerte |
|---|---|---|
| `src/calc/expositionsklassen.ts` | `tests/expositionsklassen.test.ts` (17), `tests/modulpruefungTranche3.test.ts` (60), `tests/quizRechenfragen.test.ts` (43), `tests/tranche3Entscheidungen.test.ts` (0) | XC4 + XF1, D_max 16 mm, Δc_dev 15 mm: (w/z)_eq 0,60, C25/30, z ≥ 280 kg/m³, c_nom 40 mm; k-Wert z = 310, w = 165, f = 50: (w/z)_eq = 0,500 |

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T3-EX-1 | XF2/XF3 immer mit LP → Schalter „ohne LP“ ((w/z)_eq ≤ 0,50, C35/45, z ≥ 320) | erledigt (umgesetzt) (28.10.) | T3 (`module-tranche-3.md`) (Nr. 6), Umsetzung 28.10. |
| T3-EX-2 | AKR-Text zu WA („E II-S“, „NA-Zement obligatorisch“) → Wortlaut nach Alkali-Richtlinie, „E II-S“ entfernt | erledigt (umgesetzt, als vorläufig gekennzeichnet) | T3 (`module-tranche-3.md`); Normtext #247-5, #247-6 |
| M-6 | Anrechnung von Zusatzstoffen bei XF2/XF4 (aus Tranche 1) | erledigt (entschieden 28.10.) | T1 (`module-tranche-1.md`) |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Für die Freigabe gelten sie als erledigt (Regel vom 02.11.2026, Entscheidung vom 04.11.2026); sie bleiben im Prüfbogen Normtext, Reiter „Nach Normen (04.11.)“, offen. Kennungen nach dem Prüfbogen bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens (28.10.2026).

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| #247-5 | DAfStb-Alkali-Richtlinie (2013-10), Teil 1, Tabellen der vorbeugenden Maßnahmen, Feuchtigkeitsklasse WF | Wortlaut der Maßnahmen bei WF | „E I (E I-O, E I-OF, E I-S): keine vorbeugenden Maßnahmen. Bei … E II-O/-OF, E III-O/-OF, E III-S je nach Klasse und Zementgehalt keine Maßnahme, NA-Zement … oder Austausch der Gesteinskörnung bzw. gutachtliche Stellungnahme“ – `content/expositionsklassen/daten.json:184` |
| #247-6 | DAfStb-Alkali-Richtlinie (2013-10), Teil 1, wie oben, Feuchtigkeitsklasse WA | Wortlaut der Maßnahmen bei WA | „E I …: keine vorbeugenden Maßnahmen. Bei alkaliempfindlicher Gesteinskörnung … strenger als bei WF: je nach Klasse und Zementgehalt NA-Zement, Austausch der Gesteinskörnung oder gutachtliche Stellungnahme“ – `content/expositionsklassen/daten.json:191` |

## Quizfragen

7 Fragen, davon 1 nicht freigegeben: `qlz_expositionsklassen_1`.

## Quellen

DIN 1045-2:2023-08, Tab. F.2.1/F.2.2; DIN EN 206; DIN EN 1992-1-1/NA Tab. 4.4DE; DAfStb-Alkali-Richtlinie 2013-10 (Normtext für #247-5/-6 nicht öffentlich; Wiedergabe InformationsZentrum Beton, Handout 09/2025). Befundliste Tranche 3, Nr. 6.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Startwerte XC4 + XF1, D_max = 16 mm, Δc_dev = 15 mm: (w/z)_eq ≤ 0,60, C25/30, z ≥ 280 kg/m³, keine LP, c_min,dur = 25 → c_nom = 40 mm.
2. XC4 + XF4: (w/z)_eq ≤ 0,50, C30/37, z ≥ 320, LP ≥ 4,5 % (D_max 16), c_nom = 40 mm; XD3 + XF2 + XA2, D_max 32: 0,45, C35/45, 320, LP ≥ 4,0 %, c_nom = 55 mm.
3. Schalter „XF2/XF3 ohne LP“: Hinweis „(w/z)_eq ≤ 0,50, C35/45, z ≥ 320 kg/m³“; mit XF4 bleibt LP-Beton maßgebend (`src/calc/expositionsklassen.ts:86`).
4. k-Wert: z = 300, w = 165, f = 120, s = 20 kg/m³ → f anrechenbar 99 kg, z_eq = 359,6, (w/z)_eq = 0,459; Kombinationsregel f ≤ 0,66·z − 3·s = 138 eingehalten.
5. Feuchtigkeitsklassen WF und WA: Wortlaut der vorbeugenden Maßnahmen gegen die Tabellen der Alkali-Richtlinie lesen (`content/expositionsklassen/daten.json:180`; #247-5/-6).
6. Nur XC1: c_min,dur = 10 mm, Hinweis Δc_dev = 10 mm → c_nom = 20 mm.

## Empfehlung

**freigabereif.** Alle vier Nachrechnungen und die Klassendaten stimmen mit DIN 1045-2/DIN EN 206; T3-EX-1 ist umgesetzt. Offen ist der Tabellenwortlaut der Alkali-Richtlinie für WF und WA (#247-5/-6). Er betrifft nur die Texttabelle der Feuchtigkeitsklassen, nicht den Rechner.

Bisher „freigabereif nach Klärung von #247-5 und #247-6“. Die offenen Normpunkte (von #247-5 und #247-6) sind in der App als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und gelten nach der Regel vom 02.11.2026 (Entscheidung vom 04.11.2026) für die Freigabe als erledigt. Sie bleiben im Prüfbogen Normtext offen; nach der Normprüfung wird der Wert angepasst.
