# Grenzfallprüfung der Rechenkerne (02.11.2026)

**Stand:** 02.11.2026 (Branch `qa/rechenkerne-grenzfaelle-11-02`, Basis origin/main)
**Anlass:** Die Gegenprüfung vom 30.10.2026 fand im Spannbeton-Kern ein Zahlenergebnis trotz `gueltig = false` (GC-SB-1, `docs/pruefung/gegenpruefung-2026-10-30.md`).
**Auftrag:** Alle Rechenkerne in `src/calc/` und die Rechenkerne in `src/utils/` (`bestandKern`, `ec2Spannbeton`, `rheologySim`, `schadensKern`) systematisch mit Grenzfällen prüfen: 0, negative Werte, NaN/∞, leere Eingaben, sehr große und sehr kleine Werte, Bereichsgrenzen der Regler, Einheitenwechsel. Gefundene Fehler beheben; Ergebnisse für gültige Eingaben unverändert.
**Prüfvermerke (`src/data/pruefvermerke.ts`) und `src/data/quiz.json` sind nicht geändert.**

## Ergebnis

- **Geprüft:** 530 exportierte Funktionen in 79 Dateien, 2012 Zahlenfelder, je Feld 7 Störwerte (NaN, ∞, −∞, 0, −1, 10¹⁵, 10⁻¹⁵) – rund 14 000 Fälle; dazu 14 Anzahl-/Auflösungsparameter, 15 Monotonie- und Einheitenprüfungen, Reglergrenzen von 5 Modulen (18 Regler). Laufzeit des Tests etwa 5 s.
- **Gefunden und behoben:**
  - 14 Endlosschleifen bzw. Ausnahmen (Abschnitt A),
  - das GC-SB-1-Muster „Zahlenergebnis trotz Fehler“ in 60 Rechenkernen – jetzt einheitlich kein Zahlenergebnis (NaN, Anzeige „–“) über die neue Funktion `nurGueltig` (Abschnitt B),
  - 7 Nachweise, die bei ungültiger Eingabe „erfüllt“ meldeten oder melden konnten (Abschnitt C),
  - 16 fehlende Eingabeprüfungen, bei denen NaN oder ∞ ohne Hinweis durchliefen (Abschnitt D),
  - 32 Formeln, die NaN stillschweigend durch eine Zahl ersetzten (Abschnitt E),
  - 7 Stellen, die unvollständige Tabellenzeilen oder Einträge ohne Hinweis übergingen (Abschnitt F).
- **Gültige Eingaben unverändert:** Alle 505 automatisch gefundenen gültigen Basiseingaben liefern auf main und im Zweig byteweise dasselbe Ergebnis (Vergleichsskript); alle Referenz- und Tranchentests bleiben grün. Angepasst wurden nur Prüfungen bestehender Tests, die für **ungültige** Eingaben ausdrücklich eine Zahl (meist 0) erwarteten (Abschnitt H).
- **Monotonie** und **Einheitenwechsel**: alle 15 Prüfungen erfüllt, kein Befund.
- **Offene Fragen:** F-1 bis F-4 (am Ende), jeweils mit Vorschlag. Fachliche Grenzwerte wurden nicht neu festgelegt.

## Werkzeug

`tests/rechenkerneGrenzfaelle.test.ts` (eigenständig, deterministisch, ohne neues npm-Paket; läuft in `npm test` mit). Basiseingaben in `tests/fixtures/rechenkerne-basis.json`, erzeugt mit `npx tsx scripts/qa/rechenkerne-basis.ts`: Das Skript liest die Parametertypen aller exportierten Funktionen mit dem TypeScript-Compiler, sucht je Funktion eine gültige Basiseingabe und hält die Pfade der Zahlenfelder vom Typ `number` fest (Literaltypen wie `1 | 2 | 3` werden nicht gestört). Für 26 Kerne ohne automatisch findbare Basis stehen Handbasen im Test (aus den bestehenden Tests übernommen).

