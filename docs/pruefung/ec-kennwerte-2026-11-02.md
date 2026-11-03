# Kennwerte und Bemessungswerte nach Eurocode – Bestandsaufnahme und neues Modul (02.11.2026)

Auftrag vom 02.11.2026: prüfen, ob die Bemessung nach Eurocode und die baustoffrelevanten Kennwerte samt Statistik
ausführlich erläutert sind; bei Bedarf neues Modul mit Beispielen und Erklärungen. Branch `modul/ec-bemessungswerte-11-02`.

## 1. Ergebnis in Kürze

- Die Begriffe sind in der Anwendung **verstreut** vorhanden (rund 50 Module nennen f_ck, rund 20 γ_M), aber **kein Modul**
  erklärt den Zusammenhang „Kennwert → charakteristischer Wert → Bemessungswert“ baustoffübergreifend. Das Modul
  Eurocode-Sicherheitskonzept behandelt ausführlich die Einwirkungsseite (Gl. 6.10 mit Rechner), die Widerstandsseite nur als
  Schema mit einer Tabelle der ständigen γ-Werte. Nicht erklärt waren insbesondere: warum f_cm = f_ck + 8 N/mm² gilt,
  Mittelwert gegenüber charakteristischem Wert, γ-Werte der außergewöhnlichen Situation, Lognormalverteilung, k_n bei
  bekanntem V_x, η_cc/k_tc der 2. Generation.
- **Neues Modul** `ec_kennwerte` „Kennwerte und Bemessungswerte nach Eurocode“ (Gruppe Grundlagen, neben dem
  Sicherheitskonzept), 7 Reiter, Rechenkern `src/calc/ecKennwerte.ts` nur aus zentralen Konstanten, 7 Quizfragen
  (verified:false), Querverweise aus 8 Fachmodulen.
- **4 Widersprüche/Doppelungen behoben**, 4 weitere notiert (Abschnitt 3).

## 2. Matrix der Bestandsaufnahme (vor der Änderung)

Tiefe: W = nur Wert, F = Formel, H = Herleitung mit Beispiel/Rechner. Konsistenz: ✓ = gleiche Werte/Formelzeichen, NA DE.

| Begriff | wo erklärt (Modul/Reiter) | Tiefe | Konsistenz |
|---|---|---|---|
| f_ck | Betonkennwerte (Tabelle, Rechner), Festbeton-Statistik (5-%-Quantil), Sicherheitskonzept (R_k), Stahlbetonbemessung, Festbeton | H | ✓ (zentral CONCRETE) |
| f_cm | Betonkennwerte (f_cm = f_ck + 8, f_cm(t)), Festbeton-Statistik, Kriechen/Schwinden | F | ✓; Begründung der 8 N/mm² fehlte |
| f_ctm | Betonkennwerte (Formel Tab. 3.1), Hydratation-Rissberechnung, Stahlbeton (Mindestbewehrung) | F | ✓ (fctmVonFck) |
| f_ctk;0,05 | Betonkennwerte (Tabelle), Verankerungslänge (f_ctd), Materialkennwerte | W | ✓ |
| E_cm | Betonkennwerte (Formel, α_E), E-Modul (Verbundschranken), Formänderungen | H | ✓ |
| f_cd = α_cc·f_ck/γ_C | Betonkennwerte (Spalte), Festbeton-Statistik, Stahlbetonbemessung, Beispielrechnungen, Quiz | F | ✓ (fcdBeton, Entscheidung 27.10.) |
| α_cc (0,85 NA / 1,0 EN) | Betonkennwerte, Festbeton-Statistik (Eingabe), Sicherheitskonzept | F | ✓; Literale in `EC2_BETON_NA` (behoben) |
| f_yk / f_yd | Stahlbetonbemessung, Biegebemessung, Querkraft, Stütze, Verankerung | F | ✓ (BETONSTAHL) |
| γ_C / γ_S | Sicherheitskonzept (Tabelle, nur ständig), Statistik (GAMMA_M), Kerne | W | ✓; γ_S außergewöhnlich nicht zentral (behoben) |
| γ_M0 / γ_M1 / γ_M2 | Stahlbau EC3 (Rechner), Stahl, Sicherheitskonzept (nur γ_M0) | F | ✓ (EC3_NA_DE) |
| Teilsicherheitskonzept | Sicherheitskonzept (Einwirkung H, Widerstand Schema) | H/F | ✓ |
| charakteristischer Wert = 5-%-Quantil | Statistik (k_n, Rechner), Festbeton-Statistik (Verteilung), Holzbau | H | ✓ (KN_TAB Tab. D1) |
| Bemessungswert X_d | Statistik (X_k/γ_M vereinfacht), Holz, Mauerwerk, Stahlbau | F | vereinfacht in Statistik (ohne α_cc/k_mod, gekennzeichnet) |
| Mittelwert vs. charakteristisch | – (nur implizit, E_cm vs. f_ck) | – | Lücke |
| Streuung / Variationskoeffizient | Statistik (Kennzahl), Historische Materialkennwerte (f_k aus V) | F | ✓ |
| Konformität DIN EN 206 | Qualitätssicherung → Konformitätskontrolle (Rechner), Festbeton-Statistik, Festbeton, Betonpraxis, Praxiswissen | H | Betonpraxis: f_ci,3 statt f_cm (behoben); σ_min-Literal (behoben) |
| f_ck,is (DIN EN 13791) | Historische Materialkennwerte, Betonpraxis (Bohrkerne) | H | paralleler Auftrag (Worktree wt-hist), hier nur verlinkt |
| Holz f_m,k / k_mod / γ_M | Holz, Holzbau – Bemessung (Rechner), Holzwerkstoffe, Bauprodukte Holz | H | ✓ (KMOD, GAMMA_M_HOLZ) |
| Mauerwerk f_k / f_d | Mauerwerk (Tafeln NA, EN-Formel, f_d = ζ·f_k/γ_M) | H | ✓; Historische Materialkennwerte nutzt EN-Formel mit K = 0,55 (notiert) |
| Stahl f_y / f_u | Stahl, Stahlbau EC3, Mechanische Kenngrößen | F | ✓ (BAUSTAHL_EC3) |
| γ-Werte außergewöhnlich | nur Kerne (GAMMA_C.aussergewoehnlich, DBV γ_c = 1,35 Bestand) | W | Lücke für Holz/Mauerwerk/Stahl |
| 2. Generation EC | Normenausblick (Ausgaben, Einführung), Betonkennwerte (Ausblick-Reiter) | W | η_cc/k_tc nirgends erklärt |

