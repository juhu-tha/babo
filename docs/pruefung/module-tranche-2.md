# Modulprüfung Tranche 2 – Rechnermodule (Befundliste zur Freigabe)

**Stand:** 28.10.2026 (Branch `pruefung/module-tranche2-10-28`, Basis origin/main fc525dc5)
**Status:** Vorschlag zur fachlichen Freigabe – noch nicht bestätigt.

> Nach der Freigabe eines Moduls wird in `src/data/pruefvermerke.ts` der Prüfvermerk „geprüft am …“ gesetzt (Passiv, ohne Namen). Mit dieser Befundliste wurden **keine** Prüfvermerke geändert.

## Vorgehen

- **Auswahl (10 Prüfeinheiten):**
  - **Rest von `stahlbeton_bemessung`** (Verankerung, Rissbreite, σ-ε-Linien): ohne diese Reiter kann der Prüfvermerk des Moduls aus Tranche 1 nicht gesetzt werden.
  - **Holz-Einfeldbalken (`bp_holzprodukte`)**: Der Nebenbefund aus Tranche 1 betraf einen Nachweis auf der unsicheren Seite.
  - **Spannbeton**: letzter Rechner des Pflichtfachs Massivbau.
  - **Dauerhaftigkeit (Lebensdauerbemessung, Korrosion/Chloridrechner, Schnellkarbonatisierung)**: Die drei Module teilen sich die Kerne `lebensdauer.ts` und `schnellkarbonatisierung.ts`. Sie wurden zuletzt mehrfach geändert (Runde 7: gemeinsamer Chloridkern; Lebensdauerbemessung „vorläufig“).
  - **Statistik**: Die Grubbs-Tabelle wurde am 27.10. auf ISO 5725-2 umgestellt und war gegenzuprüfen.
  - **Ökobilanz-Gebäuderechner (`lca_rechner`)**: QNG-relevant, Kennwerte zuletzt geändert.
  - **Bodenmechanik/Atterberg**: neuer Reiter aus Z24.
  - **Glaser/Feuchteschutz**: In Tranche 1 wurden nur Grundfälle geprüft. Jetzt kommen Tauwasser im Dach, Dampfbremse, Innendämmung, Holzrahmenwand und die s_d-Regel dazu.
- **Prüfumfang je Modul** (wie Tranche 1):
  - Rechenkern mit mindestens drei eigenen Nachrechnungen: eigenes Python-Skript mit eigener Umsetzung der Norm- bzw. Modellgleichungen (numpy/scipy), keine Übernahme von Testwerten, Randfälle eingeschlossen.
  - Fachtext (`content/*.json`) auf Richtigkeit und Normstand.
  - Grenzen (`src/data/rechnerGrenzen.ts`).
  - Beispiele mit Rechenweg.
  - Lernziele und Kurzfassung.
  - Quellen und Stellen „vorläufig, F-Freigabe“.
- **Ergebnis der Nachrechnung:** 230 Einzelvergleiche, alle ohne Abweichung.
  - Toleranzen: 0,5 %; Tabellenwerte der Tab. 3.1 mit Rundung 3 %; Monte-Carlo-Werte innerhalb von 3 Standardfehlern gegen eine eigene Simulation mit 10⁶ Läufen.
  - **Vor der Korrektur T2-H-1** wichen zwei Holzfälle ab: HE2 ergab η_m = 63,2 % statt 71,6 %, HE4 rechnete mit k_mod = 0,8 statt 0,6.
  - Einzige Näherung: U(T_v) nach Terzaghi/Casagrande bei T_v = 0,283 weicht 0,6 % von der exakten Reihenlösung ab. Das ist eine bekannte Formelnäherung und kein Befund.
  - Die maßgebenden Sollwerte stehen als Regressionstest in `tests/modulpruefungTranche2.test.ts`.
- Es wurden nur öffentliche Quellen verwendet. Normtexte wurden nicht abgeschrieben. Wo der Normtext (NA DE) zur Bestätigung nötig ist, steht die Stelle unter „F-Freigabe“.

## Übersicht

| Nr. | Prüfeinheit | Prüfvermerk-ID | Rechenkern | Empfehlung |
|---|---|---|---|---|
| 1 | Verankerung | `stahlbeton_bemessung` (Reiter) | `src/calc/verankerung.ts` | freigabefähig nach Klärung von T2-S-1 und T2-S-2 |
| 2 | Rissbreite | `stahlbeton_bemessung` (Reiter) | `src/calc/rissbreite.ts` | freigabefähig |
| 3 | σ-ε-Linien / Werkstoffgesetze | `stahlbeton_bemessung` (Reiter) | `src/calc/werkstoffmodelle.ts` | freigabefähig (F-Stelle hochfester Beton aus Tranche 1) |
| 4 | Holz-Einfeldbalken | `bp_holzprodukte` | `src/calc/holzbau.ts` | freigabefähig nach Korrektur T2-H-1 |
| 5 | Spannbeton | `spannbeton` | `src/calc/spannbeton.ts`, `src/utils/ec2Spannbeton.ts` | freigabefähig |
| 6 | Lebensdauerbemessung | `lebensdauerbemessung` | `src/calc/lebensdauer.ts` | Rechnung freigabefähig; Kennwerte bleiben „vorläufig“ (Entscheidung 27.10.) |
| 7 | Korrosion / Chloridrechner | `korrosion` | `src/calc/korrosion.ts` | freigabefähig |
| 8 | Schnellkarbonatisierung | `schnellkarbonatisierung` | `src/calc/schnellkarbonatisierung.ts` | freigabefähig |
| 9 | Statistik | `statistik` | `src/calc/statistik.ts` | freigabefähig nach Klärung von T2-ST-1 |
| 10 | Ökobilanz-Gebäuderechner | `lca_rechner` | `src/calc/lca.ts` | freigabefähig nach Klärung der F-Stellen |
| 11 | Bodenmechanik / Atterberg | `bodenmechanik` | `src/calc/boden.ts` | freigabefähig nach Klärung von T2-B-1 und T2-B-2 |
| 12 | Glaser / Feuchteschutz (Vertiefung) | `feuchteschutz` | `src/calc/glaser.ts` | freigabefähig nach Klärung der F-Stellen aus Tranche 1 |

Die Nummern 1–3 schließen `stahlbeton_bemessung` ab; die 10 Bereiche des Auftrags umfassen damit 12 Prüfeinheiten.

**Behobene Fehler (dieser PR):**
- **T2-H-1:** ständige Kombination im Holz-Einfeldbalken.
- **T2-S-3:** Rechenbeispiel Verankerung.
- **T2-P-1:** veralteter Dekompressionshinweis.
- **T2-P-2:** Überschrift „25 mm Puffer“.
- **T2-P-3:** Kurzfassung der Spannkraftverluste.
- **T2-ST-2:** Benennung im Grubbs-Beispiel.
- **T2-B-1 (teilweise):** falsche Normzuordnung der Zustandsformen.

