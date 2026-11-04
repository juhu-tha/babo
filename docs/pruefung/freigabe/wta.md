# Freigabepaket: WTA-Merkblätter (`wta`)

Stand 04.11.2026 · Gruppe „Schutz & Instandsetzung“ · Typ `norm` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif** – Drei Fehler behoben, Bohrrechner in sechs Fällen nachgerechnet, T13-WTA-6 umgesetzt; offen sind Salzstufen und Abtragshöhe am WTA-Merkblatt. Die Normpunkte sind in der App gekennzeichnet und gelten nach der Regel vom 02.11.2026 als erledigt.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

WTA-Merkblätter zur Mauerwerksinstandsetzung: nachträgliche Horizontalsperren mit Bohrrechner, Sanierputzsysteme, Innendämmung, Qualitätssicherung und Verpressprotokoll, Kombi-Planer (Lehrmodell), Abdichtung nach WTA 4-6 und DIN 18533.

Bedeutung für die Lehre: Ergänzung und Nachschlagen; in keinem Lernpfad zugeordnet.

## Reiter und Bereiche

Reiter laut Komponente: WTA 4-10 (Horizontalsperre) (`injektion`) · WTA 2-9 (Sanierputzsysteme 2020) (`sanierputz`) · WTA 6-5 (Innendämmung) (`innendaemmung`) · Qualitätsprüfung & QS (`pruefung`) · Kombi-Planer (Tab 5) (`kombination`) · WTA 4-6 & DIN 18533 (Nachtr. Abdichtung) (`abdichtung_4_6`).

Komponente `src/modules/WTA.tsx`; Inhalt `content/wta/WTA.json`.

## Rechenkerne und Testabdeckung

| Kern | Tests (Zahl der Prüfungen) | Referenzwerte |
|---|---|---|
| `src/calc/schutzInstandsetzung.ts` | `tests/keinErgebnisAnzeige.test.ts` (1), `tests/modulpruefungTranche13.test.ts` (19), `tests/nachstichprobe4.test.ts` (60) | Ziegel, d = 36 cm: Bohrtiefe 31 cm, Abstand 12 cm, n = 9, V_Bohr = 35,1 cm³, V = 0,363 l/m; Kombi-Planer Calciumsilicat/Sperre ok/Salz mittel/Regen 2: 100 Punkte |

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T13-WTA-1 | Kombi-Planer als „Hauptrating von WTA Referat 6/4“ → „eigenes Lehrmodell“ | erledigt (behoben) | T13 (`module-tranche-13.md`) (Nr. 9) |
| T13-WTA-2 | „Außendämmung behördlich strikt verboten“ → „denkmalrechtlich in der Regel nicht genehmigungsfähig“ | erledigt (behoben) | T13 (`module-tranche-13.md`) |
| T13-WTA-3 | „1.15er Sicherheitsbeiwert“, „over time“, unbelegte „bis zu 80 %“ | erledigt (behoben) | T13 (`module-tranche-13.md`) |
| T13-WTA-4 | Salzstufen gemeinsam für alle Salze | offen (Normtext) | T13 (`module-tranche-13.md`) |
| T13-WTA-5 | Putzabtrag 1 m hier, 80 cm in `instandsetzung_materialien` | offen (Normtext) | T13 (`module-tranche-13.md`) |
| T13-WTA-6 | Bohrrechner: DFG-Zuordnung → Prüfstufe des WTA-Zertifikats (60/80/95 % DFG), Verbrauch als Untergrenze | erledigt (umgesetzt, als vorläufig gekennzeichnet) | T13 (`module-tranche-13.md`), Umsetzung 29.10. |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Für die Freigabe gelten sie als erledigt (Regel vom 02.11.2026, Entscheidung vom 04.11.2026); sie bleiben im Prüfbogen Normtext, Reiter „Nach Normen (04.11.)“, offen. Kennungen nach dem Prüfbogen bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens (28.10.2026).

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| T13-WTA-4 | WTA-Merkblatt 2-9-20/D bzw. 4-5 (Salzanalyse) | Salzstufen gemeinsam für alle Salze (< 0,1 / 0,1–0,5 / > 0,5 M.-%) oder je Salzart (Chlorid, Nitrat, Sulfat)? | `content/wta/WTA.json:59` |
| T13-WTA-5 | WTA-Merkblatt 2-9-20/D (Sanierputzsysteme) | Putzabtrag über der Schadensgrenze: 80 cm oder 1 m? | `wta`: `content/wta/WTA.json:102`; `instandsetzung_materialien`: `content/instandsetzungmaterialien/InstandsetzungMaterialien.json:179` |

## Quizfragen

7 Fragen, davon 1 nicht freigegeben: `qlz_wta_1`.

## Quellen

WTA-Merkblätter 2-9-20/D, 4-6-24/D, 6-5-14/D, 3-17-10/D; DIN 18533-1:2026-06 (Bauprofessor); Technisches Merkblatt Injektionscreme 04/2026. Befundliste Tranche 13, Nr. 9.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Bohrrechner Ziegel, d = 36 cm: t = 31 cm, a = 12 cm, n = 9 je m, V_Bohr = 35,1 cm³, V = 0,363 l/m; Mischmauerwerk 51 cm → 0,598 l/m; Lochstein 24 cm → n = 13, 0,321 l/m.
2. Beispiele: Durchfeuchtungsgrad DFG = 9,0/18,0 = 50 %; Materialbedarf V_m = 8·1,0·1,1 = 8,8 l/m.
3. Kombi-Planer (Lehrmodell): Calciumsilicat/Sperre ok/Salz mittel/Regen 2 → 100 Punkte grün; PUR/keine Sperre/Salz hoch/Regen 3 → 0 Punkte rot.
4. Salzstufen „< 0,1 / 0,1–0,5 / > 0,5 M.-%“ (`content/wta/WTA.json:59`) gegen die Einstufung je Salzart im WTA-Merkblatt prüfen (T13-WTA-4).
5. Putzabtrag „mindestens 1 Meter oberhalb“ (`content/wta/WTA.json:102`) gegen WTA 2-9 (nach Kenntnisstand 80 cm) prüfen und mit `instandsetzung_materialien` angleichen (T13-WTA-5).

## Empfehlung

**freigabereif.** Drei Fehler behoben, Bohrrechner in sechs Fällen nachgerechnet, T13-WTA-6 umgesetzt; offen sind Salzstufen und Abtragshöhe am WTA-Merkblatt. Die Normpunkte sind in der App gekennzeichnet und gelten nach der Regel vom 02.11.2026 als erledigt.

Bisher „freigabereif nach Klärung von T13-WTA-4 und T13-WTA-5“. Die offenen Normpunkte (von T13-WTA-4 und T13-WTA-5) sind in der App als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und gelten nach der Regel vom 02.11.2026 (Entscheidung vom 04.11.2026) für die Freigabe als erledigt. Sie bleiben im Prüfbogen Normtext offen; nach der Normprüfung wird der Wert angepasst.
