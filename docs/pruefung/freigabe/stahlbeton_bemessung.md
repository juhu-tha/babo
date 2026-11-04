# Freigabepaket: Stahlbetonbemessung (EC 2) (`stahlbeton_bemessung`)

Stand 04.11.2026 · Gruppe „Massivbau“ · Typ `calculator` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif nach Klärung von #242-1 bis #242-4** – Alle Rechenkerne sind unabhängig nachgerechnet und ohne offenen Rechenfehler; offen sind nur vier Normtextpunkte des NA (DE) in den Reitern Verankerung und Querkraft.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Integrierte Stahlbetonbemessung nach DIN EN 1992-1-1 mit NA (DE) für die Grundvorlesung Massivbau: Biegung mit und ohne Druckbewehrung, Querkraft, Stützen (Interaktionsdiagramm, Theorie II. Ordnung über Mindestausmitte), Durchstanzen, Verankerung und Übergreifung, Rissbreite sowie σ-ε-Linien von Beton und Betonstahl.

Bedeutung für die Lehre: Pflichtlehre / zentrales Lehrmodul; in keinem Lernpfad zugeordnet.

## Reiter und Bereiche

Sieben Reiter, je mit eigener Direktadresse: Biegung (`biegebemessung`), Querkraft (`querkraftbemessung`), Stütze (`stuetzenbemessung`), Durchstanzen (`durchstanzen`), Verankerung (`verankerungslaenge`), Rissbreite (`rissbreite`), σ-ε-Linien (`spannung`); dazu der Lernpfad „Stahlbeton von 0 bis 100“.

Komponente `src/modules/Stahlbetonbemessung.tsx`; Inhalt `content/biegebemessung/Biegebemessung.json`, `content/durchstanzen/Durchstanzen.json`, `content/querkraftbemessung/Querkraftbemessung.json`, `content/rissbreite/Rissbreite.json`, `content/spannungdehnung/SpannungDehnung.json`, `content/stahlbeton/StahlbetonNullBisHundert.json`, `content/stahlbetonbemessung/Stahlbetonbemessung.json`, `content/stuetzenbemessung/Stuetzenbemessung.json`, `content/verankerungslaenge/Verankerungslaenge.json`.

## Rechenkerne und Testabdeckung

| Kern | Tests (Zahl der Prüfungen) | Referenzwerte |
|---|---|---|
| `src/calc/biegung.ts` | `tests/biegung.test.ts` (27), `tests/fcdBeton.test.ts` (18), `tests/keinErgebnisAnzeige.test.ts` (1), `tests/modulpruefungTranche1.test.ts` (46), `tests/modulpruefungTranche15.test.ts` (77), `tests/nachstichprobe4.test.ts` (60) und 1 weitere | 30/50, C30/37, M_Ed = 200 kNm: µ = 0,194, ω = 0,217, A_s1 = 11,47 cm²; µ_lim = 0,296 (ξ_lim = 0,45) |
| `src/calc/querkraft.ts` | `tests/querkraft.test.ts` (29), `tests/fcdBeton.test.ts` (18), `tests/modulpruefungTranche1.test.ts` (46) | 30/45, V_Ed = 250 kN, θ = 40°: z = 38,5 cm, a_sw = 12,53 cm²/m, V_Rd,max = 725,1 kN |
| `src/calc/stuetze.ts` | `tests/stuetze.test.ts` (19), `tests/fcdBeton.test.ts` (18), `tests/modulpruefungTranche1.test.ts` (46) | 40/40/5 cm, l₀ = 4 m, N_Ed = 3 000 kN, M = 0: ω_erf = 0,26 (Parabel-Rechteck) |
| `src/calc/durchstanzen.ts` | `tests/durchstanzen.test.ts` (25), `tests/fcdBeton.test.ts` (18), `tests/modulpruefungTranche1.test.ts` (46) | Innenstütze rund c = 400 mm, d = 200 mm, V_Ed = 500 kN: v_Ed = 0,729 < v_Rd,c = 0,746 N/mm² |
| `src/calc/verankerung.ts` | `tests/verankerung.test.ts` (28), `tests/modulpruefungTranche15.test.ts` (77), `tests/modulpruefungTranche2.test.ts` (58) | C30/37, Ø16, guter Verbund: f_bd = 3,00 N/mm², l_b,rqd = 579,7 mm, l_bd = 483,1 mm (EN-Form) |
| `src/calc/rissbreite.ts` | `tests/rissbreite.test.ts` (12), `tests/modulpruefungTranche2.test.ts` (58) | Platte h = 200 mm, Ø16/20, c = 35 mm, σ_s = 250 N/mm²: s_r,max = 238,6 mm, w_k = 0,216 mm |
| `src/calc/werkstoffmodelle.ts` | `tests/werkstoffmodelle.test.ts` (83), `tests/durchsichtD.test.ts` (38), `tests/fcdBeton.test.ts` (18), `tests/keinErgebnisAnzeige.test.ts` (1), `tests/kennwerte.test.ts` (51), `tests/modulpruefungTranche10.test.ts` (104) und 4 weitere | C30/37: f_cd = 17,0, ε_c2 = 2,0 ‰, ε_cu2 = 3,5 ‰; B500B: σ_d = 434,8 N/mm² ab ε_yd |