---

## 1. Verankerung (Reiter von `stahlbeton_bemessung`)

**Prüfumfang:** `src/calc/verankerung.ts`, `src/modules/Verankerungslaenge.tsx`, `content/verankerungslaenge/Verankerungslaenge.json` (Rechenbeispiel, Rechenweg), Grenzen `STAHLBETON`.

**Nachrechnungen** (f_ctk;0,05 aus Tab. 3.1, f_ctd = f_ctk;0,05/1,5, f_bd = 2,25·η₁·η₂·f_ctd, l_b,rqd = φ/4·f_yd/f_bd):

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| V1 | C30/37, Ø16, guter Verbund, Zug, gerade, A_s,erf/A_s,vorh = 10/12 | f_bd = 3,00; l_b,rqd = 579,7 mm; l_bd = 483,1 mm (l_b,min = 173,9 mm) | identisch |
| V2 | C50/60, Ø28, mäßiger Verbund, Haken, α₂ = 0,9, α₃ = 0,8 | f_bd = 3,045; l_b,rqd = 999,5 mm; ∏α = 0,7·max(0,7; 0,72) = 0,504; l_bd = 503,7 mm | identisch |
| V3 | Übergreifung C25/30, Ø12, α₆ = 1,5 | l_b,rqd = 483,1 mm; l₀ = 724,6 mm; l₀,min = max(217,4; 180; 200) | identisch |
| V4 | Druck, Ø40 (η₂ = 0,92), A_s,erf/A_s,vorh = 0,2 (Randfall) | l_b,rqd = 1 575 mm; l_b,min = 0,6·l_b,rqd = 945,2 mm maßgebend | identisch |
| V5 | C70/85 (Grenze 8.4.2(2)) | f_ctk;0,05 mit C60/75 = 3,1 begrenzt; f_bd = 4,65 | identisch |

**Befunde**
- **behoben – T2-S-3:** Das Rechenbeispiel rechnete mit f_ctk;0,05 = 0,7·0,30·30^(2/3) = 2,03 N/mm² und ergab l_b,rqd = 572 mm („≈ 570 mm“). Der Rechner verwendet den Tabellenwert 2,0 N/mm² (Tab. 3.1), mit derselben Eingabe also 580 mm. Das Beispiel ist an den Rechner angeglichen: f_ctd = 1,33, f_bd = 3,00, l_b,rqd = 580 mm (≈ 36 Ø). Der Formelwert 2,03 bleibt als Erklärung stehen.
- **offen – Frage T2-S-1:** Der Rechner bietet für α₆ die EC2-Empfehlung an (Tab. 8.3: 1,15 / 1,41 / 1,5 nach dem Stoßanteil). Nach meinem Kenntnisstand ersetzt der NA DE diese Tabelle durch Tab. 8.3DE: α₆ hängt dort vom Stoßanteil (≤ 33 % / > 33 %), vom Stabdurchmesser (< 16 mm / ≥ 16 mm) und vom lichten Stababstand ab und reicht bis 2,0. Öffentlich ließ sich das nicht belegen; die gefundene Quelle (BASt-Bericht B 148) war gesperrt und wurde nicht umgangen. Frage: Soll α₆ auf Tab. 8.3DE umgestellt werden? Die Beschriftung „< 33 % gestoßen (1,15)“ ist ohnehin ungenau, der Wert 1,15 gehört zu einem Stoßanteil von 33 %.
- **offen – Frage T2-S-2:** Der NA DE erlaubt nach meinem Kenntnisstand die vereinfachte Form l_bd = α₁·α₄·α₅·l_b,rqd·A_s,erf/A_s,vorh mit α₅ = 2/3 bei direkter Lagerung. Die Eingabe α₅ ist auf 0,7–1,0 begrenzt (EC2-Empfehlung). Zu klären sind auch die Mindestwerte (8.6)/(8.7) nach NA DE, ob dort 100 mm entfallen oder α₁·α₄ eingeht. Frage: Rechner bei der EN-Form lassen (mit Hinweis) oder die vereinfachte NA-Form ergänzen? Normtext erforderlich (F-Freigabe).
- Hinweis: Die Eingabe α₄ (angeschweißte Querstäbe) fehlt und ist implizit 1,0. Das liegt auf der sicheren Seite.

**F-Freigabe-Stellen**
- Tab. 8.3DE (α₆) und die NA-Fassung von (8.6), (8.7), (8.10) – DIN EN 1992-1-1/NA:2013-04, 8.4.4 und 8.7.3.

**Empfehlung:** freigabefähig nach Klärung von T2-S-1 und T2-S-2. Bei Biegezugverankerung mit geraden Stäben und α = 1 ist die Rechnung bereits richtig.

- [ ] Modul freigeben (Teilfreigabe Reiter Verankerung; Prüfvermerk `stahlbeton_bemessung` mit Nr. 1–3)

## 2. Rissbreite (Reiter von `stahlbeton_bemessung`)

**Prüfumfang:** `src/calc/rissbreite.ts`, `src/modules/Rissbreite.tsx`, `content/rissbreite/Rissbreite.json`, `EC2_NA_DE.wmax_StB` und `kAsMin` in `src/data/normParams.ts`.

**Nachrechnungen**
- Formeln: x im Zustand II aus b·x²/2 = α_e·A_s·(d − x); h_c,ef nach Bild 7.1; s_r,max nach (7.11DE); ε_sm − ε_cm nach (7.9); A_s,min nach (7.1).

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| R1 (Standardeingabe) | Platte h = 200 mm, c = 35 mm, Ø16/20, σ_s = 250, f_ct,eff = 2,9, E_cm = 33 000, k_t = 0,4 | A_s = 1 005 mm²; x = 38,07 mm; h_c,ef = 53,98 mm; s_r,max = 238,6 mm; w_k = 0,216 mm ≤ 0,3; A_s,min = 371 mm² | identisch |
| R2 | zentrischer Zug h = 300 mm, Ø12/10, σ_s = 200, Zwang nach 28 d | f_ct,eff = 3,0 (NA DE); h_c,ef = 115 mm; s_r,max = σ_s·φ/(3,6·f_ct,eff) = 222,2 mm maßgebend; w_k = 0,133 mm; A_s,min = 3 600 mm² | identisch |
| R3 | Balken 30/60, Ø25/10, σ_s = 300, C40/50 | x = 151,0 mm; h_c,ef = 106,3 mm; s_r,max = 150,3 mm; w_k = 0,197 mm; k = 0,68 (Interpolation 300–800 mm) | identisch |

**Befunde**
- behoben: keine.
- offen: keine Rechenfehler.
- Richtig sind:
  - w_max nach Tab. 7.1DE (X0, XC1: 0,4 mm; sonst 0,3 mm);
  - k_c = 0,4 bzw. 1,0 und k nach NA DE (0,8 bis 300 mm, 0,5 ab 800 mm);
  - der Hinweis zu 7.3.4(4) bei großem Stababstand.
