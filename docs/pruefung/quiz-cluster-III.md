# Prüfliste Quiz – Cluster III: Entwurf & Bemessung

Stand: 28.10.2026 · Grundlage: `src/data/quiz.json` (Felder `vorpruefung` und `verified`), `docs/quiz-pruefhinweise.md`, Lernziele aus `src/data/lernziele.ts`. Erzeugt mit `npx tsx scripts/pruefliste.ts`; gesetzte Kreuze übernimmt das Skript beim nächsten Lauf. quiz.json wurde für diese Liste nicht verändert.

Cluster III umfasst 192 Fragen aus 32 Modulen. Aufgeführt sind 39 auffällige Fragen (Vorprüfung „korrigiert“ oder „fraglich“, offener Prüfhinweis oder neu seit 26.10.2026 ohne Freigabe) und eine Stichprobe von 5 unauffälligen Fragen. Entscheidung je Frage ankreuzen; bei „ändern“ den Änderungswunsch in die Zeile darunter schreiben.

Auffällig im Einzelnen (Mehrfachnennung möglich): 39 korrigiert, 0 fraglich, 0 mit offenem Prüfhinweis, 0 neu seit 26.10.2026.

## A. Auffällige Fragen

### q_bgl_2 · Ausgangsstoffe des Betons

- **Frage:** z = 280 kg/m³, Flugasche f = 80 kg/m³ (k = 0,4), w = 160 kg/m³. Wie groß ist (w/z)eq?
- **Richtige Antwort:** 0,51
- **Auffälligkeit:** Vorprüfung „korrigiert“: Option 4 und Rückmeldung: 0,64 → 0,65 · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_bpx_2 · Betonpraxis

- **Frage:** Beton mit mittlerer Festigkeitsentwicklung, Oberflächentemperatur 12 °C, Klasse XM1. Wie lange ist mindestens nachzubehandeln?
- **Richtige Antwort:** 8 Tage
- **Auffälligkeit:** Vorprüfung „korrigiert“: Mindestdauer der Nachbehandlung nach DIN 1045-3, Tabelle der Oberflächentemperaturen: mittlere Festigkeitsentwicklung 2 Tage sowohl bei 15 bis < 25 °C als auch ab 25 °C. · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_bpx_4 · Betonpraxis

- **Frage:** Der Beton ist auf der Baustelle zu steif. Was ist zulässig?
- **Richtige Antwort:** Fließmittel unter Herstellerverantwortung, mit Lieferscheinvermerk
- **Auffälligkeit:** Vorprüfung „korrigiert“: Zweitprüfung 27.10.: richtige Option und Erklärung an q_hee_2 und das Modul Herstellung & Einbau angeglichen (Fließmittel nur unter Verantwortung des Herstellers, Vermerk auf dem Lieferschein, DIN 1045-2, 7.5) korrigiert.
- [ ] ok
- [x] ändern: an q_hee_2 angeglichen – Fließmittel nur unter Herstellerverantwortung mit Lieferscheinvermerk (DIN 1045-2, 7.5), korrigiert

### q_cbm_2 · Carbonbeton

- **Frage:** Warum kann die Betondeckung bei Carbonbeton deutlich kleiner sein als bei Stahlbeton?
- **Richtige Antwort:** Carbon korrodiert nicht; die Deckung dient im Wesentlichen dem Verbund
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_cbm_4 · Carbonbeton

- **Frage:** Welches Regelwerk ist in Deutschland für Betonbauteile mit Carbonbewehrung maßgebend?
- **Richtige Antwort:** DAfStb-Richtlinie Betonbauteile mit nichtmetallischer Bewehrung
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_esx_3 · Eigenspannungen

- **Frage:** Welcher Anteil einer Temperaturverteilung erzeugt auch im frei gelagerten Bauteil Spannungen?
- **Richtige Antwort:** Der nichtlineare Anteil T_V
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_hee_1 · Herstellung & Einbau

