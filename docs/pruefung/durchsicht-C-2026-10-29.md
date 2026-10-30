# Gezielte Durchsicht Tranche C – Bauprodukte, Grundlagen, Bestand, Mängel & Schäden (29.10.2026)

**Stand:** 29.10.2026 (Branch `durchsicht/c-10-29`, Basis `audit/pruefskript-10-29` mit #276/#277/#278)
**Auftrag:** Entscheidung vom 29.10.2026 (vollständige gezielte Durchsicht der freigegebenen Module, Vorschlag in `docs/pruefung/nachpruefung2-2026-10-29.md`). Geprüft wird nur auf die Fehlerarten der beiden Nachstichproben:

- **(a)** Bezugsgrößen und Einstufungen in Beispielen (Würfel/Zylinder, Kern h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t, Klasse aus dem richtigen Wert),
- **(b)** Norm-, Teil-, Tabellen-, Abschnitts- und Ausgabenzuordnungen (Normen-Registry `src/data/centralNormenRegistry.ts`, Ausgaben Stand 10/2026),
- **(c)** mehrfach vorkommende Kennwerte gegen die zentralen Konstanten (`zementGwp.ts`, `gwpLehrwerte.ts`, `SCHWINDBEIWERTE`, `CONCRETE`, `src/data/kennwerte.ts` mit `HOLZ_EN338`, `BAUSTAHL_EC3`, `ALTBETON_ZUORDNUNG`, `ALTBETON_1972_2001`, Energieausweis-Faktoren, `src/utils/bestandKern.ts`).

**Grundlage je Modul:** Ergänzungsbogen `docs/pruefung/kennwert-abgleich/<modul>.md` (Funde als Prüfaufträge) und eigene Durchsicht aller Beispiele, Tabellen, Katalog- und Kartenwerte (Inhalts-JSON und Modulcode, gefiltert auf Zahlen und Normverweise). **Prüfvermerke wurden nicht geändert, Quizfragen nicht geändert** (keine Frage ist durch die Korrekturen falsch geworden).

**Nachrechnung:** eigenes Prüfskript (Python, Sitzungsablage `scratchpad/dsc/nachrechnung.py`, eigene Umsetzung der Gleichungen): **101 Nachrechnungen aller Beispielrechnungen, 0 Abweichungen** im Rundungsrahmen. Zusätzlich Konsistenzprüfung der 77 Stahlprofile in `bp_stahlbauprofile` (W = 2I/h, i = √(I/A)): ohne Abweichung > 2 %. Regressionstest `tests/durchsichtC.test.ts` (Nachrechnungen über die Kerne `bestandKern`, `sicherheitskonzept`, `pruefverfahren`, `fenster`, `bauprodukte` und Absicherung der Korrekturen).

## Umfang

Alle Module mit Status `geprueft` aus dem Auftrag. **Hinweis zur Zählung:** In `src/data/pruefvermerke.ts` haben **24** (nicht 20) `bp_*`-Module den Status `geprueft`; geprüft wurden alle 24. Die Rechts- und Verkehrswegebau-Reiter teilen sich je eine Komponente (`BpRechtliches`, `BpVerkehrswegebau`); bei Letzterer sind nur die Reiter der freigegebenen Module (`bp_verkehr_asphalt`, `_pruefung`, `_rsto`, `_tunnel`) Prüfgegenstand, Funde in Reitern offener Module stehen als Hinweis.

| Gruppe | Module |
|---|---|
| Bauprodukte (24) | `bp_befestigung`, `bp_beton`, `bp_betonfertigteile`, `bp_betonzusatzmittel`, `bp_dach_fassade`, `bp_daemmung`, `bp_farben_lacke`, `bp_glaeser`, `bp_holzprodukte`, `bp_innovationen`, `bp_kunststoffe`, `bp_metallisch`, `bp_mineralisch`, `bp_putz_estrich`, `bp_recht_avcp`, `bp_recht_grundlagen`, `bp_recht_konformitaet`, `bp_recht_normen`, `bp_stahlbauprofile`, `bp_trockenbau`, `bp_verkehr_asphalt`, `bp_verkehr_pruefung`, `bp_verkehr_rsto`, `bp_verkehr_tunnel` |
| Grundlagen (6) | `baustoffkunde`, `einheiten`, `materialkennwerte`, `normen_ausblick`, `regularien`, `sicherheitskonzept` |
| Bauen im Bestand (7) | `bauwerkserfassung`, `zfp`, `bestand`, `denkmalpflege`, `historische_bauprodukte`, `historische_bauweisen`, `modernisierung` |
| Mängel & Schäden (2) | `bauschaeden`, `vdi6200` |

## Ergebnis

| Kennung | Modul | Befund | Art | Gewicht | Status |
|---|---|---|---|---|---|
| DSC-BZ-1 | `bp_betonzusatzmittel` | LP-Bildner „für Frost-Tausalz-Widerstand (Expositionsklassen XF3/XF4)“ – XF3 ist Frost ohne Taumittel; LP-Pflicht besteht nur bei XF4, bei XF2/XF3 ist LP eine Alternative zu höherer Festigkeit (DIN 1045-2, Tab. F.2.1; so im Modul Expositionsklassen) | (a)/(b) Einstufung | mittel | behoben |
| DSC-RG-1 | `regularien` | Gebäudetyp E „Gesetzentwurf … im parlamentarischen Verfahren seit 06/2026“ – nach der Fachklärung vom 26.10.2026 liegt seit 26.10.2026 ein neuer Entwurf zur Stellungnahme bei Ländern und Verbänden, ohne Kabinettsbeschluss | (c) modulübergreifend widersprüchlich | mittel | behoben |
| DSC-BS-1 | `bauschaeden` | Gebäudetyp E „im Juli 2026 angekündigter Entwurf … in der Ressortabstimmung und nicht veröffentlicht“ – überholt durch den Entwurf vom 26.10.2026 (wie DSC-RG-1) | (c) | gering | behoben |
| DSC-MK-1 | `materialkennwerte` | Materialdatenbank D30: f_c,0,k = 23 N/mm² (Wert der DIN EN 338:2009) neben E und f_t nach 2016; zentral `HOLZ_EN338.D30.fc0k` = 24 N/mm² (DIN EN 338:2016-07) | (c) | gering | behoben |
| DSC-NA-1 | `normen_ausblick` | EC0 als „EN 1990:2023, Deutsche Fassung vorbestellbar, Ausgabedatum nicht genannt“ – die Norm heißt mit A1:2026 **EN 1990-1:2023+A1:2026** (Teil 1: Neubauten), die Deutsche Fassung **DIN EN 1990-1:2026-12** ist angekündigt und ersetzt DIN EN 1990:2021-10 ([DIN Media](https://www.dinmedia.de/en/standard/din-en-1990-1-a1/400467169)); Teil 2 (bestehende Tragwerke) als EN 1990-2. Damit einheitlich mit `sicherheitskonzept` | (b) Teil/Ausgabe | gering | behoben |
| DSC-ZF-1 | `zfp` | Haftzugprüfung „DIN EN 1542 / Richtlinie SIB“ – die Rili-SIB ist durch die TR Instandhaltung abgelöst (so app-weit seit NP2-FL-1) | (b) | gering | behoben |
| DSC-ZF-2 | `zfp` | Rautiefenbestimmung „DIN EN 1766“ – DIN EN 1766 regelt Referenzbetone für Prüfungen, nicht die Rautiefe; neu „TR Instandhaltung (Prüfverfahren Rautiefe, Bezug Sandflächenverfahren; vorläufig, Normprüfung ausstehend)“ | (b) | gering | behoben (Normtext) |
| DSC-ZF-3 | `zfp` | Karsten’sches Prüfröhrchen „DIN 52617“ – zurückgezogen (Labor: DIN EN ISO 15148), das Röhrchen ist ein RILEM-Verfahren (II.4) | (b) | gering | behoben |
| DSC-DM-1 | `bp_daemmung` | Blähperlit nur „DIN EN 13169“ (Platten) und Blähton „DIN EN 13055“ (leichte Gesteinskörnung) bei Schüttdämmstoffen – ergänzt um die Produktnormen der Schüttung DIN EN 14316-1 bzw. DIN EN 14063-1 | (b) | gering | behoben |
| DSC-GL-1 | `bp_glaeser` | „3-IV, Standard nach GModG“ – das GModG fordert beim Fensteraustausch nur U_w ≤ 1,30 W/(m²K) (Anlage 7), 3-fach-Glas ist Marktstandard | (b) Einordnung | gering | behoben |
| DSC-BT-1 | `bp_beton` | Konformitätsbeispiel „Erreicht eine Prüfserie C30/37?“ vergleicht f_ck = 30,3 mit 30 N/mm², die Probekörperform stand nur in der Quellzeile; Prüfkörper (Zylinder 150/300 mm) und Würfelbezug (37 N/mm²) im Schritt 1 ergänzt | (a) | redaktionell | behoben |
| übrige 28 Module | – | ohne Befund | – | – | – |

**Fehlerquote dieser Tranche:** 10 von 39 Modulen mit mindestens einem Befund (26 %). Kein Befund ändert ein Rechenergebnis oder ein Nachweisergebnis; alle Rechenkerne und Beispiele stimmen (101 Nachrechnungen). Die Befunde liegen wie in den Nachstichproben in Katalogkarten, Normspalten und Fließtext.

**ALTBETON-Tabellen (Schwerpunkt):** In den Bestandsmodulen dieser Tranche (`bestand`, `bauwerkserfassung`, `zfp`, `denkmalpflege`, `historische_bauprodukte`, `historische_bauweisen`, `modernisierung`, `bauschaeden`, `vdi6200`) kommen **keine** alten Betongüten (B 120 … B 600, Bn/B, Bk) und keine Zuordnungen zu C-Klassen vor; die Zuordnung steht nur in `historisch` und `rechnung_bestand` (beide aus `ALTBETON_ZUORDNUNG`/`ALTBETON_1972_2001`). Historische Stahl- und Mauerwerkskennwerte in `historische_bauprodukte` wurden gegen `src/data/historicalMaterialsData.ts` abgeglichen (Flusseisen 220–240, Thomasstahl, Reichsformat 250 × 120 × 65 mm, Spannstahl St 140/160) – stimmig bis auf die Frage DSC-HP-1.

**Normverweise mit uneinheitlicher Ausgabe (Schwerpunkt `normen_ausblick`):** Die 11 Hinweise des Ergänzungsbogens sind bis auf DSC-NA-1 keine Fehler: Das Modul stellt bewusst eingeführte (DIN EN 1992-1-1:2011-01, 1993-1-1:2010-12, 1995-1-1:2010-12, DIN EN 206:2021-06 + DIN 1045-2:2023-08) und neue Ausgaben (DIN EN 1992-1-1:2025-09 = EN 1992-1-1:2023, DIN EN 1993-1-1:2025-04 = EN 1993-1-1:2022, DIN EN 1995-1-1:2026-09 = EN 1995-1-1:2025, DIN EN 206-1/-2:2026-07 = EN 206-1/-2:2026) nebeneinander; Europäische und Deutsche Ausgabe sind jeweils richtig gepaart, die Abweichung von der Registry (die die eingeführte Ausgabe führt) ist begründet. Tabellen unter verschiedenen Normteilen: keine in dieser Tranche.

## Befunde je Modul

Kürzel: (a) geprüft = Bezugsgrößen/Einstufungen der Beispiele, (b) = Normzuordnungen, (c) = Kennwerte gegen zentrale Konstanten.

### Bauprodukte

| Modul | (a) | (b) | (c) | Nachrechnungen | Befund |
|---|---|---|---|---|---|
| `bp_befestigung` | ✓ | ✓ DIN EN 1992-4, 7.2.1.4, k₁ = 7,7 gerissen, γ_Mc = 1,5 | – | N⁰_Rk,c = 27,5 kN, N_Rd,c = 18,4 kN, h_ef × 1,5 → × 1,84 | – |
| `bp_beton` | DSC-BT-1 | ✓ | ✓ C30/37 | f_ck = 30,3 N/mm² | DSC-BT-1 |
| `bp_betonfertigteile` | ✓ | ✓ DIN EN 13747/14992/1168, DIN 1045-4/-40:2023-08, EC2 6.2.5 | ✓ St 1660/1860 | g = 6,6 → 4,0 kN/m² | – |
| `bp_betonzusatzmittel` | DSC-BZ-1 | ✓ Tabellen DIN EN 934-2 (wie NP2) | ✓ | m_FM 5,1 kg, V 4,9 l, (w/z)_eff 0,481 | DSC-BZ-1; Frage DSC-BZ-2 |
| `bp_dach_fassade` | ✓ | ✓ DIN EN ISO 10077-1, EN 490/1304/988/12467/438, DIN 18516-1 | ✓ U_w ≤ 1,30, Passivhaus 0,80 | U_w = 0,87 | – |
| `bp_daemmung` | ✓ | DSC-DM-1 | ✓ Anlage 7 (0,24/0,20/0,30) | R_T = 4,96, U = 0,20 | DSC-DM-1; Frage DSC-DM-2 |
| `bp_farben_lacke` | ✓ | ✓ (NP2-FL-1 umgesetzt) | ✓ | d_wet 200 µm, 0,25 l/m² | – |
| `bp_glaeser` | ✓ | DSC-GL-1; DIN 18008-1/-2 (k_mod 0,7, k_c 1,8, γ_M 1,8/1,5) ✓ | ✓ f_g,k 45/70/120 | f_g,d 31,5/17,5/46,7/80 N/mm²; Gasverlust 1 %/a → 74 % nach 30 a | DSC-GL-1 |
| `bp_holzprodukte` | ✓ | ✓ Tab. 7.2 mit NA (l/300, l/200), k_cr nach NA | ✓ C24 (`HOLZ_EN338`) | q_d 2,36, M 5,98, σ 8,97, η 0,61, w_inst 12,0, w_fin 16,3 mm | – |
| `bp_innovationen` | ✓ | ✓ DIN EN 1992-1-1 Gl. 4.2, CEN/TS 12390-9, ISO 16290 | ✓ f_yd 435 | A_s 230, A_f 83 mm², ΔH −113 kJ/mol | – |
| `bp_kunststoffe` | ✓ | ✓ | ✓ α PE/PVC wie Materialdatenbank | ε(1000 h) 0,85 %, E_c 590 N/mm² | – |
| `bp_metallisch` | ✓ | ✓ DIN EN ISO 9223 (Zinkabtrag), EN 10025-5, EN 10346 | Frage DSC-ME-1 | G_k 0,25 kN, g_k 0,05 kN/m², ΔL 22 mm | Frage DSC-ME-1 |
| `bp_mineralisch` | ✓ | ✓ DIN EN 14411, 12004, 18008 | ✓ | 350/386 kg, Wasser 46/2 kg | – |
| `bp_putz_estrich` | ✓ | ✓ DIN EN 998-1 (CS I/II), 13813, 13279-1, WTA 2-9 | ✓ | 0,186 kg/kg Kristallwasser | – |
| `bp_recht_avcp`, `_grundlagen`, `_konformitaet`, `_normen` | – | ✓ BauPVO 2024/3110 (in Kraft 07.01.2025, anwendbar 08.01.2026), Anhang IX/V, EuGH C-100/13 | – | – (keine Rechnung) | – |
| `bp_stahlbauprofile` | ✓ | ✓ DIN EN 1993-1-1, 6.2.5/6.2.6 | ✓ S235 (`BAUSTAHL_EC3`), Profiltabelle konsistent | σ 81 N/mm², w 6,7 mm | – |
| `bp_trockenbau` | ✓ | ✓ DIN 18181 (Schrauben 250/750 mm, Fugenversatz 400 mm), EN 520, 14195, Q1–Q4 | ✓ | f₀ 82 bzw. 58 Hz | – |
| `bp_verkehr_asphalt`, `_pruefung`, `_rsto`, `_tunnel` | ✓ | ✓ RStO 12/24 Tafel 1 Zeile 1 (34/30/26/22/20/18/14 cm), Tafel 2 (27/26 cm), DIN EN 12697-22/-34, DIN 18134 | ✓ UIC 60 (76,86 cm²), R260 | σ_T 88 N/mm², N_T ≈ 680 kN | Hinweis DSC-VK-1 |

### Grundlagen

| Modul | (a) | (b) | (c) | Nachrechnungen | Befund |
|---|---|---|---|---|---|
| `baustoffkunde` | – | Frage DSC-BK-1 (Normtext) | ✓ α Beton/Stahl wie Materialdatenbank | – (Fakten-Stichprobe Geschichte: Aspdin 1824 Nr. 5022, Johnson 1844, Vicat, Monier 1867, Koenen 1886, Mörsch 1902, Powers/Brownyard; Pantheon 43,3 m; CUBE 2022 – richtig) | Frage DSC-BK-1 |
| `einheiten` | ✓ kN/cm² vs. N/mm² | ✓ DIN 1301-1:2010-10, 1301-2:1978-02, EN ISO 80000-1:2022 | ✓ C30/37 | σ 5,56 und 3,6 N/mm², 5 kN/m² = 0,005 N/mm² | – |
| `materialkennwerte` | ✓ | ✓ | DSC-MK-1; übrige gegen `CONCRETE`, `HOLZ_EN338`, `BSH_EN14080`, `BAUSTAHL_EC3` ✓ | ΔL 13,8/6,0 mm, E/ρ 26,8/26,2/13,8 | DSC-MK-1 |
| `normen_ausblick` | – | DSC-NA-1; übrige Ausgaben ✓ (s. o.) | ✓ XRC-Lesart | x_c,50 (XRC 3) = 21 mm | DSC-NA-1 |
| `regularien` | – | ✓ Art. 81a BayBO / § 85a MBO, § 8a VOB/A, EuGH C-377/17, Sonderbauschwellen | DSC-RG-1 | – | DSC-RG-1 |
| `sicherheitskonzept` | ✓ Zylinder f_ck | ✓ NA.A.1.1/NA.A.1.2(B), Tab. 2.1DE, γ_M 1,30 Holz | ✓ | N_Ed 1530 kN, N_Rd 2083 kN, η 0,73; Windsog −1,40/−1,50 kN/m² | – |

### Bauen im Bestand, Mängel & Schäden

| Modul | (a) | (b) | (c) | Nachrechnungen | Befund |
|---|---|---|---|---|---|
| `bestand` | ✓ | ✓ GModG Anlage 7, DIN 4108-3:2024-03, EN ISO 6946:2018-03, WTA 6-4/6-5 | ✓ CO₂ Erdgas 0,24 (`CO2_ERDGAS`), F_x | U 0,60, θ_si 15,1/18,1 °C, ΔQ 7560 kWh/a, 1814 kg | Frage DSC-BE-1 |
| `bauwerkserfassung` | ✓ | ✓ DIN 18202 Tab. 3 Z. 5/6, EC5 6.1.6, 6.2.4 (6.19), 6.3.2 (6.21/6.23), 5.4.4 | ✓ C24 aus `HOLZ_EN338` | σ_m,d 12,2, η 0,74; λ 99, λ_rel 1,68, k_c 0,31, 1,22 bzw. 0,91 | – |
| `zfp` | ✓ | DSC-ZF-1 bis -3; übrige ✓ (DIN EN 12504-2/-4, ISO 5579, EN 14629, SIA 262/1 Anh. E, DIN EN ISO 9972) | ✓ Wenner-Grenzen wie Kern | Radar 91,9 mm, Impact-Echo 128 mm, E_dyn 34,6 GPa, Karsten 10 cm ≈ 143 km/h | DSC-ZF-1 bis -3 |
| `denkmalpflege` | ✓ | ✓ BayDSchG, § 105 GModG, §§ 7i/10f EStG | ✓ | p 62,5 MPa, U 0,58 | – |
| `historische_bauprodukte` | – | ✓ TrinkwV § 17, GefStoffV § 5a, TRGS 519/521, AIR 2025 | Frage DSC-HP-1 (Torstahl) | PCB 1400 > 800 ng/m³, Pb 25 > 10 µg/l | Frage DSC-HP-1 |
| `historische_bauweisen` | ✓ (charakteristische Spannung ausdrücklich so bezeichnet) | ✓ DIN 68100:2010-07, DIN 1053-1:1996-11 | ✓ `SCHWINDBEIWERTE` | q 2,8, M 7,09, σ 5,5; Δb 14,3 mm | Frage DSC-HB-1 |
| `modernisierung` | ✓ | ✓ §§ 35–37, 69 GModG, Anlage 7/8, § 82b EStDV, § 6 Abs. 1 Nr. 1a EStG | ✓ `GMODG_ANLAGE7`, `CO2_ERDGAS` | ΔR 3,45, d_erf 0,110 m, U 0,197, Q_E 17 970 kWh/a, 7,6/1,3 a | Frage DSC-DM-2 |
| `bauschaeden` | ✓ | ✓ §§ 634a, 204, 650t BGB, § 13 VOB/B, § 404 Abs. 3 ZPO, DIN 18533:2026-06, DIN 18195:2025-12 | DSC-BS-1 | Fristen 15.03.2026/15.03.2025/10.01.2027; ΔL 4,8 mm, b 19,2 → 20 mm | DSC-BS-1 |
| `vdi6200` | ✓ | ✓ VDI 6200 Tab. 1/3, RI-EBW-PRÜF, DIN 1076:2026-01 | ✓ β-Ziel 3,8 (RC2, 50 a) | β 3,43, P_f 3,0 · 10⁻⁴ | – |

## Behobene Fehler (dieser PR)

| Kennung | Modul | Datei | Änderung | Quelle |
|---|---|---|---|---|
| DSC-BZ-1 | `bp_betonzusatzmittel` | `content/bpbetonzusatzmittel/BpBetonzusatzmittel.json` | LP-Karte: „XF4: nur mit LP; bei XF2/XF3 alternativ zu höherer Festigkeit (DIN 1045-2, Tab. F.2.1)“ statt „XF3/XF4“ | DIN 1045-2:2023-08, Tab. F.2.1 (wie Modul Expositionsklassen) |
| DSC-RG-1 | `regularien` | `content/regularien/Regularien.json` | Gebäudetyp E: Entwurf seit 26.10.2026 in der Anhörung, ohne Kabinettsbeschluss | `docs/fachklaerung-2026-10-26.md` (q_ndr_2) |
| DSC-BS-1 | `bauschaeden` | `content/bauschaeden/Bauschaeden.json` | dto. | dto. |
| DSC-MK-1 | `materialkennwerte` | `src/data/materials.json` | D30 f_c,0,k 23 → 24 N/mm² | DIN EN 338:2016-07 (`HOLZ_EN338.D30`) |
| DSC-NA-1 | `normen_ausblick` | `content/normenausblick/NormenAusblick.json` | EC0 als EN 1990-1:2023+A1:2026, DIN EN 1990-1:2026-12 angekündigt, NA im Entwurf, Teil 2 EN 1990-2; Weblink auf den DIN-Media-Eintrag | [DIN Media, DIN EN 1990-1:2026-12](https://www.dinmedia.de/en/standard/din-en-1990-1-a1/400467169) |
| DSC-ZF-1 | `zfp` | `content/zfp/daten.json` | Haftzug: TR Instandhaltung (vormals Rili-SIB) | wie NP2-FL-1 |
| DSC-ZF-2 | `zfp` | `content/zfp/daten.json` | Rautiefe: TR Instandhaltung statt DIN EN 1766 (vorläufig, Normprüfung ausstehend) | Titel DIN EN 1766 (Referenzbeton) |
| DSC-ZF-3 | `zfp` | `content/zfp/daten.json` | Karsten: RILEM II.4; Laborwert nach DIN EN ISO 15148 (früher DIN 52617) | DIN 52617 durch DIN EN ISO 15148 ersetzt |
| DSC-DM-1 | `bp_daemmung` | `content/bpdaemmung/BpDaemmung.json` | Blähperlit DIN EN 13169 (Platten) / DIN EN 14316-1 (Schüttung); Blähton DIN EN 14063-1 / DIN EN 13055 | Titel der Produktnormen |
| DSC-GL-1 | `bp_glaeser` | `content/bpglaeser/daten.json` | „3-IV, heutiger Marktstandard; GModG fordert nur U_w ≤ 1,30“ | GModG Anlage 7 Nr. 2a (`GMODG_ANLAGE7.fenster`) |
| DSC-BT-1 | `bp_beton` | `content/bpbeton/BpBeton.json` | Prüfkörper im Beispiel genannt (Zylinder 150/300 mm; Würfelvergleich 37 N/mm²) | DIN EN 206, Tab. 12 (f_ck/f_ck,cube) |

Die neue Kennzeichnung bei DSC-ZF-2 ist über das Stichwort „Prüfverfahren“ dem Fachgebiet „Prüfverfahren & Bauwerksdiagnostik“ zugeordnet (`scripts/auditDaten.ts`, FACHGEBIETE unverändert; `tests/auditDaten.test.ts` ohne Hinweis).

## Offene Fragen mit Vorschlag

| Kennung | Modul | Frage | Vorschlag |
|---|---|---|---|
| DSC-BK-1 (Normtext) | `baustoffkunde` | Formelquelle „DIN EN 1992-1-1, 3.1.3 und 3.2.7“ für α_T Beton 10 · 10⁻⁶ und Stahl 12 · 10⁻⁶ 1/K – Abschnitt 3.2.7 nennt nach Kenntnisstand keine Wärmedehnzahl | Stahl mit DIN EN 1993-1-1, 3.2.6 belegen (α = 12 · 10⁻⁶ 1/K), Beton bei 3.1.3 belassen; am Normtext bestätigen |
| DSC-BZ-2 | `bp_betonzusatzmittel` (übergreifend) | „Jedes Vol.-% Luftporen mindert die Festigkeit um ca. 5 %“, Quiz 4–5 %, `mischungsberechnung` „ca. 4 MPa“ – unterschiedliche Bezugsgrößen (Hinweis NP2) | einheitlich „rund 4–5 % je Vol.-% (bei 40 N/mm² ≈ 2 N/mm²)“; die 4 MPa in `mischungsberechnung` prüfen |
| DSC-DM-2 | `bp_daemmung`, `modernisierung` | Faustwerte Dämmdicke (λ 0,035) widersprechen sich: `bp_daemmung` Wand 12–14 / Dach 14–16 cm, `modernisierung` Wand 14–16 / Dach 12–14 cm; aus der eigenen U₀-Spalte von `modernisierung` folgt für die Wand d = 0,035 · (1/0,24 − 1/U₀) = 11,7–12,6 cm | einheitlich Wand 12–14 cm, Steildach zwischen Sparren 14–16 cm (Holzanteil); Werte aus der Formel im Text herleiten |
| DSC-ME-1 | `bp_metallisch`, `materialkennwerte` | λ Aluminium 220 W/(mK) (Text, Fassadenkonsolen) vs. 200 W/(mK) (Materialdatenbank, EN AW-6060) | Legierungswert 200 W/(mK) einheitlich; Bemessungswert nach DIN EN ISO 10456 (Aluminiumlegierungen 160 W/(mK)) als Hinweis |
| DSC-HP-1 | `historische_bauprodukte` | Torstahl „400 N/mm² (Torstahl 40) bis 500 N/mm² (Torstahl 50)“ vs. zentrale Tabelle `historicalMaterialsData` „BSt 42/50 (IIIb) Torstahl 420 N/mm²“ | Bezeichnungen der zentralen Tabelle übernehmen (BSt III 420/500, BSt IV 500/550) oder die Torstahl-Güten der Zulassungen mit Quelle nennen |
| DSC-HB-1 | `historische_bauweisen` | Zugbandrechner: σ_zul = 120 N/mm² fest im Code, Quelle nur „approx. 100–140 N/mm²“ | Quelle der Altnorm (zulässige Spannung Flusseisen/Schweißeisen) im Kommentar und Text nennen oder als Lehrwert kennzeichnen |
| DSC-BE-1 | `bestand` | Rechner-Auswahl „λ = 0,045 (Calciumsilikat-Innendämmung)“, Beispiel 1 rechnet Calciumsilikat mit λ = 0,060 | Auswahl als Spanne „0,045–0,065 (Calciumsilikat)“ beschriften oder Beispiel auf den Auswahlwert abstimmen |

## Hinweise (außerhalb der Fehlerarten oder des Prüfumfangs)

- **DSC-VK-1:** `BetondeckenTab` (Reiter des offenen Moduls `bp_verkehr_betondecken`) beschriftet den Dickenregler „Autobahn Bk100: 28–30 cm“, `RSTO_CONCRETE_DATA` (Reiter `bp_verkehr_rsto`) führt nach RStO 12/24, Tafel 2, Zeile 1, 27 cm (vorläufig). 28–30 cm passen zu anderen Zeilen der Tafel 2 (ungebundene Tragschicht); bei der Prüfung von `bp_verkehr_betondecken` die Zeile nennen.
- `statistik` (nicht in dieser Tranche): „Nachfolger DIN EN 1990 (EN 1990:2023) angekündigt“ – nach DSC-NA-1 auf DIN EN 1990-1:2026-12 umstellen.
- `bauschaeden`: Temperaturspanne 60 K (Fugen-Fließtext, jahreszeitlich) neben 80 K (Beispiel, Bauteiloberfläche) – verschiedene Bezugsgrößen, beide plausibel.
- `bestand`: Die U-Werte der Baualtersklassen sind als „Altbau-Atlas“ bezeichnet, die Literatur nennt die Bekanntmachung BMWi/BMI 2020 (F-Stelle aus Tranche 12, weiter offen).
- Mehrere Module nennen Marken bzw. Hersteller (z. B. Ytong, Fermacell, Poroton, Eternit in `historische_bauprodukte`, Hydro CIRCAL in `bp_glaeser`, neustark/CarbonCure in `bp_innovationen`); bei Bedarf neutral fassen.

## Nachweis

- Prüfskripte (Sitzungsablage, nicht im Repository): `scratchpad/dsc/dump.sh` und `ex.py` (Auszug aller Strings mit Zahlen/Normverweisen je Modul), `nachrechnung.py` (101 Nachrechnungen), Profilkonsistenz `bp_stahlbauprofile` (Inline-Skript).
- Regressionstest: `tests/durchsichtC.test.ts`.
- Quellen der Webrecherche: [DIN Media, DIN EN 1990-1:2026-12](https://www.dinmedia.de/en/standard/din-en-1990-1-a1/400467169) (Titel, Ausgabe, „ersetzt DIN EN 1990:2021-10“); [genorma, EN 1990-1:2023+A1:2026](https://genorma.com/en/standards/en-1990-1-2023-a1-2026).