- Hinweis (keine Änderung): Die Mindestbewehrung rechnet mit dem eingegebenen σ_s. Die Kopplung von σ_s an den Grenzdurchmesser φ* (Tab. 7.2DE, Gl. 7.6DE/7.7DE) ist nicht abgebildet; die Grenzen nennen das bereits sinngemäß.

**F-Freigabe-Stellen:** keine eigenen.

**Empfehlung:** freigabefähig.

- [ ] Modul freigeben (Teilfreigabe Reiter Rissbreite; Prüfvermerk `stahlbeton_bemessung` mit Nr. 1–3)

## 3. σ-ε-Linien / Werkstoffgesetze (Reiter von `stahlbeton_bemessung`)

**Prüfumfang:** Beton- und Betonstahlteil von `src/calc/werkstoffmodelle.ts` (`betonSdParameter`, `betonParabelRechteck`, `betonNichtlinear`, `betonstahlParameter`, `betonstahlSpannung`), `src/modules/SpannungDehnung.tsx`, `content/spannungdehnung/SpannungDehnung.json`, Dehnungswerte in `src/data/kennwerte.ts` und `src/utils/ec2Spannbeton.ts` (Tab. 3.1).

**Nachrechnungen**
- Beton: Gleichungen der Tab. 3.1 selbst ausgewertet, Gl. (3.14) und (3.17), f_cd = 0,85·f_ck/1,5.
- Betonstahl: B500 nach DIN 488-1 mit ε_uk = 25/50 ‰ und ε_ud = 25 ‰ (NA DE).

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| SE1 | C30/37 | ε_c2 = 2,0; ε_cu2 = 3,5; n = 2; f_cd = 17,0; σ(1 ‰) = 12,75; σ(≥ 2 ‰) = 17,0; Gl. (3.14) mit k = 2,006 (ε_c1 = 2,2 ‰) | identisch (5 + 6 Punkte) |
| SE2 | C70/85 (hochfest) | Tab. 3.1: ε_c2 = 2,4 (Formel 2,42); ε_cu2 = 2,7 (2,66); n = 1,45 (1,44); σ(1 ‰) = 39,67·[1 − (1 − 1/2,4)^1,45] | identisch (Tabellenwerte) |
| SE3 | B500B, ε = 1 / 10 / 25 / 50 ‰ | σ_char = 200 / 506,3 / 518,9 / 540 N/mm²; σ_d = 200 / 434,8 / 434,8 / – (Ende bei ε_ud = 25 ‰) | identisch |
| SE4 | B500A, ε = 26 ‰ (Randfall) | jenseits ε_uk = 25 ‰ keine Spannung | identisch |

**Befunde**
- behoben: keine.
- offen: keine.
- Richtig sind:
  - die Dehnungs-Kennwerte der Tab. 3.1 für C12/15 bis C90/105 (Klassenwerte gerundet, wie in der Norm);
  - E_cm = 22 000·(f_cm/10)^0,3;
  - der Hinweis „Regler bis C90/105“.
- Kurzfassung „ε_cu2 = −3,5 ‰“ gilt für Normalbeton bis C50/60. Das ist im Zusammenhang erkennbar, keine Änderung.
- Hinweis: Die Stahlsorten-Lehrkurven (Lüdersplateau, 0,75·R_p0,2) und der Brandfall (Tab. 3.1 der DIN EN 1993-1-2) gehören zum Modul `stahl`. Sie sind nicht Teil dieser Prüfeinheit.

**F-Freigabe-Stellen:** wie Tranche 1, F-1 (Abminderung f_cd ab C55/67, Schalter aus).

**Empfehlung:** freigabefähig.

- [ ] Modul freigeben (Teilfreigabe Reiter σ-ε-Linien; damit sind alle Reiter von `stahlbeton_bemessung` geprüft – Prüfvermerk nach Klärung von F-1, S-2, P-2 aus Tranche 1 und T2-S-1/2)

## 4. Holz-Einfeldbalken (`bp_holzprodukte`)

**Prüfumfang:** `bemesseEinfeldbalken` in `src/calc/holzbau.ts`, `src/modules/BpHolzprodukte.tsx`, `content/bpholzprodukte/BpHolzprodukte.json` (Rechenbeispiel, Formeln), Grenzen `bp_holzprodukte`, Lernziele.

**Nachrechnungen**
- Eigene Umsetzung: beide Kombinationen, k_mod Tab. 3.1, k_cr nach NA DE, Durchbiegungen nach 2.2.3 mit k_def Tab. 3.2.

| Fall | Eingabe | Handrechnung | Kern (nach Korrektur) |
|---|---|---|---|
| HE1 (Rechenbeispiel) | KVH C24 10/20, l = 4,5 m, e = 0,625 m, g_k = 1,0, q_k = 1,5 kN/m², NKL 1, KLED mittel | 1,35·g + 1,5·q maßgebend: q_d = 2,361 kN/m; η_m = 60,7 %; η_v = 32,4 %; w_inst = 11,98, w_fin = 16,30, w_net,fin = 11,52 mm | identisch |
| HE2 | wie HE1, l = 4,0 m, g_k = 3,0, q_k = 0,5 kN/m² | G + Q: q_d = 3,111 kN/m mit k_mod 0,8 → η_m = 63,2 %; **G allein: q_d = 2,643 kN/m mit k_mod 0,6 → η_m = 71,6 % (maßgebend)**; η_v = 42,9 % | vorher 63,2 %, jetzt 71,6 % |
| HE3 | BSH 12/24, l = 5,0 m, NKL 2, g_k = 2,5, q_k = 2,0 | η_m = 76,1 %; w_fin = w_G·1,8 + w_Q·1,24 = 23,43 mm; w_net,fin = 18,95 mm | identisch |
| HE4 | wie HE1, q_k = 0 (Randfall) | nur ständige Last → k_mod = 0,6; η_m = 32,7 % | vorher k_mod 0,8 (η_m = 24,6 %), jetzt 0,6 |

**Befunde**
- **behoben – T2-H-1** (Nebenbefund aus Tranche 1):
  - Problem: `bemesseEinfeldbalken` wies nur 1,35·g + 1,5·q mit k_mod der Nutzlast nach. Nach DIN EN 1995-1-1, 2.4.1 und 3.1.3(2), gehört k_mod zur kürzesten Einwirkung der jeweiligen Kombination; die ständige Kombination 1,35·g mit k_mod(ständig) ist daher ebenfalls nachzuweisen. Sie wird bei NKL 1/2 und KLED mittel maßgebend, wenn g_k > 3,33·q_k (0,45·g > 1,5·q). Das ist bei schweren Aufbauten (Estrich, Schüttung) und kleiner Nutzlast typisch. Im Fall HE2 lag der Kern um 8,4 Prozentpunkte auf der unsicheren Seite.
  - Korrektur: Der Kern rechnet jetzt beide Kombinationen und nimmt die mit der größeren Ausnutzung; Schub folgt derselben Kombination.
  - Neue Rückgabefelder: `kombination`, `eta_m_GQ`, `eta_m_G`, `kmodGQ`, `kmodG`, `q_d_GQ`, `q_d_G`. Wird die ständige Kombination maßgebend, erscheint ein Hinweis.
  - Anzeige: Das Modul nennt die maßgebende Kombination und die Ausnutzung der anderen.
  - Weitere Änderungen: Grenztext („nur eine Lastfallkombination“) angepasst; Test in `tests/modulpruefungTranche2.test.ts`, auch an der Grenze g/q = 10/3.
  - Das Rechenbeispiel HE1 bleibt unverändert.