| Regel | Inhalt |
|---|---|
| R1 | keine Ausnahme, kein Hängen (alle Fälle) |
| R2 | Kern (Ergebnis mit `gueltig`/`hinweise`): ungültig markiert → keine endliche Zahl im Ergebnis und kein Nachweis als erfüllt (`ok`, `erfuellt`, `nachgewiesen`, `isOk`, `eingehalten`, `nachweis`) |
| R3 | Kern: nicht endliche Eingabe, die das Ergebnis ändert → ungültig markiert (bei Listen genügt ein neuer Warnhinweis, dass die Zeile übergangen wurde) |
| R4 | Kern: gültig markiert → keine ±∞ aus 0 oder −1 (Division durch null) |
| R5 | Formel (Ergebnis ohne Gültigkeit): NaN-Eingabe, die das Ergebnis ändert → mindestens ein NaN im Ergebnis |
| R6 | Monotonie, wo physikalisch zwingend; Einheitenwechsel hin und zurück |
| R7 | Vollständigkeit: jede exportierte Funktion hat eine Basis oder eine begründete Ausnahme |

Neue Kerne fallen über R7 auf; nach Änderungen an Signaturen das Skript neu laufen lassen. Fehlersuche bei hängenden Fällen: `GRENZFALL_VERLAUF=<Datei> npx tsx tests/rechenkerneGrenzfaelle.test.ts` schreibt den laufenden Fall mit.

Neue Hilfen in `src/calc/plausibilitaet.ts`: `ohneZahlen`, `nurGueltig`, `mitPruefung` (kein Zahlenergebnis bei Fehler), `istAnzahl` und `MAX_STUETZSTELLEN = 10 000` (technische Obergrenze für Stützstellen, kein Fachwert), `unvollstaendigeZeilen` (Warnung für teilweise ausgefüllte Zeilen). Für Tests: `tests/hilfen/keinErgebnis.ts`.

## A. Endlosschleifen und Ausnahmen (R1)

| Kern | Fall | vorher | nachher |
|---|---|---|---|
| `pruefverfahren.rueckprallKurven` | Schritt ≤ 0 oder ∞ | Endlosschleife | leere Kurven |
| `werkstoffmodelle.walzEigenspannung` | Punktzahl ∞ | Endlosschleife | kein Verlauf |
| `werkstoffmodelle.schweissEigenspannung` | Punktzahl ∞ | Endlosschleife | Fehlerhinweis, kein Ergebnis |
| `werkstoffmodelle.stahlKennlinienPunkte` | A = ±∞, A_g = 10¹⁵ | Endlosschleife | keine Punkte (A_g und ε_sh müssen in 0 … A liegen) |
| `werkstoffmodelle.bilinearKurve` | ε_max = 10¹⁵ ‰ | Ausnahme „Invalid array length“ | keine Punkte |
| `biegelinie.biegelinie` | Stützstellen ∞ | Endlosschleife | Fehlerhinweis |
| `eigenspannungen.eigenspannungsVerlauf` | Abschnitte ∞ bzw. 1 | Endlosschleife bzw. Verlauf trotz Fehler | Fehlerhinweis, kein Verlauf |
| `schadensKern.din1076Plan` | Jahre ∞ | Endlosschleife | leerer Plan |
| `lcc.lccOption` / `lccVergleich` | N = ∞ bzw. 10¹⁵ | Endlosschleife | Fehlerhinweis (Rechengrenze 1000 a, F-3) |
| `bauchemie.akrKurve` | Jahre 10¹⁵ | Ausnahme | Fehlerhinweis |
| `korrosion.karbonatisierungsKurve` | t_max = ∞ | Ausnahme | leere Liste |
| `korrosion.schnellUmrechnung` | Prüfdauer ∞ | Ausnahme | Fehlerhinweis |
| `spannungszustand.kreisPunkte` | n = ∞ | Ausnahme | keine Punkte |
| `holzbau.festigkeitswerte`, `bemesseDruckstab`, `bemesseQuerdruck` | Nutzungsklasse außerhalb 1 … 3 | Ausnahme „Cannot read properties of undefined“ | Fehlerhinweis |

