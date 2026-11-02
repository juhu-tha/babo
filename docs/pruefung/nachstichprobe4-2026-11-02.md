# Nachstichprobe 4 (02.11.2026) – 20 bisher nicht nachgeprüfte freigegebene Module

**Stand:** 02.11.2026 (Branch `pruefung/nachstichprobe4-11-02`, Basis origin/main d31cd52a)
**Status:** Bericht zur Kenntnis und Entscheidung – keine Prüfvermerke geändert, keine Quizfrage geändert.
**Auftrag:** Weitere Messung der Fehlerquote an 20 freigegebenen Modulen, die weder in einer der drei Nachstichproben (`nachstichprobe-2026-10-29.md`, `nachpruefung2-2026-10-29.md`, `nachstichprobe3-2026-10-30.md`) noch in der Gegenprüfung (`gegenpruefung-2026-10-30.md`) waren. Prüfumfang (a)–(c) der gezielten Durchsicht, dazu Quizfragen gegen den Modultext und Fließtext gegen die zentralen Konstanten.

## Vorgehen

- **Grundgesamtheit:** Fachmodule mit Status `geprueft` in `src/data/pruefvermerke.ts` (143) ohne die 50 Module der Nachstichproben 1–3 (Tabellen „Gezogene Module“ bzw. „Auswahl“) und ohne die in der Gegenprüfung geprüften Module (`lca_rechner`, `oekobilanz_lca`, `boden_materialaufbereitung`, `bim_baustoffe`, `spannbeton_grundlagen`, `regularien`, `bauschaeden`, `sonderbetone`, `materialmodelle`, `schadstoffe`): **86 Module**.
- **Schichtung:** Fachgebiet nach `fachgebietVon(datei, kontext)` aus `scripts/auditDaten.ts` (FACHGEBIETE, Stand d31cd52a) mit Datei = Komponente laut `src/routing/ModulInhalt.tsx` und Kontext = Bezeichnung, Titel, Kurztext, Norm und Meta-Text aus `src/registry/modules.ts`. Zehn Schichten, davon „Weitere“ mit 40 Modulen (Grundlagen, KI, Baustoffe ohne eigenes Fachgebiet).
- **Aufteilung:** Quote 20 · N_h/86 abgerundet, mindestens 1 je Schicht; die Summe ergibt genau 20 (kein Rest zu verteilen).
- **Ziehung:** Python `random.Random(20261102)`, Schichten alphabetisch, Module je Schicht alphabetisch, `rng.sample`. Skripte `scratchpad/ns4/grundgesamtheit.ts` und `ziehung.py` (Sitzungsablage, nicht im Repository). Hinweis zur Reproduzierbarkeit: In diesem PR wird FACHGEBIETE um die Datei-Alternative `zustandsbewertung` ergänzt (siehe NS4-VDI-1); mit dem neuen Stand fiele `vdi6200` in die Schicht „Prüfverfahren & Bauwerksdiagnostik“. Die Ziehung gilt für den Stand d31cd52a.
- **Prüfung je Modul:** (a) Bezugsgrößen und Einstufungen in Beispielen, (b) Norm-, Teil-, Tabellen- und Ausgabenzuordnungen (Normen-Registry `src/data/centralNormenRegistry.ts`, Stand 10/2026), (c) Kennwerte gegen die zentralen Konstanten (`gwpLehrwerte.ts`, `zementGwp.ts`, `kennwerte.ts`, `holzphysik.ts`, `SCHWINDBEIWERTE`, `CONCRETE`); dazu alle Quizfragen des Moduls gegen den Modultext und der Fließtext. Ergänzungsbogen `docs/pruefung/kennwert-abgleich/<modul>.md` als Prüfauftrag (für `bp_recht_grundlagen`, `rechnung_stahlbeton`, `holzbau_werkstoffe`, `zfp`, `bp_verkehr_pruefung` liegt keiner vor; dort nur eigene Durchsicht).
- **Nachrechnung:** jede Beispielrechnung, jede rechnende Quizfrage und die Standardeingaben der Rechner mit eigenem Skript (`scratchpad/ns4/nachrechnung.py`): **133 Nachrechnungen, davon 124 gegen einen im Modul genannten Wert** – alle im Rundungsrahmen. Regressionstest `tests/nachstichprobe4.test.ts` über 15 Rechenkerne.
- **Zählregel wie in Nachstichprobe 1–3:** ein Modul zählt als fehlerhaft, wenn der Modulinhalt mindestens eine eindeutig falsche fachliche Aussage, Einstufung oder Zuordnung enthält. Fragen und redaktionelle Punkte zählen nicht. Widersprüche zwischen Quiz-Erklärung und Modultext werden getrennt ausgewiesen (neu in diesem Auftrag).
- **Quellen:** vier Websuchen (DIN 4226-101 Ausgabe, DIN 18710-1 Ausgabe, VDI 6200 Tab. 1/3 zweimal); sonst Nachrechnung und Kenntnisstand. Normtexte wurden nicht abgeschrieben.

## Gezogene Module

