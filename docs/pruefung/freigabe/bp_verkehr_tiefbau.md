# Freigabepaket: Tiefbau & Entwässerung (`bp_verkehr_tiefbau`)

Stand 04.11.2026 · Gruppe „Bauprodukte“ · Typ `calculator` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif nach Klärung von #247-1 bis #247-4** – Rechner nachgerechnet und auf DWA-A 138-1:2024-10 umgestellt; offen sind vier Faktoren bzw. Regeln am Arbeitsblatt.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Tiefbau und Entwässerung: zehn Produktbereiche (Rohre, Schächte, Drainage, Rinnen, Geokunststoffe, Kabelschutz) und Rigolenrechner nach dem vereinfachten Verfahren der DWA-A 138-1:2024-10.

Bedeutung für die Lehre: Ergänzung und Nachschlagen; in keinem Lernpfad zugeordnet.

## Reiter und Bereiche

Reiter der Komponente Verkehrswegebau (`src/modules/BpVerkehrswegebau.tsx`); die übrigen Reiter `bp_verkehr_rsto`, `_asphalt`, `_pruefung`, `_tunnel` sind seit 29.10. freigegeben.

Komponente `src/modules/BpVerkehrswegebau.tsx`; Inhalt `content/bpverkehrswegebau/BahnbauTab.json`, `content/bpverkehrswegebau/BetondeckenTab.json`, `content/bpverkehrswegebau/BindemittelTab.json`, `content/bpverkehrswegebau/BpVerkehrswegebau.json`, `content/bpverkehrswegebau/PrueftechnikTab.json`, `content/bpverkehrswegebau/RstoRechnerTab.json`, `content/bpverkehrswegebau/TiefbauTab.json`, `content/bpverkehrswegebau/TunnelbauTab.json`, `content/bpverkehrswegebau/VergleichTab.json`, `content/bpverkehrswegebau/daten.json`.

## Rechenkerne und Testabdeckung

| Kern | Tests (Zahl der Prüfungen) | Referenzwerte |
|---|---|---|
| `src/calc/verkehrswegebau.ts` | `tests/verkehrswegebau.test.ts` (30), `tests/asphalt.test.ts` (27), `tests/modulpruefungTranche7.test.ts` (38), `tests/nachstichprobe3.test.ts` (64), `tests/nachstichprobe4.test.ts` (60) | `rigole` (DWA-A 138-1): 355 m², ψ = 0,9, r = 240 l/(s·ha), 15 min, s_R = 0,95 → V_R = 8,62 m³, L = 11,97 m, 35 Boxen |

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T7-TB-1 | Ergebnisanzeige „Sicherheitsbeiwert f_S = 1,1“ → Zuschlagsfaktor f_Z | erledigt (behoben) | T7 (`module-tranche-7.md`) (Nr. 18) |
| Umstellung 28.10. | Rigole vom Lehransatz auf DWA-A 138-1:2024-10 (k_i = f_Ort·f_Methode·k_f, Seiten/Stirn h/2 bzw. h, f_Z = 1,2) | erledigt (umgesetzt, als vorläufig gekennzeichnet) | T7 (`module-tranche-7.md`), Nachtrag 28.10.; Normtext #247-1 bis -4 |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Kennungen nach dem Prüfbogen Normtext (Stand 28.10.2026) bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens.

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| #247-1 | DWA-A 138-1:2024-10, Tabelle f_Ort (Kriterien je Stufe) | Stufen und Kriterien des Standortfaktors | Auswahl 0,3 (ein einzelner Versuch) / 0,5 / 0,7 / 1,0 (gut erkundet, homogen) – `src/modules/bpverkehrswegebau/TiefbauTab.tsx:349–352`; Standard 0,5 – `:37`, `src/calc/verkehrswegebau.ts:242` |
| #247-2 | DWA-A 138-1:2024-10, Tabelle Korrekturfaktoren f_Methode | Faktor je Bestimmungsmethode, insbesondere 0,7 für Labor ungestört | Feldversuch ≥ 1 m² 1,0; kleine Testgrube 0,9; Doppelring 0,9; Open-End 0,8 (Standard); Labor ungestört 0,7; Sieblinie 0,1 – `src/calc/verkehrswegebau.ts:176–181` |
| #247-3 | DWA-A 138-1:2024-10, Versickerungsfläche der Rigole | Seiten und Stirn mit voller Höhe bei vollständiger Durchsickerung (sonst h/2) | `const hWirksam = voll ? hR : hR / 2;` – `src/calc/verkehrswegebau.ts:253` |
| #247-4 | DWA-A 138-1:2024-10, Zuschlagsfaktor f_Z | Wert von f_Z | `fZ = e.fZ ?? 1.2`, Prüfung f_Z ≥ 1 – `src/calc/verkehrswegebau.ts:242`, `:246` |

## Quizfragen

6 Fragen, davon 5 nicht freigegeben: `qn_bp_verkehr_tiefbau_2`, `qn_bp_verkehr_tiefbau_3`, `qn_bp_verkehr_tiefbau_4`, `qn_bp_verkehr_tiefbau_5`, `qn_bp_verkehr_tiefbau_6`.
 Fünf der sechs Fragen sind nach der Umstellung auf DWA-A 138-1 neu bzw. geändert und noch nicht freigegeben.

## Quellen

DWA-A 138-1:2024-10 (Normtext nicht öffentlich), DIN EN 1401-1, DIN 4095, DIN 4262-1, DIN EN 1433, DIN 4052 u. a. Befundliste Tranche 7, Nr. 18.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Rigole Standard: 355 m², ψ = 0,9, r = 240 l/(s·ha), 15 min, s_R = 0,95 → Q_zu = 7,668 l/s, V_R = 8,62 m³, L = 11,97 m, 35 Boxen.
2. 500 m², ψ = 0,7, r = 150, 30 min, Kies s_R = 0,3 → V_R = 35,24 m³, V_nutz = 10,57 m³, L = 48,95 m.
3. Standortfaktor f_Ort: Stufen 0,3/0,5/0,7/1,0, Standard 0,5 – Kriterien an der Tabelle der DWA-A 138-1 prüfen (#247-1).
4. Methodenfaktor f_Methode: Feldversuch 1,0, Testgrube 0,9, Doppelring 0,9, Open-End 0,8, Labor ungestört 0,7, Sieblinie 0,1 (#247-2).
5. Wirksame Höhe: Seiten/Stirn mit voller Höhe nur bei vollständiger Durchsickerung, sonst h/2 (`src/calc/verkehrswegebau.ts:256`); f_Z = 1,2 (#247-3/-4).

## Empfehlung

**freigabereif nach Klärung von #247-1 bis #247-4.** Rechner nachgerechnet und auf DWA-A 138-1:2024-10 umgestellt; offen sind vier Faktoren bzw. Regeln am Arbeitsblatt.

Nach der Regel der Freigabe vom 02.11.2026 (Tranche 16: im Modul gekennzeichnete Normtextpunkte gelten als erledigt) wäre das Modul schon jetzt freigabereif; nach der Regel vom 28.10.2026 (Normtextpunkte blockieren) erst nach dem Normtextabgleich. Siehe `README.md`, Abschnitt „Zu entscheiden“.
