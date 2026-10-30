# Quiz-Abgleich mit den Kennwerten nach der Durchsicht (30.10.2026)

**Stand:** 30.10.2026 (Branch `quiz/kennwertabgleich-10-30`, Basis `origin/main` mit #276–#282)
**Auftrag:** Alle Quizfragen (`src/data/quiz.json`) gegen die zentralen Kennwerte und die Modultexte nach den Korrekturen bis #282 abgleichen; zusätzlich prüfen, welche Fragen erst durch die Entscheidungen vom 30.10.2026 zur gezielten Durchsicht (`docs/pruefung/durchsicht-{A,B,C,D}-2026-10-29.md`, Umsetzung noch offen) falsch würden.

## Vorgehen

1. **Maschineller Abgleich** (Sitzungsablage, nicht im Repository: `scratchpad/quizabgleich/abgleich.mjs`). Das Skript nutzt die Erkennung und die 164 zentralen Referenzwerte des Prüfskripts `scripts/qa/kennwert-abgleich.mjs` (`ZEMENT_GWP_KG`, `GWP_LEHRWERTE`, `PK_NETTO_SENKE_KG`, `A4_FAKTOR_EINZEL`, `QNG_WG`, `FAKTOREN`, `SCHWINDBEIWERTE`, `CONCRETE`, `BAUSTAHL_EC3`, `BETONSTAHL`, `E_BETONSTAHL`, `HOLZ_EN338`, `BSH_EN14080`) und wendet sie getrennt auf Frage, richtige Antwort, Distraktoren, Erklärung, Lernhilfe (`gapAnalysis`), Rückmeldungen und Normangabe jeder Frage an. Dazu kommen 80 gezielte Suchmuster für alle Werte und Aussagen, die #276–#282 geändert haben (Gruppe A), und für alle Werte der Entscheidungen vom 30.10.2026 (Gruppe B), z. B. λ Aluminium, LP-Festigkeitsverlust, EPS-/Mineralwolle-GWP, BSH biogen, Lehrbeton 243/245/158, k_s, Buche-Schwindmaß, 1800 m³ Holz, 45 kg CO₂/t, Konsistenzklassen F4–F6, Silikastaub-Anrechnung, c_min,dur, Rili-SIB, DIN EN 1766, DIN 52617, Gebäudetyp E, EN 1990-1/-2, Torstahl, σ_zul, Calciumsilikat.
2. **Manuelle Prüfung** aller Treffer sowie aller Fragen der Module mit Befunden aus #276–#282 (insgesamt 371 Fragen): Antwort, Erklärung und Rückmeldungen gegen den zentralen Wert bzw. den Modultext; Rechenfragen nachgerechnet (u. a. Wandkonfigurator über `src/modules/nachhaltigkeit/daten.ts`, Lehrbeton über `lehrbetonGwp`, `ZEMENT_GWP` in `src/calc/materialoptimierung.ts`, LP über `LP_FESTIGKEITSVERLUST_JE_PROZENT`).

## Ergebnis

| | Anzahl |
|---|---|
| Fragen gesamt | 1304 |
| davon mit Zahl oder Normverweis (maschinell geprüft) | 1239 |
| Zuordnungen zu zentralen Konstanten | 46, davon 30 übereinstimmend; 16 abweichend, alle erklärt (s. u.) |
| manuell geprüft | 371 |
| durch #276–#282 falsch geworden und **korrigiert** | 2 (`q_lca_1`, `qn_frischbeton_4`) |
| würden erst durch die Entscheidungen vom 30.10. falsch bzw. abweichend | 4 sicher bzw. bedingt, dazu 3 Angleichungen (Liste unten) |

### Abweichungen des maschinellen Abgleichs (alle geprüft, kein weiterer Fehler)

| Frage | Fundstelle | Bewertung |
|---|---|---|
| `q_oe_1` | Distraktoren 16/26 kg CO₂-Äq./(m²·a) | absichtlich falsche Optionen; Rückmeldung nennt PREMIUM ≤ 20 wie `QNG_WG.premium` |
| `qn_lca_rechner_1` | Lkw 0,15, Bahn 0,03 kg CO₂/(t·km) | Werte stehen in der Aufgabe, in sich richtig (Hinweis DSB-LC-11); Angleichung s. Liste |
| `qn_lca_rechner_x_1` | Lkw 0,068 kg CO₂-Äq./(t·km) | Übungsfaktor `LKW_FAKTOR_UEBUNG`, Entscheidung NP2-LC-2 „belassen“ |
| `qn_materialoptimierung_3` | Beton 144 kg/m³, Stahl 0,42 kg/kg | 158 · 0,91 (`ABSCHLAG_56D`) = 144; 0,42 = Grünstrom-Elektrostahl des Moduls |
| `qn_emodul_4` | E_cm 39,4 GPa | Gleichung der Tab. 3.1 mit α_E = 1,2 (wie Durchsicht D) |
| `qt_bauwerksdiagnose_2` | f_ck 31 / 26,5 / 22,5 / 36,7 N/mm² | aus Bohrkernwerten abgeleitete Festigkeiten, keine Klassenwerte |

## Korrigiert (durch #276–#282 falsch geworden)

Nach den Quiz-Regeln: `verified: false`, `reviewer`/`reviewedAt` entfernt, `vorpruefung` mit „Abgleich 30.10.: … – korrigiert“; Prüflisten mit `npx tsx scripts/pruefliste.ts` neu erzeugt.

| Frage | vorher | nachher | Grund |
|---|---|---|---|
| `q_lca_1` (freigegeben) | Lernhilfe: „1 m³ Fichtenholz bindet ca. 800–900 kg CO₂-Äquivalente“ | „Nach DIN EN 16449 speichert 1 m³ Nadelholz rund 740 kg (Fichte, 450 kg/m³) bis 820 kg CO₂ (KVH, 500 kg/m³)“ | #280, DSD-HO-2: Steckbrief Holz liest jetzt `GWP_LEHRWERTE.kvh.biogen` (−820 statt „0,9 t“); Fichte 450 kg/m³ ergibt nach DIN EN 16449 737 kg (wie `qn_nawaro_1`) |
| `qn_frischbeton_4` | Erklärung und Rückmeldung: „je Prozent Luft etwa 3–5 N/mm²“ | „etwa 4–5 % (bei C30/37 rund 2 N/mm²)“ | #278 (Luftporen einheitlich rund 5 % je Vol.-%, `LP_FESTIGKEITSVERLUST_JE_PROZENT`) und #282, DSA-BP-1 (5 % · f_cm 38 = 1,9 N/mm²); die Fassung „4–5 %“ entspricht auch der Entscheidung DSC-BZ-2 vom 30.10. |

## Liste für nach der Umsetzung der Entscheidungen vom 30.10.2026 (nicht geändert)

| Frage | Entscheidung | alter Wert | neuer Wert | Vorschlag |
|---|---|---|---|---|
| `q_mo_1` | Lehrbeton-Rest 45 vs. 30 auflösen | Erklärung: CEM I 243 → CEM III/A 158 kg CO₂-Äq./m³ (−35 %), C30/37 mit Rest 30 | bei Rest 45: 258 → 173 (−33 %); bei Rest 30 unverändert | Zahlen der Erklärung aus `lehrbetonGwp(LEHRBETON_C3037, …)` übernehmen |
| `qn_materialoptimierung_3` | Lehrbeton-Rest | Beton 144 kg/m³ (158 · 0,91), Summe ≈ 3845 kg; Rückmeldung „158 kg/m³ (28 d)“ | bei Rest 45: 173 · 0,91 = 157 kg/m³, Summe ≈ 4100 kg | Beton-GWP, Summe und Distraktoren neu rechnen (4100 läge sonst neben dem Distraktor 4120) |
| `qn_oekobilanz_lca_g1` | Lehrbeton-Rest | Aufgabe nennt „pauschal 30 kg“, Minderung 35 % (in sich richtig) | bei Rest 45: 258/173, Minderung 33 % | Pauschalwert der Aufgabe an den zentralen Rest angleichen, Distraktoren (40 %, 47 %, 60 %) nachrechnen |
| `qn_lca_rechner_2` | Lehrbeton-Rest (C25/30), DSB-LC-10 (EPS 3,25) | Wandkonfigurator „Stahlbeton + EPS“ 64,8 kg CO₂-Äq./m², Faktor 1,7 zum Ziegel (112,0) | EPS bleibt 3,25 (kein Einfluss); bei C25/30-Rest 30: Beton 230 statt 245 → 61,8 kg/m², Faktor 1,8 | nach Umsetzung den Wandkonfigurator-Wert ablesen und Frage nachziehen; bei Rest 45 unverändert |
| `qn_lca_rechner_1` | Lehrbeton-Rest (C25/30); Hinweis DSB-LC-11 | A1–A3 = 245, Lkw 0,15, Bahn 0,03 (Distraktor) → 1,18 kg CO₂-Äq./(m²·a) | bei Rest 30: 230; Rechnerfaktoren Lkw 0,118 / Bahn 0,014 | gemeinsam angleichen: mit 245/0,118 ergeben sich 1,15 (ohne A4 1,04, ohne C 1,09, Bahn 1,05) |
| `q_dg_db_1` | DSB-LC-10 Mineralwolle ein Wert | Aufgabe „EPD nennt 1,20 kg CO₂e/kg“ → 5,76 kg/m² (wie Beispiel Materialdatenbanken) | zentraler Mineralwolle-Lehrwert (0,96 oder 1,20, noch offen) | wenn der zentrale Wert von 1,20 abweicht: Aufgabe und Ergebnis angleichen (bei 0,96: 4,61 kg/m²) |
| `q_bzm_3` | DSC-BZ-2 LP 4–5 % je Vol.-% | 4–5 % | 4–5 % | keine Änderung nötig (entspricht der neuen Fassung) |

Ohne betroffene Frage (Volltextsuche und Prüfung der Modulfragen): λ Aluminium 160 W/(mK) (DSC-ME-1; Aluminium-Fragen nennen nur α_T, ρ, f_t, Ψ des Abstandhalters), Dämmdicken Wand/Dach (DSC-DM-2; nur Rechenfragen mit eigenen Angaben), Torstahl (DSC-HP-1; `q_hk_4`, `qn_historische_bauprodukte_1` nennen ihn bereits historisch), σ_zul 120 N/mm² (DSC-HB-1), Calciumsilikat-λ (DSC-BE-1), w/z-Grenze der Web-Übung (DSB-LC-9), Zählweise ⌊T/ND⌋ (DSB-LI-2; `qn_lca_ingenieurbau_2` rechnet bereits so, `qn_lebenszyklus_kosten_2` nutzt den Austauschzyklen-Rechner mit ⌈T/ND⌉ − 1), 1800 m³ Holz / 1500 t (DSB-LR-2), 45 → 6 kg CO₂/t (DSB-NR-2), BSH biogen nach DIN EN 16449 (DSB-RU-1; `q_naw_2` rechnet GL24h 420 kg/m³ selbst nach DIN EN 16449, DPP-Fragen ohne BSH-Wert), Doppelkopie Schadstoffe (DSB-SS-1), k_s = 1,0 (DSA-X-1; `q_exk_4` nennt k = 1,0 für Silikastaub), Profilstahl-Hinweis 0,56 (keine Frage nennt einen Profilstahl-GWP), RStO-Betondecke 27 cm, Verweis DIN EN 1990 in `statistik`, Normtext-Kennzeichnungen.

## Hinweise (kein Fehler durch #276–#282)

- `q_hp_1`: fragt die Einordnung von 1400 ng/m³ PCB ausdrücklich „nach PCB-Richtlinie“ (300–3000 ng/m³) – in sich richtig und wie der Modultext („Nach der früheren PCB-Richtlinie …“); das Modul bewertet nach AIR 2025 (RW II 800 ng/m³, wie `q_sch_4`). Vorschlag: in der Erklärung den AIR-Gefahrenwert ergänzen.
- `qn_online_tools_2`: „≤ L/250 = 20 mm“ wie das Modulbeispiel, dort seit #278 als „vorläufig, Normprüfung ausstehend“ gekennzeichnet (NP2-OT-1, NA DE l/300); nach Klärung nachziehen.
- `qn_biokohlebeton_3`: Netto-Senke 2,0 kg CO₂/kg in der Aufgabe – Rundung von `PK_NETTO_SENKE_KG` = 2,05, richtig.