| Schicht (Umfang, Quote) | gezogen |
|---|---|
| Bauen im Bestand & Aufmaß (4; 0,93 → 1) | `bauwerkserfassung` |
| Bauprodukte (12; 2,79 → 2) | `bp_metallisch`, `bp_recht_grundlagen` |
| Beton & Stahlbeton (12; 2,79 → 2) | `betonpraxis`, `rechnung_stahlbeton` |
| Geotechnik (1; 0,23 → 1) | `bodenmechanik` |
| Holzbau (5; 1,16 → 1) | `holzbau_werkstoffe` |
| Nachhaltigkeit (LCA/LCC) (6; 1,40 → 1) | `lca_ingenieurbau` |
| Prüfverfahren & Bauwerksdiagnostik (1; 0,23 → 1) | `zfp` |
| Stahl & Korrosionsschutz (3; 0,70 → 1) | `korrosionsschutz_beschichtungen` |
| Verkehrswege- & Tunnelbau (2; 0,47 → 1) | `bp_verkehr_pruefung` |
| Weitere (40; 9,30 → 9) | `baustoffkunde`, `formaenderungen`, `gesteine`, `ki_uebungen`, `materialitaet_architektur`, `mechanische_pruefungen`, `ressourcen_umwelt`, `vdi6200`, `wu-bauwerke` |

## Ergebnis

| Modul | Befund | Art | Gewicht | Status |
|---|---|---|---|---|
| `lca_ingenieurbau` | NS4-LI-1 Modul B8 als „Alleinstellungsmerkmal“ der DIN EN 17472, Vergleichstabelle „Hochbau: kein Modul B8“ – DIN EN 15978:2026 kennt B8 (optional); Registry und Quiz (`qn_lca_ingenieurbau_1`, seit 29.10. korrigiert) sagen das bereits | (b) | gering | behoben |
| `vdi6200` | NS4-VDI-1 Prüfintervalle nach VDI 6200 Tab. 3: öffentliche Wiedergaben widersprechen sich (Inspektion CC1, eingehende Überprüfung CC2/CC1) | (Normtext) | – | gekennzeichnet |
| `betonpraxis`, `bauwerkserfassung` | NS4-BP-1, NS4-BWE-1 Schreibfehler („is“, „Kritikpunk“, „Grundrissaufaufteilungen“) | redaktionell | – | behoben |
| `holzbau_werkstoffe`, `bp_metallisch`, `ressourcen_umwelt` | Kennwertfragen NS4-HW-1, NS4-ME-1, NS4-RU-1 | Frage | – | umgesetzt 02.11.2026 |
| `vdi6200`, `betonpraxis`, `rechnung_stahlbeton` | Quiz-Erklärung widerspricht dem Modultext: NS4-VDI-2, NS4-BP-2 (eindeutig), NS4-RS-1 (Rundung) | Quiz | gering | umgesetzt 02.11.2026 (Quiz korrigiert) |
| übrige 15 Module | – | – | – | ohne Befund |

**Fehlerquote (Modulinhalt, Zählregel wie Nachstichprobe 1–3): 1 von 20 Modulen = 5 %** (95-%-Vertrauensbereich nach Wilson **1 % bis 24 %**).
**Einschließlich der beiden eindeutig falschen Quiz-Erklärungen: 3 von 20 = 15 %** (Wilson 5 % bis 36 %).

**Vergleich mit Nachstichprobe 1–3:**

| Stichprobe | Module mit Fachfehler | Quote | Wilson 95 % |
|---|---|---|---|
| Nachstichprobe 1 (29.10.) | 4 von 15 | 27 % | 11 – 52 % |
| Erweiterte Nachprüfung 2 (29.10.) | 5 von 15 | 33 % | 15 – 58 % |
| Nachstichprobe 3 (30.10., nach Durchsicht A–D) | 4 von 20 | 20 % | 8 – 42 % |
| **Nachstichprobe 4 (02.11.)** | **1 von 20** | **5 %** | **1 – 24 %** |
| Nachstichprobe 4 einschließlich Quiz-Erklärungen | 3 von 20 | 15 % | 5 – 36 % |

