# Modulprüfung Tranche 16 – Module ohne Prüfvermerk (Befundliste zur Freigabe)

**Stand:** 02.11.2026 (Branch `pruefung/tranche-16-11-02`, Basis origin/main d31cd52a)
**Status:** Entscheidungen vom 02.11.2026 umgesetzt; alle 16 Module freigegeben (Abschnitt „Freigabe 02.11.2026“).

> Mit dieser Befundliste wurden **keine** Prüfvermerke gesetzt und `src/data/pruefvermerke.ts` nicht geändert (tests/tranche16.test.ts prüft, dass die Module dieser Tranche ohne Eintrag bleiben). Quizfragen wurden nicht geändert: Keine Frage ist durch die Korrekturen falsch geworden.

## Vorgehen

- **Ermittlung:** Alle 310 Einträge von `MODUL_BY_ID` (`src/registry/modules.ts`, auch inaktive) gegen die Schlüssel von `PRUEFVERMERKE`. Ohne Eintrag sind **117 Module**. Alle Fachmodule (`istFachmodul`) haben einen Eintrag (Pflicht nach tests/pruefvermerke.test.ts); ohne Eintrag sind nur Seiten außerhalb dieser Definition (Typ `info`, ohne Typ, ohne Menügruppe oder in Gruppen ohne Fachinhalt).
- **Auswahl:** 16 Module mit eigenem Fachinhalt, die noch in keiner Tranche als eigener Abschnitt geprüft wurden (unter 25, daher kein Rest für Tranche 17). Reihenfolge: zuerst die drei Rechner, dann Checklisten, KI-Seiten, Modulinfos.
- **Ausgeschlossen (101 Module, Begründung je Gruppe):**

  | Gruppe | Anzahl | Module | Begründung |
  |---|---|---|---|
  | Allgemein | 9 | `start`, `admin`, `anleitung`, `modulstruktur`, `feedback`, `versionen`, `impressum`, `datenschutz`, `barrierefreiheit` | Menügruppe in `OHNE_PRUEFVERMERK` (kein Fachinhalt: Navigation, Verwaltung, Rechtstexte) |
  | Trennzeilen | 12 | `divider_*` | Menü-Zwischenüberschriften ohne Inhalt und ohne Route |
  | Infos & Quellen, Kuriositäten, Studium THA, Weiter@THA, Thesen & Projekte, Vorlesungen | 23 | `software`, `glossar`, `fortbildungen`, `informationsquellen`, `literatur`, `kuriositaeten`, `studium_tha`, `weiter_tha`, `weiter_bauing`, `weiter_pm`, `weiter_ausbau`, `weiter_fassade`, `weiter_holzbau`, `weiter_ttz`, `ttz_weiterbildung`, `weiter_mapr`, `thesen_projekte`, `forschung_transfer`, `vl_bauen_im_bestand`, `vl_nachhaltiges_bauen`, `vl_bauschaeden`, `vl_baustoffkunde`, `vl_instandhaltung` | Menügruppen in `OHNE_PRUEFVERMERK` (Info-, Studien- und Lehrveranstaltungsbereiche; Entscheidung bei Einführung der Prüfvermerke) |
  | Übungsaufgaben | 19 | `aufgaben_*` (16 im Menü, darunter `aufgaben_trainer` vom Typ Rechner), `aufgaben`, `aufgaben_klausur`, `aufgaben_stahl` | Gruppe in `OHNE_PRUEFVERMERK`; Aufgaben und Quizfragen haben einen eigenen Prüfweg (Quiz-Zweitprüfung, `verified`/`vorpruefung` in `src/data/quiz.json`) |
  | Lehrveranstaltungen | 8 | `lehrveranstaltungen`, `lv_*` | absichtlich abgeschaltet (`INAKTIVE_GRUPPEN`, Entscheidung 27.10.2026: Lernpfade nach Lehrveranstaltung aus) |
  | Direktlink-Ansichten geprüfter Module | 16 | `spannung`, `biegebemessung`, `querkraftbemessung`, `stuetzenbemessung`, `durchstanzen`, `verankerungslaenge`, `rissbreite` (→ `stahlbeton_bemessung`, Tranche 1/2); `instandsetzung_holz`, `_metalle`, `_kunststoffe`, `_asphalt`, `_mauerwerk` (→ `instandsetzung_materialien`, Tranche 13); `faserverbund` (→ `kombinationen`, Tranche 6); `bp_rechtliches` (→ `bp_recht_*`, Tranche 7); `bp_verkehrswegebau` (→ `bp_verkehr_*`, Tranche 7); `ki_baustoffe` (→ `ki_*`-Reiter, Tranche 14; `ki_ueberblick`/`ki_onlinekurse` hier) | gleiche Komponente mit anderem Startreiter (`src/routing/ModulInhalt.tsx`), Inhalt mit dem Hauptmodul geprüft; Prüfvermerk über das Hauptmodul |
  | bereits als Abschnitt geprüft | 14 | `bauprodukte_info`, `bp_baustoffindustrie` (T7); `beton_info`, `stahlbeton_info` (T9); `holzbau_info`, `mechanik_info` (T10); `bauphysik_info`, `nachhaltigkeit_info`, `zertifizierung_siegel` (T11); `bestand_info`, `bestand_checklisten`, `rueckbau_info`, `rueckbau_checklisten`, `dauerhaftigkeit_info` (T12) | in `docs/pruefung/module-tranche-<n>.md` mit Empfehlung; dort „ohne Eintrag, kein Fachmodul im Sinne der Prüfvermerke“ |

  Hinweis: Die 50 Fachmodule mit Status `offen` haben einen Eintrag und sind alle in Tranche 1–15 geprüft (sie warten auf Normtextpunkte oder Klärungen); sie gehören nicht zu dieser Tranche.

- **Prüfumfang je Modul** (Aufbau wie Tranche 15): Kennwerte gegen zentrale Konstanten und Ergänzungsbogen `docs/pruefung/kennwert-abgleich/<bericht>.md`, Norm-/Ausgabenzuordnung (Stand 10/2026), Beispiele nachgerechnet, Rechner mit Grenzfällen, Quiz gegen Text, Lernziele/Kurzfassung, Firmen/Partner/Förderer/Projekte (keines der Module ist ein AP-6.2-Modul).
- **Nachrechnung:** Eigenes Python-Skript (eigene Umsetzung der Gleichungen); 79 Prüfaufrufe (94 Prüfungen mit der Schleife „kein Prüfvermerk“) in `tests/tranche16.test.ts` (Toleranz 0,5 %).
- **Rechenkerne:** Zwang und Eigenspannungen rechneten inline in den Komponenten. Beide rechnen jetzt über neue Kerne (`src/calc/zwang.ts`, `src/calc/eigenspannungen.ts`) mit Plausibilitätsprüfung; Ergebnisse unverändert (Vorgabe Zwang 15,00 N/mm², Eigenspannungen +2,75/−1,38 N/mm²).
- **Einschränkung:** WebSearch-Kontingent knapp; gesucht wurde zu drei Quellenangaben (DAfStb-Heft 466, Heft 555, WTA). Aussagen ohne öffentliche Quelle sind als Kenntnisstand markiert oder als Frage geführt; Normtexte wurden nicht abgeschrieben.

## Übersicht

