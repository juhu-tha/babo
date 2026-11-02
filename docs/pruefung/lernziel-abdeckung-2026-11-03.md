# Lernziel-Abdeckung der Fachmodule (03.11.2026)

Auftrag: Didaktische Konsistenz über alle Fachmodule prüfen. Je Modul werden fünf Dinge abgeglichen: Lernziele (Bloom-Stufe, Formulierung), Inhalt, Quiz, „Das Wichtigste“ und Ausprobieren-Aufträge. Eindeutige Lücken werden geschlossen, der Rest wird mit einer Ratsche festgehalten.

## Vorgehen

1. **Prüfskript** `scripts/qa/lernziel-abdeckung.mjs` (Aufruf `node scripts/qa/lernziel-abdeckung.mjs [--modul <id>] [--json <datei>] [--liste]`). Es liest den Modultext aus Komponente und Importkette, wie `scripts/qa/kennwert-abgleich.mjs` ihn zuordnet (Modul-TSX und `content/<modul>/*.json`).
   - **Inhalt:** Fachbegriffe des Lernziels (ab 5 Buchstaben, Formelzeichen, Kürzel) im Modultext. Als Fundstelle gilt der Abschnitt mit den meisten Treffern. Unter 50 % gefundener Begriffe heißt das Ziel „ohne Fundstelle“.
   - **Quiz:** Jede Frage der Route (Unterreiter ohne eigene Lernziele zählen zum Stammmodul) wird den Lernzielen mit der größten Begriffsüberdeckung zugeordnet: mindestens 2 Begriffe, höchstens 1 unter dem Größtwert. Dazu kommt die gesichtete Zuordnung `ZUORDNUNG_MANUELL`. „Passende Stufe“ heißt: gleiche oder höhere Bloom-Stufe, höchstens eine Stufe darunter.
   - **Höchste Stufe:** Mindestens eine Frage des Moduls liegt auf der höchsten Lernzielstufe.
   - **Das Wichtigste:** Zahlenwerte und Begriffe jedes Punkts im Modultext oder im Quiz.
   - **Ausprobieren:** In „…“ genannte Bedienelemente kommen im Modultext vor, und jeder Auftrag bezieht sich auf ein Lernziel (Begriffsüberdeckung oder gesichtet, `ERKUNDUNG_BEZUG_GESICHTET`).
2. **Sichtung** aller Treffer von Hand. Ergebnis:
   - 113 Zuordnungen Frage → Lernziel (davon 7 für neue Fragen), die der Stichwortabgleich übersieht, z. B. bei Komposita und Synonymen. Sie stehen mit Kommentar in `ZUORDNUNG_MANUELL`.
   - 4 Inhaltsfundstellen und 16 Auftragsbezüge, ebenfalls gesichtet.
   - Fehlbefunde: 2 Module (`bauchemie`, `instandhaltung`) fehlten in der Modulzuordnung, weil `React.lazy(() => import('…').then(…))` nicht erkannt wurde. Das ist jetzt in `scripts/qa/kennwert-abgleich.mjs` behoben. Damit erfassen auch der Kennwert- und der Quiz-Text-Abgleich diese beiden Module.
3. **Ratsche** `tests/lernzielAbdeckung.test.ts`. Sie prüft:
   - Jedes Lernziel hat mindestens eine Quizfrage.
   - Die Fragen erreichen die höchste Lernzielstufe des Moduls.
   - Jedes Lernziel hat eine Inhaltsfundstelle.
   - „Das Wichtigste“ enthält keine Zahl ohne Fundstelle.
   - Kein Ausprobieren-Auftrag nennt ein fehlendes Bedienelement oder hat keinen Lernzielbezug.
   - Die Zahl der Lernziele ohne Frage auf passender Stufe steigt nicht über 62.

   Ausnahmen sind je Eintrag begründet. Die Listen dürfen nur kürzer werden: Der Test meldet, wenn eine Ausnahme erledigt ist.

Nicht bearbeitet wurden die Module aus laufenden PRs: `historisch` (Historische Kennwerte f_ck,is), das neue Eurocode-Kennwerte-Modul, `bauschaeden` und `bp_klebstoffe` (Kleb-/Dichtstoff-Reiter-Umzug). Fachliche Aussagen wurden nur mit Beleg im Modul oder Rechenkern geändert.

## Kennzahlen

| Prüfpunkt | Rohbefund Skript | nach Sichtung | nach Umsetzung |
|---|---|---|---|
| Module mit Lernzielen / Lernziele | 193 / 857 | | |
| Lernziele ohne Quizfrage | 181 | 73 | **36** (alle begründet, 11 davon wegen fehlendem Selbsttest oder laufendem PR) |
| Module ohne Frage auf höchster Lernzielstufe | 50 | 50 | **34** |
| Lernziele mit Frage, aber keiner auf passender Stufe | 65 | 65 | **62** |
| Lernziele ohne Inhaltsfundstelle | 4 | 0 (gesichtet, Inhalt vorhanden) | 0 |
| „Das Wichtigste“ mit Zahl ohne Fundstelle | 7 | 3 (Bauwerksdiagnose-Familie) | 0 |
| Ausprobieren: Bedienelement nicht im Modul | 2 | 1 | 0 |
| Ausprobieren ohne Lernzielbezug | 18 | 3 | 1 (begründet) |
| Module ohne Inhaltszuordnung | 2 | 0 | 0 |

Bloom-Verteilung der Lernziele: Erinnern 39, Verstehen 219, Anwenden 347, Analysieren 127, Bewerten 124, Erschaffen 1.
Quiz-Pool nach Umsetzung (1342 Fragen): Erinnern 213, Verstehen 359, Anwenden 509, Analysieren 124, Bewerten 118, ohne Bloom-Feld 19. Die 19 Fragen ohne Bloom-Feld sind ältere freigegebene Fragen; sie wurden nicht geändert.

## Behoben

### „Das Wichtigste“ berichtigt

- **Bauwerksdiagnose, Prüfverfahren-Katalog, ZfP** (gemeinsamer Punkt 4): Die Kurzfassung nannte für die In-situ-Druckfestigkeit „f_m,is − 1,48 · s … ergeben sich 27,3 N/mm²“. Das Modul selbst rechnet nach DIN EN 13791:2020-02 mit k_n = 2,00 für n = 8 und M = 4 und kommt so auf 26,0 N/mm². Belegt ist das in `content/bauwerksuntersuchung/Bauwerksuntersuchung.json` (Beispiel „schritte_2“) und im Kern `insituDruckfestigkeit13791`. Der Wert 1,48 stammt aus der Konformitätsregel der DIN EN 206 und gehört nicht hierher. Neu: „… f_m,is − k_n · s und kleinstem Einzelwert plus M; im Beispiel mit 8 Bohrkernen (k_n = 2,00, M = 4) ergeben sich 26,0 N/mm².“

### Ausprobieren-Aufträge korrigiert

- **Verkehrswegebau Tiefbau/Betondecken:** Der Westergaard-Auftrag („im Reiter Betondecken die Deckendicke …“) stand bei `bp_verkehr_tiefbau`, dessen Lernziele die Entwässerung betreffen. Er ist jetzt bei `bp_verkehr_betondecken` eingeordnet (dort Lernziel 2). Für diese Route gab es bisher keinen Auftrag. Zwei neue Aufträge sind dazugekommen, ihre Werte stammen aus `src/calc/verkehrswegebau.ts`:
  - Bettungsmodul halbieren: σ von 1,76 auf 1,91 N/mm²
  - Scheinfugenabstand 6,0 m statt 5,0 m bei 26 cm Dicke: Begrenzung auf 5,0 m, Rissgefahr
- **Spannbeton Teil 1:** Der Auftrag nannte den Leitfaden „Von 0 bis 100“, im Modul heißt er „Von 0 auf 100“. Das ist berichtigt, ebenso in `src/data/rechnerGrenzen.ts`.

