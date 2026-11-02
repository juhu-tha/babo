# Kein Ergebnis in der Anzeige (02.11.2026)

**Stand:** 02.11.2026 (Branch `ui/kein-ergebnis-anzeige-11-02`, Basis origin/main mit #305)
**Anlass:** Seit der Grenzfallprüfung der Rechenkerne (#305, `docs/pruefung/rechenkerne-grenzfaelle-2026-11-02.md`) liefern alle Kerne bei ungültiger Eingabe NaN (`nurGueltig` in `src/calc/plausibilitaet.ts`). Restrisiko: Anzeigen ohne Formatierer zeigen „NaN“; Diagramme, Ampeln und Klassen reagieren auf NaN mit dem else-Zweig (`x > grenz ? 'rot' : 'grün'` → bei NaN immer „grün“).
**Entscheidungen 02.11.2026:** (1) alle Rechner-Anzeigen statisch und im Browser prüfen und beheben; (2) F-1: Klassifizierer liefern für NaN „–“ statt einer echten Klasse, Typen und Anzeigen ziehen mit; (3) F-2/F-3 wie bestätigt, nicht geändert.
**Prüfvermerke (`src/data/pruefvermerke.ts`) und `src/data/quiz.json` sind nicht geändert.** Ergebnisse für gültige Eingaben sind unverändert (alle Referenz- und Tranchentests grün, Grenzfalltest #305 grün).

## Ergebnis

- **Statisch:** 0 offene Befunde. Geprüft wurden alle 171 Anzeige-Dateien (`.tsx`), die einen Rechenkern einbinden: jede Ausgabe eines Kernwerts ohne NaN-festen Formatierer und jeder Vergleich, dessen NaN-Zweig wie ein Erfolg aussieht. Behobene Stellen und 7 begründete Ausnahmen in Abschnitt 2.
- **F-1:** 31 Klassifizierer liefern „–“ (Zahlenklassen und Faktoren NaN); in 31 Kernfunktionen werden Klassen-, Stufen- und Bewertungsfelder ungültiger Ergebnisse auf „–“ gesetzt; die zugehörigen Anzeigen zeigen „–“ neutral statt der früheren Standardklasse (Abschnitt 1).
- **Browser:** 151 Routen (72 vom Typ `calculator` und 79 Module mit Rechenkern), 709 Reiterzustände, 2216 Fälle (209 Zahlenfelder mit 0, leer, −1; 871 Regler an ihren Bereichsgrenzen): kein „NaN“, „Infinity“ oder „undefined“ im sichtbaren Text, keine Konsolenfehler. Gefunden und behoben: 3 Befunde (Abschnitt 3); Endstand 0 (Tabelle in Abschnitt 4).
- **Export:** CSV (alle Laborprüfstände) schreibt bei NaN ein leeres Feld statt „NaN“; der IFC-Auszug (BIM-Baustoffe) schreibt „$“ (nicht gesetzt) statt `…MEASURE(NaN)`. PDF-Export ist ein Bild der Seite und folgt der Anzeige; JSON schreibt NaN als `null`.

## Werkzeuge

| Werkzeug | Zweck |
|---|---|
| `scripts/qa/kein-ergebnis-anzeige.mjs` | statische Prüfung mit dem TypeScript-Compiler: Kernwert (Herkunft aus `src/calc/` bzw. den Kernen in `src/utils/`, auch über lokale Variablen und Destrukturierung) in Template-String/KaTeX (T), `toFixed`/`String` (F), roher Zahl in JSX (J), Zahl + Text (P) ohne `formatDe*` oder NaN-geprüften Helfer; Vergleich als Bedingung, dessen NaN-Zweig grün/„ok“/✓ zeigt (V). `ALLE_VERGLEICHE=1` listet zusätzlich alle übrigen Vergleiche. |
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

Ausnahmen (im Test mit Begründung): Achsenbeschriftung der festen Bitumen-Reihe (Asphalt), Diagramm-Datenreihe f_req (Hydratation; NaN = Lücke), Jahreszahl der CBAM-Reihe, Formelindex der Leiteinwirkung (Sicherheitskonzept), Steinfestigkeitsklasse aus der Tabelle (Rechnung Mauerwerk), fester PFAS-Grenzwert, Hervorhebung der Schnellwahl-Schaltfläche (Spannbeton-Animation).

Nicht als Befund gewertet: Vergleiche, deren NaN-Zweig neutral oder rot ist (z. B. Ausnutzung > 100 % → rot, sonst grau; LCC-Ersparnis ≥ 0 → grün, sonst rot), sowie Anzeigen innerhalb eines Gültigkeitszweigs (`erg.gueltig && …`). Diagramm-Datenpunkte mit NaN zeichnen Chart.js und Recharts als Lücke; SVG-Bühnen mit NaN-Koordinaten fand die Browserprüfung (Abschnitt 3).

## 3. Browserprüfung – Befunde und Behebung

| Route / Reiter | Eingabe | Befund | Behebung |
|---|---|---|---|
| `messen_pruefen` › Ringversuche | Erweiterungsfaktor k = −1 | Konsolenfehler `<circle> cx: "NaN"` (Youden-Plot) | Punkt „Ihr Labor“ nur bei gültigem Ergebnis; Statuskarten z-Score/E_n bei „–“ neutral (vorher rot „nicht akzeptabel“) |
| `schnellkarbonatisierung` › Rechner | Lagerungsdauer leer | Konsolenfehler `<line>/<circle>: "NaN"` (beide Diagramme) | Achsen nur aus endlichen Eingaben, Messpunkte und Linien mit NaN entfallen |
| `spannbeton_kennwerte` › Querschnitts-Rechner (Übersicht, Rechengang) | Querschnittshöhe h = 300 mm (Reglerminimum, |e_p| ≥ h/2) | Fehlerhinweis und zugleich **„1054 MPa ✓ OK“** und weitere Nachweise | Rechnung im Modul (nicht im Kern): bei Fehlerhinweis kein Zahlenergebnis (`ohneZahlen`), Randspannungs-Karten, Status-Badges und Nachweistabelle durch „–“ ersetzt |

Die beiden ersten Befunde stammen aus dem ersten Lauf (nur Zahlenfelder), der dritte aus dem zweiten Lauf (mit Reglern). Nachlauf auf dem Endstand: siehe Abschnitt 4.
