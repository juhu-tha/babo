# Freigabepaket: Nachbehandlung & Curing (`nachbehandlung`)

Stand 04.11.2026 · Gruppe „Betontechnologie“ · Typ `standard` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif nach Klärung von T9-NB-1a bis -1d** – Kern in sechs Fällen nachgerechnet; a und b sind seit 29.10. umgesetzt und gekennzeichnet, c und d (Hochfest, Abschnittsnummer, Tabellenwerte) brauchen den Normtext DIN 1045-3.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Nachbehandlung des jungen Betons nach DIN 1045-3:2023-08: Verdunstungsrate (Menzel/ACI-Nomogramm als Formel), Mindestdauer der Nachbehandlung nach Oberflächentemperatur, Festigkeitsentwicklung und Expositionsklasse, Maßnahmen bei Kälte.

Bedeutung für die Lehre: Lehrveranstaltung (Vertiefung, Wahlpflicht, Master, Weiterbildung); in keinem Lernpfad zugeordnet.

## Reiter und Bereiche

Ein Modul mit Verdunstungsrechner, Rechner Mindestnachbehandlungsdauer (Tabelle `DIN1045_3_NACHBEHANDLUNG`) und Fachtext.

Komponente `src/modules/Nachbehandlung.tsx`; Inhalt `content/nachbehandlung/Nachbehandlung.json`.

## Rechenkerne und Testabdeckung

| Kern | Tests (Zahl der Prüfungen) | Referenzwerte |
|---|---|---|
| `src/calc/hydratation.ts` | `tests/hydratation.test.ts` (76), `tests/demosBeton.test.ts` (25), `tests/entscheidungen1029.test.ts` (12), `tests/keinErgebnisAnzeige.test.ts` (1), `tests/kleinfragenTranche1bis3.test.ts` (34), `tests/modulpruefungTranche3.test.ts` (60) und 2 weitere | Verdunstung 25/25 °C, r = 0,30, V = 25 km/h: E = 1,231 kg/(m²h) → kritisch; 10–15 °C, langsam, XC4: 7 d; 5–10 °C, sehr langsam, XM: 30 d |

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T9-NB-1a | Unter 5 °C nur „Sondermaßnahmen“ → Hinweis „Dauer um die Zeit unter 5 °C verlängern, Winterbaumaßnahmen zusätzlich“ | erledigt (umgesetzt, als vorläufig gekennzeichnet) | T9 (`module-tranche-9.md`) (Nr. 6), Umsetzung 29.10. |
| T9-NB-1b | Verdopplung nur bei XM → Auswahl XF3/XF4 mit doppelter Dauer | erledigt (umgesetzt, als vorläufig gekennzeichnet) | T9 (`module-tranche-9.md`), Umsetzung 29.10. |
| T9-NB-1c | Mindestdauer hochfester Betone ab C70/85 | offen (Normtext) | T9 (`module-tranche-9.md`) |
| T9-NB-1d | Abschnittsnummer „Abschn. 9.6“, Nachbehandlungsklasse 3, Tabellenwerte | offen (Normtext) | T9 (`module-tranche-9.md`) |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Kennungen nach dem Prüfbogen Normtext (Stand 28.10.2026) bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens.

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| T9-NB-1a | DIN 1045-3:2023-08, Nachbehandlung unter 5 °C | Verlängerung um die Zeit unter 5 °C | seit 29.10. als Hinweis umgesetzt (`src/calc/hydratation.ts:561`); keine Dauer berechnet |
| T9-NB-1b | DIN 1045-3:2023-08, Nachbehandlungsklasse 4 / 70-%-Regel | Verdopplung auch für XF3/XF4 | seit 29.10. umgesetzt, vorläufig (`src/calc/hydratation.ts:566`) |
| T9-NB-1c | DIN 1045-3:2023-08, Hochfeste Betone | Mindestdauer ab C70/85 (mindestens 1 Tag?) | Keine eigene Regel; Tabellenminimum 1 d (≥ 25 °C, schnell) – `src/data/normParams.ts:52` |
| T9-NB-1d | DIN 1045-3:2023-08, Abschnittsnummer und Tabelle Mindestdauer | Zitat „Abschn. 9.6“, Nachbehandlungsklasse 3, Tabellenwerte | Zitat – `content/nachbehandlung/Nachbehandlung.json:15`, `:35`; Tabelle (d) ≥ 25 °C 1/2/2/3, 15–25 °C 1/2/4/5, 10–15 °C 2/4/7/10, 5–10 °C 3/6/10/15, X0/XC1 0,5 – `src/data/normParams.ts:52–57` |

## Quizfragen

6 Fragen, alle freigegeben.

## Quellen

DIN 1045-3:2023-08 (Normtext nicht öffentlich; Tabellen nach der Wiedergabe von SCHWENK, Nachbehandlungsklassen 1–4 mit 35/50/70 % f_ck); Verdunstungsformel nach Menzel/Uno. Befundliste Tranche 9, Nr. 6.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Verdunstung Beispiel: Beton 25 °C, Luft 25 °C, r = 0,30, V = 25 km/h → E = 5·(43^2,5 − 0,3·43^2,5)·29·10⁻⁶ = 1,231 kg/(m²h) → kritisch (> 1,0).
2. Standard 25/25 °C, 50 %, 15 km/h → 0,576 kg/(m²h); Beton 10 °C, Luft 20 °C, 90 %, windstill → Rechenwert < 0 → E = 0.
3. Mindestdauer (Nachbehandlungsklasse 3, Tabelle in `src/data/normParams.ts`): ≥ 25 °C 1/2/2/3 d, 15–25 °C 1/2/4/5 d, 10–15 °C 2/4/7/10 d, 5–10 °C 3/6/10/15 d; X0/XC1 0,5 d – am Normtext bestätigen (T9-NB-1d).
4. Beispiel 10–15 °C, langsame Festigkeitsentwicklung, XC4 → 7 d; 5–10 °C, sehr langsam, XM → 2·15 = 30 d.
5. XF3/XF4 → doppelte Dauer mit Hinweis „vorläufig“; unter 5 °C → Hinweis Verlängerung und Winterbau (T9-NB-1a/b).
6. Zitat „DIN 1045-3:2023-08, Abschn. 9.6“ (`content/nachbehandlung/Nachbehandlung.json:15`) und eine Regel für C70/85 und höher prüfen (T9-NB-1c/d).

## Empfehlung

**freigabereif nach Klärung von T9-NB-1a bis -1d.** Kern in sechs Fällen nachgerechnet; a und b sind seit 29.10. umgesetzt und gekennzeichnet, c und d (Hochfest, Abschnittsnummer, Tabellenwerte) brauchen den Normtext DIN 1045-3.

Nach der Regel der Freigabe vom 02.11.2026 (Tranche 16: im Modul gekennzeichnete Normtextpunkte gelten als erledigt) wäre das Modul schon jetzt freigabereif; nach der Regel vom 28.10.2026 (Normtextpunkte blockieren) erst nach dem Normtextabgleich. Siehe `README.md`, Abschnitt „Zu entscheiden“.
