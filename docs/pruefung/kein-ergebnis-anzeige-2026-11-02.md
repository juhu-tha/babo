# Kein Ergebnis in der Anzeige (02.11.2026)

**Stand:** 02.11.2026 (Branch `ui/kein-ergebnis-anzeige-11-02`, Basis origin/main mit #305)
**Anlass:** Seit der Grenzfallprüfung der Rechenkerne (#305, `docs/pruefung/rechenkerne-grenzfaelle-2026-11-02.md`) liefern alle Kerne bei ungültiger Eingabe NaN (`nurGueltig` in `src/calc/plausibilitaet.ts`). Restrisiko: Anzeigen ohne Formatierer zeigen „NaN“; Diagramme, Ampeln und Klassen reagieren auf NaN mit dem else-Zweig (`x > grenz ? 'rot' : 'grün'` → bei NaN immer „grün“).
**Entscheidungen 02.11.2026:** (1) alle Rechner-Anzeigen statisch und im Browser prüfen und beheben; (2) F-1: Klassifizierer liefern für NaN „–“ statt einer echten Klasse, Typen und Anzeigen ziehen mit; (3) F-2/F-3 wie bestätigt, nicht geändert.
**Prüfvermerke (`src/data/pruefvermerke.ts`) und `src/data/quiz.json` sind nicht geändert.** Ergebnisse für gültige Eingaben sind unverändert (alle Referenz- und Tranchentests grün, Grenzfalltest #305 grün).

## Ergebnis

- **Statisch:** 0 offene Befunde. Geprüft wurden alle 171 Anzeige-Dateien (`.tsx`), die einen Rechenkern einbinden: jede Ausgabe eines Kernwerts ohne NaN-festen Formatierer und jeder Vergleich, dessen NaN-Zweig wie ein Erfolg aussieht. Behobene Stellen und 7 begründete Ausnahmen in Abschnitt 2.
- **F-1:** 29 Klassifizierer liefern für keine Zahl jetzt „–“ (3 Zahlenklassen NaN; zusammen mit den schon vorher richtigen `riebwClass` und `ausbreitklasse` 31 im Test); in 31 Kernfunktionen werden Klassen-, Stufen- und Bewertungsfelder ungültiger Ergebnisse auf „–“ gesetzt; die zugehörigen Anzeigen zeigen „–“ neutral statt der früheren Standardklasse (Abschnitt 1).
- **Browser:** 151 Routen (72 vom Typ `calculator` und 79 Module mit Rechenkern), 709 Reiterzustände, 2216 Fälle (209 Zahlenfelder mit 0, leer, −1; 871 Regler an ihren Bereichsgrenzen): kein „NaN“, „Infinity“ oder „undefined“ im sichtbaren Text, keine Konsolenfehler. Gefunden und behoben: 4 Befunde (Abschnitt 3); Endstand 0 (Tabelle in Abschnitt 4).
- **Export:** CSV (alle Laborprüfstände) schreibt bei NaN ein leeres Feld statt „NaN“; der IFC-Auszug (BIM-Baustoffe) schreibt „$“ (nicht gesetzt) statt `…MEASURE(NaN)`. PDF-Export ist ein Bild der Seite und folgt der Anzeige; JSON schreibt NaN als `null`.

## Werkzeuge

| Werkzeug | Zweck |
|---|---|
| `scripts/qa/kein-ergebnis-anzeige.mjs` | statische Prüfung mit dem TypeScript-Compiler: Kernwert (Herkunft aus `src/calc/` bzw. den Kernen in `src/utils/`, auch über lokale Variablen und Destrukturierung) in Template-String/KaTeX (T), `toFixed`/`toExponential`/`String` (F), roher Zahl in JSX (J), Zahl + Text (P) ohne `formatDe*` oder NaN-geprüften Helfer; Vergleich als Bedingung, dessen NaN-Zweig grün/„ok“/✓ zeigt (V). `ALLE_VERGLEICHE=1` listet zusätzlich alle übrigen Vergleiche. |
| `scripts/qa/rechner-routen.mjs` | Routenliste: Registry-Typ `calculator` plus jedes Modul, dessen Komponente (transitiv, auch lazy) einen Kern einbindet. |
| `scripts/qa/kein-ergebnis-browser.mjs` | Playwright: je Route und Reiter (eine Ebene verschachtelt) die ersten 6 Zahlenfelder mit 0, leer, −1 und die ersten 8 Regler mit min und max bedienen; Befund bei „NaN“/„Infinity“/„undefined“, bei einem Erfolgstext (✓, „OK“, „erfüllt“, „eingehalten“ …), der neben einem Fehlerhinweis neu erscheint, und bei Konsolenfehlern. `--json` schreibt die Tabelle. |
| `tests/keinErgebnisAnzeige.test.ts` | Regressionstest (in `npm test`): A statische Prüfung ohne Befund außer den Ausnahmen; B 31 Klassifizierer mit NaN/±∞ → „–“ (gültige Zahl → echte Klasse), 3 Zahlenklassen → NaN; C alle 1377 ungültigen Kernfälle der Fixture aus #305 (NaN, −1, 0 je Zahlenfeld) ohne Textfeld mit einer echten Klasse, außer 7 Eingabe-Echos. |

Neue Hilfe in `src/calc/plausibilitaet.ts`: `KEINE_KLASSE = '–'` (Typ `KeineKlasse`) und `nurGueltig(ergebnis, klassen)` – das zweite Argument nennt die Klassenfelder, die bei ungültigem Ergebnis auf „–“ gesetzt werden.

## 1. Klassifizierer (F-1)

Vorher ordneten Vergleichsketten NaN immer der letzten Klasse zu. Jetzt gilt: keine Zahl → „–“; die Typen sind um `KeineKlasse` erweitert. Wo der Klassentyp auch als Eingabe dient (Auswahlliste), bleibt der Eingabetyp unverändert und nur der Rückgabetyp des Klassifizierers lautet `Klasse | KeineKlasse` (`Bauart`, `Schutzdauerklasse`, `Festigkeitsentwicklung`, `OberflaechenTemp`, `Gefuegeklasse`, `Verformungsphase`).

| Klassifizierer | vorher bei NaN | nachher |
|---|---|---|
| `potentialStufe`, `potentialStatus`, `potentialRisikoZfp` | „gering“ / „passiv“ | „–“ |
| `effizienzklasse` (GEG/GModG) | „H“ | „–“ |
| `torrentKlasse` | 1 | „–“ |
| `torrentFeuchte`, `thermografieStufe` | „normal“ / „unauffällig“ | „–“ |
| `schulnoteAusZustandsnote` | 6 | „–“ |
| `normalmoertelGruppe` | „NM IIIa“ | „–“ (`fvk0NA`: Gruppe „–“, f_vk0 NaN) |
| `saugKlasse` | „wassersaugend“ | „–“ |
| `schutzdauerklasse` | „VH“ | „–“ |
| `bereichCSE` | „hoch“ | „–“ |
| `schadensStufe` | „abplatzung“ | „–“ (bei depassiviertem Stahl) |
| `rissgefahrAusDeltaT`, `festigkeitsentwicklungAusR`, `oberflaechenTempBereich` | „Gering“ / „sehr_langsam“ / „<5“ | „–“ |
| `fliesenGruppe`, `scherbenTyp` | „BIII“ / „porös …“ | „–“ |
| `zustandsformISO14688`, `gefuegeRaumtemperatur` | „fest“ / „Ledeburit II + Primärzementit“ | „–“ |
| `schweisseignung` | „schlecht“, „Vorwärmen erforderlich“ | „–“, „–“ |
| `effizienzKlasseThg` | „Referenz“ | „–“ |
| `bauartAusCwirk` | „mittel“ | „–“ |
| `stahlVerformungsphase`, `gefuegeklasse` | „einschnuerung“ / „ferritisch“ | „–“ |
| `classFor` (Bestand) | „< C8/10“ | „–“ |
| Zahlenklassen `xiLimit`, `trockenFaktor`, `margin13791` | 0,45 / 0,92 / 1 | NaN |
| `riebwClass`, `ausbreitklasse`, `bereichAmSieb` | – | unverändert („ungültig“, „–“, `undefined` seit #305) |

**Klassenfelder in Kern-Ergebnissen.** `nurGueltig` (#305) setzt bei Fehlern nur Zahlen auf NaN; Texte blieben erhalten. Dadurch trug ein ungültiges Ergebnis weiter eine aus der ungültigen Eingabe abgeleitete Klasse (z. B. Karsten −1 ml → „wasserabweisend“, Prüfzeit 0 → „wasserabweisend“, Luftgehalt ungültig → „keineAnforderung“, Zinkschutz ungültig → Klasse „L“, „nicht erfüllt“). Jetzt „–“ in diesen 31 Kernfunktionen:

| Kern | Felder |
|---|---|
| `asphalt.ntaModell` | `bewertung` |
| `bauchemie.stellmittelRheologie` | `dosierung`, `kraftaufwand` |
| `bauwerksuntersuchung.befundSynthese` | `overallRisk`, `potentialStatus` |
| `bauwerksuntersuchung.chlorid`, `.ultraschall`, `.rueckprall`, `.bohrkern`, `.insituDruckfestigkeit13791`, `.karsten` | `stufe` bzw. `klasse`, `bezug` |
| `karsten.karstenAuswertung` | `klasse` |
| `eigenspannungen.eigenspannungsVerlauf` | `zugLage` |
| `eisenKohlenstoff.cevBewertung`, `.feCZustand` | `stufe`, `vorwaermen`, `werkstoff` |
| `energieausweis.energieausweis` | `klasse` |
| `erdbau.bodengruppe` | `gruppe`, `name`, `frost`, `tauglich` |
| `frischbeton.bewerteLuftgehalt` | `bewertung` |
| `hydratation.hydratation` | `rissgefahr` |
| `keramik.keramikKennwerte` | `gruppe`, `scherben` |
| `korrosion.lokalelement` | `stufe` |
| `korrosionsschutz.zinkSchutzdauer` | `klasseUnguenstig`, `klasseGuenstig`, `bewertung` |
| `lca.lcaBilanz` | `aussage` |
| `materialoptimierung.dafstbVergleich` | `efficiencyClass` |
| `pruefverfahren.wenner`, `.karstenZfp`, `.durchstrahlung`, `.ringversuch`, `.zugversuchStahl`, `.holzSchaetzung` | `stufe`, `zStatus`, `enStatus`, `einstufung`, `niveau` |
| `spannbeton.dehnungsZustand` | `zustand` |
| `verkehrswegebau.schienenTemperatur` | `status` |
| `werkstoffmodelle.woehlerEc3` | `bereich` |

Bewusst unverändert (Eingabe-Echos, im Test als Ausnahme geführt): Rastermaß der Probenahme, Fließgrenzen-Verfahren, BSP-Ansatz, Rechtsstand des Energieausweises, Zementklasse im Kriechmodell; `expositionsklassen.huellwerte` (Tabellenwerte, Ausnahme bereits in #305).

**Anzeigen.** Jede Anzeige, die eine dieser Klassen auswertet, zeigt bei „–“ neutral „–“ (grau, ohne Häkchen/Warnsymbol) statt der früheren Standardklasse. Betroffen: ZfP (Potential, Wenner, Torrent, Karsten, Thermografie, Durchstrahlung), Prüfverfahren-Simulatoren (Potentialfeld, Ultraschall, Chlorid, Karsten), Interpretations-Navigator (Gefährdungsstufe, Potentialstatus), Messen & Prüfen (z-Score, E_n), Korrosion (Schadensstufe), Korrosionsschutz (Schutzdauerklasse, Bewertung), Frischbeton (Luftgehalt), Asphalt (NTA-Bewertung), Bauchemie (Stellmittel), Energieausweis (Klasse, Einordnung), Erdbau (Bodengruppe, Frostklasse), Materialoptimierung (THG-Klasse), Mechanische Prüfungen (Stahl-Einstufung, Holz-Niveau), Hydratation (Rissgefahr), Eisen-Kohlenstoff (Grenzwert CEV), Stahl (Verformungsphase, Gefügeklasse), Bahnbau (Gleisstatus), Spannbeton-Dehnungsanimation (Zustand), Potentialmessung (Laborhandout), Zustandsbewertung (Schulnote).

## 2. Statische Prüfung – behobene Stellen und Ausnahmen

| Datei | Stelle | vorher | nachher |
|---|---|---|---|
| `BpBetonzusatzmittel.tsx` | w/z-Nachweis | leeres Feld → NaN → **„hält den Grenzwert sicher ein“** (grün) | „–“ neutral |
| `Eigenspannungen.tsx` | Rissgefahr | NaN > f_ctm falsch → **„keine Risse“** (grün) | „–“ neutral |
| `Asphalt.tsx` | Aerosol/AGW (Ampel, Balken, Text) | NaN → grün „unter AGW“ | „–“ neutral, Balken 0 |
| `SpannbetonDehnungsAnimation.tsx` | Farben von ε/σ am Rand (7 Stellen) | NaN → grün | grau bei ungültigem Zustand |
| `InterpretationNavigator.tsx` | Passivierungsreserve | NaN → „Schutzhülle intakt“ (grün) | „–“ |
| `RechnungMauerwerk.tsx` | Grenzschlankheit | NaN → „eingehalten“ | kein Satz |
| `EisenKohlenstoff.tsx` | CEV-Grenzwert S235JR/S355J2 | NaN → „überschritten“ | „–“ |
| `BahnbauTab.tsx` | ΔT ≤ 0 roh, σ_T-Zusatz | `NaN K`, „(Zug)“ | `formatDeWert`, kein Zusatz |
| `Energieausweis.tsx` | Q_T, Q_V roh | `{q_t_jahr}` | `formatDeWert` |
| `BetonDauerhaftigkeitsSimulator.tsx` | Restjahre (3 Stellen) roh | `{safeYearsRemaining} Jahre` | `formatDeWert` |
| `BodenMaterialAufbereitung.tsx`, `BpTrockenbau.tsx`, `BetondeckenTab.tsx`, `TiefbauTab.tsx` | Anzahlen roh (Untersuchungseinheiten, Schrauben, Dübel/Anker, Sickerboxen) | `Math.max(1, NaN)` → „NaN“ | `formatDeGanzzahl` |
| `KennwerteEinpressmoertel.tsx` | A_p roh | `{n · A_p}` | `formatDeWert` |
| `PruefverfahrenSimulatoren.tsx` | Schlankheit Bohrkern | `toFixed`, Bezug aus Text | `formatDeZahl`, Bezug aus Zahl |
| `BpVerkehrswegebau.tsx` | Luftporen | `toFixed` | `formatDeZahl` |
| `BpLehmbauprodukte.tsx`, `RechnungBestand.tsx` | KaTeX mit `${f_d·1000}`, `${insitu.fck}` | Rohzahl in der Formel | `formatDeTeXWert` |
| `Schnellkarbonatisierung.tsx`, `PfasBaustoffe.tsx` | Anzahl im Rechenweg | `${n}` | `formatDeGanzzahl` |
| `Spaltzugversuch.tsx`, `labExportUtils.ts` | CSV-Export | „NaN“ in der Zelle | leeres Feld |
| `BimBaustoffe.tsx` | IFC-Auszug | `IFCMASSDENSITYMEASURE(NaN)` | `$` |
| `Spannbeton.tsx`, `StahlWerkstoffkunde.tsx`, `Elastomechanik.tsx` | `toExponential` (I_c, N_R, ε) | „NaN“ | „–“ |

Ausnahmen (im Test mit Begründung): Achsenbeschriftung der festen Bitumen-Reihe (Asphalt), Diagramm-Datenreihe f_req (Hydratation; NaN = Lücke), Jahreszahl der CBAM-Reihe, Formelindex der Leiteinwirkung (Sicherheitskonzept), Steinfestigkeitsklasse aus der Tabelle (Rechnung Mauerwerk), fester PFAS-Grenzwert, Hervorhebung der Schnellwahl-Schaltfläche (Spannbeton-Animation).

Nicht als Befund gewertet: Vergleiche, deren NaN-Zweig neutral oder rot ist (z. B. Ausnutzung > 100 % → rot, sonst grau; LCC-Ersparnis ≥ 0 → grün, sonst rot), sowie Anzeigen innerhalb eines Gültigkeitszweigs (`erg.gueltig && …`). Diagramm-Datenpunkte mit NaN zeichnen Chart.js und Recharts als Lücke; SVG-Bühnen mit NaN-Koordinaten fand die Browserprüfung (Abschnitt 3).

## 3. Browserprüfung – Befunde und Behebung

| Route / Reiter | Eingabe | Befund | Behebung |
|---|---|---|---|
| `messen_pruefen` › Ringversuche | Erweiterungsfaktor k = −1 | Konsolenfehler `<circle> cx: "NaN"` (Youden-Plot) | Punkt „Ihr Labor“ nur bei gültigem Ergebnis; Statuskarten z-Score/E_n bei „–“ neutral (vorher rot „nicht akzeptabel“) |
| `schnellkarbonatisierung` › Rechner | Lagerungsdauer leer | Konsolenfehler `<line>/<circle>: "NaN"` (beide Diagramme) | Achsen nur aus endlichen Eingaben, Messpunkte und Linien mit NaN entfallen |
| `spannbeton_kennwerte` › Querschnitts-Rechner (Übersicht, Rechengang) | Querschnittshöhe h = 300 mm (Reglerminimum, |e_p| ≥ h/2) | Fehlerhinweis und zugleich **„1054 MPa ✓ OK“** und weitere Nachweise | Rechnung im Modul (nicht im Kern): bei Fehlerhinweis kein Zahlenergebnis (`ohneZahlen`), Randspannungs-Karten, Status-Badges und Nachweistabelle durch „–“ ersetzt; im Rechengang I_c über `toExponential` → „NaN“ (Nachlauf), jetzt „–“ |

Die beiden ersten Befunde stammen aus dem ersten Lauf (nur Zahlenfelder), der dritte aus dem zweiten Lauf (mit Reglern). Nachlauf auf dem Endstand: siehe Abschnitt 4.

## 4. Ergebnistabelle Browserprüfung

Lauf 2 (alle 151 Routen, Zahlenfelder und Regler; `node scripts/qa/kein-ergebnis-browser.mjs --alle`). Je Route: geprüfte Reiterzustände, bediente Zahlenfelder (je 0, leer, −1) und Regler (je min, max), Fälle, Fälle mit angezeigtem Fehlerhinweis („Eingabe unzulässig“) und Befunde (NaN/Infinity/undefined sichtbar, Erfolg trotz Fehler, Konsolenfehler). 19 Routen haben keine frei bedienbare Zahleneingabe (nur Auswahllisten oder feste Beispiele); sie wurden auf Rohwerte im Ausgangszustand und Konsolenfehler geprüft.

Nachlauf auf dem Endstand (nach main-Merge und allen Korrekturen): `spannbeton_kennwerte`, `spannbeton_grundlagen`, `stahl`, `mechanische_kenngroessen`, `festigkeit`, `pfas_baustoffe`, `lebenszyklus_kosten`, `messen_pruefen`, `schnellkarbonatisierung`, `bp_betonzusatzmittel`, `eigenspannungen`, `asphalt` – 12 Routen, 0 Befunde (`spannbeton_kennwerte` nach der Korrektur `toExponential` im Rechengang).

| Route | Zustände (Reiter) | Zahlenfelder | Regler | Fälle | davon mit Fehlerhinweis | Befunde |
|---|---:|---:|---:|---:|---:|---|
| `nachhaltigkeit_daten_regeln` | 6 | 0 | 1 | 2 | 0 | 0 |
| `materialoptimierung` | 3 | 0 | 0 | 0 | 0 | 0 |
| `oekobilanz_lca` | 11 | 0 | 9 | 18 | 0 | 0 |
| `lca_rechner` | 5 | 11 | 19 | 69 | 16 | 0 |
| `lca_ingenieurbau` | 4 | 0 | 3 | 6 | 0 | 0 |
| `lca_regulatorik` | 2 | 0 | 0 | 0 | 0 | 0 |
| `lebenszyklus_kosten` | 4 | 0 | 8 | 9 | 0 | 0 |
| `ressourcen_umwelt` | 5 | 0 | 0 | 0 | 0 | 0 |
| `bim_baustoffe` | 1 | 0 | 4 | 8 | 0 | 0 |
| `materialdatenbanken` | 1 | 5 | 0 | 15 | 0 | 0 |
| `materialpaesse` | 1 | 0 | 2 | 4 | 0 | 0 |
| `dpp` | 5 | 0 | 0 | 0 | 0 | 0 |
| `ki_prompting` | 1 | 0 | 0 | 0 | 0 | 0 |
| `rechnung_u_wert` | 1 | 0 | 3 | 5 | 0 | 0 |
| `rechnung_beton` | 4 | 0 | 10 | 20 | 0 | 0 |
| `rechnung_stahlbeton` | 1 | 2 | 1 | 8 | 0 | 0 |
| `rechnung_holzbau` | 1 | 0 | 3 | 5 | 0 | 0 |
| `rechnung_mauerwerk` | 1 | 0 | 3 | 5 | 0 | 0 |
| `rechnung_nachhaltigkeit` | 2 | 0 | 10 | 18 | 0 | 0 |
| `rechnung_bestand` | 2 | 0 | 1 | 2 | 0 | 0 |
| `rechnung_schallschutz` | 1 | 0 | 2 | 4 | 0 | 0 |
| `rechnung_brandschutz` | 2 | 2 | 1 | 8 | 0 | 0 |
| `einheiten` | 2 | 1 | 0 | 3 | 0 | 0 |
| `baustoffkenngroessen` | 9 | 0 | 29 | 53 | 0 | 0 |
| `formaenderungen` | 9 | 0 | 6 | 12 | 0 | 0 |
| `labor` | 10 | 0 | 5 | 3 | 0 | 0 |
| `mechanische_pruefungen` | 1 | 0 | 3 | 6 | 0 | 0 |
| `messen_pruefen` | 5 | 3 | 5 | 17 | 2 | 0 |
| `probenahme` | 2 | 0 | 5 | 10 | 0 | 0 |
| `statistik` | 4 | 4 | 6 | 24 | 0 | 0 |
| `online_tools` | 2 | 0 | 0 | 0 | 0 | 0 |
| `bindemittel` | 8 | 0 | 7 | 14 | 0 | 0 |
| `mischungsberechnung` | 7 | 1 | 19 | 41 | 0 | 0 |
| `frischbeton` | 5 | 7 | 13 | 47 | 4 | 0 |
| `hydratation_folgen` | 11 | 0 | 33 | 66 | 0 | 0 |
| `nachbehandlung` | 1 | 0 | 4 | 8 | 0 | 0 |
| `festbeton` | 4 | 2 | 4 | 14 | 0 | 0 |
| `betonkennwerte` | 6 | 6 | 1 | 20 | 0 | 0 |
| `festbeton_statistik` | 1 | 0 | 4 | 8 | 0 | 0 |
| `labor_potentialmessung` | 6 | 4 | 0 | 12 | 0 | 0 |
| `labor_auslagerung` | 6 | 4 | 0 | 12 | 0 | 0 |
| `labor_frischbeton` | 6 | 4 | 0 | 12 | 0 | 0 |
| `labor_druckfestigkeit` | 6 | 3 | 0 | 9 | 0 | 0 |
| `labor_moertelprismen` | 6 | 3 | 0 | 9 | 0 | 0 |
| `sicherheitskonzept` | 3 | 0 | 3 | 6 | 0 | 0 |
| `biokohlebeton` | 5 | 6 | 0 | 18 | 13 | 0 |
| `betonpraxis` | 6 | 1 | 5 | 13 | 0 | 0 |
| `expositionsklassen` | 5 | 12 | 0 | 36 | 0 | 0 |
| `korrosion` | 4 | 0 | 16 | 32 | 0 | 0 |
| `schnellkarbonatisierung` | 5 | 6 | 0 | 18 | 6 | 0 |
| `lebensdauerbemessung` | 7 | 6 | 0 | 18 | 14 | 0 |
| `schadreaktionen_beton` | 4 | 0 | 8 | 16 | 0 | 0 |
| `zwang` | 1 | 0 | 5 | 10 | 0 | 0 |
| `eigenspannungen` | 1 | 0 | 7 | 14 | 0 | 0 |
| `kriechen` | 3 | 0 | 7 | 14 | 0 | 0 |
| `wu-bauwerke` | 5 | 0 | 3 | 6 | 0 | 0 |
| `holz` | 5 | 0 | 11 | 22 | 0 | 0 |
| `holzwerkstoffe` | 4 | 0 | 0 | 0 | 0 | 0 |
| `festigkeit` | 2 | 0 | 5 | 10 | 0 | 0 |
| `erdbau` | 4 | 0 | 3 | 6 | 0 | 0 |
| `stahl` | 8 | 6 | 12 | 42 | 12 | 0 |
| `bp_stahlbauprofile` | 1 | 2 | 3 | 12 | 0 | 0 |
| `mauerwerk` | 5 | 0 | 8 | 14 | 0 | 0 |
| `keramik_ziegel` | 6 | 4 | 0 | 12 | 10 | 0 |
| `glas` | 4 | 0 | 4 | 8 | 0 | 0 |
| `asphalt` | 5 | 0 | 6 | 12 | 0 | 0 |
| `putzemoertel` | 5 | 4 | 4 | 20 | 12 | 0 |
| `gesteine` | 5 | 0 | 0 | 0 | 0 | 0 |
| `bauchemie` | 7 | 0 | 4 | 5 | 0 | 0 |
| `kunststoffe` | 5 | 0 | 1 | 2 | 0 | 0 |
| `membranen_etfe` | 6 | 0 | 6 | 12 | 1 | 0 |
| `lehm` | 4 | 0 | 4 | 8 | 0 | 0 |
| `bp_lehmbauprodukte` | 4 | 0 | 2 | 3 | 0 | 0 |
| `metalle` | 2 | 0 | 0 | 0 | 0 | 0 |
| `gips` | 4 | 0 | 0 | 0 | 0 | 0 |
| `kalk` | 4 | 0 | 0 | 0 | 0 | 0 |
| `daemmstoffe` | 2 | 0 | 0 | 0 | 0 | 0 |
| `bp_trockenbau` | 5 | 1 | 0 | 3 | 0 | 0 |
| `bp_verkehrswegebau` | 8 | 1 | 14 | 23 | 0 | 0 |
| `bp_verkehr_rsto` | 8 | 1 | 14 | 23 | 0 | 0 |
| `bp_verkehr_asphalt` | 6 | 1 | 12 | 22 | 0 | 0 |
| `bp_verkehr_bitumen` | 6 | 1 | 12 | 22 | 0 | 0 |
| `bp_verkehr_pruefung` | 6 | 1 | 14 | 23 | 0 | 0 |
| `bp_verkehr_betondecken` | 8 | 1 | 14 | 23 | 0 | 0 |
| `bp_verkehr_tiefbau` | 8 | 1 | 14 | 23 | 0 | 0 |
| `bp_verkehr_bahn` | 8 | 1 | 14 | 23 | 0 | 0 |
| `bp_verkehr_tunnel` | 8 | 1 | 14 | 23 | 0 | 0 |
| `bp_abdichtung` | 3 | 0 | 0 | 0 | 0 | 0 |
| `bp_daemmung` | 4 | 0 | 1 | 2 | 0 | 0 |
| `bp_putz_estrich` | 4 | 0 | 0 | 0 | 0 | 0 |
| `bp_holzprodukte` | 1 | 0 | 6 | 4 | 0 | 0 |
| `bp_kunststoffe` | 7 | 0 | 4 | 4 | 0 | 0 |
| `bp_farben_lacke` | 7 | 2 | 4 | 14 | 0 | 0 |
| `bp_mineralisch` | 3 | 0 | 6 | 12 | 0 | 0 |
| `bp_glaeser` | 6 | 0 | 7 | 14 | 0 | 0 |
| `bp_metallisch` | 1 | 3 | 0 | 9 | 0 | 0 |
| `bp_betonzusatzmittel` | 5 | 6 | 0 | 18 | 0 | 0 |
| `mechanische_kenngroessen` | 7 | 0 | 7 | 14 | 0 | 0 |
| `materialmodelle` | 1 | 0 | 7 | 14 | 0 | 0 |
| `knicken` | 3 | 0 | 3 | 6 | 0 | 0 |
| `stahlbau_ec3` | 4 | 0 | 3 | 6 | 0 | 0 |
| `baustatik` | 2 | 0 | 9 | 18 | 0 | 0 |
| `bodenmechanik` | 5 | 0 | 14 | 28 | 2 | 0 |
| `bauphysik` | 3 | 4 | 5 | 17 | 12 | 0 |
| `feuchteschutz` | 1 | 4 | 3 | 18 | 12 | 0 |
| `sommerlicher_waermeschutz` | 5 | 6 | 0 | 18 | 10 | 0 |
| `schallschutz` | 2 | 4 | 0 | 12 | 12 | 0 |
| `energieausweis` | 4 | 0 | 1 | 2 | 0 | 0 |
| `emodul` | 1 | 0 | 4 | 8 | 0 | 0 |
| `carbonbeton` | 1 | 0 | 6 | 12 | 0 | 0 |
| `holzbau_info` | 2 | 0 | 0 | 0 | 0 | 0 |
| `holzbau_werkstoffe` | 1 | 4 | 0 | 12 | 0 | 0 |
| `holzbau_konstruktion` | 1 | 0 | 0 | 0 | 0 | 0 |
| `holzbau_bemessung` | 1 | 6 | 0 | 18 | 0 | 0 |
| `holzbau_verbindung` | 1 | 4 | 0 | 12 | 2 | 0 |
| `holzbau_bauphysik` | 1 | 5 | 1 | 15 | 7 | 0 |
| `waermeeigenschaften` | 1 | 0 | 6 | 12 | 0 | 0 |
| `spannbeton_grundlagen` | 3 | 0 | 0 | 0 | 0 | 0 |
| `spannbeton_kennwerte` | 3 | 0 | 19 | 38 | 2 | 2 (behoben, s. Abschnitt 3) |
| `bestand` | 4 | 0 | 3 | 6 | 0 | 0 |
| `bauwerkserfassung` | 4 | 5 | 1 | 17 | 11 | 0 |
| `bauwerksdiagnose` | 3 | 0 | 8 | 12 | 0 | 0 |
| `pruefverfahren_katalog` | 1 | 0 | 0 | 0 | 0 | 0 |
| `zfp` | 7 | 0 | 18 | 35 | 0 | 0 |
| `historisch` | 3 | 0 | 5 | 9 | 0 | 0 |
| `historische_bauweisen` | 4 | 0 | 14 | 9 | 0 | 0 |
| `altholz_urban_mining` | 6 | 0 | 8 | 16 | 0 | 0 |
| `pfas_baustoffe` | 6 | 6 | 1 | 20 | 6 | 0 |
| `ressourceneffizienz` | 4 | 0 | 4 | 8 | 0 | 0 |
| `vdi6200` | 4 | 0 | 1 | 0 | 0 | 0 |
| `abfaelle` | 16 | 2 | 0 | 6 | 0 | 0 |
| `rueckbau` | 6 | 0 | 1 | 2 | 0 | 0 |
| `boden_materialaufbereitung` | 4 | 1 | 1 | 5 | 0 | 0 |
| `wta` | 6 | 1 | 2 | 7 | 0 | 0 |
| `modernisierung` | 5 | 4 | 2 | 14 | 0 | 0 |
| `dauerhaftigkeit` | 9 | 0 | 4 | 7 | 0 | 0 |
| `korrosionsschutz_beschichtungen` | 6 | 0 | 2 | 4 | 0 | 0 |
| `bauwerksunters_monitoring` | 4 | 0 | 5 | 9 | 0 | 0 |
| `schutz_grundlagen` | 4 | 1 | 0 | 3 | 0 | 0 |
| `instandhaltung` | 6 | 0 | 6 | 9 | 0 | 0 |
| `px_bautagebuch` | 4 | 2 | 2 | 10 | 0 | 0 |
| `stahlbeton_bemessung` | 14 | 3 | 37 | 83 | 14 | 0 |
| `spannung` | 14 | 3 | 37 | 83 | 14 | 0 |
| `biegebemessung` | 10 | 0 | 16 | 32 | 0 | 0 |
| `querkraftbemessung` | 10 | 0 | 18 | 36 | 0 | 0 |
| `stuetzenbemessung` | 10 | 0 | 17 | 34 | 3 | 0 |
| `durchstanzen` | 10 | 0 | 16 | 32 | 0 | 0 |
| `verankerungslaenge` | 10 | 3 | 14 | 37 | 11 | 0 |
| `rissbreite` | 14 | 3 | 37 | 83 | 14 | 0 |
| `kombinationen` | 7 | 4 | 1 | 14 | 12 | 0 |
| `faserverbund` | 7 | 4 | 1 | 14 | 12 | 0 |
| **Summe (151 Routen)** | 709 | 209 | 871 | 2216 | 246 | 2 |

## 5. Nebenbefund aus main

Mit Nachstichprobe 5c (#307) kam `pfas.istKurzkettig` hinzu; der Grenzfalltest aus #305 (R7 Vollständigkeit) meldete die Funktion ohne Basis. Eingetragen als begründete Ausnahme (Prädikat über die Stoffdaten der PFAS-20-Liste, keine Nutzereingabe).
