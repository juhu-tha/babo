# Freigabepaket: Mauerwerk: Tragfähigkeit (`rechnung_mauerwerk`)

Stand 04.11.2026 · Gruppe „Beispielrechnungen“ · Typ `calculator` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif nach Klärung von #239-W-1 und #239-MW-1** – Rechnung über den geprüften Kern `mauerwerk.ts`; offen sind dieselben zwei NA-Punkte wie in `mauerwerk`.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Durchgerechnetes Beispiel: Tragfähigkeit einer unbewehrten Mauerwerkswand unter Vertikallast im vereinfachten Verfahren nach DIN EN 1996-3/NA (f_k nach NA-Tabellen, f_d mit ζ = 0,85 und γ_M = 1,5, Φ₁/Φ₂, Grenzschlankheit 27); Übungsbaustein zu `mauerwerk`.

Bedeutung für die Lehre: Ergänzung und Nachschlagen; in keinem Lernpfad zugeordnet.

## Reiter und Bereiche

Ein Reiter der Komponente Beispielrechnungen: Eingaben (Höhe, Dicke, n_Ed, Stein/Mörtel/f_k, Wandlage, a/t, l_f) und Schritte 1–4 (f_d, h_ef und Schlankheit, Φ₁ und Φ₂, Nachweis).

Komponente `src/modules/Beispielrechnungen.tsx`; Inhalt `content/beispielrechnungen/Beispielrechnungen.json`, `content/beispielrechnungen/RechnungBestand.json`, `content/beispielrechnungen/RechnungBeton.json`, `content/beispielrechnungen/RechnungBrandschutz.json`, `content/beispielrechnungen/RechnungHolzbau.json`, `content/beispielrechnungen/RechnungMauerwerk.json`, `content/beispielrechnungen/RechnungNachhaltigkeit.json`, `content/beispielrechnungen/RechnungSchallschutz.json`, `content/beispielrechnungen/RechnungStahlbeton.json`, `content/beispielrechnungen/RechnungUWert.json`, `content/beispielrechnungen/daten.json`.

## Rechenkerne und Testabdeckung

| Kern | Tests (Zahl der Prüfungen) | Referenzwerte |
|---|---|---|
| `src/calc/mauerwerk.ts` | `tests/mauerwerk.test.ts` (38), `tests/ecKennwerte.test.ts` (45), `tests/keinErgebnisAnzeige.test.ts` (1), `tests/kleinfragenTranche1bis3.test.ts` (34), `tests/modulpruefungTranche1.test.ts` (46), `tests/modulpruefungTranche3.test.ts` (60) und 2 weitere | wie `mauerwerk`: n_Rd = 509,6 kN/m (h = 2,50 m, t = a = 175 mm, l_f = 5,0 m, f_k = 7,1) |

Die Quizfragen `qn_rechnung_mauerwerk_1` bis `_6` werden in `tests/quizRechenfragen.test.ts` gegen den Kern nachgerechnet (KS L 12 / NM III: f_k = 5,6 N/mm²; h_ef/t = 2,75/0,175 = 15,7 ≤ 27).

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| W-1 | Φ₁ = 0,9 für Innenwände auch bei a < t? | offen (Normtext) (#239-W-1) | T1 (`module-tranche-1.md`) (Nr. 7) |
| F-Stellen T1 | ρ₂ = 1,0 für 2/3 < a/t < 1; f_k KS P/KS L-P; Tab. NA.2 | vorläufig gekennzeichnet, nicht blockierend | T1 (`module-tranche-1.md`) |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Kennungen nach dem Prüfbogen Normtext (Stand 28.10.2026) bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens.

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| #239-W-1 | DIN EN 1996-3/NA:2019-12, NA, NCI zu 4.2.2.3 (Abminderungsbeiwert Φ₁) | Φ₁ = 0,9 für Innenwände/Zwischenauflager auch bei a < t (ohne Abminderung mit a/t) | `if (lage === 'innen') return 0.9;`; Endauflager `Math.min(1,6 − l_f/6 bzw. /5; 0.9 * aDurchT)` – `src/calc/mauerwerk.ts:189–191` |
| #239-MW-1 | DIN EN 1996-1-1/NA:2019-12, NA, Tabelle Haftscherfestigkeit f_vk0 je Mörtelgruppe | f_vk0 für NM I, NM II und NM IIIa | NM I 0,02 / NM II 0,08 / NM IIIa 0,26 N/mm² (als vorläufig geführt); übrige: NM IIa 0,18, NM III 0,22, LM 0,18, DM 0,22 – `src/calc/mauerwerk.ts:146`, Liste vorläufig `:148` |

## Quizfragen

6 Fragen, davon 3 nicht freigegeben: `qn_rechnung_mauerwerk_1`, `qn_rechnung_mauerwerk_3`, `qn_rechnung_mauerwerk_6`.

## Quellen

DIN EN 1996-3/NA:2019-12, DIN EN 1996-1-1/NA:2019-12; Herstellertafeln wie `mauerwerk`. Befundliste Tranche 1, Nr. 7.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Schritt 1: f_d = ζ·f_k/γ_M = 0,85·f_k/1,5; Beispiel KS L 12/NM III: f_k = 5,6 → f_d = 3,17 N/mm².
2. Schritt 2: h_ef = ρ₂·h mit ρ₂ = 0,75 (t ≤ 175 mm), 0,90 (t ≤ 250 mm), 1,0 (darüber oder a < t); h_ef/t ≤ 27.
3. Schritt 3: Φ₁ am Endauflager = min(1,6 − l_f/6; 0,9·a/t) (bzw. l_f/5 bei Dachdecken); Innenwand Φ₁ = 0,9 (#239-W-1); Φ₂ = 0,85 − 0,0011·(h_ef/t)².
4. Zahlenbeispiel: h = 2,50 m, t = a = 175 mm, l_f = 5,0 m, f_k = 7,1 → Φ₂ = 0,724, n_Rd = 509,6 kN/m.
5. Quizfragen `qn_rechnung_mauerwerk_1`, `_3`, `_6` (nicht freigegeben) gegen die Rechnung lesen.

## Empfehlung

**freigabereif nach Klärung von #239-W-1 und #239-MW-1.** Rechnung über den geprüften Kern `mauerwerk.ts`; offen sind dieselben zwei NA-Punkte wie in `mauerwerk`.

Nach der Regel der Freigabe vom 02.11.2026 (Tranche 16: im Modul gekennzeichnete Normtextpunkte gelten als erledigt) wäre das Modul schon jetzt freigabereif; nach der Regel vom 28.10.2026 (Normtextpunkte blockieren) erst nach dem Normtextabgleich. Siehe `README.md`, Abschnitt „Zu entscheiden“.