- **Frage:** Steifer Beton wird mit einem Fahrzeug ohne Rührwerk angeliefert. Bis wann soll er nach der ersten Wasserzugabe vollständig entladen sein?
- **Richtige Antwort:** 45 Minuten
- **Auffälligkeit:** Vorprüfung „korrigiert“: Zweitprüfung 27.10.: Dopplung mit q_qsi_5 aufgelöst; Frage auf Fahrzeuge ohne Rührwerk (45 min, Modul Herstellung & Einbau, DIN 1045-2, 7.6) umgestellt, Optionen und Rückmeldungen angepasst korrigiert.
- [ ] ok
- [x] ändern: Dopplung mit q_qsi_5 aufgelöst – Frage auf Fahrzeuge ohne Rührwerk (45 min) umgestellt, korrigiert

### q_hee_2 · Herstellung & Einbau

- **Frage:** Der Beton ist bei Ankunft zu steif. Was ist zulässig?
- **Richtige Antwort:** Ausnahmsweise, unter Verantwortung des Herstellers und mit Lieferscheinvermerk
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_iax_1 · Innenausbau

- **Frage:** Mit welchem Verfahren wird die Belegreife von Estrichen in Deutschland üblicherweise geprüft?
- **Richtige Antwort:** CM-Methode (Calciumcarbid)
- **Auffälligkeit:** Vorprüfung „korrigiert“: Zweitprüfung 27.10.: normRef DIN 18560-1 → TKB-Merkblatt 16 (12/2024) und DIN EN 13892-10 (Entwurf 2024-05), die die CM-Messung regeln, korrigiert.
- [ ] ok
- [x] ändern: normRef auf TKB-Merkblatt 16 (2024-12) und DIN EN 13892-10 (Entwurf) umgestellt, korrigiert

### q_iax_3 · Innenausbau

- **Frage:** Welcher Wassereinwirkungsklasse ist die Bodenfläche einer bodengleichen Dusche im Wohnungsbau zugeordnet?
- **Richtige Antwort:** W2-I
- **Auffälligkeit:** Vorprüfung „korrigiert“: Registry führt DIN 18534-1:2025-10; Klassenbezeichnung W2-I dort nicht separat geprüft. Zweitprüfung 27.10.: Fragetext auf die Bodenfläche der bodengleichen Dusche präzisiert (Wandflächen W1-I), Erklärung ergänzt korrigiert.
- [ ] ok
- [x] ändern: Fragetext auf die Bodenfläche präzisiert (Wandflächen W1-I), korrigiert

### q_iax_4 · Innenausbau

- **Frage:** Welche Qualitätsstufe ist für glänzende Lacke und Streiflicht erforderlich?
- **Richtige Antwort:** Q4
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_nbh_1 · Nachbehandlung

- **Frage:** XD1-Bauteil, Festigkeitsentwicklung mittel (r = 0,35), Oberflächentemperatur 8 °C. Wie lange ist mindestens nachzubehandeln?
- **Richtige Antwort:** 6 Tage
- **Auffälligkeit:** Vorprüfung „korrigiert“: Mindestdauer der Nachbehandlung nach DIN 1045-3, Tabelle der Oberflächentemperaturen: mittlere Festigkeitsentwicklung 2 Tage sowohl bei 15 bis < 25 °C als auch ab 25 °C. · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_qsi_4 · Qualitätssicherung

- **Frage:** Welche Betonbauqualitätsklassen kennt DIN 1045-1000?
- **Richtige Antwort:** BBQ-N, BBQ-E und BBQ-S
- **Auffälligkeit:** Vorprüfung „korrigiert“: Zweitprüfung 27.10.: Option 4, Rückmeldung und Erklärung: DIN 1045-3:2023-08 kennt nur noch ÜK 1 und ÜK 2 (ÜK 3 entfallen; Quelle SCHWENK, Beton-Herstellung nach den aktuellen Normen, 2026) korrigiert. · Normenabgleich: DIN 1045-3:2023: DIN Media nennt DIN 1045-3:2023-08 → Ausgabe bestätigt
- [ ] ok
- [x] ändern: DIN 1045-3:2023 kennt nur noch ÜK 1 und ÜK 2 – Option 4, Rückmeldung und Erklärung angepasst, korrigiert