Grundlage: Volltextsuche über `content/` und `src/modules/` (Begriffe als TeX- und Klartextmuster), Lesen der Rechenkerne
`src/data/kennwerte.ts`, `src/data/normParams.ts`, `src/calc/{betonkennwerte,festbetonStatistik,statistik,holzbau,stahlbau,mauerwerk,sicherheitskonzept}.ts`,
`src/modules/{Sicherheitskonzept,Konformitaetskontrolle,Statistik}.tsx`. Suche nach abweichenden γ-/α_cc-Werten
(z. B. γ_M0 ≠ 1,0, γ_C ∉ {1,5; 1,3; 1,35}, α_cc ≠ 0,85): keine Abweichung außer absichtlichen Fehlerbeispielen
(KI-Modul „Fehler erkennen“: γ_c = 1,35/γ_s = 1,10 als zu findender Fehler) und dem Vergleichswert α_cc = 1,0.

## 3. Widersprüche und Behebung

| Nr. | Fundstelle | Befund | Behebung |
|---|---|---|---|
| EK-1 | `content/betonpraxis/Betonpraxis.json` (fCi3F) | Konformität Herstellungsbeginn als „f_ci,3 ≥ f_ck + 4“ – Einzelwert-Formelzeichen für das Mittelwertkriterium | „f_cm,3 ≥ f_ck + 4 N/mm² und jeder Einzelwert f_ci ≥ f_ck − 4 N/mm²“ (DIN EN 206, 8.2.1.3) |
| EK-2 | `src/calc/betonkennwerte.ts` `EC2_BETON_NA` | α_cc = 0,85 und γ_c = 1,5 als eigene Literale neben der zentralen Quelle | auf `ALPHA_CC`, `GAMMA_C.staendig` umgestellt (Werte unverändert, Test) |
| EK-3 | `src/modules/Konformitaetskontrolle.tsx` | Mindeststandardabweichung 3,0 N/mm² als Literal (zweimal) | `SIGMA_MIN_KONFORMITAET` aus `festbetonStatistik.ts` |
| EK-4 | zentrale Konstanten | γ_S außergewöhnlich (1,0), γ_M Holz außergewöhnlich (1,0), γ_M Mauerwerk außergewöhnlich (1,3) fehlten | `GAMMA_S`, `ALPHA_CC_EN_EMPFEHLUNG` (kennwerte.ts), `GAMMA_M_HOLZ_AUSSERGEWOEHNLICH` (holzbau.ts), `GAMMA_M_MW_AUSSERGEWOEHNLICH`, `ZETA_MW_KURZ` (mauerwerk.ts) |
| EK-5 (notiert) | `src/modules/HistorischeMaterialkennwerte.tsx` | γ = 1,0/1,5 als Literale; f_k Mauerwerk mit EN-Formel K = 0,55 statt NA-Tafeln | nicht geändert: Modul wird parallel bearbeitet (Worktree wt-hist); Empfehlung: zentrale Konstanten `EC3_NA_DE.gammaM0`, `GAMMA_C.staendig`, `GAMMA_M_MW` verwenden |
| EK-6 (notiert) | `src/calc/statistik.ts` | X_d = X_k/γ_M ohne α_cc bzw. k_mod (im Modul als „vereinfacht“ gekennzeichnet) | belassen; das neue Modul zeigt den vollständigen Weg (Rechner „Prüfserie“ mit Beiwert) |
| EK-7 (notiert) | `src/calc/holzbau.ts` | γ_G = 1,35/γ_Q = 1,5 lokal (keine zentrale Einwirkungs-Konstante) | belassen, Werte konsistent mit Sicherheitskonzept |
| EK-8 (notiert) | Sicherheitskonzept, Reiter Prinzip | Tabelle nur ständige Widerstandsbeiwerte | Querverweis auf das neue Modul (vollständige Tabelle) |