### Lernziel präzisiert

- **Baustoffkenngrößen, Ziel 3:** Der Ausprobieren-Auftrag und der Reiter „Thermisch“ behandeln den U-Wert einer einschichtigen Wand, das Lernziel nannte ihn nicht. Neu: „… den s_d-Wert, den U-Wert einer einschichtigen Wand und den Wärmeeindringkoeffizienten …“.

### Neue Quizfragen (38, zur Freigabe)

Alle neuen Fragen haben `verified: false` und alle Pflichtfelder: Bloom-Stufe, Niveau, Rückmeldung je Antwortoption, Lernhilfe und normRef. Die Optionslängen erfüllen die Ratschen aus `tests/quiz.test.ts`: richtige Antwort nicht die längste, Spannweite ≤ 1,2, keine Absolutwörter.

Inhalte und Zahlen stammen aus dem jeweiligen Modultext. Vier Rechenfragen werden in `tests/quizRechenfragen.test.ts` gegen die Kerne nachgerechnet: `bemesseBiegung`, `mauermoertelNormalfuge`, `pn98Probenzahl`, `huellwerte`. Die übrigen Rechenwerte sind von Hand nach der Modulformel nachgerechnet: ETK, Formmaß, Biegespannung, Dämmdicke, ΔQ nach Bestand.

Die Fragen erscheinen in den Prüflisten `docs/pruefung/quiz-cluster-*.md` als neu und offen. Dafür wurde `qlz_` in `NEU_SEIT_26_10` (`scripts/auditDaten.ts`) ergänzt.

Stufen: 18 × Bewerten, 5 × Analysieren, 8 × Anwenden, 6 × Verstehen, 1 × Erinnern.


## Offen

### Lernziele ohne Quizfrage (36, begründet in `tests/lernzielAbdeckung.test.ts`)

| Gruppe | Lernziele | Grund / Vorschlag |
|---|---|---|
| Kein Selbsttest | `beton_a_z#1–4`, `bp_recht_normen#1–3` | Für die Routen gibt es keinen eigenen Selbsttest: Beton A–Z ist ein Nachschlagewerk; bei BpRechtliches bekommen nur zwei Unterreiter einen Selbsttest über `MODULTEST_IN_APP`. Vorschlag siehe „Entscheidungen“. |
| Laufende PRs | `bauschaeden#1, #3, #4`, `historisch#4` | In dieser Runde nicht bearbeitet (Kleb-/Dichtstoff-Reiter-Umzug, Historische Kennwerte f_ck,is). Nach dem Merge nachziehen. |
| Inhalt knapp | `bp_glaeser#5` | Das Modul behandelt Schall- und Sonnenschutzaufbauten nur in Stichworten. Vor einer Frage ist der Inhalt zu ergänzen oder das Lernziel auf den Inhalt einzugrenzen (fachliche Entscheidung). |
| Nachtrag offen | `korrosionsschutz_beschichtungen#2`, `bauchemie#1`, `boden_materialaufbereitung#1`, `bp_betonfertigteile#3`, `bp_farben_lacke#1`, `dpp#2`, `ki_llmpraxis#2`, `ki_prompting#2`, `ki_system#1`, `kombinationen#2`, `kreislauf_dpp#1`, `kreislauf_dpp#2`, `materialmodelle#1`, `messen_pruefen#2`, `online_tools#5`, `ressourcen_umwelt#1`, `ressourceneffizienz#2`, `rueckbau#5`, `sonderbetone#2`, `sonderbetone#3`, `bp_beton#1`, `nachhaltigkeit_daten_regeln#1`, `schadensbilder#4`, `ki_ressourcen#1` | Überwiegend Ziele der Stufen Verstehen und Erinnern. Je eine Frage ist in einer Folgerunde nachzutragen. |

### Module ohne Frage auf höchster Lernzielstufe (34)

- `mischungsberechnung`: Die Stufe „Erschaffen“ (Mischungsentwurf) lässt sich im Auswahlformat nicht prüfen; der Entwurf geschieht im Rechner.
- `historisch`: laufender PR.
- Übrige 32 Module (überwiegend Bewerten-Ziele, deren Fragen bis „Anwenden“ oder „Analysieren“ reichen): `membranen_etfe`, `altholz_urban_mining`, `pfas_baustoffe`, `stahlbeton_bemessung`, `bauphysik`, `betonpraxis`, `bp_farben_lacke`, `bp_innovationen`, `denkmalpflege`, `holz`, `hydratation_folgen`, `innenausbau`, `kalk`, `kombinationen`, `materialitaet_architektur`, `labor`, `mechanische_pruefungen`, `oekobilanz_lca`, `stahl`, `materialkennwerte`, `regularien`, `analytik`, `daemmstoffe`, `bp_stahlbauprofile`, `waermeeigenschaften`, `brandschutz`, `nachhaltigkeit_daten_regeln`, `schadensbilder`, `wta`, `materialdatenbanken`, `bp_recht_grundlagen`, `holzbau_werkstoffe`.

  Für diese Module ist je eine Frage auf der höchsten Stufe nachzutragen. Die Bloom-Stufe freigegebener Fragen wurde nicht umgestuft (Quiz nur ändern, wenn eine Frage falsch geworden ist).

### Weitere Hinweise

- **Lernziele mit Frage nur auf niedrigerer Stufe:** 62 (Ratsche). Beispiel: `bp_farben_lacke#5` (Bewerten) wird nur von einer Anwenden-Frage geprüft. Die vollständige Liste liefert `node scripts/qa/lernziel-abdeckung.mjs --liste`.
- **Ausprobieren ohne Lernzielbezug:** `instandhaltung#2` (Chloridrechner). Das Modul hat bereits fünf Lernziele, keines nennt das Chlorideindringen.

## Entscheidungen

1. **Selbsttest für Beton A–Z und den Unterreiter Normenarbeit?** Vorschlag:
   - `bp_recht_avcp` und `bp_recht_normen` in `MODULTEST_IN_APP` aufnehmen, mit je mindestens 5 Fragen. Die Ratsche „Module mit < 5 Fragen“ in `tests/quiz.test.ts` erlaubt nur zwei solche Module. Für `bp_recht_avcp` zählen heute Fragen des Nachbarreiters (`q_bre_2`, `q_bre_4`, `qn_bp_recht_konformitaet_6`).
   - Beton A–Z als Nachschlagewerk ohne Selbsttest belassen und seine Lernziele auf das Nachschlagen umformulieren, etwa „im Lexikon … nachschlagen und … zuordnen“. Die Ausnahmen bleiben dann dauerhaft.
2. **Chloridrechner in der Stahlbetoninstandhaltung:** Vorschlag: Lernziel 1 (Prinzipien nach DIN EN 1504) erweitern um „… und mit dem Chloridrechner abschätzen, wann die Bewehrung depassiviert wird“. Alternativ den Auftrag durch einen Auftrag zum System-Finder ersetzen.

## Neue Fragen

