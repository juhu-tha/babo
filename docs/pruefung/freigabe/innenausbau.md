# Freigabepaket: Innenausbau-Sammlung & Ausbausysteme (`innenausbau`)

Stand 04.11.2026 · Gruppe „Innenausbau“ · Typ `standard` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif** – Nachrechnungen und Faktenstichprobe stimmen, zwei Fehler behoben; offen sind die Klasse der häuslichen bodengleichen Dusche (DIN 18534-1:2025-10) und die Leistungsart der CM-Messung (DIN 18365). Die Normpunkte sind in der App gekennzeichnet und gelten nach der Regel vom 02.11.2026 als erledigt.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Übersichts- und Werkzeugmodul Innenausbau (Zertifikat „Ausbau und Bestand“): Estriche und Belegreife (CM-Messung), Trockenbau (Ständerwerk, Gipsplatten, Resonanzfrequenz), Verbundabdichtung nach DIN 18534 (Wassereinwirkungsklassen), Akustik und Brandschutz, zwölf Werkzeuge.

Bedeutung für die Lehre: Lehrveranstaltung (Vertiefung, Wahlpflicht, Master, Weiterbildung); Lernpfade: Zertifikat Ausbau und Bestand.

## Reiter und Bereiche

Reiter laut Komponente: Modul-Navigator (`uebersicht`) · Estriche (CT/CA/AS) & Belegreife (`estriche`) · Trockenbau & Gipsplatten (`trockenbau`) · Verbundabdichtung (DIN 18534) (`abdichtung`) · CM-Restfeuchte-Rechner (`rechner`).

Übersicht mit zwölf Werkzeugen, Estriche & Belegreife, Trockenbau, Verbundabdichtung, Belegreife-Prüfer.

Komponente `src/modules/Innenausbau.tsx`; Inhalt `content/innenausbau/Innenausbau.json`.

## Rechenkerne und Testabdeckung

Kein Rechenkern in `src/calc/`; Belegreife-Prüfer und Beispiele (s′, f₀) stehen inline und sind in Tranche 6 (IA1–IA5) nachgerechnet.

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T6-IA-1 | W2-I nannte gewerbliche Küchen (W3-I) → Beschreibung und Abdichtungszeile berichtigt | erledigt (behoben) | T6 (`module-tranche-6.md`) (Nr. 11) |
| T6-IA-2 | Werkzeugkarte U-Wert „Grenzwerte nach GEG“ → „Höchstwerte nach GModG (vormals GEG)“ | erledigt (behoben) | T6 (`module-tranche-6.md`) |
| T6-IA-3 | Zuordnung bodengleicher Duschen im häuslichen Bad (W1-I oder W2-I) nach DIN 18534-1:2025-10 | offen (Normtext) | T6 (`module-tranche-6.md`) |
| T6-IA-4 | CM-Messung Nebenleistung oder Besondere Leistung nach DIN 18365? | offen (Normtext) | T6 (`module-tranche-6.md`) |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Für die Freigabe gelten sie als erledigt (Regel vom 02.11.2026, Entscheidung vom 04.11.2026); sie bleiben im Prüfbogen Normtext, Reiter „Nach Normen (04.11.)“, offen. Kennungen nach dem Prüfbogen bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens (28.10.2026).

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| T6-IA-3 | DIN 18534-1:2025-10, Tab. 1 und Anhang A | Klasse der Bodenfläche einer bodengleichen Dusche im häuslichen Bad (W1-I, W2-I oder W3-I) | W2-I: „Bodenflächen mit Abläufen und/oder Rinnen (z. B. bodengleiche Duschen), Wandflächen von Duschen in Sport- und Gewerbestätten.“ – `content/innenausbau/Innenausbau.json:61`; „Bodengleiche Duschen fallen nach DIN 18534-1 in W2-I“ – `:99`; Quiz `q_iax_3`, richtige Antwort W2-I – `src/data/quiz.json:24993` |
| T6-IA-4 | DIN 18365 (VOB/C, Ausgabe in der App nicht angegeben), Abschnitte 3.1 und 4 | Ist die CM-Messung Nebenleistung oder Besondere Leistung? | „Nach VOB/C DIN 18365 gehört die Prüfung des Untergrunds einschließlich Feuchtemessung zu den Nebenleistungen des Bodenlegers“ – `content/innenausbau/Innenausbau.json:82` |

## Quizfragen

7 Fragen, davon 1 nicht freigegeben: `qlz_innenausbau_1`.

## Quellen

DIN 18534-1 bis -6:2025-10 (bauprofessor, DIN-Inhaltsverzeichnis), Baunetz Wissen (Wassereinwirkungsklassen), Rigips-Merkblatt, Stauf SO 01, DIN EN 520, DIN EN ISO 6946, DIN 18365 (VOB/C). Befundliste Tranche 6, Nr. 11.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Belegreife: CT unbeheizt 2,0 / beheizt 1,8 CM-%, CA unbeheizt 0,5 / beheizt 0,3 CM-%; 1,9 CM-% bei CT unbeheizt → belegreif.
2. Dynamische Steifigkeit s′ = 0,111/d: d = 75 mm → 1,48 MN/m³; Resonanzfrequenz bei 2 × 12,5 mm GKB je Seite (17 kg/m²) ≈ 66 Hz, einfach beplankt ≈ 94 Hz.
3. Kristallwasser GKF 15 mm (≈ 12 kg/m², 20,9 %) → rund 2,5 l/m².
4. Bodengleiche Dusche im häuslichen Bad: Klasse W2-I (`content/innenausbau/Innenausbau.json:99`) gegen Tab. 1 und Anhang A der DIN 18534-1:2025-10 prüfen (T6-IA-3; Quiz `q_iax_3`).
5. CM-Messung als Nebenleistung des Bodenlegers (`content/innenausbau/Innenausbau.json:82`) an DIN 18365, Abschnitte 3.1 und 4, prüfen (T6-IA-4).

## Empfehlung

**freigabereif.** Nachrechnungen und Faktenstichprobe stimmen, zwei Fehler behoben; offen sind die Klasse der häuslichen bodengleichen Dusche (DIN 18534-1:2025-10) und die Leistungsart der CM-Messung (DIN 18365). Die Normpunkte sind in der App gekennzeichnet und gelten nach der Regel vom 02.11.2026 als erledigt.

Bisher „freigabereif nach Klärung von T6-IA-3 und T6-IA-4“. Die offenen Normpunkte (von T6-IA-3 und T6-IA-4) sind in der App als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und gelten nach der Regel vom 02.11.2026 (Entscheidung vom 04.11.2026) für die Freigabe als erledigt. Sie bleiben im Prüfbogen Normtext offen; nach der Normprüfung wird der Wert angepasst.
