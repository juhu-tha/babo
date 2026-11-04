# Freigabepaket: Stahlbetoninstandhaltung (`instandhaltung`)

Stand 04.11.2026 · Gruppe „Schutz & Instandsetzung“ · Typ `standard` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif nach Klärung von T13-IH-10 bis -12** – Neun Befunde behoben bzw. gekennzeichnet, Chloridrechner erweitert, alle Rechenfälle identisch; offen sind drei Punkte an DIN EN ISO 12696 und der TR Instandhaltung.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Stahlbetoninstandhaltung nach TR Instandhaltung und DIN EN 1504 (Zertifikat „Ausbau und Bestand“, Vorlesung Stahlbetoninstandhaltung): Regelwerke, Prinzipien, Oberflächenschutzsysteme OS 1 bis OS 11, Instandsetzungsprodukte, Rissinjektion, Chloridrechner (Fick), kathodischer Korrosionsschutz, Qualifikation (SIVV).

Bedeutung für die Lehre: Lehrveranstaltung (Vertiefung, Wahlpflicht, Master, Weiterbildung); in keinem Lernpfad zugeordnet.

## Reiter und Bereiche

Komponente `src/modules/Stahlbetoninstandhaltung.tsx`; Inhalt `content/stahlbetoninstandhaltung/ChloridrechnerTab.json`, `content/stahlbetoninstandhaltung/En1504Tab.json`, `content/stahlbetoninstandhaltung/FortbildungTab.json`, `content/stahlbetoninstandhaltung/OsTab.json`, `content/stahlbetoninstandhaltung/ProdukteTab.json`, `content/stahlbetoninstandhaltung/RegelwerkeTab.json`, `content/stahlbetoninstandhaltung/RissinjektionTab.json`, `content/stahlbetoninstandhaltung/Stahlbetoninstandhaltung.json`, `content/stahlbetoninstandhaltung/TrTab.json`, `content/stahlbetoninstandhaltung/daten.json`.

## Rechenkerne und Testabdeckung

| Kern | Tests (Zahl der Prüfungen) | Referenzwerte |
|---|---|---|
| `src/calc/schutzInstandsetzung.ts` | `tests/keinErgebnisAnzeige.test.ts` (1), `tests/modulpruefungTranche13.test.ts` (19), `tests/nachstichprobe4.test.ts` (60) | Chlorid C_s = 2,5 M.-%/z, D = 2·10⁻¹² m²/s, 25 a, c = 35 mm: C = 1,333 M.-%/z → kritisch; Rissinjektion h = 300 mm → Packer 150 mm, p = 24 bar; KKS 600 m²·0,7·10 mA/m² = 4,2 A |

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T13-IH-1 bis -8 | Wurzel-t-Gesetz, OS 10, R1–R4 als Festigkeitsklassen, TR Teil 2, Gliederung DIN EN 1504, KKS-Vorteil ohne Quelle, Injektionsklasse D, Schreibweisen | erledigt (behoben) | T13 (`module-tranche-13.md`) (Nr. 8) |
| T13-IH-9 | Verpressdruck 0,08 bar/mm als „ZTV-ING-Faustregel“ → Lehrwert | gekennzeichnet | T13 (`module-tranche-13.md`) |
| T13-IH-10 | KKS-Schutzkriterium am Normtext DIN EN ISO 12696 | offen (Normtext) | T13 (`module-tranche-13.md`) |
| T13-IH-11 | Geltung der Rili-SIB über die TR Instandhaltung (Ausführung, Betriebe, SIVV) | offen (Normtext) | T13 (`module-tranche-13.md`) |
| T13-IH-12 | Rissbreitengrenze Zementsuspension 0,2 mm (hier) bzw. 0,8 mm (`schadensbilder`) | offen (Normtext) | T13 (`module-tranche-13.md`) |
| T13-IH-13 | Chloridraster endete bei 65 mm → Raster bis 100 mm, darüber Anzeige „≥“ | erledigt (umgesetzt) (29.10.) | T13 (`module-tranche-13.md`), Umsetzung 29.10. |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Kennungen nach dem Prüfbogen Normtext (Stand 28.10.2026) bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens.

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| T13-IH-10 | DIN EN ISO 12696:2022-09 (KKS) | Schutzkriterium: „Depolarisation ≥ 100 mV innerhalb von 24 h bis 72 h“ oder „≥ 100 mV in höchstens 24 h bzw. ≥ 150 mV über längere Zeit“? | Kurzfassung, Reiter KKS (`content/stahlbetoninstandhaltung/Stahlbetoninstandhaltung.json:133`) und `schutz_grundlagen` (`content/schutzgrundlagen/SchutzGrundlagen.json:297`) |
| T13-IH-11 | TR Instandhaltung (DIBt, Teile 1 und 2) mit Verweis auf die DAfStb-Instandsetzungsrichtlinie | Gilt die Rili-SIB (Teil 3) für Ausführung, Betriebe und Überwachung weiter (dann auch SIVV)? | Reiter Regelwerke („nicht mehr bauaufsichtlich“), Reiter Qualifikation |
| T13-IH-12 | TR Instandhaltung, Teil 1 (Füllstoffe) | Rissbreitengrenze für Zementsuspension: ab 0,2 mm (`instandhaltung`) oder über 0,8 mm (`schadensbilder`)? | Rissinjektion in `instandhaltung`; `content/typischebauschaeden/TypischeBauschaeden.json:71` |

