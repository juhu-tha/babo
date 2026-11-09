# a11y 09.11.2026 – Regler-Ansagen, SVG-Textalternativen, Überschriftenfolge

Folgeauftrag aus der Kurzzeilen-Stichprobe 04.11. (`docs/pruefung/kurzzeilen-2026-11-04.md`, Ratsche `REGLER_OFFEN`). Branch `a11y/regler-svg-11-09` ab `audit/kleinpunkte-11-04` (#326) mit eingemergtem `a11y/kurzzeilen-11-04` (#329). Sichtbare Darstellung unverändert (Stichprobe unten). Prüfvermerke, Quiz und Inhalte unverändert. Prüfungen: `tests/a11yRegler1109.test.ts`, `tests/kurzzeilen1104.test.ts`.

## 1. Module mit Reglern ohne Ansage (WCAG 4.1.3, 4.1.2)

Alle 25 Module aus `REGLER_OFFEN` haben eine kurze Ergebnis-/Zustandsansage über `<ErgebnisAnsage>` (gemeinsames Ansagebündel, Ansage nach der Ruhezeit, deutsch formatiert über `ansageWert`/`formatDeZahl`). Die bisher unbeschrifteten Roh-Regler (`<input type="range">`) dieser Module haben `aria-label` und `aria-valuetext` (Wert + Einheit, Dezimalkomma). Die Komponente `Slider` setzte `aria-valuetext` schon selbst.

| Datei (Module) | Ansage | Regler mit aria-valuetext |
|---|---|---|
| `Analytik.tsx` (analytik) | TGA: Masse + Prozess; MIP: Porenradius + Porenart | Temperatur (°C), Druck (bar) |
| `KlebstoffBerater.tsx` (bp_klebstoffe) | Fugennennbreite b, Dichtstofftiefe t, ΔL | Bauteillänge (m), ΔT (K) |
| `Zementchemie.tsx` (bindemittel) | Gefügesimulator: Zeitstufe, Hydratationsgrad, f_c, Porosität; Bogue: C3S/C2S/C3A/C4AF | Hydratationszeit (Stufentext), w/z |
| `InnovativeWerkstoffe.tsx` | Status 3D-Druck, SF plastisch, SF Knicken | 5 Regler (m, m/h, Pa/min, mm, kg/m³) |
| `Innenausbau.tsx` | Belegreife mit CM-Wert und Richtwert | CM-Wert (CM-%) |
| `Bruchmechanik.tsx` | K_I und Bruch-/Stabilitätsaussage | (Slider) |
| `Brandschutz.tsx` | Gastemperatur, Abbrandtiefe, Restquerschnitt | (Slider) |
| `Zertifizierung.tsx` (zertifizierung_siegel) | DGNB-Score und Auszeichnung | DGNB-Score (%) |
| `Kreislaufwirtschaft.tsx` (kreislauf_dpp) | UMI mit Input-/Output-Rate; MCI mit LFI und X | 9 Regler (%) |
| `Bestand.tsx` | U-Wert neu, GMoDG-Nachweis, Amortisation | (Slider) |
| `Schadstoffe.tsx` | KI-Index mit Einstufung; Asbest-Baujahrcheck | Baujahr |
| `Holzkorrosion.tsx` | Holzfeuchte mit Gefährdungsbereich | Holzfeuchte (%) |
| `korrosion/DeckschichtenVergleich.tsx` (metallkorrosion) | Pilling-Bedworth-Verhältnis mit Bewertung | (Zahlenfelder beschriftet) |
| `WeitereOrganik.tsx` | Standzeit, Qualitätsabbau in 10 Jahren | 4 Regler (Stufe x von 5) |
| `BimBaustoffe.tsx` | „IFC-Datensatz aktualisiert“ mit den vier Kennwerten | 4 Regler (kg/m³, W/(m·K), N/mm², kg CO₂-Äq./m³) |
| `Materialdatenbanken.tsx` | GWP A1–A3 (t CO₂-Äq.) und PENRT (GJ) der Mengen | (Zahlenfelder mit title) |
| `ki/LlmPraxisTeile/MarkdownTab.tsx` (ki_ueberblick … ki_baustoffe, 9 Module) | Token, Kontextauslastung, Kosten | Dokumentenumfang (Seiten) |

Zusätzlich (im Auftrag genannt): `Korrosion.tsx` – die vier Roh-Regler haben `aria-label` und `aria-valuetext` (Chloridgehalt „… % bezogen auf Zementgehalt“, Feuchte %, Betondeckung mm, Wirkungsdauer Jahre); die Ansage bestand schon.

Ratsche `REGLER_OFFEN` in `tests/kurzzeilen1104.test.ts`: **25 → 0** (Liste leer). Folge: `ki_prompting` braucht keine Ausnahme mehr (sein Komponentenbaum enthält jetzt die Ansage des Token-Rechners) – gestrichen, `MAX_AUSNAHMEN` 3 → 2.

## 2. Statische Ratschen (`tests/a11yRegler1109.test.ts`)

| Zähler | vorher (Basis 42bcd7cb) | nachher | Regel |
|---|---|---|---|
| Roh-Regler ohne `aria-valuetext` | 348 | **311** | darf nur sinken |
| `<svg>` ohne Textalternative | 118 | **0** | darf nur sinken |
| Überschriftensprünge (je Datei, Quelltextreihenfolge) | 45 | **0** | darf nur sinken |

Die Zähler prüfen sich an kleinen Beispielen selbst. Überschriften in HTML-Vorlagen für Druckfenster (`class=`) zählen nicht.

### SVG-Grafiken (118)

- 88× `role="img"` mit `aria-label` (Schemata, Diagramme, Skizzen; Text aus der zugehörigen Überschrift bzw. Beschreibung des Dargestellten, dynamisch z. B. „Ersatzschaltbild ${name}“, „Querschnitt ${profileSeries}-Profil“).
- 7× `role="group"` mit `aria-label` bei SVGs mit anklickbaren Teilen (Fertigteile, Betonwaren, Statistik-Sandbox, Expositionsskizze) – die Kindelemente bleiben erreichbar.
- 23× `aria-hidden="true"`: Symbole (Hilfs-Icons in `moduleinfo/daten.tsx`, Belastungssymbole in Schaltflächen des Rheologie-Simulators, Häkchen/Kreuz neben dem Rissbreiten-Ergebnis), Hintergründe (Rauschen im XRD-Bild, Feld-/Radarlinien ZfP) und kleine Illustrationen, deren Information daneben als Text steht (Isotropie/Homogenität, Rein-/Rohdichte).

### Überschriftenfolge (45 Sprünge, 117 Überschriften in 39 Dateien)

Bei einem Sprung (z. B. h2 → h4) wird der Abschnitt ab der zu tiefen Überschrift um eine Ebene angehoben, bis eine Überschrift der vorherigen Ebene folgt (Unterüberschriften wandern mit). Ergebnis: 73× h4 → h3, 43× h5 → h4, 1× h6 → h4 (Feuchteschutz). Damit sich nichts sichtbar ändert, tragen angehobene Überschriften die Klasse `wie-h4`/`wie-h5`; `src/index.css` gibt ihnen mit gleicher Spezifität wie die globalen Regeln `h4`/`h5`/`.dark h4` die frühere Schriftgröße (15 px bzw. 14 px) und im Dunkelmodus die frühere Farbe (slate-200 statt slate-50 für h3). Die eine frühere h6 behält ihr Aussehen über `text-[9.5px]`/`text-slate-400` (stärkere Regeln). Der Test prüft die CSS-Regeln und dass `wie-hN` nur an angehobenen Ebenen steht.

## 3. QA

- `tsc`, `npm test` (alle Tests), `check:formeln`, `check:zahlen`, `check-design`, `check-verwaist --strict`, `check-any`, Build, `check-bundle`: ohne Befund.
- a11y-reiter (axe, WCAG 2.1 A/AA + 2.2 target-size) auf allen 120 betroffenen Routen (Komponentenbaum enthält eine geänderte Datei), desk/mob/desk-dunkel, jeder Reiter: **1842 Prüfungen, 0 Verstöße**.
- Bildschirmfoto-Stichprobe, Basis (42bcd7cb) gegen neu, Desktop 1440, hell und dunkel, ganze Seite, Animationen aus: `kreislauf_dpp`, `feuchteschutz`, `bindemittel`, `bruchmechanik`, `beton_a_z`, `materialmodelle`, `spannbeton_grundlagen`, `bp_verkehr_tunnel`, `innovative_werkstoffe`, `dpp`. 18 von 20 Bildern pixelgleich; `innovative_werkstoffe` hell/dunkel mit 7×3 px Kantenglättung am Blatt-Symbol (Kachel „CO₂: −35 %“, mit bloßem Auge gleich). Berechnete Stile (Schriftgröße, -gewicht, Farbe, Zeilenhöhe, Box) aller Überschriften und SVGs im Hauptbereich: in allen 20 Fällen gleich.

## 4. Offen (Ratsche)

- 311 Roh-Regler in anderen Modulen (meist mit Rechenkern und vorhandener Kurzzeile) ohne `aria-valuetext` – Screenreader sagen dort die rohe Zahl ohne Einheit an. Schwerpunkte: `PruefverfahrenSimulatoren.tsx` (16), `HistorischeBauweisen.tsx` (14), `MechanischePruefungen.tsx` (13), Beispielrechnungen (je 10). Empfehlung: schrittweise auf `Slider` umstellen oder `aria-valuetext` ergänzen; der Höchstwert in `STAND` wird dann nachgezogen.
- Die Überschriftenprüfung ist statisch je Datei; Sprünge über Komponentengrenzen (Modulrahmen → eingebettete Komponente) erfasst sie nicht.
