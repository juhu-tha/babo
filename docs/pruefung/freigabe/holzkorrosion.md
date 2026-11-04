# Freigabepaket: Holzkorrosion & Schädlinge (`holzkorrosion`)

Stand 04.11.2026 · Gruppe „Dauerhaftigkeit“ · Typ `standard` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif nach Klärung von T12-HK-2a/b** – Beispiele richtig, T12-HK-1 behoben; offen sind die Mindesteindringtiefen NP4/NP5 nach DIN EN 351-1 (Verdacht auf zu kleine Werte).

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Holzkorrosion und Holzschädlinge für Bauen im Bestand (Termin 5): holzzerstörende Pilze (Echter Hausschwamm, Nass- und Moderfäule), Insekten (Hausbock, Anobien), Holzfeuchte als Schadensgrenze, baulicher und chemischer Holzschutz nach DIN 68800, Penetrationsklassen nach DIN EN 351-1.

Bedeutung für die Lehre: Lehrveranstaltung (Vertiefung, Wahlpflicht, Master, Weiterbildung); Lernpfade: Bauen im Bestand.

## Reiter und Bereiche

Reiter laut Komponente: Grundlagen & Simulation (`simulation`) · Holzschädlinge (`schaedlinge`) · Holzschutz (DIN 68800) (`schutz`).

Komponente `src/modules/Holzkorrosion.tsx`; Inhalt `content/holzkorrosion/Holzkorrosion.json`.

## Rechenkerne und Testabdeckung

Kein Rechenkern in `src/calc/`; Holzfeuchte und Wirkstoffbedarf in zwei Beispielen, in Tranche 12 nachgerechnet.

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T12-HK-1 | „Bis ca. 30 % Pilzwachstum unmöglich“ widersprach der Pilzgrenze u = 20 % → berichtigt | erledigt (behoben) | T12 (`module-tranche-12.md`) (Nr. 21) |
| T12-HK-2 | Penetrationsklassen NP4 „mind. 9 mm“, NP5 „mind. 20 mm“ – nach Kenntnisstand NP4 ≥ 25 mm seitlich, NP5 vollständige Splintdurchdringung | offen (Normtext) | T12 (`module-tranche-12.md`) |
| Faktenstichprobe | Heißluft ≥ 55 °C/60 min, Rückschnitt Hausschwamm ≥ 1 m, Spritzwasser 30 cm, Borate nur bis GK 2, Eiche DC 2–4 | ohne Befund | T12 (`module-tranche-12.md`) |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Kennungen nach dem Prüfbogen Normtext (Stand 28.10.2026) bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens.

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| T12-HK-2a | DIN EN 351-1:2023-07, Penetrationsklassen, NP4 | Mindesteindringung NP4 (25 mm seitlich?) | „NP4: Mindestens 9 mm tief im Splintholz.“ – `content/holzkorrosion/Holzkorrosion.json:181` |
| T12-HK-2b | DIN EN 351-1:2023-07, Penetrationsklassen, NP5 | Anforderung NP5 (vollständige Splintdurchdringung?) | „NP5: Umfassende Splintholzdurchdringung (mind. 20 mm).“ – `content/holzkorrosion/Holzkorrosion.json:183` |

## Quizfragen

7 Fragen, davon 2 nicht freigegeben: `q_ho_1`, `qlz_holzkorrosion_1`.

## Quellen

DIN 68800-1 bis -4, DIN EN 350:2016, DIN EN 351-1:2023-07 (Normtext nicht öffentlich). Befundliste Tranche 12, Nr. 21.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Beispiel 1: Holzfeuchte u = (512 − 418)/418 = 22,5 % → über der Pilzgrenze 20 %.
2. Beispiel 2: 8,4 kg Wirkstofflösung, 10,5 kg/m³.
3. Pilzgrenze: unter etwa 20 % Holzfeuchte praktisch ausgeschlossen, zwischen 20 % und Fasersättigung möglich (T12-HK-1).
4. Penetrationsklassen: „NP4: mindestens 9 mm tief im Splintholz“ (`content/holzkorrosion/Holzkorrosion.json:181`) und „NP5: mind. 20 mm“ gegen DIN EN 351-1:2023-07 prüfen (T12-HK-2a/b).
5. Bekämpfung Hausschwamm: Rückschnitt ≥ 1 m über den sichtbaren Befall, Heißluft ≥ 55 °C im Holzkern über 60 min.

## Empfehlung

**freigabereif nach Klärung von T12-HK-2a/b.** Die Nachrechnungen und die Faktenstichprobe sind ohne Befund. Bei T12-HK-2 besteht der begründete Verdacht, dass die Werte nicht stimmen (NP4 25 mm seitlich statt 9 mm, NP5 vollständige Splintdurchdringung). Das ist mehr als eine Bestätigung; der Normtextabgleich sollte vor der Freigabe stattfinden.

Nach der Regel der Freigabe vom 02.11.2026 wäre T12-HK-2 als gekennzeichnet erledigt. Hier wird trotzdem der Normtextabgleich vor der Freigabe empfohlen, weil der Verdacht besteht, dass NP4/NP5 zu niedrig angegeben sind.