- Gegenüber Nachstichprobe 1–3 zusammen (13 von 50 = 26 %) ist der Rückgang auf 1 von 20 knapp signifikant (exakter Test nach Fisher, zweiseitig p = 0,054; einseitig „gesunken“ p = 0,042); gegenüber Nachstichprobe 3 allein nicht (zweiseitig p = 0,34). Mit den Quiz-Erklärungen (3 von 20) ist kein Unterschied nachweisbar (zweiseitig p = 0,53 gegen 1–3).
- Bei einer wahren Quote von 20 % träten 1 oder 0 Fehlermodule unter 20 mit 7 % Wahrscheinlichkeit auf, bei 30 % mit 0,8 %, bei 10 % mit 39 %. Die 10-%-Schwelle aus der ersten Nachstichprobe ist mit dem Punktschätzer erreicht, vom Vertrauensbereich aber nicht abgesichert.
- **Einordnung:** Die Stichprobe stammt aus den 86 Modulen, die bisher nur die gezielte Durchsicht (A–D) und keine Nachstichprobe gesehen haben; die Fließtext-Fehler, die Nachstichprobe 3 noch fand (3 von 4 Fehlermodulen), traten hier im Modultext nicht mehr auf. Fehler stecken jetzt eher in Quiz-Erklärungen, die bei Modulkorrekturen nicht mitgezogen wurden (NS4-BP-2, NS4-VDI-2) oder umgekehrt (NS4-LI-1: Quiz korrigiert, Modultext nicht). Vorschlag: bei jeder inhaltlichen Korrektur den Quiz-Pool desselben Moduls nach dem geänderten Begriff durchsuchen (und umgekehrt).
- **Rechenkerne und Beispielrechnungen fehlerfrei:** alle 133 Nachrechnungen stimmen.
- **Gewichtige Fehler (Rechenergebnis oder Nachweisentscheidung falsch): keine.** Kein Anlass für die Rücknahme eines Prüfvermerks.

## Befunde je Modul

### 1. Bauwerkserfassung (`bauwerkserfassung`)
**Nachrechnungen:** Beispiel 1: W = 326 667 mm³, σ_m,d = 12,2, f_m,d = 0,9 · 24/1,3 = 16,6 N/mm², η = 0,74; Beispiel 2: Δσ = 2,8, f_c,0,d = 14,5, λ = 99, λ_rel = 1,68, k_c = 0,31, Gl. (6.23) 1,22 > 1, Gl. (6.19) 0,91; Theorie II. Ordnung mit E_d = E_0,mean/γ_M: N_cr,d = 119 kN, Ausnutzung 1,09 – alle drei Wege führen zur selben Nachweisentscheidung. Quiz `qn_bauwerkserfassung_4`: 0,87 – richtig.
**(a):** k_mod = 0,9 (kurz, NKL 1/2) und C24-Kennwerte aus `kennwerte.ts` richtig zugeordnet. **(b):** DIN EN 1995-1-1 6.1.6, 6.2.4 (6.19), 6.3.2 (6.21/6.23), 5.4.4, 2.4.1; DIN 18202 Tab. 3 Zeile 5/6 (15 bzw. 10 mm bei 4 m); DIN 18710-1:2025-08 (neue Ausgabe bei DIN Media gelistet) – richtig. **(c):** BLK360 G2 680 000 Punkte/s, 4 mm @ 10 m – richtig.
- **behoben – NS4-BWE-1 (redaktionell):** „Kritikpunk“ → „Kritikpunkt“, „Grundrissaufaufteilungen“ → „Grundrissaufteilungen“.

### 2. Bauprodukte metallisch (`bp_metallisch`)
**Nachrechnungen:** Titanzinkbahn G_k = 0,25 kN (25,2 kg), g_k = 0,05 kN/m², ΔL = 22 mm; Quiz Aluminiumtafel 36,45 kg – richtig.
**(b)/(c):** DIN EN 988 (Titanzink), EN 10346 (S220GD–S550GD), DIN EN 10088/1993-1-4 (CRC), EN 1563 (GJS), DIN 17611 (Eloxal 15–25 µm), Zinkabtrag nach ISO 9223 (C1 ≤ 0,1, C4 2,1–4,2 µm/a), Kupfer λ = 380, Titan α = 8,6 · 10⁻⁶/K – richtig.
- **offen – Frage NS4-ME-1 (c):** Aluminium: Kennwertkarte „Leistungswerte nach BauPVO / DIN EN“ zeigt λ = 220 W/(m·K), Text und Praxishinweis nennen 160 W/(m·K) als Bemessungswert nach DIN EN ISO 10456. **Vorschlag:** Karte auf 160 (Bemessungswert Aluminiumlegierungen, ISO 10456) mit Zusatz „Reinaluminium etwa 220 bis 237“.
- Hinweis: Die Spannungsreihe mischt Standardpotentiale (Zn −0,76 V, Fe −0,44 V) mit praktischen Werten (Al −0,5 V); als Lehrmodell gekennzeichnet, kein Befund.

### 3. Bauprodukte: Rechtliche Grundlagen (`bp_recht_grundlagen`)
**(b)/(e):** BauPVO (EU) 2024/3110 (in Kraft 07.01.2025, anwendbar 08.01.2026; Art. 94/95: Übergang hEN, EAD bis 09.01.2031, ETA bis 09.01.2036; Art. 15 Abs. 3 Staffelung der Umweltmerkmale), System 3+ (Anhang IX), EuGH C-100/13 (10/2014), MVV TB statt Bauregellisten seit 2017, abZ/abG, abP, ZiE/vBG, Ü-Zeichen nur im nicht harmonisierten Bereich, MBO §§ 16a–25 – richtig. Quiz (6 Fragen) stimmt mit dem Text. Ohne Befund.

