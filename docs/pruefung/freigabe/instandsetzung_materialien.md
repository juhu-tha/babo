# Freigabepaket: Instandsetzung nach Material (`instandsetzung_materialien`)

Stand 04.11.2026 · Gruppe „Schutz & Instandsetzung“ · Typ `standard` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif** – Vier Fehler behoben, Beispiele richtig; offen ist nur die Abtragshöhe über der Schadensgrenze (Widerspruch zu `wta`). Die Normpunkte sind in der App gekennzeichnet und gelten nach der Regel vom 02.11.2026 als erledigt.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Werkstoffspezifischer Schutz und Instandsetzung: Holz (DIN 68800, Dauerhaftigkeitsklassen), Metalle (Korrosionsschutz nach DIN EN ISO 12944, Duplex), Kunststoffe und Fugen, Asphalt (ZTV BEA-StB), Mauerwerk (WTA, Sanierputz).

Bedeutung für die Lehre: Ergänzung und Nachschlagen; Lernpfade: Zertifikat Ausbau und Bestand.

## Reiter und Bereiche

Fünf Reiter mit eigener Direktadresse: Holz (`instandsetzung_holz`), Metalle (`instandsetzung_metalle`), Kunststoffe (`instandsetzung_kunststoffe`), Asphalt (`instandsetzung_asphalt`), Mauerwerk (`instandsetzung_mauerwerk`).

Komponente `src/modules/InstandsetzungMaterialien.tsx`; Inhalt `content/instandsetzungmaterialien/InstandsetzungMaterialien.json`.

## Rechenkerne und Testabdeckung

Kein Rechenkern in `src/calc/`; zwei Beispiele (Schutzdauer Duplex, Restquerschnitt Holzbalken) in Tranche 13 nachgerechnet.

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T13-IM-1 | Dauerhaftigkeitsklassen nach DIN EN 350:2016 (Teak DC 1, Robinie DC 1–2, Eiche DC 2–4, Lärche DC 3–4) | erledigt (behoben) | T13 (`module-tranche-13.md`) (Nr. 7) |
| T13-IM-2 | Borsalze „Standard bei Erdkontakt (GK 4)“ – auswaschbar, nur bis GK 2 | erledigt (behoben) | T13 (`module-tranche-13.md`) |
| T13-IM-3 | Leutner-Prüfung: statischer Abscherversuch statt „dynamische Scherkraft“ | erledigt (behoben) | T13 (`module-tranche-13.md`) |
| T13-IM-4 | Lernziel „Restquerschnitt Stahlbauteil“ → Holzbalken | erledigt (behoben) | T13 (`module-tranche-13.md`) |
| T13-WTA-5 | Putzabtrag 80 cm hier, 1 m im Modul `wta` | offen (Normtext) (gekennzeichnet) | T13 (`module-tranche-13.md`) |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Für die Freigabe gelten sie als erledigt (Regel vom 02.11.2026, Entscheidung vom 04.11.2026); sie bleiben im Prüfbogen Normtext, Reiter „Nach Normen (04.11.)“, offen. Kennungen nach dem Prüfbogen bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens (28.10.2026).

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| T13-WTA-5 | WTA-Merkblatt 2-9-20/D (Sanierputzsysteme) | Putzabtrag über der Schadensgrenze: 80 cm oder 1 m? | `wta`: `content/wta/WTA.json:102`; `instandsetzung_materialien`: `content/instandsetzungmaterialien/InstandsetzungMaterialien.json:179` |

## Quizfragen

6 Fragen, alle freigegeben.

## Quellen

DIN 68800, DIN EN 350:2016, DIN EN ISO 9223 (Tab. 2), DIN EN ISO 12944, ZTV BEA-StB, WTA-Merkblatt 2-9-20/D. Befundliste Tranche 13, Nr. 7.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Beispiel 1 Duplex: t_Zn = 85 µm/4,2 µm/a = 20 a; t_Duplex = 1,5·(20 + 10) = 45 a.
2. Beispiel 2 Holzbalken: W₀ = 1 290 667 mm³, W_Rest = 601 667 mm³ → Verhältnis 0,47.
3. Dauerhaftigkeitsklassen: Teak DC 1, Robinie DC 1–2, Eiche DC 2–4, Lärche DC 3–4 (DIN EN 350:2016).
4. Sanierputz: „Altputz mindestens 80 cm über die Schadensgrenze“ (`content/instandsetzungmaterialien/InstandsetzungMaterialien.json:179`) gegen WTA 2-9 und den Wert 1 m in `wta` abgleichen (T13-WTA-5).
5. Holzschutz: Borsalze auswaschbar, nur bis GK 2; für Erdkontakt (GK 4) Kupferverbindungen (T13-IM-2).

## Empfehlung

**freigabereif.** Vier Fehler behoben, Beispiele richtig; offen ist nur die Abtragshöhe über der Schadensgrenze (Widerspruch zu `wta`). Die Normpunkte sind in der App gekennzeichnet und gelten nach der Regel vom 02.11.2026 als erledigt.

Bisher „freigabereif nach Klärung von T13-WTA-5“. Die offenen Normpunkte (von T13-WTA-5) sind in der App als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und gelten nach der Regel vom 02.11.2026 (Entscheidung vom 04.11.2026) für die Freigabe als erledigt. Sie bleiben im Prüfbogen Normtext offen; nach der Normprüfung wird der Wert angepasst.