### q_sbt_2 · Sichtbeton

- **Frage:** Was ist eine typische Ursache für Marmorierungen (Wolkenbildung) auf Sichtbetonflächen?
- **Richtige Antwort:** Örtlich unterschiedliche w/z-Werte in der Randzone, z. B. durch Trennmittelpfützen
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_sob_2 · Sonderbetone

- **Frage:** Welche Aussage zu ultrahochfestem Beton (UHPC) trifft zu?
- **Richtige Antwort:** Hohe Festigkeit durch w/z < 0,25, Silikastaub und dichte Packung; DAfStb-Richtlinie in Vorbereitung
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_stb_4 · Stahlbeton

- **Frage:** Wozu dient die Mindestbiegebewehrung A_s,min?
- **Richtige Antwort:** Damit beim Erstriss kein sprödes Versagen eintritt (Rissmoment aufnehmen)
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### q_stb_6 · Stahlbeton

- **Frage:** Welche Obergrenze gilt nach NA DE für cot θ bei senkrechten Bügeln?
- **Richtige Antwort:** 3,0, zusätzlich begrenzt nach Gl. (6.7aDE)
- **Auffälligkeit:** Vorprüfung „korrigiert“: Erklärung: Gl. (6.7aDE) vollständig (Längsspannungsterm) · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_betonpraxis_1 · Betonpraxis

- **Frage:** Bestandsbauteil, festgelegt f_ck = 30 N/mm², drei Bohrkerne (umgerechnet): 26,0; 25,5; 27,0 N/mm². Anforderungen laut Modul: Mittelwert ≥ 0,85·(f_ck + 1), kleinster Wert ≥ 0,85·(f_ck − 4). Wie lautet das Ergebnis?
- **Richtige Antwort:** Nicht erfüllt – Mittelwert 26,2 < 26,4 N/mm², kleinster Wert ≥ 22,1 N/mm²
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_bindemittel_2 · Bindemittel

- **Frage:** Worin unterscheidet sich ein latent-hydraulischer Stoff (Hüttensand) von einem puzzolanischen Stoff (Flugasche)?
- **Richtige Antwort:** Hüttensand enthält selbst CaO und erhärtet nach alkalischer Anregung; Flugasche braucht Ca(OH)₂ als Partner
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_carbonbeton_1 · Carbonbeton

- **Frage:** Carbonbetonplatte: h = 30 mm, c = 10 mm (d = h − c), a_tex = 80 mm²/m, f_tk = 3000 N/mm² (γ_tex = 1,3), C45/55 mit f_cd = 0,85·45/1,5. Welches Moment m_Rd ergibt sich vereinfacht mit y = F_t/(b·f_cd) und z = d − y/2?
- **Richtige Antwort:** rund 3,0 kNm/m
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_carbonbeton_2 · Carbonbeton

- **Frage:** h = 40 mm, c = 10 mm, f_tk = 2500 N/mm², C50/60: Wird a_tex von 100 auf 200 mm²/m verdoppelt, steigt m_Rd nur von rund 5,1 auf rund 8,9 kNm/m. Warum nicht auf das Doppelte?
- **Richtige Antwort:** Die Druckzone y wächst mit, der Hebelarm z = d − y/2 wird kleiner
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_festbeton_3 · Festbeton

- **Frage:** Warum liefert ein Würfel 150 mm bei gleichem Beton eine höhere Druckfestigkeit als ein Zylinder 150/300 mm?
- **Richtige Antwort:** Beim Würfel (h/d = 1) überlagern sich die Reibungskegel; die behinderte Querdehnung erhöht den Prüfwert
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_grundlagen_2 · Ausgangsstoffe des Betons