In der Anzeige waren diese Fälle nicht erreichbar (feste Auflösungen, Auswahllisten, Regler 10 … 80 a); die Kerne sind aber auch für Übergaben und Tests abgesichert.

## B. Zahlenergebnis trotz Fehler (GC-SB-1-Muster, R2)

Bisher gab es zwei Konventionen nebeneinander: neuere Kerne lieferten bei Fehlern NaN (z. B. `spanngliedDeckung` seit GC-SB-1, `statik`), viele ältere (AP 4.5) 0 oder sogar gerechnete Zwischenwerte. Jetzt gilt in allen Kernen: **Fehlerhinweis bzw. `gueltig = false` → alle Zahlen NaN** (Struktur und Listenlängen bleiben, Texte und Wahrheitswerte ebenso; die Zahlformatierung zeigt „–“). Umgesetzt durch `nurGueltig(…)` an 279 Rückgabestellen in 60 Dateien. Beispiele (vollständige Liste über den Test):

| Kern | Fall | vorher | nachher |
|---|---|---|---|
| `bauwerksuntersuchung.chlorid` | Gehalt −1 % | Verhältnis −2, Grenze 0,5, ungültig | Verhältnis NaN, Grenze NaN, ungültig |
| `bauwerksuntersuchung.bohrkern` | Durchmesser −1 mm | Festigkeit 12 732 N/mm², ungültig | NaN, ungültig |
| `bauwerksuntersuchung.karbonatisierung` | Tiefe −1 mm | K −0,18, t_Depass 62 500 a, ungültig | NaN, ungültig |
| `bauwerksuntersuchung.insituDruckfestigkeit13791` | Mittelwert −1 | f_ck,is −7, ungültig | NaN, ungültig |
| `energieausweis.energieausweis` | Fläche −1 m² | H_T −3,65, q_h 224, ungültig | NaN, ungültig |
| `cbam.cbamKosten` | Menge −1 t | Zertifikate −0,025, Kosten 0,975, ungültig | NaN, ungültig |
| `biegung.bemesseBiegung` | b = 0 | A_s 0, µ_Ed 0 (Fehler) | NaN (Fehler) |
| `querkraft.bemesseQuerkraft` | V_Ed = −1 | a_sw 0, V_Rd,c 0 (Fehler) | NaN (Fehler) |
| `durchstanzen.bemesseDurchstanzen` | d = 0 | v_Rd,c 0, u₁ 0 (Fehler) | NaN (Fehler) |
| `stuetze.bemesseStuetze` | b = 0 | A_s 0, ν_Ed 0 (Fehler) | NaN (Fehler) |
| `rissbreite.bemesseRiss` | φ = 0 | w_k 0, s_r,max 0 (Fehler) | NaN (Fehler) |
| `verankerung.bemesseVerankerung` | φ = 0 | l_bd 0 (Fehler) | NaN (Fehler) |
| `holzbau.bemesseDruckstab` | b = 0 | F_c,Rd 0, k_mod 0 (Fehler) | NaN (Fehler) |
| `holzbau.verformterDruckstab` | N_d ≥ N_cr,d | N_cr,d 119,35 kN, ungültig | NaN, ungültig; N_cr,d = 119,4 kN jetzt im Fehlertext (F-2) |
| `mauerwerk.bemesseWandVereinfacht` | Φ₂ ≤ 0 (h = 4,5 m, t = 115 mm) | N_Rd 0, h_ef/t 29,3, Φ₂ −0,097 (Fehler) | NaN (Fehler); h_ef/t steht im Fehlertext (F-2) |
| `mischung.stoffraum` | Zement 0 | Gesteinsmasse 0 (Fehler) | NaN (Fehler) |
| `verkehrswegebau.asphaltHohlraum` | Raumdichte > Rohdichte (Tranche 7, PR3) | ρ_m 2,387, V −0,12 %, ungültig | NaN, ungültig (F-2) |
| `pruefverfahren.gumMessunsicherheit` | n = 1 | Mittel 40, U 0, ungültig | NaN, ungültig |
| `statistik.statistikAuswertung` | keine Werte | Mittelwert 0, ungültig | NaN, ungültig |
| `statistik.einstichprobenTTest`/`zweistichprobenTTest` | Fehler | Stichprobenkennwerte trotz Fehler | NaN |
| `korrosion.karbonatisierungsLebensdauer` | K = 0 | x_c trotz Fehler | NaN |
| `schnellkarbonatisierung.schnellkarbonatisierung` | keine Steigung bestimmbar | Regressionswerte trotz Fehler | NaN |
| `laborversuche.druckMittel196` | Serie zu verwerfen (zwei Ausreißer, DIN EN 196-1) | Mittel aus 5 Werten 48,76, verworfen 3, ungültig | NaN, ungültig; Mörtelprismen-Ergebnis bleibt gültig mit Warnung, ohne Klasse |
| `hydratation.verdunstungsrate` | r. F. 120 % | E = 0, ungültig | E = NaN, ungültig |