- offen: keine.

**F-Freigabe-Stellen:** Durchbiegungsgrenzen l/300, l/200, l/300 nach NA (unverändert aus Runde 5, `W_GRENZEN`).

**Empfehlung:** freigabefähig.

- [x] Modul freigeben (28.10.2026)

## 5. Spannbeton (`spannbeton`)

**Prüfumfang:**
- Kerne: `src/calc/spannbeton.ts`, `src/utils/ec2Spannbeton.ts` (Festigkeitsentwicklung, Kriechen, Schwinden, Relaxation, Reibung/Keilschlupf, elastische Verkürzung, Gl. 5.46).
- Module: Nachweisführung in `src/modules/Spannbeton.tsx` (Spannungsgrenzen, Dekompression), Demonstratoren (Freyssinet, Lastausgleich).
- Inhalte: `content/spannbeton/*.json`, Kurzfassung, Grenzen.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| SB1 Reibung/Schlupf | P₀ = 3 000 kN, A_p = 2 250 mm², µ = 0,2, θ = 0,3 rad, k = 0,005/m, L = 30 m, Schlupf 6 mm | σ₀ = 1 333; l_set = 17,49 m; σ(15 m) = 1 274,7; nach Schlupf 1 255,6; am Anker 1 199,5 N/mm² | identisch |
| SB2 Kriechen (Anhang B) | C40/50 N, t₀ = 28 d, h₀ = 250 mm, RH 70 %; C30/37 R, 7 d, 150 mm, 50 %; C25/30 S, 10 d, 400 mm, 80 % | φ = 1,536 / 2,898 / 2,383 (B.3b bzw. B.3a, t₀ nach B.9) | identisch |
| SB3 Schwinden | C40/50 N, h₀ 250, RH 70; C30/37 R, h₀ 150, RH 50 | ε_cs = 0,332 / 0,668 ‰ (ε_ca + k_h·ε_cd,0) | identisch |
| SB4 Relaxation | Klasse 2, σ_pi = 1 300, f_pk = 1 860, 500 000 h; Klasse 1 (Kappe 25 %); Klasse 3, 1 000 h | Δσ_pr = 50,5 / 246,5 / 7,27 N/mm² (Gl. 3.28–3.30) | identisch |
| SB5 Gl. (5.46) | E_p/E_cm = 195/35, A_p = 2 250, 50/120, z_cp = 450, φ = 2,0, ε_cs = 0,5 ‰, Δσ_pr = 40, σ_c,QP = 12 | Δσ_p,c+s+r = 229,7 N/mm² | identisch |
| SB6 weitere | elast. Verkürzung n = 4: 24,4 N/mm²; Lastausgleich L = 20 m, g = 15 kN/m, f = 0,45 m: P = 1 667 kN, 10 Litzen; Freyssinet 50/100, P = 2 000 kN, e_p = 300 mm, M = 800 kNm: σ_u = −1,6, σ_o = −6,4 N/mm²; f_ck(7 d) = 29,4, E_cm(7 d) = 32 471, f_ctm(7 d) = 2,73 | identisch |

**Befunde**
- **behoben – T2-P-1:** `pruefeSpannbeton` meldete „Dekompression vereinfacht: Betonspannung in e_p + 25 mm … offener Prüfpunkt (AP 4.4)“. Das Modul rechnet seit Runde 5 nach NA DE mit dem Bereich e_p ± max(100 mm; h/10) (Grenzen und Fachtext ebenso). Der Hinweistext ist an die Rechnung angeglichen.
- **behoben – T2-P-2:** In der Übersicht der Prinzipien hieß der Kasten „Radialer Schutzbereich (25 mm Puffer)“ mit dem Kennzeichen „EC2 Tab. 7.1N“. Der Text darunter nennt richtig 100 mm bzw. h/10 nach NA DE. Überschrift und Kennzeichen lauten jetzt „Schutzbereich um das Spannglied (NA DE: 100 mm bzw. h/10)“ und „EC2 7.3.1 mit NA DE, Tab. 7.1DE“.
- **behoben – T2-P-3:** Die Kurzfassung sagte, alle Spannkraftverluste (auch Reibung, Keilschlupf, elastische Verkürzung) seien „gekoppelt und dürfen nicht linear addiert werden“. Der Rechner addiert richtig die Sofortverluste und die nach Gl. (5.46) gemeinsam ermittelten zeitabhängigen Verluste. Der Satz ist berichtigt.
- Hinweise (keine Änderung):
  - Die Spannungsgrenze 0,60·f_ck unter charakteristischer Kombination prüft der Rechner unabhängig von der Expositionsklasse. Nach 7.2(2) gilt sie für XD, XF und XS; außerhalb liegt die Prüfung auf der sicheren Seite.
  - E_cm(t₀) ist im Modul mit 15 000 N/mm² nach unten begrenzt (nur bei sehr frühem Spannen wirksam).
  - Die Formel Δσ_p,el = E_p/E_cm(t₀)·σ_c,p0 im Fachtext gilt für das Spannbett; den Faktor (n − 1)/(2n) für nacheinander gespannte Glieder zeigt der Rechenweg.

**F-Freigabe-Stellen:** keine eigenen (Relaxation mit den EC2-Rechenwerten ρ₁₀₀₀ statt Zulassungswerten ist als Lehrannahme gekennzeichnet).

**Empfehlung:** freigabefähig.

- [x] Modul freigeben (28.10.2026)

## 6. Lebensdauerbemessung (`lebensdauerbemessung`)

**Prüfumfang:**
- Kerne: `src/calc/lebensdauer.ts` (Karbonatisierungs- und Chloridmodell nach fib Bulletin 34, Monte-Carlo-Simulation, β, erforderliche Deckung), `src/calc/lebensdauerUebergabe.ts` (Übergabe aus den Einzelrechnern).
- Inhalte: `content/lebensdauerbemessung/*.json` (Grundlagen, Kennwerttabellen, Beispiele), Kurzfassung, Lernziele.

