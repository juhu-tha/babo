# Gezielte Durchsicht Tranche D – Baustoffe, Holzbau, Mechanik (29.10.2026)

**Stand:** 29.10.2026 (Branch `durchsicht/d-10-29`, Basis `audit/pruefskript-10-29`, PR #278)
**Status:** Befundliste mit Korrekturen – Prüfvermerke unverändert, keine Quizfrage geändert (keine Frage durch eine Änderung falsch geworden).
**Auftrag:** Entscheidung vom 29.10.2026 zur Empfehlung der Nachprüfung (`docs/pruefung/nachpruefung2-2026-10-29.md`, Tranchenvorschlag D): die 25 freigegebenen Module der Menügruppen Baustoffe, Holzbau und Mechanik gezielt auf

- **(a)** Bezugsgrößen und Einstufungen in Beispielen,
- **(b)** Norm-, Teil-, Tabellen-, Abschnitts- und Ausgabenzuordnungen (gegen `src/data/centralNormenRegistry.ts`, Ausgaben Stand 10/2026),
- **(c)** mehrfach vorkommende Kennwerte gegen die zentralen Konstanten (`SCHWINDBEIWERTE`, `HOLZ_EN338`/`BSH_EN14080`, `KMOD`/`KDEF`, `CONCRETE`, `BAUSTAHL_EC3`, `BETONSTAHL`, `E_BAUSTAHL`/`E_BETONSTAHL`, `GWP_LEHRWERTE`, `ALPHA_E`, `REGELSIEBLINIEN`) sowie fest verdrahtete Faktoren in den Mechanik-Modulen.

**Grundlage je Modul:** Ergänzungsbogen `docs/pruefung/kennwert-abgleich/<modul>.md` (Funde als Prüfaufträge), dazu die eigene Durchsicht aller Beispiele, Tabellen und Kartenwerte in `content/**` und `src/modules/**`, der Steckbriefe im gemeinsamen Baustein `src/components/ui/BaustoffProfil.tsx` (Reiter „Baustoff-Steckbrief“) und der Kurzfassungen (`src/data/kurzfassung.ts`). Jede Beispielrechnung wurde mit einem eigenen Skript (Python) nachgerechnet; die Handwerte stehen als Regressionstest in `tests/durchsichtD.test.ts` (über die Kerne, wo vorhanden).

## Ergebnis

| Modul | (a) | (b) | (c) | Befunde | Status |
|---|---|---|---|---|---|
| `ausbau` | ✓ | ✓ | ✓ | – | ohne Befund |
| `daemmstoffe` | ✓ | ✓ | ✓ | – | ohne Befund |
| `erdbau` | ✓ | ✓ | ✓ | – (Hinweis H-3) | ohne Befund |
| `gesteine` | ✓ | ✓ | ✓ | – | ohne Befund |
| `glas` | ✓ | ✓ | ✓ | – | ohne Befund |
| `holz` | ✓ | ✓ | Befund | DSD-HO-1, DSD-HO-2, DSD-HO-3 | behoben |
| `holzwerkstoffe` | ✓ | ✓ | ✓ | – | ohne Befund |
| `keramik_ziegel` | ✓ | ✓ | ✓ | – | ohne Befund |
| `kombinationen` | ✓ | Befund | Befund | DSD-KO-1 (Normtext), DSD-KO-2 | gekennzeichnet bzw. behoben |
| `kunststoffe` | ✓ | ✓ | Befund | DSD-KU-1 | behoben |
| `materialitaet_architektur` | ✓ | ✓ | ✓ | – | ohne Befund |
| `metalle` | Befund | Befund | ✓ | DSD-ME-1, DSD-ME-2 | behoben |
| `nawaro` | ✓ | ✓ | ✓ | – (Hinweis H-1) | ohne Befund |
| `putzemoertel` | ✓ | ✓ | ✓ | – | ohne Befund |
| `sonstiges` | ✓ | ✓ | ✓ | – | ohne Befund |
| `holzbau_bemessung` | ✓ | ✓ | Faktor | DSD-HB-1 | behoben (ohne Wertänderung) |
| `holzbau_werkstoffe` | ✓ | Normtext | Befund | DSD-HO-1 (gemeinsam mit `holz`), DSD-HW-1 (Normtext) | behoben bzw. gekennzeichnet |
| `baustatik` | ✓ | ✓ | ✓ | – | ohne Befund |
| `bodenmechanik` | Befund | ✓ | Faktor | DSD-BM-1, DSD-BM-2 | behoben |
| `bruchmechanik` | ✓ | ✓ | ✓ | – | ohne Befund |
| `emodul` | ✓ | ✓ | Faktor | DSD-EM-1 | behoben (ohne Wertänderung) |
| `festigkeit` | ✓ | ✓ | ✓ | – | ohne Befund |
| `formaenderungen` | ✓ | ✓ | ✓ | – | ohne Befund |
| `materialmodelle` | ✓ | ✓ | Faktor | DSD-MM-1 | behoben (ohne Wertänderung) |
| `stahlbau_ec3` | ✓ | ✓ | Faktor | DSD-ST-1 | behoben (ohne Wertänderung) |

**Module mit Fachbefund (Inhalt falsch oder widersprüchlich): 6 von 25** (`holz`, `holzbau_werkstoffe`, `kombinationen`, `kunststoffe`, `metalle`, `bodenmechanik`); dazu fünf Module, in denen nur fest verdrahtete Faktoren ohne Wertänderung auf die Kerne umgestellt wurden. **Gewicht:** Kein Befund ändert eine Einstufung oder ein Nachweisergebnis in einem Beispiel; alle rund 120 Nachrechnungen der Beispiele und Rechnervorgaben stimmen mit den Modulwerten im Rundungsrahmen überein. Rechnerisch wirksam ist nur DSD-HO-1 (Schwindrechner des Moduls Holz für Buche um rund 10 % geringere Maßänderung). Kein gewichtiger Fehler – keine Rücknahme einer Freigabe vorgeschlagen.

## Befunde je Modul

### Baustoffe

**`ausbau`** – Nachrechnung Estrichfeld 8 m: ΔL_T = 8000 · 12 · 10⁻⁶ · 30 = 2,9 mm, ΔL_cs = 4,0 mm; Spanne 3,2 bis 4,8 mm. Fliesengruppen nach DIN EN 14411 (≤ 0,5 / 0,5–3 / > 10 %), DIN 18534 (GKB nur W0-I/W1-I), C1/C2 ≥ 0,5/1,0 N/mm² (DIN EN 12004-1) richtig. Ohne Befund.

**`daemmstoffe`** – Nachrechnung Bestandswand: R = 0,13 + 0,04 + 0,015/0,70 + 0,24/0,99 = 0,434 m²K/W, R_D = 4,566, Dicken EPS 035 160 mm, MW 032 146 mm, Holzfaser 040 183 mm. λ-Spannen, EPS Euroklasse E (früher B1), VIP 0,004–0,007 und Belüftung auf 0,020 (Faktor 3–5, übereinstimmend mit `sonstiges`) richtig. Ohne Befund.

**`erdbau`** – Nachrechnung ρ_d = 2,05/1,08 = 1,898 t/m³, D_Pr = 97,3 %, Fehlvergleich Feuchtdichte 105,1 %. Feinanteilgrenzen DIN 18196 (5/15/40 %), F1–F3 nach ZTV E-StB 17, E_v2/E_v1-Grenzen (bereits vorläufig gekennzeichnet) richtig. Ohne Befund; Hinweis H-3 zum Steckbrief.

**`gesteine`** – Nachrechnung Körnungsziffer B16 k = 366/100 = 3,66; die Durchgänge 8/20/32/42/56/76/100 % stimmen mit `REGELSIEBLINIEN[16].B` (`src/calc/mischung.ts`) überein (Test). Prüfnormen DIN EN 933-1/-3/-4, 1097-1/-2/-6/-8, 1367-1, Kornklassen nach DIN EN 12620 (D ≤ 4 mm; d ≥ 2 mm, D ≥ 4 mm), Steckbrief (DIN 18516-3, DIN EN 771-6, 1341, 1469, 13450) richtig. Ohne Befund.

**`glas`** – Nachrechnung σ_T = 70 000 · 9 · 10⁻⁶ · 40 = 25,2 N/mm² (60 K: 37,8 N/mm²). f_g,k 45/70/120 N/mm² (wie `bruchmechanik` und Steckbrief), ΔT 40/100/200 K, DIN 18008-1 (γ_M 1,8/1,5, k_mod 0,25/0,40/0,70, k_c 1,8), effektive Dicke nach DIN EN 16612 richtig. Ohne Befund.

**`holz`** – Nachrechnung Biegebeispiel C24 100/200: f_m,d = 0,8 · 24/1,3 = 14,77 N/mm², W = 666 667 mm³, M_Rd = 9,85 kNm, η = 0,71. k_mod (Tab. 3.1), k_def (Tab. 3.2), γ_M = 1,3 (NA DE), k_c,90 1,25/1,5/1,75 (6.1.5), k_cr 2,0/f_v,k bzw. 2,5/f_v,k (NA DE), β_n/β_0 nach DIN EN 1995-1-2, Tab. 3.1, Festigkeitsklassen aus `HOLZ_EN338`/`BSH_EN14080` richtig.
- **behoben – DSD-HO-1 (c):** Der Schwindrechner führte für Buche eine Modulkopie q_r/q_t = 0,22/0,45 %/% ohne Quelle; das Modul Holzbau (`holzbau_werkstoffe`, Quelle TU München, T10-HW-1) rechnet mit 0,20/0,40. Die Konsistenzprüfung vom 29.10. (A-3) hatte nur Fichte, Kiefer und Eiche zentralisiert. Lärche (0,14/0,29) und Buche (0,20/0,40) stehen jetzt in `SCHWINDBEIWERTE` (`src/calc/holzphysik.ts`); Holz liest Buche daraus, der Schwindrechner des Holzbau-Moduls liest alle fünf Holzarten aus dem Kern (aus dem Inhalt nur die Bezeichnung). Kein Quiz betroffen.
- **behoben – DSD-HO-2 (c):** Steckbrief „ca. 0,9 t CO₂/m³ Holz“ – der zentrale Lehrwert `GWP_LEHRWERTE.kvh.biogen` beträgt −820 kg CO₂-Äq./m³ (DIN EN 16449, 500 kg/m³, u = 12 %), das Modul `nawaro` rechnet für BSH 420 kg/m³ 0,69 t. Der Steckbrief liest den Wert jetzt aus `GWP_LEHRWERTE` („rund 0,82 t CO₂ je m³ Konstruktionsvollholz mit 500 kg/m³“).
- **behoben – DSD-HO-3 (c):** Steckbrief „tangential rund 30-mal stärker als längs“ – mit den zentralen Werten (Fichte 0,36 zu 0,01 %/%) 36-mal; der Text bildet das Verhältnis jetzt aus `SCHWINDBEIWERTE`.

**`holzwerkstoffe`** – Nachrechnung w_fin = 4,0 · (1 + k_def): OSB/3 NKL 1 10,0 mm, Vollholz 6,4 mm, OSB/3 NKL 2 13,0 mm – mit `KDEF` übereinstimmend. γ_M-Empfehlungswerte Tab. 2.3 (1,2 OSB/Sperrholz, 1,3 Span-/Faserplatten), REACH Anhang XVII Eintrag 77 (0,062 mg/m³ ab 06.08.2026), Regelwerke (DIN EN 13986:2015-06, 300:2006-09, 312:2010-12, 636:2015-05, 16351:2025-07) richtig. Ohne Befund.

**`keramik_ziegel`** – Nachrechnungen E_b = 3,5/1250 = 0,28 % (BIa), V = 536,5 cm³, ρ = 2,33 g/cm³, P_offen = 0,65 %, Gegenbeispiel 0,60 % (BIb); Formmaß l_t = 244,90 mm, l_0 = 260,53 mm, s_ges = 7,88 %, Brennschwindung 3 %: 237,55 mm (−2,45 mm); Rechner-Vorgaben (0,08 % BIa, 2 % BIb, 15 % BIII, Spaltplatte 2,5 % AIb). Fliesengruppen DIN EN 14411, Druckfestigkeitsklassen DIN 20000-401 (Mittelwert 1,25-fach), RC-Typen DIN 4226-101 (Rb ≤ 10/30 M.-%), 0,44 kg CO₂/kg CaCO₃ (Stöchiometrie, kein GWP-Lehrwert) richtig. Ohne Befund.

**`kombinationen`** – Nachrechnung Schichtaufbau und Voigt/Reuss über den Kern (`src/calc/kombinationen.ts`); λ Normalbeton 2,0, PVB 0,76/1,52 mm, E°(Zn/Fe) −0,76/−0,44 V, Hinterlüftung ≥ 20 mm (DIN 18516-1), U ≤ 0,24 (GModG Anlage 7), DIN EN 1542 (Ø 50 mm) richtig.
- **gekennzeichnet, offen – DSD-KO-1 (b, Normtext):** Die Karte „Hydrophobierung“ unter „Schutz mineralischer Baustoffe nach DIN EN 1504-2“ nennt als Kennwert „w < 0,1 kg/(m²·h^0,5)“. Nach meinem Kenntnisstand ist dieser Wert in DIN EN 1504-2 die Anforderung an Beschichtungen (kapillare Wasseraufnahme); für hydrophobierende Imprägnierungen nennt die Norm das Verhältnis der Wasseraufnahme zum unbehandelten Probekörper (< 7,5 %, nach Alkalilagerung < 10 %) sowie Eindringtiefe und Trocknungsrate. Wert gekennzeichnet („vorläufig, Normprüfung ausstehend“), Zahl unverändert. **Vorschlag:** am Normtext prüfen; dann Karte auf „Wasseraufnahme < 7,5 % des unbehandelten Betons (DIN EN 1504-2)“ umstellen und w < 0,1 der Karte „Beschichtung“ zuordnen.
- **behoben – DSD-KO-2 (c):** Die Abreißformel endete mit „≥ 1,5 MPa (Mindestanforderung Betoninstandsetzung)“, die Kurzfassung mit „für die Betoninstandsetzung gilt mindestens 1,5 MPa“. Derselbe Wert wurde in `bp_farben_lacke` als Wert befahrbarer Systeme erkannt (NP2-FL-1). Angeglichen: im Mittel 1,5 N/mm², kleinster Einzelwert 1,0 N/mm² für OS 8/OS 11; für nicht befahrbare Systeme geringere Werte nach TR Instandhaltung und DIN EN 1504-10 (vorläufig, Normprüfung ausstehend) – `content/kombinationen/Kombinationen.json` (`haftzugAnforderung`), `src/modules/Kombinationen.tsx`, `src/data/kurzfassung.ts`.

**`kunststoffe`** – Nachrechnung PVC-U ΔL = 10 000 · 80 · 10⁻⁶ · 40 = 32 mm, Stahl 4,8 mm (Faktor 6,7). Regelwerke (DIN EN ISO 527-1, 6721-1, 11357-1, 178; ISO 11359-2 mit Entwurf DIN EN ISO 11359-2) und Kunststoffmodelle (`KUNSTSTOFF_MODELLE`) richtig.
- **behoben – DSD-KU-1 (c):** Steckbrief „bis zu 10-mal größer als Beton/Stahl“, Formel im Modul „ca. 7- bis 20-mal“ (PVC 80, PE bis 200 · 10⁻⁶/K). Steckbrief angeglichen („etwa 7- bis 20-mal, z. B. PVC-U rund 80 · 10⁻⁶/K“).

**`materialitaet_architektur`** – Nachrechnung b = √(λ·ρ·c): Holz 306, Beton 2191, Stahl 13 290 J/(m²K√s); Kontakttemperaturen 30,0 / 24,1 / 20,9 °C, Unterschied Holz–Stahl 9,1 K. λ/ρ/c wie Holz-Modul (0,13/450) und DIN EN ISO 10456 (Stahl 50). Ohne Befund.

**`metalle`** – Nachrechnung Δl 6 m, 80 K: Aluminium 11,5 mm, Stahl 5,8 mm, Titan 4,1 mm; Kennwerttabelle (Baustahl E = 210 000 wie `E_BAUSTAHL`, S355J2W f_y = 355 wie `BAUSTAHL_EC3`, Edelstahl E = 200 000) und Wärmedehnzahlen wie Quiz `q_met_3`/`qn_metalle_1`. Regelwerke (DIN EN 1993-1-4, 1999-1-1, 10025-5, 988) richtig.
- **behoben – DSD-ME-1 (b):** Steckbrief Titan: „Bleche und Platten aus Titan und Titanlegierungen (DIN EN ISO 21809)“ – DIN EN ISO 21809 regelt Umhüllungen von Rohrleitungen. Ersetzt durch die technischen Lieferbedingungen DIN 17860 („Bänder und Bleche aus Titan und Titanlegierungen“, [DIN Media](https://www.dinmedia.de/de/norm/din-17860/370729569); Ausgabe vorläufig, Normprüfung ausstehend).
- **behoben – DSD-ME-2 (a, Einstufung):** Titan im Steckbrief als „Edelmetall“ eingestuft (Untertitel, Historie); Titan ist ein unedles, sich selbst passivierendes Leichtmetall. Bezeichnung korrigiert.

**`nawaro`** – Nachrechnung BSH ρ₁₂ = 420 kg/m³ (= `BSH_EN14080.GL24h.rhoMean`): m₀ = 375 kg, m_C = 187,5 kg, P_CO₂ = 688 kg (DIN EN 16449); Vergleichstabelle (C25/30 f_ctm 2,6, E_cm 31 000 wie `CONCRETE`, GL24h E 11 500 wie `BSH_EN14080`) richtig. Ohne Befund; Hinweis H-1.

**`putzemoertel`** – Nachrechnung Gipsputz 50 m² · 15 mm · 1,1 kg/(m²·mm) = 825 kg = 33 Sack (Faktor wie `PUTZ_VERBRAUCH.gips`). Mörtelklassen (M 5 ≈ MG IIa, M 10 ≈ MG III, M 20 ≈ MG IIIa), CS I–IV, Künzel-Kriterien DIN 4108-3 (w ≤ 0,5; s_d ≤ 2,0 m; w · s_d ≤ 0,2), WTA 2-9 (LP > 25 %, Porosität ≥ 40 %, 80 cm, ≥ 20 mm) richtig. Ohne Befund.

**`sonstiges`** – Nachrechnung PCM 160/5 = 32; VIP 0,007 (5-mal besser als EPS 0,035), belüftet 0,020; Leichtzuschläge DIN EN 13055 (≤ 2000 bzw. ≤ 1200 kg/m³); Aerogelputz 0,03 wie `putzemoertel` (0,028). Ohne Befund.

### Holzbau

**`holzbau_bemessung`** – Nachrechnung Stütze C24 120/160, l_ef = 3,0 m: i = 34,6 mm, λ = 86,6, λ_rel = 1,469, k = 1,695, k_c = 0,393, N_Rd = 97,6 kN, ohne Knicken 248 kN, Ausnutzung 51 % (Kern `bemesseDruckstab`, Test). Querdruckfälle (6.1.5), E_0,05 aus `HOLZ_EN338` richtig.
- **behoben – DSD-HB-1 (Faktor, ohne Wertänderung):** Der Rechenweg setzte β_c = 0,1/0,2 und γ_M = 1,3 als Literale und k_mod/γ_M in zwei Formeln mit Dezimalpunkt („0.8 × 21/1.3“). β_c steht jetzt als `BETA_C` im Kern (`src/calc/holzbau.ts`, von `knickbeiwert` genutzt), γ_M aus `GAMMA_M_HOLZ`, Zahlen deutsch formatiert.

**`holzbau_werkstoffe`** – Kennwerttabelle aus `HOLZ_EN338`/`BSH_EN14080` (zentral), dataholz-Bauteile (U-Werte nach T10-HW-2), Brandschutzformel (β_n 0,8/0,7, d₀ = 7 mm, k₀) richtig; Schwindrechner siehe DSD-HO-1.
- **gekennzeichnet – DSD-HW-1 (Normtext):** „Rechenwert für Nadelholz quer zur Faser häufig 0,24 %/% (DIN 1052; Fundstelle im NA zu EC5 manuell prüfen)“ – jetzt im Wortlaut „vorläufig, Normprüfung ausstehend“.

### Mechanik

**`baustatik`** – Nachrechnungen Einfeldträger A = 63,3, B = 46,7 kN, V(2⁻/2⁺) = 43,3/−6,7 kN, M_max = 106,7 kNm; Zweifeldträger M_B = −62,5 kNm, A = C = 37,5, B = 125 kN (= 1,25 q l); Dreigelenkrahmen H = 20 kN, M_Ecke = 80 kNm (Kern `traeger`, Test). Die beiden Literale des Prüfskripts (`400`, `250`) sind Zeichenmaßstäbe. Ohne Befund.

**`bodenmechanik`** – Nachrechnungen I_P = 25 %, I_C = 0,80 (halbfest), bei w = 35 % I_C = 0,40 (weich), A-Linie 18,3 % → TM; K_a = 0,333, e_a = 33,3 kN/m², E_a = 83,3 kN/m; s = 40 mm, t₉₀ = 1,70 a (einseitig 6,78 a) (Kerne, Test). Regelwerke (DIN EN 1997-1:2014-03 mit Hinweis auf die MVV-TB-Fassung, DIN 1054:2021-04, DIN EN ISO 17892-12:2022-08, DIN 18196:2023-02, DIN 4019:2015-05, DIN 4085:2017-08) wie Registry.
- **behoben – DSD-BM-1 (a):** Der Rechenweg nannte für die Zustandsform „Grenzen 0 / 0,50 / 0,75 / 1,00“ – das ist die Einteilung der früheren DIN 18122-1; Kern, Kapiteltext und Atterberg-Reiter teilen seit T2-B-1 nach DIN EN ISO 14688-2 auch bei 0,25 (breiig/weich). Text um 0,25 ergänzt.
- **behoben – DSD-BM-2 (Faktor):** A-Linie im Rechenweg als Literal 0,73 · (w_L − 20); jetzt `aLinie` aus `src/calc/boden.ts`. Das zweite Literal des Prüfskripts (`1.2`) ist ein Achsenmaßstab.

**`bruchmechanik`** – Nachrechnungen σ_c = 0,75/(1,12 · √(π · 5 · 10⁻⁴)) = 16,9 MPa; K_I = 1,12 · 200 · √(π · 0,010) = 39,7 MPa√m, η = 2,52. f_g,k Floatglas 45 MPa wie `glas`, ISO 12135:2021 richtig. Ohne Befund.

**`emodul`** – Nachrechnungen E_cm = 22 · 3,8^0,3 = 32,8 GPa, Kalkstein 29,5 GPa, Sandstein 23,0 GPa; Voigt 48,0 GPa, Reuss 37,5 GPa. Der Abgleich meldete Quiz `qn_emodul_4` (39,4 GPa gegen `CONCRETE['C30/37'].Ecm` = 33 000): 1,2 · 32,84 = 39,4 GPa folgt aus der Gleichung der Tab. 3.1 (Tabellenwert gerundet 33 GPa) – richtig.
- **behoben – DSD-EM-1 (Faktor, ohne Wertänderung):** Gesteinsbeiwerte α_E (1,2/1,0/0,9/0,7) als Literale in der Auswahl; jetzt aus `ALPHA_E` (`src/calc/betonkennwerte.ts`).

**`festigkeit`** – Nachrechnungen H = 20 · 10⁶/(2400 · 9,81) = 849 m, mit f_cd = 11,3 N/mm² und γ_G = 1,35 rund 356 m; Reißlänge S235 4675 m; Werkstofftabelle (C20/25, C50/60, S235, C24) wie `CONCRETE`, `BAUSTAHL_EC3`, `HOLZ_EN338` (bereits in `tests/kennwerte.test.ts` abgesichert). Ohne Befund.

**`formaenderungen`** – Nachrechnungen Δl = 12 mm, σ = 13,2 N/mm²; E_c = 34 650 N/mm², ε_el = 0,29 ‰, ε_cc = 0,58 ‰, gesamt 0,87 ‰, 2,6 mm auf 3 m; Biegelinie: Holz/Stahl 210 000/11 000 = 19,1 (Werkstoffe aus den Kernen). Ohne Befund.

**`materialmodelle`** – Nachrechnungen ε_y = 2,5 ‰, σ_max = 535 MPa, ε_p = 17,3 ‰ (Kern `bilinearVerfestigung`, Test); Maxwell σ(3 s) = 2,23 MPa, t½ = 1,39 s; Bingham γ̇ = 6 s⁻¹. B500A/B (k, ε_uk) wie `BETONSTAHL`, Relaxationsklasse 2 (ρ₁₀₀₀ = 2,5 %), k_def wie `KDEF` richtig.
- **behoben – DSD-MM-1 (Faktor, ohne Wertänderung):** Vorgaben B500B/S355/S235 setzten f_y und E als Literale; jetzt aus `BETONSTAHL`, `BAUSTAHL_EC3`, `E_BETONSTAHL`, `E_BAUSTAHL` (Verfestigungsmoduln bleiben Lehrwerte).

**`stahlbau_ec3`** – Nachrechnungen Zugstab N_pl,Rd = 282,0, N_u,Rd = 254,0 kN, η = 0,79; IPE 300: c/t_f = 5,3, c/t_w = 35,0 (Klasse 1), M_pl,Rd = 147,7, M_el,Rd = 130,9 kNm, W_pl/W_el = 1,13, unter Druck S355 42ε = 34,2 → Klasse 4; HEB 200: λ̄_z = 0,840, Φ = 1,010, χ_z = 0,637, N_b,z,Rd = 1063 kN, λ̄_y = 0,499, χ_y = 0,885, 1476 kN, N_c,Rd = 1835 kN (58 %). Der Abgleich meldete „S355: f_y = 335 N/mm²“ – richtig, es ist der Wert für 40 mm < t ≤ 80 mm (Tab. 3.1).
- **behoben – DSD-ST-1 (Faktor, ohne Wertänderung):** Im Rechenweg Biegeknicken standen E = 210 000 N/mm² und γ_M1 = 1,1 als Literale; jetzt aus `EC3_NA_DE`.

## Behobene Fehler (dieser PR)

| Kennung | Art | Modul | Datei | Änderung |
|---|---|---|---|---|
| DSD-HO-1 | (c) | `holz`, `holzbau_werkstoffe` | `src/calc/holzphysik.ts`, `src/modules/Holz.tsx`, `src/modules/HolzbauBeta.tsx` | Buche 0,20/0,40 statt 0,22/0,45; Lärche und Buche in `SCHWINDBEIWERTE`, Holzbau-Schwindrechner aus dem Kern |
| DSD-HO-2 | (c) | `holz` | `src/components/ui/BaustoffProfil.tsx` | biogener Speicher aus `GWP_LEHRWERTE.kvh` (0,82 statt 0,9 t/m³) |
| DSD-HO-3 | (c) | `holz` | `src/components/ui/BaustoffProfil.tsx` | Verhältnis tangential/längs aus `SCHWINDBEIWERTE` (36 statt „rund 30“) |
| DSD-KO-2 | (c) | `kombinationen` | `content/kombinationen/Kombinationen.json`, `src/modules/Kombinationen.tsx`, `src/data/kurzfassung.ts` | Haftzug 1,5/1,0 N/mm² nur für befahrbare Systeme (wie NP2-FL-1) |
| DSD-KU-1 | (c) | `kunststoffe` | `src/components/ui/BaustoffProfil.tsx` | Wärmedehnung 7- bis 20-mal wie Modul |
| DSD-ME-1 | (b) | `metalle` | `src/components/ui/BaustoffProfil.tsx` | Titanbleche DIN 17860 statt DIN EN ISO 21809 |
| DSD-ME-2 | (a) | `metalle` | `src/components/ui/BaustoffProfil.tsx` | Titan Leichtmetall statt Edelmetall |
| DSD-BM-1 | (a) | `bodenmechanik` | `src/modules/Bodenmechanik.tsx` | Zustandsgrenze 0,25 im Rechenweg |
| DSD-BM-2, DSD-HB-1, DSD-EM-1, DSD-MM-1, DSD-ST-1 | Faktor | `bodenmechanik`, `holzbau_bemessung`, `emodul`, `materialmodelle`, `stahlbau_ec3` | `src/calc/holzbau.ts` (`BETA_C`), Module | A-Linie, β_c, γ_M, α_E, f_y/E, γ_M1 aus den Kernen (ohne Wertänderung) |
| DSD-KO-1, DSD-HW-1 | (b) Normtext | `kombinationen`, `holzbau_werkstoffe` | `content/kombinationen/Kombinationen.json`, `content/holzbaubeta/HolzbauWerkstoffe.json` | gekennzeichnet „vorläufig, Normprüfung ausstehend“ |

Regressionstest: `tests/durchsichtD.test.ts` (Nachrechnungen über `festigkeitswerte`, `KDEF`, `bemesseDruckstab` (Holz/Stahl), `traeger`, `zustandsgrenzen`, `erddruckRankine`, `konsolidierung`, `biegewiderstandY`, `bilinearVerfestigung`, `ecmEc2`, `REGELSIEBLINIEN`, `PUTZ_VERBRAUCH` und Absicherung der Korrekturen DSD-*).

## Offene Fragen mit Vorschlag

| Kennung | Modul | Frage | Vorschlag |
|---|---|---|---|
| DSD-KO-1 (Normtext) | `kombinationen` | Kriterium der Hydrophobierung nach DIN EN 1504-2: w < 0,1 kg/(m²·h^0,5) oder Wasseraufnahmeverhältnis < 7,5 %? | am Normtext prüfen; Karte „Hydrophobierung“ auf das Verhältnis zum unbehandelten Beton umstellen, w < 0,1 der Beschichtung zuordnen |
| DSD-HW-1 (Normtext) | `holzbau_werkstoffe` | Rechenwert 0,24 %/% quer zur Faser – Fundstelle im NA zu DIN EN 1995-1-1 | am NA prüfen und die Fundstelle (Abschnitt) statt DIN 1052 nennen |
| DSD-ME-1 (Ausgabe) | `metalle` | Ausgabe DIN 17860 (öffentlich: Norm und neuerer Entwurf gelistet) | Ausgabe am DIN-Media-Eintrag festlegen und Kennzeichnung entfernen |

## Hinweise (kein Befund)

- **H-1 (`nawaro`, `holz`):** Biogener Speicher von Holz erscheint mit drei Bezugsdichten – KVH 500 kg/m³ (`GWP_LEHRWERTE.kvh`, −820), BSH 480 kg/m³ (`GWP_LEHRWERTE.bsh`, −760, EPD-Lehrwert) und BSH 420 kg/m³ (`nawaro`, 688 kg nach DIN EN 16449). Alle richtig für ihre Dichte; bei Gelegenheit die Dichte jeweils mitnennen (im Steckbrief Holz jetzt geschehen).
- **H-2 (`holz`):** Der Werkstoffwähler zeigt für BSH ρ = 450 kg/m³ (Fichten-BSH, Lehrwert), die Festigkeitsklasse GL24h hat ρ_mean = 420 kg/m³ (`BSH_EN14080`). Kein Widerspruch (Holzart gegen Klasse), aber erklärungsbedürftig.
- **H-3 (`erdbau`, Steckbrief):** „Abfuhr- und Deponiekosten … je nach Schadstoffklasse wie Z0–Z5“ – Z3 bis Z5 stammen aus älteren LAGA-Fassungen; seit 1. August 2023 gelten für Bodenmaterial die Klassen der Ersatzbaustoffverordnung (BM-0 bis BM-F3). Bei Gelegenheit neutral fassen.
- **H-4 (`kombinationen`, Steckbrief Faserverbund):** Produktname eines GFK-Bewehrungsstabs genannt – falls der Grundsatz „herstellerneutral“ auch für Steckbriefe gilt, neutral fassen.
- **H-5 (`materialmodelle`):** Fließgrenze SVB „τ₀ ≈ 0–60 Pa“ und „rund 10 bis 50 Pa“ an zwei Stellen – verträglich, bei Gelegenheit einheitlich fassen.
