# Freigabepaket: Betondecken (ZTV Beton-StB) (`bp_verkehr_betondecken`)

Stand 04.11.2026 · Gruppe „Bauprodukte“ · Typ `standard` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif** – Westergaard und Fugenkern nachgerechnet, Regelwerksliste ergänzt; offen sind drei Werte der ZTV/TL Beton-StB 26 (Fugenabstand, Festigkeitskenngröße, LP-Grenzen). Die Normpunkte sind in der App gekennzeichnet und gelten nach der Regel vom 02.11.2026 als erledigt.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Betondecken im Straßenbau nach ZTV/TL Beton-StB 26: Westergaard-Spannungen (Rand, Innen, Ecke), Fugenplanung, Luftporengehalt, AKR-Vorbeugung (NA-Zement), Dübel und Anker.

Bedeutung für die Lehre: Ergänzung und Nachschlagen; in keinem Lernpfad zugeordnet.

## Reiter und Bereiche

Reiter der Komponente Verkehrswegebau (`src/modules/BpVerkehrswegebau.tsx`); die übrigen Reiter `bp_verkehr_rsto`, `_asphalt`, `_pruefung`, `_tunnel` sind seit 29.10. freigegeben.

Komponente `src/modules/BpVerkehrswegebau.tsx`; Inhalt `content/bpverkehrswegebau/BahnbauTab.json`, `content/bpverkehrswegebau/BetondeckenTab.json`, `content/bpverkehrswegebau/BindemittelTab.json`, `content/bpverkehrswegebau/BpVerkehrswegebau.json`, `content/bpverkehrswegebau/PrueftechnikTab.json`, `content/bpverkehrswegebau/RstoRechnerTab.json`, `content/bpverkehrswegebau/TiefbauTab.json`, `content/bpverkehrswegebau/TunnelbauTab.json`, `content/bpverkehrswegebau/VergleichTab.json`, `content/bpverkehrswegebau/daten.json`.

## Rechenkerne und Testabdeckung

| Kern | Tests (Zahl der Prüfungen) | Referenzwerte |
|---|---|---|
| `src/calc/verkehrswegebau.ts` | `tests/verkehrswegebau.test.ts` (30), `tests/asphalt.test.ts` (27), `tests/modulpruefungTranche7.test.ts` (38), `tests/nachstichprobe3.test.ts` (64), `tests/nachstichprobe4.test.ts` (60) | `westergaardRand`: h = 26 cm, Achse 120 kN, k = 80 MN/m³ → σ_e = 1,757, σ_i = 1,170, σ_c = 1,519 N/mm²; `betondeckenFugen`: L = 5,0 m, h = 18 cm → L_max = 4,5 m → Rissgefahr |

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T7-BD-1 | Regelwerksliste ohne Ausgaben → ZTV/TL Beton-StB 26, RDO Beton 24, TL/ZTV Asphalt-StB 26, RStO 12/24 u. a. | erledigt (behoben) | T7 (`module-tranche-7.md`) (Nr. 17) |
| T7-BD-2 | Querfugenabstand: Lehrannahme min(25·h; 5,0 m); nach Kenntnisstand ZTV Beton-StB 25·h, höchstens 7,5 m | offen (Normtext) | T7 (`module-tranche-7.md`), Umsetzung 29.10. |
| T7-BD-3 | „Biegezugprüfung m_fct,sp ≥ 4,5 MPa“ (f_ct,sp ist Spaltzug); LP-Grenzen als Lehrwerte | offen (Normtext) | T7 (`module-tranche-7.md`), Umsetzung 29.10. |
| DSC-VK-1 | Dickenregler „Autobahn Bk100: 28–30 cm“ gegen RStO 12/24 Tafel 2 Zeile 1 (27 cm) | erledigt (jetzt 27 cm, vorläufig) | `durchsicht-C-2026-10-29.md`, Hinweise |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Für die Freigabe gelten sie als erledigt (Regel vom 02.11.2026, Entscheidung vom 04.11.2026); sie bleiben im Prüfbogen Normtext, Reiter „Nach Normen (04.11.)“, offen. Kennungen nach dem Prüfbogen bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens (28.10.2026).

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| T7-BD-2 | ZTV Beton-StB 26, Fugenanordnung, Querfugenabstand | Höchstwert (25·h und 5,0 m oder 7,5 m) | `Math.min(25 * (dickeCm / 100), 5.0)` – `src/calc/verkehrswegebau.ts:164`; „ZTV Standard: ≤ 5,0 m“, „Kritischer Baufehler: > 5,0 m“ – `content/bpverkehrswegebau/BetondeckenTab.json:39–40`; Quiz `qn_bp_verkehr_betondecken_5` `src/data/quiz.json:33653` |
| T7-BD-3a | TL Beton-StB 26, Anforderungen an die Festigkeit | Kenngröße (Biegezug- oder Spaltzugfestigkeit) und Wert | „Standardmäßig **C30/37** (Biegezugprüfung m_fct,sp ≥ 4,5 MPa).“ – `content/bpverkehrswegebau/BetondeckenTab.json:7` |
| T7-BD-3b | ZTV Beton-StB 26, Luftporengehalt Frischbeton | LP-Grenzen je Größtkorn | GK 22: 4,5–7,0 %, GK 32: 4,0–6,5 % (`reqMin`/`reqMax`, als Lehrwerte gekennzeichnet) – `src/modules/bpverkehrswegebau/BetondeckenTab.tsx:209–210` |