| Nr. | Modul | Rechnung | Empfehlung |
|---|---|---|---|
| 1 | `kriechen` | Kern `kriechenSchwinden.ts` (Bausteine T1/T2 geprüft) | freigabereif (T16-KS-1/-2 behoben) |
| 2 | `zwang` | jetzt Kern `zwang.ts` | freigabereif nach Klärung T16-ZW-3 (Quellenangabe Heft 555) |
| 3 | `eigenspannungen` | jetzt Kern `eigenspannungen.ts` | freigabereif (T16-ES-1 behoben) |
| 4 | `nachhaltigkeit_checklisten` | – | freigabereif nach Klärung T16-NC-2 (R-Beton-Anteil, M.-%/Vol.-%) und T11-ZS-2 (QNG-Steckbrief, F) |
| 5 | `dauerhaftigkeit_checklisten` | Beispiele | freigabereif nach Klärung T16-DC-2 (Normtext DIN 1045-2, Tab. F.2.1/F.2.2, im Modul gekennzeichnet) |
| 6 | `schaeden_checklisten` | Beispiele | freigabereif |
| 7 | `instandsetzung_checklisten` | Beispiele | freigabereif nach Klärung T16-IC-2 (CFK-Untergrund, Kürzel BÜV) |
| 8 | `ki_ueberblick` | Beispiele | freigabereif nach Klärung T16-KU-2 (unbelegte Nutzenzahlen) |
| 9 | `ki_onlinekurse` | – | freigabereif nach Klärung T16-KO-2 (Kursangabe KI-Campus) |
| 10 | `grundlagen_info` | – | freigabereif (T16-MI-1 behoben) |
| 11 | `labor_info` | – | freigabereif |
| 12 | `baustoffe_info` | – | freigabereif |
| 13 | `schaeden_info` | – | freigabereif nach Klärung T16-MI-2 (Gründungsjahr WTA) |
| 14 | `instandsetzung_info` | – | freigabereif (T16-MI-4 behoben) |
| 15 | `digitales_info` | – | freigabereif nach Klärung T16-MI-5 (Datenbank „MAWEG“) |
| 16 | `praxiswissen_info` | – | freigabereif |

**Für alle 16 gilt (Frage T16-ALL-1):** Keines der Module ist ein Fachmodul im Sinne von `istFachmodul` (Typ `info` oder ohne Menügruppe/Typ). `pruefvermerkFuer()` liefert für sie keinen Vermerk; eine Freigabe kann daher – wie in Tranche 7, 11 und 12 – nur in dieser Befundliste dokumentiert werden, nicht als Vermerk in der App.

**Behobene Fehler (dieser PR):**
- **T16-ES-1 (Grenzfall):** Eigenspannungen beschrifteten die größte Zugspannung immer als „Rand“ und warnten vor „Oberflächenrissen“. Ist der Kern kühler als die Ränder (Abkühlphase, Regler erlauben T_Mitte < T_Rand), liegt der Zug im Kern (Beispiel 20/10/20 °C: +0,50 N/mm² im Kern, −1,00 N/mm² am Rand). Beschriftung jetzt je Lage; Kern `eigenspannungsVerlauf()` meldet `zugLage` und eine Warnung.
- **T16-KS-1:** Rechnergrenzen beschrieben das Stützenbeispiel mit ε_tot = σ_c/E_cm·(1 + φ) + ε_cs; Kern und Modul rechnen seit Runde 5 den Kriechanteil mit E_c = 1,05·E_cm (EC2 3.1.4(3)). Text angeglichen.
- **T16-ZW-1/-2:** „Ungerrissen“, „Temperaturabfluss“; DAfStb-Heft 466 als „Bemessungshilfen zu Eurocode 2“ bezeichnet – richtig „Grundlagen und Bemessungshilfen für die Rißbreitenbeschränkung im Stahlbeton und Spannbeton“ (10/1996, Hintergrund zu DIN 1045, EC 2 und Model Code 90; [DIN Media, Heft 466](https://dinmedia.de/en/publication/heft-466-dafstb/3721089)).
- **T16-NC-1:** Vier Prüfpunkte der Nachhaltigkeits-Checkliste enthielten doppelte bzw. ineinandergeschobene Satzteile („… hergestellt werden? hergestellt werden?“, „… vorgegeben?) vorgegeben?“, „… (EBV, seit 01.08.2023) gemäß der Ersatzbaustoffverordnung (EBV, seit 01.08.2023) …“, „… statt nasser Putze. anstelle nasser Putze).“); „0.05 ppm“; R-Beton „nach DAfStb-Richtlinie“ → DIN 1045-2:2023-08, Anhang E (ersetzt die Richtlinie, wie T15-PR-1).
- **T16-DC-1:** Checkliste Dauerhaftigkeit kennzeichnete Normpunkte (w/z, Mindestzement, LP) als „Gesetzlich verpflichtend“ → „Pflichtpunkt (Norm)“ (wie „Pflichtpunkt“ in der Bestands-Checkliste); Normen gelten über die Technischen Baubestimmungen, nicht als Gesetz.
- **T16-IC-1:** „Nass-in-Nass-Auftrag … (vor Filmverfilmung)“ → „(vor dem Antrocknen der Haftbrücke)“.
- **T16-KU-1/-3:** „RAG-Systeme lösen das Problem der Halluzination“ widersprach Quiz `q_ki_ub_4` („schließt Fehler nicht aus“) und dem eigenen Reiter „Stand heute“ → „verringern“. „Eine KI haftet nicht nach BGB/HOAI … bauvorlageberechtigter Ingenieur“ → Standsicherheitsnachweis durch nachweisberechtigte Person nach Landesbauordnung (z. B. Art. 62a BayBO); Bauvorlageberechtigung ist ein anderer Begriff.
- **T16-KO-1:** „100 % Deutsch“ (mehrere Kurse sind englisch, Kopf sagt „überwiegend deutschsprachig“); Lernpfad-Empfehlungen nannten nach dem Linkwechsel noch die alten YouTube-Kanäle; „Kopiere …“ neben „Sie“; „Vergabeunterlagen nach HOAI“ (Vergabe nach VOB/A); „Lokale KI ist die einzige datenschutzkonforme Lösung“ (widerspricht „Lokale LLMs oder Enterprise-Lizenzen“ im KI-Überblick); KI-Campus als „offiziell akkreditierte Plattform der Bundesregierung“ mit „höchster akademischer Qualität … ECTS-Bescheinigung“ → vom BMFTR geförderte Lernplattform, Anerkennung entscheidet die Hochschule; Starter-Skript „Labor-Messdaten“ → „Fiktive Beispieldaten“.
- **T16-MI-1/-3/-4:** Historie Grundlagen: „Planungsingenieure bilanzieren Bestandsreserven rechtlich belastbar“ mit Eurocodes der 2. Generation – nicht bauaufsichtlich eingeführt (Stand 10/2026, wie `normen_ausblick`). Historie Schäden: „beweissichere, unstrittige Schadensursachenzuordnung“ (Beweiswürdigung beim Gericht, wie der eigene Grundsatz „§ 286 ZPO“). Historie Instandsetzung: SPCC als „Reaktionsharze“ (SPCC = gespritzter PCC; Reaktionsharzmörtel = PC), „denselben Ausdehnungskoeffizienten … müssen“ → verträglich; „SKP und SIVV gesetzlich gefordert“ → bauaufsichtlich über TR Instandhaltung/MVV TB; Grammatik „baustoffspezifischen“.
- **Neu:** Rechnergrenzen und je drei Erkundungsaufträge für `zwang` und `eigenspannungen` (vorher kein Haftungshinweis auf den Direktlink-Seiten), Werte nachgerechnet.