## C. Nachweis „erfüllt“ trotz Fehler (R2/R4)

| Kern | Fall | vorher | nachher |
|---|---|---|---|
| `bauwerksuntersuchung.haftzug` | Stempeldurchmesser 0 mm | f_ct = ∞, „ok“, **gültig** | Fehlerhinweis, f_ct NaN, nicht ok |
| `bauwerksuntersuchung.betondeckung` | gemessen ∞ | Differenz ∞, „ok“ | NaN, nicht ok |
| `bauwerksuntersuchung.impactEcho` | Fehler | Delamination gemeldet möglich | keine Delamination bei Fehler |
| `verkehrswegebau.westergaardRand` | E = 0 (ebenso Reifendruck 0, zul. Spannung 0, ν außerhalb 0 … 0,5) | σ_E = −∞, „ok“, **gültig** | Fehlerhinweis, NaN, nicht ok |
| `verkehrswegebau.spritzbetonRing` | Radius −∞ | Ausnutzung −∞, „ok“ | NaN, nicht ok |
| `verkehrswegebau.betondeckenFugen` | Fehler | „ok“ möglich | nicht ok |
| `verkehrswegebau.asphaltHohlraum` | Fehler | „ok“ möglich | nicht ok |

## D. Fehlende Eingabeprüfungen (R3/R4)

| Kern | Eingabe | vorher | nachher |
|---|---|---|---|
| `bauwerksuntersuchung.ultraschall` | Dichte, ν | ν = 0,6 → E_dyn −30,7 GPa, gültig | Fehlerhinweis (Dichte > 0, 0 ≤ ν < 0,5) |
| `bauwerksuntersuchung.impactEcho` | Formfaktor β | β = NaN → Dicke NaN, gültig | Fehlerhinweis (β > 0) |
| `durchstanzen.bemesseDurchstanzen` | f_yk (optional) | NaN ohne Hinweis | Fehlerhinweis |
| `verkehrswegebau.westergaardRand` | E, ν, Reifendruck, zul. Spannung (optional) | ungeprüft | Fehlerhinweis |
| `waermeschutz.uWert` | R_si, R_se | NaN → U NaN, gültig | Fehlerhinweis (Zahlen ≥ 0) |
| `kriechenSchwinden.relaxationsVerlauf` | Zeitpunkte | NaN-Zeitpunkt, gültig | Fehlerhinweis (Zahlen ≥ 0 h) |
| `pruefverfahren.gumMessunsicherheit` | Messwerte | NaN-Messwert → u_c NaN, gültig | Fehlerhinweis |
| `mischung.pruefeMischung` | Pflanzenkohle-Feuchte/-Wasseraufnahme, k-Werte, f-Grenze | NaN/∞ ohne Hinweis | Fehlerhinweis |
| `mechanischeKenngroessen.stabKenngroessen` | Kriechzahl | φ = −1 → E_eff = ∞, gültig | Fehlerhinweis (φ ≥ 0) |
| `laborversuche.auslagerung` | Blindwert, Dauer, Dichte | ∞ zugelassen | Fehlerhinweis (endlich) |
| `laborversuche.potentialReihe` | Lösungsvolumen | ∞ zugelassen | Fehlerhinweis |
| `laborversuche.druckMittel196` | Einzelwerte | NaN → Mittel NaN, gültig | ungültig |
| `werkstoffmodelle.schweissEigenspannung` | Punktzahl, Abstand | ungeprüft | Fehlerhinweis |
| `eigenspannungen.eigenspannungsVerlauf` | Abschnitte | Prüfung ohne Abbruch | Abbruch vor der Schleife |
| `biegelinie.biegelinie` | Stützstellen | ungeprüft | Fehlerhinweis |
| `lcc.pruefeLcc` | Zeitraum N | ohne Obergrenze | ≤ 1000 a (Rechengrenze, F-3) |

