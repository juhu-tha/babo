# Freigabepakete der Fachmodule ohne Prüfvermerk (Stand 04.11.2026)

Anlass: Gesamtgutachten vom 03.11.2026 (`docs/review/gesamt-2026-11-03.md`, Nr. 3 der Maßnahmenliste): Rund 50 Fachmodule haben noch keinen Prüfvermerk, darunter zentrale Lehrmodule. Die Pakete sollen die Freigabe so leicht wie möglich machen. **Sie setzen keine Prüfvermerke** (`src/data/pruefvermerke.ts` ist unverändert) und geben keine Quizfragen frei.

> **Regel für Normtextpunkte (Entscheidung vom 04.11.2026):** Normtextpunkte, die in der App sichtbar als „vorläufig, Normprüfung ausstehend“ gekennzeichnet sind, gelten für die Freigabe als erledigt. Es gilt die Regel der Freigabe vom 02.11.2026 (Tranche 16); die Regel vom 28.10.2026 („Normtextpunkte blockieren die Freigabe“) ist abgelöst. Die Punkte bleiben im Prüfbogen Normtext, Reiter „Nach Normen (04.11.)“, offen; nach der Normprüfung wird der Wert angepasst. Die Prüfvermerke trägt die prüfende Person ein; diese Pakete setzen keine.

**Umfang:** 55 Pakete – 51 Fachmodule mit Prüfvermerk „offen“ und 4 geprüfte Module, deren Inhalt sich seit dem Prüfdatum wesentlich geändert hat (`historisch`, `bauschaeden`, `pfas_baustoffe`, `normen_ausblick`).

**Empfehlungen:** 49 × freigabereif, 5 × freigabereif nach Klärung, 1 × nicht freigabereif. Davon sind 45 Pakete erst durch die Regel vom 02.11.2026 freigabereif (vorher „nach Klärung“, nur gekennzeichnete Normtextpunkte offen).

Offene Normpunkte zusammen: 118 Einträge (ein Normpunkt kann mehrere Module betreffen, siehe „Normtext-Sitzungen“). Quizfragen der Pakete: 372, davon 70 nicht freigegeben.

## So ist ein Paket aufgebaut

Zweck · Reiter und Bereiche · Rechenkerne mit Tests und Referenzwerten · alle bisherigen Befunde mit Status · offene Normpunkte mit Kennung · Quizfragen · Quellen · **Prüfschritte für die Freigabe (ca. 15 min)** mit Formel, Wert oder Beispiel und Erwartungswert, Datei und Zeile · Empfehlung mit Begründung. Bei den vier geänderten Modulen zusätzlich „Änderungen seit dem Prüfdatum“.

Kennungen: `T<n>-…` aus den Befundlisten `module-tranche-<n>.md`, #239/#242/#247-… aus den PR-Prüfpunkten, beide mit Nummer im Prüfbogen Normtext, Reiter „Nach Normen (04.11.)“. „F-Stelle `T<n>/<Nr.>`“ bezeichnet eine F-Freigabe-Stelle der Befundliste Tranche n, Abschnitt Nr., die noch keine Prüfbogennummer hat. EK-N1 bis EK-N7 sind die Normpunkte aus `ec-kennwerte-2026-11-02.md`, HK-13791-1 bis -6 die aus `hist-kennwerte-13791-2026-11-02.md`.

## Entschieden am 04.11.2026

