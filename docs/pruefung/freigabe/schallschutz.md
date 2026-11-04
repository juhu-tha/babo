# Freigabepaket: Schallschutz (DIN 4109) (`schallschutz`)

Stand 04.11.2026 · Gruppe „Bauphysik“ · Typ `calculator` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif nach Klärung von #247-9 und der Trittschall-F-Stellen** – Luftschall uneingeschränkt freigabefähig; Trittschall rechnerisch richtig, aber ΔL_w, K und Treppenwerte sowie die Gültigkeit der Massekurve für Lochsteine hängen am Normtext.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Schallschutz im Hochbau nach DIN 4109 für die Bauphysik-Grundlagen: Luftschalldämmung einschaliger Massivbauteile über die Massekurve (DIN 4109-32), Bau-Schalldämmmaß mit Flankenkorrektur und Trittschall nach dem Deckenverfahren (DIN 4109-2/-34) mit Resonanzfrequenz schwimmender Estriche.

Bedeutung für die Lehre: Pflichtlehre / zentrales Lehrmodul; Lernpfade: Zertifikat Ausbau und Bestand.

## Reiter und Bereiche

Zwei Reiter: Luftschall (Massekurve, Anforderungen DIN 4109-1:2018-01) und Trittschall (L′_n,w = L_n,eq,0,w − ΔL_w + K, Nachweis mit u_prog = 3 dB, f₀).

Komponente `src/modules/Schallschutz.tsx`; Inhalt `content/schallschutz/Schallschutz.json`, `content/schallschutz/TrittschallTab.json`.

## Rechenkerne und Testabdeckung

| Kern | Tests (Zahl der Prüfungen) | Referenzwerte |
|---|---|---|
| `src/calc/schall.ts` | `tests/schall.test.ts` (38), `tests/modulpruefungTranche1.test.ts` (46), `tests/modulpruefungTranche3.test.ts` (60), `tests/quizRechenfragen.test.ts` (43) | R_w = 30,9·lg m′ − 22,2: m′ = 432 kg/m² → 59,2 dB; Trittschall Standardwerte: L′_n,w = 45,05 dB, + 3 dB = 48,0 ≤ 50 dB |

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| Hinweis | Ältere Näherung R_w ≈ 37,5·lg m′ − 42 als informativer Anhang DIN EN 12354-1 („manuell prüfen“) | kein Handlungsbedarf | T1 (`module-tranche-1.md`) (Nr. 10) |
| T3-TS-1 | Beispiel HLz 24 cm mit Massekurve; für Lochsteine nur eingeschränkt gültig → Hinweis ergänzt | erledigt (umgesetzt, als vorläufig gekennzeichnet) | T3 (`module-tranche-3.md`) (Nr. 10); Normtext #247-9 |
| F-Stellen Trittschall | ΔL_w = 13·lg m′ − 14,2·lg s′ + 20,8 dB (DIN 4109-34); K = 0,6 + 5,5·lg(m′_s/m′_f,m) ≥ 0 (DIN 4109-2); Treppen 53/46 dB (DIN 4109-1) | offen (vorläufig gekennzeichnet) | T1 (`module-tranche-1.md`), T3 (`module-tranche-3.md`) |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Kennungen nach dem Prüfbogen Normtext (Stand 28.10.2026) bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens.

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| #247-9 | DIN 4109-32:2016-07, Anwendungsgrenzen der Massekurve (Lochsteine) | Gilt die Massekurve für Hochlochziegel nur eingeschränkt? | Hinweis „Massekurve … gilt für solche Steine nur eingeschränkt; maßgebend sind dann Prüfwerte des Herstellers (vorläufig, F-Freigabe)“ – `content/beispielrechnungen/RechnungSchallschutz.json:24`; Beispiel HLZ 24 – `content/schallschutz/Schallschutz.json:83` |
| T1-SS-ΔL | DIN 4109-34 (Ausgabe in der Befundliste nicht genannt) | Gleichung ΔL_w für Zementestrich auf Trittschalldämmung | `src/calc/schall.ts` (ΔL_w, vorläufig) |
| T1-SS-K | DIN 4109-2:2018-01 | Korrektur K = 0,6 + 5,5·lg(m′_s/m′_f,m), Untergrenze 0 dB, Rundung | `src/calc/schall.ts` |
| T1-SS-Tr | DIN 4109-1:2018-01 | Anforderungen Treppenläufe 53 dB (MFH) und 46 dB (Reihen-/Doppelhaus) | `content/schallschutz/TrittschallTab.json` |

