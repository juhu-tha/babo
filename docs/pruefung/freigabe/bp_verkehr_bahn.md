# Freigabepaket: Bahnbau & Oberbau (`bp_verkehr_bahn`)

Stand 04.11.2026 · Gruppe „Bauprodukte“ · Typ `standard` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif** – Temperaturkern in drei Fällen nachgerechnet, Faktenstichprobe ohne Befund; offen sind zwei Schotterkennwerte (DIN EN 13450/DB TL 918 061). Die Normpunkte sind in der App gekennzeichnet und gelten nach der Regel vom 02.11.2026 als erledigt.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Bahnbau kompakt: Schotteroberbau und Feste Fahrbahn, Gleisschotter nach DIN EN 13450, Schienenprofile (UIC 60/60E1, R260), Temperaturspannungen im lückenlosen Gleis.

Bedeutung für die Lehre: Ergänzung und Nachschlagen; in keinem Lernpfad zugeordnet.

## Reiter und Bereiche

Reiter der Komponente Verkehrswegebau (`src/modules/BpVerkehrswegebau.tsx`); die übrigen Reiter `bp_verkehr_rsto`, `_asphalt`, `_pruefung`, `_tunnel` sind seit 29.10. freigegeben.

Komponente `src/modules/BpVerkehrswegebau.tsx`; Inhalt `content/bpverkehrswegebau/BahnbauTab.json`, `content/bpverkehrswegebau/BetondeckenTab.json`, `content/bpverkehrswegebau/BindemittelTab.json`, `content/bpverkehrswegebau/BpVerkehrswegebau.json`, `content/bpverkehrswegebau/PrueftechnikTab.json`, `content/bpverkehrswegebau/RstoRechnerTab.json`, `content/bpverkehrswegebau/TiefbauTab.json`, `content/bpverkehrswegebau/TunnelbauTab.json`, `content/bpverkehrswegebau/VergleichTab.json`, `content/bpverkehrswegebau/daten.json`.

## Rechenkerne und Testabdeckung

| Kern | Tests (Zahl der Prüfungen) | Referenzwerte |
|---|---|---|
| `src/calc/verkehrswegebau.ts` | `tests/verkehrswegebau.test.ts` (30), `tests/asphalt.test.ts` (27), `tests/modulpruefungTranche7.test.ts` (38), `tests/nachstichprobe3.test.ts` (64), `tests/nachstichprobe4.test.ts` (60) | `schienenTemperatur`: 55 °C / 20 °C, Schotter gut → σ = 88,2 N/mm², F = 677,9 kN, unkritisch |

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| Faktenstichprobe T7 | 60E1 60,21 kg/m, R260 R_m ≥ 880 MPa, UIC 60 60,34 kg/m und 76,86 cm² | ohne Befund | T7 (`module-tranche-7.md`) (Nr. 19) |
| T7-BA-1 | Gleisschotter Flachheitskennzahl ≤ 20 % und SZ ≤ 20 % | offen (Normtext) | T7 (`module-tranche-7.md`), Umsetzung 29.10. |
| Hinweis | Knickgrenzen 90/135 N/mm² als Lehrwerte im Kern gekennzeichnet | kein Handlungsbedarf | T7 (`module-tranche-7.md`) |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Für die Freigabe gelten sie als erledigt (Regel vom 02.11.2026, Entscheidung vom 04.11.2026); sie bleiben im Prüfbogen Normtext, Reiter „Nach Normen (04.11.)“, offen. Kennungen nach dem Prüfbogen bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens (28.10.2026).

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| T7-BA-1a | DIN EN 13450 / DB-Richtlinie TL 918 061 (Ausgaben in der App nicht angegeben), Kategorie Flachheitskennzahl, Anforderung DB | Grenzwert Flachheitskennzahl Gleisschotter | „Flachheitskennzahl (≤ 20 %)“ – `content/bpverkehrswegebau/BahnbauTab.json:5` |
| T7-BA-1b | DIN EN 13450 / DB-Richtlinie TL 918 061 (Ausgaben in der App nicht angegeben), Kategorie Widerstand gegen Schlagzertrümmerung, Anforderung DB | Grenzwert SZ | „Widerstand gegen Schlagzertrümmerung (SZ ≤ 20 %)“ – `content/bpverkehrswegebau/BahnbauTab.json:5` |

## Quizfragen

6 Fragen, alle freigegeben.

## Quellen

DIN EN 13450, DB-Richtlinie TL 918 061 (nicht öffentlich), DIN EN 13674-1; British Steel „Rail profiles and grades“ (07/2026). Befundliste Tranche 7, Nr. 19.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Temperaturspannung: σ_T = 210 000·1,2·10⁻⁵·ΔT; 55 °C/20 °C → σ = 88,2 N/mm², F = σ·7686 mm² = 677,9 kN (Beispiel ≈ 680 kN); 88,2 < 0,7·135 → unkritisch.
2. Winter −20 °C/20 °C → σ = −100,8 N/mm² (Zug, Grenze −120 N/mm²).
3. 45 °C/20 °C, Schotter mager → σ = 63 ≥ 0,7·90 → erhöht; F = 484,2 kN.
4. Gleisschotter „Flachheitskennzahl ≤ 20 %“ und „SZ ≤ 20 %“ (`content/bpverkehrswegebau/BahnbauTab.json:5`) gegen DIN EN 13450 und TL 918 061 prüfen (T7-BA-1a/b).
5. Schienenprofil: 60E1 60,21 kg/m (UIC 60 alt 60,34 kg/m, 76,86 cm²), Stahlsorte R260 mit R_m ≥ 880 MPa.

## Empfehlung

**freigabereif.** Temperaturkern in drei Fällen nachgerechnet, Faktenstichprobe ohne Befund; offen sind zwei Schotterkennwerte (DIN EN 13450/DB TL 918 061). Die Normpunkte sind in der App gekennzeichnet und gelten nach der Regel vom 02.11.2026 als erledigt.

Bisher „freigabereif nach Klärung von T7-BA-1a/b“. Die offenen Normpunkte (von T7-BA-1a/b) sind in der App als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und gelten nach der Regel vom 02.11.2026 (Entscheidung vom 04.11.2026) für die Freigabe als erledigt. Sie bleiben im Prüfbogen Normtext offen; nach der Normprüfung wird der Wert angepasst.