### 4. Betonpraxis (`betonpraxis`)
**Nachrechnungen:** K = (175 − 70)/380 = 0,28; Identitätsprüfung Bohrkerne 26,2 < 0,85 · 31 = 26,35 N/mm²; Luftporen 5 % · 38 = 1,9 N/mm² je Vol.-%; 20 l/m³ Zusatzwasser → rund 7 N/mm²; Rohdichteabweichung 0,02 kg/l ≈ 10 l Luft bzw. 15 l Wasser; c_nom XC4 Ø 20 = 40 mm – richtig.
**(a)/(b):** Konsistenzklassen F1–F6, SF1–SF3; Identitätsprüfung (f_ck + 1 / + 2, f_ck − 4) und Erstherstellung (f_ck + 4); Nachbehandlung aus `DIN1045_3_NACHBEHANDLUNG` (12 °C, mittel: 4 d, XM doppelt); WU-Mindestdicken Tab. 1; Bohrkern-Bezug auf f_ck (Zylinder) – richtig.
- **behoben – NS4-BP-1 (redaktionell):** „… einzuarbeiten, is“ → „ist“.
- **offen – Frage NS4-BP-2 (Quiz `q_bpx_5`):** Erklärung „0,276 ≈ 0,28 – geringes Bluten nach Krells Einteilung“; nach der Einteilung des Moduls (Rechner) liegt 0,276 im Bereich 0,27 < K ≤ 0,31 „normales Zusammenhaltevermögen“, „geringes Bluten“ gilt bis 0,27. Die Antwort (0,28) bleibt richtig. **Vorschlag:** „… = 0,276 ≈ 0,28 – nach der Einteilung des Moduls normales Zusammenhaltevermögen (0,27 < K ≤ 0,31).“
- Hinweis: Schritt 4 der Herleitung nennt „bei k > 0,33 droht signifikante Wasserabsonderung“, der Rechner stuft erst ab 0,34 als „deutliches Bluten“ ein (dazwischen „mäßig“) – kein Widerspruch in der Sache.

### 5. Beispielrechnung Stahlbeton (`rechnung_stahlbeton`)
**Nachrechnungen:** Standardeingabe (160 kNm, C25/30, 30/50 cm, d₁ = 4,5 cm): μ_Ed = 0,182, z = 0,409 m, A_s,erf = 9,00 cm², A_s,min = 1,59 cm²; Quiz: f_cd = 17,0; μ = 0,189; μ = 0,136, z = 0,422 m, A_s = 6,54 cm²; μ = 0,516 > μ_lim; Auslastung 90 % – richtig (Kern `bemesseBiegung`).
**(b):** Spannungsblock 3.1.7(3), ξ_lim = 0,45 (NA DE), A_s,min nach NA 9.2.1.1 – richtig.
- **offen – Frage NS4-RS-1 (Quiz `qn_rechnung_stahlbeton_4`):** nennt μ_lim = 0,296; Modul und Kern: 0,8 · 0,45 · (1 − 0,4 · 0,45) = 0,2952 ≈ 0,295. **Vorschlag:** 0,295 (Rundung, Ergebnis unverändert).

### 6. Bodenmechanik (`bodenmechanik`)
**Nachrechnungen:** I_P = 25 %, I_C = 0,80 (halbfest), A-Linie 18,3 % → TM; w = 35 % → I_C = 0,40; K_a = 0,333, e_a = 33,3 kN/m², E_a = 83,3 kN/m; s_∞ = 40 mm, t₉₀ = 1,70 a (einseitig 6,8 a); Quiz: I_C 0,62/0,60, Mohr-Kreis r = 55 > 52,5 kPa, E_a(35°) = 41,2 kN/m, Einpunktverfahren 41,9 % – richtig.
**(b):** DIN EN ISO 17892-12:2022-08, DIN EN ISO 14688-2 (Bezeichnungen bereits „vorläufig“), DIN 18196:2023-02, DIN 4019:2015-05, DIN 4085:2017-08, DIN 1054:2021-04, Casagrande (10 mm Fallhöhe, 2 Schläge/s, Furche 10 mm, Feinanteil < 0,4 mm) – richtig. Ohne Befund.

### 7. Holzbau: Werkstoffe (`holzbau_werkstoffe`)
**Nachrechnungen:** Quiz Schwinden tangential 5,8 mm, radial 3,0 mm (`SCHWINDBEIWERTE.fichte`); U-Wert Geschossdecke 0,41 W/(m²K) (Tranche 10); Holzrahmenwand mit üblichen λ 0,17 ≈ 0,18 – richtig.
**(b)/(c):** Festigkeitswerte zentral aus `kennwerte.ts` (EN 338:2016, EN 14080), Sortierklassen S10 → C24, S13 → C30, Rechenwert 0,24 %/% (bereits „vorläufig“) – richtig.
- **offen – Frage NS4-HW-1 (a):** Steildach U = 0,14 W/(m²K): mit Sparrenanteil 80/750 = 10,7 % (λ Holz 0,13, flexible Holzfaser 0,038, Unterdeckplatte 0,045, Hanf 0,040, GKF 0,25, R_si = R_se = 0,10) ergibt sich U ≈ 0,16; 0,14 entspricht der Rechnung ohne Sparrenanteil. **Vorschlag:** 0,16 mit Quellkommentar wie bei der Geschossdecke (Lehrbeispiel, nicht klassifiziert).