## Quizfragen

11 Fragen, alle freigegeben.

## Quellen

DIN 4109-1:2018-01, DIN 4109-2:2018-01, DIN 4109-32:2016-07, DIN 4109-34; Massekurve öffentlich wiedergegeben (Schöck-Handout 2018 für L_n,eq,0,w = 164 − 35·lg m′). Befundlisten Tranche 1, Nr. 10, und Tranche 3, Nr. 10. Die drei Trittschall-F-Stellen stehen noch nicht im Prüfbogen Normtext (Kennungen hier nur zur Zuordnung).

## Prüfschritte für die Freigabe (ca. 15 min)

1. Massekurve: KS 24 cm, ρ = 1 800 kg/m³ → m′ = 432 kg/m², R_w = 30,9·lg 432 − 22,2 = 59,2 dB; Masseverdopplung → +9,3 dB.
2. Bau-Schalldämmmaß: 17,5 cm, ρ = 2 000, Putz 20 kg/m², K_F = 2 dB → R′_w = 55,2 dB; Anforderung Wohnungstrennwand R′_w ≥ 53 dB.
3. Trittschall Standardwerte (Rohdecke 18 cm, 2 400 kg/m³ + 10 kg/m²; Estrich 5 cm; s′ = 20 MN/m³; m′_f,m = 250 kg/m²): L_n,eq,0,w = 71,41, ΔL_w = 28,33, K = 1,96, L′_n,w = 45,05 dB; + 3 dB = 48,0 ≤ 50 dB.
4. f₀ = 160·√(s′/m′): s′ = 20, m′ = 100 → 71,55 Hz (exakt 71,18 Hz, Abweichung 0,5 % durch den Faktor 160).
5. Gleichungen ΔL_w und K sowie die Treppenwerte 53/46 dB am Normtext DIN 4109-34/-2/-1 bestätigen (vorläufig gekennzeichnet in `src/calc/schall.ts`).
6. Beispiel HLz 24 cm (ρ = 800 kg/m³, m′ = 243 kg/m², R_w = 51,5 dB) mit Hinweis „Massekurve für Lochsteine nur eingeschränkt“ (`content/schallschutz/Schallschutz.json:83`; #247-9).

## Empfehlung

**freigabereif nach Klärung von #247-9 und der Trittschall-F-Stellen.** Luftschall- und Trittschallteil sind in Tranche 1 und 3 nachgerechnet, alle Fälle stimmen. Offen sind #247-9 (Lochsteine) und drei Trittschall-Gleichungen bzw. -Werte, die als vorläufig gekennzeichnet sind. Die drei Trittschallpunkte fehlen bisher im Prüfbogen; sie sollten dort unter DIN 4109 aufgenommen werden. Alternative: Freigabe des Luftschallteils ist im Prüfvermerk nicht vorgesehen, daher Freigabe erst nach dem Normtextabgleich.

Nach der Regel der Freigabe vom 02.11.2026 (Tranche 16: im Modul gekennzeichnete Normtextpunkte gelten als erledigt) wäre das Modul schon jetzt freigabereif; nach der Regel vom 28.10.2026 (Normtextpunkte blockieren) erst nach dem Normtextabgleich. Siehe `README.md`, Abschnitt „Zu entscheiden“.
