# Freigabepaket: Verbindungen & Anschlüsse (`holzbau_verbindung`)

Stand 04.11.2026 · Gruppe „Holzbau“ · Typ `calculator` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif** – Kern in drei Fällen nachgerechnet, T10-HV-1 behoben und T10-HV-3 umgesetzt; offen sind die NA-Ausziehparameter und die A2-Fassung von Gl. (8.38). Die Normpunkte sind in der App gekennzeichnet und gelten nach der Regel vom 02.11.2026 als erledigt.

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Mechanische Holzverbindungen für den Holzbau: Johansen-Theorie (Versagensmodi, Seilwirkung) für Stabdübel, Bolzen, Nägel und Schrauben, Ausziehtragfähigkeit von Holzschrauben nach DIN EN 1995-1-1, 8.7, wirksame Anzahl, Mindestabstände; Teil der Holzbau-Reihe (Komponente HolzbauBeta) mit BSP-Schwingungsnachweis.

Bedeutung für die Lehre: Lehrveranstaltung (Vertiefung, Wahlpflicht, Master, Weiterbildung); in keinem Lernpfad zugeordnet.

## Reiter und Bereiche

Reiter „Verbindungen“ der Komponente HolzbauBeta: Holzschrauben-Rechner mit Rechenweg (Herausziehen, Abscheren), Johansen-Modi, Abstände, Dübel besonderer Bauart.

Komponente `src/modules/HolzbauBeta.tsx`; Inhalt `content/holzbaubeta/HolzbauBauphysik.json`, `content/holzbaubeta/HolzbauBemessung.json`, `content/holzbaubeta/HolzbauBeta.json`, `content/holzbaubeta/HolzbauInfo.json`, `content/holzbaubeta/HolzbauKonstruktion.json`, `content/holzbaubeta/HolzbauVerbindung.json`, `content/holzbaubeta/HolzbauWerkstoffe.json`, `content/holzbaubeta/daten.json`.

## Rechenkerne und Testabdeckung

| Kern | Tests (Zahl der Prüfungen) | Referenzwerte |
|---|---|---|
| `src/calc/holzbau.ts` | `tests/holzbau.test.ts` (20), `tests/holzbauNachweise.test.ts` (42), `tests/durchsichtD.test.ts` (38), `tests/ecKennwerte.test.ts` (45), `tests/kleinfragenTranche1bis3.test.ts` (34), `tests/konsistenz1029.test.ts` (60) und 11 weitere | C24 (ρ_k 350), d = 8, l_ef = 80 mm, 90°, n = 4, NKL 1, mittel: f_ax,k = 12,865 N/mm², F_ax,Rd = 17,64 kN, F_v,Rd = 14,58 kN |
| `src/calc/bspSchwingung.ts` | `tests/bspSchwingung.test.ts` (24), `tests/modulpruefungTranche10.test.ts` (104), `tests/umsetzungNachpruefung2_20261029.test.ts` (35) | BSP 150-L5s, ℓ = 4,6 m: f₁ = 7,36 Hz (Reiter Bauphysik, gemeinsam genutzt) |

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T10-HV-1 | Abstandsregel Stabdübel (8.6, Tab. 8.5) als „8.5“ zitiert; Lochleibung „spröde“, „dickes Blech“ bei Holz-Holz → Texte berichtigt | erledigt (behoben) | T10 (`module-tranche-10.md`) (Nr. 4) |
| T10-HV-2 | Ausziehen nach EN-Gl. (8.39) statt NA-Parametern für Schrauben ohne ETA; Gl. (8.38) nach A2:2014? | offen (Normtext) | T10 (`module-tranche-10.md`) |
| T10-HV-3 | Abscheren vereinfacht mit Nenndurchmesser → Eingabe Kerndurchmesser d₁, d_ef = 1,1·d₁ (leer → Lehrwert 0,65·d) | erledigt (umgesetzt) (29.10.) | T10 (`module-tranche-10.md`); `tests/holzbau.test.ts` |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Für die Freigabe gelten sie als erledigt (Regel vom 02.11.2026, Entscheidung vom 04.11.2026); sie bleiben im Prüfbogen Normtext, Reiter „Nach Normen (04.11.)“, offen. Kennungen nach dem Prüfbogen bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens (28.10.2026).

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| T10-HV-2a | DIN EN 1995-1-1/NA:2013-08, NCI zu 8.7 (Schrauben ohne ETA) | Ausziehparameter nach NA (Tragfähigkeitsklassen, f_ax,k = k·10⁻⁶·ρ_k²?) statt EN-Gl. (8.39) | `src/calc/holzbau.ts:443` |
| T10-HV-2b | DIN EN 1995-1-1/NA:2013-08 (mit DIN EN 1995-1-1/A2:2014), 8.7.2, Gl. (8.38) in der Fassung A2:2014 | Hat A2 die Gl. (8.38) geändert? | Faktor 1/(1,2·cos²α + sin²α) – `src/calc/holzbau.ts:417`; Formelkopf `:394` |

## Quizfragen

6 Fragen, davon 2 nicht freigegeben: `qn_holzbau_verbindung_4`, `qn_holzbau_verbindung_6`.

## Quellen

DIN EN 1995-1-1:2010-12 mit A2:2014 und NA:2013-08 (Normtext nicht öffentlich), DIN 1052 (Tragfähigkeitsklassen). Befundliste Tranche 10, Nr. 4.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Holzschraube C24 (ρ_k = 350 kg/m³), d = 8 mm, l_ef = 80 mm, 90°, n = 4, NKL 1, KLED mittel: f_ax,k = 0,52·d^(−0,5)·l_ef^(−0,1)·ρ_k^0,8 = 12,865 N/mm², F_ax,Rk = 8233 N, F_ax,Rd = 17,64 kN (n_ef = 4^0,9).
2. Abscheren derselben Schraube: f_h,k = 26,40 N/mm², M_y,Rk = 26 743 Nmm, F_v,Rk = 5924 N, F_v,Rd = 14,58 kN.
3. GL24h (ρ_k = 385), d = 10 mm, l_ef = 120 mm, 45°, n = 6, NKL 2, kurz → F_ax,Rd = 45,17 kN, F_v,Rd = 38,40 kN.
4. Kurze Einschraubtiefe: C30, d = 12, l_ef = 60 mm (< 6·d), n = 2, NKL 3 → F_ax,Rd = 7,76 kN mit Warnung.
5. Mit Kerndurchmesser d₁: d_ef = 1,1·d₁, z. B. d_ef = 6,16 mm → f_h,k = 0,082·(1 − 0,01·6,16)·350 = 26,93 N/mm².
6. Am NA prüfen: eigene Ausziehparameter für Schrauben ohne ETA (T10-HV-2a) und Faktor 1/(1,2·cos²α + sin²α) in Gl. (8.38) nach A2:2014 (T10-HV-2b).

## Empfehlung

**freigabereif.** Kern in drei Fällen nachgerechnet, T10-HV-1 behoben und T10-HV-3 umgesetzt; offen sind die NA-Ausziehparameter und die A2-Fassung von Gl. (8.38). Die Normpunkte sind in der App gekennzeichnet und gelten nach der Regel vom 02.11.2026 als erledigt.

Bisher „freigabereif nach Klärung von T10-HV-2a/b“. Die offenen Normpunkte (von T10-HV-2a/b) sind in der App als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und gelten nach der Regel vom 02.11.2026 (Entscheidung vom 04.11.2026) für die Freigabe als erledigt. Sie bleiben im Prüfbogen Normtext offen; nach der Normprüfung wird der Wert angepasst.
