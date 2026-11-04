# Freigabepaket: Ausblick: neue Normengeneration (Beton und Eurocodes) (`normen_ausblick`)

Stand 04.11.2026 · Gruppe „Grundlagen“ · Typ `standard` · Prüfvermerk „geprüft“ vom 29.10.2026; Inhalt seitdem wesentlich geändert (siehe Abschnitt „Änderungen seit dem Prüfdatum“).

**Empfehlung: freigabereif** – Der neue Abschnitt ist reiner Stand-Text mit Belegen je Eintrag; er ändert keine Rechnung. Kurz gegenlesen (Prüfschritte 1–2), dann kann der Prüfvermerk bleiben.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Ausblick auf die neue Normengeneration: DIN EN 206-1/-2:2026 mit CO₂-Klassen, Expositionswiderstandsklassen XRC/XRDS nach EN 1992-1-1:2023, Zeitplan und Stand der Eurocodes der 2. Generation in Deutschland; seit 02.11.2026 mit Normenstand November 2026, Entwürfen und Normungsprojekten.

Bedeutung für die Lehre: Ergänzung und Nachschlagen; in keinem Lernpfad zugeordnet.

## Reiter und Bereiche

Reiter laut Komponente: Warum neu? (`warum`) · DIN EN 206-1/-2:2026 (`beton`) · Expositionswiderstand (ERC) (`erc`) · Eurocodes 2. Generation (`eurocodes`) · Was gilt wann? (`stand`).

Komponente `src/modules/NormenAusblick.tsx`; Inhalt `content/normenausblick/NormenAusblick.json`.

## Rechenkerne und Testabdeckung

Kein Rechenkern; das Beispiel x_c,50 = XRC·√50 (XRC 3 → 21 mm) ist in Nachstichprobe 5c nachgerechnet.

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T15 Nr. 12 | Faktenstichprobe DIN EN 206-1:2026-07, XRC/XRDS, Einführung 1. Generation | freigegeben 29.10. | T15 (`module-tranche-15.md`) |
| DSC-NA-1 | EC0 als EN 1990-1:2023+A1:2026, DIN EN 1990-1:2026-12 angekündigt | erledigt (behoben) | `durchsicht-C-2026-10-29.md` |
| NS5C | Ausgaben der 1. und 2. Generation, Fristen M/515, XRC-Beispiel | ohne Befund | `nachstichprobe5c-2026-11-02.md`, Nr. 54 |
| #308 | Neuer Abschnitt „Normenstand November 2026“ und Tabelle „Entwürfe und Normungsprojekte“ (DIN 1045-2/A1, E DIN EN 1992-1-1/NA1:2025-08 und /A1:2026-05, MVV TB 2026/1, E DIN EN 1995-1-1/A1:2026-10, E DIN EN 1996-1-1/A1:2026-05, E DIN EN 197-1:2026-08) | neu, noch nicht nachgeprüft | `normen-fristen-folge-2026-11-02.md`; `normausgaben-2026-11.md` |

## Offene Normpunkte

Keine.

## Quizfragen

8 Fragen, davon 1 nicht freigegeben: `qlz_normen_ausblick_1`.

## Änderungen seit dem Prüfdatum

Seit der Freigabe vom 29.10.2026: **#308** (Normen- und Fristen-Folge 02.11.) ergänzt `content/normenausblick/NormenAusblick.json` (+82 Zeilen) und `src/modules/NormenAusblick.tsx` (+36 Zeilen) um den Normenstand November 2026 (eingeführte Ausgaben nach MVV TB 2025/1, MVV TB 2026/1 als notifizierter Entwurf TRIS 2026/0349/DE) und eine Tabelle mit sieben Entwürfen und Normungsprojekten. Die Nachstichprobe 5c (#307) lag davor. Vorher nur kleinere Korrekturen aus Durchsicht C (DSC-NA-1).

## Quellen

DIN Media (Ausgaben und Entwürfe), DIN-Normungsprojekt DIN 1045-2/A1, EU-Kommission TRIS 2026/0349/DE, MVV TB 2025/1, Fachkommission Bautechnik (Einführung der Eurocodes 2010). Belege je Eintrag in `docs/pruefung/normausgaben-2026-11.md` und `docs/pruefung/normen-fristen-folge-2026-11-02.md`.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Abschnitt „Stand November 2026“: Für Bemessung und Ausführung gelten weiterhin DIN EN 206:2021-06 mit DIN 1045-2:2023-08 und die Eurocodes der 1. Generation (MVV TB 2025/1).
2. Tabelle „Entwürfe und Normungsprojekte“: DIN 1045-2/A1 (Projekt seit 13.07.2026, noch kein Entwurf), E DIN EN 1992-1-1/NA1:2025-08, E DIN EN 1992-1-1/A1:2026-05, MVV TB 2026/1 (TRIS 2026/0349/DE), E DIN EN 1995-1-1/A1:2026-10, E DIN EN 1996-1-1/A1:2026-05, E DIN EN 197-1:2026-08 (`content/normenausblick/NormenAusblick.json:224`).
3. DIN-Fassungen der 2. Generation: EC3-1-1 04/2025, EC2-1-1 09/2025, EC5-1-1 09/2026 – nicht bauaufsichtlich eingeführt.
4. XRC-Beispiel: x_c,50 = XRC·√50 → XRC 3: 21 mm, XRC 2: 14 mm.
5. Eintrag „MVV TB 2026/1 (Entwurf, notifiziert als TRIS 2026/0349/DE; Veröffentlichung ausstehend)“ und Quellenliste der Fußzeile kurz gegenlesen.

## Empfehlung

**freigabereif.** Der neue Abschnitt ist reiner Stand-Text mit Belegen je Eintrag; er ändert keine Rechnung. Kurz gegenlesen (Prüfschritte 1–2), dann kann der Prüfvermerk bleiben.
