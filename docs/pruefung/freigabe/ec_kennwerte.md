# Freigabepaket: Kennwerte und Bemessungswerte nach Eurocode (`ec_kennwerte`)

Stand 04.11.2026 · Gruppe „Grundlagen“ · Typ `calculator` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif nach Klärung von EK-N1 bis EK-N4** – Neues Modul aus zentralen, bereits geprüften Konstanten; Beispiele zweimal nachgerechnet (Test und Paket). Offen sind vier NA-Werte der außergewöhnlichen Situation bzw. α_ct; EK-N5 bis EK-N7 betreffen belegte Formeln oder den Ausblick.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Baustoffübergreifender Weg vom Prüfergebnis über den charakteristischen Wert (5-%-Quantil) zum Bemessungswert nach Eurocode mit NA (DE): Teilsicherheitskonzept, Statistik nach DIN EN 1990 Anhang D, Konformität nach DIN EN 206, Kennwerte und Bemessungswerte für Beton, Betonstahl, Baustahl, Holz und Mauerwerk; Ausblick auf η_cc und k_tc der 2. Generation. Neu seit 02.11.2026 (#316), verlinkt aus acht Fachmodulen.

Bedeutung für die Lehre: Pflichtlehre / zentrales Lehrmodul; in keinem Lernpfad zugeordnet.

## Reiter und Bereiche

Reiter laut Komponente: Teilsicherheitskonzept (`grundlagen`) · Statistik & Konformität (`statistik`) · Betonkennwerte (`beton`) · Stahl, Holz, Mauerwerk (`baustoffe`) · Beispiele (`beispiele`) · Rechner (`rechner`) · Grenzen & Ausblick (`grenzen`).

Komponente `src/modules/EcKennwerte.tsx`; Inhalt `content/eckennwerte/EcKennwerte.json`.

## Rechenkerne und Testabdeckung

| Kern | Tests (Zahl der Prüfungen) | Referenzwerte |
|---|---|---|
| `src/calc/ecKennwerte.ts` | `tests/ecKennwerte.test.ts` (45) | C30/37: f_cm = 38, f_ctm = 2,90, E_cm = 33 000, f_cd = 17,0, f_ctd = 1,133; B500B f_yd = 434,8; S355 355/322,7/352,8; GL24h NKL 1 mittel 14,77; KS 12/NM IIa f_d = 3,40; Prüfserie n = 6: X_k = 32,90, X_d = 18,64 N/mm² |

`tests/ecKennwerte.test.ts` rechnet alle sechs Beispiele von Hand nach, prüft die k_n-Tabelle gegen 1,64·√(1 + 1/n), die Gleichheit mit den zentralen Konstanten (`CONCRETE`, `BETONSTAHL`, `EC3_NA_DE`, `KMOD`, `FK_TAFEL_NA`) und die Quizfragen 4–6. Eigene Nachrechnung für dieses Paket (Python): alle sechs Beispiele und das Vorhaltemaß 8 N/mm² ↔ σ = 4,86 N/mm² stimmen.

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| EK-1 | Betonpraxis: Konformität Herstellungsbeginn „f_ci,3 ≥ f_ck + 4“ → „f_cm,3 ≥ f_ck + 4 und f_ci ≥ f_ck − 4“ | erledigt (behoben) (#316) | `ec-kennwerte-2026-11-02.md`, Abschn. 3 |
| EK-2 | `EC2_BETON_NA` mit eigenen Literalen α_cc/γ_c → zentrale Konstanten | erledigt (behoben) (#316) | `ec-kennwerte-2026-11-02.md` |
| EK-3 | Konformitätskontrolle: σ_min = 3,0 als Literal → `SIGMA_MIN_KONFORMITAET` | erledigt (behoben) (#316) | `ec-kennwerte-2026-11-02.md` |
| EK-4 | γ-Werte der außergewöhnlichen Situation fehlten zentral → ergänzt | erledigt (behoben) (#316) | `ec-kennwerte-2026-11-02.md` |
| EK-5 | `historisch`: γ = 1,0/1,5 als Literale, f_k Mauerwerk nach EN-Formel (K = 0,55) statt NA-Tafeln | offen (notiert, betrifft `historisch`) | `ec-kennwerte-2026-11-02.md` |
| EK-6 bis EK-8 | Statistik X_d ohne α_cc/k_mod (gekennzeichnet), γ_G/γ_Q lokal in holzbau.ts, Sicherheitskonzept nur ständige γ | bewusst belassen | `ec-kennwerte-2026-11-02.md` |
| Prüfung | Modul ist neu; eine unabhängige Modulprüfung (Tranche) gibt es noch nicht, nur die Selbstprüfung im PR und dieses Paket | offen | `ec-kennwerte-2026-11-02.md` |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Kennungen nach dem Prüfbogen Normtext (Stand 28.10.2026) bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens.

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| EK-N1 | DIN EN 1993-1-1/NA | Gelten γ_M0, γ_M1, γ_M2 unverändert in der außergewöhnlichen Situation? | wie ständig, vorläufig |
| EK-N2 | DIN EN 1995-1-1/NA:2013-08, NDP zu 2.4.1(1)P | γ_M = 1,0 außergewöhnlich: Ausgabe und Wortlaut | `GAMMA_M_HOLZ_AUSSERGEWOEHNLICH` in `src/calc/holzbau.ts` |
| EK-N3 | DIN EN 1996-1-1/NA, Tab. NA.1 | γ_M = 1,3 außergewöhnlich und ζ = 1,0 bei kurzzeitiger Beanspruchung | `GAMMA_M_MW_AUSSERGEWOEHNLICH`, `ZETA_MW_KURZ` in `src/calc/mauerwerk.ts` |
| EK-N4 | DIN EN 1992-1-1/NA, NDP zu 3.1.6(2)P | α_ct = 0,85 | `EC2_BETON_NA` in `src/calc/betonkennwerte.ts` |
| EK-N5 | DIN EN 1990, Anhang D, Tab. D1 | Zeile „V_X bekannt“ (2,31 … 1,64) | `KN_TAB_BEKANNT` (entspricht 1,64·√(1 + 1/n), im Test belegt) |
| EK-N6 | EN 1992-1-1:2023, Gl. (5.3)/(5.4); Entwurf DIN EN 1992-1-1/NA1:2025-08 | η_cc und k_tc der 2. Generation | Reiter Grenzen & Ausblick (nur Text) |
| EK-N7 | DIN EN 1990-1 (2. Generation) | Ausgabedatum der deutschen Fassung | Reiter Grenzen & Ausblick (nur Text) |

## Quizfragen

7 Fragen, davon 7 nicht freigegeben: `qt_eckennwerte_1`, `qt_eckennwerte_2`, `qt_eckennwerte_3`, `qt_eckennwerte_4`, `qt_eckennwerte_5`, `qt_eckennwerte_6`, `qt_eckennwerte_7`.
 Alle sieben Fragen sind neu (#316); die Fragen 4–6 rechnet `tests/ecKennwerte.test.ts` nach.

## Quellen

DIN EN 1990 Anhang D, DIN EN 1992-1-1 Tab. 3.1 mit NA, DIN EN 1993-1-1/NA, DIN EN 1995-1-1 mit NA, DIN EN 1996-1-1/NA, DIN EN 206 (8.2.1.3), DIN 488-1; fib Model Code 2010; bauforumstahl Arbeitshilfe 2.1; KS-Themenheft „Bemessung nach Eurocode 6“ (10/2012). Liste je Wert in `docs/pruefung/ec-kennwerte-2026-11-02.md`, Abschnitt 5; die Normpunkte EK-N1 bis EK-N7 sind dort Abschnitt 6 (Nummerierung in diesem Paket).

## Prüfschritte für die Freigabe (ca. 15 min)

1. Beispiel C30/37: f_cm = f_ck + 8 = 38, f_ctm = 0,30·30^(2/3) = 2,90, E_cm = 22 000·(38/10)^0,3 = 32 837 → 33 000, f_cd = 0,85·30/1,5 = 17,0, f_ctd = 0,85·2,0/1,5 = 1,13 N/mm².
2. Beispiel S355 (t ≤ 40 mm): f_y/γ_M0 = 355, f_y/γ_M1 = 322,7, 0,9·f_u/γ_M2 = 0,9·490/1,25 = 352,8 N/mm².
3. Beispiel GL24h: f_m,d = k_mod·f_m,k/γ_M = 0,8·24/1,3 = 14,77 (NKL 1, mittel); NKL 3: 0,65·24/1,3 = 12,0; ständig 0,6·24/1,3 = 11,08 N/mm².
4. Beispiel Mauerwerk KS 12/NM IIa: f_k = 6,0 (Tafelwert NA) → f_d = 0,85·6,0/1,5 = 3,40 N/mm²; außergewöhnlich mit γ_M = 1,3 (EK-N3).
5. Prüfserie n = 6 (V_x unbekannt): m = 37,93, s = 2,31, k_6 = 2,18 → X_k = 32,90, X_d = 0,85·32,90/1,5 = 18,64 N/mm².
6. Konformität stetige Herstellung (Quizfrage 6): f_cm ≥ f_ck + 1,48·max(σ; 3) = 30 + 1,48·3 = 34,44 > 34,2 → nicht erfüllt.
7. Tabelle der γ-Werte (Reiter Teilsicherheitskonzept) in der außergewöhnlichen Situation mit dem NA abgleichen: γ_C = 1,3, γ_S = 1,0, γ_M Holz 1,0, γ_M Mauerwerk 1,3, Stahl wie ständig (EK-N1 bis EK-N3).

## Empfehlung

**freigabereif nach Klärung von EK-N1 bis EK-N4.** Alle Kennwerte kommen aus den zentralen Konstanten, die in den Tranchen 1, 4, 5 und 10 geprüft sind; die sechs Beispiele sind im Test und für dieses Paket nachgerechnet. Eine Modulprüfung durch eine zweite Person gibt es noch nicht – die Prüfschritte oben ersetzen sie im Umfang einer Stichprobe. Blockierend sind die vier NA-Punkte EK-N1 bis EK-N4 (γ-Werte außergewöhnlich, α_ct). EK-N5 ist über die Formel 1,64·√(1 + 1/n) belegt, EK-N6/EK-N7 sind Ausblicktext. Alle sieben Quizfragen sind noch nicht freigegeben.

Nach der Regel der Freigabe vom 02.11.2026 (gekennzeichnete Normtextpunkte gelten als erledigt) wäre das Modul freigabereif; weil eine Modulprüfung durch eine zweite Person fehlt, sind die Prüfschritte oben die Stichprobe dafür.
