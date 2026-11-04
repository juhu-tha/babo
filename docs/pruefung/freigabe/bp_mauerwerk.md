# Freigabepaket: Mauerwerksprodukte (`bp_mauerwerk`)

Stand 04.11.2026 · Gruppe „Bauprodukte“ · Typ `standard` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif** – Beispiel über geprüften Kern richtig, zwei Befunde erledigt; offen sind ein λ-Wert für Lehmsteine und die Klinker-Wasseraufnahme. Die Normpunkte sind in der App gekennzeichnet und gelten nach der Regel vom 02.11.2026 als erledigt.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Mauerwerksprodukte: zehn Datenblätter für Steine und Dämmstoffe (Ziegel, Klinker, Kalksandstein, Porenbeton, Leichtbeton, Lehmstein, Kerndämmung, VIP), Mörtelarten, Wandsysteme (WDVS, zweischalig), Marktübersicht, Beispiel KS-Innenwand.

Bedeutung für die Lehre: Ergänzung und Nachschlagen; in keinem Lernpfad zugeordnet.

## Reiter und Bereiche

Ein Modul mit Produktdatenblättern, Mörtel, Wandsystemen und Rechenbeispiel.

Komponente `src/modules/BpMauerwerk.tsx`; Inhalt `content/bpmauerwerk/BpMauerwerk.json`.

## Rechenkerne und Testabdeckung

Kein eigener Kern; das Beispiel nutzt `fkEmpfehlungEN`/`fdAusFk` aus `src/calc/mauerwerk.ts` (in Tranche 1/3 geprüft).

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T7-MW-1 | Kerndämmung „Klasse A1 bis A2“ (EPS ist nicht A1/A2) → „A1 (Mineralwolle) bis E (EPS); PUR je nach Produkt“ | erledigt (behoben) | T7 (`module-tranche-7.md`) (Nr. 11) |
| T7-MW-2 | WDVS „A1 bis B1“ (Euroklassen und DIN 4102 gemischt) → „A2-s1,d0 bis B-s1,d0; maßgebend abZ/aBG bzw. ETA“; offen bleibt DIN EN 13499/13500 gegenüber DIN EN 17237 | erledigt (umgesetzt) (29.10.) | T7 (`module-tranche-7.md`), Umsetzung 29.10. |
| T7-MW-3 | Lehmstein-λ (0,81 bei 1700 oder 1800 kg/m³) und Klinker-Wasseraufnahme ≤ 6 M.-% | offen (Normtext) | T7 (`module-tranche-7.md`) |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Für die Freigabe gelten sie als erledigt (Regel vom 02.11.2026, Entscheidung vom 04.11.2026); sie bleiben im Prüfbogen Normtext, Reiter „Nach Normen (04.11.)“, offen. Kennungen nach dem Prüfbogen bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens (28.10.2026).

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| T7-MW-3a | DIN 4108-4:2020-11, Tabelle Bemessungswerte, Lehmbaustoffe | λ bei 1700 und 1800 kg/m³ (0,81 oder 0,91 W/(mK) bei 1800) | „0,47 - 0,81 W/(m·K)“ bei „1200 - 1800 kg/m³“ – `content/bpmauerwerk/BpMauerwerk.json:266–267` |
| T7-MW-3b | DIN 20000-401:2017-01 / DIN 105-100:2012-01, Anforderungen an Klinker (Wasseraufnahme) | Grenzwert der Wasseraufnahme | „geringer Wasseraufnahme (≤ 6 M.-%)“ – `content/bpmauerwerk/BpMauerwerk.json:126` |

## Quizfragen

6 Fragen, alle freigegeben.

## Quellen

DIN EN 771, DIN 4108-4:2020-11, DIN 105-100:2012-01 bzw. DIN 20000-401:2017-01, DIN EN 13499/13500, DIN EN 17237. Befundliste Tranche 7, Nr. 11.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Beispiel KS-Innenwand (EN-Empfehlung): Gruppe 1, NM, K = 0,55, f_b = 20, f_m = 10 → f_k = 8,93, f_d = 5,06 N/mm²; t = 175 mm, Φ = 0,8 → n_Rd = 709 kN/m (Text ≈ 710).
2. Dünnbettmörtel: K = 0,80, f_b = 20 → f_k = 0,80·20^0,85 = 10,21 N/mm².
3. VIP λ = 0,007 gegenüber EPS λ = 0,035 → rund fünfmal dünner.
4. Lehmstein „λ 0,47–0,81 W/(mK) bei 1200–1800 kg/m³“ (`content/bpmauerwerk/BpMauerwerk.json:267`) gegen DIN 4108-4 prüfen (0,81 bei 1700, 0,91 bei 1800?; T7-MW-3a).
5. Klinker „Wasseraufnahme ≤ 6 M.-%“ gegen DIN 105-100/DIN 20000-401 prüfen (T7-MW-3b).

## Empfehlung

**freigabereif.** Beispiel über geprüften Kern richtig, zwei Befunde erledigt; offen sind ein λ-Wert für Lehmsteine und die Klinker-Wasseraufnahme. Die Normpunkte sind in der App gekennzeichnet und gelten nach der Regel vom 02.11.2026 als erledigt.

Bisher „freigabereif nach Klärung von T7-MW-3a/b“. Die offenen Normpunkte (von T7-MW-3a/b) sind in der App als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und gelten nach der Regel vom 02.11.2026 (Entscheidung vom 04.11.2026) für die Freigabe als erledigt. Sie bleiben im Prüfbogen Normtext offen; nach der Normprüfung wird der Wert angepasst.
