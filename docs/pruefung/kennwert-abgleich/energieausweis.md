# Kennwert-Abgleich: `energieausweis`

Erzeugt mit `node scripts/qa/kennwert-abgleich.mjs` (heuristische Prüfliste, kein Urteil). Ergänzung zum Prüfbogen der gezielten Durchsicht: jede gemeldete Stelle einmal gegen ihre Quelle im Modul bzw. die zentrale Konstante prüfen.

- **Modul-IDs:** `energieausweis` (Bauphysik, offen)
- **Komponente:** `src/modules/Energieausweis.tsx`
- **Dateien (2):** `content/energieausweis/Energieausweis.json`, `src/modules/Energieausweis.tsx`

| Kategorie | Anzahl |
|---|---|
| (1) Kennwerte abweichend von zentraler Konstante | 0 |
| (1) Kennwerte übereinstimmend | 8 |
| (1) GWP-/Transportwerte ohne zentrale Zuordnung | 1 |
| (2) fest verdrahtete Faktoren (davon ohne Quellkommentar) | 1 (1) |
| (3) Normverweise / Hinweise | 5 / 1 |

## 1 Kennwerte gegen zentrale Konstanten

Keine Abweichung erkannt.

Übereinstimmend (8): `FAKTOREN.*.fernwaerme.fp / FP_STROM` ×1, `FAKTOREN.*.gas_brennwert.fp / FP_STROM` ×1, `FAKTOREN.*.pellets.fp / FP_STROM` ×1, `FAKTOREN.*.strom.co2` ×2, `FAKTOREN.*.strom.fp / FP_STROM` ×3

### GWP- und Transportwerte ohne zentrale Zuordnung (Quelle im Modul prüfen)

| Fundstelle | Wert | Ausschnitt |
|---|---|---|
| `content/energieausweis/Energieausweis.json › texte.rechtsstandHinweis` | 120 g/kWh | …setzestext bestätigen). Fernwärme bis 2026 mit Lehrwerten (\$f_P\$ 0,4; 120 g/kWh), weil Anlage 4/9 nach Erzeugungsart un… |

## 2 Fest verdrahtete Faktoren im Code

Zahlliterale in Rechenausdrücken außerhalb von `src/calc/` und der zentralen Daten. „Kommentar“ = Quell- oder Einheitenhinweis in der Zeile.

| Fundstelle | Literal | Kommentar | Zeile |
|---|---|---|---|
| `src/modules/Energieausweis.tsx:59` | `250` | – | `const percentage = Math.min(100, Math.max(0, (val / 250) * 100));` |

## 3 Normverweise

| Norm | Ausgabe | Tabelle/Abschnitt/Gleichung | Anzahl | Hinweis |
|---|---|---|---|---|
| DIN 4108-2 | 2026-05 | – | 1 | Ausgaben uneinheitlich |
| DIN TS 18599-10 | – | – | 1 |  |
| DIN TS 18599 | 2025-10 | – | 3 |  |

### Uneinheitliche Ausgaben (app-weit; Fundstellen in diesem Modul)

- **DIN 4108-2:** 2013-02 (25×, teils mit Hinweis auf andere Ausgabe), 2026-05 (10×, teils mit Hinweis auf andere Ausgabe)
  - 2026-05: `content/energieausweis/Energieausweis.json › daten.Energieausweis.regelwerke.2.title` – DIN 4108-2:2026-05 (Wärmeschutz – Anforderungen, Berechnun…

## Prüfbogen (Ergänzung, Fehlerarten a–c)

- [ ] (a) Bezugsgrößen und Einstufungen in Beispielen geprüft (Würfel/Zylinder, h/d, deklarierte/funktionelle Einheit, netto/brutto, je m²/m³/t)
- [ ] (b) Normverweise in Überschriften, Karten und Tabellen: Teil, Tabelle, Ausgabe geprüft (Abschnitt 3)
- [ ] (c) abweichende Kennwerte (Abschnitt 1) geklärt: zentral übernommen, begründet abweichend oder Fehler behoben
- [ ] (c) GWP-/Transportwerte ohne Zuordnung mit Quelle belegt oder als Lehrwert gekennzeichnet
- [ ] fest verdrahtete Faktoren (Abschnitt 2) belegt, in den Kern verlegt oder als Darstellungsgröße erkannt