Unabhängige Nachrechnungen mit eigenem Skript: Tranche 1 (159 Vergleiche, Biegung, Querkraft, Stütze, Durchstanzen) und Tranche 2 (Verankerung, Rissbreite, σ-ε-Linien); Sollwerte in `tests/modulpruefungTranche1.test.ts` und `tests/modulpruefungTranche2.test.ts`.

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| S-1 | Suche nach ω_erf akzeptierte µ_Ed ≤ µ_Rd + 0,002 (unsichere Seite) | erledigt (behoben) | T1 (`module-tranche-1.md`) |
| S-3 | Formel M_Ed,1 im Formelteil widersprach Kern und EC 2 6.1(4) | erledigt (behoben) | T1 (`module-tranche-1.md`) |
| S-2 | Interaktionskurven mit Spannungsblock bei hoher Druckausnutzung bis 9 % unsicher → auf Parabel-Rechteck umgestellt | erledigt (umgesetzt), 28.10. | T1 (`module-tranche-1.md`), Nachtrag 28.10. |
| P-1 | Geltungsbereich Durchstanzen: nur Flachdecken, nicht Fundamente | erledigt (behoben) | T1 (`module-tranche-1.md`) |
| P-2 | Rand-/Eckstützen mit vollem u₁ → Stützenlage und Randabstand als Eingabe, u₁ nach Bild 6.15 | erledigt (umgesetzt), 28.10. | T1 (`module-tranche-1.md`), Nachtrag 28.10. |
| Q-1 | Gleichungsnummer ρ_w,min (9.5N) → (9.5aDE) | erledigt (umgesetzt, als vorläufig gekennzeichnet) | T1 (`module-tranche-1.md`), Nachtrag 28.10.; Normtext #242-4 |
| F-1 | Hochfester Beton ab C55/67 (f_cd-Abminderung, ξ_lim = 0,35, C100/115) | erledigt (entschieden 29.10.: Kennzeichnung „vorläufig“, Schalter `FCD_HOCHFEST_AKTIV` aus) | T1 (`module-tranche-1.md`), Umsetzung 29.10. |
| T2-S-3 | Rechenbeispiel Verankerung mit f_ctk;0,05 = 2,03 statt Tabellenwert 2,0 | erledigt (behoben) | T2 (`module-tranche-2.md`) |
| T2-S-1 | α₆ nach EC2-Empfehlung statt NA Tab. 8.3DE → auf Tab. 8.3DE umgestellt | erledigt (umgesetzt, als vorläufig gekennzeichnet) | T2 (`module-tranche-2.md`); Normtext #242-1 |
| T2-S-2 | Vereinfachte NA-Form l_bd mit α₅ = 2/3 und Mindestwerte (8.6)/(8.7) nach NA ergänzt | erledigt (umgesetzt, als vorläufig gekennzeichnet) | T2 (`module-tranche-2.md`); Normtext #242-2, #242-3 |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Kennungen nach dem Prüfbogen Normtext (Stand 28.10.2026) bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens.

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| #242-1 | DIN EN 1992-1-1/NA:2013-04 + NA/A1:2015-12, Tab. 8.3DE mit Fußnoten | α₆ je Stoßanteil und Durchmesser, Fußnote Abstände ≥ 8Ø / ≥ 4Ø | Zug ≤ 33 %: 1,2 (Ø < 16) / 1,4 (Ø ≥ 16); > 33 %: 1,4 / 2,0; mit großem Abstand 1,0 (≤ 33 %) bzw. 1,0 / 1,4 (> 33 %); Druck 1,0 – `src/calc/verankerung.ts:46–49`; Text `content/verankerungslaenge/Verankerungslaenge.json:24` |
| #242-2 | DIN EN 1992-1-1/NA:2013-04 + NA/A1:2015-12, 8.4.4 (NCI, vereinfachte Form) | l_bd = α₁·α₄·α₅·l_b,rqd·A_s,erf/A_s,vorh mit α₅ = 2/3 bei direkter Lagerung | `a5 = zug && direkt ? 2 / 3 : 1.0`, α₂ = α₃ = 1 – `src/calc/verankerung.ts:104` |
| #242-3 | DIN EN 1992-1-1/NA:2013-04 + NA/A1:2015-12, Gl. (8.6)/(8.7) nach NA | Mindestverankerungslänge l_b,min (ohne 100 mm) | NA-Form: Zug max(0,3·α₁·α₄·l_b,rqd; 10Ø bzw. 6,7Ø bei direkter Lagerung), Druck max(0,6·l_b,rqd; 10Ø) – `src/calc/verankerung.ts:120`; EN-Form mit 100 mm – `:122` |
| #242-4 | DIN EN 1992-1-1/NA:2013-04 + NA/A1:2015-12, Gl. (9.5aDE) | Gleichungsnummer für ρ_w,min = 0,16·f_ctm/f_yk | Quelle „DIN EN 1992-1-1/NA Gl. (9.5aDE)“ – `content/stahlbetonbemessung/Stahlbetonbemessung.json:100` (Formel `:98`) |

