# Freigabepaket: Betonwaren & Pflaster (`bp_betonwaren`)

Stand 04.11.2026 · Gruppe „Bauprodukte“ · Typ `standard` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif nach Klärung von T7-BW-2a/b** – Spaltzugbeispiel richtig, T7-BW-1 behoben; offen sind Prüfdruck der Rohrprüfung (Verdacht 1 bar statt 0,5 bar) und der Einzelwert der Abwitterung.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Bauprodukte aus Beton: Pflastersteine, Platten und Bordsteine (DIN EN 1338/1339/1340), Vorsatz- und Kernbeton, Sofortentschalung, Betonrohre und Muffen (DIN EN 1916), Schadensbilder; Rechenbeispiel Spaltzugfestigkeit.

Bedeutung für die Lehre: Ergänzung und Nachschlagen; in keinem Lernpfad zugeordnet.

## Reiter und Bereiche

Ein Modul mit Produktabschnitten, Schadensbildern und Beispiel Spaltzug nach DIN EN 1338, Anhang F.

Komponente `src/modules/BpBetonwaren.tsx`; Inhalt `content/bpbetonwaren/BpBetonwaren.json`.

## Rechenkerne und Testabdeckung

Kein Rechenkern; das Spaltzugbeispiel ist in Tranche 7 mit eigener Umsetzung von T = 0,637·k·P/S nachgerechnet.

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T7-BW-1 | „XF4 (≤ 1,0 kg/m²)“ bei Pflaster → Klasse 3 (Kennz. D) nach DIN EN 1338/1339; „ATV-DVWK-A 127“ → DWA-A 127-1 | erledigt (behoben) | T7 (`module-tranche-7.md`) (Nr. 10) |
| T7-BW-2 | Prüfdruck Betonrohre 0,5 bar (eher Leitungsprüfung DIN EN 1610) und Einzelwert der Abwitterung ≤ 1,5 kg/m² ergänzt | erledigt (umgesetzt, als vorläufig gekennzeichnet) | T7 (`module-tranche-7.md`), Umsetzung 29.10.; Normtext T7-BW-2a/b |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Kennungen nach dem Prüfbogen Normtext (Stand 28.10.2026) bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens.

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| T7-BW-2a | DIN EN 1916 (Ausgabe in der App nicht angegeben), Prüfung der Wasserdichtheit von Rohren (Abschnitt prüfen) | Prüfdruck der Produktprüfung (0,5 bar oder 1 bar) | „Prüfdruck ≥ 0,5 bar (Kanal)“ – `content/bpbetonwaren/BpBetonwaren.json:25` |
| T7-BW-2b | DIN EN 1338, Frost-Tausalz-Widerstand Klasse 3 (Kennz. D) | Einzelwert der Abwitterung ≤ 1,5 kg/m² (seit 29.10. ergänzt) | `content/bpbetonwaren/BpBetonwaren.json:22` |

## Quizfragen

6 Fragen, alle freigegeben.

## Quellen

DIN EN 1338, DIN EN 1339, DIN EN 1340, DIN EN 1916, DIN EN 1610, DWA-A 127-1 (Normtexte nicht öffentlich). Befundliste Tranche 7, Nr. 10.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Spaltzug (Beispiel): P = 72 kN, l = 200 mm, t = 80 mm → k = 1,3 − 30·(0,18 − 0,08)² = 1,000; T = 0,637·1,0·72 000/(200·80) = 2,87 N/mm² < 2,9 (Einzelwert); F/l = 360 ≥ 250 N/mm.
2. Dickenfaktor: t = 100 mm → k = 1,108, T = 3,35 N/mm²; t = 60 mm → k = 0,868.
3. Frost-Tausalz Klasse 3 (D): Mittel ≤ 1,0 kg/m², Einzelwert ≤ 1,5 kg/m² (`content/bpbetonwaren/BpBetonwaren.json:22`; T7-BW-2b).
4. Prüfdruck Wasserdichtheit Betonrohre „≥ 0,5 bar“ (`content/bpbetonwaren/BpBetonwaren.json:25`) gegen DIN EN 1916 (nach Kenntnisstand 1 bar) prüfen (T7-BW-2a).
5. Quizfragen (6, alle freigegeben) stichprobenartig gegen den Text Rohre/Pflaster lesen; Literaturangabe „DWA-A 127-1, früher ATV-DVWK-A 127“ (T7-BW-1).

## Empfehlung

**freigabereif nach Klärung von T7-BW-2a/b.** Spaltzugbeispiel richtig, T7-BW-1 behoben; offen sind Prüfdruck der Rohrprüfung (Verdacht 1 bar statt 0,5 bar) und der Einzelwert der Abwitterung.

Nach der Regel der Freigabe vom 02.11.2026 wäre T7-BW-2 als gekennzeichnet erledigt. Wegen des begründeten Verdachts (1 bar statt 0,5 bar) wird der Normtextabgleich vor der Freigabe empfohlen.
