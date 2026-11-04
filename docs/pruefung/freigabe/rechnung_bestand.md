# Freigabepaket: Bauen im Bestand: Sanierung (`rechnung_bestand`)

Stand 04.11.2026 · Gruppe „Beispielrechnungen“ · Typ `calculator` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif nach Klärung von T15-BS-5 (Mindeststandardabweichung)** – Alle sechs Befunde der Tranche 15 sind umgesetzt; offen ist die Mindeststandardabweichung nach DIN EN 13791, die hier anders behandelt wird als im Reiter Bohrkernserie von `historisch`.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Durchgerechnetes Beispiel Bauen im Bestand: Bemessungswert historischer Betonklassen (B 120 … B 300 nach Schnell/Fischer/Loch, Tab. 2.1) ohne und mit Bauwerksprüfung (Bohrkernserie nach DIN EN 13791:2020-02 über k_n und M) sowie Fließkraft historischer Betonstähle (BSt 220, BSt 420, BSt 500).

Bedeutung für die Lehre: Ergänzung und Nachschlagen; in keinem Lernpfad zugeordnet.

## Reiter und Bereiche

Ein Reiter der Komponente Beispielrechnungen mit Unterreitern Beton (ohne/mit Prüfung) und Betonstahl.

Komponente `src/modules/Beispielrechnungen.tsx`; Inhalt `content/beispielrechnungen/Beispielrechnungen.json`, `content/beispielrechnungen/RechnungBestand.json`, `content/beispielrechnungen/RechnungBeton.json`, `content/beispielrechnungen/RechnungBrandschutz.json`, `content/beispielrechnungen/RechnungHolzbau.json`, `content/beispielrechnungen/RechnungMauerwerk.json`, `content/beispielrechnungen/RechnungNachhaltigkeit.json`, `content/beispielrechnungen/RechnungSchallschutz.json`, `content/beispielrechnungen/RechnungStahlbeton.json`, `content/beispielrechnungen/RechnungUWert.json`, `content/beispielrechnungen/daten.json`.

## Rechenkerne und Testabdeckung

| Kern | Tests (Zahl der Prüfungen) | Referenzwerte |
|---|---|---|
| `src/calc/bauwerksuntersuchung.ts` | `tests/bauwerksuntersuchung.test.ts` (38), `tests/durchsichtA.test.ts` (49), `tests/hist13791.test.ts` (51), `tests/karsten.test.ts` (10), `tests/keinErgebnisAnzeige.test.ts` (1), `tests/lebensdauerUebergabe.test.ts` (35) und 6 weitere | `insituDruckfestigkeit13791`: n = 8, f_m = 31,0, s = 2,5, f_lowest = 28,0 → f_ck,is = min(31,0 − 2,00·2,5; 28,0 + 4) = 26,0 N/mm² (Kern aus Tranche 12) |

