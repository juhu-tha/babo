# Kennwert-Abgleich: `bestand`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `bestand` (Bauen im Bestand, geprueft)
- **Komponente:** `src/modules/Bestand.tsx`
- **Dateien (2):** `content/bestand/Bestand.json`, `src/modules/Bestand.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 0 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 1 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 0 (0) |
| (3) Normverweise / Hinweise | 12 / 3 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

### GWP- und Transportwerte ohne zentrale Zuordnung (Quelle im Modul prüfen)

| Fundstelle | Wert | Ausschnitt |
|---|---|---|
| `content/bestand/Bestand.json › daten.Bestand.schritte_2.2.erklaerung` | 0,24 kg CO₂-Äq./kWh) | Bei Gas (≈ 0,24 kg CO₂-Äq./kWh) entspricht das rund 1,8 t CO₂-Äq. pro J… |

## 2 Fest verdrahtete Faktoren im Code

Keine erkannt.

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 4108-2 | 2013-02 | – | 1 | Ausgaben uneinheitlich; Registry 2026-05 |
| DIN 4108-3 | – | – | 1 |  |
| DIN 4108-3 | 2024-03 | – | 1 | Ausgaben uneinheitlich |
| EN ISO 6946 | – | – | 3 |  |
| EN ISO 6946 | 2018-03 | – | 2 |  |
| VDI 2067 | – | – | 2 |  |
| VDI 4710 | – | – | 2 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 4108-2:** 2013-02 (25×, teils mit Hinweis auf andere Ausgabe), 2026-05 (10×, teils mit Hinweis auf andere Ausgabe)
  - 2013-02: `src/data/quiz.json › q_bst_5` – …mperatur von θ_si = 11,5 °C bestimmt. Ist der Mindestwärmeschutz nach DIN 4108-2:2013-02 (f_Rsi ≥ 0,70) eingehalten? Nein, den…
- **DIN 4108-3:** 2018-10 (3×), 2024-03 (17×, teils mit Hinweis auf andere Ausgabe)
  - 2024-03 (mit Hinweis): `content/bestand/Bestand.json › daten.Bestand.regelwerke.1.title` – DIN 4108-3:2024-03 (Klimabedingter Feuchteschutz; ersetzt…

### Abweichend von der Normen-Registry (ohne Hinweis auf andere Ausgabe)

- DIN 4108-2:2013-02 (Registry 2026-05): `src/data/quiz.json › q_bst_5` – …mperatur von θ_si = 11,5 °C bestimmt. Ist der Mindestwärmeschutz nach DIN 4108-2:2013-02 (f_Rsi ≥ 0,70) eingehalten? Nein, den…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

