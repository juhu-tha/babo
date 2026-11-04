# Freigabepaket: Ressourceneffizienz (REZ) (`ressourceneffizienz`)

Stand 04.11.2026 · Gruppe „Rückbau & Schadstoffe“ · Typ `calculator` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif nach Klärung von T9-GL-1a** – Nachrechnungen ohne Befund, T12-RE-1 umgesetzt; offen sind die RC-Höchstanteile nach Anhang E (derselbe Normtextpunkt wie in `grundlagen`).

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Ressourceneffizienz im Bauwesen für A.RYC (Termin 13): Bauteil-Simulator (Beton mit rezyklierter Gesteinskörnung, CO₂ und Massen), Kosten-Nutzen-Rechner, R-Strategien und Kreislaufkennzahl MCI, regionale Akteursnetzwerke.

Bedeutung für die Lehre: Lehrveranstaltung (Vertiefung, Wahlpflicht, Master, Weiterbildung); Lernpfade: A.RYC.

## Reiter und Bereiche

Bauteil-Simulator, Kosten-Nutzen-Rechner (ROI), R-Strategien, Netzwerk; zwei Rechenbeispiele.

Komponente `src/modules/Ressourceneffizienz.tsx`; Inhalt `content/ressourceneffizienz/Ressourceneffizienz.json`.

## Rechenkerne und Testabdeckung

| Kern | Tests (Zahl der Prüfungen) | Referenzwerte |
|---|---|---|
| `src/calc/rcGesteinskoernung.ts` | `tests/modulpruefungTranche12.test.ts` (51), `tests/modulpruefungTranche9.test.ts` (38) | Standardplatte 120 m³, Typ 1, X0–XC4: 45 Vol.-% der groben Gesteinskörnung bei 70 % Grobanteil = 31,5 % der Gesteinskörnung |

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T12-RE-1 | RC-Anteil pauschal 50 % → Höchstanteil nach DIN 1045-2, Anhang E, je Typ und Expositionsgruppe (Kern `rcGesteinskoernung.ts`) | erledigt (umgesetzt, als vorläufig gekennzeichnet) | T12 (`module-tranche-12.md`) (Nr. 17), Umsetzung 29.10. |
| Nachrechnung T12 | MCI = 1 − 0,50·0,9 = 0,55; Beispiel 2: 2 500·1,85·0,35 = 1 619 t, 65 Lkw-Fahrten | ohne Befund | T12 (`module-tranche-12.md`) |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Kennungen nach dem Prüfbogen Normtext (Stand 28.10.2026) bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens.

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| T9-GL-1a (Nr. 19) | DIN 1045-2:2023-08, Anhang E | Höchstanteile rezyklierter Gesteinskörnung Typ 1/Typ 2 je Expositionsklasse | `src/calc/rcGesteinskoernung.ts:13`: X0–XC4, XF1, XF3 45/35; XA1 25/25; XD1/XD2/XS1/XS2/XF2/XF4 30/20 Vol.-% der groben Gesteinskörnung; nicht in XA2, XA3, XM |

## Quizfragen

7 Fragen, davon 1 nicht freigegeben: `qlz_ressourceneffizienz_1`.

## Quellen

DIN 1045-2:2023-08, Anhang E (Normtext nicht öffentlich); Ellen MacArthur Foundation (MCI); Lehrwerte für CO₂-Faktoren wie im Modul gekennzeichnet. Befundliste Tranche 12, Nr. 17. Prüfbogen: Nr. 19 (wie T9-GL-1a), Modul dort noch nicht genannt.

## Prüfschritte für die Freigabe (ca. 15 min)

1. MCI-Beispiel: Kreislaufanteil 50 %, Ausbringung 0,9 → MCI = 1 − 0,50·0,9 = 0,55; bei Nutzungsfaktor X = 2: 0,78.
2. Beispiel 2: 2 500 m³·1,85 t/m³·0,35 = 1 619 t RC-Material, 65 Lkw-Fahrten, Anteil 35 %.
3. Bauteil-Simulator, Standardplatte 120 m³ (CEM I 310 kg/m³, Stahl 110 kg/m³ · 1,3 kg/kg, 65 km · 0,08 kg/tkm): CO₂ = 37,2 + 17,2 + 1,5 = 55,9 t CO₂-Äq.
4. RC-Anteil im Simulator: Typ 1, X0–XC4 → 45 Vol.-% der groben Gesteinskörnung = 31,5 % der gesamten Gesteinskörnung; XA2/XA3/XM → nicht zulässig (`src/calc/rcGesteinskoernung.ts:13`).
5. Quizfrage `qlz_ressourceneffizienz_1` (nicht freigegeben) gegen den Simulator lesen.

## Empfehlung

**freigabereif nach Klärung von T9-GL-1a.** Nachrechnungen ohne Befund, T12-RE-1 umgesetzt; offen sind die RC-Höchstanteile nach Anhang E (derselbe Normtextpunkt wie in `grundlagen`).

Nach der Regel der Freigabe vom 02.11.2026 (Tranche 16: im Modul gekennzeichnete Normtextpunkte gelten als erledigt) wäre das Modul schon jetzt freigabereif; nach der Regel vom 28.10.2026 (Normtextpunkte blockieren) erst nach dem Normtextabgleich. Siehe `README.md`, Abschnitt „Zu entscheiden“.
