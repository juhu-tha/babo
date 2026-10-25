# Lizenzinventur (AP 6.8)

Stand: 25.10.2026, Branch `phase6/lizenz`. Zweck: Material Dritter im Repository erfassen, das einer offenen
Lizenz (Inhalte CC BY-SA 4.0, Code MIT) entgegensteht oder davon auszunehmen ist.

> **Keine Rechtsberatung.** Die Einordnungen unten sind eine technische Bestandsaufnahme durch die
> Entwicklung, keine rechtliche Prüfung. Verbindlich entscheidet die THA (Justiziariat, ggf. mit der
> OER-/Open-Access-Beratung der Bibliothek) vor dem Umschalten von `LIZENZ_AKTIV`.

Vorgehen: `git ls-files` nach Binärdateien (Bilder, Schriften, PDF, 3D, Tabellen) durchsucht, Lizenzfelder
aller Abhängigkeiten in `node_modules/*/package.json` gelesen, `src/` nach externen Hosts, `<img>`,
`data:image`, `iframe`, Texturen/3D-Modellen, `<blockquote>`, „Zitat“, „Copyright/License“ sowie nach
Normverweisen mit Tabellennummer („Tab./Tabelle n“) durchsucht und Stichproben gelesen.

**Konsequenz** bedeutet: *kompatibel* (darf unter der Projektlizenz mitverteilt werden, eigene Lizenz bleibt
bestehen), *ersetzen* (vor Aktivierung durch eigenes oder frei lizenziertes Material ersetzen),
*ausnehmen* (bleibt im Angebot, wird aber im Lizenzhinweis ausdrücklich von CC BY-SA ausgenommen).

## 1. Dateien, Schriften, Icons, Bibliotheken

| Item | Quelle | Lizenz | Konsequenz |
|---|---|---|---|
| `public/fonts/inter-regular.woff2`, `inter-bold.woff2` | Inter 4.001 (rsms/inter), per `pyftsubset` auf Teilmenge reduziert (docs/performance.md); Name-Tabelle: „Copyright 2016 The Inter Project Authors“ | SIL Open Font License 1.1 | **kompatibel, aber ausnehmen** (OFL gilt weiter, nicht CC BY-SA). **Mangel:** Der OFL-Lizenztext liegt nicht bei den Schriftdateien; die Teilmenge hat die Lizenzeinträge (Name-ID 13/14) verloren. Vor Aktivierung `LICENSE.txt` aus dem Inter-Repository unverändert als `public/fonts/OFL.txt` ablegen. |
| `public/favicon.svg` | eigene Grafik; Pfade = Lucide-Icon „graduation-cap“ | ISC (Lucide) | kompatibel (ISC-Hinweis in `LICENSE-CONTENT.md`, Abschnitt Drittinhalte) |
| Icons in der Oberfläche | `lucide-react` 0.546 | ISC | kompatibel |
| KaTeX inkl. KaTeX-Schriften (im Build) | `katex`, `react-katex` | MIT | kompatibel |
| Laufzeitbibliotheken: react, react-dom, three, @react-three/fiber, @react-three/drei, chart.js, react-chartjs-2, recharts, motion, jspdf, html-to-image, qrcode, react-markdown, clsx, tailwind-merge, tailwindcss | npm | MIT | kompatibel (Abhängigkeiten, werden nicht umlizenziert) |
| `xlsx` (SheetJS CE 0.18.5), `@google/genai`, `typescript` | npm | Apache-2.0 | kompatibel mit MIT-Projektcode. Hinweis: Apache-2.0 verlangt bei Weitergabe des Builds den Erhalt von Lizenz-/NOTICE-Hinweisen → im Release-Archiv (Zenodo) Drittlizenzliste beilegen (Schritt in `docs/lizenz-ablauf.md`). |
| `dotenv` | npm | BSD-2-Clause | kompatibel |
| Bilder, Fotos, Videos, 3D-Modelle, Texturen, HDRs | – | – | **keine im Repository**: einziges `<img>` ist der zur Laufzeit erzeugte QR-Code (`LecturePollSession.tsx`); 3D-Szenen (Holz/Mauerwerk) sind aus Geometrie erzeugt, keine `Environment`-Presets/Texturen. Alle Diagramme sind im Code gezeichnet (SVG/Canvas). |
| Externe Inhalte (Wikipedia ≈ 700 Links, YouTube 11, Hersteller-/Verbandsseiten) | Verlinkung | – | kompatibel (nur Links, keine eingebetteten Inhalte; keine iframes) |
| Marken/Logos von Siegeln und Zertifikaten (DGNB, QNG, Blauer Engel, LEED …) | nur als Text genannt | Markenrecht | ausnehmen (Namensnennung zulässig; keine Logos im Repo) |

