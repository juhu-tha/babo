# Freigabepaket: Ausgangsstoffe des Betons (`grundlagen`)

Stand 04.11.2026 · Gruppe „Betontechnologie“ · Typ `standard` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif** – Beispiele und Faktenstichprobe ohne Befund; offen sind nur die RC-Höchstanteile und der BK-N/BK-E-Bezug am Normtext DIN 1045-2, Anhang E. Die Normpunkte sind in der App gekennzeichnet und gelten nach der Regel vom 02.11.2026 als erledigt.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Ausgangsstoffe des Betons für Baustoffkunde (Termin 4) und A.RYC (Termin 7): Zementarten nach DIN EN 197, Zugabewasser nach DIN EN 1008, Gesteinskörnung und Sieblinien, rezyklierte Gesteinskörnung, Alkali-Kieselsäure-Reaktion, Zusatzstoffe mit k-Wert-Ansatz, Zusatzmittel und Mehlkorngehalt.

Bedeutung für die Lehre: Pflichtlehre / zentrales Lehrmodul; Lernpfade: A.RYC, Baustoffkunde.

## Reiter und Bereiche

Ein Modul mit Fachtext in Abschnitten und zwei Rechenbeispielen (Mehlkorn, (w/z)_eq).

Komponente `src/modules/Grundlagen.tsx`; Inhalt `content/grundlagen/Grundlagen.json`.

## Rechenkerne und Testabdeckung

Kein Rechenkern in `src/calc/`; die zwei Rechenbeispiele sind in Tranche 9 (GL1, GL2) von Hand nachgerechnet.

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| Faktenstichprobe T9 | DIN EN 1008 (Trinkwasser, Restwasser, Meerwasser), Hauptbestandteile CEM I bis CEM VI | ohne Befund | T9 (`module-tranche-9.md`) (Nr. 3) |
| T9-GL-1 | RC-Höchstanteile ohne Bezug zur Betonklasse → Bezug BK-N (≤ 25 Vol.-%, WO/WF) und BK-E (Tab. E.2.5) ergänzt, Werte vorläufig | erledigt (umgesetzt, als vorläufig gekennzeichnet) | T9 (`module-tranche-9.md`), Umsetzung 29.10.; Normtext T9-GL-1a/b |
| F-Stelle T9/3 | Entfall der Mehlkorn-Höchstwerte und des Mindest-Leimvolumens in DIN 1045-2:2023-08 | vorläufig gekennzeichnet | T9 (`module-tranche-9.md`) |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Für die Freigabe gelten sie als erledigt (Regel vom 02.11.2026, Entscheidung vom 04.11.2026); sie bleiben im Prüfbogen Normtext, Reiter „Nach Normen (04.11.)“, offen. Kennungen nach dem Prüfbogen bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens (28.10.2026).

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| T9-GL-1a (Nr. 19) | DIN 1045-2:2023-08, Anhang E | Höchstanteile rezyklierter Gesteinskörnung Typ 1/Typ 2 je Expositionsklasse | `src/calc/rcGesteinskoernung.ts:13`: X0–XC4, XF1, XF3 45/35; XA1 25/25; XD1/XD2/XS1/XS2/XF2/XF4 30/20 Vol.-% der groben Gesteinskörnung; nicht in XA2, XA3, XM |
| T9-GL-1b (Nr. 19) | DIN 1045-2:2023-08, Anhang E, Tab. E.2.5 | Bezug zu BK-N (≤ 25 Vol.-%) und BK-E | seit 29.10. ergänzt (`content/grundlagen/Grundlagen.json:37`) |

## Quizfragen

6 Fragen, davon 1 nicht freigegeben: `qn_grundlagen_2`.

## Quellen

DIN EN 197-1/-5, DIN EN 1008, DIN EN 12620, DIN 1045-2:2023-08 (Anhang E; Normtext nicht öffentlich), DIN 1045-1000, IFEU-Vortrag „Das neue Regelwerk DIN 1045-2“ (Kreislaufwirtschaft Bau RLP). Befundliste Tranche 9, Nr. 3.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Mehlkorn (Beispiel): z = 320 kg/m³, D_max 16 mm, XF1 → m_max = 400 + 20/50·50 = 420 kg/m³; Ist 320 + 40 + 0,03·700 = 381 kg/m³ ≤ 420.
2. (w/z)_eq: z = 280, f = 80, w = 160 kg/m³ → f/z = 0,29 ≤ 0,33; (w/z)_eq = 160/(280 + 0,4·80) = 0,513 ≤ 0,60 (XC4); ohne Anrechnung 0,571.
3. RC-Höchstanteile Typ 1/Typ 2: X0–XC4, XF1, XF3 45/35 Vol.-%; XA1 25/25; XD1/XD2/XS1/XS2/XF2/XF4 30/20; nicht in XA2, XA3, XM – am Anhang E prüfen (T9-GL-1a).
4. Bezug zur Betonklasse: BK-N nur bis 25 Vol.-% (WO, WF), höhere Anteile BK-E nach Tab. E.2.5 (T9-GL-1b).
5. Zugabewasser: Trinkwasser ohne Prüfung, Restwasser nach Anhang A, Meerwasser nur für unbewehrten Beton.

## Empfehlung

**freigabereif.** Beispiele und Faktenstichprobe ohne Befund; offen sind nur die RC-Höchstanteile und der BK-N/BK-E-Bezug am Normtext DIN 1045-2, Anhang E. Die Normpunkte sind in der App gekennzeichnet und gelten nach der Regel vom 02.11.2026 als erledigt.

Bisher „freigabereif nach Klärung von T9-GL-1a/b“. Die offenen Normpunkte (von T9-GL-1a/b) sind in der App als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und gelten nach der Regel vom 02.11.2026 (Entscheidung vom 04.11.2026) für die Freigabe als erledigt. Sie bleiben im Prüfbogen Normtext offen; nach der Normprüfung wird der Wert angepasst.