### 8. LCA im Ingenieurbau (`lca_ingenieurbau`)
**Nachrechnungen:** Simulator-Standard (1500 m², 100 a, DTV-SV 4500): Spannbeton 863 t (5,76 kg/(m²·a)), Stahlverbund 825 t (5,50), B8 184,7 t bzw. 64,6 t mit Schnellbau, Schnellbau 743/687 t, Zyklen bei 80 a 5/2/3, Praxisfaktum 57 t – alle Quizwerte (`qn_lca_ingenieurbau_2` bis `_5`) richtig.
**(b):** DIN EN 17472:2024-06, DIN EN 1990 Kategorie 5, ISO 15686-5, 13 Kernindikatoren nach EN 15804+A2 – richtig.
- **behoben – NS4-LI-1 (b):** „Ein wesentliches Alleinstellungsmerkmal der DIN EN 17472 ist das Modul B8“ und Vergleichstabelle „Hochbau: kein Modul B8“. DIN EN 15978:2026-09 (Registry: ersetzt 2012-10) kennt B8 ebenfalls, dort optional; die Quizfrage `qn_lca_ingenieurbau_1` ist deshalb am 29.10. umgestellt worden, der Modultext nicht. Neu: „Im Hochbau meist nicht erfasst (Modul B8 nach DIN EN 15978:2026 optional)“ und „Ein wesentliches Merkmal … ; DIN EN 15978:2026 kennt B8 inzwischen ebenfalls (optional), im Hochbau spielt es aber kaum eine Rolle“ (`content/lca/IngenieurbauLCA.json`).
- Hinweis außerhalb der Stichprobe: `content/lca/LCA.json` (`oekobilanz_lca`) spricht von einem „eigenen Modul B8“ – bei der nächsten Pflege gleich fassen.

### 9. Zerstörungsfreie Prüfung (`zfp`)
**Nachrechnungen:** Radar d = 100 mm (ε_r = 9, 2 ns), Wenner ρ = 2π · 0,05 · 1000 = 314 Ω·m (mäßig nach RILEM), Torrent-Klassen I–V (SIA 262/1 Anhang E), Karsten 10-cm-Wassersäule ≈ 140 km/h Staudruck, Impakt-Echo β = 0,96 (ASTM C1383) – richtig.
**(b)/(e):** ASTM C876-Grenzen, DIN EN 12504-2/-4, DGZfP B 01/B 02/B 03/B 09/B 14 mit Ausgaben, Charpy-, UCI-, Blower-Door- und Thermografie-Normen, Richtungskorrektur des Rückprallhammers (nach oben abmindern, nach unten erhöhen) – richtig. Ohne Befund.

### 10. Korrosionsschutz durch Beschichtungen (`korrosionsschutz_beschichtungen`)
**Nachrechnungen:** C3: 40,5 bis 121,4 a → VH; C5: 10,1 bis 20,2 a → M; Duplex f = 1,5: 30,2 a → VH, f = 1,2: 24,1 a → H; Quiz: C4 20,2 a, Haftabzug 6,0 MPa – richtig.
**(b)/(c):** DIN EN ISO 1461:2022-12 Tab. 3 (85/70 µm), ISO 9223-Abtragsraten, Schutzdauerklassen L/M/H/VH, 80/20-Regel, Gitterschnitt 1/2/3 mm, Schwimmbad C4 – richtig. Ohne Befund.

### 11. Verkehrswegebau: Prüftechnik (`bp_verkehr_pruefung`)
**Nachrechnungen:** ρ_max 2,418 bzw. 2,495 g/cm³, Hohlraum 3,8 Vol.-%; Rechner-Standard ρ_max = 2,460, V = 2,0 Vol.-% (im Lehrbereich) – richtig. Ohne Befund.
- Hinweis: „gemessene Profiltiefe (Spurrinne in %)“ – im deutschen Spurbildungsversuch (TP Asphalt-StB, Teil 22) wird die Spurrinnentiefe in mm angegeben, die proportionale Tiefe in % ist eine Zusatzgröße der EN 12697-22.

### 12. Baustoffkunde (`baustoffkunde`)
**(e):** Aspdin (Patent Nr. 5022 vom 21.10.1824, Johnson um 1844), Vicat (1818, DIN EN 196-3), Monier (1867; Lambot 1848, Wilkinson 1854), Freytag/Wayss (1884/1885, „Das System Monier“ 1887, Koenen 1886), Ritter 1899/Mörsch 1902, Powers/Brownyard 1946/47 (28 % Gelporen), Pantheon 43,3 m, UNEP 37 %, CUBE 2022, α_T Beton/Stahl (bereits „vorläufig“) – richtig. Ohne Befund.

