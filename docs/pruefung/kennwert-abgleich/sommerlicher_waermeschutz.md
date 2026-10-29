# Kennwert-Abgleich: `sommerlicher_waermeschutz`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `sommerlicher_waermeschutz` (Bauphysik, geprueft)
- **Komponente:** `src/modules/SommerlicherWaermeschutz.tsx`
- **Dateien (2):** `content/sommerlicherwaermeschutz/SommerlicherWaermeschutz.json`, `src/modules/SommerlicherWaermeschutz.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 0 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 24 / 11 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 4108-2 | – | Abschn. 4.3 | 5 |  |
| DIN 4108-2 | 2013-02 | Abschn. 8, Tab. 7, Tab. 8 | 14 | Ausgaben uneinheitlich; Registry 2026-05 |
| DIN 4108-2 | 2026-05 | – | 3 | Ausgaben uneinheitlich |
| EN 14501 | – | – | 1 |  |
| EN ISO 52022 | – | – | 1 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 4108-2:** 2013-02 (25×, teils mit Hinweis auf andere Ausgabe), 2026-05 (10×, teils mit Hinweis auf andere Ausgabe)
  - 2013-02 (mit Hinweis): `content/sommerlicherwaermeschutz/SommerlicherWaermeschutz.json › texte.sonneneintragskennwertVerfahrenNachDin` – Sonneneintragskennwert-Verfahren nach DIN 4108-2:2013-02, Abschnitt 8 – Anforderung nach § 14 GM…
  - 2013-02 (mit Hinweis): `content/sommerlicherwaermeschutz/SommerlicherWaermeschutz.json › texte.ausreichendIstDerSommerliche` – …erliche Wärmeschutz nach **§ 14 Abs. 2**, wenn die Anforderungen nach DIN 4108-2:2013-02, Abschnitt 8, eingehalten sind: Der nac…
  - 2013-02 (mit Hinweis): `content/sommerlicherwaermeschutz/SommerlicherWaermeschutz.json › texte.normenstand14GmodgVerweist` – **Normenstand:** § 14 GModG verweist ausdrücklich auf DIN 4108-2:2013-02. Die Neuausgabe DIN 4108-2:2026-05 (Tit…
  - 2026-05 (mit Hinweis): `content/sommerlicherwaermeschutz/SommerlicherWaermeschutz.json › texte.normenstand14GmodgVerweist` – …14 GModG verweist ausdrücklich auf DIN 4108-2:2013-02. Die Neuausgabe DIN 4108-2:2026-05 (Titel „Wärmeschutz – Anforderungen, Be…
  - 2013-02: `content/sommerlicherwaermeschutz/SommerlicherWaermeschutz.json › texte.wiedergabeNachKalksandsteinPlanungshandb` – …und TR Sonnenschutz des BVRS (Tabelle 3); maßgebend ist der Normtext DIN 4108-2:2013-02, Tab. 8.
  - 2013-02: `content/sommerlicherwaermeschutz/SommerlicherWaermeschutz.json › werte.din410822013` – DIN 4108-2:2013-02, 8.3, Tab. 7 und 8; § 14 GModG
  - 2013-02: `content/sommerlicherwaermeschutz/SommerlicherWaermeschutz.json › werte.din4108220132` – DIN 4108-2:2013-02, Tab. 7 und 8; Rechengang nach TR Sonne…
  - 2013-02: `content/sommerlicherwaermeschutz/SommerlicherWaermeschutz.json › werte.din4108220133` – DIN 4108-2:2013-02, 8.2.2, Tab. 6 bis 8
  - 2026-05: `content/sommerlicherwaermeschutz/SommerlicherWaermeschutz.json › werte.oktober2026Ap3` – …tellt; Tabellenwerte gegen zwei Sekundärquellen geprüft, Abgleich mit DIN 4108-2:2026-05 und)
  - 2026-05: `content/sommerlicherwaermeschutz/SommerlicherWaermeschutz.json › daten.SommerlicherWaermeschutz.regelwerke.0.title` – DIN 4108-2:2026-05 (Wärmeschutz und Energie-Einsparung in…
  - 2013-02 (mit Hinweis): `content/sommerlicherwaermeschutz/SommerlicherWaermeschutz.json › daten.SommerlicherWaermeschutz.regelwerke.1.title` – DIN 4108-2:2013-02 (Vorgängerausgabe „Mindestanforderungen…
  - 2013-02: `content/sommerlicherwaermeschutz/SommerlicherWaermeschutz.json › daten.SommerlicherWaermeschutz.formeln.0.quelle` – DIN 4108-2:2013-02, 8.3.2
  - 2013-02: `content/sommerlicherwaermeschutz/SommerlicherWaermeschutz.json › daten.SommerlicherWaermeschutz.formeln.1.quelle` – DIN 4108-2:2013-02, Tab. 7
  - 2013-02: `content/sommerlicherwaermeschutz/SommerlicherWaermeschutz.json › daten.SommerlicherWaermeschutz.formeln.2.quelle` – DIN 4108-2:2013-02, 8.3.3, Tab. 8
  - 2013-02: `src/data/quiz.json › qn_sommerlicher_waermeschutz_1` – Welche Größe vergleicht das vereinfachte Nachweisverfahren nach DIN 4108-2:2013-02 mit dem zulässigen Wert S_zul? Den So…
  - 2013-02: `src/data/quiz.json › qn_sommerlicher_waermeschutz_5` – Welcher Bezugswert der Innentemperatur ist nach DIN 4108-2:2013-02 der Sommerklimaregion C zugeordnet? 2…
  - 2013-02: `src/data/quiz.json › qn_sommerlicher_waermeschutz_8` – Wie wirken Dachflächenfenster mit 30° Neigung im Verfahren nach DIN 4108-2:2013-02? Sie verringern S_zul über den Kennwe…

### Abweichend von der Normen-Registry (ohne Hinweis auf andere Ausgabe)

- DIN 4108-2:2013-02 (Registry 2026-05): `content/sommerlicherwaermeschutz/SommerlicherWaermeschutz.json › texte.wiedergabeNachKalksandsteinPlanungshandb` – …und TR Sonnenschutz des BVRS (Tabelle 3); maßgebend ist der Normtext DIN 4108-2:2013-02, Tab. 8.
- DIN 4108-2:2013-02 (Registry 2026-05): `content/sommerlicherwaermeschutz/SommerlicherWaermeschutz.json › werte.din410822013` – DIN 4108-2:2013-02, 8.3, Tab. 7 und 8; § 14 GModG
- DIN 4108-2:2013-02 (Registry 2026-05): `content/sommerlicherwaermeschutz/SommerlicherWaermeschutz.json › werte.din4108220132` – DIN 4108-2:2013-02, Tab. 7 und 8; Rechengang nach TR Sonne…
- DIN 4108-2:2013-02 (Registry 2026-05): `content/sommerlicherwaermeschutz/SommerlicherWaermeschutz.json › werte.din4108220133` – DIN 4108-2:2013-02, 8.2.2, Tab. 6 bis 8
- DIN 4108-2:2013-02 (Registry 2026-05): `content/sommerlicherwaermeschutz/SommerlicherWaermeschutz.json › daten.SommerlicherWaermeschutz.formeln.0.quelle` – DIN 4108-2:2013-02, 8.3.2
- DIN 4108-2:2013-02 (Registry 2026-05): `content/sommerlicherwaermeschutz/SommerlicherWaermeschutz.json › daten.SommerlicherWaermeschutz.formeln.1.quelle` – DIN 4108-2:2013-02, Tab. 7
- DIN 4108-2:2013-02 (Registry 2026-05): `content/sommerlicherwaermeschutz/SommerlicherWaermeschutz.json › daten.SommerlicherWaermeschutz.formeln.2.quelle` – DIN 4108-2:2013-02, 8.3.3, Tab. 8
- DIN 4108-2:2013-02 (Registry 2026-05): `src/data/quiz.json › qn_sommerlicher_waermeschutz_1` – Welche Größe vergleicht das vereinfachte Nachweisverfahren nach DIN 4108-2:2013-02 mit dem zulässigen Wert S_zul? Den So…
- DIN 4108-2:2013-02 (Registry 2026-05): `src/data/quiz.json › qn_sommerlicher_waermeschutz_5` – Welcher Bezugswert der Innentemperatur ist nach DIN 4108-2:2013-02 der Sommerklimaregion C zugeordnet? 2…
- DIN 4108-2:2013-02 (Registry 2026-05): `src/data/quiz.json › qn_sommerlicher_waermeschutz_8` – Wie wirken Dachflächenfenster mit 30° Neigung im Verfahren nach DIN 4108-2:2013-02? Sie verringern S_zul über den Kennwe…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