- **Frage:** C30/37, XF1, D_max = 16 mm, Zementgehalt z = 330 kg/m³. Höchstwerte: 400 kg/m³ bei z ≤ 300 kg/m³ und 450 kg/m³ bei z ≥ 350 kg/m³. Welcher höchstzulässige Mehlkorngehalt ergibt sich?
- **Richtige Antwort:** 430 kg/m³
- **Auffälligkeit:** Vorprüfung „korrigiert“: Höchstwerte 400/450 kg/m³ (XF/XM, D_max ≥ 16 mm, bis C50/60) und Interpolationsregel nach aktuellem Tabellenwerk bestätigt (Heidelberg Materials, Betontechnische Daten 6.3.4); normRef auf die Registry-Ausgabe 2023-08 umgestellt. Tabellennummer der Ausgabe 2023-08 öffentlich nicht verifizierbar und daher weggelassen (2008-08: Tab. F.4.1). · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_grundlagen_3 · Ausgangsstoffe des Betons

- **Frage:** Welcher Betonzusatzstoff gehört zum Typ I (nahezu inert)?
- **Richtige Antwort:** Kalksteinmehl
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_grundlagen_6 · Ausgangsstoffe des Betons

- **Frage:** Welches Wasser bildet den wirksamen Wassergehalt, auf den sich der w/z-Wert bezieht?
- **Richtige Antwort:** Zugabewasser plus Oberflächenwasser der Gesteinskörnung
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef DIN EN 1008 → DIN EN 206 / DIN 1045-2 · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_holzbau_bauphysik_5 · Bauphysik & Brandschutz

- **Frage:** Zur Verbesserung des Trittschallschutzes soll auf einer BSP-Decke mit f₁ = 8,2 Hz die Schüttung deutlich schwerer ausgeführt werden. Welche Folge ist für den Schwingungsnachweis zu erwarten?
- **Richtige Antwort:** f₁ sinkt, da m wächst – der Nachweis f₁ > 8 Hz kann verloren gehen
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_holzbau_verbindung_4 · Verbindungen & Anschlüsse

- **Frage:** Vollgewindeschraube d = 8 mm, l_ef = 100 mm, rechtwinklig zur Faser (k_α = 1,0), in GL24h (ρ_k = 385 kg/m³). Mit dem Lehrwert f_ax,k = 12 N/mm² und F_ax,Rk = f_ax,k·k_α·(ρ_k/350)^0,8·d·l_ef: Wie groß ist F_ax,Rk einer Schraube?
- **Richtige Antwort:** rund 10,4 kN
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_innenausbau_1 · Sammlung

- **Frage:** Zwei Estriche werden mit der CM-Methode geprüft: beheizter Calciumsulfat-Fließestrich 0,4 CM-%, unbeheizter Zementestrich 1,9 CM-%. Welche Aussage trifft nach den Richtwerten des Moduls zu?
- **Richtige Antwort:** Nur der Zementestrich ist belegreif (1,9 ≤ 2,0); der CAF nicht (0,4 > 0,3)
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_innovative_werkstoffe_1 · Entwicklungen

- **Frage:** 3D-Druck: ρ = 2000 kg/m³, Zielhöhe H = 0,5 m, τ₀,₀ = 500 Pa, Thixotropierate A_thix = 100 Pa/min. Mit τ₀(t) = τ₀,₀ + A_thix·t und τ_req = ρ·g·H/√3: Welche Steigrate darf höchstens gewählt werden?
- **Richtige Antwort:** rund 0,58 m/h
- **Auffälligkeit:** Vorprüfung „korrigiert“: Rückmeldung: „Tresca“ → „von Mises“ · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_innovative_werkstoffe_4 · Entwicklungen

- **Frage:** Für Stahlbetondecken im üblichen Hochbau soll der CO₂-Fußabdruck des Bindemittels deutlich sinken, ohne den Transportbetonprozess grundlegend zu ändern. Welche Wahl ist nach dem Modul am besten begründet?
- **Richtige Antwort:** LC³-artiger Zement (CEM II/C-M, Q-LL): halber Klinkeranteil, genormt nach DIN EN 197-5
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_mischungsberechnung_1 · Mischungsberechnung