**Nachrechnungen**
- Eigene numpy-Simulation mit 10⁶ Läufen und eigenen Verteilungen (Beta, Lognormal, Normal).

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| L1 Mittelwerte Karbonatisierung | RH 75 %, t_c = 3 d, R⁻¹ = 5·10⁻¹¹, p_SR·ToW = 0,054 | k_e = 0,691; k_c = 1,617; Rate 2,047 mm/√a; x_c(50 a) = 6,00 mm (W = 0,49) | identisch |
| L2 Karbonatisierung p_f | c = 30 ± 8 mm, Streuungen nach fib 34 | p_f(50 a) = 0,0023 ± 0,0007 | 0,0023 |
| L3 Chlorid Mittelwerte | T = 10 °C, D_RCM,0 = 8, a = 0,30, C_S = 3,0, Δx = 8,9 mm | k_e = 0,566; A(50 a) = 0,143; D_app = 20,42 mm²/a; C(50 mm) = 1,153 M.-% | identisch |
| L4 Chlorid p_f | c = 50 ± 8 mm | p_f = 0,728 ± 0,006 | 0,728 |
| L5 Beispiel 1 des Moduls | XC3, c = 35 ± 8 mm, RH Beta 65 ± 10, x_c,ACC = 5 mm | Mittelwertrechnung 126,6 a; p_f = 0,0760 (β = 1,43) | 126,6 a; β = 1,43; Lebensdauer 56 a – Text richtig |
| L6 Beispiel 2 des Moduls | XD3, CEM III/B, D_RCM,0 = 1,9, c = 55 ± 8 mm; Variante CEM I (D_RCM,0 = 10, a = 0,30) | p_f = 0,101 (≈ 10 %); CEM I: p_f = 0,727, β = −0,60 | 0,102; −0,59 – Text richtig |
| L7 Umrechnungen | x_c,ACC = 5 mm; K_AC = 1,5 mm/√d bei 3 % CO₂ | R⁻¹ = (x_c/τ)² = 14,17; K_AC²/(2·C) = 23,59 (10⁻¹¹ (m²/s)/(kg/m³)) | identisch |

**Befunde**
- behoben: keine.
- offen: keine Rechenfehler.
- Richtig sind:
  - die Teilfunktionen k_e, k_c, W(t), A(t), k_e(T) und die erfc-Lösung mit Δx;
  - β = −Φ⁻¹(p_f) mit der Untergrenze bei p_f = 0;
  - die Angaben im Fachtext: β₀ = 1,3 ≙ p_f ≈ 10 %, β = 1,5 ≙ 7 %, Standardfehler 0,2 Prozentpunkte bei N = 20 000.
- Die Basisvariablen der Tabellen stimmen mit den im Modul genannten öffentlichen Wiedergaben überein:
  - Karbonatisierung: b_c = −0,567 ± 0,024; k_t = 1,25 ± 0,35; ε_t = (1,0 ± 0,15)·10⁻¹¹; C_S,atm = 0,00082 ± 0,0001; b_w = 0,446 ± 0,163; s(R⁻¹) = 0,69·m^0,78;
  - Chlorid: C_crit Beta(0,6; 0,15; 0,2; 2,0); Δx Beta(8,9; 5,6; 0; 50); b_e = 4 800 ± 700 K; a = 0,30/0,60/0,45.

**F-Freigabe-Stellen** (Entscheidung 27.10.: vorläufig, weiter recherchieren – keine neue Frage)
- ToW, p_SR-Konvention und Bauteiltemperatur (DWD), Streuung der Deckung (DBV/fib 34), D_RCM,0 einzelner Bindemittel (weitere Sekundärquellen), Umrechnung K_AC → R⁻¹ (mit deutlichem Hinweis, bleibt).

**Empfehlung:** Rechnung freigabefähig; die Kennwerte bleiben bis zur Recherche als „vorläufig“ gekennzeichnet (Teilfreigabe „Rechenweg“ möglich).

- [ ] Modul freigeben

## 7. Korrosion / Chloridrechner (`korrosion`)

**Prüfumfang:** `src/calc/korrosion.ts` (Faraday, Chloridprofil über den gemeinsamen Kern `chloridgehalt`, Karbonatisierungsfront, Lokalelement-Lehrmodell), `content/korrosion/Korrosion.json` (Beispiele, Formeln), Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| K1 Faraday | i_corr = 1 µA/cm², Fe (55,845 g/mol, z = 2, 7,874 g/cm³) | v = 11,598 µm/a (Lehrwert 11,6) | identisch |
| K2 Chloridprofil | t = 50 a, c = 40 mm, D_app,0 = 10·10⁻¹² m²/s, a = 0,4, C_S = 3,0 | C = C_S·erfc(x/(2√(D(t)·t))) = 1,231 M.-% v. z. | identisch |
| K3 Chloridprofil | t = 20 a, c = 30 mm, D = 5, a = 0,3, C_S = 2,0 | 0,768 M.-% | identisch |
| K4 Querschnitt | Ø16, 11,6 µm/a, 20 a | ΔA/A = 5,72 % | identisch |
| Beispiele Modul | Chlorid D = 0,3·10⁻¹² m²/s konstant, x = 45 mm, 50 a; Ø12 nach 10 a | z = 1,03, C = 0,43 M.-% (35 mm: 0,77); d = 11,77 mm, ΔA/A = 3,8 % | richtig |

**Befunde:** keine. Das Lokalelement-Modell ist als qualitatives Lehrmodell gekennzeichnet (alle Beiwerte Lehrannahmen). Der Orientierungswert C_krit = 0,5 M.-% v. z. ist mit Quelle und Abgrenzung zu Cl 0,40 erläutert.

**F-Freigabe-Stellen:** keine eigenen (Alterungsexponenten wie Nr. 6).

**Empfehlung:** freigabefähig.

- [x] Modul freigeben (28.10.2026)

## 8. Schnellkarbonatisierung (`schnellkarbonatisierung`)

**Prüfumfang:** `src/calc/schnellkarbonatisierung.ts` (Regression x = a + K·√t mit und ohne Achsenabschnitt, Umrechnung, Prognose), `content/schnellkarbonatisierung/Schnellkarbonatisierung.json` (Prüfablauf, Beispiel), Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| C1 | 0/7/28/70 d: 0,5/3,1/6,0/9,3 mm, mit Achsenabschnitt; c_nat = 0,042 % | K_AC = 1,0565 mm/√d, a = 0,419 mm (numpy polyfit); K_nat = 2,388 mm/√a; t(25 mm) = 109,6 a | identisch |
| C2 | ohne Nullmessung, durch den Ursprung | K_AC = Σs·x/Σs² = 1,1215 | identisch |
| Beispiel Modul | 2,5/4,8/7,5 mm nach 7/28/70 d | K_AC = 94,76/105 = 0,903; K_nat = 1,99 mm/√a; x(50 a) = 14,1 mm; t(25 mm) = 158 a; 15 mm: 57 a | richtig |

