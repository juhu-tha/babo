# Freigabepaket: Schutz- & Instandsetzungs-Grundlagen (`schutz_grundlagen`)

Stand 04.11.2026 · Gruppe „Schutz & Instandsetzung“ · Typ `norm` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif nach Klärung von T13-IH-10** – Drei Fehler behoben, Faktenstichprobe ohne Befund; offen ist das KKS-Schutzkriterium am Normtext DIN EN ISO 12696.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Grundlagen des Bautenschutzes und der Betoninstandsetzung: Prinzipien 1–11 nach DIN EN 1504-9, passive und aktive Schutzsysteme, Tuutti-Modell der Lebensdauer, De-Sitter-Regel (Kostenfaktor 5), Verfahrenswahl, kathodischer Korrosionsschutz.

Bedeutung für die Lehre: Ergänzung und Nachschlagen; in keinem Lernpfad zugeordnet.

## Reiter und Bereiche

Reiter laut Komponente: 1. Instandsetzungsprinzipien (DIN EN 1504 / TR) (`prinzipien`) · 2. Schutzmechanismen (Passiv vs. Aktiv) (`mechanismen`) · 3. Lebenszyklus & Degradation (Tuutti / De Sitter) (`lebensdauer`) · 4. Verfahrenswahl-Matrix (`verfahrenswahl`).

Komponente `src/modules/SchutzGrundlagen.tsx`; Inhalt `content/schutzgrundlagen/SchutzGrundlagen.json`.

## Rechenkerne und Testabdeckung

| Kern | Tests (Zahl der Prüfungen) | Referenzwerte |
|---|---|---|
| `src/calc/schutzInstandsetzung.ts` | `tests/keinErgebnisAnzeige.test.ts` (1), `tests/modulpruefungTranche13.test.ts` (19), `tests/nachstichprobe4.test.ts` (60) | de Sitter K₃ = 2000·5³ = 250 000 €; Klopfer s_d,CO₂ = 400 000·0,00025 = 100 m ≥ 50 m |

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T13-SG-1 | ECE und ER den Teilen der DIN EN 14038 vertauscht zugeordnet | erledigt (behoben) | T13 (`module-tranche-13.md`) (Nr. 6) |
| T13-SG-2 | OS 4 als rissüberbrückend genannt → OS 5a/5b bzw. OS 10/OS 11 | erledigt (behoben) | T13 (`module-tranche-13.md`) |
| T13-SG-3 | Holzschutz: „Pilzbefall biologisch unmöglich“; Borate für GK 3/4 | erledigt (behoben) | T13 (`module-tranche-13.md`) |
| T13-IH-10 | KKS-Kriterium „Depolarisation ≥ 100 mV innerhalb von 24 h bis 72 h“ | offen (Normtext) (gekennzeichnet) | T13 (`module-tranche-13.md`) |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Kennungen nach dem Prüfbogen Normtext (Stand 28.10.2026) bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens.

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| T13-IH-10 | DIN EN ISO 12696:2022-09 (KKS) | Schutzkriterium: „Depolarisation ≥ 100 mV innerhalb von 24 h bis 72 h“ oder „≥ 100 mV in höchstens 24 h bzw. ≥ 150 mV über längere Zeit“? | Kurzfassung, Reiter KKS (`content/stahlbetoninstandhaltung/Stahlbetoninstandhaltung.json:133`) und `schutz_grundlagen` (`content/schutzgrundlagen/SchutzGrundlagen.json:297`) |

## Quizfragen

7 Fragen, davon 1 nicht freigegeben: `qlz_schutz_grundlagen_1`.

## Quellen

DIN EN 1504-9, DIN EN 14038-1/-2, DIN EN ISO 12696:2022-09, DIN EN ISO 1461:2022-12, DAfStb-Instandsetzungsrichtlinie (Prinzipien W/C/R/K). Befundliste Tranche 13, Nr. 6.

## Prüfschritte für die Freigabe (ca. 15 min)

1. De-Sitter-Regel: Kosten je Phase × 5; K₃ = 2000·5³ = 250 000 €.
2. Klopfer-Kriterium: s_d,CO₂ = µ·d = 400 000·0,00025 m = 100 m ≥ 50 m → karbonatisierungsbremsend.
3. Tuutti: Einleitungsphase t₀ = (c/k)² (wie `korrosion`/`karbonatisierung`).
4. Prinzipien DIN EN 1504-9: 1–6 Beton, 7–11 Bewehrung; Rili-SIB-Prinzipien W/C/R/K.
5. KKS-Kriterium „≥ 100 mV Depolarisation innerhalb von 24 h bis 72 h“ gegen DIN EN ISO 12696:2022-09 prüfen (T13-IH-10).

## Empfehlung

**freigabereif nach Klärung von T13-IH-10.** Drei Fehler behoben, Faktenstichprobe ohne Befund; offen ist das KKS-Schutzkriterium am Normtext DIN EN ISO 12696.

Nach der Regel der Freigabe vom 02.11.2026 (Tranche 16: im Modul gekennzeichnete Normtextpunkte gelten als erledigt) wäre das Modul schon jetzt freigabereif; nach der Regel vom 28.10.2026 (Normtextpunkte blockieren) erst nach dem Normtextabgleich. Siehe `README.md`, Abschnitt „Zu entscheiden“.