## Quizfragen

6 Fragen, davon 1 nicht freigegeben: `qn_instandhaltung_1`.

## Quellen

TR Instandhaltung (DIBt, Teile 1 und 2; BauNetz Wissen, Forum Verlag), DAfStb-Instandsetzungsrichtlinie (Rili-SIB 2001), DIN EN 1504-1 bis -10, DIN EN ISO 12696:2022-09. Befundliste Tranche 13, Nr. 8.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Chloridrechner CL1: C_s = 2,5 M.-%/z, D = 2·10⁻¹² m²/s, t = 25 a, c = 35 mm → C(c) = 1,333 M.-%/z → kritisch; Front ≥ 65 mm, Abtrag 80 mm.
2. Weitere Fälle: c = 50 mm → 0,934; 1,5/1/50 a/40 mm → 0,715; 4/3/40 a/60 mm → 1,962 M.-%/z; Front über 100 mm → Anzeige „≥“ (T13-IH-13).
3. Rissinjektion: h = 150/300/400/800 mm → Packerabstand 75/150/200/400 mm, Verpressdruck 12/24/32/35 bar (Lehrwert 0,08 bar/mm, T13-IH-9).
4. KKS Beispiel 1: 600 m²·0,7·10 mA/m² = 4,2 A; Füllgut Beispiel 2: 4,0 m·0,30 mm·0,25 m·1,5 = 0,45 l.
5. KKS-Schutzkriterium „≥ 100 mV in 24 h bis 72 h“ an DIN EN ISO 12696 prüfen (T13-IH-10).
6. Regelwerke: Geltung der Rili-SIB für Ausführung/Betriebe/Überwachung (T13-IH-11) und Zementsuspension ab 0,2 mm (T13-IH-12) an der TR Instandhaltung prüfen.

## Empfehlung

**freigabereif nach Klärung von T13-IH-10 bis -12.** Neun Befunde behoben bzw. gekennzeichnet, Chloridrechner erweitert, alle Rechenfälle identisch; offen sind drei Punkte an DIN EN ISO 12696 und der TR Instandhaltung.

Nach der Regel der Freigabe vom 02.11.2026 (Tranche 16: im Modul gekennzeichnete Normtextpunkte gelten als erledigt) wäre das Modul schon jetzt freigabereif; nach der Regel vom 28.10.2026 (Normtextpunkte blockieren) erst nach dem Normtextabgleich. Siehe `README.md`, Abschnitt „Zu entscheiden“.
