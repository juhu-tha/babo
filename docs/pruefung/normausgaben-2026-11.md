# Normausgaben-Prüfung 11/2026

Stand: 02.11.2026 · Ausgangsstand: Registry „Ausgaben Stand 10/2026“ (`docs/normen-check/2026-10.md`, Lauf vom 26.10.2026) · Registry: `src/data/centralNormenRegistry.ts` (AP 0.5/0.6), Normen-Check: `scripts/qa/normen-check.mjs` (AP 6.7)

Vorgehen: Für die in der App am häufigsten zitierten Normen (Zählung der Fundstellen in `src/` und `content/`, siehe Abschnitt 1) wurde per Websuche nach neuen Ausgaben, Entwürfen, Zurückziehungen und Berichtigungen gesucht. Abgerufen wurden nur Seiten aus Suchergebnissen (Produkt- und Projektseiten von DIN Media und DIN, TRIS-Datenbank der EU-Kommission, Fachverlage); robots.txt wurde beachtet. Eingetragen wurde nur, was eindeutig belegt ist. Nicht eindeutig belegte Punkte sind mit „vorläufig, Normprüfung ausstehend“ gekennzeichnet.

**Ergebnis kurz:** Seit 10/2026 hat sich keine maßgebende (bauaufsichtlich eingeführte oder in der Registry führende) Ausgabe geändert. Neu sind mehrere **Entwürfe** (DIN EN 197-1, DIN EN 196-1, DIN EN 1992-1-1/NA1 und /A1, DIN EN 1995-1-1/A1, DIN EN 1996-1-1/A1, DIN 4109-1), das Normungsprojekt **DIN 1045-2/A1** und der notifizierte Entwurf der **MVV TB 2026/1**. Die Registry-Beschreibungen wurden ergänzt; `code`, `ausgabeStand` und `status` sind unverändert. Deshalb waren keine registrygebundenen Ausgabenangaben in `content/` nachzuziehen.

## 1. Zitierhäufigkeit (Grundlage der Auswahl)

Treffer in `src/` und `content/` (`grep -o`, 02.11.2026):

| Norm/Regelwerk | Treffer |
|---|---|
| DIN 1045 (alle Teile) | 848 |
| DIN EN 1992 | 848 |
| DIN EN 206 | 515 |
| GModG / GEG | 376 / 233 |
| DIN 4108 | 334 |
| DIN EN 12390 | 245 |
| DIN EN 1995 | 233 |
| DIN EN 13791 | 190 |
| DIN 4109 | 190 |
| DIN EN 15804 | 178 |
| DIN EN 197 | 143 |
| MVV TB | 132 |
| DIN EN 1996 | 126 |
| DIN 18533–18535 | 113 |
| DIN EN 15978 | 82 |
| DIN EN 12620 | 44 |

## 2. Ergebnis je Norm