**Befunde:** keine. Prüfbedingungen (3,0 ± 0,5 Vol.-% CO₂, 57 ± 3 % r. F., 20 ± 2 °C) und Messzeitpunkte stimmen mit der öffentlich beschriebenen DIN EN 12390-12 überein. Die Umrechnung K ∝ √c ist als Größenordnung gekennzeichnet.

**F-Freigabe-Stellen:** keine eigenen (Übergabe K_AC → R⁻¹ siehe Nr. 6).

**Empfehlung:** freigabefähig.

- [x] Modul freigeben (28.10.2026)

## 9. Statistik (`statistik`)

**Prüfumfang:**
- Kern: `src/calc/statistik.ts` (Kennwerte, Ausreißerkriterien, Grubbs nach ISO 5725-2, k_n nach DIN EN 1990 Tab. D1, t-Tests).
- Inhalte: `content/statistik/*.json` (Beispiele Bohrkerne und Grubbs, t-Test-Reiter), Lernziele.

**Nachrechnungen** (scipy)

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| ST1 Grubbs-Tabelle | n = 3 … 50 (15 Stützstellen) | G_krit = (n − 1)/√n·√(t²/(n − 2 + t²)), t = t(1 − α/(2n); n − 2), α = 5 %: n = 8: 2,1266; n = 10: 2,2900; n = 50: 3,1282 | alle 15 Werte ≤ 0,1 % – **Umstellung auf ISO 5725-2 bestätigt** |
| ST2 Grubbs | 38,2 … 42,1 und 31,0 (n = 8) | G = 2,233 > 2,127 → 31,0 auffällig; X_k (n = 7) = 36,63 N/mm² mit k_n = t₀,₉₅;₆·√(1 + 1/7) = 2,077 | identisch (k_n interpoliert 2,0771) |
| ST3 k_n | n = 3 … 30 | Tab. D1 gegen t₀,₉₅;ₙ₋₁·√(1 + 1/n), Tabellenrundung ≤ 1,2 % | identisch |
| ST4 t-Tests | Einstichprobe (n = 6, µ₀ = 30), Welch und Student (n = 6/5) | t = 4,789, p = 0,00493; Welch t = 3,180, p = 0,01122; Student p = 0,01206; t-Quantile auf 10⁻⁶ | identisch |
| Beispiele Modul | Bohrkerne n = 10, x̄ = 38,2, s = 3,1; n = 10, G = 2,74 | X_k = 32,2; X_d = 21,5; mit n = 3: 27,8; G_krit 2,29 (5 %) / 2,48 (1 %) | richtig |

**Befunde**
- **behoben – T2-ST-2:** Im Grubbs-Beispiel liegt G = 2,74 auch über der 1-%-Grenze 2,48. Das Ergebnis hieß trotzdem nur „auffällig“. Nach ISO 5725-2 ist ein Wert über der 1-%-Grenze ein (statistischer) Ausreißer, zwischen 5 % und 1 % „auffällig“ (Straggler). Formel und Erklärung benennen jetzt beide Stufen. Der Hinweis „gestrichen werden darf erst bei technischer Ursache“ bleibt.
- **offen – Frage T2-ST-1:** Der Rechner entfernt bei der Methode „Grubbs“ alle Werte jenseits der **5-%-Grenze** und rechnet X_k mit der bereinigten Reihe. Nach ISO 5725-2 werden 5-%-Werte nur gekennzeichnet; als Ausreißer gelten erst Werte über der 1-%-Grenze, und auch diese nur nach technischer Prüfung. Frage: Soll der Rechner (a) erst ab 1 % entfernen und 5-%-Werte nur markieren, (b) beide Grenzen anzeigen und die Entfernung dem Nutzer überlassen, oder (c) beim jetzigen, als „vereinfacht“ gekennzeichneten Vorgehen bleiben? Davon hängt auch das Lernziel „Ausreißer … identifizieren und die Messreihe bereinigen“ ab.
- Hinweis: Die Boxplot-Quartile werden ohne Interpolation bestimmt (im Kern dokumentiert); für Lehrzwecke ausreichend.

**F-Freigabe-Stellen:** keine.

**Empfehlung:** freigabefähig nach Klärung von T2-ST-1.

- [ ] Modul freigeben

## 10. Ökobilanz-Gebäuderechner (`lca_rechner`)

**Prüfumfang:**
- Kern: `src/calc/lca.ts` (A1–A3, A4, B4 mit BNB-Nutzungsdauern, B6 mit QNG-Rechenwerten, C3/C4, D getrennt, je m² NRF(R)·a).
- Daten und Module: `src/modules/interactivelcacalc/daten.ts`, `content/oekobilanzlca/OekobilanzLCA.json` (Rechenbeispiel), Kurzfassung, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| O1 | 400 m³ Beton CEM I, 20 m³ EPS, 30 m³ KVH (Werte aus `daten.ts`); NRF(R) 1 000 m², 50 a | A1–A3 = 77 360; C3/C4 = 31 760; B4 = 2 720 (EPS ND 40 a → 1 Ersatz); D = −25 810 kg CO₂-Äq. | identisch |
| O2 | B6: Netzstrom 12 000 − 3 000 kWh/a PV, Fernwärme Erdgas-KWK 30 000 kWh/a, Nutzerstrom 20·900 m² | B6 = (9 000·0,53203 + 30 000·0,14777)·50 + 18 000·0,53203·50 = 939 889 kg | identisch |
| O3 | Kennwert mit Sockel TGA 1,20 | (A + B4 + C + Sockel + B6)/(1 000·50) = 22,23 kg/(m²·a) → QNG-PLUS (≤ 24) | identisch |
| O4 | A4 50 km, 0,118 kg/(t·km) | Masse·50·0,118 = 5 755 kg (informativ) | identisch |
| Beispiel Modul | 1 050 000 + 400 000 kg, 1 200 m², 50 a; Holzhybrid −15 % | 24,2 (> 24) bzw. 21,5 kg/(m²·a) | richtig |

Der vorhandene Regressionstest gegen den öffentlichen QNG-Beispielbericht (EVEBI, 04.05.2023) läuft weiter (`tests/lca.test.ts`).

**Befunde:** keine Rechenfehler.
- Richtig sind:
  - Ersatzzyklen ⌈50/ND⌉ − 1;
  - Modul D getrennt und nicht angerechnet;
  - A4 nur informativ;
  - Kurzfassung (PLUS 24 / PREMIUM 20, PENRT 96/64 kWh/(m²a)).

**F-Freigabe-Stellen** (bereits gekennzeichnet, keine neue Frage)
- Beträge der Verwertungsfaktoren für Modul D (1,45 / 1,0 / 0,55 / 0,40; Rangfolge belegt).
- Vorübergehend geringere QNG-Anforderungen seit 12/2025 (Zahlen öffentlich nicht beziffert).
- BBSR-Nutzungsdauern 2017 gegenüber der Neufassung 2025 (WDVS).
- Faktoren Elektro- und H₂-Lkw (Einzelbaustoff-Rechner).