- **Frage:** Sand 0/4: 750 kg/m³ (trocken), Gesamtfeuchte 5,0 M.-%, Kernfeuchte (Wasseraufnahme) 1,0 M.-%. Der wirksame Wassergehalt soll 170 kg/m³ betragen. Wie viel Zugabewasser ist zu dosieren?
- **Richtige Antwort:** 140 kg/m³
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_mischungsberechnung_4 · Mischungsberechnung

- **Frage:** Ein Gemisch mit D_max = 16 mm hat die Durchgänge 45 % bei 4 mm und 65 % bei 8 mm. Regelsieblinien bei 4/8 mm: A16 = 36/60 %, B16 = 56/76 %, C16 = 74/88 %. Wie ist die Ist-Sieblinie einzuordnen?
- **Richtige Antwort:** Zwischen A16 und B16 – günstiger Bereich
- **Auffälligkeit:** Vorprüfung „korrigiert“: Zweitprüfung 27.10.: Regelsieblinien A16/B16/C16 auf die üblichen Lehrbuchwerte nach DIN 1045-2 Anh. L korrigiert (4/8 mm: 36/60, 56/76, 74/88 %; vorläufig, F-Freigabe), Einordnung unverändert A–B, geprüft mit src/calc/mischung.ts – korrigiert
- [ ] ok
- [x] ändern: Klärung erforderlich: Die im Fragetext (und im Modul Mischungsberechnung, Sieblinien-Diagramm) genannten Durchgänge A16 = 35/50 %, B16 = 50/71 %, C16 = 71/85 % bei 4/8 mm weichen vermutlich von den Regelsieblinien nach DIN 1045-2, Anhang L ab (dort nach Literatur etwa A16 36/60 %, B16 56/76 %, C16 74/88 %); öffentlich nicht verifizierbar. Die Antwort „zwischen A16 und B16“ bliebe mit beiden Wertesätzen richtig. Werte am Normtext prüfen.

### qn_nachbehandlung_1 · Nachbehandlung

- **Frage:** E = 5·[(T_c + 18)^2,5 − r·(T_a + 18)^2,5]·(V + 4)·10⁻⁶ mit Betontemperatur 25 °C, Lufttemperatur 20 °C, r = 0,50 und Wind 20 km/h. Wie groß ist E und wie ist sie einzustufen?
- **Richtige Antwort:** 0,92 kg/(m²·h) – knapp unter dem kritischen Wert 1,0
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_nachbehandlung_3 · Nachbehandlung

- **Frage:** Warum entstehen auf einer ungeschützten frischen Betonfläche bei trockenem, windigem Wetter Frühschwindrisse?
- **Richtige Antwort:** Verdunstung übersteigt die Wassernachlieferung durch Bluten; kapillare Zugspannungen reißen den jungen Beton
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_nachbehandlung_4 · Nachbehandlung

- **Frage:** Eine Bodenplatte wird bei 30 °C, 30 % relativer Luftfeuchte und kräftigem Wind betoniert (berechnete Verdunstung > 1,0 kg/(m²·h)). Welche Maßnahme ist am besten geeignet?
- **Richtige Antwort:** Unmittelbar nach dem Abziehen abdecken oder Nachbehandlungsmittel aufsprühen
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_sichtbeton_3 · Sichtbeton (SB 1–4)

- **Frage:** An einer Sichtbetonwand treten entlang der Schalungsstöße Kiesnester auf, die Fläche dazwischen ist einwandfrei. Welche Ursache ist am wahrscheinlichsten?
- **Richtige Antwort:** Undichte Schalungsfugen, durch die Zementleim ausgelaufen ist
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_sichtbeton_4 · Sichtbeton (SB 1–4)

- **Frage:** Wie soll Trennmittel bei Sichtbeton aufgebracht werden, und warum?
- **Richtige Antwort:** Sehr dünn und gleichmäßig, da Überschuss zu Flecken und Verfärbungen führt
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_spannbeton_1 · Spannbeton