## 2. Normen und Regelwerke (DIN-/CEN-Urheberrecht!)

Normen sind urheberrechtlich geschützt (DIN Media/Beuth, CEN/ISO); das gilt nach § 5 Abs. 3 UrhG auch für
Normen, auf die Gesetze verweisen. Einzelne Zahlenwerte und Klassenbezeichnungen gelten überwiegend als nicht
schutzfähige Fakten – das ist eine Einschätzung, keine Gewissheit; *vollständige* Tabellen in Norm-Struktur,
wörtliche Normtexte und eng angelehnte Beschreibungen sind riskant (Sprachwerk, ggf. Datenbankschutz). Im
Repository liegt **kein** Normtext als PDF oder Volltext. Gefunden wurden:

| Item | Quelle | Lizenz | Konsequenz |
|---|---|---|---|
| `src/data/standards/din1045_2.ts` – Expositionsklassen mit Grenzwerten für alle Klassen (Tab. F.2.1/F.2.2), Kurzbezeichnungen und Beschreibungen nah am Normtext (z. B. „Trocken oder ständig nass“) | DIN 1045-2:2023-08, DIN EN 206:2021-06 | © DIN/CEN | **ausnehmen** (vollständige Tabelle) |
| `src/modules/expositionsklassen/daten.ts` (+ `ExpositionsKurzkarte`, `Expositionsklassen.tsx`) | dieselben Tabellen, zweite Fassung | © DIN/CEN | **ausnehmen** |
| `src/data/standards/eurocode2.ts`, `src/utils/ec2Spannbeton.ts` (`CONCRETE`), `spannbeton/kennwerte/KennwerteBeton.tsx`, `spannbeton/BeiwerteKatalog.tsx` – komplette Kennwertmatrix Tab. 3.1, NDP-Beiwerte | DIN EN 1992-1-1 (+ NA) | © DIN/CEN | **ausnehmen** (Kennwertmatrix); Rechenverfahren/Formeln in eigener Darstellung: kompatibel |
| `src/data/standards/din_en_197.ts` – Zementarten CEM I–VI mit Klinkergehalten (Tab. 1) | DIN EN 197-1:2011-11, DIN EN 197-5:2021-07 | © DIN/CEN | **ausnehmen** |
| `src/data/standards/din1045_3.ts` – Nachbehandlungsklassen, Mindestdauern (Tab. NA.1, Tab. 4) | DIN 1045-3:2023-08, DIN EN 13670 | © DIN/CEN | **ausnehmen** |
| `FestbetonStatistik.tsx` – Konformitätskriterien Tab. 14 | DIN EN 206:2021-06 | © DIN/CEN | **ausnehmen** |
| `StahlbauEC3.tsx`, `src/calc/stahlbau.ts` – Stahlgüten Tab. 3.1, Querschnittsklassen Tab. 5.2, Knicklinien Tab. 6.1/6.2 | DIN EN 1993-1-1 | © DIN/CEN | **ausnehmen** (Tabellenwerte) |
| `SommerlicherWaermeschutz.tsx`, `src/calc/sommerWaermeschutz.ts` – anteilige Sonneneintragskennwerte (Tab. 8), Abminderungsfaktoren (Tab. 7), Grenzwerte (Tab. 9) | DIN 4108-2 (2013-02, mit Hinweisen auf 2026-05) | © DIN | **ausnehmen** |
| `BpBetonzusatzmittel.tsx` – Anforderungen je Wirkungsgruppe (Tab. 2–8) | DIN EN 934-2 | © DIN/CEN | **ausnehmen** |
| weitere Module mit einzelnen Normwerten und Tabellenverweisen (u. a. `Frischbeton`, `Festbeton`, `Mischungsberechnung*`, `Holzwerkstoffe`, `EModul`, `Betonkennwerte`, `Sicherheitskonzept`, `WUBauwerke`, `SpannbetonDauerhaftigkeit`, `HydratationRissberechnung`, `src/calc/verankerung.ts`, `src/calc/korrosionsschutz.ts`, `src/data/rechnerGrenzen.ts`, `src/data/centralNormenRegistry.ts` [nur Titel/Links]) | diverse DIN/EN/ISO | © Normungsorganisationen | einzelne Werte mit Quellenangabe: voraussichtlich kompatibel (Fakten, Zitat § 51 UrhG); pauschal über den Ausnahmehinweis abgedeckt |
| `ki/RagDemonstrator.tsx` – „Norm-Chunks“ als Beispielkorpus | eigene Zusammenfassungen von DIN 1045-2, EC2, DIN 18533-1 | eigene Formulierung | kompatibel (keine Normtexte) |
| VDI-Richtlinien, WTA-Merkblätter, DAfStb-Richtlinien, DBV-Merkblätter (Verweise, einzelne Werte) | Verbände/Verlage | © Herausgeber | wie Normen: nur Verweise/Einzelwerte, über den Ausnahmehinweis abgedeckt |
| `abfaelle/LagaPn98.tsx`, `BodenMaterialAufbereitung.tsx` – Probenanzahl/Mindestvolumen (LAGA PN 98 Tab. 2/3) | LAGA Mitteilung 32 | unklar (Vollzugshilfe der Länder; „amtliches Werk“ nach § 5 UrhG?) | **prüfen**; bis dahin ausnehmen |
| EBV-Materialwerte, AVV, GEG, KrWG, BayBO u. a. | Gesetze/Verordnungen | gemeinfrei (§ 5 Abs. 1 UrhG) | kompatibel |