## Quizfragen

6 Fragen, alle freigegeben.

## Quellen

ZTV Beton-StB 26 (ARS 09/2026), TL Beton-StB 26 (ARS 10/2026), RDO Beton 24, RStO 12/24 (Normtexte nicht öffentlich; Regelwerksliste LS Brandenburg 07/2026), Westergaard (1926). Befundliste Tranche 7, Nr. 17.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Westergaard Standard: h = 26 cm, Achslast 120 kN, k = 80 MN/m³ → l = 893,3 mm, σ_e = 1,757 N/mm² (Rand) ≤ 2,25 N/mm² (Lehrannahme).
2. h = 18 cm, 100 kN, k = 30 → σ_e = 3,203 > 2,25 → nicht ausreichend.
3. Fugenabstand: L = 5,0 m, h = 18 cm → L_max = min(25·0,18; 5,0) = 4,5 m → Rissgefahr (`src/calc/verkehrswegebau.ts:167`); Höchstwert 5,0 oder 7,5 m an ZTV Beton-StB 26 prüfen (T7-BD-2; Quiz `qn_bp_verkehr_betondecken_5`).
4. Festigkeit „C30/37 (Biegezugprüfung m_fct,sp ≥ 4,5 MPa)“ (`content/bpverkehrswegebau/BetondeckenTab.json:7`) an TL Beton-StB 26 prüfen: Kenngröße Biegezug oder Spaltzug, Wert (T7-BD-3a).
5. LP-Grenzen GK 22: 4,5–7,0 %, GK 32: 4,0–6,5 % (Lehrwerte) an ZTV Beton-StB 26 prüfen (T7-BD-3b).

## Empfehlung

**freigabereif.** Westergaard und Fugenkern nachgerechnet, Regelwerksliste ergänzt; offen sind drei Werte der ZTV/TL Beton-StB 26 (Fugenabstand, Festigkeitskenngröße, LP-Grenzen). Die Normpunkte sind in der App gekennzeichnet und gelten nach der Regel vom 02.11.2026 als erledigt.

Bisher „freigabereif nach Klärung von T7-BD-2 und T7-BD-3a/b“. Die offenen Normpunkte (von T7-BD-2 und T7-BD-3a/b) sind in der App als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und gelten nach der Regel vom 02.11.2026 (Entscheidung vom 04.11.2026) für die Freigabe als erledigt. Sie bleiben im Prüfbogen Normtext offen; nach der Normprüfung wird der Wert angepasst.