| Frage | Lernziel | Bloom | Thema | normRef |
|---|---|---|---|---|
| qlz_zfp_1 | zfp#3 | Bewerten | Verfahrenswahl Korrosionsortung | DGZfP-Merkblatt B 03, ASTM C876 |
| qlz_pruefverfahren_katalog_1 | pruefverfahren_katalog#3 | Bewerten | Verfahrenswahl Bestandsfestigkeit | DIN EN 13791, DIN EN 12504-2 |
| qlz_holzkorrosion_1 | holzkorrosion#5 | Bewerten | Sanierung Echter Hausschwamm | DIN 68800-4:2020-12, AltholzV |
| qlz_sicherheitskonzept_1 | sicherheitskonzept#5 | Bewerten | Ausnutzung und Modellgrenzen | DIN EN 1990, DIN EN 1992-1-1/NA |
| qlz_wu_bauwerke_1 | wu-bauwerke#4 | Bewerten | Fugenabdichtung | DAfStb-Richtlinie WU (2017-12), DIN 18197, DIN 7865 |
| qlz_probenahme_1 | probenahme#5 | Bewerten | Chloridbeprobung am Bauteil | DIN EN 14629 |
| qlz_sonderbetone_1 | sonderbetone#4 | Bewerten | Auswahl eines Sonderbetons | DIN EN 14487-1, DIN 18551 |
| qlz_mechanische_kenngroessen_1 | mechanische_kenngroessen#5 | Bewerten | Werkstoffwahl nach E/ρ | DIN EN 1993-1-1, DIN EN 338 |
| qlz_qualitaetssicherung_1 | qualitaetssicherung#5 | Bewerten | Mängel bei der Fremdüberwachung | DIN 1045-3, DIN 1045-2 |
| qlz_bestand_1 | bestand#3 | Anwenden | Heizwärmeeinsparung und CO₂ | DIN V 4108-6, VDI 4710 |
| qlz_bestand_2 | bestand#5 | Bewerten | Sanierungsvarianten beurteilen | GModG Anlage 7, WTA-Merkblatt 6-5 |
| qlz_schadstoffe_1 | schadstoffe#5 | Bewerten | Beprobung PSF und Haufwerke | VDI 6202 Blatt 3:2021-09, LAGA PN 98 |
| qlz_material_schaeden_gross_1 | material_schaeden_gross#5 | Bewerten | Konsequenz aus Bad Reichenhall | DIN EN 1995-1-1, DIN EN 301, VDI 6200 |
| qlz_schutz_grundlagen_1 | schutz_grundlagen#5 | Bewerten | Prinzip bei Chloridschaden | DIN EN 1504-9, TR Instandhaltung |
| qlz_keramik_ziegel_1 | keramik_ziegel#4 | Anwenden | Formmaß des Rohlings | DIN EN 771-1 |
| qlz_brandschutz_1 | brandschutz#3 | Anwenden | Einheitstemperaturzeitkurve | DIN EN 1363-1, DIN 4102-2 |
| qlz_historische_bauweisen_1 | historische_bauweisen#4 | Anwenden | Biegespannung Holzbalkendecke | DIN EN 1995-1-1 |
| qlz_putzemoertel_1 | putzemoertel#4 | Anwenden | Mauermörtelbedarf | DIN EN 998-2 |
| qlz_abfaelle_1 | abfaelle#5 | Anwenden | Beprobungsumfang LAGA PN 98 | LAGA PN 98, Tabellen 2 und 3 |
| qlz_stahlbeton_1 | stahlbeton_bemessung#2 | Anwenden | Biegebewehrung mit dem ω-Verfahren | DIN EN 1992-1-1/NA, 6.1 |
| qlz_expositionsklassen_1 | expositionsklassen#3 | Anwenden | Hüllwerte mehrerer Klassen | DIN 1045-2:2023-08, Tab. F.2.1 |
| qlz_labor_moertelprismen_1 | labor_moertelprismen#3 | Analysieren | Herleitung der Biegezugfestigkeit | DIN EN 196-1 |
| qlz_labor_druckfestigkeit_1 | labor_druckfestigkeit#3 | Analysieren | Bruchbild beurteilen | DIN EN 12390-3 |
| qlz_metallkorrosion_1 | metallkorrosion#4 | Analysieren | Feuchte und Chloride in der Simulation | DIN EN ISO 8044, DIN EN ISO 9223 |
| qlz_modernisierung_1 | modernisierung#4 | Analysieren | Dämmdicke und Wärmeleitfähigkeit | DIN EN ISO 6946, GModG Anlage 7 |
| qlz_px_planung_1 | px_planung#4 | Analysieren | Materialunverträglichkeit im LV | DIN EN ISO 12944-2, DIN EN 1995-1-1 |
| qlz_boden_materialaufbereitung_1 | boden_materialaufbereitung#5 | Bewerten | Güteüberwachung von Ersatzbaustoffen | ErsatzbaustoffV (EBV) §§ 4–10 |
| qlz_bauwerksunters_monitoring_1 | bauwerksunters_monitoring#5 | Bewerten | Verfahrenswahl Rissüberwachung | DIN 1076, DGZfP-Merkblätter |
| qlz_ki_recht_ethik_1 | ki_recht_ethik#5 | Bewerten | Energiebedarf und normativer Bias | DIN EN 1992-1-1/NA |
| qlz_korrosionsschutz_beschichtungen_1 | korrosionsschutz_beschichtungen#4 | Bewerten | Verzinkung oder Duplex | DIN EN ISO 14713-1, DIN EN ISO 12944-1 |
| qlz_normen_ausblick_1 | normen_ausblick#5 | Bewerten | Einführungstermine einordnen | MVV TB 2025/1, CEN/TC 250 |
| qlz_keramik_ziegel_2 | keramik_ziegel#2 | Verstehen | Ziegelarten und Einsatz | DIN EN 771-1, DIN 105-4 |
| qlz_asphalt_1 | asphalt#1 | Verstehen | Viskoelastisches Verhalten | DIN EN 12591 |
| qlz_korrosion_1 | korrosion#2 | Verstehen | Schadensstadien der Bewehrungskorrosion | Bewehrungskorrosion (Lehrinhalt) |
| qlz_kunststoffe_1 | kunststoffe#4 | Erinnern | Baukunststoffe und Einsatz | Baukunststoffe (Lehrinhalt) |
| qlz_lebenszyklus_kosten_1 | lebenszyklus_kosten#1 | Verstehen | Kostengruppen nach DIN 18960 | DIN 18960 |
| qlz_dauerhaftigkeit_1 | dauerhaftigkeit#1 | Verstehen | Prinzipien der Dauerhaftigkeit | DIN 68800, DIN EN ISO 12944-2 |
| qlz_gesteine_1 | gesteine#2 | Verstehen | Porosität und Frostwiderstand | DIN EN 1097-6 |

## Matrix je Modul

Legende:
- **Lernziele:** Nr. und Bloom-Stufe des Ziels (Er = Erinnern, Ve = Verstehen, An = Anwenden, Ana = Analysieren, Be = Bewerten, Es = Erschaffen) mit der Zahl zugeordneter Fragen; ✗ = keine Frage, „(Stufe)“ = keine Frage auf passender Stufe.
- **Inhalt:** „ja“ = alle Ziele mit Fundstelle im Modultext; „gesichtet“ = die Fundstelle wurde von Hand bestätigt.
- **höchste Stufe:** Ziel/Quiz; ✗ = nicht erreicht.
- **Fragen:** alle Fragen der Route einschließlich der Unterreiter ohne eigene Lernziele.

