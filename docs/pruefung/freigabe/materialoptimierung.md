# Freigabepaket: Materialoptimierung & Klinker (`materialoptimierung`)

Stand 04.11.2026 · Gruppe „Nachhaltigkeit“ · Typ `calculator` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif nach Klärung von T11-MO-2** – Rechner mehrfach nachgerechnet, Lehrwerte vereinheitlicht; offen ist nur die Frage, ob die Lehreinteilung durch die Minderungsklassen der DAfStb-Richtlinie ersetzt wird.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Materialoptimierung im Betonbau für WPF Nachhaltiges Bauen (Termin 5) und A.RYC (Termin 7): CO₂-reduzierte Zemente und Klinkerersatz, rezyklierte Gesteinskörnung, schlanke Bauteile, Pflanzenkohle; Rechner nach dem Prinzip der DAfStb-Richtlinie „Treibhausgasreduzierte Tragwerke“ mit Lehreinteilung der Minderung.

Bedeutung für die Lehre: Lehrveranstaltung (Vertiefung, Wahlpflicht, Master, Weiterbildung); Lernpfade: A.RYC, VNHB, WPF Nachhaltiges Bauen.

## Reiter und Bereiche

Komponente `src/modules/Materialoptimierung.tsx`; Inhalt `content/materialoptimierung/DafstbRichtlinieTab.json`, `content/materialoptimierung/Materialoptimierung.json`, `content/materialoptimierung/daten.json`.

## Rechenkerne und Testabdeckung

| Kern | Tests (Zahl der Prüfungen) | Referenzwerte |
|---|---|---|
| `src/calc/materialoptimierung.ts` | `tests/materialoptimierung.test.ts` (14), `tests/keinErgebnisAnzeige.test.ts` (1), `tests/konsistenz1029.test.ts` (60), `tests/modulpruefungTranche11.test.ts` (26), `tests/modulpruefungTranche15.test.ts` (77), `tests/umsetzungNachpruefung2_20261029.test.ts` (35) | Lehrbeton 320 kg Zement: CEM I 258, CEM II/A-LL 237, CEM II/B-S 215, CEM III/A 173 kg CO₂e/m³; Referenzdecke 8 538 → optimiert 4 099 kg CO₂e, Minderung 51,99 % → „Klasse A+“ (Lehreinteilung) |

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T11-MO-1 | Effizienzklassen als Lehreinteilung gekennzeichnet; Bezug zu den Treibhausgas-Minderungsklassen der DAfStb-Richtlinie (Referenzniveau 2020) hergestellt | erledigt (behoben) | T11 (`module-tranche-11.md`) (Nr. 8) |
| T11-MO-2 | Minderungsklassen der Richtlinie übernehmen oder Lehreinteilung beibehalten? | offen (Normtext) (Richtlinientext) | T11 (`module-tranche-11.md`) |
| T11-MO-3 | GWP-Lehrwerte uneinheitlich → einheitlich 320 kg Zement · GWP_Zement + Rest; Zement-GWP aus `src/data/zementGwp.ts`; Stahl-Referenz ÖKOBAUDAT 0,64 | erledigt (umgesetzt) (29./30.10.) | T11 (`module-tranche-11.md`), Umsetzung 29.10.; T15-NH-3 |
| Hinweis | Hohlkörperdecken „bis zu 35 %“, Vorspannung „20 bis 25 %“ als Größenordnungen der Praxisliteratur | kein Handlungsbedarf | T11 (`module-tranche-11.md`) |

Kleine Abweichung im Testkommentar: `tests/materialoptimierung.test.ts` nennt in Zeile 10 noch „+ 30“; Kern und Zeile 12 rechnen seit 30.10.2026 mit „+ 45“ kg/m³ (Rest des Lehrbetons). In diesem PR angeglichen (nur Kommentar).

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Kennungen nach dem Prüfbogen Normtext (Stand 28.10.2026) bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens.

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| T11-MO-2 | DAfStb-Richtlinie „Treibhausgasreduzierte Tragwerke aus Beton, Stahlbeton oder Spannbeton“ (Weißdruck 08/2024), Teil 1, Treibhausgas-Minderungsklassen (Bezeichnungen, Grenzen, Referenzniveau 2020) | Klassen der Richtlinie übernehmen oder Lehreinteilung beibehalten? | Lehreinteilung: ≥ 50 % „Klasse A+“, ≥ 40 % „A“, ≥ 25 % „B“, ≥ 10 % „C“, sonst „Referenz“ – `src/calc/materialoptimierung.ts:63–66` (Kopf `:8`) |

## Quizfragen

6 Fragen, davon 3 nicht freigegeben: `q_mo_1`, `qn_materialoptimierung_2`, `qn_materialoptimierung_3`.

## Quellen

DAfStb-Richtlinie „Treibhausgasreduzierte Tragwerke aus Beton, Stahlbeton oder Spannbeton“ (Weißdruck 08/2024, Teil 1 und 2; Text nicht öffentlich), VDZ-Branchen-EPD 2022, ÖKOBAUDAT 2024-I, `src/data/zementGwp.ts`. Befundliste Tranche 11, Nr. 8, und Tranche 15 (T15-NH-3).

## Prüfschritte für die Freigabe (ca. 15 min)

1. Beton-GWP des Lehrbetons: round(320·GWP_Zement + 45): CEM I 320·0,665 + 45 = 258; CEM III/A 320·0,40 + 45 = 173 kg CO₂e/m³.
2. Referenzdecke 100 m²: 26 m³·258 + 2 860 kg·0,64 = 6 708 + 1 830 = 8 538 kg CO₂e (85,4 kg/m²).
3. Optimiert (CEM III/A, 56 d, Elektrostahl): round(173·0,91) = 157 kg/m³; 19,5·157 + 2 470·0,42 = 3 062 + 1 037 = 4 099 kg → Minderung 51,99 %.
4. Lehreinteilung ≥ 50 % „A+“, ≥ 40 % „A“, ≥ 25 % „B“, ≥ 10 % „C“, sonst „Referenz“ (`src/calc/materialoptimierung.ts:82`) gegen die Treibhausgas-Minderungsklassen der DAfStb-Richtlinie, Teil 1, halten (T11-MO-2).
5. Beispiel k-Wert: (w/z)_eq = 165/(280 + 0,4·60) = 0,543 ≤ 0,60.
6. Pflanzenkohle: 10 kg/m³ bei 2,5–3,0 t CO₂/t → 25–30 kg CO₂ ≙ 10,4–12,5 % von 240 kg.

## Empfehlung

**freigabereif nach Klärung von T11-MO-2.** T11-MO-1 und -3 sind erledigt. T11-MO-2 ist eher eine Entscheidung als ein Normwert: Die Lehreinteilung ist gekennzeichnet; liegt der Richtlinientext vor, können die Grenzen in `effizienzKlasseThg` übernommen werden. Wenn die Lehreinteilung bleiben soll, ist das Modul ohne Normtext freigabereif.

Nach der Regel der Freigabe vom 02.11.2026 (Tranche 16: im Modul gekennzeichnete Normtextpunkte gelten als erledigt) wäre das Modul schon jetzt freigabereif; nach der Regel vom 28.10.2026 (Normtextpunkte blockieren) erst nach dem Normtextabgleich. Siehe `README.md`, Abschnitt „Zu entscheiden“.
