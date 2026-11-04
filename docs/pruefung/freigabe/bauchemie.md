# Freigabepaket: Bauchemie & Mineralogie (`bauchemie`)

Stand 04.11.2026 · Gruppe „Grundlagen“ · Typ `standard` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif nach Klärung von T4-BC-2** – Fünf Nachrechnungen identisch, der eine Fachfehler (T4-BC-1) ist behoben; offen ist nur die Faustregel der Fugendimensionierung am Normtext DIN 18540.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Chemische Grundlagen der Baustoffkunde (Termin 2 des Lernpfads Baustoffkunde): Bindungsarten, Silicatstrukturen, pH-Wert der Porenlösung, Hydratation und Karbonatisierung (Stöchiometrie), Säure- und Salzangriffe, Zusatzmittel, Kleben und Dichten.

Bedeutung für die Lehre: Pflichtlehre / zentrales Lehrmodul; Lernpfade: Baustoffkunde.

## Reiter und Bereiche

Reiter laut Komponente: Chemische Grundlagen (`grundlagen`) · Betonzusatzmittel (`zusatzmittel`) · Chemische Angriffe (`angriffe`) · Bauschädliche Salze (`salze`) · Oberflächenschutz (`oberflaechenschutz`) · Korrosionsschutz (`korrosionsschutz`) · Kleben & Dichten (Grundlagen) (`kleben_dichten`).

Ein Modul mit Fachtext in Abschnitten (Bindungen, pH, Sintern, C-S-H, Zusatzmittel, Angriffe, Salze, Oberflächenschutz, Korrosion, Kleben und Dichten), zwei Rechenbeispielen und Lehrrechnern (Stellmittel-Rheologie, AKR-Lehrmodell, Karbonatisierung √t, Stöchiometrie, pH).

Komponente `src/modules/Bauchemie.tsx`; Inhalt `content/bauchemie/Bauchemie.json`.

## Rechenkerne und Testabdeckung

| Kern | Tests (Zahl der Prüfungen) | Referenzwerte |
|---|---|---|
| `src/calc/bauchemie.ts` | `tests/bauchemie.test.ts` (30), `tests/modulpruefungTranche4.test.ts` (61) | Ca(OH)₂ = 74,092 g/mol; 1 kg Portlandit bindet 0,59 kg CO₂; c = 40 mm, K = 4 mm/√a → t = 100 a; Stellmittel 0,8 %, 15 s⁻¹ → η = 11,4 Pa·s |

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T4-BC-1 | Thenardit → Mirabilit „rund dreifaches Volumen“ falsch → „gut 300 %, rund das Vierfache“ | erledigt (behoben) | T4 (`module-tranche-4.md`) (Nr. 5) |
| T4-BC-2 | Faustregel Fugenbreite : Dichtstofftiefe statt Normtabelle DIN 18540 → als Faustregel gekennzeichnet | erledigt (umgesetzt, als vorläufig gekennzeichnet) | T4 (`module-tranche-4.md`), Umsetzung 29.10.; Normtext |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Kennungen nach dem Prüfbogen Normtext (Stand 28.10.2026) bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens.

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| T4-BC-2 | DIN 18540 (Ausgabe in der App nicht angegeben), Tabelle Fugenbreite / Dichtstoffdicke mit Grenzabmaßen | Gibt die Faustregel b : t die Normtabelle wieder, oder müssen die Tabellenwerte übernommen werden? | „b ≤ 10 mm: b : t ≈ 1 : 1“; „b > 10 mm: b : t ≈ 2 : 1 (z. B. Breite 20 mm → Tiefe 10 mm)“ – `content/bauchemie/Bauchemie.json:204–205`; dieselbe Faustregel (IVD) auch in `content/bauschaeden/Bauschaeden.json:119–120` |

## Quizfragen

7 Fragen, davon 1 nicht freigegeben: `qlz_bauchemie_1`.

## Quellen

IUPAC-Atomgewichte; SalzWiki der HAWK (Natriumsulfat, Volumenzunahme 320 %); DIN 18540 (Normtext nicht öffentlich); Befundliste Tranche 4, Nr. 5.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Stöchiometrie: M(Ca(OH)₂) = 74,092 g/mol, M(Ca₃SiO₅) = 228,314 g/mol; Ca(OH)₂ + CO₂ → CaCO₃ + H₂O: 1 kg Portlandit bindet 44,0/74,1 = 0,59 kg CO₂ (Beispiel 2).
2. Karbonatisierung x = K·√t: c = 40 mm, K = 4 mm/√a → t = 100 a; K = 2 → 400 a; c = 30 mm, K = 4 → 56 a (Beispiel 1).
3. pH der Porenlösung 12,6 ↔ [OH⁻] = 10^(−1,4) = 0,040 mol/l (Rundreise im Kern exakt).
4. Salzangriff: Thenardit → Mirabilit „Volumenzunahme um gut 300 %, also rund das Vierfache“ (T4-BC-1).
5. Fugendimensionierung: „b ≤ 10 mm: b : t ≈ 1 : 1; b > 10 mm: b : t ≈ 2 : 1“ gegen die Tabelle Dichtstoffdicke je Fugenbreite der DIN 18540 prüfen (`content/bauchemie/Bauchemie.json:204`; T4-BC-2).

## Empfehlung

**freigabereif nach Klärung von T4-BC-2.** Fünf Nachrechnungen identisch, der eine Fachfehler (T4-BC-1) ist behoben; offen ist nur die Faustregel der Fugendimensionierung am Normtext DIN 18540.

Nach der Regel der Freigabe vom 02.11.2026 (Tranche 16: im Modul gekennzeichnete Normtextpunkte gelten als erledigt) wäre das Modul schon jetzt freigabereif; nach der Regel vom 28.10.2026 (Normtextpunkte blockieren) erst nach dem Normtextabgleich. Siehe `README.md`, Abschnitt „Zu entscheiden“.