## 3. Zitate

| Item | Quelle | Lizenz | Konsequenz |
|---|---|---|---|
| `nachhaltigkeitdatenregeln/DefinitionenTab.tsx` Z. 54 – Brundtland-Definition (deutsche Fassung) | WCED 1987, „Our Common Future“; deutsche Übersetzung (Hauff 1987) | Zitat (§ 51 UrhG); Übersetzung geschützt | **ausnehmen** (als Zitat gekennzeichnet) |
| `DefinitionenTab.tsx` Z. 163 – „Nachhaltiges Bauen ist …“ in Anführungszeichen | angegeben: DIN EN 15643 / BMWSB Leitfaden Nachhaltiges Bauen | © DIN/CEN bzw. amtliches Werk? | **ausnehmen**; Wortlaut gegen die Quelle prüfen – stammt er nicht wörtlich daher, Anführungszeichen entfernen und als eigene Definition kennzeichnen |
| `Baustoffkunde.tsx` – „Kernaussagen“ der Pioniere | ausdrücklich „Zusammenfassung, kein Originalzitat“ | eigene Formulierung | kompatibel |
| `messenpruefen/BegriffeTab.tsx` – `<blockquote>`-Beispiele | eigene Beispiele | eigene Formulierung | kompatibel |

## 4. Sonstige Rechtsfragen (Blocker für die Aktivierung)

1. **Rechteinhaberschaft (Art. 18 Satz 3 BayHIG):** Art. 18 BayHIG („Diensterfindungen“) weist der Hochschule
   die Schutzrechte an Diensterfindungen zu und erstreckt das „entsprechend“ auf vermögensrechtliche Befugnisse
   nach dem Urheberrechtsgesetz. Für Computerprogramme kommt § 69b UrhG hinzu (Arbeitgeber/Dienstherr erhält
   die vermögensrechtlichen Befugnisse). Ob die THA am Code und/oder an den Lehrinhalten Rechte hält – und damit
   selbst lizenzieren oder zustimmen muss – ist zu klären. **Blocker für MIT und CC BY-SA.**
