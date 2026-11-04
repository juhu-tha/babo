# Freigabepaket: Bauakustik: Bauschalldämmmaß (`rechnung_schallschutz`)

Stand 04.11.2026 · Gruppe „Beispielrechnungen“ · Typ `calculator` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif nach Klärung von #247-9** – Rechnung nachgerechnet und an den geprüften Kern gekoppelt; offen ist nur die Gültigkeit der Massekurve für Lochsteine (Hinweistext).

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Durchgerechnetes Beispiel zur Bauakustik: flächenbezogene Masse einer Massivwand, Schalldämmmaß R_w nach der Massekurve der DIN 4109-32 und Bau-Schalldämmmaß R′_w mit Flankenkorrektur; vertieft den Luftschallteil von `schallschutz`.

Bedeutung für die Lehre: Ergänzung und Nachschlagen; in keinem Lernpfad zugeordnet.

## Reiter und Bereiche

Ein Reiter der Komponente Beispielrechnungen (Schritt-für-Schritt-Rechnung mit Eingaben, Zwischenwerten und Hinweis zu Lochsteinen).

Komponente `src/modules/Beispielrechnungen.tsx`; Inhalt `content/beispielrechnungen/Beispielrechnungen.json`, `content/beispielrechnungen/RechnungBestand.json`, `content/beispielrechnungen/RechnungBeton.json`, `content/beispielrechnungen/RechnungBrandschutz.json`, `content/beispielrechnungen/RechnungHolzbau.json`, `content/beispielrechnungen/RechnungMauerwerk.json`, `content/beispielrechnungen/RechnungNachhaltigkeit.json`, `content/beispielrechnungen/RechnungSchallschutz.json`, `content/beispielrechnungen/RechnungStahlbeton.json`, `content/beispielrechnungen/RechnungUWert.json`, `content/beispielrechnungen/daten.json`.

## Rechenkerne und Testabdeckung

| Kern | Tests (Zahl der Prüfungen) | Referenzwerte |
|---|---|---|
| `src/calc/schall.ts` | `tests/schall.test.ts` (38), `tests/modulpruefungTranche1.test.ts` (46), `tests/modulpruefungTranche3.test.ts` (60), `tests/quizRechenfragen.test.ts` (43) | KS 17,5 cm, ρ = 2 000 kg/m³, Putz 40 kg/m²: m′ = 390 kg/m², R_w = 57,9 dB, R′_w = 55,9 dB (K_F = 2 dB) |

Die Quizfragen `qn_rechnung_schallschutz_1` bis `_3` werden in `tests/quizRechenfragen.test.ts` gegen den Kern nachgerechnet.

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T3-TS-1 | Massekurve für Lochsteine nur eingeschränkt → Hinweis in der Beispielrechnung | erledigt (umgesetzt, als vorläufig gekennzeichnet) | T3 (`module-tranche-3.md`) (Nr. 10); Normtext #247-9 |
| Umstellung 27.10. | Beispielrechnung von der Näherung „Beiblatt 1“ auf die Massekurve DIN 4109-32 umgestellt | erledigt (in Tranche 3 geprüft) | T3 (`module-tranche-3.md`) |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Kennungen nach dem Prüfbogen Normtext (Stand 28.10.2026) bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens.

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| #247-9 | DIN 4109-32:2016-07, Anwendungsgrenzen der Massekurve (Lochsteine) | Gilt die Massekurve für Hochlochziegel nur eingeschränkt? | Hinweis „Massekurve … gilt für solche Steine nur eingeschränkt; maßgebend sind dann Prüfwerte des Herstellers (vorläufig, F-Freigabe)“ – `content/beispielrechnungen/RechnungSchallschutz.json:24`; Beispiel HLZ 24 – `content/schallschutz/Schallschutz.json:83` |

## Quizfragen

6 Fragen, alle freigegeben.

## Quellen

DIN 4109-32:2016-07 (Massekurve), DIN 4109-1:2018-01 (Anforderungen). Befundliste Tranche 3, Nr. 10.

## Prüfschritte für die Freigabe (ca. 15 min)

1. m′ = 0,175 m · 2 000 kg/m³ + 40 kg/m² = 390 kg/m².
2. R_w = 30,9·lg 390 − 22,2 = 57,9 dB; R′_w = R_w − K_F = 55,9 dB mit K_F = 2 dB.
3. Vergleich HLz 24 cm, ρ = 1 200 kg/m³: m′ = 328 kg/m², R_w = 55,5 dB – Hinweis „Massekurve nur eingeschränkt, Prüfwerte des Herstellers maßgebend“ lesen (`content/beispielrechnungen/RechnungSchallschutz.json:24`; #247-9).
4. Quizfragen `qn_rechnung_schallschutz_1` bis `_3`: Antworten m′ = 390 kg/m², R_w ≈ 57,9 dB, R′_w ≈ 55,9 dB.
5. Anforderung Wohnungstrennwand R′_w ≥ 53 dB (DIN 4109-1:2018-01) im Ergebnistext.

## Empfehlung

**freigabereif nach Klärung von #247-9.** Rechnung nachgerechnet und an den geprüften Kern gekoppelt; offen ist nur die Gültigkeit der Massekurve für Lochsteine (Hinweistext).

Nach der Regel der Freigabe vom 02.11.2026 (Tranche 16: im Modul gekennzeichnete Normtextpunkte gelten als erledigt) wäre das Modul schon jetzt freigabereif; nach der Regel vom 28.10.2026 (Normtextpunkte blockieren) erst nach dem Normtextabgleich. Siehe `README.md`, Abschnitt „Zu entscheiden“.
