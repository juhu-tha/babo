# Freigabepaket: Betonkorrosion & Treiben (`schadreaktionen_beton`)

Stand 04.11.2026 · Gruppe „Dauerhaftigkeit“ · Typ `standard` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif nach Klärung von T12-AS-8** – Modul und nachgeprüfte AKR-Simulation ohne offenen Fehler; offen ist nur die Benennung von E II/E III im Reiter Alkalitreiben.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Betonkorrosion und Treiben: Alkali-Kieselsäure-Reaktion (AKR) mit Gefügesimulation (Lehrmodell), Sulfattreiben und Ettringitbildung, Frost-Tausalz-Angriff und Säurekorrosion; Maßnahmen nach der DAfStb-Alkali-Richtlinie.

Bedeutung für die Lehre: Ergänzung und Nachschlagen; in keinem Lernpfad zugeordnet.

## Reiter und Bereiche

Komponente `src/modules/SchadreaktionenBeton.tsx`; Inhalt `content/schadreaktionenbeton/SchadreaktionenBeton.json`.

## Rechenkerne und Testabdeckung

| Kern | Tests (Zahl der Prüfungen) | Referenzwerte |
|---|---|---|
| `src/calc/akrGefuege.ts` | `tests/akrGefuege.test.ts` (9) | Na₂O-Äq. 1,10 M.-%, WS, 8 a, E III: p_gel = 4,66 MPa, w = 0,37 mm, ε = 0,81 mm/m → Netzrisse (Lehrmodell) |

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T12 Nr. 20 | Beispiele (Na₂O-Äq. 0,88 M.-%, S_krit = 91,7 %) und Faktenstichprobe ohne Befund | ohne Befund | T12 (`module-tranche-12.md`) |
| AKR-1 | Reiter „AKR-Gefügesimulation“ erst mit #252 sichtbar, nicht Teil der Prüfung T12 | erledigt (Nachprüfung 29.10.) | T12 (`module-tranche-12.md`), Nachprüfung 29.10. |
| T12-AS-1 bis -5, -9 | WA ergänzt, E I/E II/E III, Formelzeichen in Großschrift, NA-Grenze CEM I, Begriffe, Barrierefreiheit | erledigt (behoben) | T12 (`module-tranche-12.md`), Nachprüfung 29.10. |
| T12-AS-6 | Simulation als Lehrmodell gekennzeichnet (Schwellen, Faktoren, Zeitgesetz ohne Quelle) | gekennzeichnet | T12 (`module-tranche-12.md`) |
| T12-AS-7 | Lehrmodell kennt nur Zementalkalien → Ergebnistext „Keine AKR aus Zementalkalien (Lehrmodell)“ | gekennzeichnet | T12 (`module-tranche-12.md`) |
| T12-AS-8 | Benennung im Reiter Alkalitreiben „E II (bedenklich)“, „E III (schädlich)“ – nach Kenntnisstand „bedingt brauchbar“ bzw. „bedenklich“ | offen (Normtext) | T12 (`module-tranche-12.md`) |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Kennungen nach dem Prüfbogen Normtext (Stand 28.10.2026) bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens.

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| T12-AS-8 | DAfStb-Alkali-Richtlinie (2013-10), Teil 1 | Benennung der Alkaliempfindlichkeitsklassen E I/E II/E III | `src/modules/SchadreaktionenBeton.tsx:698` |

## Quizfragen

6 Fragen, alle freigegeben.

## Quellen

DAfStb-Alkali-Richtlinie 2013-10 (DIN Media, Ausgabenachweis), InformationsZentrum Beton, Handout „Regelwerke – Alkali-Richtlinie“ (2025), DIN 1164-10. Befundliste Tranche 12, Nr. 20, und Nachprüfung 29.10.2026 (AKR-Gefügesimulation). T12-AS-8 steht noch nicht im Prüfbogen (bei Nr. 34 ergänzen).

## Prüfschritte für die Freigabe (ca. 15 min)

1. Beispiel 1: Na₂O-Äq. = 0,25 + 0,658·0,95 = 0,88 M.-%; Alkaligehalt 3,2 kg/m³ bzw. ≤ 2,2 kg/m³ mit NA-Zement.
2. Beispiel 2: kritischer Sättigungsgrad S_krit = 1/1,09 = 91,7 %.
3. AKR-Simulation (Vorgabe): 1,10 M.-%, WS, 8 a, E III → p_gel = 4,66 MPa, w = 0,37 mm, Netzrisse; 0,60 M.-% → nicht ausgelöst; 1,60 M.-% → Deckel 13,5 MPa, w = 2,80 mm. Kennzeichnung „Lehrmodell“ sichtbar.
4. NA-Zement ≤ 0,60 M.-% für CEM I; mit NA-Zement in WA/WS „Keine AKR aus Zementalkalien (Lehrmodell)“ mit Hinweis.
5. Klassenbenennung im Reiter Alkalitreiben (`src/modules/SchadreaktionenBeton.tsx:699`) an der Alkali-Richtlinie, Teil 1, prüfen (T12-AS-8).

## Empfehlung

**freigabereif nach Klärung von T12-AS-8.** Modul und nachgeprüfte AKR-Simulation ohne offenen Fehler; offen ist nur die Benennung von E II/E III im Reiter Alkalitreiben.

Nach der Regel der Freigabe vom 02.11.2026 (Tranche 16: im Modul gekennzeichnete Normtextpunkte gelten als erledigt) wäre das Modul schon jetzt freigabereif; nach der Regel vom 28.10.2026 (Normtextpunkte blockieren) erst nach dem Normtextabgleich. Siehe `README.md`, Abschnitt „Zu entscheiden“.