2. **Impressum widerspricht offener Lizenz:** „… bedürfen der schriftlichen Zustimmung des Autors“
   (`src/modules/Impressum.tsx`). Vorbereitet: Mit `LIZENZ_AKTIV = true` erscheint stattdessen
   `IMPRESSUM_URHEBERRECHT_OFFEN` aus `src/data/lizenz.ts`.
3. **KI-unterstützt erstellte Inhalte und Code:** Große Teile entstanden mit KI-Werkzeugen (Google AI Studio,
   Claude; siehe Commit-Historie, `GEMINI.md`). Rein maschinell erzeugte Teile sind nach h. M. nicht
   urheberrechtlich geschützt; die Lizenz greift dann nur für menschlich geprägte Anteile. Kein Hindernis für
   die Veröffentlichung, aber in `LICENSE-CONTENT.md` transparent gemacht (Entwurf).
4. **Repository ist privat** (`juhu-tha/babo`). Für Zenodo-Archivierung und OERSI-Auffindbarkeit muss es
   öffentlich sein – vorher Historie auf Geheimnisse prüfen (keine im aktuellen Stand gefunden; `.env` ist
   nicht versioniert).
5. **Uneinheitliche Fassungen derselben Normtabelle** (zwei Expositionsklassen-Datensätze) – fachlich bekannt,
   für die Lizenz nur relevant, weil beide ausgenommen werden müssen.

## 5. Von CC BY-SA 4.0 auszunehmende Inhalte (Liste für den Lizenzhinweis)

- Vollständig oder weitgehend wiedergegebene Normtabellen: DIN 1045-2/DIN EN 206 Tab. F.2.1, F.2.2 und Tab. 14
  (`src/data/standards/din1045_2.ts`, `src/modules/expositionsklassen/daten.ts`, `FestbetonStatistik.tsx`);
  DIN EN 1992-1-1 Tab. 3.1 und NDP-Beiwerte (`src/data/standards/eurocode2.ts`, `src/utils/ec2Spannbeton.ts`,
  `spannbeton/kennwerte/*`, `spannbeton/BeiwerteKatalog.tsx`); DIN EN 197-1/-5 Tab. 1
  (`src/data/standards/din_en_197.ts`); DIN 1045-3 Tab. NA.1 / DIN EN 13670 Tab. 4
  (`src/data/standards/din1045_3.ts`); DIN EN 1993-1-1 Tab. 3.1, 5.2, 6.1, 6.2 (`StahlbauEC3.tsx`,
  `src/calc/stahlbau.ts`); DIN 4108-2 Tab. 7–9 (`SommerlicherWaermeschutz.tsx`,
  `src/calc/sommerWaermeschutz.ts`); DIN EN 934-2 Tab. 2–8 (`BpBetonzusatzmittel.tsx`).
- Normbegriffe, Klassenbezeichnungen und norm-nahe Beschreibungen aller DIN/EN/ISO-Normen sowie Werte aus
  VDI-, WTA-, DAfStb- und DBV-Regelwerken.
- LAGA PN 98 Tab. 2/3 (bis zur Klärung).
- Gekennzeichnete Zitate (Brundtland-Definition in deutscher Übersetzung; Definition „Nachhaltiges Bauen“).
- Marken- und Siegelnamen.
- Schrift Inter (bleibt unter SIL OFL 1.1).

Der Lizenzhinweis (`LIZENZ_AUSNAHMEN` in `src/data/lizenz.ts`) fasst diese Liste zusammen. Empfehlung: die
betroffenen Module zusätzlich im Modulfuß mit „Tabellenwerte: © DIN Media / Normungsorganisation, nicht
CC BY-SA“ kennzeichnen (eigenes Arbeitspaket nach der Klärung).
