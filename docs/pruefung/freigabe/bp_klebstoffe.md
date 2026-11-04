# Freigabepaket: Kleb- & Dichtstoffe (`bp_klebstoffe`)

Stand 04.11.2026 · Gruppe „Bauprodukte“ · Typ `standard` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif nach Klärung von DIN 18540, Tab. 2** – Vier Fehler behoben, Beispiel richtig; offen ist die mit T8-KL-Q1 eingefügte Richtwerttabelle der DIN 18540 (derselbe Normtextpunkt wie T4-BC-2).

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Kleb- und Dichtstoffe als Bauprodukte: Silikone, Polyurethane, MS-Polymere, Acrylate; Adhäsion und Kohäsion, Normklassen (DIN EN 12004, DIN EN 204, DIN EN 15651), Fugendimensionierung nach DIN 18540 mit Rechenbeispiel.

Bedeutung für die Lehre: Ergänzung und Nachschlagen; in keinem Lernpfad zugeordnet.

## Reiter und Bereiche

Ein Modul mit Produktkatalog, Klebstoffberater, Normklassen und Rechenbeispiel Fugenbreite und -tiefe.

Komponente `src/modules/BpKlebstoffe.tsx`; Inhalt `content/bpklebstoffe/BpKlebstoffe.json`.

## Rechenkerne und Testabdeckung

Kein Rechenkern in `src/calc/`; das Fugenbeispiel ist in Tranche 8 nachgerechnet, der Klebstoffberater (`src/components/KlebstoffBerater.tsx`) nutzt α_T = 10·10⁻⁶ 1/K (Konsistenz A-6).

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T8-KL-1 bis -4 | „Dreipunfthaftung“, neutralvernetzende Silikone (nur Alkoxy setzt Alkohol frei), „Holzklebemörtel“, DIN EN 15651-4 nur Fußgängerwege | erledigt (behoben) | T8 (`module-tranche-8.md`) (Nr. 6) |
| A-6 | Wärmedehnzahl Beton im Berater 12 → 10·10⁻⁶ 1/K wie Beispiel und `betonkennwerte` | erledigt (behoben) | `konsistenz-2026-10-29.md` |
| T8-KL-Q1 | Lernziel Fugentiefe/Hinterfüllschnur → Schritt 4 im Beispiel mit Richtwerttabelle DIN 18540, Tab. 2 (b = 10/15/20/25/30 → t = 8/10/12/15/15 mm), vorläufig | erledigt (umgesetzt, als vorläufig gekennzeichnet) | T8 (`module-tranche-8.md`), Umsetzung 29.10. |
| Hinweis 04.11. | Für b = 20 mm nennt die Tabelle t = 12 ± 2 mm, die Faustregel b : t ≈ 2 : 1 in `bauchemie` und `schadensbilder` 10 mm (am unteren Rand) – beim Normtextabgleich beide Stellen zusammen ansehen | Hinweis | dieses Paket |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Kennungen nach dem Prüfbogen Normtext (Stand 28.10.2026) bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens.

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| T4-BC-2 (Nr. 2, Ergänzung) | DIN 18540, Tab. 2 (Fugentiefe je Fugenbreite) | Richtwerte b = 10/15/20/25/30 mm → t = 8/10/12/15/15 mm und Grenzabmaße | `content/bpklebstoffe/BpKlebstoffe.json:148` |

## Quizfragen

6 Fragen, alle freigegeben.

## Quellen

DIN 18540, DIN EN 12004, DIN EN 204, DIN EN 15651-1/-3/-4, DIN EN 1504-4, IVD-Merkblätter. Befundliste Tranche 8, Nr. 6. Die Tabelle steht noch nicht im Prüfbogen (Ergänzung bei Nr. 2 vorgeschlagen).

## Prüfschritte für die Freigabe (ca. 15 min)

1. Fugenbreite: Fertigteil 6 m, α = 10·10⁻⁶ 1/K, ΔT = 80 K, ZGV 25 % → Δl = 4,8 mm, b = 4,8/0,25 = 19,2 → 20 mm.
2. Variante 3,5 m → 11,2 mm; ZGV 20 % → 24 mm.
3. Fugentiefe (Schritt 4): b = 20 mm → t = 12 ± 2 mm, Rundschnur ≈ 1,25·b = 25 mm; Tabelle DIN 18540, Tab. 2 am Normtext bestätigen.
4. Normklassen: C2 ≥ 1,0 N/mm², S1 2,5–5 mm (DIN EN 12004), D3/D4 (DIN EN 204), DIN EN 15651-4 Typ PW nur für Fußgängerwege.
5. Faustregel und Tabelle zusammen ansehen: b = 20 mm → Tabelle t = 12 ± 2 mm, Faustregel b : t ≈ 2 : 1 (10 mm) in `bauchemie`/`schadensbilder` – eine einheitliche Aussage festlegen.

## Empfehlung

**freigabereif nach Klärung von DIN 18540, Tab. 2.** Vier Fehler behoben, Beispiel richtig; offen ist die mit T8-KL-Q1 eingefügte Richtwerttabelle der DIN 18540 (derselbe Normtextpunkt wie T4-BC-2).

Nach der Regel der Freigabe vom 02.11.2026 (Tranche 16: im Modul gekennzeichnete Normtextpunkte gelten als erledigt) wäre das Modul schon jetzt freigabereif; nach der Regel vom 28.10.2026 (Normtextpunkte blockieren) erst nach dem Normtextabgleich. Siehe `README.md`, Abschnitt „Zu entscheiden“.