## E. NaN stillschweigend als Zahl (Formeln, R5)

Formeln ohne eigene Gültigkeit gaben bei NaN-Eingabe über Fallunterscheidungen einen Tabellen- oder Randwert aus. Jetzt NaN (Anzeige „–“); gültige Eingaben unverändert.

| Kern | Fall | vorher | nachher |
|---|---|---|---|
| `kriechenSchwinden.beiwertKh` (auch über `betonkennwerte`) | h₀ = NaN | 0,7 | NaN |
| `boden.konsolidierungsgrad` | T_v = NaN | 0 | NaN |
| `eisenKohlenstoff.solidus` | c = NaN | 1147 °C | NaN |
| `kriechenSchwinden.spannstahlRelaxation` | μ = NaN | 0 % | NaN |
| `lebensdauer.karbonatisierungsrate` | k_e = NaN | 0 | NaN |
| `lebensdauer.alterungsfaktor`, `wetterfunktion` | t = NaN | 1 | NaN |
| `lebensdauer.wetterExponent` | p_SR = NaN | 0 | NaN |
| `hydratation.hydratationsgrad`, `hydratationswaerme`, `betaCcBegrenzt`, `zugExponent`, `waermeKennwerte` | t_e = NaN bzw. Zement NaN | 0 bzw. 2/3 bzw. z/s-Verhältnis 0 | NaN |
| `laborVersuch.spaltzugfestigkeit`, `spaltkraft`, `ausbreitDurchmesser`, `ausbreitAuswertung` | F = NaN | 0 | NaN (0 für Geometrie ≤ 0 bleibt) |
| `probenahme.pn98Probenzahl` | V = NaN | 0 Mischproben | NaN |
| `mauerwerk.rho2` | NaN | 1,0 | NaN |
| `mauerwerk.fvk0NA` | Normalmörtel, f_m = NaN | 0,26 N/mm² (NM IIIa) | NaN, Gruppe „–“ |
| `packungsdichte.andreasenModifiziert` | NaN | 100 % | NaN |
| `bauprodukte.randspannung` | A = NaN | σ_N = 0 | NaN |
| `statistik.grubbsKritisch` | n = NaN | 3,128 (Tabellenende) | NaN |
| `verkehrswegebau.westergaardErsatzradius` | h = NaN | a | NaN |
| `werkstoffmodelle.woehlerSpannung` | N = NaN | 32,4 N/mm² | NaN |
| `werkstoffmodelle.stahlSpannungBeiDehnung`, `betonstahlSpannung` | Kennwert NaN | Randwert | NaN |
| `bestandKern.kn`, `kdn` | n = NaN | Tabellenendwert | NaN |
| `schutzInstandsetzung.wuNachweis` | Dicke NaN | Druckgefälle 0 | NaN |
| `lcc.lccOption` | Förderquote NaN | wie 0 % | NaN |
| `schadensKern.riebwClass` | Note NaN | „ungenügender Bauwerkszustand“ | „ungültig“ |

