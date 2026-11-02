# Sichtbare Bearbeitungsvermerke (02.11.2026)

Anlass: Empfehlung NS5C-X-1 (`docs/pruefung/nachstichprobe5c-2026-11-02.md`): In der App standen noch etwa 25 sichtbare Vermerke wie „manuell prüfen“, „Absatz prüfen“ in rund 20 Dateien.

## Vorgehen

1. **Suche:** neuer Test `tests/keineBearbeitungsvermerke.test.ts`. Er liest alle Zeichenketten in `content/**/*.json` und `src/**/*.json` sowie die Zeichenketten-Literale, Vorlagen-Literale und JSX-Texte in `src/**/*.{ts,tsx}` über den TypeScript-Parser. Code-Kommentare zählen deshalb nicht. Gesucht wird nach folgenden Mustern:
   - „manuell (am Normtext) prüfen/abgleichen/ergänzen …“
   - „Absatz/Titel/Quelle/Zitat prüfen“
   - „Stand (MM/JJJJ) prüfen“
   - „Normtext prüfen“ und „am Normtext/Amtsblatt/Original zu bestätigen“, jeweils ohne die Kennzeichnung „Normprüfung ausstehend“
   - „noch zu prüfen“, „bitte prüfen“
   - `TODO`, `FIXME`, `TBD`, `XXX`
   - englische Prüfvermerke wie „to be checked“ oder „please check“
   - Platzhalter: „???“, „(?)“, „XX“ sowie „[Quelle]“, „[Beleg]“, „[Seite]“ und Ähnliches in eckigen Klammern
2. **Abgrenzung:** Hinweise an die Leserin oder den Leser bleiben stehen, z. B. „Konditionen vor Antragstellung bei KfW/BAFA prüfen“, „Wägung, Volumen, Verdichtung prüfen“, „den aktuellen Stand prüfen“ oder „Quelle prüfen Sie selbst“. Dasselbe gilt für Vermerke, die schon die Kennzeichnung „vorläufig, Normprüfung ausstehend“ tragen. Die begründeten Ausnahmen stehen im Test:
   - zitierte KI-Antwort „Bitte prüfen Sie die DIN 1045“ im Vergleichsbeispiel
   - „Vier-Augen-Prinzip prüfen!“ als Aufforderung an die Lesenden
   - Audit-Arbeitslisten `src/data/audit/`
   - Kopiervorlage `[TEXT]`
   - Fachbegriff „Platzhalter-Key“
   - „[Name]“ als Anonymisierung in Beispieldokumenten
3. **Klärung:** Jede Fundstelle wurde sachlich geprüft, mit Quellen nur aus WebSearch-Ergebnissen. Wo eine Quelle den Sachverhalt belegt, ersetzt belegter Text den Vermerk. Wo der Normtext nötig wäre und öffentlich nicht zugänglich ist, steht „vorläufig, Normprüfung ausstehend“. Bei Angaben ohne Fachwert wurde der Satz neutral formuliert.

**Ergebnis:** 36 Zeichenketten mit Vermerk in 27 Dateien. Dazu kommen 2 Varianten in 2 weiteren Dateien, die erst bei der Erweiterung der Muster auffielen („am Normtext/Amtsblatt zu bestätigen“). Mit den Folgeänderungen (Toleranzen, Literaturangabe Eckstein, Bezeichnung des REZ) sind es 43 Ersetzungen in 31 Dateien. Nach der Bereinigung meldet der Test 0 Treffer. Prüfvermerke (`src/data/pruefvermerke.ts`) sind nicht geändert.

## Fundstellen