## 4. Neues Modul `ec_kennwerte`

- Registry `src/registry/modules.ts` (Gruppe Grundlagen, Menügruppe „Grundlagen“ nach `sicherheitskonzept`), Route in
  `src/routing/ModulInhalt.tsx`, englische Bezeichnung, Inhalte `content/eckennwerte/EcKennwerte.json` (MdText),
  Querverweis-Text `content/eckennwerte/Verweis.json` mit Komponente `src/components/ui/EcKennwerteVerweis.tsx`.
- Reiter (7): Teilsicherheitskonzept · Statistik & Konformität · Betonkennwerte (Tab. 3.1 aus `CONCRETE`, alle Klassen mit f_cd) ·
  Stahl, Holz, Mauerwerk (k_mod-Tabelle aus `KMOD`) · Beispiele (C30/37, B500B, S355, GL24h, KS 12/NM IIa, Prüfserie n = 6;
  alle Zahlen aus dem Rechenkern) · Rechner (Baustoff/Klasse/Situation/α_cc/NKL/KLED/ζ; Prüfserie normal/lognormal, V_x bekannt/unbekannt) ·
  Grenzen & Ausblick (2. Generation, η_cc·k_tc).
- Lernziele, Kurzfassung (5 Punkte), 3 Erkundungsaufträge, Rechnergrenzen; Quellen in der Fußzeile über die Normen-Registry
  (neuer Eintrag `DIN_EN_1990`) und Literaturliste. Kein Prüfvermerk gesetzt.
- Rechenkern `src/calc/ecKennwerte.ts`: `ecKennwerte`, `charakteristischAusSerie`, `fraktilfaktorKnBekannt` (`KN_TAB_BEKANNT`),
  `vorhaltemass`, `sigmaAusVorhalt`, `unterschreitung`; ungültige Eingaben über `nurGueltig` → „–“.
- Quiz: `qt_eckennwerte_1` … `_7` (Erinnern, Verstehen, Anwenden ×2, Analysieren, Bewerten, Erinnern), verified:false, Prüflisten neu erzeugt.
- Querverweise (`<EcKennwerteVerweis />`) in Betonkennwerte, Stahlbetonbemessung, Holzbau – Bemessung, Stahlbau EC3, Mauerwerk,
  Statistik, Festbeton-Statistik, Sicherheitskonzept.
- Tests: `tests/ecKennwerte.test.ts` (Beispiele nachgerechnet, ungültige Eingaben, k_n-Tabelle gegen 1,64·√(1 + 1/n),
  Konsistenz mit den zentralen Konstanten, Quizfragen 4–6 nachgerechnet, Querverweise); Grenzfall-Basis
  `tests/fixtures/rechenkerne-basis.json` neu erzeugt.

## 5. Quellen je Wert