## F. Stilles Übergehen (Hinweis ergänzt)

| Kern | Fall | vorher | nachher |
|---|---|---|---|
| `laborversuche.potentialReihe`, `auslagerung`, `frischbeton`, `druckpruefung`, `moertelprismen` | teilweise ausgefüllte Tabellenzeile | still übergangen | Warnung „Eine unvollständig ausgefüllte Zeile wird nicht berücksichtigt.“ (ganz leere Zeilen weiter ohne Hinweis) |
| `korrosionsschutz.abnahme8020` | Messwert keine Zahl | still übergangen | Warnung mit Anzahl |
| `laborversuche.frischbeton` | Soll-Rohdichte fehlt | Gegenprobe still NaN | Warnung „Ohne Soll-Rohdichte > 0 entfällt die Gegenprobe des Luftgehalts.“ |

## G. Bewusst so belassen (Ausnahmen im Test, mit Begründung)

- **∞ als richtiger Grenzwert:** `karbonatisierungsFront` (K = 0 → Deckung wird nie erreicht), `biegelinie` (unbelastet → L/w = ∞), `bemesseStuetze` (N_Ed = 0 → λ_lim = 16/√n = ∞), Formeln mit ∞-Eingabe und mathematischem Grenzwert (z. B. erf(∞) = 1).
- **Überlauf bei 10¹⁵:** Bei absurd großen Eingaben entstehen in einigen Kernen ±∞ (z. B. `ntaModell` bei 10¹⁵ °C, `woehlerEc3`); die Anzeige zeigt „–“. Geprüft wird hier nur R1/R2; eine Obergrenze wäre ein fachlicher Wertebereich (F-4).
- **Tabellen- und Datenbankwerte als Eingabe** (keine Nutzereingabe): `expositionsklassen.huellwerte`, `lca.einzelbaustoffA1A4` und Baustoffdaten in `lca.lcaBilanz`, Profilwerte in `stahlbau.biegewiderstandY`, Übergabewerte in `lebensdauerUebergabe.vorgabeAusUebergabe` (prüft `leseUebergabe`).
- **Optionale Angaben:** Würfelhöhe und -masse in `druckpruefung` (nur Rohdichte entfällt), Soll-Rohdichte in `frischbeton` (Warnung).
- **Rückfallwert für Diagrammachsen:** `laborVersuch.schoeneAchse`.
- **Klassifizierer** mit Text- oder Zahlenklassen (F-1) und Prüffunktionen `pruefe…`, die in der zugehörigen Bemessungsfunktion mitgeprüft werden. Vollständige Liste mit Begründung in `AUSNAHMEN` im Test.

## Monotonie, Einheiten und Reglergrenzen (R6)

| Prüfung | Ergebnis |
|---|---|
| Biegelinie: w_max steigt mit L, fällt mit I | erfüllt |
| Biegebemessung: A_s1 steigt mit M_Ed | erfüllt |
| Querkraft: a_sw steigt mit V_Ed | erfüllt |
| Rissbreite: w_k steigt mit σ_s | erfüllt |
| Stahlbau: N_b,Rd fällt mit L_cr | erfüllt |
| Holzbau: F_c,Rd fällt mit der Stablänge | erfüllt |
| Wärmeschutz: U fällt mit der Dämmdicke | erfüllt |
| Karbonatisierung: x_c steigt mit t | erfüllt |
| Biokohlebeton: GWP der Referenz steigt mit dem Zementgehalt (mehr Zement → mehr GWP); CO₂-Speicher steigt mit der Pflanzenkohlemenge | erfüllt |
| Einheiten hin und zurück: °C ↔ K, MPa ↔ bar, m ↔ mm | erfüllt |
| Reglergrenzen (je Regler min und max, übrige in Bereichsmitte): LCC (7 Regler), Stellmittel (2), Zinkschutzdauer (4), Reißrahmen (4), Energieausweis (1) | gültig und endlich |

