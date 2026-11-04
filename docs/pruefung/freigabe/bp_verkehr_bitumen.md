# Freigabepaket: Bitumen & Gesteine (`bp_verkehr_bitumen`)

Stand 04.11.2026 · Gruppe „Bauprodukte“ · Typ `standard` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif** – Faktenstichprobe ohne Befund; offen sind nur die PSV-Kategorien nach TL Gestein-StB. Die Normpunkte sind in der App gekennzeichnet und gelten nach der Regel vom 02.11.2026 als erledigt.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Bitumen und Gesteinskörnungen im Straßenbau: Straßenbaubitumen und PmB (DIN EN 12591/14023), Nadelpenetration und Erweichungspunkt Ring und Kugel, Polierwert PSV der Gesteinskörnung.

Bedeutung für die Lehre: Ergänzung und Nachschlagen; in keinem Lernpfad zugeordnet.

## Reiter und Bereiche

Reiter der Komponente Verkehrswegebau (`src/modules/BpVerkehrswegebau.tsx`); die übrigen Reiter `bp_verkehr_rsto`, `_asphalt`, `_pruefung`, `_tunnel` sind seit 29.10. freigegeben.

Komponente `src/modules/BpVerkehrswegebau.tsx`; Inhalt `content/bpverkehrswegebau/BahnbauTab.json`, `content/bpverkehrswegebau/BetondeckenTab.json`, `content/bpverkehrswegebau/BindemittelTab.json`, `content/bpverkehrswegebau/BpVerkehrswegebau.json`, `content/bpverkehrswegebau/PrueftechnikTab.json`, `content/bpverkehrswegebau/RstoRechnerTab.json`, `content/bpverkehrswegebau/TiefbauTab.json`, `content/bpverkehrswegebau/TunnelbauTab.json`, `content/bpverkehrswegebau/VergleichTab.json`, `content/bpverkehrswegebau/daten.json`.

## Rechenkerne und Testabdeckung

Kein eigener Rechenkern in diesem Reiter (`BindemittelTab`).

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| Faktenstichprobe T7 | Penetration 25 °C/100 g/5 s in 0,1 mm; Erweichungspunkte 50/70 und 70/100 | ohne Befund | T7 (`module-tranche-7.md`) (Nr. 15) |
| T7-BT-1 | PSV-Anforderung Autobahndeckschichten ≥ 51 oder ≥ 54 (auch Kurzfassung, Quiz `qn_bp_verkehr_bitumen_6`) | offen (Normtext) | T7 (`module-tranche-7.md`), Umsetzung 29.10. |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Für die Freigabe gelten sie als erledigt (Regel vom 02.11.2026, Entscheidung vom 04.11.2026); sie bleiben im Prüfbogen Normtext, Reiter „Nach Normen (04.11.)“, offen. Kennungen nach dem Prüfbogen bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens (28.10.2026).

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| T7-BT-1a | TL Gestein-StB 04/23 (Anhang) mit ZTV Asphalt-StB 26, PSV-Kategorien und Zuordnung zu Belastungsklassen | PSV-Anforderung für Autobahndeckschichten | „Autobahndeckschichten zwingend: PSV-Wert ≥ 51 oder ≥ 54“ – `content/bpverkehrswegebau/BindemittelTab.json:12`; Kurzfassung `src/data/kurzfassung.ts:20`; Quiz `qn_bp_verkehr_bitumen_6` `src/data/quiz.json:33195` |

## Quizfragen

6 Fragen, alle freigegeben.

## Quellen

DIN EN 12591, DIN EN 1426, DIN EN 1427, TL Gestein-StB 04/23, ZTV Asphalt-StB 26 (Normtexte nicht öffentlich); Herstellerdatenblätter LOTOS (Erweichungspunkte). Befundliste Tranche 7, Nr. 15.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Nadelpenetration bei 25 °C, 100 g, 5 s, Angabe in 0,1 mm (DIN EN 1426).
2. Erweichungspunkt Ring und Kugel: 50/70 46–54 °C, 70/100 43–51 °C → Modul „ca. 43 bis 54 °C“.
3. PSV-Anforderung „Autobahndeckschichten: PSV-Wert ≥ 51 oder ≥ 54“ (`content/bpverkehrswegebau/BindemittelTab.json:12`) gegen TL Gestein-StB 04/23, Anhang, prüfen (T7-BT-1a; betrifft auch Kurzfassung und Quiz).
4. Kurzfassung des Reiters und Quiz `qn_bp_verkehr_bitumen_6` nennen dieselben PSV-Werte wie der Text (T7-BT-1a, eine Klärung für alle drei Stellen).
5. RStO-Profile im Reiter `bp_verkehr_rsto`: PSV ≥ 51/48/45 (T7-BT-1b, dort nicht blockierend) zusammen mit T7-BT-1a lesen.

## Empfehlung

**freigabereif.** Faktenstichprobe ohne Befund; offen sind nur die PSV-Kategorien nach TL Gestein-StB. Die Normpunkte sind in der App gekennzeichnet und gelten nach der Regel vom 02.11.2026 als erledigt.

Bisher „freigabereif nach Klärung von T7-BT-1a“. Die offenen Normpunkte (von T7-BT-1a) sind in der App als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und gelten nach der Regel vom 02.11.2026 (Entscheidung vom 04.11.2026) für die Freigabe als erledigt. Sie bleiben im Prüfbogen Normtext offen; nach der Normprüfung wird der Wert angepasst.