---

## 1. Kriechen & Schwinden (`kriechen`)

**Prüfumfang:** `src/modules/KriechenSchwinden.tsx` (Reiter Beton, Spannstahl, Rheologie & Säulenverformung), Kern `src/calc/kriechenSchwinden.ts`, `content/kriechenschwinden/KriechenSchwinden.json`, Grenzen, Erkundungsaufträge, Quiz `kriechen_schwinden` (6). Die Seite ist Direktlink und eingebettet in `hydratation_folgen` (Tranche 3 hatte Kriechen/Schwinden ausdrücklich nicht im Detail geprüft).

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Modul (Kern) |
|---|---|---|---|
| KS1 | C30/37, RH 50 %, h₀ 200 mm, t₀ 28 d, N | φ_RH 1,778 (B.3b, α₁ 0,944, α₂ 0,984); β(f_cm) 2,725; β(t₀) 0,4885; **φ₀ 2,366**; β_H 540 d | identisch; Beispiel „≈ 2,37“ richtig |
| KS2 | wie KS1 | ε_cd,0 482,2 µm/m (B.11, β_RH 1,356); k_h 0,85; ε_ca,∞ 50; **ε_cs,∞ 459,9 µm/m** | identisch („460“) |
| KS3 | wie KS1, t = 10 000 d, t_s 7 d | φ 2,329; ε_cd 405,3 µm/m; E_c,eff 9863 N/mm² | identisch |
| KS4 | Stütze σ_c 8,5 N/mm², L 3 m, 50 a | ΔL = 3,884 mm (E_cm 32 837, Kriechanteil mit 1,05·E_cm) | identisch |
| KS5 | Ergebnishinweis | ε_el·(1 + φ₀/1,05) + ε_cs,∞ = 0,259·3,254 + 0,460 = **1,30 ‰**, Faktor 5,03 | richtig („≈ 1,3 ‰, rund das Fünffache“) |
| KS6 | Relaxation (Gl. 3.28–3.30) | Kl. 2, μ 0,7: 0,964 % (1000 h), 3,90 % (500 000 h); Kl. 1, μ 0,75: 21,0 %; Kl. 3, μ 0,6, 100 000 h: 3,83 % | identisch |
| KS7 | Erkundung RH 80 %; t₀ 7 d | φ 1,698, ε_cd 226 µm/m, E_c,eff 12 170; φ 3,026 | Auflösungen richtig |

**Kennwerte/Ergänzungsbogen** (`hydratation_folgen.md`, enthält `content/kriechenschwinden/*`): keine Abweichung von zentralen Konstanten; Normverweis DIN EN 1992-1-1:2011-01 + A1:2015-03 mit NA:2013-04 ist die bauaufsichtlich eingeführte Ausgabe (begründet). Kein fest verdrahteter Faktor im Modul (Rechnung im Kern).

**Normstand:** EC2 3.1.4, Anhang B, 3.3.2 (eingeführte Ausgabe); Beiwerte k₁/k₂, ρ₁₀₀₀ = 8/2,5/4 % nach 3.3.2(6); Relaxationsklassen (Draht/Litze normal bzw. niedrig, warmgewalzte Stäbe) richtig. Linearitätsgrenze 8,5/0,45 = 18,9 N/mm² („bei f_ck < 19 MPa nicht erfüllt“) richtig. Text zu fünf Schwindarten und Le-Chatelier-Kontraktion (≈ 25 % des gebundenen Wassers, als Größenordnung) nach Kenntnisstand richtig.

**Befunde**
- **behoben – T16-KS-1:** Grenzentext Stützenbeispiel (siehe oben).
- **behoben – T16-KS-2:** Achsbeschriftung „Modul R (MPa)“ → „E-Modul E_c,eff (MPa)“.
- Hinweis: Relaxation für μ ≤ 0,5 als 0 angesetzt (Lehrannahme, in Grenzen und Hinweisen genannt); EC2-Rechenwerte ρ₁₀₀₀ statt Zulassungswerten wie T2.

**Grenzfälle:** f_ck < 12 bzw. > 90, RH < 40 %, h₀ < 100/> 1500 mm, t₀ < 1 d → Warnungen des Kerns (tests/kriechenSchwinden.test.ts); μ ≤ 0,5 und > 0,8 → Warnung.

**Quiz gegen Text:** `q_ksx_1` (β(28) 0,49, β(7) 0,63), `_2` bis `_6` mit Modultext und Kern stimmig.

**Lernziele/Kurzfassung:** auf der Direktlink-Seite keine (im Hauptmodul `hydratation_folgen` vorhanden); siehe T16-ALL-2.

**Empfehlung:** freigabereif.

## 2. Zwangspannungen (`zwang`)

**Prüfumfang:** `src/modules/Zwang.tsx` (Direktlink; eingebettet im Reiter Praxisbeispiele von `hydratation_folgen`), `content/zwang/Zwang.json`, Quiz `zwang` (6).

**Nachrechnungen:** Vorgabe 20 K, 0,3 ‰, 30 000 N/mm², R 100 %: ε_frei 0,50 ‰, σ_z 15,00 N/mm² > 3,0 → gerissen; R 50 % 7,50; Erkundung E_c,eff 10 000 → 5,00; ohne Schwinden 6,00 N/mm² – Modul (jetzt Kern) identisch, vorher inline gleiche Werte.

**Grenzfälle (Kern):** R = 0 → 0 (Quiz `qn_zwang_2`); σ_z = f_ct → „gerissen“ (Vergleich ≥); E ≤ 0, f_ct ≤ 0, R außerhalb 0–100 % → Fehler; Erwärmung/Quellen (negative Werte) → Warnung (Lehrmodell bewertet nur Zug). Eingaben sind durch die Regler begrenzt.

**Kennwerte:** α_T = 10·10⁻⁶ 1/K wie EC2 3.1.3(5) (jetzt Konstante `ALPHA_T_BETON`).

**Befunde**
- **behoben – T16-ZW-1:** Schreibfehler „Ungerrissen“, „Temperaturabfluss ΔT“.
- **behoben – T16-ZW-2:** Titel DAfStb-Heft 466 (siehe oben); Hinweis: Heft 466 (1996) bezieht sich auf DIN 1045 und ENV-EC 2, nicht auf die eingeführte EC2-Ausgabe.
- **offen – Frage T16-ZW-3:** „DAfStb Heft 555: Erläuterungen zur DAfStb-Richtlinie Massige Bauteile aus Beton“ – nach Kenntnisstand enthält Heft 555 die Erläuterungen zur **WU-Richtlinie**; öffentlich nicht bestätigt. Vorschlag: am DAfStb-Verzeichnis prüfen und korrigieren oder die Angabe streichen (die Richtlinie Massige Bauteile, Ausgabe April 2010, ist im Modul Eigenspannungen genannt).
- Hinweis: Wendehorst Baustoffkunde 27. Aufl. 2011 als Literatur (veraltet, wie in T15 angemerkt).

