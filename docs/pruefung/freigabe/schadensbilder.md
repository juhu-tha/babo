# Freigabepaket: Typische Bauschäden (Schadensatlas) (`schadensbilder`)

Stand 04.11.2026 · Gruppe „Mängel & Schäden“ · Typ `database` · Prüfvermerk „offen“ (Prüfung ausstehend).

**Empfehlung: freigabereif nach Klärung von T13-IH-12** – Drei Fehler behoben, Beispiele nachgerechnet, der umgezogene Reiter war schon in `bauschaeden` geprüft; offen ist die Rissbreitengrenze für Zementsuspension (Widerspruch zu `instandhaltung`).

Dieses Paket bereitet die Freigabe vor. Es setzt keinen Prüfvermerk; die Freigabe trägt die prüfende Person in `src/data/pruefvermerke.ts` ein.

## Zweck

Schadensatlas für Bauen im Bestand (Termin 3): typische Schadensbilder mit Ursachenanalyse – Feuchte und Schimmel, Risse und Bruchmechanik, Bewehrungs- und Spannungsrisskorrosion, AKR und Sulfattreiben, Unverträglichkeiten, Tief- und Ingenieurbau, seit 02.11.2026 auch Kleb- und Dichtstoffschäden (aus `bauschaeden` übernommen), dazu ein Szenario-Analysator.

Bedeutung für die Lehre: Lehrveranstaltung (Vertiefung, Wahlpflicht, Master, Weiterbildung); Lernpfade: Bauen im Bestand.

## Reiter und Bereiche

Reiter Feuchte & Schimmel, Risse, Korrosion, AKR/Treiben, Unverträglichkeiten, Tief- und Ingenieurbau, Kleb- & Dichtstoff-Schäden (seit #317) und Szenario-Analysator.

Komponente `src/modules/TypischeBauschaeden.tsx`; Inhalt `content/typischebauschaeden/TypischeBauschaeden.json`.

## Rechenkerne und Testabdeckung

Kein Rechenkern in `src/calc/`; die Beispiele (Rissbreite, Bruchmechanik, Mindestfugenbreite) sind in Tranche 13 bzw. – für den umgezogenen Kleb-/Dichtstoff-Reiter – in Tranche 13 (`bauschaeden`) und Nachstichprobe 3 nachgerechnet. `tests/umbauKlebDicht_20261102.test.ts` prüft den Umzug (76 Textschlüssel, Reiterfolge).

## Bisherige Befunde

| Kennung | Befund | Status | Fundstelle |
|---|---|---|---|
| T13-SB-1 | Kongresshalle Berlin 1980 „keine SpRK“ → Planungs-/Ausführungsmängel und Spannungsrisskorrosion nach Gutachten Schlaich/Kordina/Engell | erledigt (behoben) | T13 (`module-tranche-13.md`) (Nr. 2) |
| T13-SB-2 | Kontaktkorrosion: Zink „oberhalb“ der Kupferrinne → „unterhalb (in Fließrichtung)“ | erledigt (behoben) | T13 (`module-tranche-13.md`) |
| T13-SB-3 | Schreibfehler („Kontakkorrosion“, „DIN 18339)::“, „>= 0,1 - 0,3 mm“) | erledigt (behoben) | T13 (`module-tranche-13.md`) |
| T13-IH-12 | Zementsuspension „breite Risse > 0,8 mm“ hier, in `instandhaltung` ab w ≥ 0,2 mm | offen (Normtext) (gekennzeichnet) | T13 (`module-tranche-13.md`) |
| #317 | Reiter Kleb- & Dichtstoff-Schäden aus `bauschaeden` übernommen (Fugenbeispiel ΔL = 4,8 mm, b = 20 mm; NS3-Nachrechnung richtig) | erledigt (Inhalt vorher in `bauschaeden` geprüft) | `nachstichprobe3-2026-10-30.md` |
| T4-BC-2 (Folgeangabe) | Faustregel b : t (IVD) im Kleb-/Dichtstoff-Reiter, mit Verweis auf die Tabelle der DIN 18540; im Prüfbogen nur für `bauchemie` blockierend | nicht blockierend | `PRUEFBOGEN_NORMTEXT` Nr. 2 |

## Offene Normpunkte

Diese Punkte sind im Modul als „vorläufig, Normprüfung ausstehend“ gekennzeichnet und lassen sich nur am Normtext klären. Kennungen nach dem Prüfbogen Normtext (Stand 28.10.2026) bzw. nach der Befundliste; Zeilenangaben in „Wert in der App“ vom Stand des Prüfbogens.

| Kennung | Norm, Fundstelle | Zu prüfen | Wert in der App |
|---|---|---|---|
| T13-IH-12 | TR Instandhaltung (DIBt) bzw. DAfStb-Instandsetzungsrichtlinie | Rissbreitengrenze für das Füllen mit Zementsuspension (> 0,8 mm oder ab 0,2 mm?) | `content/typischebauschaeden/TypischeBauschaeden.json:71` |

## Quizfragen

6 Fragen, davon 1 nicht freigegeben: `q_dauer_2`.

## Quellen

DIN 4108-2/-3, DIN 1045-2, DIN EN 1992-1-1 (Tab. 7.1DE), Handlungsanweisung Spannungsrisskorrosion, Beton- und Stahlbetonbau 75 (1980) H. 12 (Kongresshalle), DIN 18540, DIN 52460, IVD-Merkblätter, TR Instandhaltung. Befundliste Tranche 13, Nr. 2.

## Prüfschritte für die Freigabe (ca. 15 min)

1. Rissbreite Beispiel 1: w_k = s_r,max·(ε_sm − ε_cm) = 200·0,0006 = 0,12 mm ≤ 0,3 mm (XC4).
2. Bruchmechanik Beispiel 2: K_I = 1,12·150·√(π·0,010) = 29,8 MPa√m; kritische Risslänge a_c = (50/168)²/π = 28,2 mm.
3. Fugenbeispiel (Kleb- & Dichtstoffe): ΔL = 6000·10·10⁻⁶·80 = 4,8 mm; b_erf = 4,8/0,25 = 19,2 → 20 mm (ZGV 25 %).
4. Kontaktkorrosion: Kupfer oberhalb, Zink unterhalb in Fließrichtung → Lochfraß am Zink; i_corr = 10 µA/cm² ≈ 116 µm/a.
5. Zementsuspension „Füllen breiter Risse (> 0,8 mm)“ (`content/typischebauschaeden/TypischeBauschaeden.json:71`) gegen `instandhaltung` (ab 0,2 mm) und die TR Instandhaltung prüfen (T13-IH-12).

## Empfehlung

**freigabereif nach Klärung von T13-IH-12.** Drei Fehler behoben, Beispiele nachgerechnet, der umgezogene Reiter war schon in `bauschaeden` geprüft; offen ist die Rissbreitengrenze für Zementsuspension (Widerspruch zu `instandhaltung`).

Nach der Regel der Freigabe vom 02.11.2026 (Tranche 16: im Modul gekennzeichnete Normtextpunkte gelten als erledigt) wäre das Modul schon jetzt freigabereif; nach der Regel vom 28.10.2026 (Normtextpunkte blockieren) erst nach dem Normtextabgleich. Siehe `README.md`, Abschnitt „Zu entscheiden“.