| Modul | Niv. | Lernziele (Stufe: Fragen) | Inhalt | höchste Stufe Ziel/Quiz | Fragen | Das Wichtigste | Ausprobieren |
|---|---|---|---|---|---|---|---|
| abfaelle | B/M | 1 Ve: 2 · 2 An: 2 · 3 Ana: 1 · 4 An: 2 · 5 An: 1 | ja | Ana/Be | 8 | 5 Punkte | – |
| altholz_urban_mining | B/M | 1 An: 3 · 2 Ve: 4 · 3 An: 2 · 4 Be: 1 (Stufe) | ja | Be/Ana ✗ | 7 | 5 Punkte | 3 |
| analytik | B/M | 1 Ve: 3 · 2 An: 1 · 3 An: 1 · 4 Ana: 2 (Stufe) · 5 Be: 1 (Stufe) | ja | Be/An ✗ | 6 | – | 2 |
| asphalt | B | 1 Ve: 1 · 2 An: 3 · 3 Ana: 1 · 4 Ve: 1 · 5 Be: 2 | ja | Be/Be | 7 | – | 3 |
| ausbau | B | 1 Ve: 1 · 2 An: 2 · 3 Ve: 3 · 4 Be: 1 (Stufe) | ja | Be/Be | 6 | – | – |
| bauchemie | B | 1 Ve: 0 ✗ · 2 Ve: 1 · 3 An: 2 · 4 Ana: 1 (Stufe) · 5 Be: 1 | ja | Be/Be | 6 | 5 Punkte | 3 |
| bauphysik | B | 1 An: 3 · 2 An: 2 · 3 Ana: 1 (Stufe) | ja | Ana/An ✗ | 6 | 5 Punkte | 3 |
| bauschaeden | B | 1 Ve: 0 ✗ · 2 An: 4 · 3 An: 0 ✗ · 4 Ana: 0 ✗ · 5 Be: 2 | ja | Be/Be | 6 | 5 Punkte | – |
| baustatik | B | 1 Ve: 1 · 2 An: 6 · 3 An: 2 · 4 Ana: 2 | ja | Ana/Ana | 6 | 5 Punkte | 3 |
| baustoffkenngroessen | B | 1 Ve: 2 · 2 An: 2 · 3 An: 2 · 4 An: 1 · 5 Ana: 1 | ja | Ana/Ana | 6 | 5 Punkte | 3 |
| baustoffkunde | B | 1 Er: 2 · 2 Er: 1 · 3 Ve: 2 · 4 Ve: 2 · 5 An: 1 | ja | An/An | 6 | – | – |
| bauwerksdiagnose | B/M | 1 Ve: 1 · 2 An: 5 · 3 Ana: 3 | ja | Ana/Ana | 6 | 5 Punkte | 2 |
| bauwerkserfassung | B/M | 1 Ve: 1 · 2 Ana: 1 · 3 Ve: 1 · 4 An: 2 | ja | Ana/Ana | 6 | – | 2 |
| bauwerksunters_monitoring | B/M | 1 Ve: 3 · 2 Ana: 1 · 3 An: 1 · 4 Be: 3 · 5 Be: 1 | ja | Be/Be | 7 | 5 Punkte | 3 |
| bestand | B | 1 Ve: 1 · 2 An: 4 · 3 An: 1 · 4 Ana: 2 (Stufe) · 5 Be: 1 | ja | Be/Be | 8 | – | – |
| beton_a_z | B | 1 Er: 0 ✗ · 2 Ve: 0 ✗ · 3 An: 0 ✗ · 4 An: 0 ✗ | ja | An/– | 0 | – | – |
| betonkennwerte | B/M | 1 An: 2 · 2 An: 1 · 3 Ve: 1 · 4 An: 1 · 5 Ana: 1 | ja | Ana/Ana | 6 | 5 Punkte | 3 |
| betonpraxis | B | 1 An: 1 · 2 An: 1 · 3 An: 2 · 4 Be: 2 (Stufe) | ja | Be/An ✗ | 6 | 5 Punkte | – |
| bim_baustoffe | B/M | 1 Ve: 1 · 2 Ve: 2 · 3 An: 2 · 4 An: 1 · 5 Ana: 2 | ja | Ana/Ana | 6 | – | – |
| bindemittel | B | 1 Ve: 4 · 2 An: 1 · 3 Ve: 1 · 4 Ana: 2 · 5 Be: 1 | ja | Be/Be | 7 | – | – |
| biokohlebeton | B/M | 1 Ve: 3 · 2 An: 4 · 3 Ana: 2 · 4 Be: 4 | ja | Be/Be | 7 | 5 Punkte | 3 |
| boden_materialaufbereitung | B/M | 1 Ve: 0 ✗ · 2 An: 3 · 3 An: 2 · 4 Ana: 1 · 5 Be: 1 | ja | Be/Be | 7 | 5 Punkte | 3 |
| bodenmechanik | B | 1 An: 7 · 2 An: 1 · 3 An: 1 · 4 Ve: 2 · 5 An: 5 | ja | An/Be | 11 | 5 Punkte | 6 |
| bp_abdichtung | B | 1 Ve: 2 · 2 An: 2 · 3 An: 1 · 4 Ana: 1 · 5 Be: 2 | ja | Be/Be | 6 | 5 Punkte | – |
| bp_befestigung | B/M | 1 Ve: 3 · 2 Ve: 1 · 3 An: 2 · 4 Ana: 1 · 5 Be: 1 | ja | Be/Be | 6 | – | – |
| bp_beton | B | 1 Ve: 0 ✗ · 2 Ve: 3 · 3 Ana: 2 (Stufe) · 4 An: 1 | ja | Ana/Ana | 6 | – | – |
| bp_betonfertigteile | B | 1 Ve: 2 · 2 An: 2 · 3 Ve: 0 ✗ · 4 Be: 1 (Stufe) | ja | Be/Be | 6 | – | – |
| bp_betonwaren | B | 1 Ve: 1 · 2 An: 2 · 3 Ve: 1 · 4 Ana: 2 | ja | Ana/Ana | 6 | – | – |
| bp_betonzusatzmittel | B | 1 Er: 5 · 2 Ve: 1 · 3 An: 2 · 4 Be: 1 | ja | Be/Be | 6 | – | – |
| bp_dach_fassade | B | 1 Ve: 1 · 2 Ve: 2 · 3 An: 3 · 4 Ana: 1 | ja | Ana/Ana | 6 | – | – |
| bp_daemmung | B | 1 Ve: 3 · 2 An: 1 · 3 An: 1 · 4 Be: 2 | ja | Be/Be | 6 | – | – |
| bp_farben_lacke | B | 1 Ve: 0 ✗ · 2 Ve: 1 · 3 An: 2 · 4 Ana: 3 · 5 Be: 1 (Stufe) | ja | Be/Ana ✗ | 6 | 5 Punkte | – |
| bp_glaeser | B | 1 Ve: 4 · 2 Ve: 1 (Stufe) · 3 An: 2 · 4 An: 2 · 5 Be: 0 ✗ | ja | Be/Be | 6 | 5 Punkte | 3 |
| bp_holzprodukte | B | 1 Ve: 1 · 2 Ve: 1 · 3 An: 3 · 4 An: 1 · 5 Ana: 2 | ja | Ana/Ana | 6 | – | 2 |
| bp_innovationen | B/M | 1 Ve: 1 · 2 An: 2 · 3 Ve: 2 · 4 An: 1 · 5 Be: 1 (Stufe) | ja | Be/An ✗ | 6 | – | – |
| bp_klebstoffe | B | 1 Ve: 2 · 2 Ve: 1 · 3 An: 1 · 4 An: 1 | ja | An/An | 6 | – | – |
| bp_kunststoffe | B | 1 Ve: 2 · 2 An: 1 · 3 An: 1 · 4 Ana: 2 | ja | Ana/Ana | 6 | – | – |
| bp_lehmbauprodukte | B | 1 Er: 3 · 2 Ve: 1 · 3 An: 3 · 4 Ana: 2 | ja | Ana/Ana | 6 | – | – |
| bp_mauerwerk | B | 1 Ve: 2 · 2 An: 2 · 3 Ve: 5 · 4 Be: 6 | ja | Be/Be | 6 | – | – |
| bp_metallisch | B | 1 Ve: 4 · 2 An: 1 · 3 An: 1 · 4 Be: 1 (Stufe) | ja | Be/Be | 6 | – | – |
| bp_mineralisch | B | 1 Ve: 1 · 2 Ve: 3 · 3 An: 1 · 4 Ana: 1 | ja | Ana/Ana | 6 | – | – |
| bp_putz_estrich | B | 1 Ve: 1 · 2 Ve: 2 · 3 Ana: 3 · 4 An: 1 | ja | Ana/Ana | 6 | – | – |
| bp_recht_avcp | B/M | 1 Er: 2 · 2 Ve: 1 · 3 Ana: 1 | ja | Ana/– | 0 | – | – |
| bp_recht_grundlagen | B/M | 1 Ve: 7 · 2 An: 6 · 3 An: 4 · 4 Ana: 1 (Stufe) | ja | Ana/An ✗ | 12 | – | – |
| bp_recht_konformitaet | B/M | 1 Ve: 1 · 2 Er: 4 · 3 An: 3 · 4 Ana: 2 | ja | Ana/Ana | 6 | – | – |
| bp_recht_normen | B/M | 1 Er: 0 ✗ · 2 Ve: 0 ✗ · 3 Ana: 0 ✗ | ja | Ana/– | 0 | – | – |
| bp_stahlbauprofile | B | 1 Ve: 4 · 2 An: 2 · 3 An: 1 · 4 Ana: 2 | ja | Ana/An ✗ | 6 | – | – |
| bp_trockenbau | B | 1 Er: 2 · 2 Ve: 1 · 3 Ve: 1 · 4 An: 2 · 5 Ana: 2 | ja | Ana/Ana | 6 | – | – |
| bp_verkehr_asphalt | B | 1 Ve: 5 · 2 Ve: 2 · 3 An: 1 · 4 Ana: 1 | ja | Ana/Ana | 6 | 5 Punkte | – |
| bp_verkehr_bahn | B | 1 Ve: 2 · 2 Ve: 5 · 3 An: 3 · 4 Be: 2 | ja | Be/Be | 6 | 5 Punkte | – |
| bp_verkehr_betondecken | B/M | 1 Ve: 2 · 2 An: 1 · 3 An: 1 · 4 Ana: 2 · 5 Be: 1 | ja | Be/Be | 6 | 5 Punkte | 3 |
| bp_verkehr_bitumen | B | 1 Ve: 3 · 2 Ve: 2 · 3 Ana: 2 · 4 Be: 1 | ja | Be/Be | 6 | 5 Punkte | – |
| bp_verkehr_pruefung | B | 1 Ve: 2 · 2 Ve: 1 · 3 An: 3 · 4 Be: 1 | ja | Be/Be | 6 | 5 Punkte | 2 |
| bp_verkehr_rsto | B | 1 Er: 3 · 2 Ve: 2 · 3 An: 1 · 4 An: 2 | ja | An/An | 12 | 5 Punkte | 3 |
| bp_verkehr_tiefbau | B | 1 Er: 1 · 2 Ve: 1 · 3 An: 2 · 4 Ana: 1 | ja | Ana/Ana | 6 | 5 Punkte | 2 |
| bp_verkehr_tunnel | B/M | 1 Ve: 1 · 2 Ve: 1 · 3 An: 4 · 4 Be: 1 | ja | Be/Be | 6 | 5 Punkte | – |
| brandschutz | B | 1 An: 4 · 2 Ve: 4 · 3 An: 1 · 4 An: 3 · 5 Be: 4 (Stufe) | ja | Be/An ✗ | 7 | – | – |
| bruchmechanik | M | 1 Ve: 1 · 2 An: 2 · 3 Be: 3 · 4 Ve: 2 | ja | Be/Be | 6 | – | – |
| carbonbeton | B/M | 1 Ve: 4 · 2 An: 3 · 3 Ana: 4 | ja | Ana/Ana | 6 | – | – |
| daemmstoffe | B | 1 Ve: 4 · 2 An: 6 · 3 Ana: 4 (Stufe) · 4 Be: 3 (Stufe) | ja | Be/An ✗ | 6 | – | – |
| daemmung_vergleich | B | 1 Ve: 4 · 2 Ana: 1 · 3 Be: 4 | ja | Be/Be | 6 | – | – |
| dauerhaftigkeit | B | 1 Ve: 1 · 2 An: 2 · 3 An: 1 · 4 An: 3 · 5 Be: 1 | ja | Be/Be | 7 | 5 Punkte | – |
| denkmalpflege | B/M | 1 Ve: 1 · 2 Er: 3 · 3 An: 1 · 4 An: 1 · 5 Be: 1 (Stufe) | ja | Be/An ✗ | 6 | – | – |
| dpp | B/M | 1 Ve: 2 · 2 Ve: 0 ✗ · 3 Ve: 1 · 4 An: 2 · 5 An: 1 | ja | An/An | 6 | 5 Punkte | 3 |
| einheiten | B | 1 Er: 1 · 2 An: 6 · 3 An: 1 · 4 Ana: 1 | ja | Ana/Ana | 6 | 5 Punkte | 3 |
| emodul | M | 1 An: 4 · 2 An: 3 · 3 Ve: 3 · 4 Ana: 1 (Stufe) | ja | Ana/Ana | 6 | 5 Punkte | 3 |
| energieausweis | B | 1 Ve: 3 · 2 Er: 1 · 3 Ve: 1 · 4 An: 3 · 5 Ana: 5 | ja | Ana/Ana | 6 | 5 Punkte | 3 |
| erdbau | B | 1 Ve: 2 · 2 An: 2 · 3 An: 2 · 4 An: 2 | ja | An/An | 6 | 5 Punkte | 3 |
| expositionsklassen | B | 1 Ve: 4 · 2 An: 2 · 3 An: 1 · 4 An: 3 · 5 An: 1 | ja | An/An | 7 | 5 Punkte | 3 |
| festbeton | B | 1 Er: 3 · 2 Ve: 1 · 3 An: 1 · 4 An: 1 | ja | An/Ana | 6 | – | 3 |
| festbeton_statistik | B | 1 Ve: 1 · 2 An: 5 · 3 An: 3 · 4 Be: 1 | ja | Be/Be | 6 | 5 Punkte | 3 |
| festigkeit | B | 1 An: 1 · 2 An: 2 · 3 An: 2 · 4 Ana: 2 · 5 An: 6 | ja | Ana/Be | 11 | 5 Punkte | 6 |
| feuchteschutz | B | 1 An: 1 · 2 An: 4 · 3 An: 1 · 4 An: 1 · 5 Be: 4 | ja | Be/Be | 8 | 5 Punkte | 3 |
| formaenderungen | B | 1 Ve: 1 · 2 Ve: 1 · 3 Ana: 4 · 4 An: 1 · 5 An: 5 | ja | Ana/Ana | 11 | 5 Punkte | 6 |
| frischbeton | B | 1 Ve: 5 · 2 An: 3 · 3 An: 1 · 4 An: 3 · 5 Be: 2 | ja | Be/Be | 7 | 5 Punkte | 3 |
| gesteine | B | 1 Ve: 3 · 2 Ve: 1 · 3 An: 1 · 4 An: 1 (Stufe) · 5 Be: 1 | ja | Be/Be | 7 | – | – |
| gips | B | 1 Ve: 1 · 2 An: 4 · 3 Ana: 2 · 4 Be: 2 | ja | Be/Be | 6 | – | – |
| glas | B | 1 Ve: 1 · 2 Ve: 1 · 3 Ana: 2 · 4 An: 3 · 5 An: 2 | ja | Ana/Ana | 6 | – | 3 |
| grundlagen | B | 1 Er: 3 · 2 Ve: 3 · 3 An: 1 · 4 An: 1 | ja | An/An | 6 | – | – |
| herstellung_einbau | B | 1 Ve: 2 · 2 An: 3 · 3 An: 1 · 4 Ana: 1 | ja | Ana/Ana | 6 | – | – |
| historisch | B/M | 1 An: 3 · 2 An: 2 (Stufe) · 3 An: 1 · 4 Ana: 0 ✗ · 5 Be: 2 | ja | Be/Ana ✗ | 6 | – | – |
| historische_bauprodukte | B | 1 Er: 1 · 2 Ve: 1 · 3 Ana: 1 · 4 Be: 2 | ja | Be/Be | 6 | 5 Punkte | – |
| historische_bauweisen | B | 1 Ve: 1 · 2 An: 3 · 3 An: 2 · 4 An: 1 · 5 Ana: 1 | ja | Ana/Ana | 7 | – | – |
| holz | B | 1 Ve: 3 · 2 An: 1 · 3 An: 2 · 4 An: 1 · 5 Ana: 1 (Stufe) | ja | Ana/An ✗ | 6 | – | 3 |
| holzbau_bauphysik | B/M | 1 Ve: 1 · 2 An: 3 · 3 An: 2 · 4 Ana: 1 | ja | Ana/Ana | 6 | 5 Punkte | 3 |
| holzbau_bemessung | B | 1 Ve: 2 · 2 An: 1 · 3 An: 1 · 4 An: 1 | ja | An/An | 6 | 5 Punkte | 3 |
| holzbau_konstruktion | B | 1 Ve: 3 · 2 Ana: 2 · 3 An: 1 | ja | Ana/Be | 6 | – | – |
| holzbau_verbindung | B/M | 1 Ve: 2 · 2 An: 3 · 3 An: 1 · 4 Ana: 1 | ja | Ana/Ana | 6 | 5 Punkte | 3 |
| holzbau_werkstoffe | B | 1 Ve: 4 · 2 Ve: 2 · 3 An: 1 · 4 Ana: 1 (Stufe) | ja | Ana/An ✗ | 6 | – | – |
| holzkorrosion | B | 1 Ve: 1 · 2 Er: 1 · 3 An: 1 · 4 An: 2 · 5 Be: 1 | ja | Be/Be | 7 | – | – |
| holzwerkstoffe | B | 1 Ve: 4 · 2 An: 1 · 3 Be: 1 (Stufe) | ja | Be/Be | 6 | – | – |
| hydratation_folgen | B/M | 1 An: 3 · 2 An: 5 · 3 Ve: 10 · 4 An: 5 · 5 Be: 4 (Stufe) | ja | Be/An ✗ | 18 | 5 Punkte | 3 |
| innenausbau | B | 1 Ana: 1 · 2 An: 2 · 3 Er: 1 · 4 An: 2 · 5 Be: 1 (Stufe) | ja | Be/An ✗ | 6 | – | – |
| innovative_werkstoffe | M | 1 Ve: 1 · 2 An: 3 · 3 Ana: 1 · 4 Ana: 1 · 5 Be: 1 | ja | Be/Be | 6 | – | – |
| instandhaltung | B/M | 1 Ve: 4 · 2 Ve: 2 · 3 An: 2 · 4 An: 1 · 5 An: 1 | ja | An/An | 6 | 5 Punkte | 3 (1 ohne Bezug) |
| instandsetzung_materialien | B | 1 Ve: 2 · 2 An: 2 · 3 An: 1 · 4 Be: 1 | ja | Be/Be | 6 | – | – |
| kalk | B | 1 Ve: 3 · 2 Ve: 3 · 3 An: 2 · 4 Be: 1 (Stufe) | ja | Be/An ✗ | 6 | – | – |
| keramik_ziegel | B | 1 Ve: 1 · 2 Ve: 1 · 3 An: 6 · 4 An: 1 · 5 Be: 2 | ja | Be/Be | 9 | 5 Punkte | 3 |
| ki_llmpraxis | M | 1 Ve: 1 · 2 An: 0 ✗ · 3 Ana: 1 · 4 An: 3 · 5 Be: 1 | ja | Be/Be | 6 | 5 Punkte | – |
| ki_lokal | B/M | 1 Ana: 2 · 2 An: 1 · 3 An: 4 · 4 An: 1 · 5 Be: 2 | ja | Be/Be | 6 | 5 Punkte | – |
| ki_prompting | B/M | 1 Ve: 2 · 2 An: 0 ✗ · 3 An: 1 · 4 An: 1 · 5 Be: 2 | ja | Be/Be | 6 | 5 Punkte | 3 |
| ki_recht_ethik | B/M | 1 Ana: 1 (Stufe) · 2 Ve: 1 · 3 Ve: 3 · 4 An: 1 · 5 Be: 1 | ja | Be/Be | 7 | 5 Punkte | – |
| ki_ressourcen | B/M | 1 Er: 0 ✗ · 2 An: 2 · 3 An: 3 · 4 Be: 1 | ja | Be/Be | 6 | – | – |
| ki_system | B/M | 1 Ve: 0 ✗ · 2 Ve: 1 · 3 An: 2 · 4 An: 2 · 5 Be: 1 | ja | Be/Be | 6 | 5 Punkte | – |
| ki_thesen | B/M | 1 Ve: 1 · 2 An: 2 · 3 An: 1 · 4 Be: 1 · 5 An: 1 | ja | Be/Be | 6 | 5 Punkte | – |
| ki_uebungen | M | 1 An: 1 · 2 An: 1 · 3 Ana: 3 · 4 Be: 3 · 5 Be: 1 | ja | Be/Be | 6 | – | – |
| knicken | B | 1 Ve: 1 · 2 An: 2 · 3 An: 5 · 4 Ana: 4 | ja | Ana/Ana | 6 | 5 Punkte | 3 |
| kombinationen | B/M | 1 Ve: 2 · 2 An: 0 ✗ · 3 Ana: 1 (Stufe) · 4 An: 3 · 5 Be: 1 (Stufe) | ja | Be/An ✗ | 6 | 5 Punkte | 3 |
| korrosion | B | 1 Ve: 1 · 2 Ve: 1 · 3 An: 2 · 4 An: 3 · 5 An: 2 | ja | An/An | 7 | – | 3 |
| korrosionsschutz_beschichtungen | B | 1 An: 6 · 2 Ve: 0 ✗ · 3 An: 3 · 4 Be: 2 · 5 Ana: 2 | ja | Be/Be | 9 | 5 Punkte | 3 |
| kreislauf_dpp | B/M | 1 Er: 0 ✗ · 2 Ve: 0 ✗ · 3 An: 3 · 4 Ana: 1 · 5 Be: 2 | ja | Be/Be | 6 | – | – |
| kunststoffe | B | 1 Ve: 2 · 2 Ana: 2 · 3 An: 2 · 4 Er: 1 · 5 Be: 1 | ja | Be/Be | 7 | – | 3 |
| labor | B | 1 An: 1 · 2 An: 2 · 3 An: 1 · 4 Be: 1 (Stufe) · 5 An: 1 (Stufe) | ja | Be/An ✗ | 6 | 5 Punkte | 3 |
| labor_auslagerung | B/M | 1 An: 1 · 2 An: 2 · 3 Ana: 1 (Stufe) · 4 Be: 2 | ja | Be/Be | 6 | 5 Punkte | 3 |
| labor_druckfestigkeit | B | 1 An: 2 · 2 An: 4 · 3 Ana: 1 · 4 Be: 1 | ja | Be/Be | 7 | 5 Punkte | 3 |
| labor_frischbeton | B | 1 An: 1 · 2 An: 2 · 3 Ana: 2 | ja | Ana/Be | 6 | 5 Punkte | 3 |
| labor_moertelprismen | B | 1 An: 5 · 2 An: 3 · 3 Ana: 1 · 4 Be: 1 | ja | Be/Be | 7 | 5 Punkte | 3 |
| labor_potentialmessung | B/M | 1 Ve: 2 · 2 An: 1 · 3 An: 3 · 4 Be: 1 | ja | Be/Be | 6 | 5 Punkte | 3 |
| labor_sicherheit | B | 1 Er: 1 · 2 Ve: 1 · 3 An: 1 · 4 An: 1 (Stufe) | ja | An/Be | 6 | – | – |
| lca_ingenieurbau | M | 1 Ve: 3 · 2 An: 1 · 3 Ana: 3 · 4 Be: 4 | ja | Be/Be | 7 | 5 Punkte | 3 |
| lca_rechner | B/M | 1 An: 4 · 2 An: 3 · 3 Ana: 2 · 4 Be: 2 | ja | Be/Be | 8 | 5 Punkte | 3 |
| lca_regulatorik | B/M | 1 Ve: 2 · 2 An: 2 · 3 An: 1 · 4 Ana: 1 · 5 Be: 1 | ja | Be/Be | 6 | 5 Punkte | 3 |
| lebensdauerbemessung | M | 1 Ve: 2 · 2 An: 2 · 3 An: 3 · 4 Ana: 2 · 5 Be: 1 (Stufe) | ja | Be/Be | 6 | 5 Punkte | 3 |
| lebenszyklus_kosten | B/M | 1 Ve: 1 · 2 An: 3 · 3 Ana: 2 · 4 Be: 1 | ja | Be/Be | 7 | 5 Punkte | 3 |
| lehm | B | 1 Ve: 1 · 2 Ana: 1 · 3 An: 2 · 4 Be: 2 | ja | Be/Be | 6 | 5 Punkte | 2 |
| material_schaeden_gross | B/M | 1 Er: 3 · 2 Ve: 3 · 3 An: 1 · 4 Ana: 1 (Stufe) · 5 Be: 1 | ja | Be/Be | 7 | 5 Punkte | – |
| materialdatenbanken | B/M | 1 Er: 1 · 2 Ve: 2 · 3 An: 2 · 4 Ana: 2 | ja | Ana/An ✗ | 6 | – | – |
| materialitaet_architektur | B | 1 Ve: 1 · 2 Ve: 2 · 3 Ana: 2 (Stufe) · 4 Be: 1 (Stufe) | ja | Be/An ✗ | 6 | – | – |
| materialkennwerte | B | 1 Ve: 2 · 2 An: 1 · 3 An: 2 · 4 Ana: 1 (Stufe) | ja | Ana/An ✗ | 6 | – | – |
| materialmodelle | B/M | 1 Ve: 0 ✗ · 2 An: 2 · 3 An: 4 · 4 Ana: 1 · 5 Be: 1 | ja | Be/Be | 6 | – | 3 |
| materialoptimierung | B/M | 1 Ve: 1 · 2 Ve: 2 · 3 An: 2 · 4 Ana: 1 · 5 Be: 1 | ja | Be/Be | 6 | 5 Punkte | 3 |
| materialpaesse | B/M | 1 Ve: 2 · 2 An: 2 · 3 An: 2 · 4 Ana: 2 · 5 Be: 2 | ja | Be/Be | 6 | – | – |
| mauerwerk | B | 1 Ve: 1 · 2 An: 1 · 3 An: 1 · 4 Ana: 1 · 5 An: 1 | ja | Ana/Ana | 6 | – | – |
| mechanische_kenngroessen | B | 1 Ve: 1 · 2 An: 3 · 3 An: 1 · 4 Ana: 3 · 5 Be: 1 | ja | Be/Be | 7 | 5 Punkte | 3 |
| mechanische_pruefungen | B | 1 Ve: 2 · 2 An: 2 · 3 An: 3 · 4 Ana: 2 | ja | Ana/An ✗ | 6 | – | 3 |
| membranen_etfe | B | 1 Ve: 1 · 2 Ve: 2 · 3 An: 2 · 4 Be: 1 | ja | Be/Ana ✗ | 8 | 5 Punkte | 3 |
| messen_pruefen | B/M | 1 Ve: 2 · 2 An: 0 ✗ · 3 An: 1 · 4 Be: 3 | ja | Be/Be | 6 | – | 3 |
| metalle | B | 1 Ve: 5 · 2 Ve: 2 · 3 An: 1 · 4 Be: 2 | ja | Be/Be | 6 | – | – |
| metallkorrosion | B | 1 Ve: 1 · 2 Ve: 1 · 3 An: 2 · 4 Ana: 1 · 5 Be: 2 | ja | Be/Be | 7 | – | – |
| mischungsberechnung | B | 1 An: 1 · 2 An: 1 · 3 An: 1 · 4 Ana: 1 · 5 Es: 1 (Stufe) | ja | Es/Ana ✗ | 6 | 5 Punkte | 3 |
| modernisierung | B | 1 Er: 2 · 2 An: 3 · 3 An: 1 · 4 Ana: 1 · 5 Be: 1 | ja | Be/Be | 7 | 5 Punkte | 3 |
| nachbehandlung | B | 1 Ve: 3 · 2 An: 3 · 3 An: 2 · 4 Be: 1 | ja | Be/Be | 6 | – | – |
| nachhaltigkeit_daten_regeln | B/M | 1 Er: 0 ✗ · 2 Ve: 4 · 3 An: 5 · 4 Ana: 4 · 5 Be: 3 | ja | Be/Ana ✗ | 8 | 5 Punkte | – |
| nawaro | B | 1 Ve: 3 · 2 An: 2 · 3 Ana: 1 (Stufe) · 4 Be: 1 | ja | Be/Be | 6 | – | – |
| normen_ausblick | B/M | 1 Ve: 1 · 2 Ve: 2 · 3 An: 3 · 4 Ana: 3 · 5 Be: 2 | ja | Be/Be | 8 | – | – |
| oekobilanz_lca | B/M | 1 Ve: 3 · 2 Ve: 1 · 3 An: 2 · 4 An: 2 · 5 Ana: 1 | ja | Ana/An ✗ | 7 | 5 Punkte | 3 |
| online_tools | B/M | 1 Ve: 1 · 2 An: 3 · 3 An: 3 · 4 Ana: 2 · 5 An: 0 ✗ | ja | Ana/Ana | 6 | 5 Punkte | 2 |
| pfas_baustoffe | B/M | 1 Er: 1 · 2 Ve: 3 · 3 An: 4 · 4 Be: 1 (Stufe) | ja | Be/An ✗ | 7 | 5 Punkte | 3 |
| probenahme | B/M | 1 Ve: 2 · 2 An: 2 · 3 An: 1 · 4 An: 1 · 5 Be: 1 | ja | Be/Be | 7 | – | 2 |
| pruefverfahren_katalog | B/M | 1 Ve: 2 · 2 An: 1 · 3 Be: 1 | ja | Be/Be | 7 | 5 Punkte | 3 |
| putzemoertel | B | 1 Ve: 1 · 2 Ve: 1 · 3 An: 1 · 4 An: 1 · 5 Be: 1 | ja | Be/Be | 7 | – | – |
| px_bauleitung | B | 1 An: 1 · 2 An: 2 · 3 An: 1 · 4 Ana: 2 · 5 An: 1 | ja | Ana/Ana | 6 | 5 Punkte | – |
| px_bautagebuch | B | 1 Ve: 1 · 2 An: 1 · 3 An: 2 · 4 Be: 2 · 5 Ana: 1 | ja | Be/Be | 6 | 5 Punkte | 3 |
| px_karriere | B | 1 Ve: 2 · 2 Er: 1 · 3 Ve: 2 · 4 An: 1 · 5 An: 1 | ja | An/An | 6 | 5 Punkte | – |
| px_planung | B | 1 Ana: 2 (Stufe) · 2 An: 1 · 3 An: 1 · 4 Ana: 1 · 5 Be: 2 (Stufe) | ja | Be/Be | 7 | 5 Punkte | – |
| px_produktion | B | 1 Ve: 1 · 2 An: 2 · 3 An: 2 · 4 Ana: 1 | ja | Ana/Ana | 6 | 5 Punkte | – |
| qualitaetssicherung | B | 1 Ve: 1 · 2 An: 5 · 3 An: 1 (Stufe) · 4 Ana: 1 (Stufe) · 5 Be: 1 | ja | Be/Be | 7 | 5 Punkte | – |
| rechnung_bestand | B/M | 1 An: 2 · 2 An: 1 · 3 Be: 3 · 4 An: 2 · 5 Be: 1 | ja | Be/Be | 6 | 5 Punkte | 3 |
| rechnung_beton | B | 1 An: 1 · 2 An: 2 · 3 An: 1 · 4 An: 2 · 5 Be: 1 | ja | Be/Be | 6 | 5 Punkte | 3 |
| rechnung_brandschutz | B/M | 1 An: 3 · 2 An: 1 · 3 An: 1 (Stufe) · 4 Ana: 1 · 5 Ve: 1 | ja | Ana/Ana | 6 | 5 Punkte | 3 |
| rechnung_holzbau | B | 1 An: 1 · 2 An: 2 · 3 An: 2 · 4 Be: 1 | ja | Be/Be | 6 | 5 Punkte | 3 |
| rechnung_mauerwerk | B | 1 An: 1 · 2 An: 2 · 3 An: 3 · 4 Ana: 1 | ja | Ana/Ana | 6 | 5 Punkte | 3 |
| rechnung_nachhaltigkeit | B/M | 1 An: 2 · 2 An: 3 · 3 Ana: 2 · 4 Be: 1 | ja | Be/Be | 6 | 5 Punkte | 3 |
| rechnung_schallschutz | B | 1 Ve: 1 · 2 An: 3 · 3 An: 5 · 4 Be: 1 | ja | Be/Be | 6 | 5 Punkte | 3 |
| rechnung_stahlbeton | B | 1 An: 1 · 2 An: 4 · 3 Be: 1 · 4 An: 1 | ja | Be/Be | 6 | 5 Punkte | 3 |
| rechnung_u_wert | B | 1 Er: 5 · 2 An: 1 · 3 Ana: 1 · 4 Be: 2 | ja | Be/Be | 6 | 5 Punkte | 3 |
| regularien | B | 1 Er: 2 · 2 Ve: 1 · 3 Ve: 1 · 4 An: 1 · 5 Ana: 2 (Stufe) | ja | Ana/Ve ✗ | 6 | 5 Punkte | – |
| ressourcen_umwelt | B | 1 Ve: 0 ✗ · 2 Ve: 1 · 3 An: 3 · 4 Be: 1 | ja | Be/Be | 6 | – | – |
| ressourceneffizienz | B/M | 1 Er: 1 · 2 Ve: 0 ✗ · 3 An: 2 · 4 An: 4 · 5 Be: 1 | ja | Be/Be | 6 | 5 Punkte | 3 |
| rueckbau | B | 1 Ve: 1 · 2 Ana: 1 · 3 An: 1 · 4 Be: 2 (Stufe) · 5 Ve: 0 ✗ | ja | Be/Be | 6 | 5 Punkte | – |
| schadensbilder | B | 1 Ve: 3 · 2 An: 1 · 3 An: 1 · 4 Ana: 0 ✗ · 5 Be: 2 (Stufe) | ja | Be/An ✗ | 6 | 5 Punkte | – |
| schadreaktionen_beton | B | 1 Ve: 1 · 2 An: 1 · 3 An: 2 · 4 Ana: 1 · 5 Be: 1 | ja | Be/Be | 6 | – | – |
| schadstoffe | B/M | 1 Er: 1 · 2 Ve: 1 · 3 An: 2 · 4 Ana: 1 (Stufe) · 5 Be: 1 | ja | Be/Be | 7 | 5 Punkte | – |
| schallschutz | B | 1 Ve: 2 · 2 An: 4 · 3 An: 5 · 4 Ana: 1 (Stufe) · 5 An: 4 | ja | Ana/Ana | 11 | 5 Punkte | 6 |
| schnellkarbonatisierung | B/M | 1 Ve: 3 · 2 An: 5 · 3 An: 3 · 4 Be: 1 (Stufe) | ja | Be/Be | 7 | 5 Punkte | 3 |
| schutz_grundlagen | B/M | 1 Er: 3 · 2 Ve: 2 · 3 An: 1 · 4 An: 1 (Stufe) · 5 Be: 1 | ja | Be/Be | 7 | – | 2 |
| sicherheitskonzept | B | 1 Er: 1 · 2 Ve: 3 · 3 An: 1 · 4 Ana: 4 · 5 Be: 1 | ja | Be/Be | 7 | – | 2 |
| sichtbeton | B | 1 Er: 1 · 2 Ve: 4 · 3 An: 1 · 4 Ana: 1 | ja | Ana/Ana | 6 | – | – |
| sommerlicher_waermeschutz | B | 1 Ve: 4 · 2 An: 5 · 3 An: 2 · 4 Ana: 2 · 5 Be: 3 | ja | Be/Be | 8 | 5 Punkte | 3 |
| sonderbetone | B/M | 1 Ve: 2 · 2 Ana: 0 ✗ · 3 An: 0 ✗ · 4 Be: 1 | ja | Be/Be | 7 | 5 Punkte | – |
| sonstiges | B/M | 1 Ve: 2 · 2 An: 2 · 3 Ve: 1 · 4 Be: 1 | ja | Be/Be | 6 | – | – |
| spannbeton_grundlagen | M | 1 Ve: 1 · 2 Ana: 2 · 3 Be: 2 | ja | Be/Be | 6 | 5 Punkte | 2 |
| spannbeton_kennwerte | M | 1 Ve: 2 · 2 An: 1 · 3 An: 3 | ja | An/An | 6 | 5 Punkte | 3 |
| stahl | B | 1 Ve: 2 · 2 Er: 3 · 3 An: 1 · 4 Ana: 3 · 5 Be: 7 (Stufe) | ja | Be/Ana ✗ | 11 | 5 Punkte | 6 |
| stahlbau_ec3 | B | 1 Ve: 5 · 2 An: 5 · 3 An: 2 · 4 Ana: 3 | ja | Ana/Be | 8 | 5 Punkte | 3 |
| stahlbeton_bemessung | B | 1 Ve: 4 · 2 An: 1 · 3 An: 1 · 4 Ana: 1 (Stufe) | ja | Ana/An ✗ | 10 | 5 Punkte | 3 |
| statistik | B | 1 An: 2 · 2 An: 2 · 3 An: 5 · 4 Ana: 1 · 5 Be: 1 (Stufe) | ja | Be/Be | 11 | 5 Punkte | 6 |
| vdi6200 | B/M | 1 Er: 4 · 2 Ve: 3 · 3 An: 2 · 4 Ana: 2 · 5 Be: 1 | ja | Be/Be | 6 | 5 Punkte | 3 |
| waermeeigenschaften | B | 1 Ve: 2 · 2 An: 1 · 3 An: 2 · 4 An: 1 · 5 Be: 1 (Stufe) | ja | Be/An ✗ | 6 | – | 2 |
| weitere_organik | B | 1 Ve: 3 · 2 Ve: 1 · 3 Ana: 1 · 4 An: 2 · 5 Be: 1 | ja | Be/Be | 6 | – | – |
| wta | B/M | 1 Ve: 2 · 2 Ve: 3 · 3 An: 4 · 4 Ana: 4 · 5 Be: 3 (Stufe) | ja | Be/An ✗ | 6 | – | 3 |
| wu-bauwerke | B/M | 1 Er: 1 · 2 An: 1 · 3 Ana: 1 (Stufe) · 4 Be: 1 · 5 Ana: 2 | ja | Be/Be | 7 | 5 Punkte | 3 |
| zfp | B/M | 1 Ve: 1 (Stufe) · 2 An: 2 · 3 Be: 1 | ja | Be/Be | 7 | 5 Punkte | 3 |