1. **Regel für Normtextpunkte:** siehe Kasten oben. Umgestellt auf „freigabereif“: [`stahlbeton_bemessung`](stahlbeton_bemessung.md), [`feuchteschutz`](feuchteschutz.md), [`bauphysik`](bauphysik.md), [`schallschutz`](schallschutz.md), [`rechnung_schallschutz`](rechnung_schallschutz.md), [`bauchemie`](bauchemie.md), [`mauerwerk`](mauerwerk.md), [`rechnung_mauerwerk`](rechnung_mauerwerk.md), [`expositionsklassen`](expositionsklassen.md), [`rechnung_brandschutz`](rechnung_brandschutz.md), [`frischbeton`](frischbeton.md), [`probenahme`](probenahme.md), [`ec_kennwerte`](ec_kennwerte.md), [`hydratation_folgen`](hydratation_folgen.md), [`nachbehandlung`](nachbehandlung.md), [`grundlagen`](grundlagen.md), [`bindemittel`](bindemittel.md), [`ressourceneffizienz`](ressourceneffizienz.md), [`lehm`](lehm.md), [`asphalt`](asphalt.md), [`holzbau_verbindung`](holzbau_verbindung.md), [`mechanische_kenngroessen`](mechanische_kenngroessen.md), [`innenausbau`](innenausbau.md), [`energieausweis`](energieausweis.md), [`materialoptimierung`](materialoptimierung.md), [`schadreaktionen_beton`](schadreaktionen_beton.md), [`schadensbilder`](schadensbilder.md), [`bauwerksunters_monitoring`](bauwerksunters_monitoring.md), [`schutz_grundlagen`](schutz_grundlagen.md), [`instandsetzung_materialien`](instandsetzung_materialien.md), [`instandhaltung`](instandhaltung.md), [`wta`](wta.md), [`ki_llmpraxis`](ki_llmpraxis.md), [`ki_thesen`](ki_thesen.md), [`ki_recht_ethik`](ki_recht_ethik.md), [`px_produktion`](px_produktion.md), [`px_karriere`](px_karriere.md), [`bp_mauerwerk`](bp_mauerwerk.md), [`bp_verkehr_bitumen`](bp_verkehr_bitumen.md), [`bp_verkehr_betondecken`](bp_verkehr_betondecken.md), [`bp_verkehr_tiefbau`](bp_verkehr_tiefbau.md), [`bp_verkehr_bahn`](bp_verkehr_bahn.md), [`bp_abdichtung`](bp_abdichtung.md), [`bp_klebstoffe`](bp_klebstoffe.md), [`bp_lehmbauprodukte`](bp_lehmbauprodukte.md). Weiter „nach Klärung“ bleiben fünf Pakete mit Punkten außerhalb der Regel: `labor` (#253-HZ, #255-RuK – in der App nicht gekennzeichnet; nachgetragen nach dem Abgleich mit dem Prüfbogen, Reiter „Nach Normen (04.11.)“), `pruefverfahren_katalog` (zwei Textwidersprüche), `rechnung_bestand` (einheitliche Mindeststandardabweichung), `holzkorrosion` (NP4/NP5) und `bp_betonwaren` (Prüfdruck 1 bar) – bei den beiden letzten besteht ein begründeter Verdacht auf einen falschen Wert, nicht nur eine fehlende Bestätigung.
2. **`historisch`:** Prüfvermerk auf „Nachprüfung erforderlich“ (`re-review`, zuletzt geprüft am 29.10.2026; offene Punkte im Admin-Bereich). Anzeige im Modul passiv ohne Namen: „Fachliche Nachprüfung erforderlich (letzte Prüfung 29.10.2026)“. Die übrigen drei geänderten Module (`bauschaeden`, `pfas_baustoffe`, `normen_ausblick`) behalten „geprüft“; ihre Pakete nennen die kurzen Gegenleseschritte.
3. **Prüfbogen Normtext:** wird gesondert fortgeschrieben; maßgebend für die Normpunkte ist der Prüfbogen Normtext, Reiter „Nach Normen (04.11.)“.

## Übersicht (Bedeutung für die Lehre, dann Aufwand)

Bedeutung: **1** Pflichtlehre bzw. zentrales Lehrmodul (Lernpfad Baustoffkunde des Bachelors und die im Gutachten genannten Kernmodule Massivbau/Bauphysik/Labor), **2** Lehrveranstaltung (Bauen im Bestand, A.RYC, WPF Nachhaltiges Bauen, KI-Master, Zertifikat), **3** Ergänzung und Nachschlagen (Bauprodukte, Beispielrechnungen, Praxiswissen). Lernpfade aus `src/data/lernpfade.ts` (Entwürfe). Aufwand: geschätzte Zeit für die Prüfschritte (sortiert danach); der dahinter genannte Normtextabgleich ist nach der Regel oben für die Freigabe nicht nötig und steht nur zur Orientierung für den Prüfbogen dabei.

| Nr. | Paket | Modul | Bed. | Lernpfade | Empfehlung | Normpunkte | Quiz offen/gesamt | Aufwand |
|---|---|---|---|---|---|---|---|---|
| 1 | [brandschutz](brandschutz.md) | Brandschutz & Baustoffklassen | 1 | Zertifikat Ausbau und Bestand | freigabereif | 0 | 2/8 | 10 min |
| 2 | [asphalt](asphalt.md) | Asphalt & Bitumen | 1 | Baustoffkunde | freigabereif (Regel 02.11.) | 1 | 2/7 | 10 min + ZTV Asphalt-StB 26 (1 Tabelle) |
| 3 | [bauchemie](bauchemie.md) | Bauchemie & Mineralogie | 1 | Baustoffkunde | freigabereif (Regel 02.11.) | 1 | 1/7 | 10 min + Normtext DIN 18540 (1 Punkt) |
| 4 | [bindemittel](bindemittel.md) | Bindemittel & Hydratation | 1 | Baustoffkunde | freigabereif (Regel 02.11.) | 2 | 0/7 | 10 min + Normtext DIN 1045-2 (2 Punkte) |
| 5 | [expositionsklassen](expositionsklassen.md) | Expositionsklassen (DIN EN 206 / DIN 1045-2) | 1 | – | freigabereif (Regel 02.11.) | 2 | 1/7 | 10 min + Richtlinientext (2 Punkte) |
| 6 | [grundlagen](grundlagen.md) | Ausgangsstoffe des Betons | 1 | A.RYC, Baustoffkunde | freigabereif (Regel 02.11.) | 2 | 1/6 | 10 min + Normtext DIN 1045-2 Anhang E (2 Punkte, gemeinsam mit `ressourceneffizienz`, `px_produktion`) |
| 7 | [lehm](lehm.md) | Lehm & Stampflehm | 1 | Baustoffkunde | freigabereif (Regel 02.11.) | 2 | 0/6 | 10 min + Normtext DIN 18940/18945 (2 Punkte, gemeinsam mit `bp_lehmbauprodukte`) |
| 8 | [frischbeton](frischbeton.md) | Frischbetonprüfungen | 1 | Baustoffkunde | freigabereif (Regel 02.11.) | 2 | 1/7 | 15 min + Normtext DIN EN 206 (2 Stellen) |
| 9 | [hydratation_folgen](hydratation_folgen.md) | Hydratation & Folgen (Wärme, Reife, Rissrisiko) | 1 | Baustoffkunde | freigabereif (Regel 02.11.) | 2 | 3/7 | 15 min + Normtext NEN 5970 (1 Punkt) |
| 10 | [mauerwerk](mauerwerk.md) | Mauerwerk & Steine | 1 | A.RYC, Bauen im Bestand, Baustoffkunde | freigabereif (Regel 02.11.) | 2 | 1/6 | 15 min + Normtext NA EC 6 (2 Punkte) |
| 11 | [bauphysik](bauphysik.md) | Bauphysik-Rechner (U-Wert, Sommer, Akustik) | 1 | VNHB | freigabereif (Regel 02.11.) | 3 | 2/7 | 15 min + Normtext (2 Werte) |
| 12 | [feuchteschutz](feuchteschutz.md) | Feuchteschutz & Tauwasser (Glaser-Verfahren) | 1 | Bauen im Bestand, Zertifikat Ausbau und Bestand | freigabereif (Regel 02.11.) | 3 | 0/8 | 15 min + Normtext DIN 4108-3 (3 Stellen) |
| 13 | [labor](labor.md) | Virtuelle Laborversuche | 1 | – | freigabereif nach Klärung von #253-HZ und #255-RuK | 3 | 1/7 | 15 min + Normtext DIN EN 12504-2 (1 Punkt, gemeinsam mit `probenahme`) |
| 14 | [schallschutz](schallschutz.md) | Schallschutz (DIN 4109) | 1 | Zertifikat Ausbau und Bestand | freigabereif (Regel 02.11.) | 4 | 0/11 | 15 min + Normtext DIN 4109-1/-2/-32/-34 (4 Punkte) |
| 15 | [stahlbeton_bemessung](stahlbeton_bemessung.md) | Stahlbetonbemessung (EC 2) | 1 | – | freigabereif (Regel 02.11.) | 4 | 2/11 | 15 min + Normtext NA (4 Punkte) |
| 16 | [mechanische_kenngroessen](mechanische_kenngroessen.md) | Mechan. Kenngrößen & E-Modul | 1 | Baustoffkunde | freigabereif (Regel 02.11.) | 5 | 1/7 | 15 min + NA EC 6 (2 Werte), 3 Quellen |
| 17 | [ec_kennwerte](ec_kennwerte.md) | Kennwerte und Bemessungswerte nach Eurocode | 1 | – | freigabereif (Regel 02.11.) | 7 | 7/7 | 15 min + Normtext (4 Punkte) |
| 18 | [bauschaeden](bauschaeden.md) | Recht & Grundlagen (VOB/BGB) (geändert) | 2 | Bauen im Bestand | freigabereif | 0 | 0/6 | 5 min |
| 19 | [pfas_baustoffe](pfas_baustoffe.md) | PFAS in Baustoffen (geändert) | 2 | A.RYC, Bauen im Bestand | freigabereif | 0 | 2/8 | 5 min |
| 20 | [ki_llmpraxis](ki_llmpraxis.md) | LLM-Praxis (Chat-KI-Assistenten) | 2 | KI im Bauwesen (Master) | freigabereif (Regel 02.11.) | 1 | 1/7 | 10 min + DIN 18202 (1 Zeile) |
| 21 | [ki_recht_ethik](ki_recht_ethik.md) | Fehler, Recht & Ethik | 2 | KI im Bauwesen (Master) | freigabereif (Regel 02.11.) | 1 | 1/7 | 10 min + NA EC 2 (1 Punkt) |
| 22 | [ki_thesen](ki_thesen.md) | Tools für Thesen & Literatur | 2 | KI im Bauwesen (Master) | freigabereif (Regel 02.11.) | 1 | 0/6 | 10 min + DIN EN 12390-13 (1 Punkt) |
| 23 | [materialoptimierung](materialoptimierung.md) | Materialoptimierung & Klinker | 2 | A.RYC, VNHB, WPF Nachhaltiges Bauen | freigabereif (Regel 02.11.) | 1 | 3/6 | 10 min + Richtlinientext DAfStb (1 Punkt) oder Entscheidung |
| 24 | [probenahme](probenahme.md) | Probenahme & Erkundung | 2 | A.RYC, Bauen im Bestand | freigabereif (Regel 02.11.) | 1 | 2/7 | 10 min + Normtext DIN EN 12504-2 (1 Punkt) |
| 25 | [ressourceneffizienz](ressourceneffizienz.md) | Ressourceneffizienz (REZ) | 2 | A.RYC | freigabereif (Regel 02.11.) | 1 | 1/7 | 10 min (gemeinsam mit `grundlagen`) |
| 26 | [schadensbilder](schadensbilder.md) | Typische Bauschäden (Schadensatlas) | 2 | Bauen im Bestand | freigabereif (Regel 02.11.) | 1 | 1/6 | 10 min + TR Instandhaltung (1 Grenze, gemeinsam mit `instandhaltung`) |
| 27 | [holzbau_verbindung](holzbau_verbindung.md) | Verbindungen & Anschlüsse | 2 | – | freigabereif (Regel 02.11.) | 2 | 2/6 | 10 min + Normtext EC 5/NA (2 Punkte) |
| 28 | [holzkorrosion](holzkorrosion.md) | Holzkorrosion & Schädlinge | 2 | Bauen im Bestand | freigabereif nach Klärung von T12-HK-2a/b | 2 | 2/7 | 10 min + Normtext DIN EN 351-1 (2 Werte) |
| 29 | [innenausbau](innenausbau.md) | Innenausbau-Sammlung & Ausbausysteme | 2 | Zertifikat Ausbau und Bestand | freigabereif (Regel 02.11.) | 2 | 1/7 | 10 min + Normtext DIN 18534-1, DIN 18365 (2 Punkte) |
| 30 | [nachbehandlung](nachbehandlung.md) | Nachbehandlung & Curing | 2 | – | freigabereif (Regel 02.11.) | 4 | 0/6 | 10 min + Normtext DIN 1045-3 (4 Punkte) |
| 31 | [energieausweis](energieausweis.md) | Energieausweis (GModG / GEG) | 2 | Bauen im Bestand, VNHB, Zertifikat Ausbau und Bestand | freigabereif (Regel 02.11.) | 1 | 2/6 | 15 min + DIN/TS 18599-10 (1 Wert) |
| 32 | [pruefverfahren_katalog](pruefverfahren_katalog.md) | Bauwerksdiagnose – Prüfverfahren-Katalog | 2 | Bauen im Bestand | freigabereif nach Klärung von T12-BU-7 | 1 | 6/7 | 15 min + Normtext DIN EN 12504-2 (1 Punkt) + 2 Entscheidungen |
| 33 | [instandhaltung](instandhaltung.md) | Stahlbetoninstandhaltung | 2 | – | freigabereif (Regel 02.11.) | 3 | 1/6 | 15 min + Normtext (3 Punkte) |
| 34 | [historisch](historisch.md) | Historische Materialkennwerte (geändert) | 2 | Bauen im Bestand | nicht freigabereif | 11 | 4/10 | 20 min + Normtext DIN EN 13791 (7 Punkte) |
| 35 | [bp_abdichtung](bp_abdichtung.md) | Abdichtungsprodukte | 3 | Zertifikat Ausbau und Bestand | freigabereif (Regel 02.11.) | 1 | 0/6 | 5 min + DIN 18533-3 (1 Punkt) |
| 36 | [bp_klebstoffe](bp_klebstoffe.md) | Kleb- & Dichtstoffe | 3 | – | freigabereif (Regel 02.11.) | 1 | 0/6 | 5 min + DIN 18540 (1 Tabelle, gemeinsam mit `bauchemie`) |
| 37 | [bp_verkehr_bitumen](bp_verkehr_bitumen.md) | Bitumen & Gesteine | 3 | – | freigabereif (Regel 02.11.) | 1 | 0/6 | 5 min + TL Gestein-StB (1 Punkt, gemeinsam mit `bp_verkehr_rsto` T7-BT-1b) |
| 38 | [px_karriere](px_karriere.md) | Karrierestart & Soft Skills | 3 | – | freigabereif (Regel 02.11.) | 1 | 0/6 | 5 min + DIN 1045-3 (1 Punkt) |
| 39 | [px_produktion](px_produktion.md) | Produktherstellung & QS | 3 | – | freigabereif (Regel 02.11.) | 1 | 0/6 | 5 min (Normtext gemeinsam mit `grundlagen`) |
| 40 | [bp_betonwaren](bp_betonwaren.md) | Betonwaren & Pflaster | 3 | – | freigabereif nach Klärung von T7-BW-2a/b | 2 | 0/6 | 5 min + DIN EN 1916/1338 (2 Werte) |
| 41 | [bp_mauerwerk](bp_mauerwerk.md) | Mauerwerksprodukte | 3 | – | freigabereif (Regel 02.11.) | 2 | 0/6 | 5 min + DIN 4108-4, DIN 105-100 (2 Werte) |
| 42 | [bp_verkehr_bahn](bp_verkehr_bahn.md) | Bahnbau & Oberbau | 3 | – | freigabereif (Regel 02.11.) | 2 | 0/6 | 5 min + DIN EN 13450/TL 918 061 (2 Werte) |
| 43 | [normen_ausblick](normen_ausblick.md) | Ausblick: neue Normengeneration (Beton und Eurocodes) (geändert) | 3 | – | freigabereif | 0 | 1/8 | 10 min |
| 44 | [bauwerksunters_monitoring](bauwerksunters_monitoring.md) | Tragwerksmonitoring (SHM) | 3 | – | freigabereif (Regel 02.11.) | 1 | 1/7 | 10 min (Normtext gemeinsam mit `pruefverfahren_katalog`) |
| 45 | [instandsetzung_materialien](instandsetzung_materialien.md) | Instandsetzung nach Material | 3 | Zertifikat Ausbau und Bestand | freigabereif (Regel 02.11.) | 1 | 0/6 | 10 min (WTA-Merkblatt gemeinsam mit `wta`) |
| 46 | [rechnung_schallschutz](rechnung_schallschutz.md) | Bauakustik: Bauschalldämmmaß | 3 | – | freigabereif (Regel 02.11.) | 1 | 0/6 | 10 min + Normtext (1 Punkt, gemeinsam mit `schallschutz`) |
| 47 | [schadreaktionen_beton](schadreaktionen_beton.md) | Betonkorrosion & Treiben | 3 | – | freigabereif (Regel 02.11.) | 1 | 0/6 | 10 min + Richtlinientext (1 Benennung) |
| 48 | [schutz_grundlagen](schutz_grundlagen.md) | Schutz- & Instandsetzungs-Grundlagen | 3 | – | freigabereif (Regel 02.11.) | 1 | 1/7 | 10 min + Normtext DIN EN ISO 12696 (1 Punkt, gemeinsam mit `instandhaltung`) |
| 49 | [rechnung_bestand](rechnung_bestand.md) | Bauen im Bestand: Sanierung | 3 | – | freigabereif nach Klärung von T15-BS-5 (Mindeststandardabweichung) | 2 | 4/6 | 10 min + DIN EN 13791 (gemeinsam mit `historisch`) |
| 50 | [rechnung_brandschutz](rechnung_brandschutz.md) | Brandschutz: Heißbemessung | 3 | – | freigabereif (Regel 02.11.) | 2 | 0/6 | 10 min + Normtext DIN EN 1992-1-2/NA (2 Punkte) |
| 51 | [rechnung_mauerwerk](rechnung_mauerwerk.md) | Mauerwerk: Tragfähigkeit | 3 | – | freigabereif (Regel 02.11.) | 2 | 3/6 | 10 min (gemeinsam mit `mauerwerk`) |
| 52 | [wta](wta.md) | WTA-Merkblätter | 3 | – | freigabereif (Regel 02.11.) | 2 | 1/7 | 10 min + WTA-Merkblätter (2 Punkte) |
| 53 | [bp_verkehr_betondecken](bp_verkehr_betondecken.md) | Betondecken (ZTV Beton-StB) | 3 | – | freigabereif (Regel 02.11.) | 3 | 0/6 | 10 min + ZTV/TL Beton-StB 26 (3 Punkte) |
| 54 | [bp_verkehr_tiefbau](bp_verkehr_tiefbau.md) | Tiefbau & Entwässerung | 3 | – | freigabereif (Regel 02.11.) | 4 | 5/6 | 10 min + DWA-A 138-1 (4 Punkte) |
| 55 | [bp_lehmbauprodukte](bp_lehmbauprodukte.md) | Lehmbauprodukte | 3 | – | freigabereif (Regel 02.11.) | 9 | 0/6 | 10 min + Normtexte DIN 18945–18948 (5 Punkte) |

## Normtext-Sitzungen: ein Dokument klärt mehrere Pakete

| Normtext bzw. Regelwerk | Kennungen | Pakete |
|---|---|---|
| DIN EN 12504-2:2021-10 (Rückprall) | T4-PN-2, T12-BU-7 | [`probenahme`](probenahme.md), [`labor`](labor.md), [`pruefverfahren_katalog`](pruefverfahren_katalog.md), [`bauwerksunters_monitoring`](bauwerksunters_monitoring.md) |
| DIN EN 1992-1-1/NA:2013-04 + NA/A1:2015-12 | #242-1 bis -4, T14-RE-2, EK-N4 | [`stahlbeton_bemessung`](stahlbeton_bemessung.md), [`ki_recht_ethik`](ki_recht_ethik.md), [`ec_kennwerte`](ec_kennwerte.md) |
| DIN EN 1996-1-1/NA und -3/NA:2019-12 | #239-W-1, #239-MW-1, T10-MK-5a/b, EK-N3 | [`mauerwerk`](mauerwerk.md), [`rechnung_mauerwerk`](rechnung_mauerwerk.md), [`mechanische_kenngroessen`](mechanische_kenngroessen.md), [`ec_kennwerte`](ec_kennwerte.md) |
| DIN 1045-2:2023-08 (Anhang E, Anwendungstabellen) | T9-GL-1a/b, T9-BM-1a/b | [`grundlagen`](grundlagen.md), [`ressourceneffizienz`](ressourceneffizienz.md), [`px_produktion`](px_produktion.md), [`bindemittel`](bindemittel.md) |
| DIN 1045-3:2023-08 | T9-NB-1a–d, T15-PK-1 | [`nachbehandlung`](nachbehandlung.md), [`px_karriere`](px_karriere.md) |
| DIN 4108-3:2024-03; DIN EN ISO 10456 | F-Stellen T1/9, T11-BP-2a/b | [`feuchteschutz`](feuchteschutz.md), [`bauphysik`](bauphysik.md) |
| DIN 4109-1/-2/-32/-34 | #247-9, F-Stellen Trittschall | [`schallschutz`](schallschutz.md), [`rechnung_schallschutz`](rechnung_schallschutz.md) |
| DIN EN 1992-1-2/NA | #247-7, #247-8 | [`rechnung_brandschutz`](rechnung_brandschutz.md) |
| DAfStb-Alkali-Richtlinie 2013-10 | #247-5, #247-6, T12-AS-8 | [`expositionsklassen`](expositionsklassen.md), [`schadreaktionen_beton`](schadreaktionen_beton.md) |
| DIN EN 13791:2020-02 + A20:2022-04 | T15-BS-5, NS-BD-3, HK-13791-1 bis -6 | [`historisch`](historisch.md), [`rechnung_bestand`](rechnung_bestand.md) |
| DBV-Merkblatt Modifizierte Teilsicherheitsbeiwerte (03/2013); DIN EN 772-1 Tab. A.1 | #248-γc, NP2-HI-1 | [`historisch`](historisch.md) |
| DIN EN 1542; DIN EN 1427:2015 | #253-HZ, #255-RuK (nicht gekennzeichnet) | [`labor`](labor.md) |
| TR Instandhaltung; DIN EN ISO 12696:2022-09 | T13-IH-10 bis -12 | [`instandhaltung`](instandhaltung.md), [`schutz_grundlagen`](schutz_grundlagen.md), [`schadensbilder`](schadensbilder.md) |
| WTA-Merkblatt 2-9-20/D | T13-WTA-4, -5 | [`wta`](wta.md), [`instandsetzung_materialien`](instandsetzung_materialien.md) |
| DIN 18540 | T4-BC-2 (mit Tab. 2) | [`bauchemie`](bauchemie.md), [`bp_klebstoffe`](bp_klebstoffe.md) |
| DIN 18940, DIN 18945 bis 18948 | T5-LE-2a/b, T8-LE-Q1a–d, T8-LE-Q2a–d | [`lehm`](lehm.md), [`bp_lehmbauprodukte`](bp_lehmbauprodukte.md) |
| DIN EN 1995-1-1/NA:2013-08 (A2:2014) | T10-HV-2a/b, EK-N2 | [`holzbau_verbindung`](holzbau_verbindung.md), [`ec_kennwerte`](ec_kennwerte.md) |
| DIN EN 206:2021-06 | T3-FB-2, F-Stelle T3/4 | [`frischbeton`](frischbeton.md) |
| NEN 5970:2001 | T3-HY-1 | [`hydratation_folgen`](hydratation_folgen.md) |
| DIN EN 1993-1-1/NA; DIN EN 1990 Anhang D | EK-N1, EK-N5 | [`ec_kennwerte`](ec_kennwerte.md) |
| DIN/TS 18599-10:2025-10 | T11-EA-4 | [`energieausweis`](energieausweis.md) |
| DAfStb-Richtlinie THG-reduzierte Tragwerke (08/2024) | T11-MO-2 | [`materialoptimierung`](materialoptimierung.md) |
| DIN EN 351-1:2023-07 | T12-HK-2a/b | [`holzkorrosion`](holzkorrosion.md) |
| DIN 18534-1:2025-10; DIN 18365 | T6-IA-3, T6-IA-4 | [`innenausbau`](innenausbau.md) |
| DIN 18533-3:2026-06 | T8-AB-Q2 | [`bp_abdichtung`](bp_abdichtung.md) |
| DIN EN 1916; DIN EN 1338 | T7-BW-2a/b | [`bp_betonwaren`](bp_betonwaren.md) |
| DIN 4108-4:2020-11; DIN 105-100/DIN 20000-401 | T7-MW-3a/b | [`bp_mauerwerk`](bp_mauerwerk.md) |
| TL Gestein-StB 04/23; ZTV/TL Beton-StB 26; ZTV Asphalt-StB 26 | T7-BT-1a, T7-BD-2, T7-BD-3a/b, F-Stelle T3/8 | [`bp_verkehr_bitumen`](bp_verkehr_bitumen.md), [`bp_verkehr_betondecken`](bp_verkehr_betondecken.md), [`asphalt`](asphalt.md) |
| DIN EN 13450; DB TL 918 061 | T7-BA-1a/b | [`bp_verkehr_bahn`](bp_verkehr_bahn.md) |
| DWA-A 138-1:2024-10 | #247-1 bis -4 | [`bp_verkehr_tiefbau`](bp_verkehr_tiefbau.md) |
| DIN 18202:2019-07; DIN EN 12390-13 | T14-LP-7, T14-TH-5 | [`ki_llmpraxis`](ki_llmpraxis.md), [`ki_thesen`](ki_thesen.md) |

## Kleine Korrekturen in diesem PR

Eindeutige Kleinfehler, die beim Zusammenstellen auffielen (Regressionstest `tests/freigabepakete_20261104.test.ts`):

| Modul | Fundstelle | vorher | nachher | Beleg |
|---|---|---|---|---|
| `hydratation_folgen` | `src/data/kurzfassung.ts` | E-Modul nach 2 Tagen „etwa 70 bis 80 %“ | „etwa 70 bis 85 %“ | DIN EN 1992-1-1, Gl. 3.2/3.5: β_cc(2 d)^0,3 = 73 % (S), 81 % (N), 85 % (R); Hinweis aus Tranche 3, Nr. 5; Kern `kennwerteZumAlter` |
| `hydratation_folgen` | `content/hydratationfolgen/HydratationFolgen.json` (Erläuterung E-Modul-Entwicklung) | „0.3-Potenzierung … ca. 70–80 % nach 2 Tagen“ | „Potenz 0,3 auf β_cc(t) … ca. 70–85 %: 73 % S, 81 % N, 85 % R“ | wie oben; Dezimalkomma |
| `historisch` (F-Freigabe-Liste) | `scripts/auditDaten.ts`, `FACHGEBIETE` | 17 Fundstellen „vorläufig, Normprüfung ausstehend“ des Reiters Bohrkernserie und eine der WU-Quizfrage ohne Fachgebiet (Hinweis in `tests/auditDaten.test.ts`) | Alternativen angehängt: `bohrkernserie`, `Bohrkern`, `Prüfbereich` (Prüfverfahren & Bauwerksdiagnostik), `WU-Richtlinie` (Beton & Stahlbeton); keine Fundstelle mehr unter „Weitere“ | Vorgabe „F-Freigabe-Fundstellen brauchen ein Fachgebiet“; nur Anhängen, keine bestehende Alternative geändert |
| `labor` | `src/components/labor/SchmidtHammerSimulator.tsx`, Bildunterschrift der Rückprallskala | „rot: > 25 % vom Median“ | „rot: mehr als 6 Einheiten vom Median“ | seit #254 (29.10.) markiert der Simulator die Werte aus `rueckprallMesssatz` (> 6 Einheiten); der Text war stehen geblieben |
| `materialoptimierung` | `tests/materialoptimierung.test.ts`, Kommentar Zeile 10 | „round(320·GWP_Zement + 30)“ | „+ 45 (seit 30.10.2026)“ | Kern `src/calc/materialoptimierung.ts` und Zeile 12 desselben Tests rechnen mit + 45 (nur Kommentar) |

## Größere Punkte (nur aufgelistet, nicht geändert)

- **Rückprall-Verwerfungsregel, Ausgabenzuordnung widersprüchlich:** Kern-Hinweis und Simulator nennen „6 Einheiten nach DIN EN 12504-2:2012; Ausgabe 2021-10 laut Sekundärquellen 25 % des Medians“, Kernkopf, `Probenahme.json` und `pruefverfahrenData.json` schreiben die 6-Einheiten-Regel der Ausgabe 2021-10 zu. Klärt sich mit T4-PN-2 am Normtext (Vorschlag in `bearbeitungsvermerke-2026-11-02.md`: auf 25 % umstellen, sobald bestätigt).
- **Mindeststandardabweichung nach DIN EN 13791 uneinheitlich:** `historisch` (Reiter Bohrkernserie) setzt s ≥ 0,08·f_m standardmäßig an, `rechnung_bestand` und `bauwerksdiagnose` nicht. Nach dem Normtext einheitlich festlegen.
- **`pruefverfahren_katalog`, zwei Textwidersprüche aus Tranche 12:** Ultraschall-Gefügestufen (Kern 3000/3800 m/s, Text 3000/3500/4500 m/s) und Ablesezeit Phenolphthalein (30–60 s gegen 60–120 s). Fachliche Festlegung nötig.
- **Fugentiefe:** DIN 18540, Tab. 2 in `bp_klebstoffe` (b = 20 mm → t = 12 ± 2 mm) neben der Faustregel b : t ≈ 2 : 1 (10 mm) in `bauchemie` und `schadensbilder`. Mit T4-BC-2 einheitlich fassen.
- **`historisch` (EK-5):** γ = 1,0/1,5 als Literale und f_k Mauerwerk nach EN-Formel (K = 0,55) statt NA-Tafeln; Vorschlag aus `ec-kennwerte-2026-11-02.md`: zentrale Konstanten verwenden.
- **Prüfbogen „Wert in der App“ veraltet** bei T4-PN-2, T12-BU-7 (seit 29.10. Messsatz verwerfen, 6 Einheiten), T9-NB-1a/b (seit 29.10. Hinweis unter 5 °C, XF3/XF4 doppelt) und T8-LE-Q1 (seit 29.10. als Lehrmodell gekennzeichnet). Die Pakete nennen den aktuellen Stand.

## Vorgehen

- **Offene Module:** `FACHMODULE` mit `pruefvermerkFuer(id).status !== "geprueft"` (51 Module).
- **Geänderte Module:** je geprüftem Modul `git log --first-parent` über Komponente, Inhalt (`content/…`) und Rechenkerne seit dem Prüfdatum. Als wesentlich gewertet: neuer Reiter oder Rechenkern (`historisch`, #318), Umzug von Inhalt (`bauschaeden`, #317), geänderte Rechts- oder Fachaussage (`pfas_baustoffe`, #322) und neuer Fachabschnitt (`normen_ausblick`, #308), jeweils ohne spätere Nachprüfung. Nicht als wesentlich gewertet: Korrekturen aus den Prüfrunden selbst (Durchsicht A–D, Gegenprüfung, Nachstichproben 3–5, z. B. `oekobilanz_lca`, `lca_*`, `spannbeton_*`, `schadstoffe`), technische Umstellungen ohne Wertänderung (#305 Grenzfälle, #311 Bearbeitungsvermerke, #312 Anzeige „–“, #320 Titel/Suche) und reine Registry-Ergänzungen (`regularien`, #302/#308).
- **Befunde, Normpunkte, Quellen:** Befundlisten Tranche 1–16 einschließlich der Abschnitte „Umsetzung“ und „Freigabe“, Durchsichten A–D, Gegenprüfung 30.10., Nachstichproben 1–5c, Konsistenz 29.10., Grenzfälle 02.11., Rechtsquellen 03.11., EC-Kennwerte und Historische Kennwerte 02.11., Prüfbogen Normtext (28.10.).
- **Tests und Referenzwerte:** Tests, die einen Rechenkern des Moduls importieren, mit Zahl der Prüfungen; Referenzwerte aus den Handrechnungen der Tests und Befundlisten. Für `ec_kennwerte` und die Lehrbeispiele von `historisch` zusätzlich eigene Nachrechnung.
- **Datei und Zeile** in den Prüfschritten sind beim Erzeugen aus dem aktuellen Stand gesucht (Stand dieses Branches).