Die Tabelle `ALTBETON_ZUORDNUNG` in `src/data/kennwerte.ts` teilt sich das Modul mit `historisch` (Test `tests/modulpruefungTranche12.test.ts`, `tests/modulpruefungTranche15.test.ts`); die Quizfragen `qn_rechnung_bestand_*` rechnet `tests/quizRechenfragen.test.ts` nach.

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T15-BS-1 | B 100 … B 600 als „DIN 1045:1972“ bezeichnet; 1972 führte die Bn-Klassen ein | erledigt (behoben) | T15 (`module-tranche-15.md`) (Nr. 5) |
| T15-BS-2 | Stahlbezeichnungen nach DIN 488 (G/R/U/K), Schweißeignung | erledigt (behoben) | T15 (`module-tranche-15.md`) |
| T15-BS-3a | „DAfStb-Richtlinie Bauen im Bestand“ mit Abschlag 3,0 N/mm² nicht belegbar → Lehransatz | erledigt (behoben) | T15 (`module-tranche-15.md`) |
| T15-BS-3 | Zuordnung alter Klassen → gemeinsame Tabelle `ALTBETON_ZUORDNUNG` nach Schnell/Fischer/Loch 2008 | erledigt (umgesetzt) (29.10.) | T15 (`module-tranche-15.md`), Umsetzung 29.10. |
| T15-BS-4 | Klassenliste → B 120, B 160, B 225, B 300; B 450/B 600 als Spannbeton (DIN 4227) ohne f_cd | erledigt (umgesetzt) (29.10.) | T15 (`module-tranche-15.md`) |
| T15-BS-5 | Prüfwert über Mittelwert ohne Streuung → Bohrkernserie mit k_n und M nach DIN EN 13791:2020-02 | erledigt (umgesetzt) (29.10.) | T15 (`module-tranche-15.md`); Normtext Mindeststandardabweichung offen |
| T15-BS-6 | Verbund-Lehransätze 30 %/70 % ohne Quelle → gestrichen | erledigt (umgesetzt) (29.10.) | T15 (`module-tranche-15.md`) |
| NS-BD-3 | Kerne h/d = 1 als 150-mm-Würfel (Fassung 2008); Ausgabe 2020 rechnet auf 2:1 um | offen (Normtext) | `nachstichprobe-2026-10-29.md` |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Für die Freigabe gelten sie als erledigt (Regel vom 02.11.2026, Entscheidung vom 04.11.2026); sie bleiben im Prüfbogen Normtext, Reiter „Nach Normen (04.11.)“, offen. Kennungen nach dem Prüfbogen bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens (28.10.2026).

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| T15-BS-5 / NS-BD-2 | DIN EN 13791:2020-02, 8.1 (mit A20:2022-04) | Mindeststandardabweichung s ≥ 0,08·f_m(n),is – hier nicht angesetzt (in `historisch` schaltbar) | `rechnung_bestand`: nicht angesetzt |
| NS-BD-3 | DIN EN 13791:2020-02, Abschn. 5/6 | Bezug der Kerne h/d = 1 (Würfel oder Umrechnung 0,82 auf h/d = 2) | h/d = 1 als Würfel |

## Quizfragen

6 Fragen, davon 4 nicht freigegeben: `qn_rechnung_bestand_1`, `qn_rechnung_bestand_4`, `qn_rechnung_bestand_5`, `qn_rechnung_bestand_6`.

## Quellen

Schnell/Fischer/Loch, Kurzbericht BBR 2008, Tab. 2.1; DIN EN 13791:2020-02 mit A20:2022-04; DIN 488 (historische Fassungen); Ernst & Sohn, Historische technische Regelwerke (Leseprobe). Befundliste Tranche 15, Nr. 5.

## Prüfschritte für die Freigabe (ca. 15 min)

1. B 225 ohne Prüfung (Lehransatz): 0,8·22,5/0,95 − 3 = 15,95 N/mm², f_cd = 0,85·15,95/1,5 = 9,04 N/mm²; B 300: 22,26 / 12,62 N/mm².
2. Mit Bohrkernserie: n = 8, f_m = 31,0, s = 2,5, f_lowest = 28,0 → f_ck,is = min(26,0; 32,0) = 26,0 N/mm² ≥ 0,85·30 = 25,5 → C30/37 (Würfelbezug).
3. Betonstahl Ø 12: F_yd = A_s·f_yk/1,15 → BSt 220: 21,64 kN, BSt 420: 41,31 kN, BSt 500: 49,17 kN.
4. Hinweis 225 kp/cm² = 22,07 N/mm²; das Modul setzt 22,5 N/mm² (üblich gerundet, 2 % günstiger).
5. Entscheiden bzw. am Normtext prüfen: Mindeststandardabweichung s ≥ 0,08·f_m (in `historisch` standardmäßig an, hier nicht angesetzt) – beide Rechner einheitlich behandeln.

## Empfehlung

**freigabereif nach Klärung von T15-BS-5 (Mindeststandardabweichung).** Rechnung, Tabelle und Kern sind geprüft und mit `historisch` gemeinsam geführt. Offen ist T15-BS-5: In `historisch` ist s ≥ 0,08·f_m schaltbar und standardmäßig an, hier und in `bauwerksdiagnose` nicht. Unabhängig vom Normtext sollten die drei Rechner dieselbe Regel verwenden; Vorschlag: nach dem Normtextabgleich einheitlich festlegen.

Der Normtextpunkt gilt nach der Regel vom 02.11.2026 als erledigt; zu entscheiden bleibt die einheitliche Behandlung der Mindeststandardabweichung in `rechnung_bestand`, `bauwerksdiagnose` und `historisch`.