## H. Angepasste bestehende Tests

Nur Erwartungen für **ungültige** Eingaben („Fehlerhinweis und endliche Ausgabe“ bzw. „= 0“) wurden auf „Fehlerhinweis und kein Zahlenergebnis“ umgestellt; Fuzz-Prüfungen verlangen jetzt „ungültig → NaN, gültig → endlich“ (`tests/hilfen/keinErgebnis.ts`): `biegung`, `bspSchwingung`, `durchstanzen`, `holzbau`, `holzbauNachweise`, `holzphysik`, `hydratation`, `karsten`, `korrosionsschutz`, `kriechenSchwinden`, `laborVersuch`, `laborversuche`, `mauerwerk`, `mischung`, `modulpruefungTranche7` (PR3), `probenahme`, `pruefverfahren` (GUM n = 1, vorher „Mittel = Einzelwert (wie bisher)“), `querkraft`, `rissbreite`, `stahlbau`, `statistik`, `stuetze`, `thermischeKennwerte`, `verankerung`. Alle Sollwerte für gültige Eingaben sind unverändert.

## Fragen mit Vorschlag

| Nr. | Frage | Vorschlag |
|---|---|---|
| F-1 | Klassifizierer ohne eigene Prüfung ordnen NaN einer echten Klasse zu, z. B. `potentialStufe` → „gering“, `effizienzklasse` → „H“, `normalmoertelGruppe` → „NM IIIa“, `torrentKlasse` → 1, `schutzdauerklasse` → „VH“, `schulnoteAusZustandsnote` → 6, `saugKlasse` → „wassersaugend“. Die aufrufenden Kerne prüfen ihre Eingaben vorher, in der Anzeige ist das nicht erreichbar. | Ergänzen eines Werts „–“ (bzw. `null`) für nicht endliche Eingaben in allen Klassifizierern; Umstellung der Typen in einem eigenen PR, weil Anzeigen und Quizbezüge mitzuziehen sind. |
| F-2 | Bei Fehlern der Nachweisführung (Wand nicht tragfähig, Stab instabil, Raumdichte > Rohdichte) zeigten die Kerne bisher erklärende Zwischenwerte (h_ef/t, N_cr,d, ρ_m). Jetzt kein Zahlenergebnis; h_ef/t und N_cr,d stehen im Fehlertext. | So belassen (einheitlich mit GC-SB-1). Falls Zwischenwerte gewünscht sind: eigenes Feld `erlaeuterung` (Text) statt Zahlenfelder, damit kein Ergebnis wie gültig aussieht. |
| F-3 | Technische Obergrenzen gegen Endlosschleifen: 10 000 Stützstellen/Jahre/Tage, LCC-Betrachtungszeitraum ≤ 1000 a, Bruchdehnung der Stahlkennlinie ≤ 1000 %. Das sind Rechengrenzen, keine Fachwerte. | Bestätigen; die Regler (LCC 10 … 80 a) liegen weit darunter. |
| F-4 | Fachliche Wertebereiche für Eingaben, deren Überlauf nur bei absurden Werten auftritt (z. B. Asphalttemperatur im NTA-Modell, Δσ_C im Wöhlerdiagramm), wurden nicht festgelegt. | Keine harten Grenzen in den Kernen; wo nötig nur Warnungen über `bereich()` mit belegten Anwendungsbereichen (vorläufig, Normprüfung ausstehend). |

## Geänderte Dateien

- `src/calc/plausibilitaet.ts` (neue Hilfen), 59 weitere Kerne in `src/calc/` sowie `src/utils/bestandKern.ts` und `src/utils/schadensKern.ts`.
- Neu: `tests/rechenkerneGrenzfaelle.test.ts`, `tests/fixtures/rechenkerne-basis.json`, `tests/hilfen/keinErgebnis.ts`, `scripts/qa/rechenkerne-basis.ts`.
- 24 bestehende Testdateien (Abschnitt H).