### 13. Formänderungen (`formaenderungen`)
**Nachrechnungen:** Δl = 12 mm, σ = 13,2 N/mm²; E_c = 34 650, ε_el = 0,29 ‰, ε_cc = 0,58 ‰, ε_ges = 0,87 ‰, 2,6 mm; Biegelinie (Standard 13,1 mm), alle 11 Quizfragen – richtig. **(b):** DIN EN 1992-1-1 3.1.3, 3.1.4 Gl. (3.6), DIN EN 12390-16 – richtig. Ohne Befund.

### 14. Gesteine (`gesteine`)
**Nachrechnungen:** k(B16) = 3,66, Quiz 3,94. **(b):** DIN EN 933-1/-3/-4, 1097-1/-2/-6/-8, 1367-1, 12620 (D ≤ 4 mm, grob d ≥ 2 mm/D ≥ 4 mm), 1936, 13755, DIN 4226-101:2025-11 (neue Ausgabe bei DIN Media gelistet); Sieblinien bereits „vorläufig“ – richtig. Ohne Befund.

### 15. KI-Übungen (`ki_uebungen`)
**Nachrechnungen:** Testfall R_T = 4,95 m²K/W, U = 0,20; Einheitenfehler R_T ≈ 478, U ≈ 0,002; Prüftext: XC4 w/z ≤ 0,60, 320 · 0,55 = 176 kg/m³, C30/37 Zylinder/Würfel – richtig. Ohne Befund.

### 16. Materialität & Architektur (`materialitaet_architektur`)
**Nachrechnungen:** b = 306/2191/13 290 J/(m²K√s), Kontakttemperaturen 30,0/24,1/20,9 °C, Holz rund 9 K wärmer als Stahl – richtig. **(e):** Bauwerks- und Architektenzuordnungen (Therme Vals, Kapelle der Versöhnung, Alnatura Campus, Stellwerk Basel, Tamedia/Mjøstårnet, Pompidou-Metz, Haesley Nine Bridges, Allianz Arena/Eden Project, John Deere HQ), Eloxal C0–C35, DBV/VDZ-Merkblatt Sichtbeton 2015 – richtig. Ohne Befund.

### 17. Mechanische Prüfungen (`mechanische_pruefungen`)
**Nachrechnungen:** Würfel 46,7 N/mm², 78 s; Spaltzug 3,54/3,18 N/mm²; B500B-Auswertung (548/615 N/mm², 1,12, 7,5 %); Quiz (2,83 N/mm², f_m = 23,4 N/mm², B500A) – richtig. Bohrkern-Rechner: h/d = 1 → Würfelwert, Einstufung „≥ C30/37“ aus dem Würfelwert (≥ 37) – richtige Bezugsgröße.
**(b):** DIN EN 12390-3/-5/-6, 12697-22/-23/-34, ISO 6892-1 (Verfahren A), ISO 148-1, ISO 15630-1, DIN 488-1, DIN EN 408 (18 h, a = 6 h, 300 ± 120 s), EN 302-1/301 – richtig. Ohne Befund.

### 18. Ressourcen & Umwelt (`ressourcen_umwelt`, mit Teil NaWaRo)
**Nachrechnungen:** 818 kg CO₂ (KVH 500 kg/m³), 688 kg (BSH 420 kg/m³), Quiz 9,2 t; PENRT 1100 MJ = 306 kWh – richtig (Kern `biogenesCo2DinEn16449`).
**(b)/(c):** DIN EN 16449:2014-06, DIN EN 15804+A2, BSH E 11 500/f_m,k 24, C25/30 E 31 000/f_ctm 2,6 N/mm², DIN 68800-1 bis -4, ETA-17/0247 – richtig.
- **offen – Frage NS4-RU-1 (c):** Emissionstabelle „Konstruktionsvollholz ~ 0,10 – 0,15 kg CO₂-Äq./kg (ohne biogenes CO₂)“; der zentrale Lehrwert `GWP_LEHRWERTE.kvh` setzt 80 kg/m³ bei 500 kg/m³ an, also 0,16 kg/kg. **Vorschlag:** Spanne „~ 0,10 – 0,16“ oder Verweis auf den zentralen Lehrwert. Hinweis: „Portlandzementklinker ~ 0,85“ ist ein Bruttowert je kg Klinker und nicht mit den EPD-Nettowerten in `zementGwp.ts` vergleichbar (richtig, nur nicht kommentiert).

