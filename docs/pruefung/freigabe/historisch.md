# Freigabepaket: Historische Materialkennwerte (`historisch`)

Stand 04.11.2026 · Gruppe „Bauen im Bestand“ · Typ `database` · Prüfvermerk „geprüft“ vom 29.10.2026; Inhalt seitdem wesentlich geändert (siehe Abschnitt „Änderungen seit dem Prüfdatum“).

**Empfehlung: nicht freigabereif** – Der neue Reiter Bohrkernserie (#318) ist nach der Freigabe dazugekommen, ohne unabhängige Modulprüfung, und stützt fast alle Werte auf Sekundärquellen; dazu sieben neue Normpunkte zu DIN EN 13791.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Kennwerte historischer Baustoffe für Bauen im Bestand (Termin 9): Datenbank (Puddel- und Flussstahl, alte Betongüten B/Bn/Bk mit Zuordnung zu C-Klassen, Mauerziegel, Holzgüten), Labor-Rechner (charakteristischer Wert aus Stichprobe nach DIN EN 1990 Anhang D, f_k Mauerwerk), statische Nachweise im Bestand (DBV-Merkblatt, EN 1990-2:2026) und seit 02.11.2026 die Auswertung einer Bohrkernserie nach DIN EN 13791:2020-02.

Bedeutung für die Lehre: Lehrveranstaltung (Vertiefung, Wahlpflicht, Master, Weiterbildung); Lernpfade: Bauen im Bestand.

## Reiter und Bereiche

Reiter laut Komponente: Historische Materialdatenbank (`datenbank`) · Rechner & Laborprüfungen (`rechner_labor`) · Bohrkernserie (DIN EN 13791) (`bohrkernserie`) · Statische Nachweise im Bestand (DBV & EN 1990-2:2026) (`nachweis_bestand`).

Komponente `src/modules/HistorischeMaterialkennwerte.tsx`; Inhalt `content/historischematerialkennwerte/BohrkernserieTab.json`, `content/historischematerialkennwerte/DatenbankTab.json`, `content/historischematerialkennwerte/HistorischeMaterialkennwerte.json`, `content/historischematerialkennwerte/NachweisBestandTab.json`, `content/historischematerialkennwerte/RechnerLaborTab.json`.

## Rechenkerne und Testabdeckung

| Kern | Tests (Zahl der Prüfungen) | Referenzwerte |
|---|---|---|
| `src/calc/bohrkernserie13791.ts` | `tests/hist13791.test.ts` (51) | Beispiel 1 (B 225, 10 Kerne): f_m = 18,65, s = 1,96, k_10 = 1,92 → f_ck,is = 14,9 N/mm² → C16/20; Beispiel 2 (B 300, 8 Kerne h/d = 1): s_min = 2,31 → 24,2 N/mm² → C20/25 |
| `src/calc/bauwerksuntersuchung.ts` | `tests/bauwerksuntersuchung.test.ts` (38), `tests/durchsichtA.test.ts` (49), `tests/hist13791.test.ts` (51), `tests/karsten.test.ts` (10), `tests/keinErgebnisAnzeige.test.ts` (1), `tests/lebensdauerUebergabe.test.ts` (35) und 6 weitere | Statistik n ≥ 8 über `insituDruckfestigkeit13791`, k_n/M aus `kn13791`/`margin13791` (geprüft in Tranche 12) |

Datenbank, Labor-Rechner und Nachweis rechnen über `src/utils/bestandKern.ts` (`designLognormal`, `charValue`, `fkMasonry`), in Tranche 12 nachgerechnet (`tests/modulpruefungTranche12.test.ts`: 23 Bezeichnungen der Tab. 2.2, Beispiel 1 mit 10,94/12,15 N/mm²). Der neue Reiter Bohrkernserie hat `tests/hist13791.test.ts` (51 Prüfungen: beide Lehrbeispiele von Hand, 60 Zufallsserien gleich `insituDruckfestigkeit13791`, Grenzfälle). Eigene Nachrechnung für dieses Paket: beide Lehrbeispiele stimmen.

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T12 Nr. 7 | Modulprüfung der drei alten Reiter: Tab. D.1/D.2 richtig, Beispiele richtig; Hinweise δ = 0,82, „St 52-3/St 70-2“ unscharf | freigegeben 29.10. | T12 (`module-tranche-12.md`) |
| γ_c = 1,35 | Quelle des Bestandswerts → DBV-Merkblatt „Modifizierte Teilsicherheitsbeiwerte“ (03/2013) | erledigt (umgesetzt) (#248) | T12 (`module-tranche-12.md`), Umsetzung 29.10. |
| Bn-Zuordnung | Betonklassen 1972–2001 nach Schnell/Fischer/Loch 2008, Tab. 2.2; Bn 250 → C16/20 (vorher C20/25) | erledigt (umgesetzt) (29.10.) | T12 (`module-tranche-12.md`), Nachtrag 29.10. |
| NP2-HI-1 | Formbeiwert d als lineare h/w-Näherung, Beispiel (0,82) und Rechner (0,75) widersprechen sich → als Näherung gekennzeichnet | gekennzeichnet; Frage offen (Tab. A.1 der DIN EN 772-1 übernehmen) | `nachpruefung2-2026-10-29.md` |
| EK-5 | γ = 1,0/1,5 als Literale, f_k Mauerwerk nach EN-Formel K = 0,55 statt NA-Tafeln | offen (notiert) | `ec-kennwerte-2026-11-02.md` |
| Hinweis HK | Labor-Reiter wertet Stichproben nach DIN EN 1990 Anhang D aus und teilt durch 0,85 – andere Methode als DIN EN 13791; ob sie bleiben soll, ist Teil der Prüfung | offen (Entscheidung) | `hist-kennwerte-13791-2026-11-02.md`, „Hinweise“ |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Kennungen nach dem Prüfbogen Normtext (Stand 28.10.2026) bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens.

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| T12-F-4 | DIN 105:1957 | Farbkennzeichnung und zulässige Spannungen (weißer Balken 250 / 2,4 MPa; grüner Balken 150 / 1,4 MPa) | `src/data/historicalMaterialsData.ts:148` (laut Prüfbogen nicht blockierend) |
| T15-BS-5 / NS-BD-2 | DIN EN 13791:2020-02, 8.1 | Mindeststandardabweichung s ≥ 0,08·f_m(n),is; in DE durch A20 geändert? | Reiter Bohrkernserie: schaltbar, standardmäßig an; entscheidet in Beispiel 2 über eine Klasse |
| NS-BD-3 | DIN EN 13791:2020-02, Abschn. 5/6 | Kerne h/d = 1: Faktor 0,82 auf h/d = 2 oder Würfelbezug? | Schalter mit drei Lesarten |
| HK-13791-1 | DIN EN 13791:2020-02, Tab. 7 | Zuschlag M nach f_is,lowest (≥ 20: 4; 16–20: 3; 12–16: 2; < 12: 1) | Kern `margin13791` |
| HK-13791-2 | DIN EN 13791:2020-02, Tab. 1 | Mindestwerte f_ck,is je Klasse: exakt 0,85·f_ck oder gerundete Tabellenwerte? | exakt 0,85·f_ck |
| HK-13791-3 | DIN EN 13791/A20:2022-04, NA.8.1, NA.8.3 | Nationale Regeln für < 8 bzw. < 12 Kerne, Abweichungen zu 8.3 | nicht abgebildet, Warnhinweis |
| HK-13791-4 | DIN EN 13791:2020-02, 8.1(7), 8.3 | Volumengrenzen 10/30 m³, 1–3 Bauteile, Spannweite ≤ 15 % | `VOLUMEN_MAX`, `SPANNWEITE_MAX_KLEIN` in `src/calc/bohrkernserie13791.ts` |
| HK-13791-5 | DIN EN 13791:2020-02, 8.2 | Mindestzahl der Wertepaare indirekt ↔ Kern | nur Text |
| HK-13791-6 | DIN EN 12504-1:2021-02 | Ø ≥ 3·D_max, Ø ≥ 50 mm, Toleranzen h/d | Warnung bzw. Fehler im Rechner |

## Quizfragen

10 Fragen, davon 4 nicht freigegeben: `qt_hk13791_1`, `qt_hk13791_2`, `qt_hk13791_3`, `qt_hk13791_4`.
 Die vier neuen Fragen `qt_hk13791_1` bis `_4` stützen sich auf Sekundärquellen (Vorprüfung „fraglich“).

## Änderungen seit dem Prüfdatum

Seit der Freigabe vom 29.10.2026 im Modul geändert (git log über Komponente, Inhalt und Kerne): **#318** (03.11., über #321 eingemergt) neuer Reiter „Bohrkernserie (DIN EN 13791)“ mit Rechenkern `src/calc/bohrkernserie13791.ts` (185 Zeilen), Komponente `src/modules/historischematerialkennwerte/BohrkernserieTab.tsx` (290 Zeilen), Inhalt `BohrkernserieTab.json`, neuem Lernziel 5 und vier Quizfragen; `klasseAusInsitu13791` aus `bauwerksuntersuchung.ts` ausgelagert (Verhalten unverändert). Kleinere Änderungen: #312 (Anzeige „–“ statt NaN), #305 (Grenzfälle), #282 (Durchsicht A), #277 (Nachprüfung 2). Der PR selbst sagt: „Das Modul ist danach neu fachlich zu prüfen.“ (`docs/pruefung/hist-kennwerte-13791-2026-11-02.md`).

## Quellen

DIN EN 1990 Anhang D, DIN EN 13791:2020-02 mit A20:2022-04, DIN EN 12504-1:2021-02, DIN EN 12390-3, DIN EN 772-1, DIN 105:1957; DBV-Merkblatt „Modifizierte Teilsicherheitsbeiwerte für Stahlbetonbauteile“ (03/2013); Schnell/Fischer/Loch, Kurzbericht BBR 2008, Tab. 2.1/2.2; für die Bohrkernserie nur Sekundärquellen (BRMCA Draft Guide 2020, TFB-Bulletin 1/2021, Sefrin et al. 2022), Liste je Wert in `docs/pruefung/hist-kennwerte-13791-2026-11-02.md`.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Bohrkernserie Beispiel 1 (Decke 1963, „B 225“): 10 Kerne, f_m(n),is = 18,65, s = 1,96 N/mm² (V = 10,5 % > 8 %), k_10 = 1,92 → 18,65 − 1,92·1,96 = 14,88; f_is,lowest + M = 15,9 + 2 = 17,9 → f_ck,is = 14,9 ≥ 0,85·16 = 13,6 → C16/20 (`content/historischematerialkennwerte/BohrkernserieTab.json:157`).
2. Beispiel 2 (Unterzüge 1968, „B 300“): 8 Kerne h/d = 1, s = 0,88 < s_min = 0,08·28,81 = 2,31 → Würfelbezug 28,81 − 2,00·2,31 = 24,2 ≥ 21,25 → C20/25; ohne Untergrenze C25/30. Entscheiden: Gilt s ≥ 0,08·f_m in Deutschland (T15-BS-5)?
3. Mindestanzahl: 8 Kerne bei Ø ≥ 75 mm, 12 Kerne bei 50 ≤ Ø < 75 mm (`src/calc/bohrkernserie13791.ts:52`); kleiner Prüfbereich ≤ 10 m³ mit ≥ 3 Kernen, Ansatz B ≤ 30 m³.
4. Zuschlag M = 4/3/2/1 für f_is,lowest ≥ 20/16/12/< 12 N/mm² und Zuordnung f_ck,is ≥ 0,85·f_ck (HK-13791-1/-2).
5. Datenbank: Bn 250 → f_ck = 19,3 N/mm², C16/20; f_cd = 0,85·19,3/1,50 = 10,94, mit γ_c = 1,35 (DBV) 12,15 N/mm².
6. Labor-Rechner: 22/25/27/24/26 N/mm² lognormal → X_k = 20,58 (V unbekannt, k_n = 2,33) bzw. 20,67 (V = 0,10 bekannt, k_n = 1,80). Entscheiden: Soll diese Auswertung nach DIN EN 1990 Anhang D neben dem Reiter Bohrkernserie bleiben?
7. Ziegelwand 1920: f_b = 12,3, f_m = 2,5 → f_k = 4,19, f_d = 2,37 N/mm²; Formbeiwert d als Näherung gekennzeichnet (NP2-HI-1).

## Empfehlung

**nicht freigabereif.** Die drei bisherigen Reiter sind geprüft und unverändert richtig. Der neue Reiter rechnet in sich richtig (Test mit 60 Zufallsserien, beide Lehrbeispiele nachgerechnet), aber Mindeststandardabweichung, Kernschlankheit, Zuschlag M, Zuordnungsregel und die Volumengrenzen sind nur über Sekundärquellen belegt und als vorläufig gekennzeichnet. Vorschlag zur Entscheidung: den Prüfvermerk auf „Nachprüfung erforderlich“ (`re-review`) mit diesen offenen Punkten umstellen, bis der Normtext DIN EN 13791:2020-02 mit A20:2022-04 vorliegt; danach mit den Prüfschritten 1–4 freigeben. Die Frage aus HK „Hinweise“ (Stichprobe nach DIN EN 1990 Anhang D im Labor-Reiter) ist eine didaktische Entscheidung.