**Empfehlung:** freigabefähig nach Klärung der F-Stellen; für Wohngebäude mit Netzstrom/Fernwärme und BNB-gelisteten Baustoffen bereits jetzt freigabefähig.

- [ ] Modul freigeben

## 11. Bodenmechanik / Atterberg (`bodenmechanik`)

**Prüfumfang:**
- Kern: `src/calc/boden.ts` (Zustandsgrenzen, Fließgrenze Mehr- und Einpunktverfahren, Ausrollgrenze, Bodengruppe DIN 18196, Mohr-Coulomb, Rankine, Terzaghi).
- Inhalte: `content/bodenmechanik/Bodenmechanik.json`, `AtterbergTab.json`, Grenzen, Lernziele.

**Nachrechnungen**

| Fall | Eingabe | Handrechnung | Kern |
|---|---|---|---|
| B1 Mehrpunkt | N = 16/22/29/37, w = 46,1/44,0/42,4/40,8 %; w_P = 21,5/22,3; w = 28 % | Ausgleichsgerade w über lg N: w_L = 43,27 %; I_P = 21,37 %; I_C = 0,715 (weich); über der A-Linie (16,99) → TM | identisch |
| B2 Einpunkt | N = 24, w = 31,0 % | w_L = 31,0·(24/25)^0,121 = 30,85 %; I_P = 11,5 % → TL | identisch |
| B3 organisch | w_L = 62,4 %, I_P = 21,9 % unter der A-Linie (30,9) | Rechner: OU | OU (siehe T2-B-2) |
| B4 Konsolidierung | h = 4 m zweiseitig, Δσ = 100 kN/m², E_s = 5 MN/m², c_v = 2 m²/a | s_∞ = 80 mm; t₅₀ = 0,394 a; t₉₀ = 1,696 a; U(T_v) gegen exakte Reihe ≤ 0,6 % | identisch |
| B5 Mohr-Coulomb/Rankine | c = 10, φ = 30°, σ₃ = 100; φ = 32,5°, γ = 19, h = 4 m | σ₁,f = 334,6 kN/m²; E_a = 45,75 kN/m | identisch |

