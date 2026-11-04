# Freigabepaket: Karrierestart & Soft Skills (`px_karriere`)

Stand 04.11.2026 · Gruppe „Praxiswissen“ · Typ `standard` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif nach Klärung von T15-PK-1** – Kostenbeispiele richtig, Faktenstichprobe plausibel; offen ist nur, ob DIN 1045-3:2023-08 noch eine Überwachungsklasse 3 kennt.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Praxiswissen Berufseinstieg: Schriftverkehr, Arbeitsschutz (DGUV Vorschrift 38, BaustellV), Haftung, Fortbildungspflicht (BayBauKaG), Zusatzqualifikationen (SIVV-Schein, E-Schein), Kostenbeispiele.

Bedeutung für die Lehre: Ergänzung und Nachschlagen; in keinem Lernpfad zugeordnet.

## Reiter und Bereiche

Reiter „Karrierestart & Soft Skills“ der Komponente Praxiswissen.

Komponente `src/modules/Praxiswissen.tsx`; Inhalt `content/praxiswissen/Praxiswissen.json`.

## Rechenkerne und Testabdeckung

Kein Rechenkern; zwei Kostenbeispiele in Tranche 15 nachgerechnet.

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T15-PK-1 | „ÜK 2 (DIN 1045-3:2023-08; bis 2012 auch ÜK 3)“ – führt DIN 1045-3:2023-08 die Überwachungsklasse 3 noch? | offen (Normtext) | T15 (`module-tranche-15.md`) (Nr. 10) |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Kennungen nach dem Prüfbogen Normtext (Stand 28.10.2026) bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens.

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| T15-PK-1 | DIN 1045-3:2023-08 (Überwachungsklassen) | Gibt es die Überwachungsklasse 3 noch? | Beschreibung E-Schein in `content/praxiswissen/Praxiswissen.json:556` |

## Quizfragen

6 Fragen, alle freigegeben.

## Quellen

DGUV Vorschrift 38, BaustellV, BayBauKaG, DBV (Ausbildungsbeirat SIVV), DIN 1045-3:2023-08. Befundliste Tranche 15, Nr. 10.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Angebot: 100 000 €·1,09·1,05 = 114 450 €.
2. Lohnkosten: 250 h·0,8·30 €/h = 6 000 €.
3. Fortbildungspflicht nach BayBauKaG und Zusatzqualifikationen (SIVV-Schein, E-Schein) – Aussagen plausibel.
4. Überwachungsklassen: „ÜK 2 … bis 2012 auch ÜK 3“ an DIN 1045-3:2023-08 prüfen (T15-PK-1).
5. Arbeitsschutz: DGUV Vorschrift 38 und BaustellV korrekt zugeordnet (Bauherrenpflichten, SiGeKo).

## Empfehlung

**freigabereif nach Klärung von T15-PK-1.** Kostenbeispiele richtig, Faktenstichprobe plausibel; offen ist nur, ob DIN 1045-3:2023-08 noch eine Überwachungsklasse 3 kennt.

Nach der Regel der Freigabe vom 02.11.2026 (Tranche 16: im Modul gekennzeichnete Normtextpunkte gelten als erledigt) wäre das Modul schon jetzt freigabereif; nach der Regel vom 28.10.2026 (Normtextpunkte blockieren) erst nach dem Normtextabgleich. Siehe `README.md`, Abschnitt „Zu entscheiden“.