| # | Fundstelle | vorher | nachher | Quelle |
|---|---|---|---|---|
| 1 | `content/bauwerkserfassung/Bauwerkserfassung.json` (Stand) | „… Genauigkeitsstufen nach Eckstein manuell abgleichen“ | „November 2026: Toleranzen und Maßstäbe der Genauigkeitsstufen II–IV an veröffentlichte Wiedergaben des Stufenschemas angeglichen“ | siehe Nr. 2 |
| 2 | ebd., Daten Genauigkeitsstufen und Regelwerk Eckstein | II ± 1 bis 3 cm (1:100); III ± 5 mm (1:50/1:25); IV ± 1 bis 2 mm (1:20/1:10); „Toleranzangaben … manuell abgleichen“ | II ± 2,5 cm (Hauptpunkte) bis ± 10 cm (1:100/1:50); III ± 2,5 cm (1:50); IV ± 1 bis 2 cm, bei 1:10 ± 0,5 cm (1:25/1:20 bis 1:10); Eckstein mit Arbeitsheft 7, Stuttgart 1999; neue Quelle LfD Sachsen | [LfD Sachsen, Handreichung Dokumentation](https://lfd.sachsen.de/download/LfDSN_Dokumentation_Handreichung_Formular_250220.pdf) (III ± 2,5 cm bei 1:50; IV ± 1 cm bei 1:20/25, ± 0,5 cm bei 1:10; Literatur: Eckstein 1999); [Seminar Bauaufnahme, OPAL Sachsen](https://bildungsportal.sachsen.de/opal/oer/9jA1a22ke9P4) (II ± 10 cm, Hauptpunkte ± 2,5 cm; III ± 2,5 cm; IV ± 2 cm bei 1:25) |
| 3 | `content/bauwerksuntersuchung/Bauwerksuntersuchung.json` (k_n) | „Tabellenwerte am Normtext prüfen“ | „Tabellenwerte vorläufig, Normprüfung ausstehend“ | Normtext DIN EN 13791:2020-02 nicht öffentlich |
| 4 | ebd., Literatur | „Rinn, F.: Bohrwiderstandsmessung an Holz (Resistograph) – Originalpatent/Quelle prüfen“ | „Rinn, F. (1993): Catalogue of relative density profiles of trees, poles and timber derived from RESISTOGRAPH micro-drillings. Proc. 9th Int. Symp. Nondestructive Testing of Wood, Wisconsin (USA), S. 61–67“ | Literaturverzeichnis in [Materiales de Construcción, Art. 310](https://materconstrucc.revistas.csic.es/index.php/materconstrucc/article/view/310) |
| 5 | `content/betonpraxis/Betonpraxis.json` | „(Kriterien manuell prüfen)“ | „die Kriterien sind hier nicht wiedergegeben (vorläufig, Normprüfung ausstehend)“ | Normtext DIN EN 13791 nicht öffentlich |
| 6 | `content/bpbetonzusatzmittel/BpBetonzusatzmittel.json` (L₃₀₀, a) | „maßgebend DIN 1045-2/ZTV – manuell prüfen“ | „maßgebend DIN 1045-2 bzw. ZTV-ING/TL Beton-StB; vorläufig, Normprüfung ausstehend“ | kein öffentlicher Beleg für die Grenzwerte gefunden |
| 7 | `content/bpinnovationen/BpInnovationen.json` (ZIM) | „Fördersätze und Höchstbeträge nach aktueller ZIM-Richtlinie – manuell prüfen“ | ZIM-Richtlinie vom 11.12.2024 (ab 2025): je Unternehmen bis 560 000 €, je Forschungseinrichtung bis 280 000 €, je Kooperationsprojekt bis 3,0 Mio. € zuwendungsfähig; Fördersatz nach Unternehmensgröße | [IHK, Kerninhalte ZIM 2025](https://www.ihk.de/blueprint/servlet/resource/blob/6361838/1d1d21e88d414f9cbf8289f93f3d506f/kerninhalte-zim-2025-data.pdf) |
| 8 | ebd., CO₂-Mineralisierung | „bzw. Einzelregelungen (manuell prüfen)“ | „soweit das Verfahren davon abweicht, über eine allgemeine bauaufsichtliche Zulassung oder eine Zustimmung im Einzelfall“ | neutral formuliert (bauaufsichtlicher Grundsatz, wie im Modul Biokohlebeton) |
| 9–11 | `content/bplehmbauprodukte/BpLehmbauprodukte.json` (2×), `src/modules/BpLehmbauprodukte.tsx` | „Grenzwert nach DIN 18940 manuell prüfen“ | „Grenzwert nach DIN 18940 vorläufig, Normprüfung ausstehend“ | [Baunetz Wissen](https://www.baunetzwissen.de/drucken/tragendes-lehmsteinmauerwerk-8422004) nennt keinen Grenzwert; Normtext nicht öffentlich |
| 12 | `content/bpverkehrswegebau/daten.json` (HGT) | „TL Beton-StB (Lehrwert ca. 7–12 MPa, manuell prüfen)“ | „TL/ZTV Beton-StB (Lehrwert ca. 7–12 MPa; vorläufig, Normprüfung ausstehend)“ | kein öffentlicher Beleg |
| 13–14 | `content/daemmungvergleich/DaemmungVergleich.json` (2×) | „Neuausgabe 2026-05 manuell abgleichen“ bzw. „– Änderungen manuell prüfen“ | „Abgleich mit der Neuausgabe 2026-05 vorläufig, Normprüfung ausstehend“ | Entscheidung 28.10. (bei 2013-02 bleiben, Hinweis auf 2026-05); Wortlaut wie NS5C-X-1 in `rechnung_u_wert` |
| 15 | `content/denkmalpflege/Denkmalpflege.json` | „Art. 6 BayDSchG (Umgebung) – Absatz prüfen“ | „Art. 6 Abs. 1 Satz 2 BayDSchG (Umgebung)“ | [gesetze-bayern.de, Art. 6 BayDSchG](https://www.gesetze-bayern.de/Content/Document/BayDSchG-6) (Erlaubnispflicht für Anlagen in der Nähe von Baudenkmälern) |
| 16 | `content/frischbeton/Frischbeton.json` (Grenzabmaße) | „Werte für Ausbreit- und Setzmaß manuell am Normtext prüfen.“ | „Grenzabmaße für Ausbreit- und Setzmaß vorläufig, Normprüfung ausstehend.“ | Normtext DIN EN 206 nicht öffentlich |
| 17 | ebd. (Probenahme) | „(Werte manuell am Normtext prüfen.)“ | „(Mengenangaben vorläufig, Normprüfung ausstehend.)“ | Normtext DIN EN 12350-1 nicht öffentlich |
| 18 | `content/historischematerialkennwerte/RechnerLaborTab.json` | „Concrete Society TR 11 / ACI 214.4R – Quelle prüfen“ | „Feuchte- und Durchmesserfaktor nach ACI 214.4R-10, Bewehrungsfaktor nach Concrete Society Technical Report 11; Zahlenwerte vorläufig, Normprüfung ausstehend“ | [ACI 214.4R-10, Leseprobe](https://www.concrete.org/Portals/0/Files/PDF/Previews/214.4R-10web.pdf) (Korrekturfaktoren für Feuchtezustand und Probengeometrie) |
| 19 | `content/innovativewerkstoffe/InnovativeWerkstoffe.json` | „(Klassen manuell prüfen)“ | „(Rohdichteklassen für Leichtbeton D1,0 bis D2,0, d. h. 800 bis 2000 kg/m³)“ | DIN EN 206, Rohdichteklassen Leichtbeton (Lehrbuchwissen) |
| 20–22 | `content/ki/LokaleKI.json` (3×) | „Richtpreis, Stand 10/2026 prüfen“ | „Richtpreis, Stand 10/2026“ | neutral formuliert (Stand genannt) |
| 23 | `content/ki/ModelBenchmarkMatrix.json` | „(Größenordnung 10⁶ Token; Stand prüfen)“ | „(Größenordnung 10⁶ Token, Stand 10/2026)“ | neutral formuliert |
| 24 | `content/kibaustoffe/KiBaustoffe.json` (Literatur) | „Umweltbundesamt: CO₂-Emissionsfaktoren für den Strommix (manuell prüfen)“ | „Umweltbundesamt (2025): Entwicklung der spezifischen Treibhausgas-Emissionen des deutschen Strommix in den Jahren 1990–2024. Climate Change 13/2025“ | [UBA, Publikation](https://www.umweltbundesamt.de/publikationen/entwicklung-der-spezifischen-treibhausgas-11) |
| 25 | `content/materialpaesse/Materialpaesse.json` | „(bislang nicht gesetzlich eingeführt; Stand 10/2026, manuell prüfen)“ | „(bislang nicht gesetzlich eingeführt, Stand 10/2026)“ | keine Rechtsgrundlage gefunden ([VDIV 02/2022](https://vdiv.de/news-details/bundesregierung-plant-digitalen-gebaeuderessourcenpass): nur Ankündigung im Koalitionsvertrag) |
| 26 | `content/oekobilanzlca/OekobilanzLCA.json` | „Übergangsregeln in QNG/DGNB manuell prüfen“ | „welche Ausgabe für QNG und DGNB gilt, legt das jeweilige Regelwerk fest“ | neutral formuliert |
| 27 | `src/data/centralNormenRegistry.ts` (DIN EN 15978) | „Übergangsregeln in den Bewertungssystemen manuell prüfen.“ | „Welche Ausgabe gilt, legt das jeweilige Bewertungssystem in seinem Regelwerk fest.“ | neutral formuliert |
| 28 | `content/praxiswissen/Praxiswissen.json` (Dosiergenauigkeit) | „(Werte am Normtext prüfen)“ | „(vorläufig, Normprüfung ausstehend)“ | Normtext DIN EN 206 nicht öffentlich |
| 29 | `content/ressourceneffizienz/Ressourceneffizienz.json` | „(konkrete Zielwerte der bayerischen Strategie manuell prüfen)“ | Satz ohne Klammer („Politisches Ziel: mehr RC-Beton im öffentlichen Hochbau.“) | neutral formuliert |
| 30 | ebd., Literatur REZ | „REZ am LfU … (www.umweltpakt.bayern.de/rez; Titel manuell prüfen)“ | „REZ; früher am Bayerischen Landesamt für Umwelt, heute am Bayerischen Staatsministerium für Umwelt und Verbraucherschutz …“; zusätzlich redaktionell „Bayerisches Ressourceneffizienz-Zentrum Bayern“ → „Ressourceneffizienz-Zentrum Bayern“ | [Umweltpakt Bayern, REZ-Umzug](https://www.umweltpakt.bayern.de/abfall/aktuelles/3990/rez-umzug-an-bayerische-umweltministerium) |
| 31 | `content/schallschutz/Schallschutz.json` | „DIN EN 12354-1, informativer Anhang (Zuordnung manuell prüfen)“ | „DIN EN 12354-1 (Ausgabe 2000), informativer Anhang (Zuordnung vorläufig, Normprüfung ausstehend)“ | Normtext nicht öffentlich |
| 32–33 | `content/sonderbetone/Sonderbetone.json`, `content/uwbeton/UwBeton.json` | „Mindestzementgehalt (nach DIN 1045-2) manuell prüfen“ | „Mindestzementgehalt vorläufig, Normprüfung ausstehend“ bzw. „Den Mindestzementgehalt legt DIN 1045-2 fest (vorläufig, Normprüfung ausstehend).“ | kein öffentlicher Beleg für den Zahlenwert |
| 34 | `src/calc/bauwerksuntersuchung.ts` (Hinweistext Rückprall) | „(DIN EN 12504-2; vorläufig, Normtext prüfen)“ | „(DIN EN 12504-2:2012; vorläufig, Normprüfung ausstehend – nach Sekundärquellen nennt die Ausgabe 2021-10 statt 6 Einheiten 25 % des Medians)“ | [TUM ZfP-Wiki](https://collab.dvb.bayern/spaces/TUMzfp/pages/1306514985/Rebound+Hammer+new) und [VUT Brno](https://szk.fce.vutbr.cz/wp-content/uploads/sites/29/2024/10/07_-Hardness.pdf): „more than 20 % … differ from the median by more than 25 %“ (DIN EN 12504-2:2021-10) |
| 35 | `src/components/labor/SchmidtHammerSimulator.tsx` | „(Schwelle vorläufig, am Normtext zu bestätigen)“ | wie Nr. 34 | wie Nr. 34 |
| 36 | `src/calc/hydratation.ts` | „(vorläufig, Normtext prüfen)“ | „(vorläufig, Normprüfung ausstehend)“ | Kennzeichnung vereinheitlicht |
| 37 | `src/modules/Frischbetondruck.tsx` (Auswahl) | „SVB (hydrostatisch; F6 manuell prüfen)“ | „SVB (voller hydrostatischer Druck; F6 nicht gesondert abgebildet)“ | beschreibt das tatsächliche Verhalten des Rechners (F1–F5 und SVB) |
| 38 | `src/components/ui/RechtsrahmenKompendium.tsx` (ETS II) | „Angabe nach Sekundärquelle, am Amtsblatt zu bestätigen“ | „vom Rat im März 2026 endgültig angenommen; Nummer und Datum nach Sekundärquelle“ | [EUbusiness, 05.03.2026](https://www.eubusiness.com/environment/final-green-light-for-amended-eu-climate-law/) (Annahme, ETS II ab 2028) |

## Quiz

- `qn_bauwerkserfassung_1`: Durch Nr. 2 wurden die Toleranzen der Optionen falsch (Stufe III „± 5 mm“). Frage, Optionen, Erklärung und Kernregel nennen jetzt Stufe III mit ± 2,5 cm bei 1:50. Die Frage steht auf `verified: false` (Prüfer und Datum entfernt), mit Vermerk in `vorpruefung.hinweis`. Die Prüfliste ist neu erzeugt.
- `q_bwe_1` nennt keine Toleranz und ist nicht betroffen.

## Audit-Zuordnung

Neue Fundstellen mit „Normprüfung ausstehend“ brauchen ein Fachgebiet (`tests/auditDaten.test.ts`). Dafür sind in `scripts/auditDaten.ts` drei Alternativen angehängt, bestehende Einträge sind unverändert:

| Fachgebiet | angehängte Alternativen |
|---|---|
| Feuchteschutz | `DIN 4108-2`, `DIN EN ISO 13788` |
| Verkehrswege | `Beton-StB` |
| Prüfverfahren | `DIN EN 13791`, `ACI 214` |

## Offen (Entscheidung)

- **Rückprall-Verwerfungskriterium (Nr. 34/35):**
  - Der Rechenkern `rueckprallMesssatz` und der Simulator verwerfen einen Messsatz, wenn mehr als 20 % der Werte um mehr als 6 Einheiten vom Median abweichen. Das ist die Regel der Ausgabe 2012.
  - Zwei Sekundärquellen nennen für DIN EN 12504-2:2021-10, die das Modul zitiert, 25 % des Medians.
  - Vorschlag: Schwelle im Kern auf 25 % des Medians umstellen, mit Regressionstest, sobald der Normtext bestätigt ist. Bis dahin bleibt der Hinweis gekennzeichnet.
- **Genauigkeitsstufe I:** Keine der Quellen nennt für Stufe I eine Toleranz. Der Modulwert „± 5 bis 10 cm“ bleibt deshalb stehen.