- **Frage:** Kriechen und Schwinden verkürzen den Beton um Δε = 1,2 ‰. Wie groß ist der Spannungsverlust einer Litze Y1860 (E_p = 195 000 N/mm², σ_pm0 = 1360 N/mm²) in Prozent von σ_pm0?
- **Richtige Antwort:** rund 17 %
- **Auffälligkeit:** Vorprüfung „korrigiert“: normRef ergänzt · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

### qn_wu-bauwerke_1 · WU-Bauwerke (Weiße Wannen)

- **Frage:** Welche Bauweise verhindert durch vollflächigen Verbund der Abdichtung mit dem Frischbeton, dass Wasser bei einer punktuellen Verletzung die Abdichtung hinterläuft?
- **Richtige Antwort:** Gelbe Wanne (FBV-Bahnen)
- **Auffälligkeit:** Vorprüfung „korrigiert“: Distraktoren angeglichen · bereits freigegeben (verified)
- [x] ok
- [ ] ändern: …

## B. Stichprobe unauffälliger Fragen (5)

Auswahl deterministisch (Sortierung nach FNV-1a-Hash der Frage-ID), damit die Stichprobe nachvollziehbar ist.

### q_hyf_2 · Hydratation & Folgen

- **Frage:** z = 280 kg/m³ LH-Zement mit Q = 250 kJ/kg, c·ρ = 2500 kJ/(m³·K). Wie groß ist ΔT_ad?
- **Richtige Antwort:** rund 28 K
- **Auffälligkeit:** keine – Vorprüfung „ok“
- [x] ok
- [ ] ändern: …

### qn_holzbau_bemessung_1 · Bemessung (EC5)

- **Frage:** Warum ist k_mod für eine ständige Last (z. B. Eigengewicht) kleiner als für eine kurze Last (z. B. Schnee)?
- **Richtige Antwort:** Holz verliert unter lang andauernder Last an Festigkeit (Zeitstandverhalten)
- **Auffälligkeit:** keine – Vorprüfung „ok“
- [x] ok
- [ ] ändern: …

### qn_holzbau_bemessung_3 · Bemessung (EC5)

- **Frage:** Eine Stütze ist unten eingespannt und oben frei (Kragstütze), Systemlänge L = 2,8 m. Welche Knicklänge l_ef ist anzusetzen?
- **Richtige Antwort:** 5,6 m
- **Auffälligkeit:** keine – Vorprüfung „ok“
- [x] ok
- [ ] ändern: …

### qn_holzbau_bemessung_2 · Bemessung (EC5)

- **Frage:** Brettschichtholz GL24h (f_c,0,k = 24 N/mm²), Nutzungsklasse 2, KLED kurz (k_mod = 0,9), γ_M = 1,3. Wie groß ist f_c,0,d?
- **Richtige Antwort:** 16,6 N/mm²
- **Auffälligkeit:** keine – Vorprüfung „ok“
- [x] ok
- [ ] ändern: …

### q_stb_1 · Stahlbeton

- **Frage:** Wie groß ist f_cd für C30/37 nach deutschem NA?
- **Richtige Antwort:** 17,0 N/mm²
- **Auffälligkeit:** keine – Vorprüfung „ok“
- [x] ok
- [ ] ändern: …

## C. Lernziel-Stichprobe (5 Module)

Quelle: `src/data/lernziele.ts`. Zu prüfen: Lernziele operationalisiert („Sie können …“ + beobachtbares Verb), Bloom-Stufe passend, fachlich richtig, mit den Modulinhalten und Quizfragen abgedeckt.

### holzbau_bauphysik · Bauphysik & Brandschutz

Niveau B/M · 90 min · Vorwissen: holzbau_bemessung, brandschutz

- (Verstehen) Sie können die Schutzwirkung der Holzkohleschicht und die Bedeutung der Abbrandraten nach DIN EN 1995-1-2 erläutern.
- (Anwenden) Sie können die effektive Abbrandtiefe d_ef und den Restquerschnitt eines Holzbauteils für eine geforderte Branddauer berechnen.
- (Anwenden) Sie können die Eigenfrequenz einer Brettsperrholzdecke berechnen und mit dem Gebrauchstauglichkeitskriterium vergleichen.
- (Analysieren) Sie können konstruktive Maßnahmen zur Trittschallminderung im Holzbau nach ihrer Wirkung vergleichen.

