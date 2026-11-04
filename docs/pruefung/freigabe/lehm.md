# Freigabepaket: Lehm & Stampflehm (`lehm`)

Stand 04.11.2026 · Gruppe „Baustoffe“ · Typ `standard` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif nach Klärung von T5-LE-2a/b** – Schätzmodell als Lehrmodell gekennzeichnet und nachgerechnet; offen sind Anwendungsgrenze und Festigkeitsklassen am Normtext DIN 18940/18945.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Lehm als Baustoff für Baustoffkunde (Termin 12): Tonminerale, Stampflehm, Lehmsteine, Lehmmörtel und -putze, Sorption und Feuchtepuffer, Bemessung nach DIN 18940 und Produktnormen DIN 18945 ff.; Schätzmodell Stampflehm als Lehrmodell.

Bedeutung für die Lehre: Pflichtlehre / zentrales Lehrmodul; Lernpfade: Baustoffkunde.

## Reiter und Bereiche

Ein Modul mit Fachtext (Tonminerale, Bauweisen, Normen), Schätzmodell Stampflehm (Ton/Schluff/Sand, Wassergehalt), Abschnitt Bemessung nach DIN 18940, Beispiel Trocknungswasser.

Komponente `src/modules/Lehm.tsx`; Inhalt `content/lehm/Lehm.json`.

## Rechenkerne und Testabdeckung

| Kern | Tests (Zahl der Prüfungen) | Referenzwerte |
|---|---|---|
| `src/calc/lehm.ts` | `tests/lehm.test.ts` (11) | Ton 15, Schluff 35, Sand 50 Teile, w = 12 %: ρ = 1920 kg/m³, f = 1,21 N/mm², Schwinden 0,84 %, λ = 0,918 W/(mK), Kennzahl 12 (Lehrmodell ohne Normbezug) |

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T5-LE-3 | DIN 18945:2024-03 durch A1:2026-06 geändert → Regelwerk ergänzt | erledigt (behoben) | T5 (`module-tranche-5.md`) (Nr. 6) |
| T5-LE-1 | Schätzmodell → Kern `lehm.ts`, als Lehrmodell ohne Normbezug gekennzeichnet; unwirksame Untergrenzen entfernt; Hinweis 2–4 N/mm² für Stampflehm; Sorption als „Feuchtepuffer-Kennzahl ohne Zeitbezug“ | erledigt (umgesetzt) (29.10.) | T5 (`module-tranche-5.md`), Umsetzung 29.10. |
| T5-LE-2 | Anwendungsgrenze 13 m/GK 1–4 und Druckfestigkeitsklassen 2–6 N/mm² am Normtext | erledigt (umgesetzt, als vorläufig gekennzeichnet) | T5 (`module-tranche-5.md`); Normtext T5-LE-2a/b |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Kennungen nach dem Prüfbogen Normtext (Stand 28.10.2026) bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens.

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| T5-LE-2a | DIN 18940:2023-06, Anwendungsbereich | Anwendungsgrenze Gebäudehöhe / Gebäudeklassen und ausgeschlossene Wände | „Gebäude bis 13,0 m Höhe, d. h. Gebäudeklasse 1 bis 4; nicht für Keller-, Brand- und freistehende Wände“ – `content/lehm/Lehm.json:15`, `:21` |
| T5-LE-2b | DIN 18945:2024-03 + A1:2026-06, Druckfestigkeitsklassen Lehmsteine | Reihe der Klassen (mittlere Steindruckfestigkeit) | „2 – 2,5 – 3 – 4 – 5 – 6 N/mm²“ – `content/lehm/Lehm.json:17`; `content/bplehmbauprodukte/BpLehmbauprodukte.json:68` |

## Quizfragen

6 Fragen, alle freigegeben.

## Quellen

DIN 18940:2023-06, DIN 18945:2024-03 mit A1:2026-06 (DIN Media), DIN 18946, DIN 18947 (Normtexte nicht öffentlich). Befundliste Tranche 5, Nr. 6.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Schätzmodell Startwerte: Ton 15, Schluff 35, Sand 50 Teile, w = 12 % → ρ = 1700 + 5·50 − 2·15 = 1920 kg/m³, f = 1,21 N/mm², Schwinden 0,84 %, λ = 0,918 W/(mK); Kennzeichnung „Lehrmodell“.
2. Beispiel Trocknungswasser: 100 m², 20 mm, ρ_d = 1700 kg/m³, u₀ = 18 %, u_eq = 1,5 % → m_W = 3400·0,165 = 561 kg (≈ 560 kg).
3. Anwendungsgrenze DIN 18940: „bis 13,0 m Höhe, Gebäudeklassen 1–4; nicht für Keller-, Brand- und freistehende Wände“ (`content/lehm/Lehm.json:21`) am Normtext prüfen (T5-LE-2a).
4. Druckfestigkeitsklassen Lehmsteine 2 – 2,5 – 3 – 4 – 5 – 6 N/mm² (DIN 18945 + A1) prüfen (T5-LE-2b).
5. Sorption: Ausgabe „Feuchtepuffer-Kennzahl (Lehrmodell, ohne Zeitbezug)“ mit Verweis auf die Zeitstufen der DIN 18947 (T5-LE-1).

## Empfehlung

**freigabereif nach Klärung von T5-LE-2a/b.** Schätzmodell als Lehrmodell gekennzeichnet und nachgerechnet; offen sind Anwendungsgrenze und Festigkeitsklassen am Normtext DIN 18940/18945.

Nach der Regel der Freigabe vom 02.11.2026 (Tranche 16: im Modul gekennzeichnete Normtextpunkte gelten als erledigt) wäre das Modul schon jetzt freigabereif; nach der Regel vom 28.10.2026 (Normtextpunkte blockieren) erst nach dem Normtextabgleich. Siehe `README.md`, Abschnitt „Zu entscheiden“.