| Wert | Quelle |
|---|---|
| f_ck, f_ck,cube, f_cm, f_ctm, f_ctk;0,05/0,95, E_cm, ε_c2, ε_cu2, n | DIN EN 1992-1-1:2011-01, Tab. 3.1 (zentrale Tabelle `CONCRETE`, tests/ec2Spannbeton.test.ts) |
| α_cc = 0,85, α_ct = 0,85, γ_C = 1,5/1,3, γ_S = 1,15/1,0 | DIN EN 1992-1-1/NA, 3.1.6 und Tab. 2.1DE (zentrale Konstanten, vorhandene Belege) |
| α_cc = 1,0 (EN-Empfehlung) | EN 1992-1-1:2004, 3.1.6(1)P |
| Δf = 8 MPa | DIN EN 1992-1-1 Tab. 3.1; fib Model Code 2010, 5.1.4 |
| γ_M0 = 1,0, γ_M1 = 1,1, γ_M2 = 1,25 | DIN EN 1993-1-1/NA (zentral `EC3_NA_DE`); bauforumstahl, Arbeitshilfe 2.1, Tab. 2 |
| f_y, f_u (t ≤ 40 mm) | DIN EN 1993-1-1, Tab. 3.1 (zentral `BAUSTAHL_EC3`) |
| f_yk = 500, k, ε_uk | DIN 488-1, DIN EN 1992-1-1 Anhang C (zentral `BETONSTAHL`) |
| Holzkennwerte | DIN EN 338:2016-07, DIN EN 14080:2013-09 (zentral) |
| k_mod, γ_M = 1,3 | DIN EN 1995-1-1, Tab. 3.1; NA DE (zentral `KMOD`, `GAMMA_M_HOLZ`) |
| γ_M Holz außergewöhnlich = 1,0 | DIN EN 1995-1-1/NA, NDP zu 2.4.1(1)P (3), öffentliche Wiedergabe Fraunhofer IRB, rswb 06059000878 |
| γ_M Mauerwerk 1,5/1,3, ζ = 0,85/1,0 | DIN EN 1996-1-1/NA, Tab. NA.1; mb AEC Software, mb-news 05/2013, Tab. 1 |
| f_k KS 12/NM IIa = 6,0 N/mm² | KS-Themenheft „Bemessung nach Eurocode 6“ (10/2012), Tafel 15 (zentral `FK_TAFEL_NA`) |
| k_n (V_x unbekannt/bekannt) | DIN EN 1990, Anhang D, Tab. D1 (`KN_TAB`, `KN_TAB_BEKANNT`) |
| Konformitätskriterien f_ck + 4, f_ck + 1,48·σ, σ ≥ 3, f_ci ≥ f_ck − 4 | DIN EN 206, 8.2.1.3 mit DIN 1045-2 (zentral `festbetonStatistik.ts`) |
| η_cc, k_tc, f_ck,ref = 40 | EN 1992-1-1:2023, Gl. (5.3), (5.4); fib structuralcodes, Dokumentation „Material properties for concrete“ |
| Variationskoeffizienten je Baustoff | Lehrwerte (Größenordnungen), im Text so gekennzeichnet |

## 6. Offene Normpunkte (für den Prüfbogen Normtext)

- [ ] DIN EN 1993-1-1/NA: Gelten γ_M0, γ_M1, γ_M2 unverändert in der außergewöhnlichen Bemessungssituation? (Modul: wie ständig, vorläufig)
- [ ] DIN EN 1995-1-1/NA:2013-08, NDP zu 2.4.1(1)P: γ_M = 1,0 für außergewöhnliche Situationen – Ausgabe und Wortlaut bestätigen.
- [ ] DIN EN 1996-1-1/NA, Tab. NA.1: γ_M = 1,3 außergewöhnlich (Kategorie I, Mörtel nach Eignungsprüfung bzw. Rezeptmörtel) und ζ = 1,0 bei kurzzeitiger Beanspruchung (Fundstelle im NA).
- [ ] DIN EN 1992-1-1/NA, NDP zu 3.1.6(2)P: α_ct = 0,85 (zentral bisher ohne eigenen Beleg in `EC2_BETON_NA`).
- [ ] DIN EN 1990, Tab. D1: Werte der Zeile „V_X bekannt“ (2,31 … 1,64) am Normtext bestätigen.
- [ ] EN 1992-1-1:2023, Gl. (5.3)/(5.4): Formel für η_cc und Werte k_tc; Nationaler Anhang zur 2. Generation (Entwurf DIN EN 1992-1-1/NA1:2025-08).
- [ ] DIN EN 1990-1 (2. Generation): Ausgabedatum der deutschen Fassung.

## 7. QA

Siehe PR-Beschreibung (tsc, npm test, check:formeln, check:zahlen, check-design, check-verwaist --strict, check-any, Build mit
BB_STATISCH=1, check-bundle, a11y-reiter desk/mob/desk-dunkel auf `ec_kennwerte` und den geänderten Routen, Sichtprüfung hell/dunkel).