**Quiz gegen Text:** `qn_zwang_1` 3,0, `_5` 4,5 N/mm² nachgerechnet; `_2`, `_3`, `_4`, `_6` stimmig.

**Lernziele/Kurzfassung:** keine (Direktlink-Seite), T16-ALL-2. **Neu:** Rechnergrenzen und drei Erkundungsaufträge.

**Empfehlung:** freigabereif nach Klärung T16-ZW-3.

## 3. Eigenspannungen (`eigenspannungen`)

**Prüfumfang:** `src/modules/Eigenspannungen.tsx` (Direktlink; eingebettet in `hydratation_folgen`), `content/eigenspannungen/Eigenspannungen.json`, Quiz `eigenspannungen` (6).

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Modul (Kern) |
|---|---|---|---|
| ES1 | 20/45/15 °C, E 15 000, d 1 m (Beispiel) | ΔT_par 27,5 K; T_V,Rand −18,33 K; **σ_V,Rand +2,75**, Kern −1,375 N/mm²; T_N 35,83 °C; σ_N −2,375 | identisch |
| ES2 | 20/40/20 °C (Quiz `q_esx_4`) | 2/3·20·0,15 = 2,00 N/mm² Zug | identisch |
| ES3 | nur Schwinden 0,3 ‰ | Rand +3,00, Kern −1,50 N/mm² | identisch |
| ES4 | Kern kühler 20/10/20 °C | Kern **+0,50**, Rand −1,00 N/mm² | identisch (Beschriftung jetzt „Kern“, T16-ES-1) |
| ES5 | 30/60/10 °C, E 10 000, d 2 m, ε_cs 0,2 ‰ | +4,00 / −2,00 N/mm² | identisch |
| ES6 | Erkundung T_Mitte 35/32 °C; d 2 m; ε_cs 0,2 ‰ | 1,75/1,45; 2,75 (unabhängig von d); 4,75/−2,375 | Auflösungen richtig |

Gleichgewicht N = 0, M = 0 numerisch erfüllt (Test). Herleitung (Parabel durch drei Punkte, T_N = a·d²/12 + c, T_M = b·x) geprüft.