### 19. Zustandsbewertung (`vdi6200`)
**Nachrechnungen:** Prüfplan H 2026/2032, E 2029, B 2027/28/30/31; β = 200/√3400 = 3,43, P_f = 3,0 · 10⁻⁴ < Zielwert 3,8; Notenrechner 3,2 → „nicht ausreichend“ – richtig.
**(b):** DIN 1076:2026-01, VDI 6200:2010-02, VDI 6200 Blatt 1.1:2026-06, RI-EBW-PRÜF-Notenbereiche, DIN EN 1990 Anhang B/C, CC-Beispiele nach VDI 6200 Tab. 1 (Ein- und Mehrfamilienhäuser CC1, Sporthallen/Schulen CC2, Versammlungsstätten > 5000 Personen CC3; bestätigt durch eine öffentliche Wiedergabe) – richtig.
- **gekennzeichnet – NS4-VDI-1 (Normtext):** Prüfintervalle Inspektion und eingehende Überprüfung (Tab. 3). Das Modul (CC1 jeweils „nach Erfordernis“, eingehende Überprüfung CC2 12–15 a) stimmt mit der Wiedergabe eines Ingenieurbüros ([sg-ing.de, VDI 6200](https://www.sg-ing.de/assets/schumacher-gerber_vdi_6200.pdf)) überein; ein kommunaler Begehungsbericht ([zeuthen.de](https://www.zeuthen.de/BegehungsberichtFWMiersdorf01-pdf-659151.pdf)) nennt für CC1 Inspektion 6–9 a und eingehende Überprüfung 15–20 a, für CC2 9–15 a. Kennzeichnung „Intervalle vorläufig, Normprüfung ausstehend“ an beiden Zeilen (`content/zustandsbewertung/Zustandsbewertung.json`); damit die neue Fundstelle ein Fachgebiet hat, ist in `scripts/auditDaten.ts` die Datei-Alternative `zustandsbewertung` an „Prüfverfahren & Bauwerksdiagnostik“ angehängt (keine bestehende Zuordnung verschoben).
- **offen – Frage NS4-VDI-2 (Quiz `q_vdi_1`):** Erklärung „Hallen mit großen Stützweiten (CC3) müssen … durch sachkundige Prüfingenieure untersucht werden“ widerspricht dem Modul: CC3 sind Versammlungsstätten für mehr als 5000 Personen, Stadien, Kongresshallen; Sporthallen und Industriebauten stehen in CC2; die eingehende Überprüfung macht eine „besonders fachkundige Person“. Die Antwort bleibt richtig. **Vorschlag:** „… Bauwerke werden nach Schadensfolge (CC1 bis CC3, z. B. CC3 für Versammlungsstätten mit mehr als 5000 Personen) eingestuft; je höher die Klasse, desto kürzer die Intervalle von Begehung, Inspektion und eingehender Überprüfung durch eine besonders fachkundige Person.“

### 20. WU-Bauwerke (`wu-bauwerke`)
**Nachrechnungen:** I = 10 → w_k ≤ 0,20 mm, h = 300 ≥ 240 mm; Quiz I = 15 → 0,15 mm – richtig (Kern `wuNachweis`).
**(b):** WU-Richtlinie 2017-12 Tab. 1 (BK 1 Wand 240, Bodenplatte 250, Fertigteil 200; BK 2 200/150/100, Elementwand 240 mit Kern ≥ 120 mm), w/z 0,55/0,60, DIN 18197:2018-01, DIN 18533-1:2026-06, DIN EN 1504-5 (bereits „vorläufig“), DAfStb-Heft 555 – richtig. Ohne Befund.

## Behobene Punkte (dieser PR)

| Kennung | Modul | Datei | Änderung |
|---|---|---|---|
| NS4-LI-1 | `lca_ingenieurbau` | `content/lca/IngenieurbauLCA.json` | B8 nicht mehr als Alleinstellungsmerkmal; Hochbau-Spalte: B8 nach DIN EN 15978:2026 optional |
| NS4-VDI-1 | `vdi6200` | `content/zustandsbewertung/Zustandsbewertung.json`, `scripts/auditDaten.ts` | Prüfintervalle VDI 6200 Tab. 3 als „vorläufig, Normprüfung ausstehend“ gekennzeichnet (Normtext); FACHGEBIETE-Alternative angehängt |
| NS4-BP-1 | `betonpraxis` | `content/betonpraxis/Betonpraxis.json` | „ist“ statt „is“ (redaktionell) |
| NS4-BWE-1 | `bauwerkserfassung` | `content/bauwerkserfassung/Bauwerkserfassung.json` | zwei Schreibfehler (redaktionell) |

Regressionstest: `tests/nachstichprobe4.test.ts` (Nachrechnungen über die Kerne `biegelinie`, `spaltzugfestigkeit`, `zugversuchStahl`, `holzSchaetzung`, `bohrkernPruefung`, `biogenesCo2DinEn16449`, `zustandsnote`, `wuNachweis`, `verformterDruckstab`, `zustandsgrenzen`, `erddruckRankine`, `konsolidierung`, `mohrCoulomb`, `wenner`, `zinkSchutzdauer`, `asphaltHohlraum`, `blechMasse`, `bemesseBiegung` und Absicherung der Korrekturen). Keine Quizfrage durch die Korrekturen falsch geworden, kein Prüfvermerk geändert.

## Offene Fragen mit Vorschlag

| Kennung | Modul | Frage | Vorschlag |
|---|---|---|---|
| NS4-VDI-2 | `vdi6200` | Quiz `q_vdi_1`: Erklärung ordnet „Hallen mit großen Stützweiten“ CC3 zu | Erklärung nach Modultext fassen (Wortlaut oben) |
| NS4-BP-2 | `betonpraxis` | Quiz `q_bpx_5`: K = 0,276 als „geringes Bluten“, Modul: „normal“ | Erklärung nach der Einteilung des Moduls (Wortlaut oben) |
| NS4-RS-1 | `rechnung_stahlbeton` | Quiz `qn_rechnung_stahlbeton_4`: μ_lim 0,296 statt 0,295 | 0,295 |
| NS4-HW-1 | `holzbau_werkstoffe` | Steildach-Lehrbeispiel U = 0,14 ohne Sparrenanteil | 0,16 mit Quellkommentar |
| NS4-ME-1 | `bp_metallisch` | Aluminium λ 220 (Karte) gegen 160 (Text, ISO 10456) | Karte 160, Zusatz Reinaluminium |
| NS4-RU-1 | `ressourcen_umwelt` | KVH 0,10–0,15 kg/kg gegen zentral 0,16 | Spanne bis 0,16 oder Verweis auf `GWP_LEHRWERTE.kvh` |
| NS4-VDI-1 | `vdi6200` | (Normtext) Prüfintervalle VDI 6200 Tab. 3 | Abgleich mit dem Richtlinientext; bis dahin gekennzeichnet |

## Umsetzung 02.11.2026

Entscheidung vom 02.11.2026: alle Vorschläge übernommen. Zusätzlich: Kalksandstein-Lehrwert 0,13 bestätigt (unverändert); BIM-Modul Holz-Voreinstellung 480 kg/m³. Regressionstest: `tests/umsetzungNs4_20261102.test.ts`; Prüflisten mit `scripts/pruefliste.ts` neu erzeugt. Prüfvermerke nicht geändert. Offen bleibt nur NS4-VDI-1 (Normtext).

| Kennung | Modul | gewählte Fassung | Quelle | Status |
|---|---|---|---|---|
| NS4-VDI-2 | `vdi6200` | Quiz `q_vdi_1`: Erklärung nach Modultext (CC3 z. B. Versammlungsstätten für mehr als 5000 Personen; eingehende Überprüfung durch eine besonders fachkundige Person); Lernhilfe: Sporthallen und Industriebauten CC2, Intervalle je Schadensfolgeklasse statt „1, 3 und 6 Jahre“ (das sind DIN-1076-Fristen); Bloom-Stufe, Niveau und Rückmeldungen ergänzt | Modultext Zustandsbewertung (VDI 6200) | umgesetzt, Frage `verified: false` |
| NS4-BP-2 | `betonpraxis` | Quiz `q_bpx_5`: „0,276 ≈ 0,28 – nach der Einteilung des Moduls normales Zusammenhaltevermögen (0,27 < K ≤ 0,31)“; Antwort unverändert | Krell (2022), Einteilung im Modul | umgesetzt, `verified: false` |
| NS4-RS-1 | `rechnung_stahlbeton` | Quiz `qn_rechnung_stahlbeton_4`: μ_lim = 0,295 in Frage und Erklärung; Ergebnis unverändert | 0,8 · 0,45 · (1 − 0,4 · 0,45) = 0,2952 (Modul und Kern) | umgesetzt, `verified: false` |
| NS4-HW-1 | `holzbau_werkstoffe` | Steildach-Lehrbeispiel U = 0,16 W/(m²K) mit Quellkommentar wie bei der Geschossdecke (Lehrbeispiel, nicht klassifiziert). Nachrechnung nach DIN EN ISO 6946 mit Sparrenanteil 10,7 %: R′ = 6,57, R″ = 6,22, R_T = 6,40 m²K/W → U = 0,156 (ohne Sparren 0,137). Keine Folgewerte oder Quizfragen betroffen | `src/modules/holzbaubeta/daten.ts` | umgesetzt |
| NS4-ME-1 | `bp_metallisch` | Kennwertkarte Aluminium λ = 160 W/(mK) aus `LAMBDA_ALUMINIUM` (DIN EN ISO 10456, Umsetzung 30.10.), Zusatz „Bemessungswert für Aluminiumlegierungen nach DIN EN ISO 10456; Reinaluminium etwa 220–237 W/(m·K)“; keine Quizfrage betroffen | `src/data/kennwerte.ts` | umgesetzt |
| NS4-RU-1 | `ressourcen_umwelt` | Emissionstabelle KVH „~ 0,10 – 0,16“, obere Grenze gelesen aus `gwpJeKg('kvh').fossil` (`GWP_LEHRWERTE.kvh`: 80 kg/m³ bei 500 kg/m³); keine Quizfrage betroffen | `src/data/gwpLehrwerte.ts` | umgesetzt |
| BIM | `bim_baustoffe` | Holz-Voreinstellung Rohdichte 480 statt 450 kg/m³, gelesen aus `GWP_LEHRWERTE.bsh.rohdichte`; GWP-Voreinstellung −680 unverändert und auf dem Regler (`gwpRegler.ts`), IFC-Ausgabe (MassDensity) übernimmt die Voreinstellung | DIN EN 16449, BSH-Lehrwert 480 kg/m³ | umgesetzt |
| KS-Lehrwert | – | Kalksandstein 0,13 bleibt (bestätigt) | – | unverändert |