**Befunde**
- **behoben (Teil) – T2-B-1:** Die Zustandsformen (breiig 0–0,5, weich 0,5–0,75, steif 0,75–1,0, halbfest/fest > 1,0) waren in Kern und Formelquelle „nach DIN EN ISO 14688-2“ zitiert. DIN EN ISO 14688-2 grenzt aber anders ab: < 0,25 / 0,25–0,50 / 0,50–0,75 / 0,75–1,00 / > 1,00 (öffentlich: [Geocentrix, ISO 14688-2 Consistency](https://www.geocentrix.co.uk/help/content/references/iso14688/consistency_of_cohesive_soils.htm); [UNITRACC, Zustandsform des Bodens](https://www.unitracc.com/e-learning/modules/be-02-open-cut-method-lesson-geotechnical-and-hydrogeological-principles-4-duplicate/bodenmechanische-grundlagen/konsistenz-und-plastizitaet-1/beschreibung-der-zustandsform-des-bodens)). Die verwendete Einteilung ist die der früheren DIN 18122-1. Quelle in Fachtext, Kern und Grenzen ist berichtigt („vorläufig, F-Freigabe“).
  - **Frage T2-B-1:** Bei der Lehreinteilung nach der früheren DIN 18122-1 bleiben oder auf die Einteilung der DIN EN ISO 14688-2 umstellen? Die Umstellung ändert Zustandswörter im Rechner und im Beispiel („w = 35 % → I_C = 0,40, breiig“). Die deutschen Bezeichnungen der Norm sind am Normtext zu bestätigen.
- **offen – Frage T2-B-2:** Bei organischen Beimengungen, w_L > 50 % und einem Punkt unterhalb der A-Linie meldet der Rechner OU. Nach dem Kernkommentar ist OU aber für w_L = 35 … 50 % definiert, OT für w_L > 50 % oberhalb der A-Linie. Frage: Soll dieser Bereich als „OU/OH, Zuordnung nach DIN 18196 prüfen“ ausgegeben werden, oder ist OU dort gewollt?
- Hinweis: Einpunktverfahren mit dem Exponenten 0,121 (ASTM D4318) bleibt „vorläufig“ (Grenzen).

**F-Freigabe-Stellen:** Exponent des Einpunktverfahrens nach DIN EN ISO 17892-12; Zustandsformen (T2-B-1).

**Empfehlung:** freigabefähig nach Klärung von T2-B-1 und T2-B-2.

- [ ] Modul freigeben

## 12. Glaser / Feuchteschutz – Vertiefung (`feuchteschutz`)

**Prüfumfang:** `src/calc/glaser.ts` über Tranche 1 hinaus: Tauwasser im nicht belüfteten Dach (mit/ohne Dampfbremse, Verdunstungsklima Dach), Innendämmung, Holzrahmenwand, s_d-Regel der nachweisfreien Dächer; Fachtext `content/feuchteschutz/Feuchteschutz.json` (Beispiele, Kriterien).

**Nachrechnungen**
- Eigene Tangentenkonstruktion: untere konvexe Hülle über die Schichtgrenzen, Magnus über Wasser/Eis, R_si = 0,25, R_se = 0,04, δ₀ = 7,2·10⁻⁷ kg/(m·h·Pa), 2 160 h.

| Fall | Aufbau (innen → außen) | Handrechnung | Kern |
|---|---|---|---|
| G4 Dach ohne Dampfbremse | GK 12,5 mm (µ 8), MW 200 mm, Unterdeckbahn s_d = 0,1 m; Dachklima 2 000 Pa | Tauwasserebene an der Unterdeckbahn; M_c = 2,60 kg/m² > 1,0 (und > 0,5 an nicht kapillarer Schicht); M_ev = 16,6 kg/m² | identisch; Kriterium „nicht eingehalten“ |
| G5 Dach mit Dampfbremse | wie G4 + s_d = 2 m raumseitig | kein Tauwasser; U = 0,165 W/(m²K) | identisch |
| G6 Innendämmung | Gipsputz, PUR 60 mm (µ 50), Kleber, Ziegel 36,5 cm | Tauwasser an der Grenze PUR/Kleber; M_c = 0,079; M_ev = 0,510 kg/m² | identisch |
| G7 Holzrahmenwand | OSB 15 mm (µ 200), Dämmung 160 mm, Holzfaser 60 mm (µ 5) | kein Tauwasser; U = 0,174 | identisch |
| G8 s_d-Regel | s_d,e = 0,05 / 0,3 / 1,0 / 2,5 m | s_d,i ≥ 1,0 / 2,0 / 6,0 m / Nachweis erforderlich | identisch |

**Befunde:** keine Rechenfehler.
- Hinweis (keine Änderung): Die zulässige Erhöhung des Feuchtegehalts von Holz und Holzwerkstoffen (DIN 4108-3) wird nicht gerechnet. Das Ergebnis weist im Text darauf hin („zusätzlich zu prüfen“).

**F-Freigabe-Stellen:** wie Tranche 1, Nr. 9 (Klimarandbedingungen und δ₀ in DIN 4108-3:2024-03, neue Außenbedingungen für verschattete/helle Dächer, Höhenlage bis 700 m).

**Empfehlung:** freigabefähig nach Klärung der F-Stellen (Tranche 1, Nr. 9).

- [ ] Modul freigeben (`feuchteschutz`, gemeinsam mit Tranche 1, Nr. 9)

---

## Offene Fragen zur Entscheidung (Zusammenfassung)

| Nr. | Modul | Frage |
|---|---|---|
| T2-S-1 | Verankerung | α₆ von der EC2-Empfehlung (1,15/1,41/1,5) auf NA DE Tab. 8.3DE (Stoßanteil, Ø, Abstand; bis 2,0) umstellen? |
| T2-S-2 | Verankerung | Vereinfachte NA-Form l_bd = α₁·α₄·α₅·l_b,rqd·A_s,erf/A_s,vorh mit α₅ = 2/3 bei direkter Lagerung ergänzen; Mindestwerte (8.6)/(8.7) nach NA bestätigen? |
| T2-ST-1 | Statistik | Grubbs: erst ab 1 % entfernen (ISO 5725-2), 5 % nur markieren – oder Entfernung dem Nutzer überlassen – oder beim vereinfachten 5-%-Vorgehen bleiben? |
| T2-B-1 | Bodenmechanik | Zustandsformen nach früherer DIN 18122-1 beibehalten oder auf DIN EN ISO 14688-2 umstellen? |
| T2-B-2 | Bodenmechanik | Organisch, w_L > 50 %, unter A-Linie: Ausgabe OU beibehalten oder „OU/OH – nach DIN 18196 prüfen“? |

Offen aus Tranche 1 und für den Prüfvermerk `stahlbeton_bemessung` weiter nötig: F-1, Q-1, S-2, P-2.

## Nachweis der Prüfung

- **Unabhängige Nachrechnung:** eigenes Python-Skript (numpy 2, scipy 1.18) mit eigener Umsetzung der Gleichungen.
  - Die Kernausgaben wurden über ein getrenntes Ausgabeskript gelesen; 230 Vergleiche.
  - Die Monte-Carlo-Werte stammen aus einer eigenen Simulation mit 10⁶ Läufen und eigenem Zufallsgenerator.
  - Die Sollwerte sind als `tests/modulpruefungTranche2.test.ts` übernommen, ohne Rückgriff auf vorhandene Testwerte.
- **Öffentliche Quellen dieser Prüfung:**
  - [Geocentrix, ISO 14688-2 „Consistency of silts and clays“](https://www.geocentrix.co.uk/help/content/references/iso14688/consistency_of_cohesive_soils.htm) und [UNITRACC, Beschreibung der Zustandsform des Bodens](https://www.unitracc.com/e-learning/modules/be-02-open-cut-method-lesson-geotechnical-and-hydrogeological-principles-4-duplicate/bodenmechanische-grundlagen/konsistenz-und-plastizitaet-1/beschreibung-der-zustandsform-des-bodens) (T2-B-1);
  - die im jeweiligen Modul genannten Quellen (fib Bulletin 34 in öffentlicher Wiedergabe, QNG-Anhänge, UBA TREMOD, ISO 5725-2 über Harvey/LibreTexts), stichprobenweise gegengerechnet.
- **Barrierefreiheit:** a11y-reiter auf den geänderten Routen (`bp_holzprodukte`, `stahlbeton_bemessung`, `spannbeton`, `statistik`, `bodenmechanik`; hell, mobil, dunkel; 138 Reiter-Prüfungen): 0 Verstöße. Dabei behoben: ein bereits vorhandener Kontrastfehler im Dunkelmodus von `bp_holzprodukte` (NKL-Erläuterung `text-slate-900/80` → `text-text-main/80`).
- **Nicht öffentlich belegbar (F-Freigabe):** NA DE Tab. 8.3DE und (8.6)/(8.7)/(8.10). Ein Bericht der BASt war durch Bot-Schutz gesperrt und wurde nicht umgangen.

## Freigabe 28.10.2026

Freigegeben (Empfehlung „freigabefähig“, keine offenen Fragen; Prüfvermerk in `src/data/pruefvermerke.ts` „geprueft“, am 2026-10-28, passiv ohne Namen): `bp_holzprodukte` (Nr. 4), `spannbeton` (Nr. 5; seit der Aufteilung am 28.10.2026 die Teilmodule `spannbeton_grundlagen` und `spannbeton_kennwerte`, beide mit Vermerk – die bei der Aufteilung neu formulierten Einträge (Lernziel 1 von `spannbeton_kennwerte`, zwei Erkundungsaufträge von `spannbeton_grundlagen`, Grenzen-Kurztexte) wurden dabei nachgesehen, die Zahlen der Aufträge nachgerechnet: Δσ = E·Δε 240/120 bzw. 234/117 N/mm², P = g·L²/(8·f) 3571/8036 kN, 21/47 Litzen), `korrosion` (Nr. 7), `schnellkarbonatisierung` (Nr. 8).

Nicht freigegeben, obwohl freigabefähig: die Reiter Rissbreite (Nr. 2) und σ-ε-Linien (Nr. 3) von `stahlbeton_bemessung` – sie zählen erst mit dem ganzen Modul (offen: F-1, S-2, P-2 aus Tranche 1, T2-S-1/-2). `lebensdauerbemessung` (Nr. 6) nur „Rechnung freigabefähig“, Kennwerte vorläufig.

## Nachtrag 28.10.2026 (abends): Entscheidungen T2-S-1 und T2-S-2 umgesetzt

- **T2-S-1:** α₆ nach NA DE Tab. 8.3DE (Zugstoß ≤ 33 %: 1,2/1,4 für Ø < 16/≥ 16 mm; > 33 %: 1,4/2,0; bei lichtem Stoßabstand ≥ 8Ø und Randabstand ≥ 4Ø 1,0 bzw. 1,4; Druckstoß 1,0), vorläufig, F-Freigabe. V3 (Ø 12, > 33 %): l₀ = 676,3 mm statt 724,6 mm.
- **T2-S-2:** vereinfachte NA-Form l_bd = α₁·α₄·α₅·l_b,rqd·A_s,erf/A_s,vorh mit α₅ = 2/3 bei direkter Lagerung als wählbare Nachweisform; Mindestwerte max(0,3·α₁·α₄·l_b,rqd; 10Ø) bzw. 6,7Ø bei direkter Lagerung, Druck max(0,6·l_b,rqd; 10Ø), ohne 100 mm (vorläufig, F-Freigabe). α₄ (angeschweißte Querstäbe) ergänzt.