- [x] ok
- [ ] ändern: …

### nachbehandlung · Nachbehandlung

Niveau B · 45 min · Vorwissen: frischbeton, hydratation_folgen

- (Verstehen) Sie können die Ziele der Nachbehandlung und die Folgen zu früher Austrocknung wie Frühschwinden und Festigkeitsverlust erläutern.
- (Anwenden) Sie können die Verdunstungsrate einer Betonoberfläche aus Luft- und Betontemperatur, relativer Luftfeuchte und Windgeschwindigkeit berechnen.
- (Anwenden) Sie können die Mindestdauer der Nachbehandlung nach DIN 1045-3 aus Festigkeitsentwicklung r, Oberflächentemperatur und Expositionsklasse ermitteln.
- (Bewerten) Sie können für gegebene Witterungsbedingungen geeignete Nachbehandlungsmaßnahmen auswählen und begründen.

- [x] ok
- [ ] ändern: …

### festbeton · Festbeton

Niveau B · 75 min · Vorwissen: grundlagen, statistik

- (Erinnern) Sie können die Druckfestigkeitsklassen für Normal-, Schwer- und Leichtbeton mit charakteristischer Zylinder- und Würfelfestigkeit zuordnen.
- (Verstehen) Sie können den Einfluss der Querdehnungsbehinderung auf die Prüfwerte von Zylinder und Würfel erläutern.
- (Anwenden) Sie können die mittlere Druckfestigkeit zu einem frühen Betonalter mit dem Entwicklungsbeiwert berechnen.
- (Anwenden) Sie können aus einer Prüfserie Mittelwert und Standardabweichung berechnen und das Mittelwert- und Einzelwertkriterium der Konformität prüfen.

- [x] ok
- [ ] ändern: …

### holzbau_werkstoffe · Werkstoffe & dataholz

Niveau B · 45 min · Vorwissen: holz, holzwerkstoffe

- (Verstehen) Sie können die charakteristischen Festigkeits- und Steifigkeitswerte von Vollholz nach DIN EN 338 und Brettschichtholz nach DIN EN 14080 vergleichen und ihre Verwendung in der Bemessung erläutern.
- (Verstehen) Sie können das Schwind- und Quellverhalten von Holz unterhalb des Fasersättigungspunkts und seine Anisotropie in radialer, tangentialer und longitudinaler Richtung erläutern.
- (Anwenden) Sie können die Maßänderung eines Holzquerschnitts aus Holzart, Feuchteänderung und Jahrringlage berechnen.
- (Analysieren) Sie können Wand-, Decken- und Dachaufbauten im Holzbau nach Schichtenfolge, U-Wert, Brandschutzklasse und Schallschutz vergleichen.

- [x] ok
- [ ] ändern: …

### innenausbau · Sammlung

Niveau B · 120 min · Vorwissen: gips, daemmstoffe, ausbau

- (Analysieren) Sie können die Estricharten nach DIN EN 13813 und DIN 18560 sowie Plattenwerkstoffe im Trockenbau nach Bindemittel, Eigenschaften und Einsatzbereich unterscheiden.
- (Anwenden) Sie können die Restfeuchte eines Estrichs mit der CM-Methode ermitteln und die Belegreife für Zement- und Calciumsulfatestriche prüfen.
- (Erinnern) Sie können die Qualitätsstufen Q1 bis Q4 der Verspachtelung ihren Anforderungen an die Oberfläche zuordnen.
- (Anwenden) Sie können die Resonanzfrequenz einer zweischaligen Trockenbauwand aus den Beplankungen und der Steifigkeit des Hohlraums berechnen.
- (Bewerten) Sie können für Innenräume die erforderliche Abdichtung im Verbund nach DIN 18534 auswählen und begründen.

- [x] ok
- [ ] ändern: …