| Norm | bisher (Registry 10/2026) | neu (11/2026) | Quelle | Folgen in der App |
|---|---|---|---|---|
| DIN EN 206 / DIN 1045-2 | DIN EN 206:2021-06 + DIN 1045-2:2023-08 maßgebend; DIN EN 206-1/-2:2026-07 erschienen | bestätigt: DIN EN 206-1:2026-07 ersetzt DIN EN 206:2021-06 teilweise. **Neu:** Normungsprojekt DIN 1045-2/A1 (Beginn 13.07.2026, Vorgänger DIN 1045-2:2023-08); noch kein Entwurf | [DIN Media DIN EN 206-1](https://www.dinmedia.de/de/norm/din-en-206-1/399836281); [DIN Media Updateverzeichnis Betonbau (Stand 08/2026)](https://www.dinmedia.de/resource/blob/1093354/37f9b7fe6843cadd153a0b0887bb2fc4/updateverzeichnis-betonbau-data.pdf); [DIN-Projekt DIN 1045-2/A1](https://www.din.de/en/wdc-proj:din21:404330876) | Registry `DIN_EN_206`: Beschreibung ergänzt. Modul Normenausblick (fest im Text): „ein Termin ist öffentlich nicht bekannt“ bleibt richtig; Hinweis auf das Projekt möglich (Liste Abschnitt 3) |
| DIN 1045-1, -3, -4 | DIN 1045-3:2023-08 | keine neue Ausgabe gefunden | – | keine |
| DIN EN 1992-1-1 (EC2) | 2011-01 + A1:2015-03 mit NA eingeführt; DIN EN 1992-1-1:2025-09 (2. Generation) erschienen | bestätigt. **Neu:** Entwurf DIN EN 1992-1-1/NA1:2025-08 (Nationaler Anhang zur 2. Generation) und Entwurf DIN EN 1992-1-1/A1:2026-05 (EN 1992-1-1:2023/prA1:2026). Einführung weiter offen (siehe MVV TB) | [DIN-Entwurf NA1](https://www.din.de/en/wdc-beuth:din21:392741740); [DIN-Entwurf A1](https://www.din.de/en/getting-involved/standards-committees/nabau/drafts/wdc-beuth:din21:403144094); [DIN-Projekt A1](https://www.din.de/en/getting-involved/standards-committees/nabau/projects/wdc-proj:din21:398940143) | Registry `DIN_EN_1992_1_1`: Beschreibung ergänzt; Rechenwerte (`normParams.ts`, NA DE der 1. Generation) unverändert |
| MVV TB | 2025/1 (im Text zitiert, kein Registry-Eintrag) | 2025/1 bleibt aktuell. **Neu:** Entwurf MVV TB 2026/1 notifiziert (TRIS 2026/0349/DE, eingegangen 09.07.2026, Stillhaltefrist bis 12.10.2026; Änderungen in A1–A3, A5, B2–B4, C2–C4). Veröffentlichung nicht gefunden; ob Eurocodes der 2. Generation aufgenommen werden, nennt die Notifizierung nicht – vorläufig, Normprüfung ausstehend | [TRIS 2026/0349/DE](https://technical-regulation-information-system.ec.europa.eu/en/notification/28201) | Zitate „MVV TB 2025/1“ bleiben richtig; nach Veröffentlichung der 2026/1 erneut prüfen |
| DIN EN 1995-1-1 (EC5) | 2010-12 + A2:2014-07 mit NA eingeführt; 2026-09 (2. Generation) | bestätigt (DIN EN 1995-1-1:2026-09 ersetzt 2010-12 und A2:2014-07). **Neu:** Entwurf DIN EN 1995-1-1/A1:2026-10 (EN 1995-1-1:2025/prA1:2026) | [DIN Media DIN EN 1995-1-1:2026-09](https://www.dinmedia.de/de/norm/din-en-1995-1-1/396471004); [DIN Media Entwurf A1](https://www.dinmedia.de/en/draft-standard/din-en-1995-1-1-a1/405676816) | Registry `DIN_EN_1995_1_1`: Beschreibung ergänzt |
| DIN EN 1996-1-1 (EC6) | 2013-02 | **Neu:** Entwurf DIN EN 1996-1-1/A1:2026-05 zu EN 1996-1-1:2022 (2. Generation). Ob/wann eine deutsche Ausgabe der 2. Generation erschienen ist, ließ sich nicht belegen – vorläufig, Normprüfung ausstehend | [DIN Media Entwurf A1](https://www.dinmedia.de/de/norm-entwurf/din-en-1996-1-1-a1/401023780) | Registry `DIN_EN_1996_1_1`: Beschreibung ergänzt (mit Kennzeichnung); 2013-02 bleibt führende Ausgabe |
| DIN 4108-2 / -3 | 4108-2:2026-05, 4108-3:2024-03 | bestätigt: DIN 4108-2:2026-05 ersetzt 2013-02 (aktuell) | [DIN Media DIN 4108-2](https://www.dinmedia.de/en/standard/din-4108-2/401017482) | Registry `DIN_4108_2`: Ersatzvermerk ergänzt. Fest verdrahtete Angaben „2013-02“ bekannt aus 10/2026 (Liste Abschnitt 3) |
| GEG / GModG | GModG in Kraft seit 29.07.2026 | bestätigt: verkündet 28.07.2026 (BGBl. 2026 I Nr. 226), in Kraft 29.07.2026; weitere Teile (EPBD-Umsetzung) ab 01.01.2027 | [Ökozentrum NRW, Update 14.10.2026](https://oekozentrum.nrw/aktuelles/detail/news/update-zum-gmodg/); [Verbraucherzentrale NRW](https://www.verbraucherzentrale.nrw/wissen/energie/energetische-sanierung/gmodg-was-steht-im-gebaeudemodernisierungsgesetz-13886) | keine; die Fundstelle BGBl. stammt aus einer Sekundärquelle (vorläufig, Normprüfung ausstehend bis Abgleich mit recht.bund.de) |
| DIN 18533 | 18533-1 bis -3:2026-06 | bestätigt (Neuausgabe seit 01.06.2026: Wasserbeanspruchungsklassen, Rissklassen zusammengeführt, Wasser im Baugrund aus DIN 4095-1, FPD in Teil 3) | [DIN Media DIN 18533-1](https://www.dinmedia.de/de/norm/din-18533-1/399850897); [Bauprofessor 03.06.2026](https://www.bauprofessor.de/news/neuauflage-der-din-18533-abdichtung-von-erdberuehrten-bauteilen/) | keine |
| DIN 18534 | 18534-1 bis -6:2025-10 | keine neue Ausgabe gefunden | – | keine |
| DIN 18535 | 18535-1 bis -3:2017-07 | keine neue Ausgabe und kein Entwurf gefunden (Fachartikel 08/2025: „weiterhin unverändert gültig“) | [Der Dichtebau 08/2025](https://www.derdichtebau.de/fileadmin/Dokumente/Downloads/250807-DDB-2503-6068-DIN-18535-Normenartikel-RZ-WEB.pdf) | keine |
| DIN EN 15804 | 2022-03 (EN 15804:2012+A2:2019) | aktuell; Revision prEN 15804 in Bearbeitung (CEN-Stufe 00.60, kein Entwurfstermin) | [DIN Media DIN EN 15804:2020-03 (zurückgezogen, ersetzt durch 2022-03)](https://www.dinmedia.de/en/standard/din-en-15804/305764795); [Genorma prEN 15804 rev](https://genorma.com/en/standards/pren-15804-rev) | keine |
| DIN EN 15978 | 2026-09 | bestätigt (Deutsche Fassung EN 15978:2026) | [DIN DIN EN 15978:2026-09](https://www.din.de/en/wdc-beuth:din21:399836772) | keine; fest verdrahtete „2012-10“-Angaben bekannt aus 10/2026 |
| DIN EN 13791 | (nicht in der Registry; im Text 2020-02 + A20:2022-04) | keine neue Ausgabe und kein Entwurf gefunden – vorläufig, Normprüfung ausstehend | – | keine |
| DIN EN 12390-Reihe | Registry: -2 und -3:2019-10 | -2/-3 unverändert. Außerhalb der Registry: **DIN EN 12390-18:2025-02** (EN 12390-18:2021+A1:2024) ersetzt 2021-09; **DIN EN 12390-10:2019-08** ist die aktuelle (berichtigte) Ausgabe, eine Ausgabe „2019-02“ ist nicht belegt; **Entwurf DIN EN 12390-12:2025-11** (prEN 12390-12:2025); DIN EN 12390-4:2025-05, -6:2024-05 aktuell | [DIN Media 12390-18:2025-02](https://www.dinmedia.de/de/norm/din-en-12390-18/384233984); [DIN Media 12390-10:2019-08](https://www.dinmedia.de/de/norm/din-en-12390-10/307154009); [DIN Media Entwurf 12390-12](https://www.dinmedia.de/en/draft-standard/din-en-12390-12/395558732); Updateverzeichnis Betonbau (s. o.) | fest verdrahtete Fußzeilen/Texte (Liste Abschnitt 3) |
| DIN EN 197 | 197-1:2011-11, 197-5:2021-07 | **Neu:** Entwurf DIN EN 197-1:2026-08 (prEN 197-1:2026; u. a. Weißzement, CEM II/C-M und CEM VI aufgenommen, Recyclingbetonmehl und Bodenasche als Bestandteile, Festigkeitsklassen neu definiert, Alkaligehalt) | [DIN Media Entwurf DIN EN 197-1](https://www.dinmedia.de/de/norm-entwurf/din-en-197-1/403619650) | Registry `DIN_EN_197_1`: Beschreibung ergänzt |
| DIN EN 196-1 | 2016-11, „Entwurf prEN 196-1:2026 liegt vor“ | präzisiert: Entwurf DIN EN 196-1:2026-08 | [DIN Entwurf DIN EN 196-1](https://www.din.de/en/wdc-beuth:din21:404064938) | Registry `DIN_EN_196_1`: Beschreibung präzisiert |
| DIN EN 12620 | 2008-07 | keine neue Ausgabe gefunden. Begleitnormen **DIN 4226-101/-102:2025-11** ersetzen die Ausgaben 2017-08 | [DIN Media DIN 4226-102:2025-11](https://www.dinmedia.de/de/norm/din-4226-102/391976582); Updateverzeichnis Betonbau (s. o.) | Fußzeile Sonderbetone (Liste Abschnitt 3) |
| DIN 4109-1 | 2018-01 | **Neu:** Entwurf DIN 4109-1:2026-09 (erschienen 14.08.2026; Titel „Anforderungen“, Tabellen 2 bis 12 teils geändert/gestrichen, Außenlärm neu gefasst). Weitere Entwürfe der Reihe (-31, -33) laut Suchergebnissen vorhanden, nicht einzeln geprüft – vorläufig, Normprüfung ausstehend | [DIN Media Entwurf DIN 4109-1](https://www.dinmedia.de/de/norm-entwurf/din-4109-1/403205998) | Registry `DIN_4109_1`: Beschreibung ergänzt; Schallschutzwerte der App beruhen auf 2018-01 und bleiben |

Status-Feld: Die Entwürfe ändern die Gültigkeit der bisherigen Ausgaben nicht; `status` bleibt deshalb `gueltig` (ein Wechsel auf `in_ueberarbeitung` würde in Regularien „Übergang neue Fassung“ anzeigen, was für reine Entwürfe zu weit ginge).

## 3. Fest verdrahtete Ausgabenangaben (nur gemeldet, nicht geändert)

| Fundstelle | Angabe | Befund | Vorschlag |
|---|---|---|---|
| `content/korrosion/Korrosion.json:145` (Fußzeile) | DIN EN 12390-10:2019-02 | aktuelle Ausgabe 2019-08 (Berichtigung der 2019-03) | auf 2019-08 ändern |
| `content/schnellkarbonatisierung/Schnellkarbonatisierung.json:169` (Fußzeile) | DIN EN 12390-10:2019-02 | wie oben | auf 2019-08 ändern |
| `content/lebensdauerbemessung/Lebensdauerbemessung.json:230` (Fußzeile) und `:16` (Einleitung) | DIN EN 12390-18:2021-09 | ersetzt durch 2025-02 (+A1:2024; Formel (5) angepasst) | auf 2025-02 ändern; Formelbezug im Rechner prüfen |
| `content/sonderbetone/Sonderbetone.json:165` (Fußzeile) | DIN 4226-101/-102:2017-08 | ersetzt durch 2025-11 | auf 2025-11 ändern |
| `content/normenausblick/NormenAusblick.json` (`standOktober2026Für`, `setztEineAbgestimmteNeufassung`) | „Stand Oktober 2026“; Neufassung DIN 1045-2 „Termin öffentlich nicht bekannt“ | inhaltlich weiter richtig; Projekt DIN 1045-2/A1 seit 07/2026, Entwürfe EC2-NA1 und MVV TB 2026/1 nicht erwähnt | Stand auf 11/2026 heben und die drei Punkte ergänzen |
| `src/data/rechnerGrenzen.ts:399` | DIN EN 1995-1-2:2010-12 („Neuausgabe 2026-10 nicht berücksichtigt“) | Neuausgabe 2026-10 nicht überprüft; laut Suchergebnissen existiert ein Entwurf DIN EN 1995-1-2/A1 – vorläufig, Normprüfung ausstehend | bei nächster Prüfung klären |
| Texte mit DIN EN 12390-12:2020-04 (8 Fundstellen) | Ausgabe 2020-04 | gilt weiter; Entwurf 2025-11 liegt vor | ggf. Hinweis „Entwurf 2025-11“ |
| aus 10/2026 bekannt (`docs/normen-check/2026-10.md`, Abschnitt 4) | DIN 4108-2:2013-02, DIN EN 15978:2012-10, DIN 1045-2:2008, DIN EN 1992-1-1:2011/2023-08, DIN 18945–18947:2018-12 u. a. | weiterhin offen | getrennt behandeln |

## 4. Offene Punkte

- MVV TB 2026/1: Veröffentlichung abwarten; danach Einführung EC2/EC3/EC5 der 2. Generation und DIN EN 206-1:2026 prüfen.
- DIN EN 1996-1-1, 2. Generation: deutsche Ausgabe belegen (vorläufig, Normprüfung ausstehend).
- GModG: Fundstelle BGBl. 2026 I Nr. 226 an recht.bund.de abgleichen.
- DIN 4109-31/-33: Entwürfe einzeln prüfen.
- DIN EN 13791: keine Quelle zu Änderungen gefunden; beim nächsten Normen-Check (AP 6.7) erneut prüfen.