## Quizfragen

11 Fragen, davon 2 nicht freigegeben: `qlz_stahlbeton_1`, `qlz_stahlbeton_2`. Zuordnung über die Modul-ID `stahlbeton`.

## Quellen

DIN EN 1992-1-1:2011-01 mit NA (DE):2013-04 und NA/A1:2015-12 (Normtext für #242-1 bis -4 nicht öffentlich; im Prüfbogen Nr. 32). Lehrbuchwerte α_R = 0,810 / k_a = 0,416 für das Parabel-Rechteck-Diagramm. Prüfamt-Tipp 15/04 (LBV Brandenburg) zum Hebelarm z nach NCI zu 6.2.3(1). Befundlisten Tranche 1, Nr. 1–4, und Tranche 2, Nr. 1–3.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Biegung, Standardbeispiel 30/50 cm, C30/37, B500, M_Ed = 200 kNm: µ = 0,194, ω = 0,217, A_s1 ≈ 11,5 cm² (`content/biegebemessung/Biegebemessung.json:63`). Kern: ω = 1 − √(1 − 2µ), ξ_lim = 0,45 (`src/calc/biegung.ts:44`).
2. Querkraft, 30/45 cm, V_Ed = 250 kN, θ = 40°, c_v,l = 3,5 cm: z = min(0,9·d; max(d − c_v,l − 3 cm; d − 2·c_v,l)) = 38,5 cm, a_sw = 12,53 cm²/m, V_Rd,max = 725,1 kN (`tests/querkraft.test.ts`). Gleichungsnummer ρ_w,min = 0,16·f_ctm/f_yk als „(9.5aDE)“ bestätigen (`content/stahlbetonbemessung/Stahlbetonbemessung.json:100`, #242-4).
3. Verankerung, C30/37, Ø16, guter Verbund, A_s,erf/A_s,vorh = 10/12: f_bd = 2,25·2,0/1,5 = 3,00 N/mm², l_b,rqd = 16/4·434,8/3,00 = 579,7 mm. Vereinfachte NA-Form mit α₅ = 2/3 bei direkter Lagerung: l_bd = 322,1 mm (`src/calc/verankerung.ts:104`, #242-2); l_b,min = max(0,3·579,7; 6,7·16) = 173,9 mm (`src/calc/verankerung.ts:120`, #242-3).
4. Übergreifung α₆ nach Tab. 8.3DE: Ø16, Stoßanteil > 33 % → α₆ = 2,0, l₀ = 966,2 mm; mit lichtem Abstand ≥ 8Ø und Randabstand ≥ 4Ø → 1,4, l₀ = 676,3 mm (`src/calc/verankerung.ts:45`, #242-1).
5. Stütze, 40/40/5 cm, l₀ = 4 m, N_Ed = 3 000 kN, M_Ed = 0 (nur e₀ = 20 mm): ν = −1,103, µ = 0,055 → ω_erf = 0,26 mit Parabel-Rechteck (Spannungsblock nur Vergleich: 0,24) (`content/stuetzenbemessung/Stuetzenbemessung.json:39`).
6. Durchstanzen, Innenstütze rund c = 400 mm, d = 200 mm, ρ_l = 1 %, C30/37, V_Ed = 500 kN, β = 1,10: u₁ = 3 769,9 mm, v_Ed = 0,729 < v_Rd,c = 0,746 N/mm² → ohne Durchstanzbewehrung. Randstütze 400/400 bündig, V_Ed = 300 kN: u₁ = 2 456,6 mm, A_sw = 242 mm² (`tests/durchstanzen.test.ts`).
7. Rissbreite, Platte h = 200 mm, Ø16/20, c_nom = 35 mm, σ_s = 250 N/mm², k_t = 0,4: s_r,max = 238,6 mm, w_k = 0,216 mm ≤ 0,3 mm; A_s,min = 371 mm²/m (`tests/rissbreite.test.ts`).
8. Hochfester Beton: C70/85 im Reiter Biegung mit ξ_lim = 0,35 und Hinweis „vorläufig“; f_cd ohne Zusatzabminderung, solange `FCD_HOCHFEST_AKTIV = false` (`src/data/kennwerte.ts:109`).

## Empfehlung

**freigabereif nach Klärung von #242-1 bis #242-4.** Alle sieben Reiter sind in Tranche 1 und 2 unabhängig nachgerechnet; alle Fragen (S-2, P-2, Q-1, F-1, T2-S-1/-2) sind entschieden und umgesetzt. Offen sind vier Punkte am Normtext DIN EN 1992-1-1/NA (Tab. 8.3DE, NCI zu 8.4.4, Gl. (8.6)/(8.7) nach NA, Gl. (9.5aDE)). Sie sind im Modul als vorläufig gekennzeichnet. Biegung, Stütze, Durchstanzen, Rissbreite und σ-ε-Linien hängen nicht davon ab. Bestätigt der Normtext die vier Werte, ist das Modul ohne Änderung freigabereif; sonst sind nur `src/calc/verankerung.ts` und eine Quellenangabe anzupassen.

Nach der Regel der Freigabe vom 02.11.2026 (Tranche 16: im Modul gekennzeichnete Normtextpunkte gelten als erledigt) wäre das Modul schon jetzt freigabereif; nach der Regel vom 28.10.2026 (Normtextpunkte blockieren) erst nach dem Normtextabgleich. Siehe `README.md`, Abschnitt „Zu entscheiden“.
