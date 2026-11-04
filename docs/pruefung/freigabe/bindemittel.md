# Freigabepaket: Bindemittel & Hydratation (`bindemittel`)

Stand 04.11.2026 · Gruppe „Betontechnologie“ · Typ `standard` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif nach Klärung von T9-BM-1a/b** – Bogue- und NA-Rechnung richtig, Faktenstichprobe ohne Befund; offen sind die verkürzten Anwendungsbereiche zweier Zementkarten.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Bindemittel und Zementchemie für Baustoffkunde (Termin 6): Herstellung des Portlandzementklinkers, Klinkerphasen (C₃S, C₂S, C₃A, C₄AF) mit Bogue-Rechnung, Hydratationsphasen und -wärme, Normzemente nach DIN EN 197-1 mit Zementkarten, Sondereigenschaften SR/LH/NA.

Bedeutung für die Lehre: Pflichtlehre / zentrales Lehrmodul; Lernpfade: Baustoffkunde.

## Reiter und Bereiche

Bindemittel (Herstellung, Klinkerphasen, Normzemente als Karten, SR/LH/NA, Zusatzstoffe, Beispiel NA-Zement) und Reiter Zementchemie mit Bogue-Rechner.

Komponente `src/modules/Bindemittel.tsx`; Inhalt `content/bindemittel/Bindemittel.json`, `content/zementchemie/Zementchemie.json`.

## Rechenkerne und Testabdeckung

Kein Rechenkern in `src/calc/`; die Bogue-Rechnung steht inline in {{src/modules/Zementchemie.tsx|// Bogue-Rechnung}} und ist in Tranche 9 (BM1, BM2) gegen ASTM C150 nachgerechnet.

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| Faktenstichprobe T9 | NA-Grenzen DIN 1164-10, LH ≤ 270 J/g, VLH ≤ 220 J/g, SR ab Sulfat > 600 mg/l, CEM II/C-M, CEM VI, Kalzinierung | ohne Befund | T9 (`module-tranche-9.md`) (Nr. 4) |
| T9-BM-1 | Zementkarten nennen verkürzte Anwendungsbereiche (CEM II/A-LL, CEM II/A-V) → Kennzeichnung „vorläufig“ | erledigt (umgesetzt, als vorläufig gekennzeichnet) | T9 (`module-tranche-9.md`), Umsetzung 29.10.; Normtext T9-BM-1a/b |
| Hinweis | Schematische Wärmekurve endet bei 900/200 J/g, Text nennt 1 350/250 J/g – als schematische Lehrkurve gekennzeichnet | kein Handlungsbedarf | T9 (`module-tranche-9.md`) |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Kennungen nach dem Prüfbogen Normtext (Stand 28.10.2026) bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens.

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| T9-BM-1a | DIN 1045-2:2023-08, Anwendungstabellen der Zemente | Anwendungsbereich CEM II/A-LL | „Zulässig für Innen- und Außenbauteile (XC1–XC4, XF1, XA1). Bei XF4 nur mit Nachweis.“ – `content/bindemittel/Bindemittel.json:137` |
| T9-BM-1b | DIN 1045-2:2023-08, Anwendungstabellen der Zemente | Anwendungsbereich CEM II/A-V | „Zulässig für XC1–XC4, XD1–XD3, XA1–XA2.“ – `content/bindemittel/Bindemittel.json:149` |

## Quizfragen

7 Fragen, alle freigegeben.

## Quellen

DIN EN 197-1, DIN 1164-10, DIN 1045-2:2023-08 (Anwendungstabellen; Normtext nicht öffentlich), ASTM C150 (Bogue). Befundliste Tranche 9, Nr. 4.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Bogue (A/F ≥ 0,64): CaO 65, SiO₂ 21, Al₂O₃ 5,5, Fe₂O₃ 3, SO₃ 2,5 M.-% → C₃S 56,6; C₂S 17,5; C₃A 9,5; C₄AF 9,1 M.-%.
2. Bogue (A/F = 0,6 < 0,64): C₃S 59,9; C₂S 17,9; Mischkristall (C₄AF + C₂F) 14,8 M.-%.
3. Na₂O-Äquivalent 0,25 + 0,658·0,80 = 0,776 M.-% → kein NA-Zement als CEM I, NA bei CEM III/A mit ≥ 50 % Hüttensand.
4. Zementkarte CEM II/A-LL „Zulässig für XC1–XC4, XF1, XA1; bei XF4 nur mit Nachweis“ (`content/bindemittel/Bindemittel.json:137`) gegen die Anwendungstabelle der DIN 1045-2 prüfen (T9-BM-1a).
5. Zementkarte CEM II/A-V „Zulässig für XC1–XC4, XD1–XD3, XA1–XA2“ (`content/bindemittel/Bindemittel.json:149`) prüfen (T9-BM-1b).

## Empfehlung

**freigabereif nach Klärung von T9-BM-1a/b.** Bogue- und NA-Rechnung richtig, Faktenstichprobe ohne Befund; offen sind die verkürzten Anwendungsbereiche zweier Zementkarten.

Nach der Regel der Freigabe vom 02.11.2026 (Tranche 16: im Modul gekennzeichnete Normtextpunkte gelten als erledigt) wäre das Modul schon jetzt freigabereif; nach der Regel vom 28.10.2026 (Normtextpunkte blockieren) erst nach dem Normtextabgleich. Siehe `README.md`, Abschnitt „Zu entscheiden“.
