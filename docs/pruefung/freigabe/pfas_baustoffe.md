# Freigabepaket: PFAS in Baustoffen (`pfas_baustoffe`)

Stand 04.11.2026 · Gruppe „Rückbau & Schadstoffe“ · Typ `calculator` · Prüfvermerk „geprüft“ vom 29.10.2026; Inhalt seitdem wesentlich geändert (siehe Abschnitt „Änderungen seit dem Prüfdatum“).

**Empfehlung: freigabereif** – Die Änderung seit dem Prüfdatum ist eine belegte Berichtigung der Rechtslage (RQ-1, Gesetzestext); kein Normpunkt offen. Bestätigen genügt, der Prüfvermerk kann bleiben.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

PFAS in Baustoffen für Bauen im Bestand (Termin 10), A.RYC (Termin 6) und TTZ-Weiterbildung: Vorkommen in Beschichtungen, Dichtstoffen, Membranen und Löschschäumen, EU-Regulierung (REACH, POP, Feuerlöschschaum-VO), Trinkwassergrenzwerte PFAS-20/PFAS-4, Rückbau, Entsorgung, Analytik und Summenrechner.

Bedeutung für die Lehre: Lehrveranstaltung (Vertiefung, Wahlpflicht, Master, Weiterbildung); Lernpfade: A.RYC, Bauen im Bestand.

## Reiter und Bereiche

Reiter laut Komponente: Was sind PFAS? (`einfuehrung`) · PFAS in Baustoffen (`vorkommen`) · Regulierung (`regulierung`) · Rückbau & Entsorgung (`rueckbau`) · Analytik (`analytik`) · Rechner PFAS-Summen (`rechner`).

Komponente `src/modules/PfasBaustoffe.tsx`; Inhalt `content/pfasbaustoffe/PfasBaustoffe.json`.

## Rechenkerne und Testabdeckung

| Kern | Tests (Zahl der Prüfungen) | Referenzwerte |
|---|---|---|
| `src/calc/pfas.ts` | `tests/pfas.test.ts` (28), `tests/klassengrenzen.test.ts` (32), `tests/modulpruefungTranche12.test.ts` (51), `tests/nachstichprobe5c.test.ts` (44) | Beispielprobe: Σ PFAS-20 = 77 ng/l (< BG = 0, rechtlich maßgebend), Spanne bis 88 ng/l; Σ PFAS-4 = 28 ng/l > 20 ng/l; Anteil kurzkettig 60 % |

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T12 Nr. 16 | Modulprüfung: Summen, 20 Stoffe, Grenzwerte 100 ng/l ab 12.01.2026 und 20 ng/l ab 12.01.2028 | freigegeben 29.10. | T12 (`module-tranche-12.md`) |
| DSB | Durchsicht B: Mischung 28/6 ng/l → ≥ 36 % Brunnen 2; Normausgaben | ohne Befund | `durchsicht-B-2026-10-29.md` |
| NS5C-PF-1 | Kurzkettig zählte auch PFHxS/PFHpS (Sulfonsäuren C6/C7) → Carbonsäuren C4–C7, Sulfonsäuren C4–C5 | erledigt (behoben) (#307) | `nachstichprobe5c-2026-11-02.md` |
| Klassengrenzen | Kettenlänge zentral in `src/data/klassengrenzen.ts` (`pfasIstKurzkettig`) | erledigt (umgesetzt) (#320) | `gutachten-umsetzung-2026-11-03.md`, Nr. 2 |
| RQ-1 | Werte unter der Bestimmungsgrenze bleiben nach TrinkwV Anlage 2 bei der Summe unberücksichtigt; vorher war „Spanne, nicht eindeutig“ die richtige Quizantwort und die rechtlich richtige als falsch markiert → Voreinstellung < BG = 0, BG/2 und BG als Vorsorgevarianten; Quiz `qn_pfas_baustoffe_6` zurückgesetzt | erledigt (behoben) (#322) | `rechtsquellen-2026-11-03.md`, RQ-1 |

## Offene Normpunkte

Keine.

## Quizfragen

8 Fragen, davon 2 nicht freigegeben: `qn_pfas_baustoffe_6`, `qlz_pfas_baustoffe_1`.

## Änderungen seit dem Prüfdatum

Seit der Freigabe vom 29.10.2026: **#322** (Rechtsquellen 03.11., über #321) ändert die rechtliche Aussage des Summenrechners – Werte unter der Bestimmungsgrenze bleiben nach TrinkwV Anlage 2 Teil I unberücksichtigt (Voreinstellung 0 statt Lehrvariante), Texte in `content/pfasbaustoffe/PfasBaustoffe.json`, Kopf von `src/calc/pfas.ts`, Grenzen, Erkundung, Quiz `qn_pfas_baustoffe_6` (Freigabe zurückgesetzt). **#320** lagert die Kettenlängengrenze nach `src/data/klassengrenzen.ts` aus (Verhalten unverändert). **#307** (Nachstichprobe 5c) hat davor die Einstufung kurzkettiger Sulfonsäuren berichtigt. Die Rechtsquellenrunde hält fest: kein Anlass zur Rücknahme des Prüfvermerks, RQ-1 soll bei der Freigabe mitgesehen werden.

## Quellen

TrinkwV 2023, Anlage 2 Teil I (gesetze-im-internet.de; „Werte unterhalb der Bestimmungsgrenze bleiben unberücksichtigt“), Richtlinie (EU) 2020/2184, VO (EU) 2025/1988 (Feuerlöschschäume), REACH (EU) 2021/1297, 2024/2462, OECD/UBA PFAS-Portal (Kettenlänge), DIN 38407-42, DIN EN ISO 18127:2026-07. Befundliste Tranche 12, Nr. 16; Nachstichprobe 5c; Rechtsquellen 03.11.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Summenrechner, Voreinstellung „< BG = 0“: Hinweis „Rechtlich maßgebend ist die untere Schranke … TrinkwV Anlage 2 Teil I“ (`content/pfasbaustoffe/PfasBaustoffe.json:104`).
2. Quizfall RQ-1: 10 von 20 PFAS < BG (2 ng/l), übrige 92 ng/l → Σ PFAS-20 = 92 ng/l < 100 ng/l → eingehalten (Option 1 richtig, `qn_pfas_baustoffe_6`).
3. Kurzkettig: Carbonsäuren C4–C7, Sulfonsäuren C4–C5 (PFHxS ist langkettig); Rechnerbeispiel Anteil 60 %.
4. Beispiel 1 Mischung: 28 und 6 ng/l, Ziel 20 ng/l → x = 8/22 = 0,36 → mindestens 36 % aus dem geringer belasteten Brunnen.
5. Grenzwerte: PFAS-20 0,1 µg/l ab 12.01.2026, PFAS-4 0,02 µg/l ab 12.01.2028; „PFAS gesamt“ 0,5 µg/l nicht übernommen.

## Empfehlung

**freigabereif.** Seit dem 29.10. haben zwei Prüfrunden das Modul berichtigt (NS5C-PF-1, RQ-1). Beide Änderungen sind am Gesetzestext bzw. an OECD/UBA belegt und mit Tests abgesichert. Zu bestätigen ist vor allem die neue Voreinstellung „< BG = 0“ und die geänderte Quizantwort; die Quizfrage `qn_pfas_baustoffe_6` braucht danach eine eigene Freigabe.