**Kennwerte/Ergänzungsbogen** (`hydratation_folgen.md`): EC2-Ausgabe 2011-01 begründet; DAfStb-Richtlinie Massige Bauteile aus Beton, Ausgabe April 2010 – richtig (Liste DAfStb-Richtlinien, [BTU-Bibliothek, Übersicht](https://www-docs.b-tu.de/bibliothek/public/suchen/dafstb.pdf)); WU-Richtlinie 2017-12 richtig (Kenntnisstand). Faustwert ΔT ≤ 20 K als Lehrannahme gekennzeichnet.

**Befunde**
- **behoben – T16-ES-1:** Lage der Zugeigenspannung (siehe oben), Kern mit Test.
- Hinweis: Rechner zeigt die Kern-Warnung nur über die Beschriftung; f_ctm(t) und E_c,eff werden vorgegeben (Grenzen ergänzt).

**Quiz gegen Text:** `q_esx_1` bis `_6` stimmig (`_6` „das Bild kehrt sich um“ entspricht ES4).

**Lernziele/Kurzfassung:** keine (Direktlink-Seite), T16-ALL-2. **Neu:** Rechnergrenzen, drei Erkundungsaufträge.

**Empfehlung:** freigabereif.

## 4. Nachhaltigkeits-Checklisten (`nachhaltigkeit_checklisten`)

**Prüfumfang:** `src/modules/NachhaltigkeitChecklisten.tsx`, `content/nachhaltigkeitchecklisten/NachhaltigkeitChecklisten.json` (Ergänzungsbogen: Datei in `_gemeinsam.md`, keine Fundstelle). Kein Quiz.

**Fakten-Stichprobe:** GModG (in Kraft 29.07.2026, vormals GEG), EBV seit 01.08.2023, Materialklassen RC-1 bis RC-3, halbierter E1-Wert 0,05 ppm (ChemVerbotsV mit DIN EN 16516), EH 40 (H′_T ≤ 55 % Referenz), CEM III/B bis rund 60 % weniger GWP als CEM I (wie `ZEMENT_GWP_KG`: 0,26/0,665 → −61 %), MCI nach Ellen MacArthur Foundation, DIN EN ISO 20887 – nach Kenntnisstand richtig.

**Befunde**
- **behoben – T16-NC-1:** zerbrochene Sätze, Dezimalpunkt, R-Beton-Regelwerk (siehe oben).
- **offen – Frage T16-NC-2:** „mindestens 25 M.-% Gesteinskörnung-Substitut durch Rezyklate“ – DIN 1045-2, Anhang E regelt die Anteile in **Vol.-%** (Höchstanteile vorläufig, T9-GL-1a). Vorschlag: „mindestens 25 Vol.-% rezyklierte Gesteinskörnung (Projektziel; Höchstanteile nach DIN 1045-2, Anhang E)“.
- **offen (übernommen) – T11-ZS-2:** „QNG-Steckbrief 313“, Qualitätsstufen und Anlagen am QNG-Handbuch prüfen (F-Stelle wie in `zertifizierung_siegel`).
- **Frage T16-NC-3 (Registry):** Als einzige Checkliste ohne Menügruppe (nur Modulübersicht und Direktlink). Vorschlag: `gruppe: 'Nachhaltigkeit'` wie die übrigen Checklisten.
- Hinweis: „VDI 6205 / Rückbaubarkeit“ – Zuordnung der Richtlinie nicht bestätigt (Rückbau: VDI 6210); bei T16-NC-2 mitprüfen.

**Empfehlung:** freigabereif nach Klärung T16-NC-2 und T11-ZS-2.

## 5. Dauerhaftigkeits-Checklisten (`dauerhaftigkeit_checklisten`)

**Nachrechnungen:** Maßgebende Anforderungen XC4 (0,60/C25/30/280), XD1 (0,55/C30/37/300), XF2 mit LP (0,55/C25/30/300) → w/z ≤ 0,55, C30/37, z ≥ 300 kg/m³ – richtig; c_min,dur XD1 40 mm, c_nom 55 mm; 5-%-Quantil 47 − 1,645·4,5 = 39,6 mm < 40 – richtig.

**Fakten-Stichprobe:** w/z 0,45 (XD3/XS3), 0,50 (XF4 mit LP), Δc_dev 10–15 mm, Tab. 7.1DE (0,4 mm X0/XC1, 0,3 mm XC2–XC4, XD, XS), DIN EN 12350-7 (Druckausgleich), c_nom-Formel nach 4.4.1.2 – richtig.

**Ergänzungsbogen:** Normverweise DIN 1045-2:2023-08, DIN EN 206:2021-06, DIN EN 1992-1-1:2011-01 (eingeführte Ausgaben, begründet).

**Befunde**
- **behoben – T16-DC-1:** „Gesetzlich verpflichtend“ → „Pflichtpunkt (Norm)“.
- **offen – T16-DC-2 (Normtext):** Grenzwerte nach DIN 1045-2:2023-08, Tab. F.2.1/F.2.2 sind im Modul bereits mit „am Normtext der Ausgabe 2023-08 prüfen“ gekennzeichnet (vorläufig, Normprüfung ausstehend).

**Quiz gegen Text:** `q_dc_1` bis `_6` stimmig (`q_dc_3` 39,6 mm nachgerechnet).

**Empfehlung:** freigabereif nach Klärung T16-DC-2 (Normtext).

## 6. Schadensaufnahme-Checklisten (`schaeden_checklisten`)

**Nachrechnungen:** Rissrate 0,06/0,5 = 0,12 mm/a; Darrfeuchte (85,0 − 80,2)/80,2 = 5,99 ≈ 6,0 M.-%, Durchfeuchtungsgrad 40 % – richtig.

**Fakten-Stichprobe:** § 650g BGB, §§ 485 ff. ZPO, Art. 54 BayBO/§ 58 MBO, RÜV (BMVBS 2008, nur Bundesbauten), ARGEBAU-Hinweise 09/2006, DIN 1076:2026-01, Trocknung salzhaltiger Proben bei 40 °C (WTA 4-11), Chlorid-Orientierung 0,5 M.-% v. z., nur ruhende Risse kraftschlüssig verpressen – richtig (Kenntnisstand bzw. wie T12/T13).

**Befunde:** keine. Hinweis: „Bei Baujahr vor 1993 Asbest …“ – Stichtag 31.10.1993 (Quiz `q_ms_sc_6` nennt ihn); DGZfP-Merkblätter B 03 (2025)/B 06 nicht am Original geprüft.

**Quiz gegen Text:** `q_ms_sc_1` bis `_6` stimmig.

**Empfehlung:** freigabereif.

## 7. Instandsetzungs-Checklisten (`instandsetzung_checklisten`)

**Nachrechnungen:** Taupunkt nach Magnus (15 °C, 80 %): γ = 0,801, θ_d = 11,6 °C; 13 < 14,6 °C → nicht beschichten; Abreißfestigkeit Mittel 1,64 ≥ 1,5, kleinster 1,2 ≥ 1,0 N/mm² – richtig.

**Fakten-Stichprobe:** SKP nach TR Instandhaltung, Sa 2½ (DIN EN ISO 8501-1), Rissfüllstoffe F/D/S (DIN EN 1504-5), Packerabstand ≈ h/2 mit 45°, Durchgangswiderstand < 1 Ω und 100-mV-Kriterium (DIN EN ISO 12696), 3-K-Taupunktabstand und RH ≤ 85 % (DIN EN ISO 12944-7), 80/20-Regel, R11/V4 nach DIN 51130 – nach Kenntnisstand richtig.

**Befunde**
- **behoben – T16-IC-1:** „Filmverfilmung“.
- **offen – Frage T16-IC-2:** (a) CFK-Lamellen: „Mittelwert f_ctm ≥ 1,5 N/mm²; kein Einzelwert < 1,2 N/mm²“ – nach Kenntnisstand nennt die DAfStb-Richtlinie Verstärken mit geklebter Bewehrung 1,0 N/mm² als kleinsten Einzelwert; (b) „Bundesgütegemeinschaft Instandsetzung von Betonbauwerken e.V. (BÜV)“ – Kürzel nicht bestätigt (Kenntnisstand: BÜV = Bau-Überwachungsverein). Vorschlag: beide am Original prüfen, bis dahin „(vorläufig, Normprüfung ausstehend)“.
- Hinweis: „Haftzug … mindestens 80 % Betonbruch im Grundkörper“, „f_h ≥ 3,0 MPa“ (Injektion) nicht am Normtext geprüft.

**Quiz gegen Text:** `q_is_cl_1` bis `_6` stimmig.

**Empfehlung:** freigabereif nach Klärung T16-IC-2.

## 8. KI im Bauwesen – Überblick & Grundlagen (`ki_ueberblick`)

**Prüfumfang:** `src/modules/ki/KiUeberblick.tsx` mit Reitern (`content/ki/KiUeberblick.json`, `content/ki/ueberblick/*.json`), Quiz `ki_ueberblick` (6), Kurzfassung (vorhanden). Ergänzungsbogen `ki_baustoffe.md`: Lehrwert Strommix 0,36 kg CO₂/kWh betrifft `ki_ressourcen` (freigegeben), Normverweise der RAG-Beispiele mit Kennzeichnung.

**Nachrechnungen:** Konfusionsmatrix P 0,90, R 0,75, F1 0,818, Genauigkeit 0,90; Bildauflösung 0,30 mm/px, erforderlich 0,10 mm/px, B_max 400 mm – richtig.

**Befunde**
- **behoben – T16-KU-1, T16-KU-3** (siehe oben).
- **offen – Frage T16-KU-2:** Unbelegte Zahlen und Zusagen im Reiter „Stand heute“ („bis zu 40 % CO₂-Einsparung“, „80 % Zeitersparnis bei der Risskartierung“, „sagen … präzise vorher“) und „Ausblick“ („in Millisekunden auf dem Tablet“, „mikrosekundengenau“, „fehlerfreier Freiform-Betondruck“). Vorschlag: Zahlen streichen oder mit Quelle als Fallbeispiel kennzeichnen; Ausblick als Erwartung formulieren („könnte“, „Ziel ist“).
- Hinweis: KI-VO mit Verordnung (EU) 2026/1744 (Digital Omnibus) wie in `ki_recht_ethik` zitiert; nicht erneut geprüft.

**Quiz gegen Text:** `q_ki_ub_1` bis `_6` stimmig; `_4` passt jetzt auch zum Historientext.

**Empfehlung:** freigabereif nach Klärung T16-KU-2.

## 9. KI im Bauwesen – Onlinekurse (`ki_onlinekurse`)

**Prüfumfang:** `src/modules/ki/KiOnlinekurse.tsx`, `content/ki/KiOnlinekurse.json`, Quiz `ki_onlinekurse` (6). Links nach `docs/linkcheck/2026-10.md` bereits auf offizielle Dokumentationen umgestellt (YouTube-Suchlinks ersetzt).

**Nachrechnungen:** Quiz: Gradientenschritt 2,0 − 0,1·2,0 = 1,8; 5 − 0,25·4 = 4,0; 24·1,5/6 = 6 Wochen; 20·1,5/30 = 1,0 ECTS – richtig.

**Befunde**
- **behoben – T16-KO-1** (siehe oben).
- **offen – Frage T16-KO-2:** KI-Campus-Kursangabe „Dr. med. KI / KI für Natur- und Ingenieurwissenschaften“ – „Dr. med. KI“ ist nach Kenntnisstand ein Medizinkurs; Vorschlag: einen konkreten technischen Kurs der Plattform nennen oder nur auf die Plattform verweisen.
- Hinweis Quiz `q_ki_ok_4`: Die KMK-Strukturvorgaben nennen 25–30 Stunden je Leistungspunkt; die Frage gibt 30 h vor und bleibt richtig (nicht geändert).

**Empfehlung:** freigabereif nach Klärung T16-KO-2.

## 10.–16. Modulinfos (`grundlagen_info`, `labor_info`, `baustoffe_info`, `schaeden_info`, `instandsetzung_info`, `digitales_info`, `praxiswissen_info`)

**Prüfumfang:** `src/modules/ModuleInfo.tsx` mit `content/moduleinfo/daten.json`, `ressourcen.json` und `src/data/moduleHistoryData.ts`, je Gruppe Karten, Untermodule (Normen, Anwendungsfälle), Regelwerke, Formeln, Historie. Ergänzungsbogen `bauphysik_info.md` (alle Modulinfos): keine Fundstelle in diesen sieben Gruppen.

**Fakten-Stichprobe (Auswahl, je Gruppe ≥ 5):**
- Grundlagen: Meterkonvention 1875, SI 11. CGPM 1960, globaler Sicherheitsbeiwert 1,75–2,1 (DIN 1045 alt), Gl. 6.10 (EN 1990), BauPVO 2024/3110 – richtig. Hooke 1678 mit „σ = E·ε“ (die Form mit E-Modul geht auf Young 1807 zurück; Hinweis).
- Labor: Bauschinger/Martens, Schmidt-Hammer 1948, DIN EN 206-1 (2001) mit Konformitätskriterien, f_ck = f_m − 1,64·s mit k_n-Hinweis, DIN 19698-1, ISO 5725-1, DIN EN ISO 7500-1 – richtig.
- Baustoffe: Pantheon 43,3 m, Aspdin Patent 5022 (1824), Floatglas Pilkington, DIN 18945–18948, DIN EN 17140 (VIP), VDI 2014 (Faserverbund), S235 bis S960 – richtig.
- Schäden: Tay-Brücke 1879, Kongresshalle 1980, DIN 1076 seit 1930 (Ausgabe 2026-01), DIN 1946-6 (2009-05, 2019-12), BGB-Bauvertragsrecht 01.01.2018, § 634a BGB – richtig.
- Instandsetzung: 11 Prinzipien DIN EN 1504-9, Rili-SIB 1990/2001, TR Instandhaltung (Teil 1 Mai 2020), Abreißfestigkeit 1,5/1,0 N/mm², De-Sitter-Regel (1984), DIN EN ISO 12696 – richtig.
- Digitales: IFC 1997, ISO 16739-1:2024 (IFC 4.3), DIN EN ISO 19650-1/-2:2019-08, BMVI-Stufenplan 2015, ESPR 2024/1781, MCI-Formel – richtig.
- Praxiswissen: Reichsverdingungsausschuss 1921/VOB 1926, Umbenennung 2002, BaustellV 1998 (RL 92/57/EWG), §§ 650a ff. BGB, HOAI 2021, VOB/A 2019, VOB/B 2016 – richtig.

**Befunde**
- **behoben – T16-MI-1** (Grundlagen, Eurocodes 2. Generation), **T16-MI-3** (Schäden, „unstrittige“ Zuordnung), **T16-MI-4** (Instandsetzung, SPCC/„gesetzlich“/Grammatik).
- **offen – Frage T16-MI-2 (Schäden):** „1976 Gründung der WTA“ – öffentlich nicht bestätigt (Kenntnisstand eher 1977). Vorschlag: am WTA-Selbstverständnis prüfen, bis dahin „1970er Jahre“.
- **offen – Frage T16-MI-5 (Digitales):** Materialdatenbank „MAWEG“ unbekannt (Tippfehler?). Vorschlag: streichen oder richtigstellen.
- Hinweis (Baustoffe): „Wassereinwirkungsklasse W2.1-E“ – die App nennt den Begriff 21-mal, „Wasserbeanspruchungsklasse“ 22-mal (DIN 18533-1:2017 bzw. 2026-06, vgl. T15 `px_planung`); app-weit vereinheitlichen.
- Firmen-/Produktnamen (Autodesk, Nemetschek, Madaster, Capmo, PlanRadar) in Digitales/Praxiswissen: keine AP-6.2-Module, daher zulässig.

**Empfehlung:** `grundlagen_info`, `labor_info`, `baustoffe_info`, `instandsetzung_info`, `praxiswissen_info` freigabereif; `schaeden_info` nach Klärung T16-MI-2; `digitales_info` nach Klärung T16-MI-5.

---

## Offene Fragen zur Entscheidung (Zusammenfassung)

| Nr. | Modul | Frage | Vorschlag |
|---|---|---|---|
| T16-ALL-1 | alle 16 | Kein Fachmodul i. S. von `istFachmodul` → kein Prüfvermerk in der App möglich | Freigabe wie T7/T11/T12 nur in dieser Befundliste dokumentieren; für `kriechen`, `zwang`, `eigenspannungen` gilt der Vermerk von `hydratation_folgen` (eingebettet) |
| T16-ALL-2 | `kriechen`, `zwang`, `eigenspannungen` | Direktlink-Seiten ohne Lernziele/Kurzfassung | Lernziele und Kurzfassung des Hauptmoduls `hydratation_folgen` genügen; eigene nur, wenn die Seiten ins Menü kommen |
| T16-ZW-3 | `zwang` | DAfStb-Heft 555 als Erläuterung zur Richtlinie Massige Bauteile? | am DAfStb-Verzeichnis prüfen; korrigieren oder streichen |
| T16-NC-2 | `nachhaltigkeit_checklisten` | R-Beton „mindestens 25 M.-%“ | „mindestens 25 Vol.-% (Projektziel; Höchstanteile nach DIN 1045-2, Anhang E)“ |
| T16-NC-3 | `nachhaltigkeit_checklisten` | Checkliste ohne Menügruppe | `gruppe: 'Nachhaltigkeit'` ergänzen |
| T16-DC-2 | `dauerhaftigkeit_checklisten` | Grenzwerte DIN 1045-2, Tab. F.2.1/F.2.2 (Normtext) | am Normtext prüfen (im Modul gekennzeichnet) |
| T16-IC-2 | `instandsetzung_checklisten` | CFK-Untergrund Einzelwert 1,2 vs. 1,0 N/mm²; Kürzel BÜV | am Original prüfen; bis dahin „vorläufig, Normprüfung ausstehend“ |
| T16-KU-2 | `ki_ueberblick` | unbelegte Nutzenzahlen (40 %, 80 %) und absolute Ausblickaussagen | Zahlen streichen oder mit Quelle; Ausblick als Erwartung formulieren |
| T16-KO-2 | `ki_onlinekurse` | Kursangabe „Dr. med. KI“ beim KI-Campus | konkreten technischen Kurs nennen oder nur Plattform |
| T16-MI-2 | `schaeden_info` | Gründungsjahr WTA 1976 | prüfen; bis dahin „1970er Jahre“ |
| T16-MI-5 | `digitales_info` | Datenbank „MAWEG“ | streichen oder richtigstellen |
| (T11-ZS-2) | `nachhaltigkeit_checklisten` | QNG-Steckbrief 313 (F) | am QNG-Handbuch prüfen |

## Hinweis Quiz

- Keine Frage geändert. Geprüft und stimmig: `q_ksx_1`–`_6`, `qn_zwang_1`–`_6`, `q_esx_1`–`_6`, `q_dc_1`–`_6`, `q_ms_sc_1`–`_6`, `q_is_cl_1`–`_6`, `q_ki_ub_1`–`_6`, `q_ki_ok_1`–`_6` (48 Fragen). Hinweis `q_ki_ok_4` (KMK 25–30 h) siehe Abschnitt 9.

## Rest für Tranche 17

Keiner aus der Menge „ohne Eintrag“: Nach Abzug der begründeten Ausschlüsse bleiben genau die 16 Module dieser Tranche. Als Vorschlag für eine spätere Runde: `aufgaben_trainer` (Typ Rechner in der Gruppe Übungsaufgaben, bisher nur über die Quizprüfung erfasst).

## Nachweis der Prüfung

- Eigenes Python-Skript (eigene Umsetzung von EC2 Anhang B/3.1.4/3.3.2, Zwang, Zerlegung T_N/T_M/T_V mit Schwindparabel, Quantil, Magnus, Darrfeuchte, Konfusionsmatrix); 94 Prüfungen als `tests/tranche16.test.ts`.
- QA (lokal): `npx tsc --noEmit`, `npm test` (alle Tests, inkl. `erkundung`, `rechnerGrenzen`, `zahlformatTausender`, `pruefvermerke`), `check:formeln` (4501 Formeln, 0 fehlerhaft), `check:zahlen`, `check-design`, `check-verwaist --strict`, `check-any`, Build, `check-bundle`; `a11y-reiter` (desk, mob, desk-dunkel) auf `zwang`, `eigenspannungen`, `kriechen`, `nachhaltigkeit_checklisten`, `dauerhaftigkeit_checklisten`, `instandsetzung_checklisten`, `ki_ueberblick`, `ki_onlinekurse`, `grundlagen_info`, `instandsetzung_info`: 105 Reiter-Prüfungen, 0 Verstöße; Sichtprüfung Zwang/Eigenspannungen (Grenzfall Kern) ohne Konsolenfehler.
- Öffentliche Quellen: [DIN Media, DAfStb-Heft 466](https://dinmedia.de/en/publication/heft-466-dafstb/3721089); [BTU Cottbus-Senftenberg, Übersicht DAfStb-Richtlinien](https://www-docs.b-tu.de/bibliothek/public/suchen/dafstb.pdf).

---

## Umsetzung 02.11.2026

Entscheidung Prof. Huber vom 02.11.2026: „alle Vorschläge übernehmen“. Umgesetzt im Branch `umsetzung/tranche16-11-02` (nach #293); Prüfungen in `tests/umsetzungT16_20261102.test.ts`.

| Kennung | Modul | gewählte Fassung | Quelle | Status |
|---|---|---|---|---|
| T16-ZW-3 | `zwang` | Angabe „DAfStb Heft 555: Erläuterungen zur DAfStb-Richtlinie Massige Bauteile aus Beton“ gestrichen; ersetzt durch „DAfStb-Richtlinie Massige Bauteile aus Beton (Ausgabe April 2010)“. Ein Erläuterungsheft zu dieser Richtlinie ist im Verzeichnis nicht nachgewiesen; Heft 555 gehört nach Kenntnisstand zur WU-Richtlinie (so auch `content/wubauwerke/WUBauwerke.json`). | [BTU Cottbus-Senftenberg, Übersicht DAfStb-Richtlinien](https://www-docs.b-tu.de/bibliothek/public/suchen/dafstb.pdf) (Richtlinie „Apr 10“, kein Erläuterungsheft genannt) | erledigt |
| T16-NC-2 | `nachhaltigkeit_checklisten` | „mit 25 Vol.-% rezyklierter Gesteinskörnung (Projektziel; DIN 1045-2, Anhang E rechnet in Vol.-%)“ statt „mindestens 25 M.-% Gesteinskörnung-Substitut“; Höchstanteile bleiben „vorläufig, Normprüfung ausstehend“ | Entscheidung; DIN 1045-2:2023-08, Anhang E (wie T9-GL-1a) | erledigt |
| T16-NC-3 | `nachhaltigkeit_checklisten` | `gruppe: 'Nachhaltigkeit'` in `src/registry/modules.ts` (letzter Eintrag der Gruppe, wie die übrigen Checklisten); Typ bleibt `info`, daher weiterhin kein Fachmodul | Entscheidung | erledigt |
| (T11-ZS-2) | `nachhaltigkeit_checklisten` | „QNG-Steckbrief 313“ wie in `zertifizierung_siegel` (Umsetzung 29.10.) durch „QNG-Anhangdokument 3.1.3 „Schadstoffvermeidung in Baumaterialien““ ersetzt; die Zuordnung der Produktpositionen (vorher „Anhang 1/3“) als „vorläufig, Normprüfung ausstehend“ gekennzeichnet | docs/pruefung/module-tranche-11.md, Umsetzung 29.10.2026 | gekennzeichnet |
| T16-DC-2 | `dauerhaftigkeit_checklisten` | Beispiel 1: „Grenzwerte für w/z, Festigkeitsklasse und Zementgehalt nach DIN 1045-2:2023-08, Tab. F.2.1/F.2.2 (vorläufig, Normprüfung ausstehend); c_min,dur nach DIN EN 1992-1-1/NA, Tab. 4.4DE“ (vorher „am Normtext der Ausgabe 2023-08 prüfen“; c_min,dur steht nicht in DIN 1045-2) | Normtext | gekennzeichnet |
| T16-IC-2 | `instandsetzung_checklisten` | CFK-Untergrund: „kein Einzelwert < 1,2 N/mm² (kleinster Einzelwert vorläufig, Normprüfung ausstehend)“; Weblink: „Bundesgütegemeinschaft Instandsetzung von Betonbauwerken e.V. (Kürzel „BÜV“ vorläufig, Normprüfung ausstehend)“; in `scripts/auditDaten.ts` dem Fachgebiet Beton & Stahlbeton zugeordnet (Alternativen `Betonbauwerk`, `f_ctm` angehängt) | Normtext/Original | gekennzeichnet |
| T16-KU-2 | `ki_ueberblick` | Reiter „Stand heute“: „bis zu 40 % CO₂-Einsparung“, „80 % Zeitersparnis“, „präzise vorher“, „drastisch“, „Einsturzprävention“ gestrichen bzw. ohne Zahl formuliert. Reiter „Ausblick“: „Erwarteter Effekt“, „könnte“, „Ziel sind“ statt „laufen künftig in Millisekunden auf dem Tablet“, „mikrosekundengenau“, „fehlerfrei“. Ebenso die Nutzenzeilen im Reiter Kernbegriffe (Vergleich klassisch/KI: „70–80 %“, „15 %“, „70 %“, „80 %“, „90 %“, „Faktor 10/20“, „0 unbemerkte Ausführungsfehler“) – dort „Erwartung: …“ ohne Zahl | keine belastbare Quelle für die Zahlen; Entscheidung | erledigt |
| T16-KO-2 | `ki_onlinekurse` | „Dr. med. KI / …“ ersetzt durch „Elements of AI“ (Universität Helsinki und Reaktor; Einstieg in maschinelles Lernen und neuronale Netze, rund 50 Stunden); Schlüssel `kursElementsOfAi` | [KI-Campus, Kursseite Elements of AI](https://ki-campus.org/en/learning-opportunities/courses/elements-ai) (50 h, Beginner, ML-Typen, neuronale Netze) | erledigt |
| T16-MI-2 | `schaeden_info` | Historie: „1970er Jahre“ statt „1976“. Öffentlich nur mittelbar belegt (Forenbeitrag von 2001 zum „25-jährigen Bestehen“), nicht eindeutig | [bau.de-Forum, „25 Jahre WTA“](https://bau.de/forum/sonst/10615.php); [Baunetz Wissen, WTA](https://www.baunetzwissen.de/bauen-im-bestand/tipps/beratungsstellen/wissenschaftlich-technische-arbeitsgemeinschaft-fuer-bauwerkserhaltung-und-denkmalpflege-148730) (ohne Jahr) | erledigt |
| T16-MI-5 | `digitales_info` | „MAWEG“ gestrichen („ÖKOBAUDAT und WECOBIS“) | – (keine Datenbank dieses Namens nachweisbar) | erledigt |
| T16-ALL-1/-2 | alle 16 | wie vorgeschlagen: kein Prüfvermerk in der App (keine Fachmodule; `src/data/pruefvermerke.ts` unverändert); für `kriechen`, `zwang`, `eigenspannungen` genügen Lernziele/Kurzfassung des Hauptmoduls `hydratation_folgen` | Entscheidung | erledigt |
| Begriff | app-weit | Normbegriff je Norm: **DIN 18533 → „Wasserbeanspruchungsklasse“** (Ausgabe 2026-06; „Wassereinwirkungsklasse“ nur als Begriff der Ausgabe 2017-07), DIN 18534/18535 behalten „Wassereinwirkungsklasse“ (W-I/W-B), WU-Richtlinie behält „Beanspruchungsklasse“. Geändert: `baustoffe_info` (W2.1-E), Text zum WTA-Merkblatt 4-6 (Ausgabe 2017-07 genannt), Lernziel `px_planung`, RAG-Demonstrator (Beispielfrage; das Fundstück aus der Ausgabe 2017-07 bleibt), Quiz `q_bab_1` und `qn_bp_abdichtung_1` (nur Felder `topic`/`gapAnalysis`; `verified` bleibt, Vermerk „Begriff angeglichen 02.11.“). Neue Regel in `tests/begriffe.test.ts` und `docs/begriffe.md` | [DIN Media, DIN 18533-1:2026-06](https://www.dinmedia.de/de/norm/din-18533-1/399850897): „die ehemaligen Wassereinwirkungsklassen in Wasserbeanspruchungsklassen umbenannt“; docs/fachklaerung-2026-10-26.md | erledigt (Richtung siehe Hinweis) |

**Hinweis zur Begriffsrichtung:** Die Vorgabe nannte „Wassereinwirkungsklasse (Begriff der DIN 18533)“. Nach dem Änderungsvermerk von DIN Media heißt der Begriff in der geltenden Ausgabe 2026-06 „Wasserbeanspruchungsklasse“; die Fachklärung vom 26.10.2026 hatte die App bereits so umgestellt. Umgesetzt wurde daher die Regel „Normbegriff der jeweiligen Norm“: Rest-Fundstellen mit dem alten Begriff wurden auf „Wasserbeanspruchungsklasse“ angeglichen, nicht umgekehrt.

**Weitere Hinweise (nicht geändert):** `content/sonderbetone/Sonderbetone.json` nennt „DAfStb Heft 555“ als Quelle für ΔT_Kern-Rand ≤ 15–20 K (anderes, bereits geprüftes Modul; Zuordnung wie bei T16-ZW-3 fraglich). „VDI 6205 / Rückbaubarkeit“ in der Nachhaltigkeits-Checkliste weiterhin nicht bestätigt (Kenntnisstand: Rückbau VDI 6210).

**Nachtrag 02.11.2026 (umgesetzt):** beide Hinweise nach Entscheidung umgesetzt – `sonderbetone`: Quelle „DAfStb-Richtlinie Massige Bauteile aus Beton (Ausgabe April 2010)“ wie T16-ZW-3; `nachhaltigkeit_checklisten`: „VDI 6210 / Rückbaubarkeit“. Einzelheiten und Quelle in `docs/pruefung/quiz-text-abgleich-2026-11-02.md`, Abschnitt „Umsetzung 02.11.2026“.

## Normtext offen

Nur am Normtext bzw. Original zu klären; im Modul mit „vorläufig, Normprüfung ausstehend“ gekennzeichnet (F-Freigabe-Liste im Admin-Bereich):

| Kennung | Modul | Fundstelle | zu prüfen |
|---|---|---|---|
| T16-DC-2 | `dauerhaftigkeit_checklisten` | Beispiel 1 (`dieBetondeckungRichtetSich`) | Grenzwerte w/z, Festigkeitsklasse, Zementgehalt in DIN 1045-2:2023-08, Tab. F.2.1/F.2.2 |
| T16-IC-2 | `instandsetzung_checklisten` | CFK-Lamellen (`mittelwertFCtm1`); Weblink BÜV | kleinster Einzelwert 1,2 oder 1,0 N/mm² (DAfStb-Richtlinie Verstärken mit geklebter Bewehrung bzw. Zulassung); Kürzel der Bundesgütegemeinschaft |
| T11-ZS-2 | `nachhaltigkeit_checklisten` | QNG-Verweise (`qngSteckbrief313*`) | Zuordnung der Produktpositionen im QNG-Anhangdokument 3.1.3 |

## Freigabe 02.11.2026

Entscheidung vom 02.11.2026: „alle Vorschläge übernehmen“. Die Module sind keine Fachmodule im Sinne von `istFachmodul` (T16-ALL-1); die Freigabe ist daher nur hier dokumentiert, `src/data/pruefvermerke.ts` bleibt unverändert. Normtextpunkte (T16-DC-2, T16-IC-2, T11-ZS-2) gelten als erledigt, weil sie gekennzeichnet sind (Abschnitt „Normtext offen“).

Freigegeben:

- `kriechen` – Fachlich geprüft am 02.11.2026 (T16-KS-1/-2 behoben, #293)
- `eigenspannungen` – Fachlich geprüft am 02.11.2026 (T16-ES-1 behoben, #293)
- `schaeden_checklisten` – Fachlich geprüft am 02.11.2026 (ohne Befund)
- `grundlagen_info` – Fachlich geprüft am 02.11.2026 (T16-MI-1 behoben, #293)
- `labor_info` – Fachlich geprüft am 02.11.2026 (ohne Befund)
- `baustoffe_info` – Fachlich geprüft am 02.11.2026 (Begriff angeglichen)
- `instandsetzung_info` – Fachlich geprüft am 02.11.2026 (T16-MI-4 behoben, #293)
- `praxiswissen_info` – Fachlich geprüft am 02.11.2026 (ohne Befund)
- `zwang` – Fachlich geprüft am 02.11.2026 (T16-ZW-3 umgesetzt)
- `nachhaltigkeit_checklisten` – Fachlich geprüft am 02.11.2026 (T16-NC-2/-3 umgesetzt, T11-ZS-2 gekennzeichnet)
- `dauerhaftigkeit_checklisten` – Fachlich geprüft am 02.11.2026 (T16-DC-2 gekennzeichnet)
- `instandsetzung_checklisten` – Fachlich geprüft am 02.11.2026 (T16-IC-2 gekennzeichnet)
- `ki_ueberblick` – Fachlich geprüft am 02.11.2026 (T16-KU-2 umgesetzt)
- `ki_onlinekurse` – Fachlich geprüft am 02.11.2026 (T16-KO-2 umgesetzt)
- `schaeden_info` – Fachlich geprüft am 02.11.2026 (T16-MI-2 umgesetzt)
- `digitales_info` – Fachlich geprüft am 02.11.2026 (T16-MI-5 umgesetzt)

Nicht freigegeben: keines.
