# Master-Audit BaustoffBoard – Abschlussbericht (Oktober 2026)

Stand: 22.10.2026 · Branch-Kette `ap1 … ap19/abschluss` (gestapelte PRs) · fachliche Freigabe durch den Autor ausstehend

## 1. Arbeitspakete

| AP | Bereich | Schwerpunkte |
|---|---|---|
| 1 | App-weit | Normlinks, Anrede, Rechtsaussagen |
| 2 | App-weit | Zahlformat (formatDeZahl), Rechner-Robustheit (NaN-Schutz) |
| 3 | Grundlagen | Einheiten, Kennwerte, Eurocode, Normen-Registry (erfundene DIN-Media-IDs ersetzt) |
| 4 | Labor | Probenahme, Messen & Prüfen, Statistik, virtuelle Versuche |
| 5 | Mechanik | Formänderungen, E-Modul, Bruchmechanik, Knicken, Bodenmechanik |
| 6 | Bauphysik | GEG → GModG, DIN 4108-2/-3, Glaser |
| 7 | Nachhaltigkeit | QNG, DIN EN 15978:2026-09, EPBD, Taxonomie |
| 8 | Bestand | Bauwerksdiagnose, historische Kennwerte |
| 9 | Rückbau | GefStoffV 2024, GewAbfV, EBV, DepV, LAGA PN 98 |
| 10 | Dauerhaftigkeit | DIN 1045-2:2023, Betondeckung, XA, DIN 68800 |
| 11 | Schäden | DIN 1076:2026-01, VOB/B 2016 |
| 12 | Instandsetzung | DIN EN 1504-9, TR Instandhaltung, OS-Systeme, WTA |
| 13 | Digitales | ESPR/BauPVO, IFC-Property-Sets, DPP |
| 14 | KI | KI-VO inkl. Digital Omnibus, DSGVO, UrhG § 44b, Modellangaben |
| 15 | Praxiswissen | Normbezüge, Bauvertragsrecht, Qualifikationen |
| 16 | Infos & Quellen | 749 defekte DIN-Media-Links app-weit, Literatur gegen DNB, Kuriositäten |
| 17 | Studium | Studiendaten mit tha.de abgeglichen |
| 18 | Übungsaufgaben | Generator, Bauforensik, Quizpool (Navigation, Antwortverteilung) |
| 19 | Abschluss | Cross-Modul-Konsistenz, Bericht, Roadmap |

## 2. Kennzahlen (vor Audit → nach Audit)

| Kennzahl | vorher | nachher |
|---|---|---|
| Fragen im zentralen Fragenpool | 26 | 233 |
| Module mit Selbsttest (ModulTest) | 0 | 80 Dateien |
| Anwendungsbeispiele (FormulaDerivationBox) | 2 | 178 |
| KaTeX-Formeln, fehlerfrei geprüft | – | 3 103 / 0 Fehler |
| Defekte DIN-Media-Suchlinks | 14 (später 749) | 0 |
| Geänderte Dateien in `src` | – | 297 (+16 187 / −6 720 Zeilen) |

## 3. Gesamtbewertung nach Prüfdimensionen

| Dimension | Vorher | Nachher |
|---|---|---|
| D1 Korrektheit | zahlreiche erfundene Normen, Ausgaben, ISBN, Zahlenwerte, veraltete Rechtsstände | Normen/Recht auf Stand 10/2026 geprüft, Unbelegtes als „manuell prüfen“ bzw. „Lehrannahme“ markiert |
| D2 Didaktik | Lernpfad uneinheitlich | 4-stufiger Lernpfad (Grundlagen → Labor → Beispiele → Test) in allen Fachgruppen |
| D3 Vollständigkeit | Lücken bei Selbsttests, Beispielen, aktuellen Regelwerken | ergänzt (Beispiele, Tests, neue Regelwerke wie DIN 1076:2026-01, KI-VO) |
| D4 Praxisrelevanz | teils generische Texte | Rechenbeispiele mit Normbezug, Praxis-Checklisten korrigiert |
| D5 Konsistenz | Du/Sie gemischt, abweichende Normstände, tote Links | vereinheitlicht; app-weite Link- und Normstandsprüfung |
| D6 Interaktivität | NaN-Fehler, Punkt-Dezimalzahlen, ungeprüfte Formeln | formatDeZahl, NaN-Schutz, KaTeX-Prüfskript, Quiz-Navigation repariert |

## 4. Offene Punkte (manuell prüfen)

- Fachliche Freigabe aller APs durch den Autor.
- Normtext-Abgleich: Dosiergenauigkeit DIN EN 206, RC-Anteile, ausgewählte EC2-Tabellenwerte.
- Amtsblatt-Fundstelle des Digital Omnibus zur KI-VO.
- Wikipedia-Gesamtprüfung (481 Links; Rate-Limit), aus der Sandbox nicht erreichbare Domains (z. B. wta.de, app.tha.de).
- `server.ts` verwendet die Modell-ID `gemini-3.8-flash` – am 26.10.2026 gegen die Google-Modellliste (ai.google.dev/models, Stand 22.10.2026) geprüft: aktuelles stabiles Flash-Modell. Über `GEMINI_MODEL` umstellbar.
- Navigationslabels „Fachingenieur Ausbau/Fassade/Holzbau“ (offiziell: Ausbau und Bestand, Fassade, Holzbau – Zertifikat).

## 5. Verbesserungs- und Erweiterungsvorschläge (Roadmap)

**Technik (Phase 0b der Didaktik-Revision)**
1. Repository bereinigen: 52 Einmal-Skripte und Textdateien im Wurzelverzeichnis sowie `src/scripts/*.py` mit eingecheckten `__pycache__`-Dateien entfernen bzw. nach `scripts/` verschieben.
2. Antwortoptionen beim Anzeigen mischen (statt fester Reihenfolge) und Fragen-ID-basiertes Tracking beibehalten.
3. Linkprüfung als CI-Schritt (HTTP-Status, Weiterleitungen, Wikipedia-API mit Drosselung); Ergebnis als Bericht.
4. Bundle-Analyse und Lazy Loading großer Datenmodule; Lighthouse-/Barrierefreiheits-Check.

**Inhalte**
5. Didaktik-Revision je Modul nach dem vorbereiteten Prompt (Stufen A–D, Referenz Spannbeton „0-100“).
6. Neue Rechner: Feuchtekorrektur und Konformitätsnachweis (Betonwerk), Nachbehandlungsdauer nach DIN 1045-3, Chlorideindringung (√t-Ansatz), Ökobilanz Bauteilvergleich mit funktionaler Einheit.
7. Labor-/Gutachten-Szenarien: weitere Bauforensik-Fälle (Holzschwamm, Abdichtungsschaden, Spannstahl-SpRK) mit Budget- und Beweislogik.
8. Export: Rechenweg und Selbsttest-Ergebnis als PDF (Protokoll für Übungen/Labor).
9. Pflegeprozess: halbjährlicher Normen- und Rechtsstand-Check anhand der Normen-Registry (`centralNormenRegistry.ts`) mit „zuletzt geprüft“-Datum je Modul.
